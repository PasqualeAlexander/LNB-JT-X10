/**
 * GESTOR DE BACKUPS DE TEMPORADAS - LNB BOT
 * =========================================
 * 
 * Script para gestionar los backups de temporadas creados.
 * Permite consultar, exportar y eliminar backups antiguos.
 */

const { executeQuery, testConnection, closePool } = require('./config/database');

async function listarBackups() {
    console.log('📋 LISTANDO BACKUPS DE TEMPORADAS...\n');
    
    try {
        const connectionOk = await testConnection();
        if (!connectionOk) {
            throw new Error('No se pudo establecer conexión con la base de datos');
        }

        // Buscar todas las tablas de backup
        const tablas = await executeQuery(`
            SHOW TABLES LIKE 'temporada_backup_%'
        `);

        if (tablas.length === 0) {
            console.log('❌ No se encontraron backups de temporadas');
            return;
        }

        console.log(`✅ Encontrados ${tablas.length} backups:\n`);

        for (const tabla of tablas) {
            const nombreTabla = Object.values(tabla)[0];
            
            // Obtener información del backup
            const info = await executeQuery(`
                SELECT 
                    COUNT(*) as total_jugadores,
                    MAX(fecha_backup) as fecha,
                    MAX(motivo_backup) as motivo,
                    SUM(partidos) as total_partidos,
                    SUM(goles) as total_goles,
                    SUM(asistencias) as total_asistencias
                FROM ${nombreTabla}
            `);

            const stats = info[0];
            const fecha = new Date(stats.fecha).toLocaleString();

            console.log(`📦 ${nombreTabla}`);
            console.log(`   📅 Fecha: ${fecha}`);
            console.log(`   👥 Jugadores: ${stats.total_jugadores}`);
            console.log(`   📊 Stats totales: ${stats.total_partidos} PJ, ${stats.total_goles} G, ${stats.total_asistencias} A`);
            console.log(`   💾 Motivo: ${stats.motivo}\n`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await closePool();
    }
}

async function consultarBackup(nombreTabla) {
    console.log(`🔍 CONSULTANDO BACKUP: ${nombreTabla}\n`);
    
    try {
        const connectionOk = await testConnection();
        if (!connectionOk) {
            throw new Error('No se pudo establecer conexión con la base de datos');
        }

        // Verificar que la tabla existe
        const existe = await executeQuery(`
            SHOW TABLES LIKE '${nombreTabla}'
        `);

        if (existe.length === 0) {
            console.log(`❌ No se encontró el backup: ${nombreTabla}`);
            return;
        }

        // Mostrar top 15 jugadores del backup
        const topJugadores = await executeQuery(`
            SELECT 
                nombre,
                partidos,
                victorias,
                derrotas,
                goles,
                asistencias,
                hatTricks,
                mvps,
                vallasInvictas,
                (victorias/partidos*100) as win_rate,
                (goles/partidos) as gpp,
                (asistencias/partidos) as app
            FROM ${nombreTabla} 
            WHERE partidos > 0
            ORDER BY partidos DESC 
            LIMIT 15
        `);

        console.log('🏆 TOP 15 JUGADORES DE ESTA TEMPORADA:');
        console.log('=====================================');
        
        topJugadores.forEach((jugador, i) => {
            const winRate = jugador.win_rate ? jugador.win_rate.toFixed(1) : '0.0';
            const gpp = jugador.gpp ? jugador.gpp.toFixed(2) : '0.00';
            const app = jugador.app ? jugador.app.toFixed(2) : '0.00';
            
            console.log(`${i+1}. ${jugador.nombre}`);
            console.log(`   📊 ${jugador.partidos} PJ | ${jugador.victorias}V-${jugador.derrotas}D (${winRate}% WR)`);
            console.log(`   ⚽ ${jugador.goles} G (${gpp}/PJ) | 🎯 ${jugador.asistencias} A (${app}/PJ)`);
            console.log(`   🎩 ${jugador.hatTricks} HT | 👑 ${jugador.mvps} MVP | 🛡️ ${jugador.vallasInvictas} VI\n`);
        });

        // Mostrar estadísticas generales
        const statsGenerales = await executeQuery(`
            SELECT 
                COUNT(*) as total_jugadores,
                SUM(partidos) as total_partidos,
                SUM(goles) as total_goles,
                SUM(asistencias) as total_asistencias,
                SUM(hatTricks) as total_hattricks,
                AVG(CASE WHEN partidos > 0 THEN victorias/partidos*100 END) as win_rate_promedio
            FROM ${nombreTabla}
            WHERE partidos > 0
        `);

        const stats = statsGenerales[0];
        console.log('📈 ESTADÍSTICAS GENERALES DE LA TEMPORADA:');
        console.log('==========================================');
        console.log(`👥 Jugadores activos: ${stats.total_jugadores}`);
        console.log(`🎮 Partidos totales: ${stats.total_partidos}`);
        console.log(`⚽ Goles totales: ${stats.total_goles}`);
        console.log(`🎯 Asistencias totales: ${stats.total_asistencias}`);
        console.log(`🎩 Hat-tricks totales: ${stats.total_hattricks}`);
        console.log(`📊 Win Rate promedio: ${stats.win_rate_promedio ? stats.win_rate_promedio.toFixed(1) : '0.0'}%`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await closePool();
    }
}

async function eliminarBackup(nombreTabla) {
    console.log(`🗑️ ELIMINANDO BACKUP: ${nombreTabla}\n`);
    
    try {
        const connectionOk = await testConnection();
        if (!connectionOk) {
            throw new Error('No se pudo establecer conexión con la base de datos');
        }

        // Verificar que la tabla existe
        const existe = await executeQuery(`
            SHOW TABLES LIKE '${nombreTabla}'
        `);

        if (existe.length === 0) {
            console.log(`❌ No se encontró el backup: ${nombreTabla}`);
            return;
        }

        // Mostrar información antes de eliminar
        const info = await executeQuery(`
            SELECT 
                COUNT(*) as total_jugadores,
                MAX(fecha_backup) as fecha
            FROM ${nombreTabla}
        `);

        const stats = info[0];
        console.log(`⚠️ CONFIRMAR ELIMINACIÓN:`);
        console.log(`   📦 Tabla: ${nombreTabla}`);
        console.log(`   👥 Jugadores: ${stats.total_jugadores}`);
        console.log(`   📅 Fecha: ${new Date(stats.fecha).toLocaleString()}`);
        console.log('\n❌ Esta acción NO se puede deshacer');
        console.log('🔄 Cancelando por seguridad...');
        console.log('\n💡 Para confirmar eliminación, ejecuta manualmente:');
        console.log(`   DROP TABLE ${nombreTabla};`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await closePool();
    }
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const comando = args[0];
const parametro = args[1];

switch (comando) {
    case 'listar':
    case 'list':
        listarBackups();
        break;
        
    case 'consultar':
    case 'ver':
        if (parametro) {
            consultarBackup(parametro);
        } else {
            console.log('❌ Especifica el nombre del backup a consultar');
            console.log('💡 Ejemplo: node gestionar_backups.js consultar temporada_backup_2025-09-20');
        }
        break;
        
    case 'eliminar':
    case 'delete':
        if (parametro) {
            eliminarBackup(parametro);
        } else {
            console.log('❌ Especifica el nombre del backup a eliminar');
            console.log('💡 Ejemplo: node gestionar_backups.js eliminar temporada_backup_2025-09-20');
        }
        break;
        
    default:
        console.log('📋 GESTOR DE BACKUPS DE TEMPORADAS LNB');
        console.log('====================================');
        console.log('');
        console.log('Comandos disponibles:');
        console.log('  node gestionar_backups.js listar                    - Lista todos los backups');
        console.log('  node gestionar_backups.js consultar <nombre_tabla>  - Ve detalles de un backup');
        console.log('  node gestionar_backups.js eliminar <nombre_tabla>   - Elimina un backup');
        console.log('');
        console.log('Ejemplos:');
        console.log('  node gestionar_backups.js listar');
        console.log('  node gestionar_backups.js consultar temporada_backup_2025-09-20');
        console.log('  node gestionar_backups.js eliminar temporada_backup_2025-08-15');
        break;
}