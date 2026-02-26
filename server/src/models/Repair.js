const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Car = require('./Car');

const Repair = sequelize.define('Repair', {
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
        // Ajustamos los ENUM para que coincidan con los que usas en el Frontend (en francés/inglés técnico)
        type: DataTypes.ENUM('En cours', 'En attente de pièces', 'Terminé', 'pending', 'in_progress', 'completed'),
        defaultValue: 'En cours'
    },
    cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    carId: {
        type: DataTypes.INTEGER,
        allowNull: false
        // No es estrictamente necesario poner 'references' aquí si ya está en associations.js
    },
    // NUEVO: Campo para vincular al mecánico que realiza el trabajo
    mechanicId: {
        type: DataTypes.INTEGER,
        allowNull: true // Permitimos null por si se crea la ficha antes de asignar mecánico
    }
}, {
    tableName: 'repairs',
    timestamps: true
});

// NOTA: Hemos eliminado las relaciones de aquí porque ya las tienes en src/models/associations.js
// Esto evita conflictos de "Doble Definición" en Sequelize.

module.exports = Repair;