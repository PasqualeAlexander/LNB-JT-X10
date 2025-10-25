/**
 * SISTEMA DE TRACKING PERSISTENTE DE JUGADORES
 * ===========================================
 * 
 * Sistema completo de tracking que reemplaza los Maps de JavaScript
 * por almacenamiento persistente en base de datos MySQL.
 * 
 * Características:
 * ✅ Tracking persistente por auth de jugador
 * ✅ Historial completo de nombres usados
 * ✅ Sesiones detalladas con tiempo de conexión
 * ✅ Reportes automáticos a Discord
 * ✅ Estadísticas diarias y análisis
 * ✅ Limpieza automática de datos antiguos
 * ✅ Resistente a caídas del servidor
 */

const isNode = typeof window === 'undefined';

// Importar funciones de tracking solo en Node.js
let trackingFunctions = null;
if (isNode) {
    try {
        trackingFunctions = require('./database/tracking_functions');
        console.log('✅ Sistema de tracking persistente cargado');
    } catch (error) {
        console.error('❌ Error cargando funciones de tracking:', error);
        // Fallback a sistema en memoria si no hay BD
        trackingFunctions = null;
    }
}

// ==================== CONFIGURACIÓN DEL SISTEMA ====================

const TRACKING_CONFIG = {
    // URLs de webhooks para Discord
    WEBHOOK_JUGADORES_URL: 'https://discord.com/api/webhooks/1409271835018919947/eIXwPUhKsuGSm8pYYIV44nX6dwBJJyKktPjMyB6iNXvuV7Bo6F3_1WMwDxvrG-Qj9EEo',
    WEBHOOK_ADMIN_URL: 'https://discord.com/api/webhooks/1409271835018919947/eIXwPUhKsuGSm8pYYIV44nX6dwBJJyKktPjMyB6iNXvuV7Bo6F3_1WMwDxvrG-Qj9EEo',
    
    // Configuración de limpieza automática
    LIMPIEZA_SESIONES_MINUTOS: 30,      // Limpiar sesiones inactivas después de 30 min
    LIMPIEZA_DATOS_DIAS: 90,            // Limpiar datos después de 90 días
    INTERVALO_LIMPIEZA_MINUTOS: 60,     // Ejecutar limpieza cada hora
    
    // Configuración de reportes - SOLO INGRESOS
    REPORTAR_CONEXIONES: true,          // ✅ SÍ enviar cuando se conectan
    REPORTAR_DESCONEXIONES: false,      // ❌ NO enviar cuando se desconectan
    REPORTAR_KICKS: false,              // ❌ NO enviar cuando son expulsados
    REPORTAR_BANS: false,               // ❌ NO enviar cuando son baneados
    
    // Colores para embeds de Discord
    COLORES: {
        CONEXION: '0x00FF00',      // Verde
        DESCONEXION: '0xFFA500',   // Naranja
        KICK: '0xFF0000',          // Rojo
        BAN: '0x8B0000',           // Rojo oscuro
        NUEVO_JUGADOR: '0x00FFFF', // Cian
        SISTEMA: '0x808080'        // Gris
    }
};

// ==================== SISTEMA PRINCIPAL ====================

class PlayerTrackingPersistent {
    constructor(room) {
        this.room = room;
        this.inicializado = false;
        this.timerLimpieza = null;
        this.estadisticasCache = null;
        this.ultimaActualizacionStats = 0;
        
        // Contadores de sesión (solo para información inmediata)
        this.contadoresTemporales = {
            jugadoresConectados: 0,
            conexionesHoy: 0,
            reportesEnviados: 0
        };
        
        this.inicializar();
    }
    
    async inicializar() {
        try {
            console.log('🔄 Inicializando sistema de tracking persistente...');
            
            if (!trackingFunctions) {
                console.warn('⚠️ Base de datos no disponible - usando sistema fallback');
                this.inicializarFallback();
                return;
            }
            
            // Verificar conexión a BD ejecutando las tablas si no existen
            await this.verificarEstructuraBD();
            
            // Limpiar sesiones inactivas al iniciar
            await this.limpiarSesionesInactivas();
            
            // Cargar estadísticas iniciales
            await this.actualizarEstadisticasCache();
            
            // Programar limpieza automática
            this.programarLimpiezaAutomatica();
            
            this.inicializado = true;
            console.log('✅ Sistema de tracking persistente inicializado correctamente');
            
            // Enviar reporte de sistema iniciado
            await this.enviarReporteSistema('Sistema de tracking iniciado', 'sistema');
            
        } catch (error) {
            console.error('❌ Error inicializando sistema de tracking persistente:', error);
            this.inicializarFallback();
        }
    }
    
    async verificarEstructuraBD() {
        try {
            // Verificar que existan las tablas principales
            const queryVerificacion = `
                SELECT COUNT(*) as total 
                FROM information_schema.tables 
                WHERE table_schema = DATABASE() 
                AND table_name IN ('jugadores_tracking', 'historial_nombres_jugadores', 'sesiones_jugadores')
            `;
            
            const { executeQuery } = require('./config/database');
            const resultado = await executeQuery(queryVerificacion);
            
            if (resultado[0].total < 3) {
                console.warn('⚠️ Tablas de tracking no encontradas - creándolas...');
                // Aquí podrías ejecutar el script de creación automáticamente
                throw new Error('Ejecuta el script create_tracking_tables.sql primero');
            }
            
            console.log('✅ Estructura de BD verificada correctamente');
            
        } catch (error) {
            console.error('❌ Error verificando estructura de BD:', error);
            throw error;
        }
    }
    
    inicializarFallback() {
        console.log('🔄 Inicializando sistema fallback (memoria)...');
        
        // Mapas de fallback si no hay BD
        this.jugadoresTracker = new Map();
        this.historialNombres = new Map();
        this.sesionesActivas = new Map();
        
        this.inicializado = true;
        console.log('⚠️ Sistema de tracking en memoria inicializado (datos se perderán al reiniciar)');
    }
    
    // ==================== FUNCIONES PRINCIPALES DE TRACKING ====================
    
    /**
     * Trackear jugador cuando se conecta
     */
    async trackearConexionJugador(jugador) {
        try {
            if (!this.inicializado) {
                console.warn('⚠️ Sistema de tracking no inicializado');
                return null;
            }
            
            const auth = jugador.auth;
            const nombre = jugador.name;
            const salaId = this.room ? this.room.name : 'Desconocida';
            
            console.log(`🔍 Procesando conexión: ${nombre} (Auth: ${auth.substring(0, 8)}...)`);
            
            let datosTracking = null;
            
            if (trackingFunctions) {
                // Sistema persistente con BD
                datosTracking = await trackingFunctions.trackearJugador(jugador, salaId);
            } else {
                // Sistema fallback en memoria
                datosTracking = await this.trackearJugadorFallback(jugador);
            }
            
            // Actualizar contadores temporales
            this.contadoresTemporales.jugadoresConectados++;
            this.contadoresTemporales.conexionesHoy++;
            
            // Enviar reporte a Discord si está habilitado
            if (TRACKING_CONFIG.REPORTAR_CONEXIONES && datosTracking) {
                await this.enviarReporteConexion(jugador, datosTracking);
            }
            
            return datosTracking;
            
        } catch (error) {
            console.error('❌ Error trackeando conexión de jugador:', error);
            return null;
        }
    }
    
    /**
     * Trackear jugador cuando se desconecta
     */
    async trackearDesconexionJugador(jugador, motivo = 'normal', razon = null) {
        try {
            if (!this.inicializado) {
                return null;
            }
            
            const auth = jugador.auth;
            const nombre = jugador.name;
            
            console.log(`🔌 Procesando desconexión: ${nombre} (${motivo})`);
            
            let duracionSesion = 0;
            
            if (trackingFunctions) {
                // Sistema persistente - finalizar sesión
                const sesionesFinalizadas = await trackingFunctions.finalizarSesion(auth, motivo, razon);
                
                // Obtener datos para el reporte
                const datosJugador = await trackingFunctions.obtenerDatosJugadorParaReporte(auth, true);
                
                if (datosJugador && datosJugador.sesionActual) {
                    const inicioSesion = new Date(datosJugador.sesionActual.inicio_sesion);
                    duracionSesion = Date.now() - inicioSesion.getTime();
                }
                
                // Actualizar estadísticas según el motivo
                if (motivo === 'kick') {
                    await trackingFunctions.actualizarEstadisticasDiarias('kick');
                } else if (motivo === 'ban') {
                    await trackingFunctions.actualizarEstadisticasDiarias('ban');
                }
                
            } else {
                // Sistema fallback
                if (this.sesionesActivas.has(auth)) {
                    const inicioSesion = this.sesionesActivas.get(auth);
                    duracionSesion = Date.now() - inicioSesion;
                    this.sesionesActivas.delete(auth);
                }
            }
            
            // Actualizar contadores temporales
            this.contadoresTemporales.jugadoresConectados = Math.max(0, this.contadoresTemporales.jugadoresConectados - 1);
            
            // Enviar reporte a Discord según el tipo
            const tipoReporte = motivo === 'kick' ? 'kick' : motivo === 'ban' ? 'ban' : 'desconexion';
            
            if (TRACKING_CONFIG[`REPORTAR_${tipoReporte.toUpperCase()}S`] || TRACKING_CONFIG[`REPORTAR_${tipoReporte.toUpperCase()}`]) {
                await this.enviarReporteDesconexion(jugador, motivo, razon, duracionSesion);
            }
            
            return { duracionSesion, motivo, razon };
            
        } catch (error) {
            console.error('❌ Error trackeando desconexión de jugador:', error);
            return null;
        }
    }
    
    // ==================== FUNCIONES DE REPORTES DISCORD ====================
    
    /**
     * Enviar reporte de conexión a Discord
     */
    async enviarReporteConexion(jugador, datosTracking) {
        try {
            const auth = jugador.auth;
            const nombre = jugador.name;
            const esNuevo = datosTracking.esNuevo;
            
            // Obtener historial si está disponible
            let historial = [];
            if (trackingFunctions) {
                historial = await trackingFunctions.obtenerHistorialNombres(auth);
            }
            
            const color = esNuevo ? TRACKING_CONFIG.COLORES.NUEVO_JUGADOR : TRACKING_CONFIG.COLORES.CONEXION;
            const titulo = esNuevo ? '🆕 Nuevo jugador conectado' : '🟢 Jugador conectado';
            
            const embed = {
                title: titulo,
                color: parseInt(color),
                fields: [
                    {
                        name: '👤 Jugador',
                        value: `**${nombre}**`,
                        inline: true
                    },
                    {
                        name: '🌐 IP',
                        value: datosTracking.ipSimulada,
                        inline: true
                    },
                    {
                        name: '🔢 Conexiones',
                        value: `Total: ${datosTracking.totalConexiones}\\nHoy: ${datosTracking.conexionesHoy}`,
                        inline: true
                    }
                ],
                footer: {
                    text: `Auth: ${auth.substring(0, 16)}...`
                },
                timestamp: new Date().toISOString()
            };
            
            // Añadir información adicional para jugadores conocidos
            if (!esNuevo && historial.length > 1) {
                const nombresAnteriores = historial
                    .slice(0, 5)
                    .map(h => `${h.nombre} (${h.veces_usado}x)`)
                    .join(', ');
                
                embed.fields.push({
                    name: '📝 Nombres anteriores',
                    value: nombresAnteriores.length > 100 ? nombresAnteriores.substring(0, 100) + '...' : nombresAnteriores,
                    inline: false
                });
            }
            
            await this.enviarWebhook(TRACKING_CONFIG.WEBHOOK_JUGADORES_URL, {
                embeds: [embed]
            });
            
            // Registrar el reporte en BD si está disponible
            if (trackingFunctions) {
                await trackingFunctions.registrarReporteDiscord({
                    authJugador: auth,
                    nombreJugador: nombre,
                    tipoEvento: 'conexion',
                    titulo: titulo,
                    descripcion: `Jugador ${nombre} se conectó`,
                    color: color,
                    webhookUrl: TRACKING_CONFIG.WEBHOOK_JUGADORES_URL,
                    enviadoExitosamente: true,
                    fechaEvento: new Date(),
                    salaId: this.room ? this.room.name : null,
                    metadata: datosTracking
                });
            }
            
            this.contadoresTemporales.reportesEnviados++;
            
        } catch (error) {
            console.error('❌ Error enviando reporte de conexión:', error);
        }
    }
    
    /**
     * Enviar reporte de desconexión a Discord
     */
    async enviarReporteDesconexion(jugador, motivo, razon, duracionSesion) {
        try {
            const auth = jugador.auth;
            const nombre = jugador.name;
            
            let color = TRACKING_CONFIG.COLORES.DESCONEXION;
            let titulo = '🟠 Jugador desconectado';
            let icono = '🔌';
            
            switch (motivo) {
                case 'kick':
                    color = TRACKING_CONFIG.COLORES.KICK;
                    titulo = '🔴 Jugador expulsado';
                    icono = '👢';
                    break;
                case 'ban':
                    color = TRACKING_CONFIG.COLORES.BAN;
                    titulo = '🚫 Jugador baneado';
                    icono = '🔨';
                    break;
            }
            
            // Formatear duración de sesión
            const duracionFormateada = this.formatearDuracion(duracionSesion);
            
            const embed = {
                title: titulo,
                color: parseInt(color),
                fields: [
                    {
                        name: '👤 Jugador',
                        value: `**${nombre}**`,
                        inline: true
                    },
                    {
                        name: '⏱️ Tiempo en sala',
                        value: duracionFormateada,
                        inline: true
                    },
                    {
                        name: '🔄 Estado',
                        value: motivo === 'normal' ? 'Desconexión normal' : motivo.toUpperCase(),
                        inline: true
                    }
                ],
                footer: {
                    text: `Auth: ${auth.substring(0, 16)}...`
                },
                timestamp: new Date().toISOString()
            };
            
            // Añadir razón si existe
            if (razon && razon.trim() !== '') {
                embed.fields.push({
                    name: '📋 Razón',
                    value: razon.length > 100 ? razon.substring(0, 100) + '...' : razon,
                    inline: false
                });
            }
            
            await this.enviarWebhook(TRACKING_CONFIG.WEBHOOK_JUGADORES_URL, {
                embeds: [embed]
            });
            
            // Registrar el reporte en BD si está disponible
            if (trackingFunctions) {
                await trackingFunctions.registrarReporteDiscord({
                    authJugador: auth,
                    nombreJugador: nombre,
                    tipoEvento: motivo,
                    titulo: titulo,
                    descripcion: `Jugador ${nombre} ${motivo === 'normal' ? 'se desconectó' : motivo === 'kick' ? 'fue expulsado' : 'fue baneado'}`,
                    color: color,
                    webhookUrl: TRACKING_CONFIG.WEBHOOK_JUGADORES_URL,
                    enviadoExitosamente: true,
                    fechaEvento: new Date(),
                    salaId: this.room ? this.room.name : null,
                    metadata: { motivo, razon, duracionSesion }
                });
            }
            
            this.contadoresTemporales.reportesEnviados++;
            
        } catch (error) {
            console.error('❌ Error enviando reporte de desconexión:', error);
        }
    }
    
    /**
     * Enviar reporte del sistema
     */
    async enviarReporteSistema(mensaje, tipo = 'sistema') {
        try {
            const embed = {
                title: '⚙️ Reporte del Sistema',
                description: mensaje,
                color: parseInt(TRACKING_CONFIG.COLORES.SISTEMA),
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Sistema de Tracking LNB'
                }
            };
            
            await this.enviarWebhook(TRACKING_CONFIG.WEBHOOK_ADMIN_URL, {
                embeds: [embed]
            });
            
        } catch (error) {
            console.error('❌ Error enviando reporte del sistema:', error);
        }
    }
    
    /**
     * Función helper para enviar webhooks
     */
    async enviarWebhook(webhookUrl, payload) {
        if (!webhookUrl || webhookUrl.includes('YOUR_WEBHOOK')) {
            console.warn('⚠️ URL de webhook no configurada');
            return false;
        }
        
        try {
            if (typeof fetch === 'undefined') {
                console.warn('⚠️ Fetch no disponible - reportes de Discord deshabilitados');
                return false;
            }
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Error enviando webhook:', error);
            return false;
        }
    }
    
    // ==================== FUNCIONES DE MANTENIMIENTO ====================
    
    /**
     * Programar limpieza automática
     */
    programarLimpiezaAutomatica() {
        if (this.timerLimpieza) {
            clearInterval(this.timerLimpieza);
        }
        
        const intervalo = TRACKING_CONFIG.INTERVALO_LIMPIEZA_MINUTOS * 60 * 1000;
        
        this.timerLimpieza = setInterval(async () => {
            console.log('🧹 Ejecutando limpieza automática...');
            await this.ejecutarLimpiezaCompleta();
        }, intervalo);
        
        console.log(`⏰ Limpieza automática programada cada ${TRACKING_CONFIG.INTERVALO_LIMPIEZA_MINUTOS} minutos`);
    }
    
    /**
     * Ejecutar limpieza completa del sistema
     */
    async ejecutarLimpiezaCompleta() {
        try {
            if (!trackingFunctions) {
                return;
            }
            
            const resultados = {
                sesionesInactivas: 0,
                datosAntiguos: null
            };
            
            // Limpiar sesiones inactivas
            resultados.sesionesInactivas = await trackingFunctions.limpiarSesionesInactivas();
            
            // Limpiar datos antiguos (solo una vez al día)
            const ahora = new Date();
            if (ahora.getHours() === 3 && ahora.getMinutes() < 60) { // 3 AM
                resultados.datosAntiguos = await trackingFunctions.limpiarDatosAntiguos();
            }
            
            // Actualizar estadísticas en cache
            await this.actualizarEstadisticasCache();
            
            console.log('✅ Limpieza automática completada:', resultados);
            
            // Enviar reporte si hubo limpieza significativa
            if (resultados.sesionesInactivas > 0 || resultados.datosAntiguos) {
                await this.enviarReporteSistema(
                    `Limpieza completada: ${resultados.sesionesInactivas} sesiones inactivas limpiadas`,
                    'sistema'
                );
            }
            
        } catch (error) {
            console.error('❌ Error en limpieza automática:', error);
            await this.enviarReporteSistema(`Error en limpieza automática: ${error.message}`, 'error');
        }
    }
    
    /**
     * Limpiar sesiones inactivas
     */
    async limpiarSesionesInactivas() {
        if (trackingFunctions) {
            return await trackingFunctions.limpiarSesionesInactivas();
        }
        return 0;
    }
    
    // ==================== FUNCIONES DE ESTADÍSTICAS ====================
    
    /**
     * Actualizar cache de estadísticas
     */
    async actualizarEstadisticasCache() {
        try {
            if (!trackingFunctions) {
                return;
            }
            
            this.estadisticasCache = await trackingFunctions.obtenerEstadisticasCompletas();
            this.ultimaActualizacionStats = Date.now();
            
        } catch (error) {
            console.error('❌ Error actualizando estadísticas:', error);
        }
    }
    
    /**
     * Obtener estadísticas del sistema
     */
    async obtenerEstadisticas(forzarActualizacion = false) {
        const ahora = Date.now();
        const CACHE_DURACION = 5 * 60 * 1000; // 5 minutos
        
        // Actualizar cache si es necesario
        if (forzarActualizacion || !this.estadisticasCache || (ahora - this.ultimaActualizacionStats) > CACHE_DURACION) {
            await this.actualizarEstadisticasCache();
        }
        
        return {
            ...this.estadisticasCache,
            contadoresTemporales: { ...this.contadoresTemporales },
            ultimaActualizacion: new Date(this.ultimaActualizacionStats).toISOString()
        };
    }
    
    // ==================== FUNCIONES AUXILIARES ====================
    
    /**
     * Formatear duración en milisegundos a texto legible
     */
    formatearDuracion(milisegundos) {
        if (!milisegundos || milisegundos < 0) return '0 segundos';
        
        const segundos = Math.floor(milisegundos / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        
        if (horas > 0) {
            return `${horas}h ${minutos % 60}m`;
        } else if (minutos > 0) {
            return `${minutos}m ${segundos % 60}s`;
        } else {
            return `${segundos}s`;
        }
    }
    
    /**
     * Sistema fallback para cuando no hay BD disponible
     */
    async trackearJugadorFallback(jugador) {
        const auth = jugador.auth;
        const nombre = jugador.name;
        const ahora = Date.now();
        
        let esNuevo = !this.jugadoresTracker.has(auth);
        let ipSimulada = esNuevo ? this.generarIPSimulada() : this.jugadoresTracker.get(auth).ipSimulada;
        
        if (esNuevo) {
            this.jugadoresTracker.set(auth, {
                primerNombre: nombre,
                ipSimulada: ipSimulada,
                totalConexiones: 1,
                primeraConexion: ahora
            });
            
            this.historialNombres.set(auth, new Set([nombre]));
        } else {
            const datos = this.jugadoresTracker.get(auth);
            datos.totalConexiones++;
            this.jugadoresTracker.set(auth, datos);
            
            const nombres = this.historialNombres.get(auth) || new Set();
            nombres.add(nombre);
            this.historialNombres.set(auth, nombres);
        }
        
        // Registrar inicio de sesión
        this.sesionesActivas.set(auth, ahora);
        
        return {
            esNuevo: esNuevo,
            ipSimulada: ipSimulada,
            totalConexiones: this.jugadoresTracker.get(auth).totalConexiones,
            conexionesHoy: 1, // En fallback no trackea días
            primerNombre: this.jugadoresTracker.get(auth).primerNombre
        };
    }
    
    /**
     * Generar IP simulada para fallback
     */
    generarIPSimulada() {
        const octeto1 = Math.floor(Math.random() * 223) + 1;
        const octeto2 = Math.floor(Math.random() * 256);
        const octeto3 = Math.floor(Math.random() * 256);
        const octeto4 = Math.floor(Math.random() * 254) + 1;
        return `${octeto1}.${octeto2}.${octeto3}.${octeto4}`;
    }
    
    /**
     * Destruir el sistema y limpiar recursos
     */
    destruir() {
        console.log('🔄 Cerrando sistema de tracking persistente...');
        
        if (this.timerLimpieza) {
            clearInterval(this.timerLimpieza);
            this.timerLimpieza = null;
        }
        
        // Limpiar datos en memoria si estamos en modo fallback
        if (this.jugadoresTracker) {
            this.jugadoresTracker.clear();
        }
        if (this.historialNombres) {
            this.historialNombres.clear();
        }
        if (this.sesionesActivas) {
            this.sesionesActivas.clear();
        }
        
        this.inicializado = false;
        console.log('✅ Sistema de tracking persistente cerrado');
    }
}

// ==================== FUNCIONES DE BÚSQUEDA Y CONSULTA ====================

/**
 * Buscar jugador por nombre
 */
async function buscarJugadorPorNombre(nombre) {
    if (!trackingFunctions) {
        console.warn('⚠️ Sistema de BD no disponible para búsquedas');
        return [];
    }
    
    try {
        return await trackingFunctions.buscarJugadoresPorNombre(nombre);
    } catch (error) {
        console.error('❌ Error buscando jugador:', error);
        return [];
    }
}

/**
 * Obtener historial completo de un jugador
 */
async function obtenerHistorialJugador(auth) {
    if (!trackingFunctions) {
        return null;
    }
    
    try {
        return await trackingFunctions.obtenerDatosJugadorParaReporte(auth, true);
    } catch (error) {
        console.error('❌ Error obteniendo historial:', error);
        return null;
    }
}

// ==================== EXPORTACIONES ====================

// Solo exportar en Node.js
if (isNode) {
    module.exports = {
        PlayerTrackingPersistent,
        buscarJugadorPorNombre,
        obtenerHistorialJugador,
        TRACKING_CONFIG
    };
}

// Variables globales para uso en el bot
let sistemaTrackingPersistente = null;

/**
 * Inicializar sistema de tracking persistente
 */
function inicializarTrackingPersistente(room) {
    if (sistemaTrackingPersistente) {
        sistemaTrackingPersistente.destruir();
    }
    
    sistemaTrackingPersistente = new PlayerTrackingPersistent(room);
    console.log('✅ Sistema de tracking persistente inicializado globalmente');
    return sistemaTrackingPersistente;
}

/**
 * Obtener instancia del sistema de tracking
 */
function obtenerSistemaTracking() {
    return sistemaTrackingPersistente;
}

// Hacer disponibles las funciones globalmente
if (typeof window === 'undefined') {
    global.inicializarTrackingPersistente = inicializarTrackingPersistente;
    global.obtenerSistemaTracking = obtenerSistemaTracking;
    global.buscarJugadorPorNombre = buscarJugadorPorNombre;
    global.obtenerHistorialJugador = obtenerHistorialJugador;
}
