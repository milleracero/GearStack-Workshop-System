const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password, roleId } = req.body;

        // Validation: Prevent duplicate accounts
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "L'utilisateur existe déjà" });
        }

        // Persistence: Create user record
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
        console.error("Critical Error - User Registration:", error);
        res.status(500).json({ message: "Erreur sur le serveur" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Identity verification
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Cryptographic comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        // Token Generation: Embeds identity and permissions (roleId)
        const token = jwt.sign(
            { id: user.id, roleId: user.roleId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                email: user.email,
                roleId: user.roleId
            }
        });
    } catch (error) {
        console.error("Critical Error - User Login:", error);
        res.status(500).json({ message: "Erreur sur le serveur" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'roleId'],
            order: [['id', 'ASC']]
        });
        res.json({ users });
    } catch (error) {
        console.error("Critical Error - Get All Users:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};