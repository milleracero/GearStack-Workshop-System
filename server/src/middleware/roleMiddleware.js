const RolePermission = require('../models/RolePermission');
const Permission = require('../models/Permission');

module.exports = (requiredPermission) => {
    return async (req, res, next) => {
        try {

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

            res.status(500).json({
                message: "Erreur de vérification des permissions.",
                error: error.message
            });
        }
    };
};