const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/authMiddleware');

// --- 1. RUTAS ESTÁTICAS (Sin parámetros con dos puntos) ---
router.get('/all', auth, carController.getAllCars);
router.get('/interventions', auth, carController.getMechanicInterventions);

// --- 2. RUTAS DINÁMICAS (Con parámetros :id o :plate) ---
router.get('/owner/:ownerId', auth, carController.getCarsByOwner);
router.get('/plate/:plate', auth, carController.getCarByPlate);

// --- 3. RUTAS DE CREACIÓN/POST ---
router.post('/', auth, carController.createCar);

module.exports = router;