const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }


    const token = authHeader.split(' ')[1];

    try {

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardamos los datos del usuario en la petición
        next();
    } catch (error) {
        res.status(400).json({ message: "Token invalide." });
    }
};