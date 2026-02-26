const Role = require('./Role');
const User = require('./User');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const Car = require('./Car');
const Repair = require('./Repair');

// 1. Relaciones de Usuario y Rol
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// 2. Relaciones de Permisos (RBAC)
Role.hasMany(RolePermission, { foreignKey: 'roleId' });
RolePermission.belongsTo(Role, { foreignKey: 'roleId' });
Permission.hasMany(RolePermission, { foreignKey: 'permissionId' });
RolePermission.belongsTo(Permission, { foreignKey: 'permissionId' });

// 3. Relaciones de Carros y Dueños (Clientes)
User.hasMany(Car, { foreignKey: 'ownerId', as: 'vehicles' });
Car.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// 4. Relaciones de Carros y Reparaciones
Car.hasMany(Repair, { foreignKey: 'carId', as: 'repairs' });
Repair.belongsTo(Car, { foreignKey: 'carId' });

// 5. NUEVA: Relación para el Mecánico (Intervenciones)
// Esto permite que un User (con rol mecánico) tenga muchas reparaciones asociadas
User.hasMany(Repair, { foreignKey: 'mechanicId', as: 'interventions' });
Repair.belongsTo(User, { foreignKey: 'mechanicId', as: 'mechanic' });

module.exports = { Role, User, Permission, RolePermission, Car, Repair };