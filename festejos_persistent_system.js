/**
 * SISTEMA DE PERSISTENCIA DE FESTEJOS PERSONALIZADOS
 * ==================================================
 * 
 * Sistema completo para mantener festejos de gol y asistencias entre desconexiones
 * usando MySQL como base de datos persistente.
 * 
 * Características:
 * ✅ Persistencia por auth_id y nombre de jugador
 * ✅ Mensajes personalizados para goles y asistencias
 * ✅ Carga automática al conectarse
 * ✅ Validación de mensajes (longitud, caracteres)
 * ✅ Fallback a mensajes por defecto
 * ✅ Limpieza automática de mensajes obsoletos
 */

const isNode = typeof window === 'undefined';

// Solo cargar dependencias en Node.js
let executeQuery = null;
if (isNode) {
    try {
        const dbConfig = require('./config/database');
        executeQuery = dbConfig.executeQuery;
        console.log('✅ Sistema de festejos persistentes - Base de datos conectada');
    } catch (error) {
        console.error('❌ Error conectando sistema de festejos a base de datos:', error);
    }
}

// ==================== CONFIGURACIÓN ====================

const FESTEJOS_CONFIG = {
    // Límites de mensajes
    MAX_LONGITUD_MENSAJE: 50,
    MIN_LONGITUD_MENSAJE: 3,
    
    // Mensajes por defecto
    MENSAJE_DEFAULT_GOL: '¡GOOOOOL!',
    MENSAJE_DEFAULT_ASISTENCIA: '¡Qué asistencia!',
    
    // Configuración de limpieza
    DIAS_INACTIVO_PARA_LIMPIAR: 180, // 6 meses sin usar
    INTERVALO_LIMPIEZA_HORAS: 24,    // Limpiar cada 24 horas
    
    // Validaciones
    CARACTERES_PROHIBIDOS: ['<', '>', '{', '}', '|', '\\', '^', '~', '[', ']', '`'],
    PALABRAS_PROHIBIDAS: ['admin', 'bot', 'hack', 'cheat', 'script'],
    
    // Debug
    DEBUG: false
};

// ==================== SISTEMA PRINCIPAL ====================

class FestejosPersistentSystem {
    constructor() {
        this.isNode = isNode;
        this.cacheMensajes = new Map(); // Cache en memoria para rendimiento: {auth_id: {gol: "msg", asistencia: "msg"}}
        this.jugadoresConectados = new Set(); // Set de auth_ids conectados actualmente
        this.timerLimpieza = null;
        this.inicializado = false;
        
        this.inicializar();
    }
    
    async inicializar() {
        try {
            console.log('🎉 Inicializando sistema de festejos persistentes...');
            
            if (!executeQuery) {
                console.warn('⚠️ Base de datos no disponible - usando sistema en memoria');
                this.inicializado = true;
                return;
            }
            
            // Verificar que la tabla existe
            await this.verificarTabla();
            
            // Programar limpieza automática
            this.programarLimpieza();
            
            this.inicializado = true;
            console.log('✅ Sistema de festejos persistentes inicializado correctamente');
            
        } catch (error) {
            console.error('❌ Error inicializando sistema de festejos:', error);
            this.inicializado = true; // Continuar en modo memoria
        }
    }
    
    async verificarTabla() {
        try {
            const query = `SELECT COUNT(*) as count FROM festejos_personalizados LIMIT 1`;
            await executeQuery(query);
            console.log('✅ Tabla festejos_personalizados verificada');
        } catch (error) {
            console.warn('⚠️ Tabla festejos_personalizados no encontrada o no accesible');
            throw error;
        }
    }
    
    // ==================== FUNCIONES PRINCIPALES ====================
    
    /**
     * Cargar festejos de un jugador al conectarse
     */
    async cargarFestejosJugador(auth_id, player_name) {
        try {
            console.log(`🎉 [SISTEMA DEBUG] cargarFestejosJugador llamado:`);
            console.log(`🎉 [SISTEMA DEBUG] - auth_id: ${auth_id}`);
            console.log(`🎉 [SISTEMA DEBUG] - player_name: ${player_name}`);
            console.log(`🎉 [SISTEMA DEBUG] - inicializado: ${this.inicializado}`);
            
            if (!this.inicializado) {
                console.log(`🎉 [SISTEMA DEBUG] Sistema no inicializado, retornando null`);
                return { gol: null, asistencia: null };
            }
            
            this.jugadoresConectados.add(auth_id);
            console.log(`🎉 [SISTEMA DEBUG] Jugador agregado a conectados, total: ${this.jugadoresConectados.size}`);
            
            // Primero verificar cache
            console.log(`🎉 [SISTEMA DEBUG] Verificando cache para auth_id: ${auth_id}`);
            if (this.cacheMensajes.has(auth_id)) {
                const cached = this.cacheMensajes.get(auth_id);
                console.log(`💾 [SISTEMA DEBUG] Festejos encontrados en cache para ${player_name}:`, cached);
                return cached;
            } else {
                console.log(`💾 [SISTEMA DEBUG] No hay festejos en cache para ${player_name}`);
            }
            
            // Si no hay BD, devolver mensajes vacíos
            if (!executeQuery) {
                console.log(`🎉 [SISTEMA DEBUG] No hay executeQuery disponible`);
                return { gol: null, asistencia: null };
            }
            
            // Buscar en base de datos
            console.log(`🎉 [SISTEMA DEBUG] Buscando en BD con player_name: ${player_name}`);
            const query = `
                SELECT mensaje_gol, mensaje_asistencia 
                FROM festejos_personalizados 
                WHERE player_name = ? 
                ORDER BY ultima_actualizacion DESC 
                LIMIT 1
            `;
            
            console.log(`🎉 [SISTEMA DEBUG] Ejecutando query:`, query);
            const resultado = await executeQuery(query, [player_name]);
            console.log(`🎉 [SISTEMA DEBUG] Resultado de BD:`, resultado);
            
            let festejos = { gol: null, asistencia: null };
            
            if (resultado.length > 0) {
                console.log(`🎉 [SISTEMA DEBUG] Registro encontrado en BD:`, resultado[0]);
                festejos.gol = resultado[0].mensaje_gol;
                festejos.asistencia = resultado[0].mensaje_asistencia;
                
                // Actualizar auth_id si es diferente
                if (auth_id && auth_id.length > 8) {
                    console.log(`🎉 [SISTEMA DEBUG] Actualizando auth_id en BD: ${auth_id}`);
                    await this.actualizarAuthID(player_name, auth_id);
                }
                
                console.log(`🎉 [SISTEMA DEBUG] Festejos procesados para ${player_name}: gol="${festejos.gol || 'default'}", asistencia="${festejos.asistencia || 'default'}"`);
            } else {
                console.log(`🎉 [SISTEMA DEBUG] No se encontró registro en BD para ${player_name}`);
            }
            
            // Guardar en cache
            console.log(`🎉 [SISTEMA DEBUG] Guardando en cache con auth_id: ${auth_id}`);
            console.log(`🎉 [SISTEMA DEBUG] Datos a guardar en cache:`, festejos);
            this.cacheMensajes.set(auth_id, festejos);
            console.log(`🎉 [SISTEMA DEBUG] Cache actualizado, tamaño total: ${this.cacheMensajes.size}`);
            
            return festejos;
            
        } catch (error) {
            console.error(`❌ Error cargando festejos para ${player_name}:`, error);
            return { gol: null, asistencia: null };
        }
    }
    
    /**
     * Guardar festejo personalizado
     */
    async guardarFestejo(auth_id, player_name, tipo, mensaje) {
        try {
            if (!this.inicializado) {
                return { success: false, error: 'SISTEMA_NO_INICIALIZADO' };
            }
            
            // Validar tipo
            if (tipo !== 'gol' && tipo !== 'asistencia') {
                return { success: false, error: 'TIPO_INVALIDO' };
            }
            
            // Validar mensaje
            const validacion = this.validarMensaje(mensaje);
            if (!validacion.valido) {
                return { success: false, error: validacion.error };
            }
            
            const mensajeLimpio = mensaje.trim();
            
            // Actualizar cache
            let festejoCache = this.cacheMensajes.get(auth_id) || { gol: null, asistencia: null };
            festejoCache[tipo] = mensajeLimpio;
            this.cacheMensajes.set(auth_id, festejoCache);
            
            // Si no hay BD, solo mantener en memoria
            if (!executeQuery) {
                console.log(`💾 Festejo guardado en memoria para ${player_name}: ${tipo} = "${mensajeLimpio}"`);
                return { success: true, storage: 'memoria' };
            }
            
            // Guardar en base de datos
            const query = `
                INSERT INTO festejos_personalizados 
                (player_name, auth_id, mensaje_gol, mensaje_asistencia)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                auth_id = VALUES(auth_id),
                ${tipo === 'gol' ? 'mensaje_gol' : 'mensaje_asistencia'} = VALUES(${tipo === 'gol' ? 'mensaje_gol' : 'mensaje_asistencia'}),
                ultima_actualizacion = CURRENT_TIMESTAMP
            `;
            
            const valores = [
                player_name,
                auth_id,
                tipo === 'gol' ? mensajeLimpio : festejoCache.gol,
                tipo === 'asistencia' ? mensajeLimpio : festejoCache.asistencia
            ];
            
            await executeQuery(query, valores);
            
            console.log(`✅ Festejo guardado en BD para ${player_name}: ${tipo} = "${mensajeLimpio}"`);
            return { success: true, storage: 'database' };
            
        } catch (error) {
            console.error(`❌ Error guardando festejo para ${player_name}:`, error);
            return { success: false, error: 'ERROR_BASE_DATOS' };
        }
    }
    
    /**
     * Obtener mensaje de festejo
     */
    obtenerMensajeFestejo(auth_id, tipo) {
        try {
            console.log(`🎯 [SISTEMA DEBUG] obtenerMensajeFestejo llamado: auth_id=${auth_id}, tipo=${tipo}`);
            console.log(`🎯 [SISTEMA DEBUG] Cache tiene auth_id: ${this.cacheMensajes.has(auth_id)}`);
            console.log(`🎯 [SISTEMA DEBUG] Tamaño actual del cache: ${this.cacheMensajes.size}`);
            
            if (!this.cacheMensajes.has(auth_id)) {
                console.log(`🎯 [SISTEMA DEBUG] No hay mensaje personalizado en cache para ${auth_id}`);
                return null; // No hay mensaje personalizado
            }
            
            const festejos = this.cacheMensajes.get(auth_id);
            console.log(`🎯 [SISTEMA DEBUG] Festejos encontrados en cache:`, festejos);
            const mensaje = festejos[tipo] || null;
            console.log(`🎯 [SISTEMA DEBUG] Mensaje para tipo '${tipo}': "${mensaje}"`);
            return mensaje;
            
        } catch (error) {
            console.error(`❌ [SISTEMA DEBUG] Error obteniendo mensaje de festejo:`, error);
            return null;
        }
    }
    
    /**
     * Verificar si un jugador tiene festejos configurados
     */
    tieneFestejos(auth_id) {
        if (!this.cacheMensajes.has(auth_id)) {
            return false;
        }
        
        const festejos = this.cacheMensajes.get(auth_id);
        return !!(festejos.gol || festejos.asistencia);
    }
    
    /**
     * Limpiar festejos de un jugador
     */
    async limpiarFestejos(auth_id, player_name, tipo = 'all') {
        try {
            if (!this.inicializado) {
                return { success: false, error: 'SISTEMA_NO_INICIALIZADO' };
            }
            
            // Actualizar cache
            if (tipo === 'all') {
                this.cacheMensajes.delete(auth_id);
            } else {
                let festejos = this.cacheMensajes.get(auth_id);
                if (festejos) {
                    festejos[tipo] = null;
                    this.cacheMensajes.set(auth_id, festejos);
                }
            }
            
            // Si no hay BD, solo mantener en memoria
            if (!executeQuery) {
                return { success: true, storage: 'memoria' };
            }
            
            // Limpiar de base de datos
            let query;
            let valores;
            
            if (tipo === 'all') {
                query = `DELETE FROM festejos_personalizados WHERE player_name = ?`;
                valores = [player_name];
            } else {
                query = `
                    UPDATE festejos_personalizados 
                    SET ${tipo === 'gol' ? 'mensaje_gol' : 'mensaje_asistencia'} = NULL,
                        ultima_actualizacion = CURRENT_TIMESTAMP
                    WHERE player_name = ?
                `;
                valores = [player_name];
            }
            
            await executeQuery(query, valores);
            
            console.log(`✅ Festejos limpiados para ${player_name}: ${tipo}`);
            return { success: true, storage: 'database' };
            
        } catch (error) {
            console.error(`❌ Error limpiando festejos para ${player_name}:`, error);
            return { success: false, error: 'ERROR_BASE_DATOS' };
        }
    }
    
    /**
     * Manejar desconexión de jugador
     */
    onJugadorDesconectado(auth_id) {
        this.jugadoresConectados.delete(auth_id);
        // No eliminamos del cache para que se mantenga en memoria durante la sesión
    }
    
    // ==================== FUNCIONES DE VALIDACIÓN ====================
    
    /**
     * Validar mensaje de festejo
     */
    validarMensaje(mensaje) {
        if (!mensaje || typeof mensaje !== 'string') {
            return { valido: false, error: 'MENSAJE_VACIO' };
        }
        
        const mensajeLimpio = mensaje.trim();
        
        // Verificar longitud
        if (mensajeLimpio.length < FESTEJOS_CONFIG.MIN_LONGITUD_MENSAJE) {
            return { valido: false, error: 'MENSAJE_MUY_CORTO' };
        }
        
        if (mensajeLimpio.length > FESTEJOS_CONFIG.MAX_LONGITUD_MENSAJE) {
            return { valido: false, error: 'MENSAJE_MUY_LARGO' };
        }
        
        // Verificar caracteres prohibidos
        for (const char of FESTEJOS_CONFIG.CARACTERES_PROHIBIDOS) {
            if (mensajeLimpio.includes(char)) {
                return { valido: false, error: 'CARACTERES_PROHIBIDOS' };
            }
        }
        
        // Verificar palabras prohibidas
        const mensajeMinuscula = mensajeLimpio.toLowerCase();
        for (const palabra of FESTEJOS_CONFIG.PALABRAS_PROHIBIDAS) {
            if (mensajeMinuscula.includes(palabra)) {
                return { valido: false, error: 'PALABRAS_PROHIBIDAS' };
            }
        }
        
        return { valido: true };
    }
    
    // ==================== FUNCIONES DE MANTENIMIENTO ====================
    
    /**
     * Programar limpieza automática
     */
    programarLimpieza() {
        if (this.timerLimpieza) {
            clearInterval(this.timerLimpieza);
        }
        
        const intervalo = FESTEJOS_CONFIG.INTERVALO_LIMPIEZA_HORAS * 60 * 60 * 1000;
        
        this.timerLimpieza = setInterval(async () => {
            await this.ejecutarLimpieza();
        }, intervalo);
        
        console.log(`⏰ Limpieza de festejos programada cada ${FESTEJOS_CONFIG.INTERVALO_LIMPIEZA_HORAS} horas`);
    }
    
    /**
     * Ejecutar limpieza de festejos obsoletos
     */
    async ejecutarLimpieza() {
        try {
            if (!executeQuery) {
                return;
            }
            
            const query = `
                DELETE FROM festejos_personalizados 
                WHERE ultima_actualizacion < DATE_SUB(NOW(), INTERVAL ? DAY)
                AND (mensaje_gol IS NULL OR mensaje_gol = '')
                AND (mensaje_asistencia IS NULL OR mensaje_asistencia = '')
            `;
            
            const resultado = await executeQuery(query, [FESTEJOS_CONFIG.DIAS_INACTIVO_PARA_LIMPIAR]);
            
            if (resultado.affectedRows > 0) {
                console.log(`🧹 Limpieza de festejos: ${resultado.affectedRows} registros obsoletos eliminados`);
            }
            
        } catch (error) {
            console.error('❌ Error en limpieza automática de festejos:', error);
        }
    }
    
    /**
     * Actualizar auth_id de un jugador
     */
    async actualizarAuthID(player_name, nuevo_auth_id) {
        try {
            if (!executeQuery || !nuevo_auth_id) {
                return;
            }
            
            const query = `
                UPDATE festejos_personalizados 
                SET auth_id = ?, ultima_actualizacion = CURRENT_TIMESTAMP 
                WHERE player_name = ?
            `;
            
            await executeQuery(query, [nuevo_auth_id, player_name]);
            
        } catch (error) {
            // Error silencioso, no es crítico
            console.warn(`⚠️ No se pudo actualizar auth_id para ${player_name}:`, error.message);
        }
    }
    
    // ==================== FUNCIONES DE ADMINISTRACIÓN ====================
    
    /**
     * Obtener estadísticas del sistema
     */
    async obtenerEstadisticas() {
        try {
            const stats = {
                jugadoresEnCache: this.cacheMensajes.size,
                jugadoresConectados: this.jugadoresConectados.size,
                sistemaBD: !!executeQuery
            };
            
            if (executeQuery) {
                try {
                    const query = `
                        SELECT 
                            COUNT(*) as total,
                            SUM(CASE WHEN mensaje_gol IS NOT NULL THEN 1 ELSE 0 END) as con_gol,
                            SUM(CASE WHEN mensaje_asistencia IS NOT NULL THEN 1 ELSE 0 END) as con_asistencia,
                            SUM(CASE WHEN mensaje_gol IS NOT NULL AND mensaje_asistencia IS NOT NULL THEN 1 ELSE 0 END) as con_ambos
                        FROM festejos_personalizados
                    `;
                    
                    const resultado = await executeQuery(query);
                    if (resultado.length > 0) {
                        stats.totalEnBD = resultado[0].total;
                        stats.conGol = resultado[0].con_gol;
                        stats.conAsistencia = resultado[0].con_asistencia;
                        stats.conAmbos = resultado[0].con_ambos;
                    }
                } catch (dbError) {
                    stats.errorBD = dbError.message;
                }
            }
            
            return stats;
            
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas de festejos:', error);
            return { error: error.message };
        }
    }
    
    /**
     * Listar todos los festejos (para administración)
     */
    async listarTodosLosFestejos(limite = 50) {
        try {
            if (!executeQuery) {
                return [];
            }
            
            const query = `
                SELECT player_name, auth_id, mensaje_gol, mensaje_asistencia, 
                       fecha_creacion, ultima_actualizacion
                FROM festejos_personalizados
                ORDER BY ultima_actualizacion DESC
                LIMIT ?
            `;
            
            const resultado = await executeQuery(query, [limite]);
            return resultado;
            
        } catch (error) {
            console.error('❌ Error listando festejos:', error);
            return [];
        }
    }
    
    /**
     * Destruir el sistema y limpiar recursos
     */
    destruir() {
        console.log('🔄 Cerrando sistema de festejos persistentes...');
        
        if (this.timerLimpieza) {
            clearInterval(this.timerLimpieza);
            this.timerLimpieza = null;
        }
        
        this.cacheMensajes.clear();
        this.jugadoresConectados.clear();
        this.inicializado = false;
        
        console.log('✅ Sistema de festejos persistentes cerrado');
    }
}

// ==================== INSTANCIA GLOBAL ====================

let festejosPersistentSystem = null;

/**
 * Inicializar sistema de festejos persistentes
 */
function inicializarSistemaFestejos() {
    if (festejosPersistentSystem) {
        festejosPersistentSystem.destruir();
    }
    
    festejosPersistentSystem = new FestejosPersistentSystem();
    console.log('✅ Sistema de festejos persistentes inicializado globalmente');
    return festejosPersistentSystem;
}

/**
 * Obtener instancia del sistema de festejos
 */
function obtenerSistemaFestejos() {
    if (!festejosPersistentSystem) {
        return inicializarSistemaFestejos();
    }
    return festejosPersistentSystem;
}

// ==================== FUNCIONES DE CONVENIENCIA ====================

/**
 * Cargar festejos de un jugador (función de conveniencia)
 */
async function cargarFestejos(auth_id, player_name) {
    const sistema = obtenerSistemaFestejos();
    return await sistema.cargarFestejosJugador(auth_id, player_name);
}

/**
 * Guardar festejo (función de conveniencia)
 */
async function guardarFestejo(auth_id, player_name, tipo, mensaje) {
    const sistema = obtenerSistemaFestejos();
    return await sistema.guardarFestejo(auth_id, player_name, tipo, mensaje);
}

/**
 * Obtener mensaje de festejo (función de conveniencia)
 */
function obtenerMensajeFestejo(auth_id, tipo) {
    const sistema = obtenerSistemaFestejos();
    return sistema.obtenerMensajeFestejo(auth_id, tipo);
}

/**
 * Verificar si tiene festejos (función de conveniencia)
 */
function tieneFestejos(auth_id) {
    const sistema = obtenerSistemaFestejos();
    return sistema.tieneFestejos(auth_id);
}

/**
 * Limpiar festejos (función de conveniencia)
 */
async function limpiarFestejos(auth_id, player_name, tipo = 'all') {
    const sistema = obtenerSistemaFestejos();
    return await sistema.limpiarFestejos(auth_id, player_name, tipo);
}

// ==================== EXPORTACIONES ====================

// Exportar para Node.js
if (isNode) {
    module.exports = {
        FestejosPersistentSystem,
        inicializarSistemaFestejos,
        obtenerSistemaFestejos,
        cargarFestejos,
        guardarFestejo,
        obtenerMensajeFestejo,
        tieneFestejos,
        limpiarFestejos,
        FESTEJOS_CONFIG
    };
}

// Hacer disponibles las funciones globalmente
if (typeof window === 'undefined') {
    global.inicializarSistemaFestejos = inicializarSistemaFestejos;
    global.obtenerSistemaFestejos = obtenerSistemaFestejos;
    global.cargarFestejos = cargarFestejos;
    global.guardarFestejo = guardarFestejo;
    global.obtenerMensajeFestejo = obtenerMensajeFestejo;
    global.tieneFestejos = tieneFestejos;
    global.limpiarFestejos = limpiarFestejos;
} else {
    window.inicializarSistemaFestejos = inicializarSistemaFestejos;
    window.obtenerSistemaFestejos = obtenerSistemaFestejos;
}
