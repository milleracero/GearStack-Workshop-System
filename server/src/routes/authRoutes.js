const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const auth = require('../middleware/authMiddleware');
const checkPerm = require('../middleware/roleMiddleware');

// 1. PUBLIC ROUTES
router.post('/register', authController.register);

// Endpoint for user authentication
router.post('/login', authController.login);

// 2. PROTECTED ADMIN ROUTES
router.get('/users-list', auth, checkPerm('MANAGE_USERS'), authController.getAllUsers);

module.exports = router;