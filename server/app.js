require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <--- 1. Importar cors
const sequelize = require('./src/config/db');

require('./src/models/associations');

const authRoutes = require('./src/routes/authRoutes');
const carRoutes = require('./src/routes/carRoutes');
const repairRoutes = require('./src/routes/repairRoutes');

const app = express();

// 2. CONFIGURAR CORS (Debe ir antes de las rutas)
app.use(cors({
    origin: 'http://localhost:5173', // Permitir tu aplicación React
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// 3. RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/repairs', repairRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route non trouvée. Vérifiez l'URL et la méthode (GET/POST)." });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        console.log('Intentando sincronizar tablas...');
        await sequelize.sync({ force: false });
        console.log('Base de donnees synchronisee con succes.');

        app.listen(PORT, () => {
            console.log(`Serveur en cours d'execution sur le port ${PORT}`);
        });
    } catch (error) {
        console.error('Erreur lors du demarrage du serveur:', error);
        process.exit(1);
    }
};

startServer();