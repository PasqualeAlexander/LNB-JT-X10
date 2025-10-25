/**
 * SISTEMA HÍBRIDO DE UID MEJORADO - VERSION MYSQL
 * Combina la persistencia de BD con la robustez del sistema actual
 */

const crypto = require('crypto');
const { executeQuery, executeTransaction } = require('./config/database');

class UIDSystemMejorado {
    constructor() {
        this.uidCache = new Map(); // Cache en memoria para rendimiento
        this.initDB();
    }

    // Inicializar tabla de UIDs persistente en MySQL
    async initDB() {
        try {
            await executeQuery(`CREATE TABLE IF NOT EXISTS uids_persistentes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                uid VARCHAR(32) UNIQUE NOT NULL,
                nombre VARCHAR(100),
                ip VARCHAR(45),
                auth_haxball VARCHAR(100),
                conn_haxball VARCHAR(100),
                primera_conexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ultima_conexion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                veces_conectado INT DEFAULT 1,
                activo BOOLEAN DEFAULT TRUE,
                INDEX idx_uid (uid),
                INDEX idx_auth (auth_haxball),
                INDEX idx_conn (conn_haxball),
                INDEX idx_ip_nombre (ip, nombre),
                INDEX idx_activo (activo)
            )`);

            console.log('✅ Tabla UIDs persistentes MySQL inicializada correctamente');
        } catch (error) {
            console.error('❌ Error inicializando tabla UIDs:', error);
            throw error;
        }
    }

    // Función principal: obtener UID persistente
    async obtenerUID(jugador) {
        try {
            console.log(`🔍 Obteniendo UID para ${jugador.name}...`);

            // 1. PRIORIDAD MÁXIMA: auth nativo de Haxball (más confiable)
            if (jugador.auth && jugador.auth.length > 8) {
                const uidExistente = await this.buscarPorAuth(jugador.auth);
                if (uidExistente) {
                    await this.actualizarUltimaConexion(uidExistente.uid, jugador);
                    console.log(`✅ UID encontrado por auth: ${uidExistente.uid}`);
                    return uidExistente.uid;
                } else {
                    // Crear nuevo registro con auth
                    const nuevoUID = await this.crearNuevoUID(jugador, 'auth');
                    console.log(`✅ Nuevo UID creado con auth: ${nuevoUID}`);
                    return nuevoUID;
                }
            }

            // 2. PRIORIDAD ALTA: conn de Haxball 
            if (jugador.conn && jugador.conn.length > 8) {
                const uidExistente = await this.buscarPorConn(jugador.conn);
                if (uidExistente) {
                    await this.actualizarUltimaConexion(uidExistente.uid, jugador);
                    console.log(`✅ UID encontrado por conn: ${uidExistente.uid}`);
                    return uidExistente.uid;
                } else {
                    const nuevoUID = await this.crearNuevoUID(jugador, 'conn');
                    console.log(`✅ Nuevo UID creado con conn: ${nuevoUID}`);
                    return nuevoUID;
                }
            }

            // 3. PRIORIDAD MEDIA: Buscar por IP + nombre (jugadores regulares)
            const ip = this.obtenerIP(jugador);
            if (ip) {
                const uidExistente = await this.buscarPorIPYNombre(ip, jugador.name);
                if (uidExistente) {
                    await this.actualizarUltimaConexion(uidExistente.uid, jugador);
                    console.log(`✅ UID encontrado por IP+nombre: ${uidExistente.uid}`);
                    return uidExistente.uid;
                }

                // Buscar solo por IP (mismo jugador, nombre diferente)
                const uidPorIP = await this.buscarPorIP(ip);
                if (uidPorIP) {
                    // Actualizar nombre si es diferente
                    await this.actualizarNombre(uidPorIP.uid, jugador.name);
                    await this.actualizarUltimaConexion(uidPorIP.uid, jugador);
                    console.log(`✅ UID encontrado por IP (nombre actualizado): ${uidPorIP.uid}`);
                    return uidPorIP.uid;
                }
            }

            // 4. ÚLTIMO RECURSO: Crear UID completamente nuevo
            const nuevoUID = await this.crearNuevoUID(jugador, 'generado');
            console.log(`✅ Nuevo UID generado: ${nuevoUID}`);
            return nuevoUID;

        } catch (error) {
            console.error('❌ Error obteniendo UID:', error);
            // Fallback de emergencia
            return this.generarUIDEmergencia(jugador);
        }
    }

    // Buscar por auth de Haxball
    async buscarPorAuth(auth) {
        try {
            const result = await executeQuery(
                "SELECT * FROM uids_persistentes WHERE auth_haxball = ? AND activo = TRUE", 
                [auth]
            );
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('❌ Error buscando por auth:', error);
            return null;
        }
    }

    // Buscar por conn de Haxball
    async buscarPorConn(conn) {
        try {
            const result = await executeQuery(
                "SELECT * FROM uids_persistentes WHERE conn_haxball = ? AND activo = TRUE", 
                [conn]
            );
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('❌ Error buscando por conn:', error);
            return null;
        }
    }

    // Buscar por IP y nombre
    async buscarPorIPYNombre(ip, nombre) {
        try {
            const result = await executeQuery(
                "SELECT * FROM uids_persistentes WHERE ip = ? AND nombre = ? AND activo = TRUE", 
                [ip, nombre]
            );
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('❌ Error buscando por IP y nombre:', error);
            return null;
        }
    }

    // Buscar solo por IP
    async buscarPorIP(ip) {
        try {
            const result = await executeQuery(
                "SELECT * FROM uids_persistentes WHERE ip = ? AND activo = TRUE ORDER BY ultima_conexion DESC LIMIT 1", 
                [ip]
            );
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('❌ Error buscando por IP:', error);
            return null;
        }
    }

    // Crear nuevo UID
    async crearNuevoUID(jugador, metodo) {
        const uid = this.generarUIDSeguro();
        const ip = this.obtenerIP(jugador);
        
        try {
            const result = await executeQuery(
                `INSERT INTO uids_persistentes 
                (uid, nombre, ip, auth_haxball, conn_haxball, primera_conexion, ultima_conexion) 
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
                [uid, jugador.name, ip, jugador.auth || null, jugador.conn || null]
            );

            console.log(`✅ UID creado exitosamente por ${metodo}: ${uid}`);
            return uid;
        } catch (error) {
            console.error('❌ Error creando UID:', error);
            // Si hay error de duplicado, generar otro UID
            if (error.message.includes('Duplicate')) {
                const nuevoUID = this.generarUIDSeguro();
                console.log(`🔄 UID duplicado, generando nuevo: ${nuevoUID}`);
                return nuevoUID;
            }
            throw error;
        }
    }

    // Actualizar última conexión
    async actualizarUltimaConexion(uid, jugador) {
        try {
            await executeQuery(
                `UPDATE uids_persistentes 
                SET ultima_conexion = NOW(), 
                    veces_conectado = veces_conectado + 1,
                    auth_haxball = COALESCE(?, auth_haxball),
                    conn_haxball = COALESCE(?, conn_haxball)
                WHERE uid = ?`,
                [jugador.auth, jugador.conn, uid]
            );
        } catch (error) {
            console.error('❌ Error actualizando última conexión:', error);
        }
    }

    // Actualizar nombre de jugador
    async actualizarNombre(uid, nuevoNombre) {
        try {
            await executeQuery(
                'UPDATE uids_persistentes SET nombre = ? WHERE uid = ?',
                [nuevoNombre, uid]
            );
            console.log(`✅ Nombre actualizado para UID ${uid}: ${nuevoNombre}`);
        } catch (error) {
            console.error('❌ Error actualizando nombre:', error);
        }
    }

    // Generar UID seguro único
    generarUIDSeguro() {
        const timestamp = Date.now().toString(36);
        const randomBytes = crypto.randomBytes(8).toString('hex');
        return `${timestamp}_${randomBytes}`.substring(0, 32);
    }

    // Obtener IP del jugador (simulada o de algún otro método)
    obtenerIP(jugador) {
        // Implementar según tu lógica específica
        // Podría ser una IP simulada, hash del auth, etc.
        if (jugador.conn) {
            return crypto.createHash('md5').update(jugador.conn).digest('hex').substring(0, 15);
        }
        if (jugador.auth) {
            return crypto.createHash('md5').update(jugador.auth).digest('hex').substring(0, 15);
        }
        return crypto.createHash('md5').update(jugador.name + Date.now()).digest('hex').substring(0, 15);
    }

    // UID de emergencia cuando todo falla
    generarUIDEmergencia(jugador) {
        const emergencyUID = `emergency_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
        console.warn(`⚠️ Generando UID de emergencia para ${jugador.name}: ${emergencyUID}`);
        return emergencyUID;
    }

    // Obtener estadísticas del sistema UID
    async obtenerEstadisticas() {
        try {
            const estadisticas = await Promise.all([
                executeQuery('SELECT COUNT(*) as total FROM uids_persistentes WHERE activo = TRUE'),
                executeQuery(`SELECT COUNT(*) as con_auth FROM uids_persistentes 
                             WHERE activo = TRUE AND auth_haxball IS NOT NULL`),
                executeQuery(`SELECT COUNT(*) as con_conn FROM uids_persistentes 
                             WHERE activo = TRUE AND conn_haxball IS NOT NULL`),
                executeQuery(`SELECT AVG(veces_conectado) as promedio_conexiones FROM uids_persistentes 
                             WHERE activo = TRUE`),
                executeQuery(`SELECT COUNT(*) as activos_recientes FROM uids_persistentes 
                             WHERE activo = TRUE AND ultima_conexion >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
            ]);

            return {
                totalUIDs: estadisticas[0][0].total,
                conAuth: estadisticas[1][0].con_auth,
                conConn: estadisticas[2][0].con_conn,
                promedioConexiones: Math.round(estadisticas[3][0].promedio_conexiones || 0),
                activosRecientes: estadisticas[4][0].activos_recientes
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas UID:', error);
            return null;
        }
    }

    // Limpiar UIDs inactivos antiguos
    async limpiarUIDsInactivos(diasInactivos = 90) {
        try {
            const result = await executeQuery(
                `UPDATE uids_persistentes 
                SET activo = FALSE 
                WHERE ultima_conexion < DATE_SUB(NOW(), INTERVAL ? DAY) 
                AND activo = TRUE`,
                [diasInactivos]
            );

            console.log(`🧹 ${result.affectedRows} UIDs marcados como inactivos (>${diasInactivos} días sin conexión)`);
            return result.affectedRows;
        } catch (error) {
            console.error('❌ Error limpiando UIDs inactivos:', error);
            return 0;
        }
    }

    // Buscar UID por nombre de jugador
    async buscarPorNombre(nombre) {
        try {
            const result = await executeQuery(
                `SELECT * FROM uids_persistentes 
                WHERE nombre = ? AND activo = TRUE 
                ORDER BY ultima_conexion DESC LIMIT 1`, 
                [nombre]
            );
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('❌ Error buscando por nombre:', error);
            return null;
        }
    }

    // Obtener historial de conexiones de un UID
    async obtenerHistorialUID(uid) {
        try {
            const result = await executeQuery(
                `SELECT uid, nombre, ip, auth_haxball, conn_haxball, 
                        primera_conexion, ultima_conexion, veces_conectado
                FROM uids_persistentes 
                WHERE uid = ?`, 
                [uid]
            );
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error('❌ Error obteniendo historial UID:', error);
            return null;
        }
    }
}

module.exports = UIDSystemMejorado;
