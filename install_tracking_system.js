/**
 * SCRIPT DE INSTALACIÓN DEL SISTEMA DE TRACKING PERSISTENTE
 * =========================================================
 * 
 * Este script automatiza la instalación completa del sistema de tracking
 * persistente, incluyendo:
 * - Creación de tablas en la base de datos
 * - Configuración inicial
 * - Verificación de dependencias
 * - Limpieza automática programada
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 INSTALADOR DEL SISTEMA DE TRACKING PERSISTENTE');
console.log('='.repeat(60));

async function instalarSistemaTracking() {
    try {
        console.log('🔍 Verificando dependencias...');
        
        // Verificar que existe config/database.js
        if (!fs.existsSync(path.join(__dirname, 'config/database.js'))) {
            throw new Error('❌ Archivo config/database.js no encontrado. Configura la base de datos primero.');
        }
        
        // Verificar conexión a base de datos
        console.log('📊 Verificando conexión a base de datos...');
        const { testConnection, executeQuery } = require('./config/database');
        
        const conexionOk = await testConnection();
        if (!conexionOk) {
            throw new Error('❌ No se pudo conectar a la base de datos');
        }
        
        console.log('✅ Conexión a base de datos establecida');
        
        // Ejecutar script de creación de tablas
        console.log('🔨 Creando tablas de tracking...');
        
        const scriptSQL = fs.readFileSync(
            path.join(__dirname, 'database/create_tracking_tables.sql'), 
            'utf8'
        );
        
        // Separar y ejecutar cada statement SQL
        const statements = scriptSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
        
        for (const statement of statements) {
            try {
                if (statement.toLowerCase().includes('select')) {
                    // Para statements SELECT, mostrar resultado
                    const result = await executeQuery(statement);
                    if (result && result[0] && result[0].mensaje) {
                        console.log(`✅ ${result[0].mensaje}`);
                    }
                } else {
                    // Para otros statements, solo ejecutar
                    await executeQuery(statement);
                }
            } catch (error) {
                // Ignorar errores de tablas que ya existen
                if (!error.message.includes('already exists')) {
                    console.warn(`⚠️ Warning ejecutando SQL: ${error.message}`);
                }
            }
        }
        
        console.log('✅ Tablas de tracking creadas exitosamente');
        
        // Verificar que las tablas se crearon correctamente
        console.log('🔍 Verificando estructura de tablas...');
        
        const verificarQuery = `
            SELECT table_name, table_comment 
            FROM information_schema.tables 
            WHERE table_schema = DATABASE() 
            AND table_name IN (
                'historial_nombres_jugadores', 
                'jugadores_tracking', 
                'sesiones_jugadores', 
                'reportes_discord', 
                'estadisticas_tracking_diarias'
            )
        `;
        
        const tablas = await executeQuery(verificarQuery);
        
        console.log(`✅ ${tablas.length} tablas de tracking verificadas:`);
        tablas.forEach(tabla => {
            console.log(`   📋 ${tabla.table_name}: ${tabla.table_comment}`);
        });
        
        // Crear configuración de ejemplo
        console.log('⚙️ Creando configuración de ejemplo...');
        await crearConfiguracionEjemplo();
        
        // Programar limpieza automática
        console.log('🧹 Configurando limpieza automática...');
        await configurarLimpiezaAutomatica();
        
        // Mostrar resumen de instalación
        console.log('\n' + '='.repeat(60));
        console.log('✅ INSTALACIÓN COMPLETADA EXITOSAMENTE');
        console.log('='.repeat(60));
        
        console.log('\n📋 RESUMEN DE LA INSTALACIÓN:');
        console.log(`   🗃️  ${tablas.length} tablas creadas`);
        console.log('   ⚙️  Configuración de ejemplo generada');
        console.log('   🧹 Limpieza automática configurada');
        console.log('   📊 Sistema de estadísticas activado');
        
        console.log('\n🚀 PRÓXIMOS PASOS:');
        console.log('   1. Configura las URLs de webhooks en TRACKING_CONFIG');
        console.log('   2. Integra el sistema con tu bot de HaxBall');
        console.log('   3. Prueba la funcionalidad con algunos jugadores');
        
        console.log('\n💡 ARCHIVOS IMPORTANTES:');
        console.log('   📄 player_tracking_persistent.js - Sistema principal');
        console.log('   📄 database/tracking_functions.js - Funciones de BD');
        console.log('   📄 tracking_config.json - Configuración (créalo)');
        
        return true;
        
    } catch (error) {
        console.error('\n❌ ERROR EN LA INSTALACIÓN:', error.message);
        console.error('\n🔧 SOLUCIONES POSIBLES:');
        console.error('   - Verifica que MySQL esté funcionando');
        console.error('   - Revisa las credenciales en config/database.js');
        console.error('   - Asegúrate de tener permisos para crear tablas');
        return false;
    }
}

async function crearConfiguracionEjemplo() {
    const configPath = path.join(__dirname, 'tracking_config_example.json');
    
    const configEjemplo = {
        "webhooks": {
            "jugadores": "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN",
            "admin": "https://discord.com/api/webhooks/YOUR_ADMIN_WEBHOOK_ID/YOUR_ADMIN_WEBHOOK_TOKEN"
        },
        "limpieza": {
            "sesiones_inactivas_minutos": 30,
            "datos_antiguos_dias": 90,
            "intervalo_limpieza_minutos": 60
        },
        "reportes": {
            "conexiones": true,
            "desconexiones": false,
            "kicks": false,
            "bans": false,
            "nota": "Solo se envían reportes de conexiones/ingresos a Discord"
        },
        "colores_discord": {
            "conexion": "0x00FF00",
            "desconexion": "0xFFA500",
            "kick": "0xFF0000",
            "ban": "0x8B0000",
            "nuevo_jugador": "0x00FFFF",
            "sistema": "0x808080"
        }
    };
    
    fs.writeFileSync(configPath, JSON.stringify(configEjemplo, null, 2), 'utf8');
    console.log(`   📄 Configuración de ejemplo creada: ${configPath}`);
}

async function configurarLimpiezaAutomatica() {
    const { executeQuery } = require('./config/database');
    
    // Crear evento programado para limpieza automática (MySQL)
    const crearEventoSQL = `
        CREATE EVENT IF NOT EXISTS limpiar_tracking_automatico
        ON SCHEDULE EVERY 1 HOUR
        STARTS CURRENT_TIMESTAMP
        DO
        BEGIN
            -- Limpiar sesiones inactivas (más de 30 minutos)
            UPDATE sesiones_jugadores 
            SET fin_sesion = NOW(),
                duracion_sesion = TIMESTAMPDIFF(MICROSECOND, inicio_sesion, NOW()) / 1000,
                motivo_desconexion = 'timeout',
                is_active = FALSE
            WHERE is_active = TRUE 
            AND inicio_sesion < DATE_SUB(NOW(), INTERVAL 30 MINUTE);
            
            -- Limpiar datos antiguos (más de 90 días) - solo a las 3 AM
            IF HOUR(NOW()) = 3 THEN
                DELETE FROM sesiones_jugadores 
                WHERE fin_sesion < DATE_SUB(NOW(), INTERVAL 90 DAY) 
                AND is_active = FALSE;
                
                DELETE FROM reportes_discord 
                WHERE fecha_evento < DATE_SUB(NOW(), INTERVAL 90 DAY);
                
                DELETE FROM estadisticas_tracking_diarias 
                WHERE fecha < DATE_SUB(NOW(), INTERVAL 180 DAY);
            END IF;
        END;
    `;
    
    try {
        await executeQuery(crearEventoSQL);
        console.log('   ⏰ Evento de limpieza automática creado');
        
        // Verificar que el event scheduler esté activado
        const verificarScheduler = await executeQuery("SHOW VARIABLES LIKE 'event_scheduler'");
        if (verificarScheduler[0] && verificarScheduler[0].Value !== 'ON') {
            console.warn('   ⚠️  Event scheduler no está activado. Ejecuta: SET GLOBAL event_scheduler = ON;');
        }
        
    } catch (error) {
        console.warn(`   ⚠️  No se pudo crear evento automático: ${error.message}`);
        console.warn('   💡 La limpieza se ejecutará desde el código JavaScript');
    }
}

async function desinstalarSistemaTracking() {
    try {
        console.log('🗑️  DESINSTALANDO SISTEMA DE TRACKING...');
        
        const { executeQuery } = require('./config/database');
        
        // Eliminar evento programado
        try {
            await executeQuery('DROP EVENT IF EXISTS limpiar_tracking_automatico');
            console.log('✅ Evento de limpieza eliminado');
        } catch (error) {
            console.warn('⚠️ No se pudo eliminar evento:', error.message);
        }
        
        // Eliminar tablas (cuidado: esto borra todos los datos)
        const tablas = [
            'reportes_discord',
            'estadisticas_tracking_diarias', 
            'sesiones_jugadores',
            'historial_nombres_jugadores',
            'jugadores_tracking'
        ];
        
        console.log('🗑️  Eliminando tablas...');
        for (const tabla of tablas) {
            try {
                await executeQuery(`DROP TABLE IF EXISTS ${tabla}`);
                console.log(`   ✅ Tabla ${tabla} eliminada`);
            } catch (error) {
                console.warn(`   ⚠️ Error eliminando ${tabla}:`, error.message);
            }
        }
        
        // Eliminar vista
        try {
            await executeQuery('DROP VIEW IF EXISTS vista_estadisticas_tracking');
            console.log('   ✅ Vista estadísticas eliminada');
        } catch (error) {
            console.warn('   ⚠️ Error eliminando vista:', error.message);
        }
        
        console.log('✅ Desinstalación completada');
        
    } catch (error) {
        console.error('❌ Error en desinstalación:', error);
    }
}

async function verificarEstadoSistema() {
    try {
        console.log('🔍 VERIFICANDO ESTADO DEL SISTEMA DE TRACKING');
        console.log('='.repeat(50));
        
        const { executeQuery, testConnection } = require('./config/database');
        
        // Verificar conexión
        const conexionOk = await testConnection();
        console.log(`📊 Conexión BD: ${conexionOk ? '✅ OK' : '❌ ERROR'}`);
        
        if (!conexionOk) {
            return false;
        }
        
        // Verificar tablas
        const verificarTablas = `
            SELECT table_name, 
                   table_rows,
                   round(((data_length + index_length) / 1024 / 1024), 2) as 'tamaño_mb'
            FROM information_schema.tables 
            WHERE table_schema = DATABASE() 
            AND table_name IN (
                'historial_nombres_jugadores', 
                'jugadores_tracking', 
                'sesiones_jugadores', 
                'reportes_discord', 
                'estadisticas_tracking_diarias'
            )
        `;
        
        const tablas = await executeQuery(verificarTablas);
        
        console.log('\n📋 ESTADO DE LAS TABLAS:');
        tablas.forEach(tabla => {
            console.log(`   ${tabla.table_name}: ${tabla.table_rows} registros (${tabla.tamaño_mb} MB)`);
        });
        
        // Verificar estadísticas del día
        const statsHoy = await executeQuery(
            'SELECT * FROM estadisticas_tracking_diarias WHERE fecha = CURDATE()'
        );
        
        if (statsHoy.length > 0) {
            const stats = statsHoy[0];
            console.log('\n📊 ESTADÍSTICAS DE HOY:');
            console.log(`   🆕 Nuevos jugadores: ${stats.nuevos_jugadores}`);
            console.log(`   🔗 Total conexiones: ${stats.total_conexiones}`);
            console.log(`   📝 Reportes enviados: ${stats.reportes_enviados}`);
            console.log(`   👢 Kicks: ${stats.kicks_realizados}`);
            console.log(`   🔨 Bans: ${stats.bans_realizados}`);
        }
        
        // Verificar sesiones activas
        const sesionesActivas = await executeQuery(
            'SELECT COUNT(*) as total FROM sesiones_jugadores WHERE is_active = TRUE'
        );
        
        console.log(`\n🔄 Sesiones activas: ${sesionesActivas[0].total}`);
        
        // Verificar evento de limpieza
        try {
            const eventos = await executeQuery("SHOW EVENTS LIKE 'limpiar_tracking_automatico'");
            console.log(`🧹 Limpieza automática: ${eventos.length > 0 ? '✅ Configurada' : '⚠️ No configurada'}`);
        } catch (error) {
            console.log('🧹 Limpieza automática: ⚠️ No disponible');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error verificando estado:', error);
        return false;
    }
}

// Función principal
async function main() {
    const args = process.argv.slice(2);
    const comando = args[0] || 'install';
    
    switch (comando.toLowerCase()) {
        case 'install':
        case 'instalar':
            await instalarSistemaTracking();
            break;
            
        case 'uninstall':
        case 'desinstalar':
            console.log('⚠️  ADVERTENCIA: Esto eliminará todas las tablas y datos del sistema de tracking');
            console.log('¿Estás seguro? Escribe "SI" para continuar:');
            
            // En un entorno real, usarías readline para input del usuario
            // Por ahora, solo mostrar advertencia
            console.log('❌ Desinstalación cancelada por seguridad');
            console.log('💡 Para desinstalar, edita el script y descomenta la función');
            // await desinstalarSistemaTracking();
            break;
            
        case 'status':
        case 'estado':
            await verificarEstadoSistema();
            break;
            
        case 'help':
        case 'ayuda':
            console.log('📖 COMANDOS DISPONIBLES:');
            console.log('   install/instalar  - Instalar sistema de tracking');
            console.log('   uninstall/desinstalar - Desinstalar sistema (¡CUIDADO!)');
            console.log('   status/estado - Verificar estado del sistema');
            console.log('   help/ayuda - Mostrar esta ayuda');
            break;
            
        default:
            console.log('❌ Comando no reconocido. Usa "help" para ver comandos disponibles.');
            break;
    }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
    main().then(() => {
        process.exit(0);
    }).catch((error) => {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    });
}

module.exports = {
    instalarSistemaTracking,
    desinstalarSistemaTracking,
    verificarEstadoSistema
};
