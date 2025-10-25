/**
 * SISTEMA DE BANEO OFFLINE PARA HAXBALL BOT
 * 
 * Este sistema permite:
 * 1. Banear jugadores por auth_id aunque no estén conectados
 * 2. Aplicar automáticamente baneos pendientes cuando se reconectan
 * 3. Mantener historial completo de baneos en base de datos
 */

const { executeQuery } = require('./config/database');
const dbFunctions = require('./database/db_functions');

class OfflineBanSystem {
    constructor() {
        this.pendingBans = new Map(); // Cache de baneos pendientes
        this.autoCheckInterval = null;
    }

    /**
     * Inicializar el sistema de baneos offline
     */
    async initialize(room) {
        this.room = room;
        console.log('🔧 Inicializando Sistema de Baneo Offline...');
        
        // Cargar baneos pendientes desde la base de datos
        await this.loadPendingBans();
        
        console.log('✅ Sistema de Baneo Offline inicializado correctamente');
    }

    /**
     * Cargar baneos activos desde la base de datos al cache
     */
    async loadPendingBans() {
        try {
            const baneosActivos = await dbFunctions.obtenerBaneosActivos();
            
            this.pendingBans.clear();
            
            baneosActivos.forEach(ban => {
                this.pendingBans.set(ban.authId, {
                    id: ban.id,
                    authId: ban.authId,
                    nombre: ban.nombre,
                    razon: ban.razon,
                    admin: ban.admin,
                    fecha: ban.fecha,
                    duracion: ban.duracion,
                    tipo: ban.duracion > 0 ? 'temporal' : 'permanente'
                });
            });
            
            console.log(`📋 Cargados ${this.pendingBans.size} baneos activos en cache`);
        } catch (error) {
            console.error('❌ Error cargando baneos pendientes:', error);
        }
    }

    /**
     * Crear baneo offline (jugador no conectado)
     */
    async createOfflineBan(authId, nombreJugador, razon, adminName, duracionMinutos = 0) {
        try {
            console.log(`🔧 OFFLINE_BAN: Creando baneo offline para auth_id: ${authId}`);
            
            // 1. Verificar si ya está baneado
            const yaBaneado = await dbFunctions.estaBaneadoPromise(authId);
            if (yaBaneado) {
                throw new Error(`El jugador ya está baneado: ${yaBaneado.razon}`);
            }

            // 2. Crear el baneo en la base de datos
            const baneoCreado = await dbFunctions.crearBaneo(
                authId, 
                nombreJugador, 
                razon, 
                adminName, 
                duracionMinutos
            );

            // 3. Agregar al cache de baneos pendientes
            this.pendingBans.set(authId, {
                id: baneoCreado.id,
                authId: authId,
                nombre: nombreJugador,
                razon: razon,
                admin: adminName,
                fecha: new Date(),
                duracion: duracionMinutos,
                tipo: duracionMinutos > 0 ? 'temporal' : 'permanente'
            });

            // 4. Si el jugador está conectado, aplicar el baneo inmediatamente
            if (this.room) {
                const jugadorConectado = this.room.getPlayerList().find(p => 
                    p.auth === authId || 
                    p.name.toLowerCase() === nombreJugador.toLowerCase()
                );

                if (jugadorConectado) {
                    console.log(`🎯 Jugador encontrado conectado, aplicando baneo inmediatamente`);
                    await this.applyBanToConnectedPlayer(jugadorConectado, razon, duracionMinutos);
                }
            }

            console.log(`✅ OFFLINE_BAN: Baneo offline creado exitosamente (ID: ${baneoCreado.id})`);
            return baneoCreado;

        } catch (error) {
            console.error('❌ OFFLINE_BAN: Error creando baneo offline:', error);
            throw error;
        }
    }

    /**
     * Verificar si un jugador tiene baneos pendientes al conectarse
     */
    async checkPlayerOnJoin(player) {
        try {
            if (!player.auth) {
                // Sin auth no podemos verificar baneos
                return false;
            }

            console.log(`🔍 Verificando baneos pendientes para: ${player.name} (${player.auth})`);

            // 1. Verificar en cache local primero
            let baneoPendiente = this.pendingBans.get(player.auth);

            // 2. Si no está en cache, verificar en base de datos
            if (!baneoPendiente) {
                const baneoEnDB = await dbFunctions.estaBaneadoPromise(player.auth);
                if (baneoEnDB) {
                    baneoPendiente = {
                        id: baneoEnDB.id,
                        authId: baneoEnDB.auth_id,
                        nombre: baneoEnDB.nombre,
                        razon: baneoEnDB.razon,
                        admin: baneoEnDB.admin,
                        fecha: baneoEnDB.fecha,
                        duracion: baneoEnDB.duracion,
                        tipo: baneoEnDB.duracion > 0 ? 'temporal' : 'permanente'
                    };

                    // Agregar al cache
                    this.pendingBans.set(player.auth, baneoPendiente);
                }
            }

            // 3. Si hay baneo pendiente, aplicar inmediatamente
            if (baneoPendiente) {
                console.log(`🚫 Baneo pendiente encontrado para ${player.name}, aplicando...`);
                
                const tiempoTexto = baneoPendiente.duracion > 0 ? 
                    `${baneoPendiente.duracion} minutos` : 'permanentemente';
                
                // Aplicar el baneo
                await this.applyBanToConnectedPlayer(
                    player, 
                    baneoPendiente.razon, 
                    baneoPendiente.duracion
                );

                // Anuncio al resto de la sala
                if (this.room && this.room.sendAnnouncement) {
                    const mensaje = `🚫 ${player.name} fue baneado automáticamente (${tiempoTexto}). Razón: ${baneoPendiente.razon}`;
                    this.room.sendAnnouncement(mensaje, null, 0xFF6347, "bold", 1);
                }

                return true;
            }

            return false;

        } catch (error) {
            console.error('❌ Error verificando baneos al conectarse:', error);
            return false;
        }
    }

    /**
     * Aplicar baneo a jugador conectado
     */
    async applyBanToConnectedPlayer(player, razon, duracionMinutos) {
        try {
            if (!this.room) {
                throw new Error('Room no disponible');
            }

            const tiempoTexto = duracionMinutos > 0 ? 
                `${duracionMinutos} minutos` : 'permanentemente';

            // Aplicar el kickPlayer con ban
            this.room.kickPlayer(player.id, `${razon} (${tiempoTexto})`, true);
            
            console.log(`✅ Baneo aplicado exitosamente a ${player.name}`);
            return true;

        } catch (error) {
            console.error('❌ Error aplicando baneo a jugador conectado:', error);
            throw error;
        }
    }

    /**
     * Buscar jugador en historial por nombre o auth_id para baneo offline
     */
    async findPlayerForOfflineBan(searchTerm) {
        try {
            console.log(`🔍 Buscando jugador para baneo offline: "${searchTerm}"`);

            // Si parece ser un auth_id (hexadecimal largo)
            if (/^[a-fA-F0-9]{8,}$/.test(searchTerm)) {
                console.log('🔍 Término de búsqueda parece ser auth_id directo');
                
                // Buscar en la tabla de jugadores por auth_id
                const query = `SELECT auth_id, nombre, ultima_conexion 
                              FROM jugadores 
                              WHERE auth_id = ? 
                              ORDER BY ultima_conexion DESC 
                              LIMIT 1`;
                
                const results = await executeQuery(query, [searchTerm]);
                if (results.length > 0) {
                    return {
                        authId: results[0].auth_id,
                        nombre: results[0].nombre,
                        ultimaConexion: results[0].ultima_conexion,
                        metodo: 'auth_id_directo'
                    };
                }
            }

            // Buscar por nombre (parcial o completo)
            const queryNombre = `SELECT auth_id, nombre, ultima_conexion 
                               FROM jugadores 
                               WHERE nombre LIKE ? 
                               ORDER BY ultima_conexion DESC 
                               LIMIT 5`;
            
            const resultadosNombre = await executeQuery(queryNombre, [`%${searchTerm}%`]);
            
            if (resultadosNombre.length > 0) {
                // Si hay múltiples resultados, devolver el más reciente
                const mejorCoincidencia = resultadosNombre[0];
                
                return {
                    authId: mejorCoincidencia.auth_id,
                    nombre: mejorCoincidencia.nombre,
                    ultimaConexion: mejorCoincidencia.ultima_conexion,
                    metodo: 'busqueda_nombre',
                    alternativas: resultadosNombre.slice(1).map(r => ({
                        nombre: r.nombre,
                        authId: r.auth_id,
                        ultimaConexion: r.ultima_conexion
                    }))
                };
            }

            // No encontrado
            return null;

        } catch (error) {
            console.error('❌ Error buscando jugador para baneo offline:', error);
            throw error;
        }
    }

    /**
     * Obtener información de un jugador para admins
     */
    async getPlayerInfo(searchTerm) {
        try {
            const jugador = await this.findPlayerForOfflineBan(searchTerm);
            
            if (!jugador) {
                return null;
            }

            // Obtener información adicional
            const baneoActivo = await dbFunctions.estaBaneadoPromise(jugador.authId);
            
            return {
                ...jugador,
                estaBaneado: !!baneoActivo,
                infoBaneo: baneoActivo || null
            };

        } catch (error) {
            console.error('❌ Error obteniendo información de jugador:', error);
            throw error;
        }
    }

    /**
     * Remover baneo del cache cuando se desbanea
     */
    removeBanFromCache(authId) {
        if (this.pendingBans.has(authId)) {
            this.pendingBans.delete(authId);
            console.log(`🗑️ Baneo removido del cache: ${authId}`);
        }
    }

    /**
     * Obtener estadísticas del sistema
     */
    getSystemStats() {
        return {
            baneosEnCache: this.pendingBans.size,
            sistemActivo: !!this.room
        };
    }
}

// Instancia global del sistema
const offlineBanSystem = new OfflineBanSystem();

module.exports = {
    OfflineBanSystem,
    offlineBanSystem
};