const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Tu conexión en francés

const Role = sequelize.define('Role', {
    // - id Int en tu UML
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // - name Varchar en tu UML
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