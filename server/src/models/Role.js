const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Tu conexión en francés

const Role = sequelize.define('Role', {
    // Primary Key: Corresponds to id: Int
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
    tableName: 'roles',
    timestamps: false
});

module.exports = Role;