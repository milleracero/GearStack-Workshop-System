const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Método para registrar un nuevo usuario (Clientes o Mecánicos)
exports.register = async (req, res) => {
    try {
        const { email, password, roleId } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        // Simplemente creamos el usuario.
        // El modelo User.js encriptará la 'password' automáticamente
        const newUser = await User.create({ email, password, roleId });

        res.status(201).json({
            message: "Utilisateur créé avec succès",
            user: {
                id: newUser.id,
                email: newUser.email,
                roleId: newUser.roleId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur sur le serveur" });
    }
};

// Método para hacer Login (Se mantiene igual, comparando con bcrypt)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouve" });
        }

        // Comparamos el texto plano del login con el hash de la DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ id: user.id, roleId: user.roleId }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({
            message: "Connexion reussie",
            token,
            user: {
                id: user.id,
                email: user.email,
                roleId: user.roleId
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur sur le serveur" });
    }
};

// Obtener todos los usuarios para la tabla del Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'roleId'],
            order: [['id', 'ASC']]
        });
        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};