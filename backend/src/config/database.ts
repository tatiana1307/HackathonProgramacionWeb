import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Concept } from '../entities/Concept';
import { Category } from '../entities/Category';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'postgres', // Usando la base de datos 'postgres' por defecto
  synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Concept, Category],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscriber/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Base de datos PostgreSQL conectada exitosamente');
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Sincronización de esquemas habilitada');
    }
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};
