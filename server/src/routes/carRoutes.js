const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/authMiddleware');

// --- 1. STATIC ROUTES --
router.get('/all', auth, carController.getAllCars);
router.get('/interventions', auth, carController.getMechanicInterventions);

// --- 2. DYNAMIC ROUTES
router.get('/owner/:ownerId', auth, carController.getCarsByOwner);
router.get('/plate/:plate', auth, carController.getCarByPlate);

// --- 3. POST / CREATION ROUTES ---
router.post('/', auth, carController.createCar);

module.exports = router;