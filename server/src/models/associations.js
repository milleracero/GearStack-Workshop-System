const Role = require('./Role');
const User = require('./User');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const Car = require('./Car');
const Repair = require('./Repair');

// --- 1. User and Role Associations
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// --- 2. Permissions Logic
Role.hasMany(RolePermission, { foreignKey: 'roleId' });
RolePermission.belongsTo(Role, { foreignKey: 'roleId' });
Permission.hasMany(RolePermission, { foreignKey: 'permissionId' });
RolePermission.belongsTo(Permission, { foreignKey: 'permissionId' });

// --- 3. Vehicle Ownership
User.hasMany(Car, { foreignKey: 'ownerId', as: 'vehicles' });
Car.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// --- 4. Vehicle Maintenance
Car.hasMany(Repair, { foreignKey: 'carId', as: 'repairs' });
Repair.belongsTo(Car, { foreignKey: 'carId' });

// --- 5. Mechanic Workload
User.hasMany(Repair, { foreignKey: 'mechanicId', as: 'interventions' });
Repair.belongsTo(User, { foreignKey: 'mechanicId', as: 'mechanic' });

module.exports = { Role, User, Permission, RolePermission, Car, Repair };