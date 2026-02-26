const Car = require('../models/Car');
const User = require('../models/User');
const Repair = require('../models/Repair');

// Registrar un nuevo vehículo
exports.createCar = async (req, res) => {
    try {
        const { plate, brand, model } = req.body;

        // Log para depuración en la terminal de IntelliJ
        console.log("Token decodificado (req.user):", req.user);

        // Ajuste de seguridad:
        // Si el roleId es 2 (Cliente), forzamos su propio ID.
        // Si no es 2 (Mecánico/Admin), permitimos que use el ownerId del body.
        let ownerId;
        if (req.user.roleId === 2) {
            ownerId = req.user.id;
            console.log(`🛡️ Seguridad: Cliente detectado. Asignando ID: ${ownerId}`);
        } else {
            ownerId = req.body.ownerId || req.user.id;
            console.log(`🛠️ Taller: Asignando Owner ID manual: ${ownerId}`);
        }

        if (!ownerId) {
            return res.status(400).json({ message: "ID du propriétaire manquant" });
        }

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
        console.error("🔥 Error createCar:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement du véhicule" });
    }
};

// Obtener todos los carros (Admin/Mecánico)
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
        console.error("🔥 Error getAllCars:", error);
        res.status(500).json({ message: "Erreur lors de la recuperación des véhicules" });
    }
};

// Buscar carro por placa
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
        console.error("🔥 ERROR DETALLADO EN BUSQUEDA:", error);
        res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
};

// ✅ OBTENER CARROS POR DUEÑO (Con validación de privacidad)
exports.getCarsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const parsedOwnerId = parseInt(ownerId);

        // 1. Validación básica de formato
        if (isNaN(parsedOwnerId)) {
            return res.status(400).json({ message: "ID de propriétaire invalide" });
        }

        // 2. 🛡️ SEGURIDAD DINÁMICA:
        // Si el usuario logueado es un CLIENTE (roleId: 2)
        // Y está intentando ver carros de OTRO ID que no es el suyo...
        if (req.user.roleId === 2 && parsedOwnerId !== req.user.id) {
            console.warn(`🚨 Tentative d'accès non autorisé par l'utilisateur ${req.user.id} aux véhicules de l'ID ${parsedOwnerId}`);
            return res.status(403).json({
                message: "Accès refusé: Vous ne pouvez consulter que vos propres véhicules."
            });
        }

        // 3. Búsqueda en la base de datos
        const cars = await Car.findAll({
            where: { ownerId: parsedOwnerId },
            order: [['id', 'DESC']]
        });

        console.log(`✅ ${cars.length} véhicules trouvés pour l'owner ${parsedOwnerId}`);
        res.json(cars);

    } catch (error) {
        console.error("🔥 Error crítico en getCarsByOwner:", error.message);
        res.status(500).json({
            message: "Erreur lors de la récupération des véhicules",
            error: error.message
        });
    }
};

// Obtener intervenciones del mecánico logueado
exports.getMechanicInterventions = async (req, res) => {
    try {
        const mechanicId = req.user.id;

        const cars = await Car.findAll({
            include: [{
                model: Repair,
                as: 'repairs',
                where: { mechanicId: mechanicId },
                // ✅ AGREGAMOS 'id' AQUÍ PARA QUE EL FRONTEND TENGA LA REFERENCIA
                attributes: ['id', 'description', 'status', 'cost', 'updatedAt']
            }],
            // Ordenamos por el ID de la reparación para evitar errores de columna temporal
            order: [[{ model: Repair, as: 'repairs' }, 'id', 'DESC']]
        });

        res.json(cars || []);
    } catch (error) {
        console.error("🔥 Error detalle interventions:", error.message);
        res.status(500).json({
            message: "Erreur lors de la récupération des interventions",
            error: error.message
        });
    }
};