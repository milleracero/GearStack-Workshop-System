const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Se conecta correctamente subiendo un nivel

const Permission = sequelize.define('Permission', {
    // - id: Int en tu UML
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // - name: Varchar en tu UML
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'permissions',
    timestamps: false // No necesitamos createdAt/updatedAt para los nombres de permisos
});

module.exports = Permission;