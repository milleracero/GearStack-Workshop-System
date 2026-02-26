const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Se conecta correctamente subiendo un nivel

const Permission = sequelize.define('Permission', {
    // Primary Key: Unique ID for the permission record (e.g., 1, 2, 3...)
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'permissions',
    timestamps: false
});

module.exports = Permission;