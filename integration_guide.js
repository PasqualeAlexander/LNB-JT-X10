/**
 * GUÍA DE INTEGRACIÓN DEL SISTEMA DE TRACKING PERSISTENTE
 * =======================================================
 * 
 * Este archivo contiene ejemplos de cómo integrar el nuevo sistema
 * de tracking persistente con tu bot de HaxBall existente,
 * reemplazando completamente los Maps de JavaScript.
 */

/* 
 * PASO 1: IMPORTAR EL SISTEMA PERSISTENTE
 * ======================================
 * 
 * En tu archivo BOTLNBCODE.js, agrega estas líneas al inicio:
 */

// Importar sistema de tracking persistente
let PlayerTrackingPersistent = null;
let sistemaTracking = null;

if (typeof require !== 'undefined') {
    try {
        const trackingModule = require('./player_tracking_persistent.js');
        PlayerTrackingPersistent = trackingModule.PlayerTrackingPersistent;
        console.log('✅ Sistema de tracking persistente importado');
    } catch (error) {
        console.error('❌ Error importando tracking persistente:', error);
    }
}

/* 
 * PASO 2: ELIMINAR LAS VARIABLES GLOBALES ANTERIORES
 * ==================================================
 * 
 * ELIMINA o COMENTA estas líneas de tu código existente:
 */

// ❌ ELIMINAR ESTAS LÍNEAS:
// let jugadoresTracker = new Map();
// let historialNombresJugadores = new Map();  
// const WEBHOOK_JUGADORES_URL = 'https://discord.com/api/webhooks/...';

// ❌ ELIMINAR ESTAS FUNCIONES ANTIGUAS:
// function trackearJugador(jugador) { ... }
// function actualizarHistorialNombres(jugador, auth) { ... }
// function obtenerDatosJugadorParaReporte(jugador, tipoEvento) { ... }
// function enviarReporteJugadorDiscord(datosJugador, razonAdicional) { ... }
// function limpiarDatosTrackingDesconectados() { ... }

/* 
 * PASO 3: INICIALIZAR EL SISTEMA PERSISTENTE
 * ==========================================
 * 
 * Reemplaza la inicialización de tu room con esto:
 */

// Configuración de la sala (mantén tu configuración existente)
const roomConfig = {
    roomName: "🏆 Liga Nacional Bigger - LNB 🏆",
    maxPlayers: 12,
    public: true,
    geo: { code: "ar", lat: -34.61, lon: -58.38 }
    // ... resto de tu configuración
};

// Crear la sala
const room = HBInit(roomConfig);

// 🆕 NUEVA LÍNEA: Inicializar sistema de tracking persistente
if (PlayerTrackingPersistent) {
    sistemaTracking = new PlayerTrackingPersistent(room);
    console.log('✅ Sistema de tracking persistente inicializado');
} else {
    console.warn('⚠️ Sistema de tracking persistente no disponible - usando fallback');
}

/* 
 * PASO 4: ACTUALIZAR LOS EVENTOS DE JUGADORES
 * ===========================================
 * 
 * Reemplaza tus eventos onPlayerJoin y onPlayerLeave:
 */

// 🆕 NUEVO onPlayerJoin
room.onPlayerJoin = async function(player) {
    try {
        console.log(`🔗 ${player.name} se conectó`);
        
        // Tracking persistente - reemplaza trackearJugador()
        if (sistemaTracking) {
            const datosTracking = await sistemaTracking.trackearConexionJugador(player);
            
            if (datosTracking) {
                // Mostrar información en el chat si es un jugador conocido
                if (!datosTracking.esNuevo) {
                    room.sendAnnouncement(
                        `👋 ¡Bienvenido de vuelta ${player.name}! (Conexión #${datosTracking.totalConexiones})`,
                        player.id,
                        0x00FF00,
                        'bold'
                    );
                } else {
                    room.sendAnnouncement(
                        `🆕 ¡Bienvenido por primera vez ${player.name}! Disfruta tu estadía en LNB`,
                        player.id,
                        0x00FFFF,
                        'bold'
                    );
                }
            }
        }
        
        // Aquí puedes mantener el resto de tu lógica de onPlayerJoin
        // (verificar baneos, asignar equipos, etc.)
        
    } catch (error) {
        console.error('❌ Error en onPlayerJoin:', error);
    }
};

// 🆕 NUEVO onPlayerLeave  
room.onPlayerLeave = async function(player) {
    try {
        console.log(`🔌 ${player.name} se desconectó`);
        
        // Tracking persistente - reemplaza lógica anterior
        if (sistemaTracking) {
            await sistemaTracking.trackearDesconexionJugador(player, 'normal');
        }
        
        // Aquí puedes mantener el resto de tu lógica de onPlayerLeave
        
    } catch (error) {
        console.error('❌ Error en onPlayerLeave:', error);
    }
};

// 🆕 ACTUALIZAR eventos de kick y ban
room.onPlayerKicked = async function(kickedPlayer, reason, ban, byPlayer) {
    try {
        const motivo = ban ? 'ban' : 'kick';
        const razon = reason || 'Sin razón especificada';
        
        console.log(`${ban ? '🔨' : '👢'} ${kickedPlayer.name} fue ${ban ? 'baneado' : 'expulsado'}: ${razon}`);
        
        // Tracking persistente
        if (sistemaTracking) {
            await sistemaTracking.trackearDesconexionJugador(kickedPlayer, motivo, razon);
        }
        
        // Aquí puedes mantener el resto de tu lógica
        
    } catch (error) {
        console.error(`❌ Error en onPlayerKicked:`, error);
    }
};

/* 
 * PASO 5: CREAR COMANDOS PARA EL NUEVO SISTEMA
 * ============================================
 * 
 * Agrega estos comandos a tu sistema de comandos:
 */

// Comando para buscar jugador por nombre
function comandoBuscarJugador(player, args) {
    if (args.length < 1) {
        room.sendAnnouncement('❌ Uso: !buscar <nombre>', player.id, 0xFF0000);
        return;
    }
    
    const nombre = args.join(' ');
    
    if (typeof buscarJugadorPorNombre === 'function') {
        buscarJugadorPorNombre(nombre).then(resultados => {
            if (resultados.length === 0) {
                room.sendAnnouncement(`❌ No se encontró ningún jugador con "${nombre}"`, player.id, 0xFF0000);
                return;
            }
            
            room.sendAnnouncement(`🔍 Encontrados ${resultados.length} resultados para "${nombre}":`, player.id, 0x00FFFF);
            
            resultados.slice(0, 5).forEach((resultado, i) => {
                const ultimaVez = new Date(resultado.ultima_vez_usado).toLocaleDateString();
                room.sendAnnouncement(
                    `${i+1}. ${resultado.nombre} (${resultado.veces_usado}x, última vez: ${ultimaVez})`,
                    player.id,
                    0xFFFFFF
                );
            });
            
            if (resultados.length > 5) {
                room.sendAnnouncement(`... y ${resultados.length - 5} más`, player.id, 0x808080);
            }
        }).catch(error => {
            console.error('Error en búsqueda:', error);
            room.sendAnnouncement('❌ Error al buscar jugador', player.id, 0xFF0000);
        });
    } else {
        room.sendAnnouncement('❌ Función de búsqueda no disponible', player.id, 0xFF0000);
    }
}

// Comando para ver historial de un jugador
function comandoHistorialJugador(player, args) {
    if (args.length < 1) {
        room.sendAnnouncement('❌ Uso: !historial <nombre>', player.id, 0xFF0000);
        return;
    }
    
    const nombre = args.join(' ');
    
    // Buscar el jugador conectado
    const jugadorConectado = room.getPlayerList().find(p => 
        p.name.toLowerCase().includes(nombre.toLowerCase())
    );
    
    if (!jugadorConectado) {
        room.sendAnnouncement(`❌ Jugador "${nombre}" no está conectado`, player.id, 0xFF0000);
        return;
    }
    
    if (typeof obtenerHistorialJugador === 'function') {
        obtenerHistorialJugador(jugadorConectado.auth).then(historial => {
            if (!historial) {
                room.sendAnnouncement('❌ No se encontró historial para este jugador', player.id, 0xFF0000);
                return;
            }
            
            const datos = historial.tracking;
            const nombres = historial.historialNombres;
            
            room.sendAnnouncement(`📊 Historial de ${jugadorConectado.name}:`, player.id, 0x00FFFF);
            room.sendAnnouncement(`🎮 Primer nombre: ${datos.primer_nombre}`, player.id, 0xFFFFFF);
            room.sendAnnouncement(`🔢 Total conexiones: ${datos.total_conexiones}`, player.id, 0xFFFFFF);
            room.sendAnnouncement(`📅 Primera conexión: ${new Date(datos.primera_conexion).toLocaleString()}`, player.id, 0xFFFFFF);
            
            if (nombres.length > 1) {
                const nombresTexto = nombres.slice(0, 3).map(n => n.nombre).join(', ');
                room.sendAnnouncement(`📝 Nombres usados (${nombres.length}): ${nombresTexto}`, player.id, 0xFFFFFF);
            }
            
        }).catch(error => {
            console.error('Error obteniendo historial:', error);
            room.sendAnnouncement('❌ Error al obtener historial', player.id, 0xFF0000);
        });
    } else {
        room.sendAnnouncement('❌ Función de historial no disponible', player.id, 0xFF0000);
    }
}

// Comando para estadísticas del sistema (solo admins)
function comandoEstadisticasTracking(player) {
    if (!esAdmin(player.id)) {
        room.sendAnnouncement('❌ Solo administradores pueden usar este comando', player.id, 0xFF0000);
        return;
    }
    
    if (sistemaTracking) {
        sistemaTracking.obtenerEstadisticas().then(stats => {
            room.sendAnnouncement('📊 ESTADÍSTICAS DEL SISTEMA DE TRACKING:', player.id, 0x00FFFF);
            
            if (stats.totalJugadores && stats.totalJugadores[0]) {
                room.sendAnnouncement(`👥 Total jugadores: ${stats.totalJugadores[0].total}`, player.id, 0xFFFFFF);
            }
            
            if (stats.estadisticasHoy && stats.estadisticasHoy[0]) {
                const hoy = stats.estadisticasHoy[0];
                room.sendAnnouncement(`📅 Hoy: ${hoy.total_conexiones} conexiones, ${hoy.nuevos_jugadores} nuevos`, player.id, 0xFFFFFF);
            }
            
            const temp = stats.contadoresTemporales;
            room.sendAnnouncement(`🔄 Sesión actual: ${temp.jugadoresConectados} conectados`, player.id, 0xFFFFFF);
            
        }).catch(error => {
            console.error('Error obteniendo estadísticas:', error);
            room.sendAnnouncement('❌ Error al obtener estadísticas', player.id, 0xFF0000);
        });
    } else {
        room.sendAnnouncement('❌ Sistema de tracking no disponible', player.id, 0xFF0000);
    }
}

/* 
 * PASO 6: INTEGRAR CON TU SISTEMA DE COMANDOS EXISTENTE
 * =====================================================
 * 
 * Agrega estos comandos a tu función de procesamiento de comandos:
 */

// En tu función processCommand o similar:
function processCommand(player, message) {
    const args = message.slice(1).split(' ');
    const command = args.shift().toLowerCase();
    
    switch (command) {
        // Tus comandos existentes...
        
        // 🆕 NUEVOS COMANDOS DE TRACKING:
        case 'buscar':
            comandoBuscarJugador(player, args);
            break;
            
        case 'historial':
            comandoHistorialJugador(player, args);
            break;
            
        case 'tracking':
        case 'stats-tracking':
            comandoEstadisticasTracking(player);
            break;
            
        // Resto de tus comandos...
        default:
            room.sendAnnouncement('❌ Comando no reconocido', player.id, 0xFF0000);
            break;
    }
}

/* 
 * PASO 7: CONFIGURAR WEBHOOKS DE DISCORD
 * ======================================
 * 
 * En el archivo player_tracking_persistent.js, actualiza las URLs:
 */

/*
const TRACKING_CONFIG = {
    // 🆕 CONFIGURA ESTAS URLs CON TUS WEBHOOKS REALES:
    WEBHOOK_JUGADORES_URL: 'https://discord.com/api/webhooks/1234567890/tu-webhook-token-aqui',
    WEBHOOK_ADMIN_URL: 'https://discord.com/api/webhooks/0987654321/tu-admin-webhook-token-aqui',
    
    // Resto de la configuración...
};
*/

/* 
 * PASO 8: LIMPIEZA AL CERRAR LA SALA
 * ==================================
 * 
 * Asegúrate de limpiar recursos cuando se cierre la sala:
 */

// Al final de tu código, antes de cerrar:
process.on('SIGINT', () => {
    console.log('🔄 Cerrando bot...');
    
    if (sistemaTracking) {
        sistemaTracking.destruir();
    }
    
    // Aquí puedes agregar otras operaciones de limpieza
    
    process.exit(0);
});

/* 
 * RESUMEN DE BENEFICIOS DEL NUEVO SISTEMA:
 * ========================================
 * 
 * ✅ PERSISTENCIA: Los datos no se pierden al reiniciar
 * ✅ ESCALABILIDAD: Puede manejar miles de jugadores
 * ✅ ANÁLISIS: Estadísticas detalladas y reportes
 * ✅ BÚSQUEDAS: Encuentra jugadores por cualquier nombre usado
 * ✅ SESIONES: Tracking completo de tiempo de conexión
 * ✅ REPORTES: Notificaciones automáticas a Discord
 * ✅ LIMPIEZA: Mantenimiento automático de datos
 * ✅ FALLBACK: Funciona aunque falle la base de datos
 * 
 * ARCHIVOS CREADOS:
 * ================
 * 
 * 📄 database/create_tracking_tables.sql - Estructura de BD
 * 📄 database/tracking_functions.js - Funciones de base de datos  
 * 📄 player_tracking_persistent.js - Sistema principal
 * 📄 install_tracking_system.js - Instalador automático
 * 📄 integration_guide.js - Esta guía de integración
 * 
 * COMANDOS DE INSTALACIÓN:
 * =======================
 * 
 * 1. Instalar el sistema:
 *    node install_tracking_system.js install
 * 
 * 2. Verificar estado:
 *    node install_tracking_system.js status
 * 
 * 3. Ver ayuda:
 *    node install_tracking_system.js help
 * 
 * ¡EL SISTEMA ESTÁ LISTO PARA USAR!
 * ==================================
 */

module.exports = {
    comandoBuscarJugador,
    comandoHistorialJugador,
    comandoEstadisticasTracking,
    processCommand
};
