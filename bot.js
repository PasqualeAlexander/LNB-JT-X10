/* 
* ██████╗  ██████╗ ████████╗   ██╗     ███╗   ██╗██████╗         ██╗████████╗
* ██╔══██╗██╔═══██╗╚══██╔══╝   ██║     ████╗  ██║██╔══██╗        ██║╚══██╔══╝
* ██████╔╝██║   ██║   ██║      ██║     ██╔██╗ ██║██████╔╝        ██║   ██║   
* ██╔══██╗██║   ██║   ██║      ██║     ██║╚██╗██║██╔══██╗   ██   ██║   ██║   
* ██████╔╝╚██████╔╝   ██║      ███████╗██║ ╚████║██████╔╝   ╚█████╔╝   ██║   
* ╚═════╝  ╚═════╝    ╚═╝      ╚══════╝╚═╝  ╚═══╝╚═════╝     ╚════╝    ╚═╝    

BOT LIGA NACIONAL DE BIGGER LNB - VERSIÓN PUPPETEER CON NODE.JS + MYSQL
   Compatible con Puppeteer y base de datos MySQL
   ============================== */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Manejadores globales para diagnóstico y evitar cierres silenciosos
process.on('unhandledRejection', (err) => {
    try {
        console.error('❌ [GLOBAL] UnhandledRejection:', err && err.stack ? err.stack : err);
    } catch (_) {}
});
process.on('uncaughtException', (err) => {
    try {
        console.error('❌ [GLOBAL] UncaughtException:', err && err.stack ? err.stack : err);
    } catch (_) {}
});

// Cargar variables de entorno si existe archivo .env ANTES de importar configuraciones
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

// Importar configuración de base de datos DESPUÉS de cargar las variables de entorno
const { executeQuery, executeTransaction, testConnection, closePool } = require('./config/database');

// Importar funciones de base de datos
const dbFunctions = require('./database/db_functions');

// Importar API de Football
const { getLiveFixtures } = require('./api_football.js');

// Importar sistema de roles persistentes
const { rolesPersistentSystem } = require('./roles_persistent_system');

// Importar sistema de festejos persistentes
const festejosModule = require('./festejos_persistent_system');
const { inicializarSistemaFestejos, cargarFestejos, guardarFestejo, obtenerMensajeFestejo, tieneFestejos, limpiarFestejos } = festejosModule;

// Inicializar el sistema de festejos
let sistemaFestejosPersistente = null;
try {
    sistemaFestejosPersistente = inicializarSistemaFestejos();
    console.log('✅ Sistema de festejos persistentes inicializado');
} catch (error) {
    console.warn('⚠️ No se pudo inicializar el sistema de festejos:', error.message);
}

// Importar sistema de estadísticas Discord
let discordStatsSystem = null;
try {
    const DiscordStatsSystem = require('./discord_stats_system');
    discordStatsSystem = new DiscordStatsSystem();
    console.log('✅ Sistema de estadísticas Discord importado correctamente');
} catch (error) {
    console.warn('⚠️ No se pudo importar el sistema de estadísticas Discord:', error.message);
}

console.log('🔌 Inicializando conexión a MySQL...');

// Probar conexión al inicializar
testConnection().then(isConnected => {
    if (!isConnected) {
        console.error('❌ No se pudo conectar a MySQL. Verifica la configuración.');
        process.exit(1);
    }
    // Keep-alive de MySQL para evitar cierres de conexiones por inactividad
    try {
        setInterval(async () => {
            try {
                await executeQuery('SELECT 1');
            } catch (e) {
                console.warn('⚠️ [DB KEEPALIVE] Falló ping SELECT 1:', e.message);
            }
        }, 5 * 60 * 1000); // cada 5 minutos
    } catch {}
});

// Crear tablas de base de datos
const crearTablas = async () => {
    try {
        console.log('🗃️ Creando tablas en MySQL si no existen...');
        
        // Tabla principal de jugadores
        await executeQuery(`CREATE TABLE IF NOT EXISTS jugadores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) UNIQUE NOT NULL,
            partidos INT DEFAULT 0,
            victorias INT DEFAULT 0,
            derrotas INT DEFAULT 0,
            goles INT DEFAULT 0,
            asistencias INT DEFAULT 0,
            autogoles INT DEFAULT 0,
            mejorRachaGoles INT DEFAULT 0,
            mejorRachaAsistencias INT DEFAULT 0,
            hatTricks INT DEFAULT 0,
            vallasInvictas INT DEFAULT 0,
            tiempoJugado INT DEFAULT 0,
            promedioGoles FLOAT DEFAULT 0.0,
            promedioAsistencias FLOAT DEFAULT 0.0,
            fechaPrimerPartido DATETIME,
            fechaUltimoPartido DATETIME,
            xp INT DEFAULT 40,
            nivel INT DEFAULT 1,
            codigoRecuperacion VARCHAR(50),
            fechaCodigoCreado VARCHAR(50),
            esVIP TINYINT DEFAULT 0,
            fechaVIP VARCHAR(50),
            auth_id VARCHAR(255) UNIQUE,
            baneado TINYINT DEFAULT 0,
            fecha_ban VARCHAR(50),
            razon_ban TEXT,
            admin_ban VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`);

        // Verificar y migrar columnas de fecha a DATETIME
        try {
            const columnsToMigrate = [
                { name: 'fechaPrimerPartido', type: 'varchar' },
                { name: 'fechaUltimoPartido', type: 'varchar' }
            ];

            for (const col of columnsToMigrate) {
                const checkColumnQuery = `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
                                          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'jugadores' AND COLUMN_NAME = ?`;
                const result = await executeQuery(checkColumnQuery, [process.env.DB_NAME || 'lnb_estadisticas', col.name]);

                if (result && result.length > 0 && result[0].DATA_TYPE.toLowerCase() === 'varchar') {
                    console.log(`[MIGRACIÓN] Cambiando tipo de columna ${col.name} de VARCHAR a DATETIME...`);
                    await executeQuery(`ALTER TABLE jugadores ADD COLUMN ${col.name}_temp DATETIME`);
                    await executeQuery(`UPDATE jugadores SET ${col.name}_temp = STR_TO_DATE(${col.name}, '%Y-%m-%dT%H:%i:%s.%fZ') WHERE ${col.name} IS NOT NULL`);
                    await executeQuery(`ALTER TABLE jugadores DROP COLUMN ${col.name}`);
                    await executeQuery(`ALTER TABLE jugadores CHANGE COLUMN ${col.name}_temp ${col.name} DATETIME`);
                    console.log(`[MIGRACIÓN] Columna ${col.name} migrada a DATETIME exitosamente.`);
                }
            }
        } catch (migrationError) {
            console.error('❌ Error durante la migración de columnas de fecha:', migrationError);
        }
        
        // Verificar si ya existen las columnas VIP y baneos
        // MySQL 9.4 no soporta IF NOT EXISTS en ALTER TABLE, necesitamos verificar manualmente
        try {
            // Verificar si las columnas ya existen antes de agregarlas
            const checkColumnsQuery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
                                      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'jugadores' 
                                      AND COLUMN_NAME IN ('esVIP', 'fechaVIP', 'auth_id', 'baneado', 'fecha_ban', 'razon_ban', 'admin_ban', 'mvps')`;
            
            const existingColumns = await executeQuery(checkColumnsQuery, [process.env.DB_NAME || 'lnb_estadisticas']);
            const existingColumnNames = existingColumns.map(row => row.COLUMN_NAME);
            
            console.log(`📊 Columnas existentes detectadas:`, existingColumnNames);
            
            // Agregar columnas VIP si no existen
            if (!existingColumnNames.includes('esVIP')) {
                await executeQuery(`ALTER TABLE jugadores ADD COLUMN esVIP TINYINT DEFAULT 0`);
                console.log(`✅ Columna esVIP agregada`);
            }
            
            if (!existingColumnNames.includes('fechaVIP')) {
                await executeQuery(`ALTER TABLE jugadores ADD COLUMN fechaVIP VARCHAR(50)`);
                console.log(`✅ Columna fechaVIP agregada`);
            }
            
            // Agregar/asegurar columnas para sistema de baneos y MVPs
            const columnasBaneo = [
                { nombre: 'auth_id', definicion: 'VARCHAR(255) UNIQUE' },
                { nombre: 'baneado', definicion: 'TINYINT DEFAULT 0' },
                { nombre: 'fecha_ban', definicion: 'VARCHAR(50)' },
                { nombre: 'razon_ban', definicion: 'TEXT' },
                { nombre: 'admin_ban', definicion: 'VARCHAR(255)' },
                { nombre: 'mvps', definicion: 'INT DEFAULT 0' }
            ];
            
            for (const columna of columnasBaneo) {
                if (!existingColumnNames.includes(columna.nombre)) {
                    try {
                        await executeQuery(`ALTER TABLE jugadores ADD COLUMN ${columna.nombre} ${columna.definicion}`);
                        console.log(`✅ Columna ${columna.nombre} agregada`);
                    } catch (colErr) {
                        // Ignorar errores de columna ya existente o constraint duplicado
                        if (!colErr.message.includes('Duplicate') && !colErr.message.includes('already exists')) {
                            console.error(`❌ Error agregando columna ${columna.nombre}:`, colErr.message);
                        }
                    }
                } else {
                    console.log(`ℹ️ Columna ${columna.nombre} ya existe, saltando...`);
                }
            }
        } catch (alterErr) {
            console.log(`ℹ️ Nota: Error verificando columnas existentes:`, alterErr.message);
        }
        
        // Tabla de records históricos
        await executeQuery(`CREATE TABLE IF NOT EXISTS records (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tipo VARCHAR(50) NOT NULL,
            jugador VARCHAR(255) NOT NULL,
            valor INT NOT NULL,
            fecha VARCHAR(50) NOT NULL,
            detalles TEXT
        )`);      
        
        // Tabla de partidos
        await executeQuery(`CREATE TABLE IF NOT EXISTS partidos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fecha VARCHAR(50) NOT NULL,
            duracion INT NOT NULL,
            golesRed INT NOT NULL,
            golesBlue INT NOT NULL,
            mapa VARCHAR(255) NOT NULL,
            mejorJugador VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);      
        
        // Tabla de conexiones activas para control de múltiples pestañas
        await executeQuery(`CREATE TABLE IF NOT EXISTS conexiones_activas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre_jugador VARCHAR(255) NOT NULL,
            auth_jugador VARCHAR(255),
            ip_simulada VARCHAR(50) NOT NULL,
            identificador_conexion VARCHAR(255) UNIQUE NOT NULL,
            fecha_conexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            activa TINYINT DEFAULT 1
        )`);      
        
        // Tabla para el nuevo sistema de baneos con tabla dedicada
        // MySQL 9.4 no permite DEFAULT en columnas TEXT, usamos VARCHAR en su lugar
        await executeQuery(`CREATE TABLE IF NOT EXISTS baneos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            auth_id VARCHAR(255) NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            razon VARCHAR(500) DEFAULT 'Baneado por admin',
            admin VARCHAR(255) NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            duracion INT DEFAULT 0, -- 0 = permanente, >0 = minutos
            activo TINYINT DEFAULT 1
        )`);
        
        // Tabla para sistema VIP
        await executeQuery(`CREATE TABLE IF NOT EXISTS vip_types (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type_name VARCHAR(50) UNIQUE NOT NULL,
            level INT NOT NULL,
            color VARCHAR(20) NOT NULL,
            benefits TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);      
        
        // Tabla de membresías VIP
        await executeQuery(`CREATE TABLE IF NOT EXISTS vip_memberships (
            id INT AUTO_INCREMENT PRIMARY KEY,
            player_name VARCHAR(255) NOT NULL,
            vip_type VARCHAR(50) NOT NULL,
            granted_by VARCHAR(255) NOT NULL,
            granted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expiry_date TIMESTAMP NULL,
            is_active TINYINT DEFAULT 1,
            reason TEXT,
            FOREIGN KEY (player_name) REFERENCES jugadores(nombre) ON DELETE CASCADE
        )`);      
        
        // Tabla de beneficios VIP utilizados
        await executeQuery(`CREATE TABLE IF NOT EXISTS vip_benefits_used (
            id INT AUTO_INCREMENT PRIMARY KEY,
            player_name VARCHAR(255) NOT NULL,
            benefit_type VARCHAR(50) NOT NULL,
            used_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            details TEXT
        )`);
        
        // Tabla para festejos personalizados de gol y asistencias
        await executeQuery(`CREATE TABLE IF NOT EXISTS festejos_personalizados (
            id INT AUTO_INCREMENT PRIMARY KEY,
            player_name VARCHAR(255) NOT NULL,
            auth_id VARCHAR(255),
            mensaje_gol VARCHAR(50),
            mensaje_asistencia VARCHAR(50),
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_player (player_name),
            FOREIGN KEY (player_name) REFERENCES jugadores(nombre) ON DELETE CASCADE
        )`);
        
        // Tabla para tracking de salidas de jugadores
        await executeQuery(`CREATE TABLE IF NOT EXISTS salidas_jugadores (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            auth_id VARCHAR(255),
            player_id INT NOT NULL,
            fecha_salida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            razon_salida VARCHAR(255) DEFAULT 'Voluntaria',
            INDEX idx_fecha_salida (fecha_salida)
        )`);

        // Tabla para historial de nombres de jugadores
        await executeQuery(`CREATE TABLE IF NOT EXISTS jugador_nombres_historial (
            id INT AUTO_INCREMENT PRIMARY KEY,
            auth_id VARCHAR(255) NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            primera_vez_usado TIMESTAMP NOT NULL,
            ultima_vez_usado TIMESTAMP NOT NULL,
            veces_usado INT DEFAULT 1,
            UNIQUE KEY auth_id_nombre (auth_id, nombre)
        )`);
        
        console.log('✅ Tablas creadas correctamente en MySQL');
    } catch (err) {
        console.error('❌ Error creando tablas en MySQL:', err);
        throw err;
    }
};

// IMPORTANTE: NO USAR ESTAS FUNCIONES - USAR LAS DE ./database/db_functions.js
// Esta sección está obsoleta y se mantiene solo por compatibilidad histórica
// Las funciones están comentadas para evitar colisiones con las importadas
/*
const dbFunctionsOld = {
    // Guardar/actualizar jugador
    guardarJugador: async (nombre, stats) => {
        try {
            // En MySQL usamos INSERT... ON DUPLICATE KEY UPDATE en vez de INSERT OR REPLACE
            const query = `INSERT INTO jugadores 
                          (nombre, partidos, victorias, derrotas, goles, asistencias, autogoles, 
                           mejorRachaGoles, mejorRachaAsistencias, hatTricks, vallasInvictas, 
                           tiempoJugado, promedioGoles, promedioAsistencias, fechaPrimerPartido, 
                           fechaUltimoPartido, xp, nivel, codigoRecuperacion, fechaCodigoCreado)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                          ON DUPLICATE KEY UPDATE 
                          partidos = VALUES(partidos),
                          victorias = VALUES(victorias),
                          derrotas = VALUES(derrotas),
                          goles = VALUES(goles),
                          asistencias = VALUES(asistencias),
                          autogoles = VALUES(autogoles),
                          mejorRachaGoles = VALUES(mejorRachaGoles),
                          mejorRachaAsistencias = VALUES(mejorRachaAsistencias),
                          hatTricks = VALUES(hatTricks),
                          vallasInvictas = VALUES(vallasInvictas),
                          tiempoJugado = VALUES(tiempoJugado),
                          promedioGoles = VALUES(promedioGoles),
                          promedioAsistencias = VALUES(promedioAsistencias),
                          fechaPrimerPartido = VALUES(fechaPrimerPartido),
                          fechaUltimoPartido = VALUES(fechaUltimoPartido),
                          xp = VALUES(xp),
                          nivel = VALUES(nivel),
                          codigoRecuperacion = VALUES(codigoRecuperacion),
                          fechaCodigoCreado = VALUES(fechaCodigoCreado),
                          updated_at = CURRENT_TIMESTAMP`;
            
            const params = [
                nombre, stats.partidos, stats.victorias, stats.derrotas, stats.goles, 
                stats.asistencias, stats.autogoles, stats.mejorRachaGoles, stats.mejorRachaAsistencias, 
                stats.hatTricks, stats.vallasInvictas, stats.tiempoJugado, stats.promedioGoles, 
                stats.promedioAsistencias, stats.fechaPrimerPartido, stats.fechaUltimoPartido, 
                stats.xp, stats.nivel, stats.codigoRecuperacion, stats.fechaCodigoCreado
            ];
            
            const result = await executeQuery(query, params);
            return result.insertId || 0;
        } catch (err) {
            console.error(`❌ Error al guardar jugador ${nombre}:`, err);
            throw err;
        }
    },
    
    // Obtener jugador
    obtenerJugador: async (nombre) => {
        try {
            const rows = await executeQuery('SELECT * FROM jugadores WHERE nombre = ?', [nombre]);
            return rows[0] || null;
        } catch (err) {
            console.error(`❌ Error al obtener jugador ${nombre}:`, err);
            throw err;
        }
    },

    // Sistemas de carga y guardado consistentes
    cargarEstadisticasGlobales: async () => {
        try {
            const rows = await executeQuery('SELECT * FROM jugadores');
                
                // Formatear datos para coincidir con la estructura esperada
                const estadisticasFormateadas = {
                    jugadores: {},
                    records: {
                        mayorGoles: {jugador: "", cantidad: 0, fecha: ""},
                        mayorAsistencias: {jugador: "", cantidad: 0, fecha: ""},
                        partidoMasLargo: {duracion: 0, fecha: "", equipos: ""},
                        goleadaMasGrande: {diferencia: 0, resultado: "", fecha: ""},
                        hatTricks: [],
                        vallasInvictas: []
                    },
                    totalPartidos: 0,
                    fechaCreacion: new Date().toISOString(),
                    contadorJugadores: rows ? rows.length : 0
                };
                
                // Convertir filas de la base de datos a la estructura esperada
                if (rows && rows.length > 0) {
                    rows.forEach(row => {
                        estadisticasFormateadas.jugadores[row.nombre] = {
                            nombre: row.nombre,
                            partidos: row.partidos || 0,
                            victorias: row.victorias || 0,
                            derrotas: row.derrotas || 0,
                            goles: row.goles || 0,
                            asistencias: row.asistencias || 0,
                            autogoles: row.autogoles || 0,
                            mejorRachaGoles: row.mejorRachaGoles || 0,
                            mejorRachaAsistencias: row.mejorRachaAsistencias || 0,
                            hatTricks: row.hatTricks || 0,
                            vallasInvictas: row.vallasInvictas || 0,
                            tiempoJugado: row.tiempoJugado || 0,
                            promedioGoles: row.promedioGoles || 0.0,
                            promedioAsistencias: row.promedioAsistencias || 0.0,
                            fechaPrimerPartido: row.fechaPrimerPartido || new Date().toISOString(),
                            fechaUltimoPartido: row.fechaUltimoPartido || new Date().toISOString(),
                            xp: row.xp || 40,
                            nivel: row.nivel || 1,
                            codigoRecuperacion: row.codigoRecuperacion || null,
                            fechaCodigoCreado: row.fechaCodigoCreado || null
                        };
                    });
                    
                    // Calcular records básicos
                    let maxGoles = 0, maxAsistencias = 0;
                    Object.values(estadisticasFormateadas.jugadores).forEach(jugador => {
                        if (jugador.goles > maxGoles) {
                            maxGoles = jugador.goles;
                            estadisticasFormateadas.records.mayorGoles = {
                                jugador: jugador.nombre,
                                cantidad: jugador.goles,
                                fecha: jugador.fechaUltimoPartido
                            };
                        }
                        if (jugador.asistencias > maxAsistencias) {
                            maxAsistencias = jugador.asistencias;
                            estadisticasFormateadas.records.mayorAsistencias = {
                                jugador: jugador.nombre,
                                cantidad: jugador.asistencias,
                                fecha: jugador.fechaUltimoPartido
                            };
                        }
                        estadisticasFormateadas.totalPartidos += jugador.partidos;
                    });
                }
                
                console.log(`📊 [DB] Cargadas estadísticas de ${Object.keys(estadisticasFormateadas.jugadores).length} jugadores`);
                return estadisticasFormateadas;
        } catch (err) {
            console.error('❌ Error al cargar estadísticas globales:', err);
            throw err;
        }
    },

    guardarEstadisticasGlobales: (datos) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!datos || !datos.jugadores) {
                    console.error('❌ [DB] Datos inválidos para guardar estadísticas globales');
                    resolve(false);
                    return;
                }
                
                console.log(`💾 [DB] Guardando estadísticas de ${Object.keys(datos.jugadores).length} jugadores...`);
                
                // Guardar cada jugador individualmente (solo por auth_id)
                const jugadoresGuardados = [];
                for (const [nombre, stats] of Object.entries(datos.jugadores)) {
                    try {
                        const authId = stats.auth_id || stats.authId || null;
                        const nombreMostrar = stats.nombre_display || stats.nombre || nombre;
                        if (!authId) {
                            console.warn(`🚫 [DB] Saltando guardado de '${nombreMostrar}' por no tener auth_id`);
                            continue;
                        }
                        await dbFunctions.guardarJugadorPorAuth(authId, nombreMostrar, stats);
                        jugadoresGuardados.push(`${nombreMostrar} (auth)`);
                    } catch (error) {
                        console.error(`❌ [DB] Error guardando jugador ${nombre}:`, error);
                    }
                }
                
                console.log(`✅ [DB] ${jugadoresGuardados.length} jugadores guardados exitosamente (por auth_id)`);
                
                // TODO: Implementar guardado de records y otras estadísticas globales
                
                resolve(true);
            } catch (error) {
                console.error('❌ [DB] Error en guardarEstadisticasGlobales:', error);
                reject(error);
            }
        });
    },
    
    // Obtener top jugadores
    obtenerTopJugadores: async (campo, limite = 10) => {
        try {
            const validCampos = ['goles', 'asistencias', 'partidos', 'victorias', 'hatTricks', 'vallasInvictas'];
            if (!validCampos.includes(campo)) {
                throw new Error('Campo inválido');
            }
            
            // MySQL usa la misma sintaxis para LIMIT
            const rows = await executeQuery(`SELECT * FROM jugadores WHERE partidos > 0 ORDER BY ${campo} DESC LIMIT ?`, [limite]);
            return rows;
        } catch (err) {
            console.error(`❌ Error al obtener top jugadores por ${campo}:`, err);
            throw err;
        }
    },
    
    // Guardar partido
    guardarPartido: async (partidoData) => {
        try {
            const query = `INSERT INTO partidos (fecha, duracion, golesRed, golesBlue, mapa, mejorJugador)
                          VALUES (?, ?, ?, ?, ?, ?)`;
            
            const params = [
                partidoData.fecha, partidoData.duracion, partidoData.golesRed, 
                partidoData.golesBlue, partidoData.mapa, partidoData.mejorJugador
            ];
            
            const result = await executeQuery(query, params);
            return result.insertId || 0;
        } catch (err) {
            console.error('❌ Error al guardar partido:', err);
            throw err;
        }
    },
    
    // Eliminar cuentas inactivas por 90 días
    eliminarCuentasInactivas: async () => {
        try {
            // Primero contar cuántas cuentas serán eliminadas (con sintaxis MySQL)
            const countQuery = `SELECT COUNT(*) as count FROM jugadores 
                               WHERE DATE_ADD(STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ'), INTERVAL 90 DAY) < NOW()`;
            
            const countResult = await executeQuery(countQuery);
            const cuentasAEliminar = countResult[0].count;
            
            console.log(`🧹 Se encontraron ${cuentasAEliminar} cuentas inactivas por más de 90 días`);
            
            if (cuentasAEliminar === 0) {
                return { eliminadas: 0, mensaje: 'No hay cuentas inactivas para eliminar' };
            }
            
            // Obtener nombres de las cuentas que serán eliminadas (para log)
            const selectQuery = `SELECT nombre, fechaUltimoPartido FROM jugadores 
                                WHERE DATE_ADD(STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ'), INTERVAL 90 DAY) < NOW()`;
            
            const jugadoresInactivos = await executeQuery(selectQuery);
            
            // Log de las cuentas que serán eliminadas
            console.log('📋 Cuentas que serán eliminadas:');
            jugadoresInactivos.forEach(jugador => {
                const diasInactivo = Math.floor((new Date() - new Date(jugador.fechaUltimoPartido)) / (1000 * 60 * 60 * 24));
                console.log(`  - ${jugador.nombre} (${diasInactivo} días inactivo)`);
            });
            
            // Proceder con la eliminación
            const deleteQuery = `DELETE FROM jugadores 
                                WHERE DATE_ADD(STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ'), INTERVAL 90 DAY) < NOW()`;
            
            const deleteResult = await executeQuery(deleteQuery);
            
            console.log(`✅ ${deleteResult.affectedRows} cuentas inactivas eliminadas exitosamente`);
            return { 
                eliminadas: deleteResult.affectedRows, 
                mensaje: `Se eliminaron ${deleteResult.affectedRows} cuentas inactivas por más de 90 días`,
                cuentas: jugadoresInactivos.map(r => ({ nombre: r.nombre, fechaUltimoPartido: r.fechaUltimoPartido }))
            };
        } catch (err) {
            console.error('❌ Error al eliminar cuentas inactivas:', err);
            throw err;
        }
    },
    
    // ====================== FUNCIONES PARA SISTEMA VIP ======================
    
    // Activar VIP para un jugador
    activarVIP: async (nombreJugador) => {
        try {
            const fechaVIP = new Date().toISOString();
            const query = `UPDATE jugadores SET esVIP = 1, fechaVIP = ? WHERE nombre = ?`;
            
            const result = await executeQuery(query, [fechaVIP, nombreJugador]);
            
            if (result.affectedRows === 0) {
                throw new Error('Jugador no encontrado');
            }
            
            console.log(`✅ VIP activado para ${nombreJugador} en ${fechaVIP}`);
            return { nombreJugador, fechaVIP, cambios: result.affectedRows };
        } catch (err) {
            console.error(`❌ Error al activar VIP para ${nombreJugador}:`, err);
            throw err;
        }
    },
    
    // Desactivar VIP para un jugador
    desactivarVIP: async (nombreJugador) => {
        try {
            const query = `UPDATE jugadores SET esVIP = 0, fechaVIP = NULL WHERE nombre = ?`;
            
            const result = await executeQuery(query, [nombreJugador]);
            
            if (result.affectedRows === 0) {
                throw new Error('Jugador no encontrado');
            }
            
            console.log(`❌ VIP desactivado para ${nombreJugador}`);
            return { nombreJugador, cambios: result.affectedRows };
        } catch (err) {
            console.error(`❌ Error al desactivar VIP para ${nombreJugador}:`, err);
            throw err;
        }
    },
    
    // Verificar si un jugador es VIP
    esJugadorVIP: async (nombreJugador) => {
        try {
            const query = `SELECT esVIP, fechaVIP FROM jugadores WHERE nombre = ?`;
            const rows = await executeQuery(query, [nombreJugador]);
            
            if (!rows || rows.length === 0) {
                return { esVIP: false, fechaVIP: null };
            }
            
            const row = rows[0];
            const esVIP = row.esVIP === 1;
            const fechaVIP = row.fechaVIP;
            
            // Si es VIP, verificar que no haya expirado (30 días)
            if (esVIP && fechaVIP) {
                const fechaOtorgamiento = new Date(fechaVIP);
                const fechaExpiracion = new Date(fechaOtorgamiento.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 días
                const ahora = new Date();
                
                if (ahora > fechaExpiracion) {
                    // VIP expirado - desactivar automáticamente
                    try {
                        await dbFunctions.desactivarVIP(nombreJugador);
                        return { esVIP: false, fechaVIP: null, expirado: true };
                    } catch (error) {
                        console.error(`Error al desactivar VIP expirado para ${nombreJugador}:`, error);
                        return { esVIP: false, fechaVIP: null, expirado: true };
                    }
                } else {
                    return { esVIP: true, fechaVIP: fechaVIP, diasRestantes: Math.ceil((fechaExpiracion - ahora) / (24 * 60 * 60 * 1000)) };
                }
            } else {
                return { esVIP: false, fechaVIP: null };
            }
        } catch (err) {
            console.error(`❌ Error al verificar VIP para ${nombreJugador}:`, err);
            throw err;
        }
    },
    
    // Obtener lista de jugadores VIP activos
    obtenerJugadoresVIP: async () => {
        try {
            const query = `SELECT nombre, fechaVIP FROM jugadores WHERE esVIP = 1 ORDER BY fechaVIP DESC`;
            const rows = await executeQuery(query);
            
            const jugadoresVIP = rows.map(row => {
                const fechaOtorgamiento = new Date(row.fechaVIP);
                const fechaExpiracion = new Date(fechaOtorgamiento.getTime() + (30 * 24 * 60 * 60 * 1000));
                const ahora = new Date();
                const diasRestantes = Math.ceil((fechaExpiracion - ahora) / (24 * 60 * 60 * 1000));
                
                return {
                    nombre: row.nombre,
                    fechaVIP: row.fechaVIP,
                    diasRestantes: diasRestantes,
                    expirado: diasRestantes <= 0
                };
            });
            
            return jugadoresVIP;
        } catch (err) {
            console.error('❌ Error al obtener jugadores VIP:', err);
            throw err;
        }
    },
    
    // Limpiar VIPs expirados automáticamente
    limpiarVIPsExpirados: async () => {
        try {
            // Primero obtener los VIPs que van a expirar (con sintaxis MySQL)
            const selectQuery = `SELECT nombre, fechaVIP FROM jugadores 
                                WHERE esVIP = 1 
                                AND DATE_ADD(STR_TO_DATE(fechaVIP, '%Y-%m-%dT%H:%i:%s.%fZ'), INTERVAL 30 DAY) < NOW()`;
            
            const vipsExpirados = await executeQuery(selectQuery);
            
            if (vipsExpirados.length === 0) {
                return { vipsExpirados: 0, jugadores: [] };
            }
            
            // Desactivar VIPs expirados
            const updateQuery = `UPDATE jugadores 
                                SET esVIP = 0, fechaVIP = NULL 
                                WHERE esVIP = 1 
                                AND DATE_ADD(STR_TO_DATE(fechaVIP, '%Y-%m-%dT%H:%i:%s.%fZ'), INTERVAL 30 DAY) < NOW()`;
            
            const result = await executeQuery(updateQuery);
            
            console.log(`🧹 ${result.affectedRows} VIPs expirados limpiados automáticamente`);
            return { 
                vipsExpirados: result.affectedRows, 
                jugadores: vipsExpirados.map(r => ({
                    nombre: r.nombre,
                    fechaVIP: r.fechaVIP,
                    diasVencido: Math.floor((new Date() - new Date(r.fechaVIP)) / (1000 * 60 * 60 * 24)) - 30
                }))
            };
        } catch (err) {
            console.error('❌ Error al limpiar VIPs expirados:', err);
            throw err;
        }
    },
    
    // ====================== FUNCIONES PARA CONTROL DE CONEXIONES MÚLTIPLES ======================
    
    // Registrar nueva conexión
    registrarConexion: (nombreJugador, authJugador, ipSimulada, identificadorConexion) => {
        return new Promise((resolve, reject) => {
            // Primero intentar eliminar cualquier conexión existente con el mismo identificador
            const deleteQuery = `DELETE FROM conexiones_activas WHERE identificador_conexion = ?`;
            
            db.run(deleteQuery, [identificadorConexion], function(deleteErr) {
                // Ignorar errores de delete (puede que no exista)
                if (deleteErr) {
                    console.log(`⚠️ Advertencia al limpiar conexión existente: ${deleteErr.message}`);
                }
                
                // Ahora insertar la nueva conexión
                const insertQuery = `INSERT INTO conexiones_activas 
                              (nombre_jugador, auth_jugador, ip_simulada, identificador_conexion)
                              VALUES (?, ?, ?, ?)`;
                
                db.run(insertQuery, [nombreJugador, authJugador, ipSimulada, identificadorConexion], function(insertErr) {
                    if (insertErr) {
                        // Si aún hay error UNIQUE constraint, intentar con INSERT OR REPLACE
                        if (insertErr.message.includes('UNIQUE constraint failed')) {
                            console.log(`🔄 Intentando INSERT OR REPLACE para resolver conflicto de conexión`);
                            
                            const replaceQuery = `INSERT OR REPLACE INTO conexiones_activas 
                                              (nombre_jugador, auth_jugador, ip_simulada, identificador_conexion)
                                              VALUES (?, ?, ?, ?)`;
                            
                            db.run(replaceQuery, [nombreJugador, authJugador, ipSimulada, identificadorConexion], function(replaceErr) {
                                if (replaceErr) {
                                    console.error(`❌ Error definitivo al registrar conexión:`, replaceErr);
                                    reject(replaceErr);
                                } else {
                                    console.log(`🔗 Conexión registrada/reemplazada: ${nombreJugador} (${ipSimulada})`);
                                    resolve(this.lastID);
                                }
                            });
                        } else {
                            console.error(`❌ Error al registrar conexión:`, insertErr);
                            reject(insertErr);
                        }
                    } else {
                        console.log(`🔗 Nueva conexión registrada: ${nombreJugador} (${ipSimulada})`);
                        resolve(this.lastID);
                    }
                });
            });
        });
    },
    
    // Verificar si un jugador ya tiene conexiones activas
    verificarConexionesExistentes: (nombreJugador, authJugador = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Primero limpiar conexiones inactivas automáticamente
                await dbFunctions.limpiarConexionesInactivas();
                
                let query = `SELECT * FROM conexiones_activas 
                            WHERE activa = 1 AND (nombre_jugador = ?`;
                let params = [nombreJugador];
                
                // Si tenemos auth, también verificar por auth
                if (authJugador) {
                    query += ` OR auth_jugador = ?`;
                    params.push(authJugador);
                }
                
                query += `)`;
                
                db.all(query, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const conexionesActivas = rows.length;
                        // Solo considerar múltiples conexiones si hay 2 O MÁS conexiones activas diferentes
                        // Esto permite que un jugador se conecte por primera vez
                        const tieneConexionesMultiples = conexionesActivas >= 2;
                        
                        console.log(`🔍 Verificación de conexiones para ${nombreJugador}: ${conexionesActivas} activas`);
                        
                        // Si hay exactamente una conexión activa, verificar si es del mismo jugador
                        if (conexionesActivas === 1 && rows.length > 0) {
                            const conexionExistente = rows[0];
                            // Si el auth es el mismo, es la misma sesión (permitido)
                            if (conexionExistente.auth_jugador === authJugador) {
                                console.log(`✅ Conexión permitida: misma sesión de ${nombreJugador}`);
                                resolve({
                                    tieneConexionesMultiples: false,
                                    conexionesActivas: 0, // Tratar como nueva conexión
                                    detalles: []
                                });
                                return;
                            }
                        }
                        
                        resolve({
                            tieneConexionesMultiples,
                            conexionesActivas,
                            detalles: rows
                        });
                    }
                });
            } catch (error) {
                console.error('❌ Error en verificarConexionesExistentes:', error);
                reject(error);
            }
        });
    },
    
    // Desactivar conexión específica
    desactivarConexion: (identificadorConexion) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE conexiones_activas 
                          SET activa = 0, ultima_actividad = CURRENT_TIMESTAMP 
                          WHERE identificador_conexion = ?`;
            
            db.run(query, [identificadorConexion], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`❌ Conexión desactivada: ${identificadorConexion}`);
                    resolve(this.changes);
                }
            });
        });
    },
    
    // Desactivar todas las conexiones de un jugador
    desactivarConexionesJugador: (nombreJugador, authJugador = null) => {
        return new Promise((resolve, reject) => {
            let query = `UPDATE conexiones_activas 
                        SET activa = 0, ultima_actividad = CURRENT_TIMESTAMP 
                        WHERE activa = 1 AND (nombre_jugador = ?`;
            let params = [nombreJugador];
            
            if (authJugador) {
                query += ` OR auth_jugador = ?`;
                params.push(authJugador);
            }
            
            query += `)`;
            
            db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`🚫 ${this.changes} conexiones desactivadas para ${nombreJugador}`);
                    resolve(this.changes);
                }
            });
        });
    },
    
    // Actualizar última actividad de una conexión
    actualizarActividadConexion: (identificadorConexion) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE conexiones_activas 
                          SET ultima_actividad = CURRENT_TIMESTAMP 
                          WHERE identificador_conexion = ? AND activa = 1`;
            
            db.run(query, [identificadorConexion], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    },
    
    // Limpiar conexiones inactivas (más de 10 minutos sin actividad)
    limpiarConexionesInactivas: () => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE conexiones_activas 
                          SET activa = 0 
                          WHERE activa = 1 
                          AND datetime('now') > datetime(ultima_actividad, '+10 minutes')`;
            
            db.run(query, [], function(err) {
                if (err) {
                    reject(err);
                } else {
                    if (this.changes > 0) {
                        console.log(`🧹 ${this.changes} conexiones inactivas limpiadas`);
                    }
                    resolve(this.changes);
                }
            });
        });
    },
    
    // Obtener estadísticas de conexiones
    obtenerEstadisticasConexiones: () => {
        return new Promise((resolve, reject) => {
            const queries = {
                totalActivas: 'SELECT COUNT(*) as count FROM conexiones_activas WHERE activa = 1',
                totalHistoricas: 'SELECT COUNT(*) as count FROM conexiones_activas',
                jugadoresConMultiples: `SELECT nombre_jugador, COUNT(*) as conexiones 
                                       FROM conexiones_activas 
                                       WHERE activa = 1 
                                       GROUP BY nombre_jugador 
                                       HAVING COUNT(*) > 1`,
                topIPs: `SELECT ip_simulada, COUNT(*) as conexiones 
                        FROM conexiones_activas 
                        WHERE activa = 1 
                        GROUP BY ip_simulada 
                        ORDER BY COUNT(*) DESC 
                        LIMIT 10`
            };
            
            const resultados = {};
            let completadas = 0;
            const totalQueries = Object.keys(queries).length;
            
            Object.entries(queries).forEach(([key, query]) => {
                if (key === 'jugadoresConMultiples' || key === 'topIPs') {
                    db.all(query, [], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resultados[key] = rows;
                        completadas++;
                        if (completadas === totalQueries) {
                            resolve(resultados);
                        }
                    });
                } else {
                    db.get(query, [], (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resultados[key] = row.count;
                        completadas++;
                        if (completadas === totalQueries) {
                            resolve(resultados);
                        }
                    });
                }
            });
        });
    },
    
    // Obtener estadísticas de cuentas inactivas (para monitoreo)
    obtenerEstadisticasInactividad: () => {
        return new Promise((resolve, reject) => {
            const queries = {
                total: 'SELECT COUNT(*) as count FROM jugadores',
                inactivas30: `SELECT COUNT(*) as count FROM jugadores WHERE DATE('now') > DATE(fechaUltimoPartido, '+30 day')`,
                inactivas60: `SELECT COUNT(*) as count FROM jugadores WHERE DATE('now') > DATE(fechaUltimoPartido, '+60 day')`,
                inactivas90: `SELECT COUNT(*) as count FROM jugadores WHERE DATE('now') > DATE(fechaUltimoPartido, '+90 day')`,
                proximasEliminar: `SELECT nombre, fechaUltimoPartido FROM jugadores 
                                  WHERE DATE('now') > DATE(fechaUltimoPartido, '+80 day') 
                                  AND DATE('now') <= DATE(fechaUltimoPartido, '+90 day')
                                  ORDER BY fechaUltimoPartido ASC`
            };
            
            const resultados = {};
            let completadas = 0;
            const totalQueries = Object.keys(queries).length;
            
            Object.entries(queries).forEach(([key, query]) => {
                if (key === 'proximasEliminar') {
                    db.all(query, [], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resultados[key] = rows;
                        completadas++;
                        if (completadas === totalQueries) {
                            resolve(resultados);
                        }
                    });
                } else {
                    db.get(query, [], (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resultados[key] = row.count;
                        completadas++;
                        if (completadas === totalQueries) {
                            resolve(resultados);
                        }
                    });
                }
            });
        });
    },
    
    // ====================== NUEVO SISTEMA DE BANEOS CON TABLA DEDICADA ======================
    
    // Registrar/actualizar UID de un jugador
    actualizarUID: (nombreJugador, uid) => {
        return new Promise((resolve, reject) => {
            // Primero verificar si el jugador existe, si no, crearlo
            const selectQuery = 'SELECT id FROM jugadores WHERE nombre = ?';
            
            db.get(selectQuery, [nombreJugador], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (row) {
                    // Jugador existe, actualizar UID
                    const updateQuery = 'UPDATE jugadores SET uid = ? WHERE nombre = ?';
                    db.run(updateQuery, [uid, nombreJugador], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(`✅ UID actualizado para ${nombreJugador}: ${uid}`);
                            resolve({ jugadorId: row.id, uid: uid, actualizado: true });
                        }
                    });
                } else {
                    // Jugador no existe, crear con UID
                    const insertQuery = `INSERT INTO jugadores (nombre, uid, partidos, victorias, derrotas, 
                                        goles, asistencias, autogoles, xp, nivel, fechaPrimerPartido, fechaUltimoPartido)
                                        VALUES (?, ?, 0, 0, 0, 0, 0, 0, 40, 1, ?, ?)`;
                    const fechaActual = new Date().toISOString();
                    
                    db.run(insertQuery, [nombreJugador, uid, fechaActual, fechaActual], function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(`✅ Jugador creado con UID ${nombreJugador}: ${uid}`);
                            resolve({ jugadorId: this.lastID, uid: uid, actualizado: false });
                        }
                    });
                }
            });
        });
    },
    
    // Obtener jugador por UID
    obtenerJugadorPorUID: (uid) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM jugadores WHERE uid = ?';
            db.get(query, [uid], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    },
    
    // Banear jugador en base de datos
    banearJugador: (nombreJugador, uid, adminNombre, razon = 'Baneado por admin', tiempoMinutos = null) => {
        return new Promise((resolve, reject) => {
            const fechaBan = new Date().toISOString();
            
            console.log(`📊 [DB] Iniciando proceso de baneo para: ${nombreJugador} con UID: ${uid}`);
            console.log(`📊 [DB] Parámetros - Admin: ${adminNombre}, Razón: ${razon}, Tiempo: ${tiempoMinutos}`);
            
            // Primero asegurar que el jugador tenga UID
            dbFunctions.actualizarUID(nombreJugador, uid).then(() => {
                console.log(`✅ [DB] UID actualizado correctamente para ${nombreJugador}`);
                
                // Usar una consulta más específica para evitar problemas
                const query = `UPDATE jugadores 
                              SET baneado = 1, fecha_ban = ?, razon_ban = ?, admin_ban = ? 
                              WHERE uid = ?`;
                
                console.log(`📊 [DB] Ejecutando consulta de baneo con parámetros:`, [fechaBan, razon, adminNombre, uid]);
                
                db.run(query, [fechaBan, razon, adminNombre, uid], function(err) {
                    if (err) {
                        console.error(`❌ [DB] Error en consulta SQL de baneo:`, err);
                        console.error(`❌ [DB] Consulta que falló:`, query);
                        console.error(`❌ [DB] Parámetros que fallaron:`, [fechaBan, razon, adminNombre, uid]);
                        reject(err);
                    } else if (this.changes === 0) {
                        console.warn(`⚠️ [DB] No se encontró jugador con UID ${uid} para banear`);
                        
                        // Intentar con una búsqueda por nombre como respaldo
                        const fallbackQuery = `UPDATE jugadores 
                                              SET baneado = 1, fecha_ban = ?, razon_ban = ?, admin_ban = ? 
                                              WHERE nombre = ?`;
                        
                        console.log(`🔄 [DB] Intentando baneo por nombre: ${nombreJugador}`);
                        
                        db.run(fallbackQuery, [fechaBan, razon, adminNombre, nombreJugador], function(fallbackErr) {
                            if (fallbackErr) {
                                console.error(`❌ [DB] Error en consulta de respaldo:`, fallbackErr);
                                reject(fallbackErr);
                            } else if (this.changes === 0) {
                                const error = new Error(`Jugador no encontrado para banear: ${nombreJugador} (UID: ${uid})`);
                                console.error(`❌ [DB] ${error.message}`);
                                reject(error);
                            } else {
                                console.log(`✅ [DB] Jugador baneado por nombre: ${nombreJugador} (${this.changes} cambios)`);
                                resolve({
                                    nombreJugador,
                                    uid,
                                    adminNombre,
                                    razon,
                                    fechaBan,
                                    tiempoMinutos,
                                    cambios: this.changes,
                                    metodo: 'por_nombre'
                                });
                            }
                        });
                    } else {
                        console.log(`✅ [DB] Jugador baneado exitosamente: ${nombreJugador} (UID: ${uid}) por ${adminNombre}`);
                        console.log(`📊 [DB] Cambios realizados: ${this.changes}`);
                        resolve({
                            nombreJugador,
                            uid,
                            adminNombre,
                            razon,
                            fechaBan,
                            tiempoMinutos,
                            cambios: this.changes,
                            metodo: 'por_uid'
                        });
                    }
                });
            }).catch((uidError) => {
                console.error(`❌ [DB] Error actualizando UID antes del baneo:`, uidError);
                reject(uidError);
            });
        });
    },

    // Obtener lista de jugadores baneados en la última hora
    obtenerJugadoresBaneadosRecientes: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT nombre, uid FROM jugadores 
                          WHERE baneado = 1 AND fecha_ban >= datetime('now', '-1 hour') 
                          ORDER BY fecha_ban DESC`;
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const jugadoresBaneadosRecientes = rows.map(row => ({
                        nombre: row.nombre,
                        uid: row.uid
                    }));
                    
                    resolve(jugadoresBaneadosRecientes);
                }
            });
        });
    },

    // Obtener lista de jugadores baneados en las últimas 24 horas
    obtenerJugadoresBaneados24h: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT nombre, uid, fecha_ban, razon_ban, admin_ban FROM jugadores 
                          WHERE baneado = 1 AND fecha_ban >= datetime('now', '-24 hours') 
                          ORDER BY fecha_ban DESC`;
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const jugadoresBaneados24h = rows.map(row => ({
                        nombre: row.nombre,
                        uid: row.uid,
                        fechaBan: row.fecha_ban,
                        razonBan: row.razon_ban || 'Sin razón especificada',
                        adminBan: row.admin_ban || 'Desconocido'
                    }));
                    
                    resolve(jugadoresBaneados24h);
                }
            });
        });
    },

    // Verificar si un UID existe en la base de datos y su estado de baneo
    verificarJugadorPorUID: (uid) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT nombre, uid, baneado, fecha_ban, razon_ban, admin_ban FROM jugadores WHERE uid = ?';
            
            db.get(query, [uid], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    if (!row) {
                        resolve({
                            existe: false,
                            baneado: false,
                            nombre: null,
                            uid: uid,
                            mensaje: `No se encontró ningún jugador con UID: ${uid}`
                        });
                    } else {
                        resolve({
                            existe: true,
                            baneado: row.baneado === 1,
                            nombre: row.nombre,
                            uid: row.uid,
                            fechaBan: row.fecha_ban,
                            razonBan: row.razon_ban,
                            adminBan: row.admin_ban,
                            mensaje: row.baneado === 1 
                                ? `El jugador ${row.nombre} está baneado desde ${row.fecha_ban}` 
                                : `El jugador ${row.nombre} no está baneado`
                        });
                    }
                }
            });
        });
    },

    // Desbanear jugador en base de datos
    desbanearJugador: (uid) => {
        return new Promise((resolve, reject) => {
            // Primero obtener información del jugador baneado
            const selectQuery = 'SELECT * FROM jugadores WHERE uid = ? AND baneado = 1';
            
            db.get(selectQuery, [uid], (err, jugador) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!jugador) {
                    reject(new Error('Jugador no encontrado o no está baneado'));
                    return;
                }
                
                // Desbanear en la base de datos
                const updateQuery = `UPDATE jugadores 
                                    SET baneado = 0, fecha_ban = NULL, razon_ban = NULL, admin_ban = NULL 
                                    WHERE uid = ?`;
                
                db.run(updateQuery, [uid], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`✅ Jugador desbaneado en DB: ${jugador.nombre} (UID: ${uid})`);
                        resolve({
                            nombreJugador: jugador.nombre,
                            uid: uid,
                            fechaBanOriginal: jugador.fecha_ban,
                            razonOriginal: jugador.razon_ban,
                            adminOriginal: jugador.admin_ban,
                            cambios: this.changes
                        });
                    }
                });
            });
        });
    },
    
    // Verificar si un jugador está baneado
    verificarBaneoJugador: (nombreJugador, uid = null) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM jugadores WHERE baneado = 1 AND (nombre = ?';
            let params = [nombreJugador];
            
            if (uid) {
                query += ' OR uid = ?';
                params.push(uid);
            }
            
            query += ')';
            
            db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    const estaBaneado = !!row;
                    resolve({
                        estaBaneado,
                        datosJugador: row,
                        nombreJugador: row?.nombre || nombreJugador,
                        uid: row?.uid || uid,
                        fechaBan: row?.fecha_ban,
                        razonBan: row?.razon_ban,
                        adminBan: row?.admin_ban
                    });
                }
            });
        });
    },
    
    // Obtener lista de jugadores baneados
    obtenerJugadoresBaneados: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT nombre, uid, fecha_ban, razon_ban, admin_ban 
                          FROM jugadores 
                          WHERE baneado = 1 
                          ORDER BY fecha_ban DESC`;
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const jugadoresBaneados = rows.map(row => ({
                        nombre: row.nombre,
                        uid: row.uid,
                        fechaBan: row.fecha_ban,
                        razonBan: row.razon_ban || 'Sin razón especificada',
                        adminBan: row.admin_ban || 'Desconocido',
                        diasBaneado: row.fecha_ban ? Math.floor((new Date() - new Date(row.fecha_ban)) / (1000 * 60 * 60 * 24)) : 0
                    }));
                    
                    resolve(jugadoresBaneados);
                }
            });
        });
    },
    
    // ====================== FUNCIONES PARA NUEVO SISTEMA DE BANEOS CON TABLA BANEOS ======================
    
    // Crear baneo en la nueva tabla baneos
    crearBaneo: (authId, nombre, razon, admin, duracion = 0) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO baneos (auth_id, nombre, razon, admin, fecha, duracion, activo)
                          VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, 1)`;
            
            db.run(query, [authId, nombre, razon, admin, duracion], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`✅ Nuevo baneo creado: ${nombre} (ID: ${this.lastID})`);
                    resolve({
                        id: this.lastID,
                        authId: authId,
                        nombre: nombre,
                        razon: razon,
                        admin: admin,
                        duracion: duracion
                    });
                }
            });
        });
    },
    
    // Verificar si un jugador está baneado (nueva tabla)
    estaBaneado: (authId, callback) => {
        // Verificar que el callback sea una función
        if (typeof callback !== 'function') {
            console.error('❌ ERROR: estaBaneado requiere un callback válido');
            return;
        }
        
        const query = `SELECT * FROM baneos 
                      WHERE auth_id = ? AND activo = 1 
                      ORDER BY fecha DESC LIMIT 1`;
        
        db.get(query, [authId], (err, row) => {
            if (err || !row) {
                callback(false);
                return;
            }
            
            // Verificar si el baneo temporal ha expirado
            if (row.duracion > 0) {
                const fechaBan = new Date(row.fecha);
                const ahora = new Date();
                const tiempoTranscurrido = ahora.getTime() - fechaBan.getTime();
                const tiempoLimite = row.duracion * 60 * 1000; // duracion en minutos a milisegundos
                
                if (tiempoTranscurrido >= tiempoLimite) {
                    // Baneo temporal expirado, desactivar automáticamente
                    dbFunctions.desactivarBaneo(row.id)
                        .then(() => {
                            console.log(`⏰ Baneo temporal expirado automáticamente: ${row.nombre}`);
                            callback(false);
                        })
                        .catch(() => {
                            callback(false);
                        });
                    return;
                }
            }
            
            callback(row);
        });
    },
    
    // Desactivar baneo (desbanear) manteniendo historial
    desactivarBaneo: (baneoId) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE baneos SET activo = 0 WHERE id = ?`;
            
            db.run(query, [baneoId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`✅ Baneo desactivado: ID ${baneoId}`);
                    resolve({
                        baneoId: baneoId,
                        cambios: this.changes
                    });
                }
            });
        });
    },
    
    // Desbanear por auth_id
    desbanearJugadorNuevo: (authId) => {
        return new Promise((resolve, reject) => {
            // Primero obtener información del baneo activo
            const selectQuery = `SELECT * FROM baneos WHERE auth_id = ? AND activo = 1 LIMIT 1`;
            
            db.get(selectQuery, [authId], (err, baneo) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!baneo) {
                    reject(new Error('No se encontró baneo activo para este jugador'));
                    return;
                }
                
                // Desactivar el baneo
                const updateQuery = `UPDATE baneos SET activo = 0 WHERE auth_id = ? AND activo = 1`;
                
                db.run(updateQuery, [authId], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`✅ Jugador desbaneado: ${baneo.nombre} (Auth: ${authId})`);
                        resolve({
                            authId: authId,
                            nombre: baneo.nombre,
                            fechaBanOriginal: baneo.fecha,
                            razonOriginal: baneo.razon,
                            adminOriginal: baneo.admin,
                            cambios: this.changes
                        });
                    }
                });
            });
        });
    },
    
    // Obtener baneos activos (excluyendo temporales expirados)
    obtenerBaneosActivos: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const query = `SELECT * FROM baneos WHERE activo = 1 ORDER BY fecha DESC`;
                
                db.all(query, [], async (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    const ahora = new Date();
                    const baneosRealmenteActivos = [];
                    const baneosExpiradosALimpiar = [];
                    
                    // Procesar cada baneo para verificar si realmente está activo
                    for (const row of rows) {
                        // Verificar si es baneo temporal
                        if (row.duracion > 0) {
                            const fechaBan = new Date(row.fecha);
                            const tiempoTranscurrido = ahora.getTime() - fechaBan.getTime();
                            const tiempoLimite = row.duracion * 60 * 1000; // duración en minutos a milisegundos
                            
                            if (tiempoTranscurrido >= tiempoLimite) {
                                // Baneo temporal expirado
                                console.log(`⏰ Detectado baneo temporal expirado: ${row.nombre} (${Math.floor(tiempoTranscurrido / (60 * 1000))} min transcurridos de ${row.duracion} min límite)`);
                                baneosExpiradosALimpiar.push(row.id);
                                continue; // No incluir en la lista de activos
                            }
                        }
                        
                        // Baneo realmente activo (permanente o temporal no expirado)
                        baneosRealmenteActivos.push({
                            id: row.id,
                            authId: row.auth_id,
                            nombre: row.nombre,
                            razon: row.razon,
                            admin: row.admin,
                            fecha: row.fecha,
                            duracion: row.duracion,
                            diasBaneado: Math.floor((ahora - new Date(row.fecha)) / (1000 * 60 * 60 * 24))
                        });
                    }
                    
                    // Limpiar automáticamente baneos temporales expirados
                    if (baneosExpiradosALimpiar.length > 0) {
                        console.log(`🧹 Limpiando automáticamente ${baneosExpiradosALimpiar.length} baneos temporales expirados...`);
                        
                        for (const baneoId of baneosExpiradosALimpiar) {
                            try {
                                await dbFunctions.desactivarBaneo(baneoId);
                                console.log(`✅ Baneo temporal expirado limpiado: ID ${baneoId}`);
                            } catch (cleanupError) {
                                console.error(`❌ Error limpiando baneo expirado ID ${baneoId}:`, cleanupError);
                            }
                        }
                    }
                    
                    console.log(`📊 Baneos procesados: ${rows.length} total, ${baneosRealmenteActivos.length} realmente activos, ${baneosExpiradosALimpiar.length} expirados limpiados`);
                    resolve(baneosRealmenteActivos);
                });
                
            } catch (error) {
                console.error('❌ Error en obtenerBaneosActivos:', error);
                reject(error);
            }
        });
    },
    
    // Obtener historial completo de baneos (activos e inactivos)
    obtenerHistorialBaneos: (limite = 50) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM baneos ORDER BY fecha DESC LIMIT ?`;
            
            db.all(query, [limite], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const historialFormateado = rows.map(row => ({
                        id: row.id,
                        authId: row.auth_id,
                        nombre: row.nombre,
                        razon: row.razon,
                        admin: row.admin,
                        fecha: row.fecha,
                        duracion: row.duracion,
                        activo: row.activo === 1,
                        diasTranscurridos: Math.floor((new Date() - new Date(row.fecha)) / (1000 * 60 * 60 * 24))
                    }));
                    
                    resolve(historialFormateado);
                }
            });
        });
    },
    
    // Obtener baneos recientes (últimas 24 horas)
    obtenerBaneosRecientes: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM baneos 
                          WHERE fecha >= datetime('now', '-24 hours') 
                          ORDER BY fecha DESC`;
            
            db.all(query, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const baneosRecientes = rows.map(row => ({
                        id: row.id,
                        authId: row.auth_id,
                        nombre: row.nombre,
                        razon: row.razon,
                        admin: row.admin,
                        fecha: row.fecha,
                        duracion: row.duracion,
                        activo: row.activo === 1,
                        horasTranscurridas: Math.floor((new Date() - new Date(row.fecha)) / (1000 * 60 * 60))
                    }));
                    
                    resolve(baneosRecientes);
                }
            });
        });
    },
    
    // Buscar jugador por auth_id en baneos
    buscarJugadorEnBaneos: (authId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM baneos WHERE auth_id = ? ORDER BY fecha DESC LIMIT 1`;
            
            db.get(query, [authId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? {
                        id: row.id,
                        authId: row.auth_id,
                        nombre: row.nombre,
                        razon: row.razon,
                        admin: row.admin,
                        fecha: row.fecha,
                        duracion: row.duracion,
                        activo: row.activo === 1
                    } : null);
                }
            });
        });
    },
    
    // Estadísticas de baneos
    obtenerEstadisticasBaneos: () => {
        return new Promise((resolve, reject) => {
            const queries = {
                totalBaneos: 'SELECT COUNT(*) as count FROM baneos',
                baneosActivos: 'SELECT COUNT(*) as count FROM baneos WHERE activo = 1',
                baneosInactivos: 'SELECT COUNT(*) as count FROM baneos WHERE activo = 0',
                baneos24h: 'SELECT COUNT(*) as count FROM baneos WHERE fecha >= datetime("now", "-24 hours")',
                baneos7dias: 'SELECT COUNT(*) as count FROM baneos WHERE fecha >= datetime("now", "-7 days")',
                baneosTemporales: 'SELECT COUNT(*) as count FROM baneos WHERE duracion > 0',
                baneosPermanentes: 'SELECT COUNT(*) as count FROM baneos WHERE duracion = 0'
            };
            
            const resultados = {};
            let completadas = 0;
            const totalQueries = Object.keys(queries).length;
            
            Object.entries(queries).forEach(([key, query]) => {
                db.get(query, [], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resultados[key] = row.count;
                    completadas++;
                    if (completadas === totalQueries) {
                        resolve(resultados);
                    }
                });
            });
        });
    }
};
*/

// Configuración del bot (igual que el original)
const roomConfig = {
    roomName: "⚡🔥🟣 ❰LNB❱ JUEGAN TODOS X7 🟣🔥⚡",
    playerName: "",
    password: null,
    maxPlayers: 18,
    public: true,  // Cambiar a true para que la sala sea pública
    token: "thr1.AAAAAGjQZSmwM4FSEjO48A.DgVKSIfRVJw", // Token actualizado
    geo: { code: 'AR', lat: -34.7000, lon: -58.2800 },  // Ajustado para Quilmes, Buenos Aires
    noPlayer: true
};

// Webhooks (mantener los originales)
const webhooks = {
    discord: "https://discord.com/api/webhooks/1389450191396143265/JxHRCmfNCFooAr3YjynXPmihlVSjnGw-FLql4VUHNUx15Yl8d8BipjaRd51uXpcXfiXv",
    banKick: "https://discord.com/api/webhooks/1392211274888122529/c8c1N6c4pWCIL9WyO3GLOPafo_lcbl3ae1E6CoZc-hzVc54_za4yqdNg3wRLGFuTyDPm",
    llamarAdmin: "https://discord.com/api/webhooks/1389648292987666662/0fn4qY2ITwfTzKvPt19fC3MPUjXuxGZvJUZHLSVZ9l3lFQe2s2vt-crhx7DOT6ogx8aF",
    reportesSala: "https://discord.com/api/webhooks/1390368471577133187/-QKunqo71mOgK_op4dZxP4lK3HVA7Utqs9bFP5dRyyexKUdOUCSV573sz1eZvirS8JUA"
};

// Función principal
(async () => {
    try {
        console.log('\n' + '='.repeat(80));
        console.log('🚀 INICIANDO BOT LNB - VERSIÓN PUPPETEER');
        console.log('📅 Fecha/Hora:', new Date().toLocaleString());
        console.log('📂 Directorio de trabajo:', process.cwd());
        console.log('='.repeat(80) + '\n');
        
        // Crear tablas de base de datos
        crearTablas();
        
        // Ajustes de entorno para evitar uso de D-Bus y runtime dirs inexistentes
        try {
            if (!process.env.XDG_RUNTIME_DIR) process.env.XDG_RUNTIME_DIR = '/tmp';
            process.env.DBUS_SESSION_BUS_ADDRESS = '/dev/null';
            process.env.DBUS_SYSTEM_BUS_ADDRESS = '/dev/null';
            process.env.USE_DBUS = '0';
            process.env.QT_QUICK_BACKEND = 'software';
        } catch {}

        // Lanzar Puppeteer (flags adicionales para mayor estabilidad)
        const browser = await puppeteer.launch({ 
            headless: 'new',
            dumpio: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor,AudioServiceOutOfProcess,AudioServiceSandbox,MojoVideoCapture,UseOzonePlatform',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--no-zygote',
                '--no-first-run',
                '--no-default-browser-check',
                '--disable-extensions',
                '--disable-background-timer-throttling',
                '--disable-renderer-backgrounding',
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
'--force-color-profile=srgb',
                '--disable-features=WebRtcHideLocalIpsWithMdns',
                '--force-webrtc-ip-handling-policy=default_public_interface_only'
            ]
        });
        
        try {
            const execPath = (typeof puppeteer.executablePath === 'function') ? puppeteer.executablePath() : 'N/A';
            console.log('[PUPPETEER] Executable path:', execPath);
        } catch (e) {
            console.log('[PUPPETEER] Executable path error:', e.message);
        }
        
        const page = await browser.newPage();
        
        // Configurar página
        await page.setViewport({ width: 1280, height: 720 });
        
        // Exponer funciones de Node.js al contexto del navegador
        await page.exposeFunction('nodeGuardarJugador', dbFunctions.guardarJugador);
        await page.exposeFunction('nodeObtenerJugador', dbFunctions.obtenerJugador);
        // NUEVO: Exponer funciones basadas en auth_id
        await page.exposeFunction('nodeGuardarJugadorPorAuth', dbFunctions.guardarJugadorPorAuth);
        await page.exposeFunction('nodeObtenerJugadorPorAuth', dbFunctions.obtenerJugadorPorAuth);
        await page.exposeFunction('nodeObtenerJugadorPorCodigoRecuperacion', dbFunctions.obtenerJugadorPorCodigoRecuperacion);
        await page.exposeFunction('nodeMigrarJugadorAAuth', dbFunctions.migrarJugadorAAuth);
        await page.exposeFunction('nodeRegistrarNombreJugador', dbFunctions.registrarNombreJugador);
        await page.exposeFunction('nodeObtenerTopJugadores', dbFunctions.obtenerTopJugadores);
        await page.exposeFunction('nodeObtenerTopDesdeBackup', dbFunctions.obtenerTopDesdeBackup);
        await page.exposeFunction('nodeGuardarPartido', dbFunctions.guardarPartido);
        
        // Exponer función para obtener todos los jugadores (para carga completa de estadísticas)
        await page.exposeFunction('nodeObtenerTodosJugadores', dbFunctions.obtenerTodosJugadores);
        
        // Exponer funciones de limpieza de cuentas inactivas
        await page.exposeFunction('nodeEliminarCuentasInactivas', dbFunctions.eliminarCuentasInactivas);
        await page.exposeFunction('nodeObtenerEstadisticasInactividad', dbFunctions.obtenerEstadisticasInactividad);
        
        // Exponer funciones VIP
        await page.exposeFunction('nodeActivarVIP', dbFunctions.activarVIP);
        await page.exposeFunction('nodeDesactivarVIP', dbFunctions.desactivarVIP);
        await page.exposeFunction('nodeEsJugadorVIP', dbFunctions.esJugadorVIP);
        await page.exposeFunction('nodeObtenerJugadoresVIP', dbFunctions.obtenerJugadoresVIP);
        await page.exposeFunction('nodeLimpiarVIPsExpirados', dbFunctions.limpiarVIPsExpirados);

        // Exponer API de Football (desde caché)
        await page.exposeFunction('nodeGetCachedFixtures', () => cachedFixtures);
        
        // Exponer funciones de control de conexiones múltiples (solo las que existen)
        await page.exposeFunction('nodeRegistrarConexion', dbFunctions.registrarConexion);
        await page.exposeFunction('nodeVerificarConexionesExistentes', dbFunctions.verificarConexionesExistentes);
        await page.exposeFunction('nodeLimpiarConexionesInactivas', dbFunctions.limpiarConexionesInactivas);
        
        // Exponer funciones del nuevo sistema de baneos (tabla baneos) - solo las que existen
        await page.exposeFunction('nodeCrearBaneo', dbFunctions.crearBaneo);
        
        // Exponer la nueva función basada en promesas
        await page.exposeFunction('nodeEstaBaneadoPromise', async (authId) => {
            try {
                console.log('🔍 DEBUG: nodeEstaBaneadoPromise llamado con authId:', authId);
                const resultado = await dbFunctions.estaBaneadoPromise(authId);
                console.log('🔍 DEBUG: Resultado del baneo:', resultado ? 'BANEADO' : 'NO BANEADO');
                return resultado;
            } catch (error) {
                console.error('❌ Error en nodeEstaBaneadoPromise:', error);
                return false;
            }
        });
        
        // Mantener el wrapper de callback para compatibilidad (pero mejorado)
        await page.exposeFunction('nodeEstaBaneado', (authId, callback) => {
            try {
                console.log('🔍 DEBUG: nodeEstaBaneado llamado con:', { authId, callbackType: typeof callback });
                
                // Validar que callback sea válido antes de pasarlo a la función real
                if (typeof callback !== 'function') {
                    console.error('❌ ERROR: nodeEstaBaneado - callback inválido:', callback);
                    // Crear callback por defecto
                    callback = (result) => {
                        console.log('⚠️ Callback por defecto ejecutado, resultado:', result ? 'baneado' : 'no baneado');
                    };
                }
                
                // Llamar a la función real de la base de datos
                return dbFunctions.estaBaneado(authId, callback);
            } catch (error) {
                console.error('❌ Error en wrapper nodeEstaBaneado:', error);
                // Fallback para evitar que la aplicación se cuelgue
                if (typeof callback === 'function') {
                    callback(false);
                }
            }
        });
        
        await page.exposeFunction('nodeDesactivarBaneo', dbFunctions.desactivarBaneo);
        await page.exposeFunction('nodeDesbanearJugadorNuevo', dbFunctions.desbanearJugadorNuevo);
        await page.exposeFunction('nodeObtenerBaneosActivos', dbFunctions.obtenerBaneosActivos);
        
        // Exponer funciones de tracking de salidas
        await page.exposeFunction('nodeRegistrarSalidaJugador', dbFunctions.registrarSalidaJugador);
        await page.exposeFunction('nodeObtenerUltimasSalidas', dbFunctions.obtenerUltimasSalidas);

// Integrar sistemas compartidos con medición y manejo de errores adicional
await page.exposeFunction('cargarEstadisticasGlobales', async () => {
    const t0 = Date.now();
    try {
        const res = await dbFunctions.cargarEstadisticasGlobales();
        const ms = Date.now() - t0;
        console.log(`⏱️ [DB] cargarEstadisticasGlobales completado en ${ms} ms`);
        return res;
    } catch (e) {
        const ms = Date.now() - t0;
        console.error(`❌ [DB] cargarEstadisticasGlobales falló tras ${ms} ms:`, e.message);
        throw e;
    }
});
await page.exposeFunction('guardarEstadisticasGlobales', async (datos) => {
    const t0 = Date.now();
    try {
        const res = await dbFunctions.guardarEstadisticasGlobales(datos);
        const ms = Date.now() - t0;
        console.log(`⏱️ [DB] guardarEstadisticasGlobales completado en ${ms} ms`);
        return res;
    } catch (e) {
        const ms = Date.now() - t0;
        console.error(`❌ [DB] guardarEstadisticasGlobales falló tras ${ms} ms:`, e.message);
        throw e;
    }
});
        
        // Exponer funciones del sistema de roles persistentes
        await page.exposeFunction('nodeGetRole', async (authID, playerName = null) => {
            try {
                console.log(`🔍 nodeGetRole llamado: authID=${authID}, playerName=${playerName}`);
                const result = rolesPersistentSystem.getRole(authID, playerName);
                console.log(`🔍 nodeGetRole resultado:`, result ? `${result.role} para ${result.playerName}` : 'null');
                return result;
            } catch (error) {
                console.error('❌ Error en nodeGetRole:', error);
                return null;
            }
        });
        
        await page.exposeFunction('nodeAssignRole', async (authID, role, assignedBy, playerName, alternativeIds = {}) => {
            try {
                console.log(`🔑 nodeAssignRole llamado: authID=${authID}, role=${role}, playerName=${playerName}`);
                const result = rolesPersistentSystem.assignRole(authID, role, assignedBy, playerName, alternativeIds);
                console.log(`🔑 nodeAssignRole resultado:`, result);
                return result;
            } catch (error) {
                console.error('❌ Error en nodeAssignRole:', error);
                return { ok: false, reason: 'ERROR' };
            }
        });
        
        await page.exposeFunction('nodeRemoveRole', async (authID) => {
            try {
                console.log(`🗑️ nodeRemoveRole llamado: authID=${authID}`);
                const result = rolesPersistentSystem.removeRole(authID);
                console.log(`🗑️ nodeRemoveRole resultado:`, result);
                return result;
            } catch (error) {
                console.error('❌ Error en nodeRemoveRole:', error);
                return false;
            }
        });
        
        await page.exposeFunction('nodeHasRole', async (authID, role, playerName = null) => {
            try {
                console.log(`🔒 nodeHasRole llamado: authID=${authID}, role=${role}, playerName=${playerName}`);
                const result = rolesPersistentSystem.hasRole(authID, role, playerName);
                console.log(`🔒 nodeHasRole resultado:`, result);
                return result;
            } catch (error) {
                console.error('❌ Error en nodeHasRole:', error);
                return false;
            }
        });
        
        await page.exposeFunction('nodeUpdateLastSeen', async (authID, playerName) => {
            try {
                console.log(`📝 nodeUpdateLastSeen llamado: authID=${authID}, playerName=${playerName}`);
                rolesPersistentSystem.updateLastSeen(authID, playerName);
                console.log(`📝 nodeUpdateLastSeen completado`);
                return true;
            } catch (error) {
                console.error('❌ Error en nodeUpdateLastSeen:', error);
                return false;
            }
        });
        
        await page.exposeFunction('nodeGetAllRoles', async () => {
            try {
                console.log(`📋 nodeGetAllRoles llamado`);
                const result = rolesPersistentSystem.getAllRoles();
                console.log(`📋 nodeGetAllRoles resultado: ${result.length} roles`);
                return result;
            } catch (error) {
                console.error('❌ Error en nodeGetAllRoles:', error);
                return { totalRoles: 0, superAdmins: 0, adminsFull: 0, adminsBasico: 0 };
            }
        });
        
        // Exponer funciones del sistema de festejos persistentes
        await page.exposeFunction('nodeCargarFestejos', async (authId, playerName) => {
            try {
                console.log('🎉 nodeCargarFestejos llamado:', authId, playerName);
                if (sistemaFestejosPersistente) {
                    const result = await sistemaFestejosPersistente.cargarFestejosJugador(authId, playerName);
                    console.log('🎉 nodeCargarFestejos resultado:', result);
                    return result;
                } else {
                    console.warn('⚠️ Sistema de festejos persistentes no disponible');
                    return null;
                }
            } catch (error) {
                console.error('❌ Error en nodeCargarFestejos:', error);
                return null;
            }
        });
        
        await page.exposeFunction('nodeGuardarFestejo', async (authId, playerName, tipo, mensaje) => {
            try {
                console.log('💾 nodeGuardarFestejo llamado:', authId, playerName, tipo, mensaje);
                if (sistemaFestejosPersistente) {
                    const result = await sistemaFestejosPersistente.guardarFestejo(authId, playerName, tipo, mensaje);
                    console.log('💾 nodeGuardarFestejo resultado:', result);
                    return result;
                } else {
                    console.warn('⚠️ Sistema de festejos persistentes no disponible');
                    return { ok: false, error: 'Sistema no disponible' };
                }
            } catch (error) {
                console.error('❌ Error en nodeGuardarFestejo:', error);
                return { ok: false, error: error.message };
            }
        });
        
        await page.exposeFunction('nodeObtenerMensajeFestejo', async (authId, tipo) => {
            try {
                console.log('🎯 nodeObtenerMensajeFestejo llamado:', authId, tipo);
                if (sistemaFestejosPersistente) {
                    const result = sistemaFestejosPersistente.obtenerMensajeFestejo(authId, tipo);
                    console.log('🎯 nodeObtenerMensajeFestejo resultado:', result);
                    return result;
                } else {
                    console.warn('⚠️ Sistema de festejos persistentes no disponible');
                    return null;
                }
            } catch (error) {
                console.error('❌ Error en nodeObtenerMensajeFestejo:', error);
                return null;
            }
        });
        
        await page.exposeFunction('nodeTieneFestejos', async (authId) => {
            try {
                console.log('🔍 nodeTieneFestejos llamado:', authId);
                if (sistemaFestejosPersistente) {
                    const result = sistemaFestejosPersistente.tieneFestejos(authId);
                    console.log('🔍 nodeTieneFestejos resultado:', result);
                    return result;
                } else {
                    console.warn('⚠️ Sistema de festejos persistentes no disponible');
                    return false;
                }
            } catch (error) {
                console.error('❌ Error en nodeTieneFestejos:', error);
                return false;
            }
        });
        
        await page.exposeFunction('nodeLimpiarFestejos', async (authId, playerName, tipo) => {
            try {
                console.log('🧹 nodeLimpiarFestejos llamado:', authId, playerName, tipo);
                if (sistemaFestejosPersistente) {
                    const result = await sistemaFestejosPersistente.limpiarFestejos(authId, playerName, tipo);
                    console.log('🧹 nodeLimpiarFestejos resultado:', result);
                    return result;
                } else {
                    console.warn('⚠️ Sistema de festejos persistentes no disponible');
                    return { ok: false, error: 'Sistema no disponible' };
                }
            } catch (error) {
                console.error('❌ Error en nodeLimpiarFestejos:', error);
                return { ok: false, error: error.message };
            }
        });
        
        await page.exposeFunction('nodeGetRoleStats', async () => {
            try {
                console.log(`📊 nodeGetRoleStats llamado`);
                const result = rolesPersistentSystem.getStats();
                console.log(`📊 nodeGetRoleStats resultado:`, result);
                return result;
            } catch (error) {
                console.error('❌ Error en nodeGetRoleStats:', error);
                return { totalRoles: 0, superAdmins: 0, adminsFull: 0, adminsBasico: 0 };
            }
        });

        await page.exposeFunction('nodeEnviarWebhook', async (webhookUrl, payload) => {
            try {
                // Agregar wait=true para obtener el ID del mensaje en la respuesta
                const webhookUrlConWait = webhookUrl.includes('?') 
                    ? `${webhookUrl}&wait=true`
                    : `${webhookUrl}?wait=true`;
                
                // console.log('📤 DEBUG: Enviando webhook a:', webhookUrlConWait);
                // console.log('📦 DEBUG: Payload:', JSON.stringify(payload, null, 2));
                
                const response = await fetch(webhookUrlConWait, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                // console.log('📡 DEBUG: Respuesta status:', response.status);
                // console.log('📡 DEBUG: Respuesta headers:', Object.fromEntries(response.headers.entries()));
                // console.log('📡 DEBUG: Respuesta URL completa:', response.url);
                
                if (response.ok) {
                    const responseText = await response.text();
                    // console.log('📍 DEBUG: Respuesta texto:', responseText);
                    // console.log('📍 DEBUG: Longitud respuesta:', responseText ? responseText.length : 0);
                    
                    // Verificar si la respuesta está vacía o no es JSON válido
                    if (!responseText || responseText.trim() === '') {
                        // console.log('✅ DEBUG: Webhook enviado exitosamente (respuesta vacía)');
                        return {
                            success: true,
                            messageId: null,
                            data: null
                        };
                    }
                    
                    try {
                        const data = JSON.parse(responseText);
                        // console.log('✅ DEBUG: Webhook enviado exitosamente con datos:', data);
                        return {
                            success: true,
                            messageId: data.id || null,
                            data: data
                        };
                    } catch (jsonError) {
                        console.error('❌ DEBUG: Error parseando JSON:', jsonError);
                        console.log('📋 DEBUG: Respuesta que causó error:', responseText);
                        // Aún consideramos exitoso si el status es OK
                        return {
                            success: true,
                            messageId: null,
                            data: null
                        };
                    }
                } else {
                    const errorText = await response.text();
                    console.error('❌ DEBUG: Error en webhook - Status:', response.status, 'Body:', errorText);
                    return { success: false, status: response.status, error: errorText };
                }
            } catch (error) {
                console.error('❌ Error enviando webhook:', error);
                return { success: false, error: error.message };
            }
        });
        
        // Nueva función para editar mensajes de Discord
        await page.exposeFunction('nodeEditarMensajeDiscord', async (webhookUrl, messageId, payload) => {
            try {
                const editUrl = `${webhookUrl}/messages/${messageId}`;
                const response = await fetch(editUrl, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return {
                        success: true,
                        messageId: data.id,
                        data: data
                    };
                }
                return { success: false, status: response.status };
            } catch (error) {
                console.error('Error editando mensaje Discord:', error);
                return { success: false, error: error.message };
            }
        });
        
        // ==================== SISTEMA DE PARTIDOS EN VIVO ====================
        let cachedFixtures = [];

        const updateAndAnnounceFixtures = async (page) => {
            try {
                console.log('🔄 Actualizando lista de partidos en vivo...');
                const liveFixtures = await getLiveFixtures();
                cachedFixtures = liveFixtures || [];
                console.log(`✅ Lista de partidos actualizada. ${cachedFixtures.length} partidos en caché.`);

                if (cachedFixtures.length > 0) {
                    let announcement = '⚽ Anuncio: Partidos en Vivo ⚽';
                    cachedFixtures.slice(0, 3).forEach(fixture => {
                        const league = fixture.league.name;
                        const teams = `${fixture.teams.home.name} vs ${fixture.teams.away.name}`;
                        const score = `${fixture.goals.home} - ${fixture.goals.away}`;
                        const minute = fixture.fixture.status.elapsed;
                        announcement += `\n🏆 ${league}: ${teams} | ${score} (${minute}')`;
                    });

                    await page.evaluate((msg) => {
                        if (typeof room !== 'undefined' && room && room.getPlayerList().length > 1) {
                            room.sendAnnouncement(msg, null, 0x87CEEB, 'normal', 2);
                        }
                    }, announcement);
                    console.log('📢 Anuncio de partidos en vivo enviado.');
                }
            } catch (error) {
                console.error('❌ Error en la actualización automática de partidos:', error);
            }
        };

        // Iniciar el ciclo de actualización y anuncios
        console.log('⏰ Programando actualización de partidos en vivo cada 15 minutos.');
        setTimeout(() => updateAndAnnounceFixtures(page), 45000); // Primera ejecución a los 45s
        setInterval(() => updateAndAnnounceFixtures(page), 15 * 60 * 1000); // Ciclo de 15 min

        console.log('🌐 Navegando a HaxBall Headless...');
        await page.goto('https://www.haxball.com/headless', { waitUntil: 'networkidle0' });
        
        // Esperar a que HBInit esté disponible
        await page.waitForFunction('typeof HBInit !== "undefined"', { timeout: 30000 });
        
        // IMPORTANTE: Configurar capturador de logs ANTES de inyectar el código
        // Capturar TODOS los mensajes de consola del navegador
        page.on('console', async (msg) => {
            const text = msg.text();
            const type = msg.type();
            
            // Mostrar TODOS los console.log del navegador
            if (type === 'log') {
                console.log(`[BROWSER LOG] ${text}`);
            }
            
            // Capturar mensajes de advertencia también
            if (type === 'warning') {
                console.warn(`[BROWSER WARN] ${text}`);
            }
            
            // Capturar mensajes de error también
            if (type === 'error') {
                console.error(`[BROWSER ERROR] ${text}`);
            }
            
            // Capturar mensajes de info también
            if (type === 'info') {
                console.info(`[BROWSER INFO] ${text}`);
            }
            
            // Capturar específicamente el enlace de la sala con más patrones
            if (text.includes('🔗') || 
                text.includes('ENLACE DE LA SALA') || 
                text.includes('https://www.haxball.com/play?c=') ||
                text.includes('enlaceRealSala') ||
                text.match(/https:\/\/www\.haxball\.com\/play\?c=[a-zA-Z0-9]+/)) {
                
                // Solo mostrar logs si no es el enlace temporal de inicialización
                if (!text.includes('abcd1234')) {
                    console.log(`🔗 [ENLACE DETECTADO] ${text}`);
                }
                
                // Extraer el enlace si está en el texto
                const linkMatch = text.match(/https:\/\/www\.haxball\.com\/play\?c=[a-zA-Z0-9]+/);
                if (linkMatch && !linkMatch[0].includes('abcd1234')) {
                    console.log(`🎯 [ENLACE EXTRAÍDO] ${linkMatch[0]}`);
                }
            }
        });
        
        // Leer el código completo del bot desde el archivo separado
        const botCompleto = fs.readFileSync(path.join(__dirname, 'BOTLNBCODE.js'), 'utf8');
        
        // Inyectar el código completo del bot con manejo de errores
        try {
            await page.evaluate((codigo) => {
                console.log('🔧 DEBUG: Iniciando evaluación del código del bot...');
                
                try {
                    // Declarar variables globales antes de evaluar el código
                    window.estadisticasGlobales = {};
                    window.enlaceRealSala = "https://www.haxball.com/play?c=abcd1234";
                    window.enlaceRealConfirmado = false;
                    
                    // Envolver el código en una función anónima para evitar problemas con await en el nivel superior
                    const codeWrapper = `
                        (function() {
                            try {
                                ${codigo}
                                console.log('✅ DEBUG: Código del bot ejecutado sin errores de sintaxis');
                                return true;
                            } catch (err) {
                                console.error('❌ DEBUG: Error en el código del bot:', err.message);
                                console.error('📍 DEBUG: Stack trace:', err.stack);
                                return false;
                            }
                        })();
                    `;
                    
                    // Evaluar el código usando eval encapsulado
                    try {
                        eval(codeWrapper);
                        console.log('✅ DEBUG: eval() ejecutado sin errores de sintaxis');
                    } catch (parseErr) {
                        console.error('❌ DEBUG: Error evaluando código:', parseErr.message);
                        console.error('📍 DEBUG: Stack trace:', parseErr.stack);
                        throw parseErr;
                    }
                    
                    console.log('✅ DEBUG: Código evaluado correctamente');
                    
                    // Verificar disponibilidad de HBInit
                    if (typeof HBInit === 'undefined') {
                        console.error('❌ CRITICAL: HBInit no está disponible en el contexto del navegador');
                        return;
                    }
                    
                    console.log('✅ DEBUG: HBInit está disponible');
                    
                    // El bot se inicializa automáticamente en BOTLNBCODE.js
                    // No necesitamos llamar manualmente a inicializar() para evitar doble inicialización
                    console.log('🔧 DEBUG: Inicialización automática en progreso...');
                    
                    // Esperar a que el bot se inicialice automáticamente
                    setTimeout(() => {
                        if (typeof room !== 'undefined' && room) {
                            console.log('✅ DEBUG: Bot inicializado automáticamente');
                        } else {
                            console.log('⚠️ DEBUG: Bot no inicializado después del timeout');
                        }
                    }, 2000);
                    
                    // Verificar que las funciones principales del bot estén disponibles
                    if (typeof room !== 'undefined' && room) {
                        console.log('✅ DEBUG: Objeto room creado correctamente');
                        
                        // Configurar onRoomLink manualmente si no está definido
                        if (typeof room.onRoomLink === 'undefined') {
                            console.log('🔧 DEBUG: Configurando onRoomLink manualmente...');
                            room.onRoomLink = function(url) {
                                console.log('🔗 ¡¡¡Enlace de la sala recibido: ' + url);
                                if (typeof enlaceRealSala !== 'undefined') {
                                    enlaceRealSala = url;
                                    window.enlaceRealSala = url;
                                }
                            };
                        }
                        
                        // Verificar si el room tiene método para obtener enlace
                        if (typeof room.getLink === 'function') {
                            try {
                                const linkActual = room.getLink();
                                if (linkActual && linkActual !== 'https://www.haxball.com/play?c=abcd1234') {
                                    console.log('🔗 DEBUG: Enlace obtenido con getLink():', linkActual);
                                    enlaceRealSala = linkActual;
                                    window.enlaceRealSala = linkActual;
                                }
                            } catch (e) {
                                console.log('⚠️ No se pudo obtener enlace con getLink():', e.message);
                            }
                        }
                    } else {
                        console.error('❌ DEBUG: Objeto room no fue creado correctamente');
                    }
                    
                    // Verificar variables del bot
                    if (typeof enlaceRealSala !== 'undefined' && !enlaceRealSala.includes('abcd1234')) {
                        console.log('✅ DEBUG: enlaceRealSala disponible:', enlaceRealSala);
                    }
                    
                    console.log('🎯 DEBUG: Inicialización completada');
                    
                } catch (evalError) {
                    console.error('❌ DEBUG: Error al evaluar código del bot:', evalError.message);
                    console.error('📍 DEBUG: Stack trace:', evalError.stack);
                    throw evalError;
                }
            }, botCompleto);
        } catch (error) {
            console.error('❌ ERROR AL EJECUTAR CÓDIGO DEL BOT:', error);
            throw error;
        }
        
        // Helper: obtener enlace con reintentos para evitar errores transitorios de contexto
        async function obtenerEnlaceConReintentos(page, { retries = 12, delay = 1500 } = {}) {
            for (let i = 0; i < retries; i++) {
                try {
                    const enlace = await page.evaluate(() => {
                        if (typeof enlaceRealSala !== 'undefined' && enlaceRealSala && !enlaceRealSala.includes('abcd1234')) {
                            return enlaceRealSala;
                        }
                        if (typeof room !== 'undefined' && room) {
                            if (typeof room.getLink === 'function') {
                                try {
                                    const linkActual = room.getLink();
                                    if (linkActual && !linkActual.includes('abcd1234')) return linkActual;
                                } catch (e) {
                                    console.log('⚠️ DEBUG: getLink() lanzó error:', e.message);
                                }
                            }
                            try {
                                const playerList = room.getPlayerList ? room.getPlayerList() : [];
                                console.log('👥 DEBUG: Jugadores en sala:', playerList.length);
                            } catch (e) {
                                console.log('⚠️ DEBUG: getPlayerList() lanzó error:', e.message);
                            }
                        }
                        return null;
                    });
                    if (enlace) return enlace;
                } catch (err) {
                    const msg = String(err && err.message ? err.message : err);
                    if (/detached Frame|Execution context was destroyed|Target closed|Protocol error/i.test(msg)) {
                        console.warn('⚠️ Reintentando obtener enlace (contexto transitorio)... intento', i + 1, 'de', retries);
                    } else {
                        throw err;
                    }
                }
                await new Promise(r => setTimeout(r, delay));
            }
            return null;
        }

        // Intentar obtener el enlace directamente después de unos segundos, con reintentos robustos
        setTimeout(async () => {
            try {
                const enlace = await obtenerEnlaceConReintentos(page, { retries: 12, delay: 1500 });
                if (enlace && enlace.startsWith('https://www.haxball.com/play?c=')) {
                    console.log('🔗 DEBUG: Enlace confirmado tras reintentos:', enlace);
                } else if (enlace === null) {
                    console.log('⚠️ DEBUG: No se pudo confirmar el enlace tras reintentos');
                }
            } catch (error) {
                const msg = String(error && error.message ? error.message : error);
                if (/detached Frame|Execution context was destroyed|Target closed|Protocol error/i.test(msg)) {
                    console.warn('⚠️ (transitorio) Error al intentar obtener el enlace:', msg);
                } else {
                    console.error('❌ Error al intentar obtener el enlace (reintentos):', msg);
                }
            }
        }, 10000); // Esperar 10 segundos
        
        // Capturar eventos adicionales para debugging
        page.on('response', response => {
            if (!response.ok()) {
                console.warn(`⚠️ [HTTP] Respuesta no exitosa: ${response.status()} ${response.url()}`);
            }
        });
        
        page.on('requestfailed', request => {
            console.error(`❌ [REQUEST FAILED] ${request.url()}: ${request.failure().errorText}`);
        });
        
        // Manejo de errores de página
        page.on('error', (error) => {
            console.error('❌ Error en la página:', error);
        });
        
        page.on('pageerror', (error) => {
            console.error('❌ Error de JavaScript en la página:', error);
        });
        
        // Capturar logs de WebSocket/Network (para debugging)
        page.on('framenavigated', frame => {
            if (frame === page.mainFrame()) {
            }
        });
        
        // ==================== WATCHDOG DESHABILITADO ====================
        // NOTA: WATCHDOG comentado para evitar reinicios automáticos cada 5 minutos
        // El bot seguirá funcionando sin verificaciones de contexto periódicas
        // PM2 manejará los reinicios solo si el proceso Node.js muere completamente
        
        /*
        // Watchdog y autorecuperación mediante PM2: si la página o el navegador se cierran,
        // o si el contexto de la sala desaparece repetidamente, salir para que PM2 reinicie.
        let watchdogFailures = 0;
        const watchdogIntervalMs = 60_000; // 60s
        const WATCHDOG_THRESHOLD = 5; // menos agresivo para evitar reinicios falsos
        
        // Reinicio asistido por PM2 ante cierre/desconexión
        browser.on('disconnected', () => {
            console.error('❌ [WATCHDOG] Browser desconectado. Saliendo para reinicio vía PM2...');
            process.exit(43);
        });
        
        page.on('close', () => {
            console.error('❌ [WATCHDOG] Page cerrada. Saliendo para reinicio vía PM2...');
            process.exit(44);
        });
        
        // Verificación periódica de que el contexto siga vivo
        setInterval(async () => {
            try {
                if (page.isClosed && page.isClosed()) {
                    console.error('❌ [WATCHDOG] La página está cerrada. Reinicio...');
                    process.exit(44);
                    return;
                }
                if (browser.isConnected && !browser.isConnected()) {
                    console.error('❌ [WATCHDOG] Browser desconectado (verificación). Reinicio...');
                    process.exit(43);
                    return;
                }

                const ok = await page.evaluate(() => {
                    try {
                        return (typeof room !== 'undefined' && !!room);
                    } catch (e) {
                        return false;
                    }
                });
                if (!ok) {
                    watchdogFailures++;
                    console.warn(`⚠️ [WATCHDOG] Contexto de sala no disponible (fallo ${watchdogFailures})`);
                } else {
                    if (watchdogFailures > 0) {
                        console.log('✅ [WATCHDOG] Contexto de sala recuperado');
                    }
                    watchdogFailures = 0;
                }
            } catch (err) {
                const msg = (err && err.message) ? err.message : String(err);
                // Solo contar fallos que indiquen problema real de contexto
                if (/Execution context was destroyed|Cannot find context|Target closed|Protocol error/i.test(msg)) {
                    watchdogFailures++;
                    console.warn(`⚠️ [WATCHDOG] Fallo al evaluar contexto (fallo ${watchdogFailures}): ${msg}`);
                } else {
                    console.warn(`⚠️ [WATCHDOG] Error no crítico al evaluar contexto: ${msg}`);
                }
            }
            
            if (watchdogFailures >= WATCHDOG_THRESHOLD) {
                console.error('❌ [WATCHDOG] Fallos consecutivos detectados. Saliendo para reinicio vía PM2...');
                process.exit(42);
            }
        }, watchdogIntervalMs);
        */
        
        console.log('ℹ️ WATCHDOG deshabilitado - El bot funcionará sin verificaciones periódicas de contexto');
        console.log('ℹ️ PM2 manejará los reinicios solo si el proceso Node.js falla completamente');
        
        // ====================== SISTEMA DE LIMPIEZA AUTOMÁTICA ======================
        // Función para ejecutar la limpieza de cuentas inactivas
        const ejecutarLimpiezaAutomatica = async () => {
            try {
                console.log('🧹 Iniciando limpieza automática de cuentas inactivas...');
                
                // Obtener estadísticas antes de la limpieza
                const estadisticas = await dbFunctions.obtenerEstadisticasInactividad();
                console.log(`📊 Estadísticas de inactividad:`);
                console.log(`   - Total de jugadores: ${estadisticas.total}`);
                console.log(`   - Inactivos +30 días: ${estadisticas.inactivas30}`);
                console.log(`   - Inactivos +60 días: ${estadisticas.inactivas60}`);
                console.log(`   - Inactivos +90 días: ${estadisticas.inactivas90}`);
                console.log(`   - Próximos a eliminar (80-90 días): ${estadisticas.proximasEliminar.length}`);
                
                // Ejecutar la limpieza
                const resultado = await dbFunctions.eliminarCuentasInactivas();
                
                // Enviar notificación a Discord si se eliminaron cuentas
                if (resultado.eliminadas > 0) {
                    const payload = {
                        content: `🧹 **Limpieza Automática de Cuentas Inactivas**\n\n` +
                                `✅ Se eliminaron **${resultado.eliminadas}** cuentas inactivas por más de 90 días.\n\n` +
                                `📋 **Cuentas eliminadas:**\n` +
                                resultado.cuentas.map(c => {
                                    const diasInactivo = Math.floor((new Date() - new Date(c.fechaUltimoPartido)) / (1000 * 60 * 60 * 24));
                                    return `• ${c.nombre} (${diasInactivo} días inactivo)`;
                                }).join('\n') +
                                `\n\n📊 **Estadísticas actuales:**\n` +
                                `• Total de jugadores restantes: ${estadisticas.total - resultado.eliminadas}\n` +
                                `• Próximos a eliminar: ${estadisticas.proximasEliminar.length}`,
                        username: "LNB Bot - Sistema de Limpieza",
                        avatar_url: "https://cdn.discordapp.com/emojis/🧹.png"
                    };
                    
                    try {
                        const response = await fetch(webhooks.discord, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        
                        if (response.ok) {
                            console.log('✅ Notificación de limpieza enviada a Discord');
                        } else {
                            console.warn('⚠️ Error al enviar notificación a Discord:', response.status);
                        }
                    } catch (discordError) {
                        console.error('❌ Error enviando notificación a Discord:', discordError);
                    }
                } else {
                    console.log('ℹ️ No se encontraron cuentas inactivas para eliminar');
                }
                
            } catch (error) {
                console.error('❌ Error en limpieza automática:', error);
            }
        };
        
        // Ejecutar limpieza inicial después de 5 minutos de iniciado el bot
        setTimeout(() => {
            console.log('🔄 Ejecutando limpieza inicial...');
            ejecutarLimpiezaAutomatica();
        }, 5 * 60 * 1000); // 5 minutos
        
        // Programar limpieza automática cada 24 horas
        setInterval(() => {
            console.log('🔄 Ejecutando limpieza automática programada...');
            ejecutarLimpiezaAutomatica();
        }, 24 * 60 * 60 * 1000); // 24 horas
        
        // Exponer función de limpieza manual al contexto del navegador
        await page.exposeFunction('nodeLimpiezaManual', ejecutarLimpiezaAutomatica);
        
        // ====================== SISTEMA DE LIMPIEZA DE CONEXIONES ======================
        // Función para ejecutar la limpieza de conexiones inactivas
        const ejecutarLimpiezaConexiones = async () => {
            try {
                // Limpiar conexiones inactivas (más de 10 minutos sin actividad)
                const conexionesLimpiadas = await dbFunctions.limpiarConexionesInactivas();
                
                if (conexionesLimpiadas > 0) {
                    console.log(`🧹 ${conexionesLimpiadas} conexiones inactivas limpiadas automáticamente`);
                }
            } catch (error) {
                console.error('❌ Error en limpieza automática de conexiones:', error);
            }
        };
        
        // Programar limpieza de conexiones cada 5 minutos
        setInterval(() => {
            ejecutarLimpiezaConexiones();
        }, 5 * 60 * 1000); // 5 minutos
        
        console.log('✅ Sistema de limpieza automática configurado');
        console.log('   - Limpieza inicial: 5 minutos después del inicio');
        console.log('   - Limpieza automática: cada 24 horas');
        console.log('   - Limpieza de conexiones: cada 5 minutos');
        console.log('   - Comando manual disponible en el bot');

        // Ejecutar limpieza de conexiones inmediatamente al iniciar
        ejecutarLimpiezaConexiones();
        
        // ====================== INICIALIZAR SISTEMA DE ESTADÍSTICAS DISCORD ======================
        if (discordStatsSystem) {
            try {
                console.log('🎯 Inicializando sistema de estadísticas Discord...');
                
                // Inicializar el sistema después de un breve retraso para asegurar que la DB esté lista
                setTimeout(async () => {
                    try {
                        await discordStatsSystem.iniciar();
                        console.log('✅ Sistema de estadísticas Discord iniciado correctamente');
                    } catch (statsError) {
                        console.error('❌ Error al inicializar sistema de estadísticas Discord:', statsError.message);
                        console.error('💡 El sistema continuará funcionando sin estadísticas automáticas');
                    }
                }, 30000); // Esperar 30 segundos para que todo esté listo
                
            } catch (error) {
                console.error('❌ Error configurando sistema de estadísticas Discord:', error.message);
            }
        } else {
            console.warn('⚠️ Sistema de estadísticas Discord no disponible');
        }
        
        // Mantener el proceso vivo
        // Graceful shutdown
        process.on('SIGINT', async () => {
            console.log('🛑 Cerrando bot y base de datos...');
            await browser.close();
            await closePool();
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Error iniciando el bot:', error);
        process.exit(1);
    }
})();
