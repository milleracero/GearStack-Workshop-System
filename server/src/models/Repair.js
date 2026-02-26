const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Car = require('./Car');

const Repair = sequelize.define('Repair', {
    // Primary Key: Unique tracking number for the repair order
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('En cours', 'En attente de pièces', 'Terminé', 'pending', 'in_progress', 'completed'),
        defaultValue: 'En cours'
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    // Foreign Key: Links the repair to a specific vehicle entity
    carId: {
        type: DataTypes.INTEGER,
        allowNull: false

    },
    // Foreign Key: Links the work to the specific staff member (Mechanic)
    mechanicId: {
        type: DataTypes.INTEGER,
        allowNull: true // Permitimos null por si se crea la ficha antes de asignar mecánico
    }
}, {
    tableName: 'repairs',
    timestamps: true
});

module.exports = Repair;