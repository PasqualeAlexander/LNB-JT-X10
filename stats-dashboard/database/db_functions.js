/**
 * FUNCIONES DE BASE DE DATOS MYSQL PARA LNB BOT
 * =============================================
 * 
 * Este archivo contiene todas las funciones de base de datos
 * adaptadas para usar MySQL en lugar de SQLite
 */

const { executeQuery, executeTransaction } = require('../config/database');

// Auto-esquema: asegurar columnas requeridas
const ensureColumnExists = async (schema, table, column, definition) => {
    try {
        const rows = await executeQuery(
            `SELECT COUNT(*) AS cnt FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
            [schema, table, column]
        );
        const exists = rows && rows[0] && rows[0].cnt > 0;
        if (!exists) {
            console.warn(`[DB] Columna faltante detectada: ${table}.${column}. Agregando...`);
            await executeQuery(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
            console.log(`✅ Columna agregada: ${table}.${column}`);
        }
    } catch (e) {
        console.error(`[DB] Error verificando/agregando columna ${table}.${column}:`, e.message);
    }
};



const dbFunctions = {
    // ====================== FUNCIONES DE JUGADORES ======================
    
    // Guardar/actualizar jugador (solo por auth_id)
    guardarJugador: async (identificador, stats, authId = null) => {
        try {
            if (!authId) {
                console.warn('🚫 [POLÍTICA] guardarJugador requiere authId. Use guardarJugadorPorAuth(authId, nombre, stats).');
                return null;
            }
            return await dbFunctions.guardarJugadorPorAuth(authId, identificador, stats);
        } catch (error) {
            console.error('❌ Error en guardarJugador (auth):', error);
            throw error;
        }
    },
    
    // Obtener jugador
    obtenerJugador: async (nombre) => {
        const query = 'SELECT * FROM jugadores WHERE nombre = ?';
        try {
            const results = await executeQuery(query, [nombre]);
            return results[0] || null;
        } catch (error) {
            console.error('❌ [DB] Error obteniendo jugador:', error);
            throw error;
        }
    },

    // Cargar estadísticas globales (ACTUALIZADO PARA USAR AUTH_ID)
    cargarEstadisticasGlobales: async () => {
        const schema = process.env.DB_NAME || 'lnb_estadisticas';
        await ensureColumnExists(schema, 'jugadores', 'nombre_display', 'VARCHAR(255) NULL AFTER nombre');
        await ensureColumnExists(schema, 'jugadores', 'updated_at', 'TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
        const query = 'SELECT * FROM jugadores ORDER BY partidos DESC';
        try {
            const rows = await executeQuery(query);
            
            // Formatear datos para coincidir con la estructura esperada
            const estadisticasFormateadas = {
                jugadores: {},
                records: {
                    mayorGoles: {jugador: "", cantidad: 0, fecha: ""},
                    mayorAsistencias: {jugador: "", cantidad: 0, fecha: ""},
                    partidoMasLargo: {duracion: 0, fecha: ""},
                    goleadaMasGrande: {diferencia: 0, resultado: "", fecha: ""},
                    hatTricks: [],
                    vallasInvictas: []
                },
                totalPartidos: 0,
                fechaCreacion: new Date().toISOString(),
                contadorJugadores: rows ? rows.length : 0
            };
            
            // Convertir filas de la base de datos a la estructura esperada
            // NUEVO: Usar auth_id como clave principal, con fallback a nombre
            if (rows && rows.length > 0) {
                rows.forEach(row => {
                    // Identificador único: usar auth_id si está disponible, sino usar nombre
                    const identificadorUnico = row.auth_id || row.nombre;
                    const nombreMostrar = row.nombre_display || row.nombre;
                    
                    estadisticasFormateadas.jugadores[identificadorUnico] = {
                        // Información de identificación
                        auth_id: row.auth_id,
                        nombre: row.nombre,
                        nombre_display: nombreMostrar,
                        
                        // Estadísticas del jugador
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
                        promedioGoles: parseFloat(row.promedioGoles) || 0.0,
                        promedioAsistencias: parseFloat(row.promedioAsistencias) || 0.0,
                        fechaPrimerPartido: row.fechaPrimerPartido || new Date().toISOString(),
                        fechaUltimoPartido: row.fechaUltimoPartido || new Date().toISOString(),
                        xp: row.xp || 40,
                        nivel: row.nivel || 1,
                        codigoRecuperacion: row.codigoRecuperacion || null,
                        fechaCodigoCreado: row.fechaCodigoCreado || null,
                        mvps: row.mvps || 0,
                        
                        // Metadata de identificación
                        tipo_identificacion: row.auth_id ? 'auth' : 'nombre'
                    };
                });
                
                // Calcular records básicos
                let maxGoles = 0, maxAsistencias = 0;
                Object.values(estadisticasFormateadas.jugadores).forEach(jugador => {
                    if (jugador.goles > maxGoles) {
                        maxGoles = jugador.goles;
                        estadisticasFormateadas.records.mayorGoles = {
                            jugador: jugador.nombre_display || jugador.nombre,
                            cantidad: jugador.goles,
                            fecha: jugador.fechaUltimoPartido
                        };
                    }
                    if (jugador.asistencias > maxAsistencias) {
                        maxAsistencias = jugador.asistencias;
                        estadisticasFormateadas.records.mayorAsistencias = {
                            jugador: jugador.nombre_display || jugador.nombre,
                            cantidad: jugador.asistencias,
                            fecha: jugador.fechaUltimoPartido
                        };
                    }
                    estadisticasFormateadas.totalPartidos += jugador.partidos;
                });
            }
            
            const jugadoresConAuth = Object.values(estadisticasFormateadas.jugadores).filter(j => j.auth_id).length;
            const jugadoresSinAuth = Object.values(estadisticasFormateadas.jugadores).filter(j => !j.auth_id).length;
            
            console.log(`ℹ️ [DB] [AUTH-ID] Cargadas estadísticas: ${Object.keys(estadisticasFormateadas.jugadores).length} jugadores`);
            console.log(`   - Con auth_id: ${jugadoresConAuth}`);
            console.log(`   - Sin auth_id: ${jugadoresSinAuth}`);
            
            return estadisticasFormateadas;
        } catch (error) {
            console.error('❌ [DB] Error cargando estadísticas globales:', error);
            throw error;
        }
    },

    // Guardar estadísticas globales (ACTUALIZADO PARA USAR AUTH_ID)
    guardarEstadisticasGlobales: async (datos) => {
        try {
            if (!datos || !datos.jugadores) {
                console.error('❌ [DB] [DB] Datos inválidos para guardar estadísticas globales');
                return false;
            }
            
            console.log(`ℹ️ [DB] [AUTH-ID] Guardando estadísticas de ${Object.keys(datos.jugadores).length} jugadores...`);
            
            // Guardar cada jugador individualmente usando el sistema auth_id
            const jugadoresGuardados = [];
            const erroresDetallados = [];
            
            for (const [identificador, stats] of Object.entries(datos.jugadores)) {
                try {
                    // Determinar si el identificador es un auth_id o nombre
                    const esAuthId = stats.auth_id || stats.tipo_identificacion === 'auth';
                    const authId = esAuthId ? stats.auth_id || identificador : null;
                    const nombreJugador = stats.nombre_display || stats.nombre || identificador;
                    
                    if (authId) {
                        // Usar sistema basado en auth_id
                        await dbFunctions.guardarJugadorPorAuth(authId, nombreJugador, stats);
                        jugadoresGuardados.push(`${nombreJugador} (Auth: ${authId})`);
                        console.log(`✅ [DB] [AUTH-ID] Guardado: ${nombreJugador} -> ${authId}`);
                    } else {
                        // POLÍTICA: NO guardar jugadores sin auth_id
                        console.warn(`⚠️ [DB] [POLÍTICA] Jugador sin auth_id NO guardado: ${nombreJugador}`);
                        erroresDetallados.push({
                            identificador: identificador,
                            nombre: nombreJugador,
                            auth_id: 'N/A',
                            error: 'Sin auth_id - política activa'
                        });
                    }
                } catch (error) {
                    const errorInfo = {
                        identificador: identificador,
                        nombre: stats.nombre || 'N/A',
                        auth_id: stats.auth_id || 'N/A',
                        error: error.message
                    };
                    erroresDetallados.push(errorInfo);
                    console.error(`❌ [DB] [DB] Error guardando jugador ${identificador}:`, error.message);
                }
            }
            
            // Reporte final
            const totalJugadores = Object.keys(datos.jugadores).length;
            const exitosos = jugadoresGuardados.length;
            const errores = erroresDetallados.length;
            
            console.log(`✅ [DB] [AUTH-ID] Guardado completado: ${exitosos}/${totalJugadores} jugadores`);
            
            if (errores > 0) {
                console.warn(`⚠️ [DB] [AUTH-ID] ${errores} errores durante el guardado:`);
                erroresDetallados.forEach((err, i) => {
                    console.warn(`   ${i+1}. ${err.nombre} (ID: ${err.identificador}): ${err.error}`);
                });
            }
            
            return exitosos > 0;
        } catch (error) {
            console.error('❌ [DB] [DB] Error crítico en guardarEstadisticasGlobales:', error);
            throw error;
        }
    },
    
    // Obtener top jugadores
    obtenerTopJugadores: async (campo, limite = 10) => {
        const validCampos = ['goles', 'asistencias', 'partidos', 'victorias', 'hatTricks', 'vallasInvictas', 'mvps'];
        if (!validCampos.includes(campo)) {
            throw new Error('Campo inválido');
        }
        
        // Validar que limite sea un número válido para evitar inyección SQL
        const limiteNumero = parseInt(limite);
        if (isNaN(limiteNumero) || limiteNumero <= 0 || limiteNumero > 100) {
            throw new Error('Límite inválido');
        }
        
        // Construir query con LIMIT literal (no como parámetro preparado)
        const query = `SELECT * FROM jugadores WHERE partidos > 0 ORDER BY ${campo} DESC LIMIT ${limiteNumero}`;
        try {
            const results = await executeQuery(query, []);
            return results;
        } catch (error) {
            console.error('❌ [DB] Error obteniendo top jugadores:', error);
            throw error;
        }
    },

    // Obtener Top desde la última tabla de backup (fallback de temporada anterior)
    obtenerTopDesdeBackup: async (campo, limite = 10) => {
        try {
            const validCampos = ['goles', 'asistencias', 'partidos', 'victorias', 'hatTricks', 'vallasInvictas', 'mvps', 'autogoles'];
            if (!validCampos.includes(campo)) {
                throw new Error('Campo inválido');
            }

            const schema = process.env.DB_NAME || 'lnb_estadisticas';

            // Buscar las últimas tablas de backup por nombre (YYYY_MM_DD_HHMMSS ordena lexicográficamente)
            const tablas = await executeQuery(
                `SELECT table_name AS nombre FROM information_schema.tables
                 WHERE table_schema = ? AND table_name LIKE 'temporada_backup_%'
                 ORDER BY table_name DESC LIMIT 5`,
                [schema]
            );

            if (!tablas || tablas.length === 0) {
                return { success: false, reason: 'sin_tablas_backup', data: [] };
            }

            // Validar límite
            const limiteNumero = parseInt(limite);
            const lim = (isNaN(limiteNumero) || limiteNumero <= 0 || limiteNumero > 100) ? 10 : limiteNumero;

            // Probar tablas en orden hasta encontrar una con datos
            for (const t of tablas) {
                const tabla = t.nombre;
                // Verificar si hay datos
                const countRes = await executeQuery(`SELECT COUNT(*) AS total FROM lexible${tabla}flexiblelexible`);
                const total = (countRes && countRes[0] && countRes[0].total) ? countRes[0].total : 0;
                if (total === 0) continue;

                // Traer el top por el campo solicitado
                const query = `SELECT nombre, nombre_display, partidos, victorias, derrotas, goles, asistencias, autogoles,
                                      mejorRachaGoles, mejorRachaAsistencias, hatTricks, mvps, vallasInvictas, tiempoJugado
                               FROM lexible${tabla}flexiblelexible
                               ORDER BY ${campo} DESC, partidos DESC, nombre ASC
                               LIMIT ${lim}`;
                const rows = await executeQuery(query, []);
                return { success: true, table: tabla, data: rows };
            }

            return { success: false, reason: 'tablas_sin_datos', data: [] };
        } catch (error) {
            console.error('❌ [DB] Error en obtenerTopDesdeBackup:', error);
            return { success: false, error: error.message, data: [] };
        }
    },
    
    // ====================== FUNCIONES DE PARTIDOS ======================
    
    // Guardar partido
    guardarPartido: async (partidoData) => {
        const query = `INSERT INTO partidos (fecha, duracion, golesRed, golesBlue, mapa, mejorJugador)
                      VALUES (?, ?, ?, ?, ?, ?)`;
        
        try {
            const result = await executeQuery(query, [
                partidoData.fecha, partidoData.duracion, partidoData.golesRed, 
                partidoData.golesBlue, partidoData.mapa, partidoData.mejorJugador
            ]);
            return result.insertId;
        } catch (error) {
            console.error('❌ [DB] Error guardando partido:', error);
            throw error;
        }
    },
    
    // ====================== FUNCIONES VIP ======================
    
    // Activar VIP por auth_id (nuevo flujo recomendado)
    activarVIPPorAuth: async (authId) => {
        const fechaVIP = new Date().toISOString();
        const query = `UPDATE jugadores SET esVIP = 1, fechaVIP = ? WHERE auth_id = ?`;
        try {
            const result = await executeQuery(query, [fechaVIP, authId]);
            if (result.affectedRows === 0) {
                throw new Error('Jugador no encontrado por auth_id');
            }
            console.log(`✅ [DB] VIP activado (auth) para ${authId} en ${fechaVIP}`);
            return { authId, fechaVIP, cambios: result.affectedRows };
        } catch (error) {
            console.error('❌ [DB] Error activando VIP (auth):', error);
            throw error;
        }
    },

    // Compat: activar VIP por nombre (resuelve y delega a auth)
    activarVIP: async (nombreJugador) => {
        try {
            console.warn('⚠️ activarVIP(nombre) está deprecado. Usar activarVIPPorAuth(authId). Resolviendo auth_id...');
            const rows = await executeQuery(
                'SELECT auth_id FROM jugadores WHERE nombre = ? AND auth_id IS NOT NULL ORDER BY updated_at DESC LIMIT 1',
                [nombreJugador]
            );
            if (!rows || rows.length === 0 || !rows[0].auth_id) {
                throw new Error('No se pudo resolver auth_id para el nombre indicado');
            }
            return await dbFunctions.activarVIPPorAuth(rows[0].auth_id);
        } catch (error) {
            console.error('❌ [DB] Error activando VIP (por nombre):', error);
            throw error;
        }
    },
    
    // Desactivar VIP por auth_id (nuevo flujo recomendado)
    desactivarVIPPorAuth: async (authId) => {
        const query = `UPDATE jugadores SET esVIP = 0, fechaVIP = NULL WHERE auth_id = ?`;
        try {
            const result = await executeQuery(query, [authId]);
            if (result.affectedRows === 0) {
                throw new Error('Jugador no encontrado por auth_id');
            }
            console.log(`✅ [DB] VIP desactivado (auth) para ${authId}`);
            return { authId, cambios: result.affectedRows };
        } catch (error) {
            console.error('❌ [DB] Error desactivando VIP (auth):', error);
            throw error;
        }
    },

    // Compat: desactivar VIP por nombre (resuelve y delega a auth)
    desactivarVIP: async (nombreJugador) => {
        try {
            console.warn('⚠️ desactivarVIP(nombre) está deprecado. Usar desactivarVIPPorAuth(authId). Resolviendo auth_id...');
            const rows = await executeQuery(
                'SELECT auth_id FROM jugadores WHERE nombre = ? AND auth_id IS NOT NULL ORDER BY updated_at DESC LIMIT 1',
                [nombreJugador]
            );
            if (!rows || rows.length === 0 || !rows[0].auth_id) {
                throw new Error('No se pudo resolver auth_id para el nombre indicado');
            }
            return await dbFunctions.desactivarVIPPorAuth(rows[0].auth_id);
        } catch (error) {
            console.error('❌ [DB] Error desactivando VIP (por nombre):', error);
            throw error;
        }
    },
    
    // Verificar VIP por auth_id (nuevo flujo recomendado)
    esJugadorVIPPorAuth: async (authId) => {
        const query = `SELECT esVIP, fechaVIP FROM jugadores WHERE auth_id = ?`;
        try {
            const results = await executeQuery(query, [authId]);
            const row = results && results[0];
            if (!row) return { esVIP: false, fechaVIP: null };

            const esVIP = row.esVIP === 1;
            const fechaVIP = row.fechaVIP;
            if (esVIP && fechaVIP) {
                const fechaOtorgamiento = new Date(fechaVIP);
                const fechaExpiracion = new Date(fechaOtorgamiento.getTime() + (30 * 24 * 60 * 60 * 1000));
                const ahora = new Date();
                if (ahora > fechaExpiracion) {
                    try {
                        await dbFunctions.desactivarVIPPorAuth(authId);
                        return { esVIP: false, fechaVIP: null, expirado: true };
                    } catch (error) {
                        console.error(`Error al desactivar VIP expirado (auth: ${authId}):`, error);
                        return { esVIP: false, fechaVIP: null, expirado: true };
                    }
                } else {
                    return { esVIP: true, fechaVIP: fechaVIP, diasRestantes: Math.ceil((fechaExpiracion - ahora) / (24 * 60 * 60 * 1000)) };
                }
            }
            return { esVIP: false, fechaVIP: null };
        } catch (error) {
            console.error('❌ [DB] Error verificando VIP (auth):', error);
            throw error;
        }
    },

    // Compat: verificar VIP por nombre (resuelve y delega a auth)
    esJugadorVIP: async (nombreJugador) => {
        try {
            console.warn('⚠️ esJugadorVIP(nombre) está deprecado. Usar esJugadorVIPPorAuth(authId). Resolviendo auth_id...');
            const rows = await executeQuery(
                'SELECT auth_id FROM jugadores WHERE nombre = ? AND auth_id IS NOT NULL ORDER BY updated_at DESC LIMIT 1',
                [nombreJugador]
            );
            if (!rows || rows.length === 0 || !rows[0].auth_id) {
                return { esVIP: false, fechaVIP: null };
            }
            return await dbFunctions.esJugadorVIPPorAuth(rows[0].auth_id);
        } catch (error) {
            console.error('❌ [DB] Error verificando VIP (por nombre):', error);
            throw error;
        }
    },
    // Obtener lista de jugadores VIP activos
    obtenerJugadoresVIP: async () => {
        const query = `SELECT nombre, fechaVIP FROM jugadores WHERE esVIP = 1 ORDER BY fechaVIP DESC`;
        
        try {
            const results = await executeQuery(query);
            const jugadoresVIP = results.map(row => {
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
        } catch (error) {
            console.error('❌ [DB] Error obteniendo jugadores VIP:', error);
            throw error;
        }
    },
    
    // Limpiar VIPs expirados automáticamente
    limpiarVIPsExpirados: async () => {
        try {
            // Primero obtener los VIPs que van a expirar
            const selectQuery = `SELECT nombre, fechaVIP FROM jugadores 
                                WHERE esVIP = 1 
                                AND DATE_ADD(STR_TO_DATE(fechaVIP, '%Y-%m-%dT%H:%i:%s.%fZ'), INTERVAL 30 DAY) < NOW()`;
            
            const expiredVips = await executeQuery(selectQuery);
            
            if (expiredVips.length === 0) {
                return { vipsExpirados: 0, jugadores: [] };
            }
            
            // Desactivar VIPs expirados
            const updateQuery = `UPDATE jugadores 
                                SET esVIP = 0, fechaVIP = NULL 
                                WHERE esVIP = 1 
                                AND DATE_ADD(STR_TO_DATE(fechaVIP, '%Y-%m-%dT%H:%i:%s.%fZ'), INTERVAL 30 DAY) < NOW()`;
            
            const result = await executeQuery(updateQuery);
            
            console.log(`🧹 [DB] ${result.affectedRows} VIPs expirados limpiados automáticamente`);
            return { 
                vipsExpirados: result.affectedRows, 
                jugadores: expiredVips.map(r => ({
                    nombre: r.nombre,
                    fechaVIP: r.fechaVIP,
                    diasVencido: Math.floor((new Date() - new Date(r.fechaVIP)) / (1000 * 60 * 60 * 24)) - 30
                }))
            };
        } catch (error) {
            console.error('❌ [DB] Error limpiando VIPs expirados:', error);
            throw error;
        }
    },
    
    // ====================== FUNCIONES DE CONEXIONES ======================
    
    // Registrar nueva conexión
    registrarConexion: async (nombreJugador, authJugador, ipSimulada, identificadorConexion) => {
        try {
            // Primero eliminar conexión existente si hay una
            const deleteQuery = `DELETE FROM conexiones_activas WHERE identificador_conexion = ?`;
            await executeQuery(deleteQuery, [identificadorConexion]);
            
            // Insertar nueva conexión
            const insertQuery = `INSERT INTO conexiones_activas 
                                (nombre_jugador, auth_jugador, ip_simulada, identificador_conexion)
                                VALUES (?, ?, ?, ?)`;
            
            const result = await executeQuery(insertQuery, [nombreJugador, authJugador, ipSimulada, identificadorConexion]);
            console.log(`🔗 [DB] Nueva conexión registrada: ${nombreJugador} (${ipSimulada})`);
            return result.insertId;
        } catch (error) {
            console.error('❌ [DB] Error registrando conexión:', error);
            throw error;
        }
    },
    
    // Verificar conexiones existentes
    verificarConexionesExistentes: async (nombreJugador, authJugador = null) => {
        try {
            // Primero limpiar conexiones inactivas automáticamente
            await dbFunctions.limpiarConexionesInactivas();
            
            let query = `SELECT * FROM conexiones_activas 
                        WHERE activa = 1 AND (nombre_jugador = ?`;
            let params = [nombreJugador];
            
            if (authJugador) {
                query += ` OR auth_jugador = ?`;
                params.push(authJugador);
            }
            
            query += `)`;
            
            const results = await executeQuery(query, params);
            const conexionesActivas = results.length;
            const tieneConexionesMultiples = conexionesActivas >= 2;
            
            console.log(`🔍 [DB] Verificación de conexiones para ${nombreJugador}: ${conexionesActivas} activas`);
            
            // Si hay exactamente una conexión activa, verificar si es del mismo jugador
            if (conexionesActivas === 1 && results.length > 0) {
                const conexionExistente = results[0];
                if (conexionExistente.auth_jugador === authJugador) {
                    console.log(`✅ [DB] Conexión permitida: misma sesión de ${nombreJugador}`);
                    return {
                        tieneConexionesMultiples: false,
                        conexionesActivas: 0,
                        detalles: []
                    };
                }
            }
            
            return {
                tieneConexionesMultiples,
                conexionesActivas,
                detalles: results
            };
        } catch (error) {
            console.error('❌ [DB] Error verificando conexiones existentes:', error);
            throw error;
        }
    },
    
    // Limpiar conexiones inactivas
    limpiarConexionesInactivas: async () => {
        const query = `UPDATE conexiones_activas 
                      SET activa = 0 
                      WHERE activa = 1 
                      AND ultima_actividad < DATE_SUB(NOW(), INTERVAL 10 MINUTE)`;
        
        try {
            const result = await executeQuery(query);
            if (result.affectedRows > 0) {
                console.log(`🧹 [DB] ${result.affectedRows} conexiones inactivas limpiadas`);
            }
            return result.affectedRows;
        } catch (error) {
            console.error('❌ [DB] Error limpiando conexiones inactivas:', error);
            throw error;
        }
    },
    
    // ====================== FUNCIONES DE BANEOS ======================
    
    // Crear baneo en la nueva tabla baneos
        // PARCHE ZONA HORARIA UTC - Asegurar que se use UTC
    crearBaneo: async (authId, nombre, razon, admin, duracion = 0) => {
        // Si no se proporciona razón, usar valor por defecto
        const razonFinal = razon || 'Baneado por admin';
        
        // PARCHE: Establecer zona horaria UTC para esta operación
        await executeQuery("SET SESSION time_zone = '+00:00'");
        
        const query = `INSERT INTO baneos (auth_id, nombre, razon, admin, fecha, duracion, activo)
                      VALUES (?, ?, ?, ?, UTC_TIMESTAMP(), ?, 1)`;
        
        try {
            const result = await executeQuery(query, [authId, nombre, razonFinal, admin, duracion]);
            console.log(`✅ [DB] Nuevo baneo creado: ${nombre} (ID: ${result.insertId})`);
            return {
                id: result.insertId,
                authId: authId,
                nombre: nombre,
                razon: razon,
                admin: admin,
                duracion: duracion
            };
        } catch (error) {
            console.error('❌ [DB] Error creando baneo:', error);
            throw error;
        }
    },
    
    // PARCHE ZONA HORARIA UTC - Verificar si un jugador está baneado (nueva tabla) - versión que devuelve promesa
    estaBaneadoPromise: async (authId) => {
        try {
            // La lógica de expiración ahora se maneja directamente en la consulta SQL
            // para evitar problemas de zona horaria entre Node.js y la base de datos.
            const query = `
                SELECT * FROM baneos 
                WHERE auth_id = ? AND activo = 1
                  AND (duracion = 0 OR TIMESTAMPADD(MINUTE, duracion, fecha) > UTC_TIMESTAMP())
                ORDER BY fecha DESC LIMIT 1
            `;
            
            const results = await executeQuery(query, [authId]);
            const row = results[0];
            
            // Si la consulta devuelve una fila, el baneo está activo.
            if (row) {
                return row;
            }
            
            // Si no hay resultados, no hay un baneo activo.
            return false;

        } catch (error) {
            console.error('❌ [DB] Error verificando baneo:', error);
            return false;
        }
    },
    
    // Verificar si un jugador está baneado (nueva tabla) - versión callback mejorada
    estaBaneado: (authId, callback) => {
        // Validar que callback sea una función y crear un callback por defecto si no es válido
        if (typeof callback !== 'function') {
            console.error('❌ [DB] ERROR: estaBaneado requiere un callback válido como segundo parámetro');
            console.error('❌ [DB] Tipo de callback recibido:', typeof callback);
            console.error('❌ [DB] Valor de callback:', callback);
            // Usar un callback por defecto en lugar de fallar
            callback = (result) => {
                console.log('⚠️ [DB] Usando callback por defecto para estaBaneado, resultado:', result ? 'baneado' : 'no baneado');
            };
        }
        
        // Usar la versión de promesa internamente
        dbFunctions.estaBaneadoPromise(authId)
            .then(result => {
                if (typeof callback === 'function') {
                    callback(result);
                }
            })
            .catch(error => {
                console.error('❌ [DB] Error en estaBaneado callback:', error);
                if (typeof callback === 'function') {
                    callback(false);
                }
            });
    },
    
    // Desactivar baneo
    desactivarBaneo: async (baneoId) => {
        const query = `UPDATE baneos SET activo = 0 WHERE id = ?`;
        
        try {
            const result = await executeQuery(query, [baneoId]);
            console.log(`✅ [DB] Baneo desactivado: ID ${baneoId}`);
            return {
                baneoId: baneoId,
                cambios: result.affectedRows
            };
        } catch (error) {
            console.error('❌ [DB] Error desactivando baneo:', error);
            throw error;
        }
    },
    
    // Desbanear por auth_id
    desbanearJugadorNuevo: async (authId) => {
        try {
            // Primero obtener información del baneo activo
            const selectQuery = `SELECT * FROM baneos WHERE auth_id = ? AND activo = 1 LIMIT 1`;
            const results = await executeQuery(selectQuery, [authId]);
            const baneo = results[0];
            
            if (!baneo) {
                throw new Error('No se encontró baneo activo para este jugador');
            }
            
            // Desactivar el baneo
            const updateQuery = `UPDATE baneos SET activo = 0 WHERE auth_id = ? AND activo = 1`;
            const result = await executeQuery(updateQuery, [authId]);
            
            console.log(`✅ [DB] Jugador desbaneado: ${baneo.nombre} (Auth: ${authId})`);
            return {
                authId: authId,
                nombre: baneo.nombre,
                fechaBanOriginal: baneo.fecha,
                razonOriginal: baneo.razon,
                adminOriginal: baneo.admin,
                cambios: result.affectedRows
            };
        } catch (error) {
            console.error('❌ [DB] Error desbaneando jugador:', error);
            throw error;
        }
    },

    // Banear a un jugador que no está en la sala (offline) usando su auth_id
    banearJugadorOffline: async (authId, razon, admin, duracion = 0) => {
        try {
            if (!authId) {
                throw new Error('Se requiere un authId para realizar un baneo offline.');
            }

            // 1. Buscar el último nombre conocido del jugador usando su auth_id.
            const jugador = await dbFunctions.obtenerJugadorPorAuth(authId);
            
            let nombreParaRegistro;
            if (jugador && jugador.nombre) {
                nombreParaRegistro = jugador.nombre;
                console.log(`✅ [DB] [BAN OFFLINE] Jugador encontrado: ${nombreParaRegistro}. Procediendo a banear.`);
            } else {
                // Si el jugador no existe en nuestra DB, no podemos obtener un nombre.
                // Usaremos el authId como nombre para el registro del baneo.
                nombreParaRegistro = authId;
                console.warn(`⚠️ [DB] [BAN OFFLINE] No se encontró un jugador con authId: ${authId}. Se usará el authId como nombre en el registro del baneo.`);
            }

            // 2. Llamar a la función de baneo moderna con los datos recopilados.
            const resultadoBaneo = await dbFunctions.crearBaneo(authId, nombreParaRegistro, razon, admin, duracion);
            
            console.log(`✅ [DB] [BAN OFFLINE] Baneo offline exitoso para authId: ${authId}`);
            return { success: true, ...resultadoBaneo };

        } catch (error) {
            console.error('❌ Error en banearJugadorOffline:', error);
            throw error;
        }
    },
    
    // Obtener baneos activos
        // PARCHE ZONA HORARIA UTC - Obtener baneos activos
    obtenerBaneosActivos: async () => {
        try {
            // PARCHE: Establecer zona horaria UTC para esta operación
            await executeQuery("SET SESSION time_zone = '+00:00'");
            
            const query = `SELECT * FROM baneos WHERE activo = 1 ORDER BY fecha DESC`;
            const rows = await executeQuery(query);
            
            const ahora = new Date(); // UTC
            const baneosRealmenteActivos = [];
            const baneosExpiradosALimpiar = [];
            
            // Procesar cada baneo para verificar si realmente está activo
            for (const row of rows) {
                // Verificar si es baneo temporal
                if (row.duracion > 0) {
                    // PARCHE: Usar la fecha directamente de MySQL (ya está en UTC por UTC_TIMESTAMP())
                    const fechaBan = new Date(row.fecha); // MySQL ya devuelve fecha UTC correcta
                    const tiempoTranscurrido = ahora.getTime() - fechaBan.getTime();
                    const tiempoLimite = row.duracion * 60 * 1000; // duracion en minutos a milisegundos
                    
                    if (tiempoTranscurrido >= tiempoLimite) {
                        // Baneo temporal expirado
                        console.log(`⏰ [DB] Detectado baneo temporal expirado: ${row.nombre} (${Math.floor(tiempoTranscurrido / (60 * 1000))} min transcurridos de ${row.duracion} min límite)`);
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
                console.log(`🧹 [DB] Limpiando automáticamente ${baneosExpiradosALimpiar.length} baneos temporales expirados...`);
                
                for (const baneoId of baneosExpiradosALimpiar) {
                    try {
                        await dbFunctions.desactivarBaneo(baneoId);
                        console.log(`✅ [DB] Baneo temporal expirado limpiado: ID ${baneoId}`);
                    } catch (cleanupError) {
                        console.error(`❌ [DB] Error limpiando baneo expirado ID ${baneoId}:`, cleanupError);
                    }
                }
            }
            
            console.log(`ℹ️ [DB] Baneos procesados: ${rows.length} total, ${baneosRealmenteActivos.length} realmente activos, ${baneosExpiradosALimpiar.length} expirados limpiados`);
            return baneosRealmenteActivos;
        } catch (error) {
            console.error('❌ [DB] Error obteniendo baneos activos:', error);
            throw error;
        }
    },
    
    // Obtener TODOS los jugadores (para carga completa de estadísticas)
    obtenerTodosJugadores: async () => {
        try {
            const query = `
                SELECT auth_id, nombre, nombre_display, partidos, victorias, derrotas, goles, asistencias, 
                       autogoles, mejorRachaGoles, mejorRachaAsistencias, hatTricks, 
                       vallasInvictas, tiempoJugado, promedioGoles, promedioAsistencias,
                       fechaPrimerPartido, fechaUltimoPartido, xp, nivel, mvps,
                       codigoRecuperacion, fechaCodigoCreado
                FROM jugadores
                ORDER BY nombre
            `;
            
            const result = await executeQuery(query);
            console.log(`[DB] ℹ️ [DB] ${result.length} jugadores cargados desde DB`);
            return result;
        } catch (error) {
            console.error('[DB] ❌ [DB] Error al obtener todos los jugadores:', error);
            return [];
        }
    },
    
    // ====================== FUNCIONES DEPRECADAS ======================
    

    
    // Banear jugador en base de datos (DEPRECADO)
    // Esta función ha sido refactorizada para usar el sistema de baneos unificado (lexiblebaneoslexible` tabla).
    // La firma se mantiene por compatibilidad con llamadas existentes, pero la lógica interna
    // ahora delega en lexiblecrearBaneolexible`.
    banearJugador: async (nombreJugador, uid, adminNombre, razon = 'Baneado por admin', tiempoMinutos = null) => {
        try {
            console.warn('⚠️ La función lexiblebanearJugadorlexible` está deprecada. La llamada ha sido redirigida a lexiblecrearBaneolexible`. Actualice el código para llamar a lexiblecrearBaneolexible` directamente.');
            
            // El parámetro 'uid' se asume que es el 'authId' para el nuevo sistema.
            const authId = uid;
            const duracion = tiempoMinutos || 0;

            if (!authId) {
                throw new Error('Se requiere un authId (proporcionado como uid) para banear con el nuevo sistema.');
            }

            // Llamar a la función de baneo moderna y centralizada.
            return await dbFunctions.crearBaneo(authId, nombreJugador, razon, adminNombre, duracion);

        } catch (error) {
            console.error('❌ Error en la función deprecada lexiblebanearJugadorlexible`:', error);
            // Re-lanzar el error para que el código que llama sepa que falló.
            throw error;
        }
    },
    
    // Eliminar cuentas inactivas
    eliminarCuentasInactivas: async () => {
        try {
            // Primero contar cuántas cuentas serán eliminadas
            const countQuery = `SELECT COUNT(*) as count FROM jugadores 
                                WHERE STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ') < DATE_SUB(NOW(), INTERVAL 90 DAY)`;
            
            const countResult = await executeQuery(countQuery);
            const cuentasAEliminar = countResult[0].count;
            console.log(`🧹 [DB] Se encontraron ${cuentasAEliminar} cuentas inactivas por más de 90 días`);
            
            if (cuentasAEliminar === 0) {
                return { eliminadas: 0, mensaje: 'No hay cuentas inactivas para eliminar' };
            }
            
            // Obtener nombres de las cuentas que serán eliminadas (para log)
            const selectQuery = `SELECT nombre, fechaUltimoPartido FROM jugadores 
                                WHERE STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ') < DATE_SUB(NOW(), INTERVAL 90 DAY)`;
            
            const cuentas = await executeQuery(selectQuery);
            
            // Log de las cuentas que serán eliminadas
            console.log('📋 [DB] Cuentas que serán eliminadas:');
            cuentas.forEach(jugador => {
                const diasInactivo = Math.floor((new Date() - new Date(jugador.fechaUltimoPartido)) / (1000 * 60 * 60 * 24));
                console.log(`  - ${jugador.nombre} (${diasInactivo} días inactivo)`);
            });
            
            // Proceder con la eliminación
            const deleteQuery = `DELETE FROM jugadores 
                                WHERE STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ') < DATE_SUB(NOW(), INTERVAL 90 DAY)`;
            
            const result = await executeQuery(deleteQuery);
            
            console.log(`✅ [DB] ${result.affectedRows} cuentas inactivas eliminadas exitosamente`);
            return { 
                eliminadas: result.affectedRows, 
                mensaje: `Se eliminaron ${result.affectedRows} cuentas inactivas por más de 90 días`,
                cuentas: cuentas.map(r => ({ nombre: r.nombre, fechaUltimoPartido: r.fechaUltimoPartido }))
            };
        } catch (error) {
            console.error('❌ [DB] Error eliminando cuentas inactivas:', error);
            throw error;
        }
    },
    
    // Obtener estadísticas de inactividad
    obtenerEstadisticasInactividad: async () => {
        try {
            const queries = {
                total: 'SELECT COUNT(*) as count FROM jugadores',
                inactivas30: `SELECT COUNT(*) as count FROM jugadores WHERE STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ') < DATE_SUB(NOW(), INTERVAL 30 DAY)`,
                inactivas60: `SELECT COUNT(*) as count FROM jugadores WHERE STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ') < DATE_SUB(NOW(), INTERVAL 60 DAY)`,
                inactivas90: `SELECT COUNT(*) as count FROM jugadores WHERE STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ') < DATE_SUB(NOW(), INTERVAL 90 DAY)`,
            };
            
            const resultados = {};
            
            for (const [key, query] of Object.entries(queries)) {
                const result = await executeQuery(query);
                resultados[key] = result[0].count;
            }
            
            // Obtener próximas a eliminar
            const proximasQuery = `SELECT nombre, fechaUltimoPartido FROM jugadores 
                                  WHERE STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ') < DATE_SUB(NOW(), INTERVAL 80 DAY)
                                  AND STR_TO_DATE(fechaUltimoPartido, '%Y-%m-%dT%H:%i:%s.%fZ') >= DATE_SUB(NOW(), INTERVAL 90 DAY)
                                  ORDER BY fechaUltimoPartido ASC`;
            
            resultados.proximasEliminar = await executeQuery(proximasQuery);
            
            return resultados;
        } catch (error) {
            console.error('❌ [DB] Error obteniendo estadísticas de inactividad:', error);
            throw error;
        }
    },
    
    // ====================== FUNCIONES PARA AUTH_ID SYSTEM ======================
    
    // Guardar/actualizar jugador por auth_id
    guardarJugadorPorAuth: async (authId, nombreActual, stats) => {
        try {
            if (!authId || !nombreActual) {
                throw new Error('authId y nombreActual son requeridos');
            }

            // Siempre registrar el intento de uso de un nombre
            await dbFunctions.registrarNombreJugador(authId, nombreActual);
            
            const statsSeguras = {
                partidos: stats?.partidos ?? 0,
                victorias: stats?.victorias ?? 0,
                derrotas: stats?.derrotas ?? 0,
                goles: stats?.goles ?? 0,
                asistencias: stats?.asistencias ?? 0,
                autogoles: stats?.autogoles ?? 0,
                mejorRachaGoles: stats?.mejorRachaGoles ?? 0,
                mejorRachaAsistencias: stats?.mejorRachaAsistencias ?? 0,
                hatTricks: stats?.hatTricks ?? 0,
                vallasInvictas: stats?.vallasInvictas ?? 0,
                tiempoJugado: stats?.tiempoJugado ?? 0,
                promedioGoles: stats?.promedioGoles ?? 0.0,
                promedioAsistencias: stats?.promedioAsistencias ?? 0.0,
                fechaPrimerPartido: stats?.fechaPrimerPartido ?? new Date(),
                fechaUltimoPartido: stats?.fechaUltimoPartido ?? new Date(),
                xp: stats?.xp ?? 40,
                nivel: stats?.nivel ?? 1,
                codigoRecuperacion: stats?.codigoRecuperacion ?? null,
                fechaCodigoCreado: stats?.fechaCodigoCreado ?? null,
                mvps: stats?.mvps ?? 0
            };

            const upsertQuery = `
                INSERT INTO jugadores (
                    auth_id, nombre, nombre_display, partidos, victorias, derrotas, goles, asistencias, autogoles,
                    mejorRachaGoles, mejorRachaAsistencias, hatTricks, vallasInvictas, tiempoJugado,
                    promedioGoles, promedioAsistencias, fechaPrimerPartido, fechaUltimoPartido,
                    xp, nivel, codigoRecuperacion, fechaCodigoCreado, mvps, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE
                    nombre = VALUES(nombre),
                    nombre_display = VALUES(nombre_display),
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
                    fechaUltimoPartido = VALUES(fechaUltimoPartido),
                    xp = VALUES(xp),
                    nivel = VALUES(nivel),
                    codigoRecuperacion = VALUES(codigoRecuperacion),
                    fechaCodigoCreado = VALUES(fechaCodigoCreado),
                    mvps = VALUES(mvps),
                    updated_at = CURRENT_TIMESTAMP;
            `;

            const buildParams = (name) => [
                authId, name, name, 
                statsSeguras.partidos, statsSeguras.victorias, statsSeguras.derrotas, statsSeguras.goles, 
                statsSeguras.asistencias, statsSeguras.autogoles, statsSeguras.mejorRachaGoles, statsSeguras.mejorRachaAsistencias, 
                statsSeguras.hatTricks, statsSeguras.vallasInvictas, statsSeguras.tiempoJugado, statsSeguras.promedioGoles, 
                statsSeguras.promedioAsistencias, statsSeguras.fechaPrimerPartido, statsSeguras.fechaUltimoPartido, 
                statsSeguras.xp, statsSeguras.nivel, statsSeguras.codigoRecuperacion, statsSeguras.fechaCodigoCreado,
                statsSeguras.mvps
            ];

            try {
                await executeQuery(upsertQuery, buildParams(nombreActual));
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY' && error.message.includes("'nombre'")) {
                    const nombreUnico = `${nombreActual} (${Date.now()})`;
                    console.warn(`[DB] Colisión de nombre para "${nombreActual}". Reintentando con "${nombreUnico}".`);
                    await executeQuery(upsertQuery, buildParams(nombreUnico));
                } else {
                    throw error;
                }
            }
            
            const jugadorFinal = await dbFunctions.obtenerJugadorPorAuth(authId);
            if (!jugadorFinal) {
                throw new Error('Fallo crítico: El jugador no se guardó/encontró después de la operación.');
            }
            
            return jugadorFinal.id;
        } catch (error) {
            console.error(`Error guardando jugador por auth_id (${authId}):`, error);
            throw error;
        }
    },
    
    // Obtener jugador por auth_id
    obtenerJugadorPorAuth: async (authId) => {
        const query = 'SELECT * FROM jugadores WHERE auth_id = ?';
        try {
            const results = await executeQuery(query, [authId]);
            return results[0] || null;
        } catch (error) {
            console.error('❌ [DB] Error obteniendo jugador por auth_id:', error);
            throw error;
        }
    },
    
    // Buscar jugador SOLO por auth_id (sin fallback por nombre)
    buscarJugador: async (busqueda, tipoPreferido = 'auth') => {
        try {
            if (!busqueda) return null;
            const jugador = await dbFunctions.obtenerJugadorPorAuth(busqueda);
            if (jugador) {
                console.log(`🔍 [DB] [AUTH-ID] Jugador encontrado por auth: ${jugador.nombre_display || jugador.nombre}`);
                return jugador;
            }
            console.log(`❌ [DB] [AUTH-ID] Jugador no encontrado por auth: ${busqueda}`);
            return null;
        } catch (error) {
            console.error('❌ [DB] Error buscando jugador por auth:', error);
            return null;
        }
    },
    
    // Registrar historial de nombres de un jugador
    registrarNombreJugador: async (authId, nombreUsado) => {
        try {
            const ahora = new Date();
            const query = `INSERT INTO jugador_nombres_historial 
                          (auth_id, nombre, primera_vez_usado, ultima_vez_usado, veces_usado)
                          VALUES (?, ?, ?, ?, 1)
                          ON DUPLICATE KEY UPDATE
                          ultima_vez_usado = VALUES(ultima_vez_usado),
                          veces_usado = veces_usado + 1`;
            
            await executeQuery(query, [authId, nombreUsado, ahora, ahora]);
            console.log(`📝 [DB] [AUTH-ID] Nombre registrado: ${nombreUsado} -> ${authId}`);
        } catch (error) {
            console.error('❌ [DB] Error registrando nombre del jugador:', error);
        }
    },
    
    // Obtener historial de nombres de un jugador
    obtenerHistorialNombres: async (authId) => {
        try {
            const query = `SELECT nombre, primera_vez_usado, ultima_vez_usado, veces_usado 
                          FROM jugador_nombres_historial 
                          WHERE auth_id = ? 
                          ORDER BY ultima_vez_usado DESC`;
            
            const results = await executeQuery(query, [authId]);
            return results;
        } catch (error) {
            console.error('❌ [DB] Error obteniendo historial de nombres:', error);
            return [];
        }
    },
    
    // Migrar estadísticas de nombre a auth_id
    migrarJugadorAAuth: async (nombreAnterior, authId) => {
        try {
            console.log(`✅ [DB] [MIGRACIÓN] Iniciando migración: ${nombreAnterior} -> ${authId}`);
            
            // Verificar si ya existe un jugador con este auth_id
            const jugadorExistente = await dbFunctions.obtenerJugadorPorAuth(authId);
            if (jugadorExistente) {
                console.log(`⚠️ [DB] [MIGRACIÓN] Ya existe jugador con auth_id ${authId}: ${jugadorExistente.nombre}`);
                
                // Solo registrar el nombre en el historial
                await dbFunctions.registrarNombreJugador(authId, nombreAnterior);
                return { migrado: false, razon: 'jugador_ya_existe', jugadorExistente };
            }
            
            // Buscar jugador por nombre antiguo
            const jugadorAntiguo = await dbFunctions.obtenerJugador(nombreAnterior);
            if (!jugadorAntiguo) {
                console.log(`❌ [DB] [MIGRACIÓN] No se encontró jugador con nombre ${nombreAnterior}`);
                return { migrado: false, razon: 'jugador_no_encontrado' };
            }
            
            // Actualizar el jugador con el auth_id
            const query = `UPDATE jugadores 
                          SET auth_id = ?, nombre_display = nombre
                          WHERE nombre = ?`;
            
            const result = await executeQuery(query, [authId, nombreAnterior]);
            
            if (result.affectedRows > 0) {
                // Registrar en el historial de nombres
                await dbFunctions.registrarNombreJugador(authId, nombreAnterior);
                
                console.log(`✅ [DB] [MIGRACIÓN] Completada: ${nombreAnterior} -> ${authId}`);
                return { 
                    migrado: true, 
                    jugadorMigrado: {
                        nombre: nombreAnterior,
                        authId: authId,
                        stats: jugadorAntiguo
                    }
                };
            } else {
                console.error(`❌ [DB] [MIGRACIÓN] Error al actualizar jugador ${nombreAnterior}`);
                return { migrado: false, razon: 'error_actualizacion' };
            }
        } catch (error) {
            console.error('❌ [DB] Error en migración a auth_id:', error);
            return { migrado: false, razon: 'error_sistema', error: error.message };
        }
    },
    
    // ====================== FUNCIONES PARA TRACKING DE SALIDAS ======================
    
    // Registrar salida de jugador
    registrarSalidaJugador: async (nombre, authId, playerId, razon = 'Voluntaria') => {
        try {
            const query = `INSERT INTO salidas_jugadores 
                          (nombre, auth_id, player_id, razon_salida)
                          VALUES (?, ?, ?, ?)`;
            
            const result = await executeQuery(query, [nombre, authId, playerId, razon]);
            console.log(`📝 [DB] Salida registrada: ${nombre} (ID: ${playerId})`);
            return result.insertId;
        } catch (error) {
            console.error('❌ [DB] Error registrando salida de jugador:', error);
            throw error;
        }
    },
    
    // Obtener últimas salidas con paginación
    obtenerUltimasSalidas: async (pagina = 1, porPagina = 10) => {
        try {
            // Asegurar que los parámetros sean números enteros
            const paginaInt = parseInt(pagina) || 1;
            const porPaginaInt = parseInt(porPagina) || 10;
            const offset = (paginaInt - 1) * porPaginaInt;
            
            console.log(`🔍 [DB] DEBUG: obtenerUltimasSalidas - página: ${paginaInt}, porPagina: ${porPaginaInt}, offset: ${offset}`);
            
            // Obtener el total de registros para paginación
            const countQuery = `SELECT COUNT(*) as total FROM salidas_jugadores`;
            const countResult = await executeQuery(countQuery, []);
            const total = countResult[0].total;
            
            console.log(`🔍 [DB] DEBUG: Total de registros encontrados: ${total}`);
            
            // Obtener los registros de la página actual
            // Usar LIMIT con números enteros directamente en lugar de parámetros preparados
            const query = `SELECT nombre, player_id, fecha_salida, razon_salida 
                          FROM salidas_jugadores 
                          ORDER BY fecha_salida DESC 
                          LIMIT ${porPaginaInt} OFFSET ${offset}`;
            
            console.log(`🔍 [DB] DEBUG: Ejecutando query: ${query}`);
            
            const results = await executeQuery(query, []);
            
            console.log(`🔍 [DB] DEBUG: Resultados obtenidos: ${results.length} registros`);
            
            return {
                success: true,
                data: results,
                total: total,
                pagina: paginaInt,
                porPagina: porPaginaInt
            };
        } catch (error) {
            console.error('❌ [DB] Error obteniendo últimas salidas:', error);
            console.error('❌ [DB] Stack trace:', error.stack);
            return {
                success: false,
                error: error.message,
                data: [],
                total: 0,
                pagina: parseInt(pagina) || 1,
                porPagina: parseInt(porPagina) || 10
            };
        }
    }
};

module.exports = dbFunctions;