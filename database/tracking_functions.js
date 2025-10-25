/**
 * FUNCIONES DE BASE DE DATOS PARA SISTEMA DE TRACKING PERSISTENTE
 * ==============================================================
 * 
 * Funciones para manejar el tracking de jugadores de manera persistente
 * en base de datos, reemplazando los Maps de JavaScript para evitar
 * pérdida de datos cuando se cae el host.
 */

const { executeQuery, executeTransaction } = require('../config/database');

const trackingFunctions = {
    
    // ====================== FUNCIONES DE NOMBRES DE JUGADORES ======================
    
    /**
     * Guardar o actualizar nombre en el historial de nombres
     */
    guardarNombreJugador: async (auth, nombre, ipSimulada, salaId) => {
        try {
            const query = `
                INSERT INTO historial_nombres_jugadores 
                (auth_jugador, nombre, primera_vez_usado, ultima_vez_usado, veces_usado, sala_id, ip_simulada)
                VALUES (?, ?, NOW(), NOW(), 1, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    ultima_vez_usado = NOW(),
                    veces_usado = veces_usado + 1,
                    sala_id = VALUES(sala_id),
                    ip_simulada = VALUES(ip_simulada)
            `;
            
            const result = await executeQuery(query, [auth, nombre, salaId, ipSimulada]);
            console.log(`📝 Nombre "${nombre}" guardado para auth: ${auth.substring(0, 8)}...`);
            return result;
        } catch (error) {
            console.error('❌ Error guardando nombre en BD:', error);
            throw error;
        }
    },
    
    /**
     * Obtener historial de nombres de un jugador
     */
    obtenerHistorialNombres: async (auth) => {
        try {
            const query = `
                SELECT nombre, primera_vez_usado, ultima_vez_usado, veces_usado, sala_id
                FROM historial_nombres_jugadores 
                WHERE auth_jugador = ? 
                ORDER BY ultima_vez_usado DESC
            `;
            
            const resultados = await executeQuery(query, [auth]);
            return resultados;
        } catch (error) {
            console.error('❌ Error obteniendo historial de nombres:', error);
            return [];
        }
    },
    
    /**
     * Buscar jugadores por nombre (búsqueda parcial)
     */
    buscarJugadoresPorNombre: async (nombre) => {
        try {
            const query = `
                SELECT DISTINCT 
                    h.auth_jugador, 
                    h.nombre, 
                    h.ultima_vez_usado, 
                    h.veces_usado,
                    t.primer_nombre,
                    t.total_conexiones
                FROM historial_nombres_jugadores h
                LEFT JOIN jugadores_tracking t ON h.auth_jugador = t.auth_jugador
                WHERE h.nombre LIKE ?
                ORDER BY h.ultima_vez_usado DESC
                LIMIT 50
            `;
            
            const resultados = await executeQuery(query, [`%${nombre}%`]);
            return resultados;
        } catch (error) {
            console.error('❌ Error buscando por nombre:', error);
            return [];
        }
    },
    
    // ====================== FUNCIONES DE TRACKING PRINCIPAL ======================
    
    /**
     * Generar IP simulada única
     */
    generarIPSimulada: () => {
        const octeto1 = Math.floor(Math.random() * 223) + 1; // 1-223 (evitar 0 y rangos especiales)
        const octeto2 = Math.floor(Math.random() * 256);
        const octeto3 = Math.floor(Math.random() * 256);
        const octeto4 = Math.floor(Math.random() * 254) + 1; // 1-254 (evitar 0 y 255)
        return `${octeto1}.${octeto2}.${octeto3}.${octeto4}`;
    },
    
    /**
     * Trackear jugador - función principal para registrar/actualizar datos
     */
    trackearJugador: async (jugador, salaId = null) => {
        try {
            const auth = jugador.auth;
            const nombre = jugador.name;
            const ahora = new Date();
            const hoy = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
            
            console.log(`🔍 Trackeando jugador: ${nombre} (Auth: ${auth.substring(0, 8)}...)`);
            
            // Verificar si el jugador ya existe
            const jugadorExiste = await trackingFunctions.obtenerDatosTracking(auth);
            
            if (!jugadorExiste) {
                // Nuevo jugador - crear registro completo
                const ipSimulada = trackingFunctions.generarIPSimulada();
                
                // Insertar en tracking principal
                const queryTracking = `
                    INSERT INTO jugadores_tracking 
                    (auth_jugador, primer_nombre, nombre_actual, primera_conexion, ultima_conexion,
                     total_conexiones, conexiones_hoy, fecha_contador_diario, ip_simulada, 
                     es_jugador_nuevo, ultima_sala)
                    VALUES (?, ?, ?, ?, ?, 1, 1, ?, ?, TRUE, ?)
                `;
                
                await executeQuery(queryTracking, [
                    auth, nombre, nombre, ahora, ahora, hoy, ipSimulada, salaId
                ]);
                
                // Guardar nombre en historial
                await trackingFunctions.guardarNombreJugador(auth, nombre, ipSimulada, salaId);
                
                // Iniciar sesión
                await trackingFunctions.iniciarSesion(auth, nombre, salaId, ipSimulada);
                
                // Actualizar estadísticas diarias
                await trackingFunctions.actualizarEstadisticasDiarias('nuevo_jugador');
                
                console.log(`🆕 Nuevo jugador registrado: ${nombre} con IP ${ipSimulada}`);
                
                return {
                    esNuevo: true,
                    ipSimulada: ipSimulada,
                    totalConexiones: 1,
                    conexionesHoy: 1,
                    primerNombre: nombre
                };
                
            } else {
                // Jugador existente - actualizar datos
                let conexionesHoy = jugadorExiste.conexiones_hoy;
                
                // Verificar si cambió el día
                if (jugadorExiste.fecha_contador_diario !== hoy) {
                    conexionesHoy = 1; // Resetear contador diario
                } else {
                    conexionesHoy += 1; // Incrementar contador del día
                }
                
                // Actualizar tracking principal
                const queryUpdate = `
                    UPDATE jugadores_tracking 
                    SET nombre_actual = ?,
                        ultima_conexion = ?,
                        total_conexiones = total_conexiones + 1,
                        conexiones_hoy = ?,
                        fecha_contador_diario = ?,
                        es_jugador_nuevo = FALSE,
                        ultima_sala = ?
                    WHERE auth_jugador = ?
                `;
                
                await executeQuery(queryUpdate, [
                    nombre, ahora, conexionesHoy, hoy, salaId, auth
                ]);
                
                // Guardar nombre en historial
                await trackingFunctions.guardarNombreJugador(
                    auth, nombre, jugadorExiste.ip_simulada, salaId
                );
                
                // Iniciar nueva sesión
                await trackingFunctions.iniciarSesion(
                    auth, nombre, salaId, jugadorExiste.ip_simulada
                );
                
                // Actualizar estadísticas diarias
                await trackingFunctions.actualizarEstadisticasDiarias('conexion');
                
                console.log(`🔄 Jugador actualizado: ${nombre} (${jugadorExiste.total_conexiones + 1} conexiones)`);
                
                return {
                    esNuevo: false,
                    ipSimulada: jugadorExiste.ip_simulada,
                    totalConexiones: jugadorExiste.total_conexiones + 1,
                    conexionesHoy: conexionesHoy,
                    primerNombre: jugadorExiste.primer_nombre
                };
            }
            
        } catch (error) {
            console.error('❌ Error en trackearJugador:', error);
            throw error;
        }
    },
    
    /**
     * Obtener datos de tracking de un jugador
     */
    obtenerDatosTracking: async (auth) => {
        try {
            const query = `
                SELECT * FROM jugadores_tracking 
                WHERE auth_jugador = ?
            `;
            
            const result = await executeQuery(query, [auth]);
            return result[0] || null;
        } catch (error) {
            console.error('❌ Error obteniendo datos de tracking:', error);
            return null;
        }
    },
    
    // ====================== FUNCIONES DE SESIONES ======================
    
    /**
     * Iniciar una nueva sesión de jugador
     */
    iniciarSesion: async (auth, nombre, salaId, ipSimulada) => {
        try {
            // Cerrar cualquier sesión activa previa
            await trackingFunctions.cerrarSesionesActivas(auth);
            
            // Crear nueva sesión
            const query = `
                INSERT INTO sesiones_jugadores 
                (auth_jugador, nombre_sesion, inicio_sesion, sala_id, ip_simulada, is_active)
                VALUES (?, ?, NOW(), ?, ?, TRUE)
            `;
            
            const result = await executeQuery(query, [auth, nombre, salaId, ipSimulada]);
            console.log(`🔄 Nueva sesión iniciada para: ${nombre}`);
            return result.insertId;
            
        } catch (error) {
            console.error('❌ Error iniciando sesión:', error);
            throw error;
        }
    },
    
    /**
     * Finalizar sesión de jugador
     */
    finalizarSesion: async (auth, motivoDesconexion = 'normal', razonAdicional = null) => {
        try {
            const query = `
                UPDATE sesiones_jugadores 
                SET fin_sesion = NOW(),
                    duracion_sesion = TIMESTAMPDIFF(MICROSECOND, inicio_sesion, NOW()) / 1000,
                    motivo_desconexion = ?,
                    razon_adicional = ?,
                    is_active = FALSE
                WHERE auth_jugador = ? AND is_active = TRUE
            `;
            
            const result = await executeQuery(query, [motivoDesconexion, razonAdicional, auth]);
            
            if (result.affectedRows > 0) {
                // Actualizar tiempo total de sesión en tracking
                const updateTrackingQuery = `
                    UPDATE jugadores_tracking t
                    SET t.tiempo_total_sesion = (
                        SELECT COALESCE(SUM(s.duracion_sesion), 0)
                        FROM sesiones_jugadores s 
                        WHERE s.auth_jugador = t.auth_jugador 
                        AND s.duracion_sesion IS NOT NULL
                    )
                    WHERE t.auth_jugador = ?
                `;
                
                await executeQuery(updateTrackingQuery, [auth]);
                console.log(`⏹️ Sesión finalizada para auth: ${auth.substring(0, 8)}...`);
            }
            
            return result.affectedRows;
            
        } catch (error) {
            console.error('❌ Error finalizando sesión:', error);
            throw error;
        }
    },
    
    /**
     * Cerrar sesiones activas de un jugador
     */
    cerrarSesionesActivas: async (auth) => {
        try {
            const query = `
                UPDATE sesiones_jugadores 
                SET fin_sesion = NOW(),
                    duracion_sesion = TIMESTAMPDIFF(MICROSECOND, inicio_sesion, NOW()) / 1000,
                    is_active = FALSE
                WHERE auth_jugador = ? AND is_active = TRUE
            `;
            
            const result = await executeQuery(query, [auth]);
            return result.affectedRows;
            
        } catch (error) {
            console.error('❌ Error cerrando sesiones activas:', error);
            return 0;
        }
    },
    
    // ====================== FUNCIONES DE REPORTES DISCORD ======================
    
    /**
     * Registrar reporte enviado a Discord
     */
    registrarReporteDiscord: async (datosReporte) => {
        try {
            const query = `
                INSERT INTO reportes_discord 
                (auth_jugador, nombre_jugador, tipo_evento, titulo, descripcion, color,
                 webhook_url, enviado_exitosamente, respuesta_webhook, fecha_evento, 
                 fecha_envio, sala_id, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
            `;
            
            const metadata = datosReporte.metadata ? JSON.stringify(datosReporte.metadata) : null;
            
            const result = await executeQuery(query, [
                datosReporte.authJugador || null,
                datosReporte.nombreJugador || null,
                datosReporte.tipoEvento,
                datosReporte.titulo,
                datosReporte.descripcion,
                datosReporte.color || null,
                datosReporte.webhookUrl,
                datosReporte.enviadoExitosamente || false,
                datosReporte.respuestaWebhook || null,
                datosReporte.fechaEvento || new Date(),
                datosReporte.salaId || null,
                metadata
            ]);
            
            // Actualizar estadísticas diarias
            await trackingFunctions.actualizarEstadisticasDiarias('reporte_discord');
            
            return result.insertId;
            
        } catch (error) {
            console.error('❌ Error registrando reporte Discord:', error);
            throw error;
        }
    },
    
    // ====================== FUNCIONES DE ESTADÍSTICAS ======================
    
    /**
     * Actualizar estadísticas diarias
     */
    actualizarEstadisticasDiarias: async (tipoEvento, cantidad = 1) => {
        try {
            // Asegurar que existe registro para hoy
            await executeQuery(
                'INSERT IGNORE INTO estadisticas_tracking_diarias (fecha) VALUES (CURDATE())'
            );
            
            let campoActualizar = '';
            switch (tipoEvento) {
                case 'nuevo_jugador':
                    campoActualizar = 'nuevos_jugadores = nuevos_jugadores + ?, jugadores_unicos = jugadores_unicos + ?';
                    break;
                case 'conexion':
                    campoActualizar = 'total_conexiones = total_conexiones + ?';
                    cantidad = [cantidad]; // Solo un parámetro
                    break;
                case 'nombre_nuevo':
                    campoActualizar = 'nombres_nuevos_registrados = nombres_nuevos_registrados + ?';
                    cantidad = [cantidad];
                    break;
                case 'reporte_discord':
                    campoActualizar = 'reportes_enviados = reportes_enviados + ?';
                    cantidad = [cantidad];
                    break;
                case 'kick':
                    campoActualizar = 'kicks_realizados = kicks_realizados + ?';
                    cantidad = [cantidad];
                    break;
                case 'ban':
                    campoActualizar = 'bans_realizados = bans_realizados + ?';
                    cantidad = [cantidad];
                    break;
                default:
                    return; // Tipo no reconocido
            }
            
            const query = `
                UPDATE estadisticas_tracking_diarias 
                SET ${campoActualizar}
                WHERE fecha = CURDATE()
            `;
            
            const params = Array.isArray(cantidad) ? cantidad : [cantidad, cantidad];
            await executeQuery(query, params);
            
        } catch (error) {
            console.error('❌ Error actualizando estadísticas diarias:', error);
        }
    },
    
    /**
     * Obtener estadísticas completas del sistema
     */
    obtenerEstadisticasCompletas: async () => {
        try {
            const queries = {
                // Estadísticas generales
                totalJugadores: 'SELECT COUNT(*) as total FROM jugadores_tracking',
                jugadoresNuevos: 'SELECT COUNT(*) as total FROM jugadores_tracking WHERE es_jugador_nuevo = TRUE',
                totalNombres: 'SELECT COUNT(*) as total FROM historial_nombres_jugadores',
                sesionesActivas: 'SELECT COUNT(*) as total FROM sesiones_jugadores WHERE is_active = TRUE',
                
                // Estadísticas de hoy
                estadisticasHoy: 'SELECT * FROM estadisticas_tracking_diarias WHERE fecha = CURDATE()',
                
                // Top jugadores por conexiones
                topConexiones: `
                    SELECT primer_nombre, nombre_actual, total_conexiones, ultima_conexion
                    FROM jugadores_tracking 
                    ORDER BY total_conexiones DESC 
                    LIMIT 10
                `,
                
                // Jugadores más activos hoy
                activosHoy: `
                    SELECT primer_nombre, nombre_actual, conexiones_hoy
                    FROM jugadores_tracking 
                    WHERE fecha_contador_diario = CURDATE() AND conexiones_hoy > 0
                    ORDER BY conexiones_hoy DESC 
                    LIMIT 10
                `
            };
            
            const resultados = {};
            
            for (const [key, query] of Object.entries(queries)) {
                try {
                    const result = await executeQuery(query);
                    resultados[key] = result;
                } catch (error) {
                    console.error(`❌ Error en consulta ${key}:`, error);
                    resultados[key] = [];
                }
            }
            
            return resultados;
            
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas completas:', error);
            return {};
        }
    },
    
    // ====================== FUNCIONES DE LIMPIEZA Y MANTENIMIENTO ======================
    
    /**
     * Limpiar sesiones inactivas (más de 30 minutos)
     */
    limpiarSesionesInactivas: async () => {
        try {
            const query = `
                UPDATE sesiones_jugadores 
                SET fin_sesion = NOW(),
                    duracion_sesion = TIMESTAMPDIFF(MICROSECOND, inicio_sesion, NOW()) / 1000,
                    motivo_desconexion = 'timeout',
                    is_active = FALSE
                WHERE is_active = TRUE 
                AND inicio_sesion < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
            `;
            
            const result = await executeQuery(query);
            
            if (result.affectedRows > 0) {
                console.log(`🧹 ${result.affectedRows} sesiones inactivas limpiadas`);
            }
            
            return result.affectedRows;
            
        } catch (error) {
            console.error('❌ Error limpiando sesiones inactivas:', error);
            return 0;
        }
    },
    
    /**
     * Limpiar datos antiguos (más de 90 días)
     */
    limpiarDatosAntiguos: async () => {
        try {
            const fechaLimite = new Date();
            fechaLimite.setDate(fechaLimite.getDate() - 90);
            
            // Limpiar sesiones antiguas
            const querySesiones = `
                DELETE FROM sesiones_jugadores 
                WHERE fin_sesion < ? AND is_active = FALSE
            `;
            
            // Limpiar reportes antiguos
            const queryReportes = `
                DELETE FROM reportes_discord 
                WHERE fecha_evento < ?
            `;
            
            // Limpiar estadísticas diarias antiguas (más de 180 días)
            const fechaLimiteEstadisticas = new Date();
            fechaLimiteEstadisticas.setDate(fechaLimiteEstadisticas.getDate() - 180);
            
            const queryEstadisticas = `
                DELETE FROM estadisticas_tracking_diarias 
                WHERE fecha < ?
            `;
            
            const sesionesLimpiadas = await executeQuery(querySesiones, [fechaLimite]);
            const reportesLimpiados = await executeQuery(queryReportes, [fechaLimite]);
            const estadisticasLimpiadas = await executeQuery(queryEstadisticas, [fechaLimiteEstadisticas]);
            
            console.log(`🧹 Limpieza de datos antiguos completada:`);
            console.log(`   - Sesiones: ${sesionesLimpiadas.affectedRows}`);
            console.log(`   - Reportes: ${reportesLimpiados.affectedRows}`);
            console.log(`   - Estadísticas: ${estadisticasLimpiadas.affectedRows}`);
            
            return {
                sesionesLimpiadas: sesionesLimpiadas.affectedRows,
                reportesLimpiados: reportesLimpiados.affectedRows,
                estadisticasLimpiadas: estadisticasLimpiadas.affectedRows
            };
            
        } catch (error) {
            console.error('❌ Error limpiando datos antiguos:', error);
            return null;
        }
    },
    
    /**
     * Obtener datos completos de jugador para reporte
     */
    obtenerDatosJugadorParaReporte: async (auth, incluirHistorial = true) => {
        try {
            // Datos principales de tracking
            const datosTracking = await trackingFunctions.obtenerDatosTracking(auth);
            
            if (!datosTracking) {
                return null;
            }
            
            let historialNombres = [];
            let sesionActual = null;
            
            if (incluirHistorial) {
                // Historial de nombres
                historialNombres = await trackingFunctions.obtenerHistorialNombres(auth);
                
                // Sesión actual
                const querySesionActual = `
                    SELECT * FROM sesiones_jugadores 
                    WHERE auth_jugador = ? AND is_active = TRUE 
                    ORDER BY inicio_sesion DESC 
                    LIMIT 1
                `;
                
                const resultSesion = await executeQuery(querySesionActual, [auth]);
                sesionActual = resultSesion[0] || null;
            }
            
            return {
                tracking: datosTracking,
                historialNombres: historialNombres,
                sesionActual: sesionActual,
                totalNombresUsados: historialNombres.length
            };
            
        } catch (error) {
            console.error('❌ Error obteniendo datos completos del jugador:', error);
            return null;
        }
    }
};

module.exports = trackingFunctions;
