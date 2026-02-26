const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Se mantiene igual porque está un nivel arriba
const User = require('./User');           // Se mantiene igual porque están en la misma carpeta

const Car = sequelize.define('Car', {
    // Primary Key: Unique identifier for each vehicle
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

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
    // Foreign Key: Establishing ownership relation with the User table
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

/**
 * Model Associations
 * Defining the One-to-Many relationship between Users (Clients) and Cars.
 */
Car.belongsTo(User, { foreignKey: 'ownerId' });
User.hasMany(Car, { foreignKey: 'ownerId' });

module.exports = Car;