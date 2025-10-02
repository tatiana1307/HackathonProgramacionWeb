import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../config/database';

// Cargar variables de entorno
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔍 Probando conexión a PostgreSQL...');
    console.log('📋 Configuración:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Puerto: ${process.env.DB_PORT || '5432'}`);
    console.log(`   Usuario: ${process.env.DB_USERNAME || 'postgres'}`);
    console.log(`   Base de datos: ${process.env.DB_NAME || 'postgres'}`);
    console.log('');

    await AppDataSource.initialize();
    console.log('✅ Conexión exitosa a PostgreSQL');
    
    // Probar una consulta simple
    const result = await AppDataSource.query('SELECT version()');
    console.log('📊 Versión de PostgreSQL:', result[0].version);
    
    // Verificar si las tablas existen
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tables.length > 0) {
      console.log('📋 Tablas existentes:');
      tables.forEach((table: any) => {
        console.log(`   - ${table.table_name}`);
      });
    } else {
      console.log('📋 No hay tablas creadas aún');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    console.log('');
    console.log('🔧 Posibles soluciones:');
    console.log('   1. Verificar que PostgreSQL esté ejecutándose');
    console.log('   2. Verificar las credenciales en el archivo .env');
    console.log('   3. Verificar que la base de datos "postgres" exista');
    console.log('   4. Verificar permisos del usuario');
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

testConnection();
