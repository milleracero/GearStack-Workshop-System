const RolePermission = require('../models/RolePermission');
const Permission = require('../models/Permission');

module.exports = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Log para depuración (puedes borrarlo después)
            console.log(`Verificando permiso: ${requiredPermission} para el RoleId: ${req.user.roleId}`);

            const hasPermission = await RolePermission.findOne({
                where: { roleId: req.user.roleId },
                include: [{
                    model: Permission,
                    where: { name: requiredPermission }
                }]
            });

            if (!hasPermission) {
                return res.status(403).json({ message: "Accès refusé: Permission insuffisante." });
            }

            next();
        } catch (error) {
            // ESTO ES CLAVE: Imprime el error real en la terminal de IntelliJ
            console.error("ERROR EN ROLE_MIDDLEWARE:", error);
            res.status(500).json({
                message: "Erreur de vérification des permissions.",
                details: error.message // Esto te ayudará a ver qué tabla falta
            });
        }
    };
};