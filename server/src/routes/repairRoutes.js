const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');
const auth = require('../middleware/authMiddleware');
router.put('/:id/status', auth, repairController.updateStatus);

// Ver reparaciones de un carro específico
router.get('/car/:carId', auth, repairController.getCarRepairs);

// Crear una nueva reparación
// Cambiamos '/add' por '/' para que coincida con el api.post('/repairs', ...) del frontend
router.post('/', auth, repairController.createRepair);

module.exports = router;