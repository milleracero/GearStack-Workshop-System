const Repair = require('../models/Repair');
const Car = require('../models/Car');

// Crear una nueva reparación
exports.createRepair = async (req, res) => {
    try {
        // Extraemos todos los campos necesarios que envía el MechanicDashboard
        const { description, cost, carId, status, mechanicId } = req.body;

        // 1. Verificar si el carro existe
        const car = await Car.findByPk(carId);
        if (!car) {
            return res.status(404).json({ message: "Véhicule non trouvé" });
        }

        // 2. Crear el registro con la información completa
        const newRepair = await Repair.create({
            description,
            cost,
            carId,
            status: status || 'En cours', // Si no viene estatus, por defecto 'En cours'
            mechanicId: mechanicId,       // Vinculación con el mecánico logueado
            date: new Date()
        });

        res.status(201).json({
            message: "Réparation enregistrée avec succès",
            repair: newRepair
        });
    } catch (error) {
        console.error("Erreur creation repair:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement de la réparation" });
    }
};

// Ver reparaciones de un carro específico (Historial para el cliente)
exports.getCarRepairs = async (req, res) => {
    try {
        const { carId } = req.params;

        const repairs = await Repair.findAll({
            where: { carId },
            include: [{
                model: Car,
                as: 'Car', // Sequelize usa el nombre del modelo por defecto si no hay alias
                attributes: ['plate', 'brand', 'model']
            }],
            order: [['createdAt', 'DESC']] // Usamos createdAt que es automático
        });

        // Devolvemos la lista siempre, aunque sea un array vacío []
        res.json(repairs);
    } catch (error) {
        console.error("Erreur récupération repairs:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération" });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await Repair.update({ status }, { where: { id } });

        res.json({ message: "Statut mis à jour avec succès" });
    } catch (error) {
        console.error("🔥 Error updateStatus:", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
};