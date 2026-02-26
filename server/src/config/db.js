const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env' }); // Load environment variables from .env file

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb', // Database dialect specification
        logging: false,     // Disable SQL logging for production-ready terminal output
    }
);

const checkConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à MariaDB établie avec succès.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

checkConnection();

module.exports = sequelize;