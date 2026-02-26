const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const auth = require('../middleware/authMiddleware');
const checkPerm = require('../middleware/roleMiddleware');

// Ruta para registro (Clientes y creación de mecánicos por Admin)
router.post('/register', authController.register);

// Ruta para login
router.post('/login', authController.login);

// RUTA REAL PARA EL DASHBOARD:
// El middleware 'auth' verifica el token y 'checkPerm' asegura que solo el Admin entre
router.get('/users-list', auth, checkPerm('MANAGE_USERS'), authController.getAllUsers);

module.exports = router;