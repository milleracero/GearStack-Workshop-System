const Car = require('../models/Car');
const User = require('../models/User');
const Repair = require('../models/Repair');

// Register a new vehicle
exports.createCar = async (req, res) => {
    try {
        const { plate, brand, model } = req.body;
        let ownerId;
        if (req.user.roleId === 2) {
            ownerId = req.user.id;
        } else {
            ownerId = req.body.ownerId || req.user.id;
        }

        if (!ownerId) {
            return res.status(400).json({ message: "ID du propriétaire manquant" });
        }

        // Check for existing license plate to prevent duplicates
        const carExists = await Car.findOne({ where: { plate: plate.trim().toUpperCase() } });
        if (carExists) {
            return res.status(400).json({ message: "Ce véhicule est déjà enregistré (Plaque existe)" });
        }

        const newCar = await Car.create({
            plate: plate.trim().toUpperCase(),
            brand,
            model,
            ownerId: parseInt(ownerId)
        });

        res.status(201).json({ message: "Véhicule enregistré avec succès", car: newCar });
    } catch (error) {
        console.error("Critical Error - Create Car:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement du véhicule" });
    }
};

// Fetch all vehicles (Admin/Mechanic access)
exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.findAll({
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'email']
            }]
        });
        res.json(cars);
    } catch (error) {
        console.error("Critical Error - Get All Cars:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des véhicules" });
    }
};

// Search vehicle by license plate
exports.getCarByPlate = async (req, res) => {
    try {
        const { plate } = req.params;
        const plateUpper = plate.trim().toUpperCase();

        const car = await Car.findOne({
            where: { plate: plateUpper },
            include: [{
                model: User,
                as: 'owner',
                attributes: ['id', 'email']
            }]
        });

        if (!car) {
            return res.status(404).json({ message: "Véhicule non trouvé" });
        }

        res.json(car);
    } catch (error) {
        console.error("Critical Error - Get Car By Plate:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Fetch vehicles by owner with privacy validation
exports.getCarsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const parsedOwnerId = parseInt(ownerId);

        if (isNaN(parsedOwnerId)) {
            return res.status(400).json({ message: "ID de propriétaire invalide" });
        }

        if (req.user.roleId === 2 && parsedOwnerId !== req.user.id) {
            return res.status(403).json({
                message: "Accès refusé: Vous ne pouvez consulter que vos propres véhicules."
            });
        }

        const cars = await Car.findAll({
            where: { ownerId: parsedOwnerId },
            order: [['id', 'DESC']]
        });

        res.json(cars);

    } catch (error) {
        console.error("Critical Error - Get Cars By Owner:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des véhicules" });
    }
};

// Fetch interventions assigned to the logged-in mechanic
exports.getMechanicInterventions = async (req, res) => {
    try {
        const mechanicId = req.user.id;

        const cars = await Car.findAll({
            include: [{
                model: Repair,
                as: 'repairs',
                where: { mechanicId: mechanicId },
                attributes: ['id', 'description', 'status', 'cost', 'updatedAt']
            }],
            order: [[{ model: Repair, as: 'repairs' }, 'id', 'DESC']]
        });

        res.json(cars || []);
    } catch (error) {
        console.error("Critical Error - Get Mechanic Interventions:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des interventions" });
    }
};