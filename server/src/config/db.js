const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env' });// Carga las variables de entorno desde el archivo .env

// Configuración de la conexión utilizando las variables de entorno
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb', // Definimos MariaDB como el dialecto de la base de datos
        logging: false,     // Desactivamos los logs de SQL en la consola para mantenerla limpia
    }
);

// Función para verificar la conexión con el servidor
const checkConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion a MariaDB etablie con succes.');
    } catch (error) {
        console.error('Impossible de se connecter a la base de datos:', error);
    }
};

checkConnection();

module.exports = sequelize;