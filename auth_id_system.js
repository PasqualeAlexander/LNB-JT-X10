/**
 * SISTEMA DE IDENTIFICACIÓN POR AUTH_ID CON FALLBACK INTELIGENTE
 * ==============================================================
 * 
 * Este archivo contiene las funciones principales para manejar
 * la identificación de jugadores usando auth_id como prioridad
 * y nombre como fallback para mantener compatibilidad.
 */

const isNode = typeof window === 'undefined';

class AuthIdSystem {
    constructor() {
        this.useAuthIdSystem = true; // Habilitado por defecto
        this.dbFunctions = null;
        
        // Importar funciones de base de datos si están disponibles
        if (isNode) {
            try {
                this.dbFunctions = require('./database/db_functions.js');
                console.log('✅ [AUTH-ID] Sistema de auth_id inicializado');
            } catch (error) {
                console.warn('⚠️ [AUTH-ID] No se pudo cargar db_functions:', error.message);
                this.useAuthIdSystem = false;
            }
        }
    }
    
    /**
     * Obtiene la clave única para un jugador basada en auth_id o nombre
     * @param {Object} jugadorData - Datos del jugador (puede contener auth_id, nombre, etc.)
     * @returns {String} - Identificador único para usar como clave
     */
    obtenerClaveUnica(jugadorData) {
        if (!jugadorData) return null;
        
        // Si tenemos auth_id, usarlo como clave principal
        if (jugadorData.auth_id) {
            return jugadorData.auth_id;
        }
        
        // Si tenemos un jugador de HaxBall con auth, usar ese auth
        if (jugadorData.auth) {
            return jugadorData.auth;
        }
        
        // Fallback: usar nombre
        const nombre = jugadorData.name || jugadorData.nombre || jugadorData.nombre_display;
        return nombre || null;
    }
    
    /**
     * Determina si un identificador es un auth_id o un nombre
     * @param {String} identificador - El identificador a evaluar
     * @returns {String} - 'auth' o 'nombre'
     */
    determinarTipoIdentificador(identificador) {
        if (!identificador || typeof identificador !== 'string') {
            return 'nombre';
        }
        
        // Los auth_id de HaxBall son típicamente largos y alfanuméricos
        // Heurística: si es muy largo (>20 chars) y contiene números/letras, probablemente es auth_id
        if (identificador.length > 20 && /^[a-zA-Z0-9_-]+$/.test(identificador)) {
            return 'auth';
        }
        
        // Si contiene espacios o caracteres especiales, probablemente es nombre
        return 'nombre';
    }
    
    /**
     * Busca un jugador usando auth_id primero, nombre como fallback
     * @param {String} busqueda - Término de búsqueda (auth_id o nombre)
     * @param {String} tipoPreferido - 'auth' o 'nombre' para priorizar el tipo de búsqueda
     * @returns {Object|null} - Datos del jugador o null si no se encuentra
     */
    async buscarJugador(busqueda, tipoPreferido = null) {
        if (!this.dbFunctions || !busqueda) return null;
        
        try {
            // Forzar búsqueda únicamente por auth_id
            const tipo = 'auth';
            console.log(`🔍 [AUTH-ID] Buscando jugador SOLO por auth_id: "${busqueda}"`);
            
            return await this.dbFunctions.obtenerJugadorPorAuth(busqueda);
        } catch (error) {
            console.error('❌ [AUTH-ID] Error buscando jugador por auth_id:', error);
            return null;
        }
    }
    
    /**
     * Registra o actualiza estadísticas de un jugador usando el sistema auth_id
     * @param {Object} jugadorHaxball - Objeto jugador de HaxBall (contiene auth, name, etc.)
     * @param {Object} estadisticas - Estadísticas a guardar
     * @returns {Boolean} - true si se guardó exitosamente
     */
    async guardarEstadisticasJugador(jugadorHaxball, estadisticas) {
        if (!this.dbFunctions) {
            console.warn('⚠️ [AUTH-ID] Sistema de DB no disponible');
            return false;
        }
        
        try {
            const authId = jugadorHaxball.auth;
            const nombre = jugadorHaxball.name;
            
            console.log(`💾 [AUTH-ID] Guardando estadísticas: ${nombre} (Auth: ${authId || 'N/A'})`);
            
            if (authId && this.useAuthIdSystem) {
                // Usar sistema basado en auth_id
                await this.dbFunctions.guardarJugadorPorAuth(authId, nombre, estadisticas);
                console.log(`✅ [AUTH-ID] Estadísticas guardadas por auth_id`);
                return true;
            } else {
                // Política: no guardar por nombre
                console.warn('🚫 [AUTH-ID] Jugador sin auth_id: no se guardarán estadísticas por nombre.');
                return false;
            }
        } catch (error) {
            console.error('❌ [AUTH-ID] Error guardando estadísticas:', error);
            return false;
        }
    }
    
    /**
     * Migra jugadores existentes sin auth_id cuando se conectan con auth
     * @param {Object} jugadorHaxball - Jugador de HaxBall con auth
     * @returns {Object} - Resultado de la migración
     */
    async migrarJugadorSiEsNecesario(jugadorHaxball) {
        if (!this.dbFunctions || !jugadorHaxball.auth) {
            return { migrado: false, razon: 'sin_auth_id' };
        }
        
        try {
            const authId = jugadorHaxball.auth;
            const nombre = jugadorHaxball.name;
            
            // Verificar si ya existe con este auth_id
            const jugadorConAuth = await this.dbFunctions.obtenerJugadorPorAuth(authId);
            if (jugadorConAuth) {
                // Ya existe con auth_id, solo actualizar nombre si es diferente
                if (jugadorConAuth.nombre !== nombre) {
                    await this.dbFunctions.registrarNombreJugador(authId, nombre);
                    console.log(`📝 [MIGRACIÓN] Nombre actualizado para auth ${authId}: ${nombre}`);
                }
                return { migrado: false, razon: 'ya_tiene_auth_id' };
            }
            
            // Política: no migrar ni buscar por nombre
            return { migrado: false, razon: 'politica_sin_nombre' };
            
        } catch (error) {
            console.error('❌ [MIGRACIÓN] Error en migración automática:', error);
            return { migrado: false, razon: 'error_sistema', error: error.message };
        }
    }
    
    /**
     * Obtiene el nombre a mostrar para un jugador (prioriza nombre_display)
     * @param {Object} jugadorData - Datos del jugador
     * @returns {String} - Nombre para mostrar
     */
    obtenerNombreMostrar(jugadorData) {
        if (!jugadorData) return 'Jugador Desconocido';
        
        // Prioridad: nombre_display > nombre > name
        return jugadorData.nombre_display || 
               jugadorData.nombre || 
               jugadorData.name || 
               'Jugador Desconocido';
    }
    
    /**
     * Convierte el format de estadísticas global para usar identificadores únicos
     * @param {Object} estadisticasGlobales - Estadísticas en formato actual
     * @returns {Object} - Estadísticas optimizadas para auth_id
     */
    optimizarEstructuraEstadisticas(estadisticasGlobales) {
        if (!estadisticasGlobales || !estadisticasGlobales.jugadores) {
            return estadisticasGlobales;
        }
        
        const estadisticasOptimizadas = {
            ...estadisticasGlobales,
            jugadores: {},
            metadata: {
                ...estadisticasGlobales.metadata,
                sistema_auth_id: true,
                fecha_optimizacion: new Date().toISOString()
            }
        };
        
        // Reorganizar jugadores usando claves únicas (auth_id o nombre)
        Object.values(estadisticasGlobales.jugadores).forEach(jugador => {
            const claveUnica = this.obtenerClaveUnica(jugador);
            if (claveUnica) {
                estadisticasOptimizadas.jugadores[claveUnica] = {
                    ...jugador,
                    nombre_mostrar: this.obtenerNombreMostrar(jugador),
                    identificador_unico: claveUnica,
                    tipo_identificacion: jugador.auth_id ? 'auth' : 'nombre'
                };
            }
        });
        
        const totalJugadores = Object.keys(estadisticasOptimizadas.jugadores).length;
        const jugadoresConAuth = Object.values(estadisticasOptimizadas.jugadores)
            .filter(j => j.tipo_identificacion === 'auth').length;
        
        console.log(`🔧 [AUTH-ID] Estructura optimizada: ${totalJugadores} jugadores, ${jugadoresConAuth} con auth_id`);
        
        return estadisticasOptimizadas;
    }
    
    /**
     * Procesa un jugador en tiempo de conexión para el sistema auth_id
     * @param {Object} jugadorHaxball - Jugador de HaxBall que se conecta
     * @returns {Object} - Información procesada del jugador
     */
    async procesarConexionJugador(jugadorHaxball) {
        const resultado = {
            jugador: jugadorHaxball,
            auth_id: jugadorHaxball.auth,
            nombre: jugadorHaxball.name,
            identificador_unico: null,
            migrado: false,
            es_nuevo: false,
            estadisticas_existentes: null
        };
        
        try {
            // Determinar identificador único
            resultado.identificador_unico = this.obtenerClaveUnica(jugadorHaxball);
            
            // Intentar migración si es necesario
            const resultadoMigracion = await this.migrarJugadorSiEsNecesario(jugadorHaxball);
            resultado.migrado = resultadoMigracion.migrado;
            
            // Buscar estadísticas existentes SOLO por auth
            resultado.estadisticas_existentes = resultado.auth_id ? await this.buscarJugador(resultado.identificador_unico) : null;
            resultado.es_nuevo = !resultado.estadisticas_existentes;
            
            console.log(`🔗 [AUTH-ID] Conexión procesada: ${resultado.nombre} (${resultado.identificador_unico})`);
            console.log(`   - Auth ID: ${resultado.auth_id || 'N/A'}`);
            console.log(`   - Migrado: ${resultado.migrado ? 'Sí' : 'No'}`);
            console.log(`   - Jugador nuevo: ${resultado.es_nuevo ? 'Sí' : 'No'}`);
            
            return resultado;
            
        } catch (error) {
            console.error('❌ [AUTH-ID] Error procesando conexión:', error);
            return resultado;
        }
    }
    
    /**
     * Habilita o deshabilita el sistema auth_id
     * @param {Boolean} habilitado - true para habilitar, false para deshabilitar
     */
    configurarSistema(habilitado) {
        this.useAuthIdSystem = habilitado;
        console.log(`⚙️ [AUTH-ID] Sistema ${habilitado ? 'habilitado' : 'deshabilitado'}`);
    }
    
    /**
     * Obtiene estadísticas del sistema auth_id
     * @returns {Object} - Estadísticas del sistema
     */
    async obtenerEstadisticasSistema() {
        if (!this.dbFunctions) {
            return { error: 'Sistema de DB no disponible' };
        }
        
        try {
            // Cargar estadísticas actuales
            const estadisticas = await this.dbFunctions.cargarEstadisticasGlobales();
            
            if (!estadisticas || !estadisticas.jugadores) {
                return { error: 'No se pudieron cargar las estadísticas' };
            }
            
            const jugadores = Object.values(estadisticas.jugadores);
            const conAuthId = jugadores.filter(j => j.auth_id).length;
            const sinAuthId = jugadores.filter(j => !j.auth_id).length;
            
            return {
                total_jugadores: jugadores.length,
                con_auth_id: conAuthId,
                sin_auth_id: sinAuthId,
                porcentaje_migrado: jugadores.length > 0 ? Math.round((conAuthId / jugadores.length) * 100) : 0,
                sistema_habilitado: this.useAuthIdSystem,
                fecha_consulta: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('❌ [AUTH-ID] Error obteniendo estadísticas del sistema:', error);
            return { error: error.message };
        }
    }
}

// Instancia global del sistema
let sistemaAuthId = null;

// Función para inicializar el sistema (llamar desde el bot principal)
function inicializarSistemaAuthId() {
    if (!sistemaAuthId) {
        sistemaAuthId = new AuthIdSystem();
        console.log('🚀 [AUTH-ID] Sistema inicializado globalmente');
    }
    return sistemaAuthId;
}

// Función para obtener la instancia del sistema
function obtenerSistemaAuthId() {
    if (!sistemaAuthId) {
        return inicializarSistemaAuthId();
    }
    return sistemaAuthId;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuthIdSystem,
        inicializarSistemaAuthId,
        obtenerSistemaAuthId
    };
}

// Hacer disponible en el contexto global para el bot
if (typeof global !== 'undefined') {
    global.AuthIdSystem = AuthIdSystem;
    global.inicializarSistemaAuthId = inicializarSistemaAuthId;
    global.obtenerSistemaAuthId = obtenerSistemaAuthId;
}
