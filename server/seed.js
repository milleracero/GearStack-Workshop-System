const sequelize = require('./src/config/db');
const { Role, User, Permission, RolePermission, Car, Repair } = require('./src/models/associations');

const seed = async () => {
    try {
        // Usamos force: true para limpiar la base de datos y recrear las columnas nuevas
        await sequelize.sync({ force: true });
        console.log('Base de données nettoyée et prête pour le seed.');

        // 1. Crear Roles
        await Role.bulkCreate([
            { id: 1, name: 'admin' },
            { id: 2, name: 'mécanicien' },
            { id: 3, name: 'client' }
        ], { ignoreDuplicates: true });

        // 2. Crear Permisos
        const permissionsData = [
            { id: 1, name: 'MANAGE_USERS' },
            { id: 2, name: 'REGISTER_CAR' },
            { id: 3, name: 'ADD_REPAIR' },
            { id: 4, name: 'VIEW_MY_CARS' }
        ];
        await Permission.bulkCreate(permissionsData, { ignoreDuplicates: true });

        // 3. Vincular Roles y Permisos
        const rolePermissions = [
            { roleId: 1, permissionId: 1 }, { roleId: 1, permissionId: 2 },
            { roleId: 1, permissionId: 3 }, { roleId: 1, permissionId: 4 },
            { roleId: 2, permissionId: 2 }, { roleId: 2, permissionId: 3 },
            { roleId: 2, permissionId: 4 },
            { roleId: 3, permissionId: 4 }
        ];
        await RolePermission.bulkCreate(rolePermissions, { ignoreDuplicates: true });

        // 4. Crear Usuarios enviando la clave en texto plano
        // El hook 'beforeCreate' de User.js se encargará de encriptarlas
        const admin = await User.create({ email: 'admin@gear.com', password: '123456', roleId: 1 });
        const mecanico = await User.create({ email: 'mecanicien@gear.com', password: '123456', roleId: 2 });
        const client1 = await User.create({ email: 'jean.dupont@email.com', password: '123456', roleId: 3 });
        const client2 = await User.create({ email: 'marie.curie@email.com', password: '123456', roleId: 3 });

        // 5. Crear Vehículos de prueba
        const car1 = await Car.create({ plate: 'ABC-123', brand: 'Toyota', model: 'Corolla 2024', ownerId: client1.id });
        const car2 = await Car.create({ plate: 'GEAR-2026', brand: 'Ford', model: 'Mustang', ownerId: client1.id });
        const car3 = await Car.create({ plate: 'GSTACK-2026', brand: 'Mazda', model: 'CX-5', ownerId: client2.id });

        // 6. Crear Reparaciones iniciales (Intervenciones)
        await Repair.create({
            description: "Vidange d'huile synthétique et filtre",
            status: 'Terminé',
            cost: 95.00,
            carId: car1.id,
            mechanicId: mecanico.id
        });

        await Repair.create({
            description: "Remplacement des plaquettes de frein avant",
            status: 'En cours',
            cost: 150.50,
            carId: car3.id,
            mechanicId: mecanico.id
        });

        console.log('✅ Seed terminé avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        process.exit(1);
    }
};

seed();