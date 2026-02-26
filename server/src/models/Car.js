const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Se mantiene igual porque está un nivel arriba
const User = require('./User');           // Se mantiene igual porque están en la misma carpeta

const Car = sequelize.define('Car', {
    // Corresponde a id: Int en tu UML
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Corresponde a plate: Varchar en tu UML
    plate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Relación con el dueño (User)
    ownerId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    tableName: 'cars',
    timestamps: false
});

// Definición de Relaciones (Asociaciones)
Car.belongsTo(User, { foreignKey: 'ownerId' });
User.hasMany(Car, { foreignKey: 'ownerId' });

module.exports = Car;