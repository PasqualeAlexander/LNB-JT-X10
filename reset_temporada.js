/**
 * SCRIPT DE RESET DE TEMPORADA - LNB BOT
 * ====================================
 * 
 * Este script hace backup de todas las estadísticas actuales
 * y resetea los campos de juego para iniciar una nueva temporada.
 * 
 * CAMPOS QUE SE RESETEAN A 0:
 * - goles, asistencias, partidos, victorias, derrotas
 * - autogoles, hatTricks, mvps, vallasInvictas
 * - tiempoJugado, mejorRachaGoles, mejorRachaAsistencias
 * - promedioGoles, promedioAsistencias
 * 
 * CAMPOS QUE SE MANTIENEN:
 * - auth_id, nombre, nombre_display
 * - fechaPrimerPartido, codigoRecuperacion
 * - xp, nivel (sistema de experiencia)
 */

const { executeQuery, testConnection, closePool } = require('./config/database');

async function resetearTemporada() {
    console.log('🏁 INICIANDO RESET DE TEMPORADA LNB...\n');
    
    try {
        // Verificar conexión
        console.log('🔍 Verificando conexión a la base de datos...');
        const connectionOk = await testConnection();
        
        if (!connectionOk) {
            throw new Error('No se pudo establecer conexión con la base de datos');
        }
        
        console.log('✅ Conexión establecida correctamente\n');
        
        // Obtener fecha en formato seguro para nombre de tabla (YYYY_MM_DD_HHMMSS)
        const fechaISO = new Date().toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
        const fechaDia = fechaISO.slice(0, 10).replace(/-/g, '_'); // YYYY_MM_DD
        const hora = fechaISO.slice(11, 19).replace(/:/g, ''); // HHMMSS
        const nombreTablaBackup = `temporada_backup_${fechaDia}_${hora}`;
        
        console.log(`📦 Creando backup en tabla: ${nombreTablaBackup}`);
        
        // PASO 1: Crear tabla de backup con estructura idéntica y copiar datos
        const backupTimestamp = new Date().toISOString();

        // Crear tabla con misma estructura que jugadores
        await executeQuery(`
            CREATE TABLE ${nombreTablaBackup} LIKE jugadores
        `);

        // Copiar todos los registros (mismas columnas) que tengan partidos > 0
        await executeQuery(`
            INSERT INTO ${nombreTablaBackup}
            SELECT *
            FROM jugadores 
            WHERE partidos > 0
            ORDER BY partidos DESC
        `);

        // Agregar metadatos del backup
        await executeQuery(`
            ALTER TABLE ${nombreTablaBackup}
            ADD COLUMN fecha_backup DATETIME NULL,
            ADD COLUMN motivo_backup VARCHAR(255) NULL
        `);

        await executeQuery(`
            UPDATE ${nombreTablaBackup}
            SET fecha_backup = NOW(),
                motivo_backup = 'Reset Temporada LNB'
        `);
        
        // Verificar cuántos registros se respaldaron
        const resultadoBackup = await executeQuery(`SELECT COUNT(*) as total FROM ${nombreTablaBackup}`);
        const totalRespaldados = resultadoBackup[0].total;
        
        console.log(`✅ Backup creado exitosamente: ${totalRespaldados} jugadores respaldados\n`);
        
        // PASO 2: Resetear estadísticas de juego (mantener auth_id, nombres, xp, nivel)
        console.log('🔄 Reseteando estadísticas de temporada...');
        
        const resultadoReset = await executeQuery(`
            UPDATE jugadores 
            SET 
                partidos = 0,
                victorias = 0,
                derrotas = 0,
                goles = 0,
                asistencias = 0,
                autogoles = 0,
                mejorRachaGoles = 0,
                mejorRachaAsistencias = 0,
                hatTricks = 0,
                mvps = 0,
                vallasInvictas = 0,
                tiempoJugado = 0,
                promedioGoles = 0.00,
                promedioAsistencias = 0.00,
                fechaUltimoPartido = NOW(),
                updated_at = NOW()
            WHERE partidos > 0
        `);
        
        console.log(`✅ Estadísticas reseteadas: ${resultadoReset.affectedRows} jugadores actualizados\n`);
        
        // PASO 3: Mostrar resumen del backup
        console.log('📊 RESUMEN DEL BACKUP CREADO:');
        console.log('=================================');
        
        const topJugadores = await executeQuery(`
            SELECT 
                nombre,
                partidos,
                goles,
                asistencias,
                victorias,
                (victorias/partidos*100) as win_rate
            FROM ${nombreTablaBackup} 
            ORDER BY partidos DESC 
            LIMIT 10
        `);
        
        topJugadores.forEach((jugador, i) => {
            const wr = Number(jugador.win_rate);
            const winRate = Number.isFinite(wr) ? wr.toFixed(1) : '0.0';
            console.log(`${i+1}. ${jugador.nombre}: ${jugador.partidos} PJ, ${jugador.goles} G, ${jugador.asistencias} A, ${winRate}% WR`);
        });
        
        // PASO 4: Verificar el reset
        console.log('\n🔍 VERIFICANDO RESET...');
        
        const verificacion = await executeQuery(`
            SELECT 
                COUNT(*) as total_jugadores,
                SUM(partidos) as total_partidos,
                SUM(goles) as total_goles,
                SUM(asistencias) as total_asistencias
            FROM jugadores
        `);
        
        const stats = verificacion[0];
        console.log(`✅ Verificación exitosa:`);
        console.log(`   - Jugadores en base: ${stats.total_jugadores}`);
        console.log(`   - Total partidos: ${stats.total_partidos} (debe ser 0)`);
        console.log(`   - Total goles: ${stats.total_goles} (debe ser 0)`);
        console.log(`   - Total asistencias: ${stats.total_asistencias} (debe ser 0)`);
        
        if (stats.total_partidos === 0 && stats.total_goles === 0 && stats.total_asistencias === 0) {
            console.log('\n🎉 ¡RESET COMPLETADO EXITOSAMENTE!');
        } else {
            console.log('\n⚠️ ADVERTENCIA: Algunos campos no se resetearon correctamente');
        }
        
        // PASO 5: Instrucciones para administrar el backup
        console.log('\n📋 INSTRUCCIONES PARA EL BACKUP:');
        console.log('=================================');
        console.log(`📦 Tabla de backup creada: "${nombreTablaBackup}"`);
        console.log(`📍 Ubicación: Base de datos lnb_estadisticas`);
        console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
        console.log(`👥 Jugadores respaldados: ${totalRespaldados}`);
        console.log('\n💡 Para consultar el backup más tarde:');
        console.log(`   SELECT * FROM ${nombreTablaBackup} ORDER BY partidos DESC;`);
        console.log('\n🗑️ Para eliminar el backup (cuando no se necesite más):');
        console.log(`   DROP TABLE ${nombreTablaBackup};`);
        
        console.log('\n🏆 ¡NUEVA TEMPORADA LNB INICIADA!');
        console.log('   - Todas las estadísticas reseteadas a 0');
        console.log('   - Auth_IDs y nombres preservados');
        console.log('   - Sistema XP/Nivel mantenido');
        console.log('   - Backup seguro creado');
        
    } catch (error) {
        console.error('\n❌ ERROR DURANTE EL RESET:', error.message);
        console.error('📋 Stack trace:', error.stack);
        console.error('\n🚨 IMPORTANTE: Verifica el estado de la base de datos antes de continuar');
        process.exit(1);
    } finally {
        await closePool();
    }
}

// Mostrar advertencia de confirmación
console.log('⚠️  ADVERTENCIA: RESET DE TEMPORADA');
console.log('=====================================');
console.log('Este script va a:');
console.log('✅ Crear backup de todas las estadísticas actuales');
console.log('🔄 Resetear goles, asistencias, partidos, etc. a 0');
console.log('💾 Mantener auth_ids, nombres y sistema XP');
console.log('');
console.log('¿Estás seguro de continuar? (Ctrl+C para cancelar)');
console.log('Iniciando en 3 segundos...\n');

// Delay de 3 segundos para cancelar si es necesario
setTimeout(() => {
    resetearTemporada();
}, 3000);