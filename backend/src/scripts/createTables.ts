import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Category } from '../entities/Category';
import { Concept } from '../entities/Concept';

// Cargar variables de entorno
dotenv.config();

const createTables = async () => {
  try {
    console.log('🔍 Conectando a PostgreSQL...');
    await AppDataSource.initialize();
    console.log('✅ Conexión establecida');

    console.log('📋 Creando tablas...');
    
    // Crear tablas usando TypeORM
    await AppDataSource.synchronize(true);
    
    console.log('✅ Tablas creadas exitosamente');
    
    // Verificar las tablas creadas
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Tablas en la base de datos:');
    tables.forEach((table: any) => {
      console.log(`   ✓ ${table.table_name}`);
    });
    
    // Mostrar estructura de cada tabla
    console.log('\n📋 Estructura de las tablas:');
    
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`\n🔹 Tabla: ${tableName}`);
      
      const columns = await AppDataSource.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [tableName]);
      
      columns.forEach((col: any) => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`   • ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`);
      });
    }
    
    console.log('\n🎉 Proceso completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error al crear tablas:', error);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verificar que PostgreSQL esté ejecutándose');
    console.log('   2. Verificar las credenciales en el archivo .env');
    console.log('   3. Verificar permisos del usuario postgres');
    console.log('   4. Ejecutar: npm run test-db (para probar conexión)');
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Conexión cerrada');
    }
  }
};

createTables();
