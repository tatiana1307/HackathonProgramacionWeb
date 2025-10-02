import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';
import { User, UserRole } from '../entities/User';

const seedCategories = async () => {
  const categoryRepository = AppDataSource.getRepository(Category);

  const categories = [
    {
      nombre: 'Estructuras de Datos',
      descripcion: 'Arrays, listas, pilas, colas, árboles y grafos',
      color: '#a8c8ec',
      icon: '📊',
    },
    {
      nombre: 'Bases de Datos',
      descripcion: 'Modelado, SQL, NoSQL y administración',
      color: '#b8a9d9',
      icon: '🗄️',
    },
    {
      nombre: 'Ingeniería de Software',
      descripcion: 'Metodologías, patrones y arquitectura',
      color: '#ffdfba',
      icon: '⚙️',
    },
    {
      nombre: 'Sistemas Operativos',
      descripcion: 'Procesos, memoria, archivos y concurrencia',
      color: '#bae1ff',
      icon: '💻',
    },
  ];

  for (const categoryData of categories) {
    const existingCategory = await categoryRepository.findOne({
      where: { nombre: categoryData.nombre },
    });

    if (!existingCategory) {
      const category = categoryRepository.create(categoryData);
      await categoryRepository.save(category);
      console.log(`✅ Categoría creada: ${categoryData.nombre}`);
    } else {
      console.log(`⚠️ Categoría ya existe: ${categoryData.nombre}`);
    }
  }
};

const seedAdminUser = async () => {
  const userRepository = AppDataSource.getRepository(User);

  const adminData = {
    nombre: 'Administrador',
    email: 'admin@biblioteca.com',
    telefono: '3001234567',
    password: 'Admin123!',
    role: UserRole.ADMIN,
  };

  const existingAdmin = await userRepository.findOne({
    where: { email: adminData.email },
  });

  if (!existingAdmin) {
    const admin = userRepository.create(adminData);
    await userRepository.save(admin);
    console.log('✅ Usuario administrador creado');
  } else {
    console.log('⚠️ Usuario administrador ya existe');
  }
};

const seedData = async () => {
  try {
    await AppDataSource.initialize();
    console.log('🗄️ Conectado a PostgreSQL');

    await seedCategories();
    await seedAdminUser();

    console.log('🎉 Datos iniciales creados exitosamente');
  } catch (error) {
    console.error('❌ Error al crear datos iniciales:', error);
  } finally {
    await AppDataSource.destroy();
  }
};

seedData();
