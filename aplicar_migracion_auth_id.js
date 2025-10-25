/**
 * SCRIPT DE MIGRACIÓN PARA SISTEMA AUTH_ID
 * ========================================
 * 
 * Este script aplica la migración necesaria para implementar
 * la identificación de jugadores por auth_id
 */

const fs = require('fs');
const path = require('path');
const { executeQuery, testConnection, closePool } = require('./config/database');

async function aplicarMigracion() {
    console.log('🔄 Iniciando migración para sistema auth_id...\n');
    
    try {
        // Verificar conexión
        console.log('🔍 Verificando conexión a la base de datos...');
        const connectionOk = await testConnection();
        
        if (!connectionOk) {
            throw new Error('No se pudo establecer conexión con la base de datos');
        }
        
        console.log('\n🗂️ Aplicando cambios de migración...\n');
        
        // Paso 1: Añadir campo auth_id
        try {
            console.log('1️⃣ Añadiendo campo auth_id...');
            await executeQuery(`
                ALTER TABLE jugadores 
                ADD COLUMN auth_id VARCHAR(255) NULL 
                COMMENT 'Auth ID único de HaxBall para identificar jugadores' 
                AFTER nombre
            `);
            console.log('✅ Campo auth_id añadido');
        } catch (error) {
            if (error.message.includes('Duplicate column name')) {
                console.log('⚠️ Campo auth_id ya existe, continuando...');
            } else {
                throw error;
            }
        }
        
        // Paso 2: Crear índice para auth_id
        try {
            console.log('2️⃣ Creando índice para auth_id...');
            await executeQuery('CREATE INDEX idx_auth_id ON jugadores(auth_id)');
            console.log('✅ Índice auth_id creado');
        } catch (error) {
            if (error.message.includes('Duplicate key name')) {
                console.log('⚠️ Índice idx_auth_id ya existe, continuando...');
            } else {
                throw error;
            }
        }
        
        // Paso 3: Añadir campo nombre_display
        try {
            console.log('3️⃣ Añadiendo campo nombre_display...');
            await executeQuery(`
                ALTER TABLE jugadores 
                ADD COLUMN nombre_display VARCHAR(100) NULL 
                COMMENT 'Nombre para mostrar (puede cambiar)' 
                AFTER auth_id
            `);
            console.log('✅ Campo nombre_display añadido');
        } catch (error) {
            if (error.message.includes('Duplicate column name')) {
                console.log('⚠️ Campo nombre_display ya existe, continuando...');
            } else {
                throw error;
            }
        }
        
        // Paso 4: Crear tabla de historial de nombres
        console.log('4️⃣ Creando tabla de historial de nombres...');
        await executeQuery(`
            CREATE TABLE IF NOT EXISTS jugador_nombres_historial (
                id INT PRIMARY KEY AUTO_INCREMENT,
                auth_id VARCHAR(255) NOT NULL COMMENT 'Auth ID del jugador',
                nombre VARCHAR(100) NOT NULL COMMENT 'Nombre usado',
                primera_vez_usado DATETIME NOT NULL COMMENT 'Primera vez que usó este nombre',
                ultima_vez_usado DATETIME NOT NULL COMMENT 'Última vez que usó este nombre',
                veces_usado INT DEFAULT 1 COMMENT 'Cuántas veces usó este nombre',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                
                INDEX idx_auth_id (auth_id),
                INDEX idx_nombre (nombre),
                INDEX idx_ultima_vez_usado (ultima_vez_usado),
                UNIQUE KEY unique_auth_nombre (auth_id, nombre)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            COMMENT='Historial de nombres usados por cada jugador identificado por auth_id'
        `);
        console.log('✅ Tabla jugador_nombres_historial creada');
        
        // Paso 5: Poblar nombre_display con nombres existentes
        console.log('5️⃣ Poblando nombre_display para jugadores existentes...');
        const result = await executeQuery(`
            UPDATE jugadores 
            SET nombre_display = nombre 
            WHERE nombre_display IS NULL
        `);
        console.log(`✅ ${result.affectedRows} jugadores actualizados con nombre_display`);
        
        // Paso 6: Crear vista optimizada
        console.log('6️⃣ Creando vista optimizada...');
        await executeQuery(`
            CREATE OR REPLACE VIEW vista_jugadores_completa AS
            SELECT 
                j.*,
                COALESCE(j.nombre_display, j.nombre) as nombre_mostrar,
                CASE 
                    WHEN j.auth_id IS NOT NULL THEN 'auth'
                    ELSE 'nombre'
                END as tipo_identificacion
            FROM jugadores j
        `);
        console.log('✅ Vista vista_jugadores_completa creada');
        
        // Verificar migración
        console.log('\n🔍 Verificando migración...');
        const verificacion = await executeQuery(`
            SELECT 
                COUNT(*) as total_jugadores,
                COUNT(auth_id) as jugadores_con_auth,
                COUNT(nombre_display) as jugadores_con_nombre_display
            FROM jugadores
        `);
        
        const stats = verificacion[0];
        console.log('\n📊 Estado de la migración:');
        console.log(`   Total jugadores: ${stats.total_jugadores}`);
        console.log(`   Con auth_id: ${stats.jugadores_con_auth}`);
        console.log(`   Con nombre_display: ${stats.jugadores_con_nombre_display}`);
        
        console.log('\n✅ ¡Migración completada exitosamente!');
        console.log('\n🎯 Siguiente paso: El sistema ahora puede identificar jugadores por auth_id');
        console.log('   Los jugadores nuevos serán identificados por auth_id automáticamente');
        console.log('   Los jugadores existentes seguirán funcionando por nombre hasta que se conecten nuevamente');
        
    } catch (error) {
        console.error('\n❌ Error durante la migración:', error.message);
        console.error('📋 Stack trace:', error.stack);
        process.exit(1);
    } finally {
        await closePool();
    }
}

// Ejecutar migración
aplicarMigracion();
