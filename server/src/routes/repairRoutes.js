const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');
const auth = require('../middleware/authMiddleware');

// --- 1. UPDATE ROUTES ---
router.put('/:id/status', auth, repairController.updateStatus);

// --- 2. RETRIEVAL ROUTES ---
router.get('/car/:carId', auth, repairController.getCarRepairs);

// --- 3. CREATION ROUTES ---
router.post('/', auth, repairController.createRepair);

module.exports = router;