/**
 * CONFIGURACIÓN DE BASE DE DATOS MYSQL
 * ====================================
 * 
 * Configuración centralizada para la conexión a MySQL
 * Incluye pool de conexiones para mejor rendimiento
 */

const mysql = require('mysql2/promise');

// Configuración base de conexión (sin opciones específicas del pool)
const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'lnb_user',
    password: process.env.DB_PASSWORD || 'lnb_password',
    database: process.env.DB_NAME || 'lnb_estadisticas',
    
    // Configuraciones específicas de MySQL2 (válidas para conexiones)
    charset: 'utf8mb4',
    timezone: '+00:00', // UTC timezone format
    dateStrings: false,
    supportBigNumbers: true,
    bigNumberStrings: false,
    typeCast: true,
    multipleStatements: false,
};

// Configuración del pool (solo opciones válidas para evitar warnings)
const poolConfig = {
    ...connectionConfig,
    
    // Configuraciones específicas del pool de conexiones
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    
    // Removemos acquireTimeout y timeout para evitar warnings
    // Estas opciones causan warnings en mysql2 v3.x
    // acquireTimeout: 60000,
    // timeout: 60000,
};

// Para compatibilidad con código existente
const dbConfig = connectionConfig;

// Crear pool de conexiones
const pool = mysql.createPool(poolConfig);

// Función para obtener conexión del pool
async function getConnection() {
    try {
        return await pool.getConnection();
    } catch (error) {
        console.error('❌ Error obteniendo conexión MySQL:', error.message);
        throw error;
    }
}

// Función para ejecutar queries con manejo de errores
async function executeQuery(query, params = []) {
    const connection = await getConnection();
    try {
        const [results] = await connection.execute(query, params);
        return results;
    } catch (error) {
        console.error('❌ Error ejecutando query:', error.message);
        console.error('📝 Query:', query);
        console.error('📊 Parámetros:', params);
        throw error;
    } finally {
        connection.release();
    }
}

// Función para ejecutar múltiples queries en una transacción
async function executeTransaction(queries) {
    const connection = await getConnection();
    try {
        await connection.beginTransaction();
        
        const results = [];
        for (const { query, params } of queries) {
            const [result] = await connection.execute(query, params || []);
            results.push(result);
        }
        
        await connection.commit();
        return results;
    } catch (error) {
        await connection.rollback();
        console.error('❌ Error en transacción MySQL:', error.message);
        throw error;
    } finally {
        connection.release();
    }
}

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await getConnection();
        console.log('✅ Conexión a MySQL establecida correctamente');
        console.log(`📊 Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`🏷️  Base de datos: ${dbConfig.database}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
        console.error('🔧 Configuración:');
        console.error(`   Host: ${dbConfig.host}:${dbConfig.port}`);
        console.error(`   Usuario: ${dbConfig.user}`);
        console.error(`   Base de datos: ${dbConfig.database}`);
        console.error('💡 Verifica que MySQL esté ejecutándose y las credenciales sean correctas');
        return false;
    }
}

// Función para cerrar todas las conexiones del pool
async function closePool() {
    try {
        await pool.end();
        console.log('✅ Pool de conexiones MySQL cerrado correctamente');
    } catch (error) {
        console.error('❌ Error cerrando pool MySQL:', error.message);
    }
}

module.exports = {
    pool,
    getConnection,
    executeQuery,
    executeTransaction,
    testConnection,
    closePool,
    dbConfig
};
