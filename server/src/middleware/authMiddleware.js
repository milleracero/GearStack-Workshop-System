const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Obtener el token del header 'Authorization'
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    // El formato suele ser "Bearer TOKEN", así que quitamos la palabra "Bearer "
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verificar el token con nuestra clave secreta
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardamos los datos del usuario en la petición
        next(); // ¡Pasa el guardia! Va al controlador.
    } catch (error) {
        res.status(400).json({ message: "Token invalide." });
    }
};