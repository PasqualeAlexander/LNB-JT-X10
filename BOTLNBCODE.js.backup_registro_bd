// ANUNCIAR TOP ALEATORIO CADA 20 MINUTOS
let intervalTopAleatorio = null;
function iniciarTopAleatorioAutomatico() {
    if (intervalTopAleatorio) clearInterval(intervalTopAleatorio);
    
    // Lista de tipos de top disponibles
    const tiposTops = [
        'goles',
        'asistencias', 
        'partidos',
        'victorias',
        'rank',
        'mvps'
    ];
    
    // Ejecutar una vez tras 5 minutos para no spamear al iniciar
    setTimeout(() => {
        if (typeof room !== 'undefined' && room && room.sendAnnouncement) {
            try {
                // Solo anunciar si hay jugadores en sala
                const players = room.getPlayerList ? room.getPlayerList() : [];
                if (!players || players.length === 0) return;
                
                const tipoAleatorio = tiposTops[Math.floor(Math.random() * tiposTops.length)];
                if (typeof mostrarTopJugadores === 'function') {
                    // Usar exactamente la misma función que el comando manual
                    mostrarTopJugadores({ id: null }, tipoAleatorio);
                }
            } catch (e) {
                // Silenciar errores de anuncio inicial
            }
        }
    }, 300000); // 5 minutos
    
    // Intervalo principal cada 20 minutos
    intervalTopAleatorio = setInterval(() => {
        try {
            if (typeof room !== 'undefined' && room && room.sendAnnouncement) {
                // Solo anunciar si hay jugadores en sala
                const players = room.getPlayerList ? room.getPlayerList() : [];
                if (!players || players.length === 0) return;
                
                // Seleccionar tipo de top aleatorio
                const tipoAleatorio = tiposTops[Math.floor(Math.random() * tiposTops.length)];
                
                if (typeof mostrarTopJugadores === 'function') {
                    // Usar exactamente la misma función que el comando manual
                    // El jugador { id: null } hace que se envíe a toda la sala
                    mostrarTopJugadores({ id: null }, tipoAleatorio);
                }
            }
        } catch (error) {
            // Error en anuncio automático de top aleatorio
        }
    }, 1200000); // 20 minutos (1200000 ms)
}

/* 
* ██████╗  ██████╗ ████████╗   ██╗     ███╗   ██╗██████╗         ██╗████████╗
* ██╔══██╗██╔═══██╗╚══██╔══╝   ██║     ████╗  ██║██╔══██╗        ██║╚══██╔══╝
* ██████╔╝██║   ██║   ██║      ██║     ██╔██╗ ██║██████╔╝        ██║   ██║   
* ██╔══██╗██║   ██║   ██║      ██║     ██║╚██╗██║██╔══██╗   ██   ██║   ██║   
* ██████╔╝╚██████╔╝   ██║      ███████╗██║ ╚████║██████╔╝   ╚█████╔╝   ██║   
* ╚═════╝  ╚═════╝    ╚═╝      ╚══════╝╚═╝  ╚═══╝╚═════╝     ╚════╝    ╚═╝    

BOT LIGA NACIONAL DE BIGGER LNB - VERSION HEADLESS
   Compatible con HaxBall Headless Host
   ============================== */

// ==================== DETECCIÓN DE ENTORNO Y COMPATIBILIDAD ====================
const isNode = typeof window === 'undefined';

// Polyfill para fetch en Node.js si no está disponible
if (isNode && typeof fetch === 'undefined') {
    try {
        global.fetch = require('node-fetch');
        global.FormData = require('form-data');
    } catch (error) {
        // node-fetch no disponible - funciones de Discord deshabilitadas
    }
}

// Importar sistema de desbaneo
let ejecutarDesbaneo = null;
let unbanMejorado = null;
if (isNode) {
    try {
        const unbanSystem = require('./unban_system.js');
        ejecutarDesbaneo = unbanSystem.ejecutarDesbaneo;
        console.log('✅ Sistema de desbaneo importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el sistema de desbaneo:', error.message);
    }
    
    // Importar sistema de desbaneo mejorado
    try {
        const unbanMejoradoSystem = require('./unban_mejorado.js');
        unbanMejorado = unbanMejoradoSystem.unbanMejorado;
        console.log('✅ Sistema de desbaneo mejorado importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el sistema de desbaneo mejorado:', error.message);
    }
}

// Importar sistema de reparación para baneos temporales
let fixBaneosTemporales = null;
if (isNode) {
    try {
        fixBaneosTemporales = require('./fix_baneos_temporales.js');
        console.log('✅ Sistema de reparación de baneos temporales importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el sistema de reparación de baneos temporales:', error.message);
    }
}

// Importar nuevo sistema de comandos
let newCommandSystem = null;
if (isNode) {
    try {
        newCommandSystem = require('./new_commands_system.js');
        console.log('✅ Nuevo sistema de comandos importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el nuevo sistema de comandos:', error.message);
    }
}

// ==================== SISTEMA DE TRACKING PERSISTENTE ====================
// Importar sistema de tracking persistente (reemplaza los Maps de JavaScript)
let PlayerTrackingPersistent = null;
let sistemaTrackingPersistente = null;
if (isNode) {
    try {
        const trackingModule = require('./player_tracking_persistent.js');
        PlayerTrackingPersistent = trackingModule.PlayerTrackingPersistent;
        console.log('✅ Sistema de tracking persistente importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el sistema de tracking persistente:', error.message);
    }
}

// ==================== SISTEMA DE ROLES PERSISTENTES ====================
// Importar sistema de roles persistentes para mantener roles entre desconexiones
let rolesPersistentSystem = null;
if (isNode) {
    try {
        const rolesModule = require('./roles_persistent_system.js');
        rolesPersistentSystem = rolesModule.rolesPersistentSystem;
        console.log('✅ Sistema de roles persistentes importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el sistema de roles persistentes:', error.message);
    }
}

// ==================== SISTEMA VIP ====================
// Importar sistema VIP completo con comandos y beneficios diferenciados
let BotVIPIntegration = null;
let vipBot = null;
if (isNode) {
    try {
        const VIPIntegrationModule = require('./bot_vip_integration.js');
        BotVIPIntegration = VIPIntegrationModule;
        console.log('✅ Sistema VIP importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el sistema VIP:', error.message);
    }
}

// ==================== SISTEMA DE BANEOS OFFLINE ====================
// Importar sistema de baneos offline para banear jugadores desconectados
let OfflineBanSystem = null;
let offlineBanSystem = null;
if (isNode) {
    try {
        const offlineBanModule = require('./offline_ban_system.js');
        OfflineBanSystem = offlineBanModule.OfflineBanSystem;
        offlineBanSystem = offlineBanModule.offlineBanSystem;
        console.log('✅ Sistema de baneos offline importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el sistema de baneos offline:', error.message);
    }
}

// ==================== SISTEMA DE FESTEJOS PERSISTENTES ====================
// Importar sistema de festejos persistentes para mantener mensajes personalizados entre desconexiones
let sistemaFestejosPersistente = null;
let cargarFestejos = null;
let guardarFestejo = null;
let obtenerMensajeFestejo = null;
let tieneFestejos = null;
let limpiarFestejos = null;
let inicializarSistemaFestejos = null;
let migrarFestivoTemporal = null;

if (isNode) {
    try {
        const festejosModule = require('./festejos_persistent_system.js');
        cargarFestejos = festejosModule.cargarFestejos;
        guardarFestejo = festejosModule.guardarFestejo;
        obtenerMensajeFestejo = festejosModule.obtenerMensajeFestejo;
        tieneFestejos = festejosModule.tieneFestejos;
        limpiarFestejos = festejosModule.limpiarFestejos;
        inicializarSistemaFestejos = festejosModule.inicializarSistemaFestejos;
        
        // Inicializar el sistema automáticamente al importar
        if (inicializarSistemaFestejos) {
            sistemaFestejosPersistente = inicializarSistemaFestejos();
            console.log('✅ Sistema de festejos persistentes inicializado automáticamente');
        }
        
        // Función para migrar mensajes temporales al sistema persistente
        migrarFestivoTemporal = async function(auth_id, player_name, mensajeGol = null, mensajeAsistencia = null) {
            if (guardarFestejo && auth_id) {
                try {
                    let resultados = { gol: null, asistencia: null };
                    
                    if (mensajeGol) {
                        resultados.gol = await guardarFestejo(auth_id, player_name, 'gol', mensajeGol);
                    }
                    
                    if (mensajeAsistencia) {
                        resultados.asistencia = await guardarFestejo(auth_id, player_name, 'asistencia', mensajeAsistencia);
                    }
                    
                    return resultados;
                } catch (error) {
                    console.error('❌ Error en migración de festejos:', error);
                    return { error: error.message };
                }
            }
            return null;
        };
        
        console.log('✅ Sistema de festejos persistentes importado correctamente');
    } catch (error) {
        console.warn('⚠️ No se pudo importar el sistema de festejos persistentes:', error.message);
    }
}

// ==================== SISTEMA DE ALMACENAMIENTO CON BASE DE DATOS ====================
// Funciones para manejo de almacenamiento usando MySQL a través de Node.js

// ==================== SISTEMA DE BACKUP AUTOMÁTICO ====================
class SistemaBackup {
    constructor() {
        this.intervaloBackup = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
        this.maxBackupsGuardados = 7; // Mantener últimos 7 backups
        this.rutaBackups = 'backups/'; // Carpeta de backups
        this.ultimoBackup = null;
        this.timerBackup = null;
        
        // Inicializar sistema de backup
        this.inicializar();
    }
    
    inicializar() {
        console.log('🔄 Inicializando sistema de backup automático...');
        
        // Verificar si existe la carpeta de backups
        this.verificarCarpetaBackups();
        
        // Cargar información del último backup
        this.cargarInfoUltimoBackup();
        
        // Programar próximo backup
        this.programarProximoBackup();
        
        // Realizar backup inicial si no hay ninguno reciente
        this.verificarBackupInicial();
        
        console.log('✅ Sistema de backup automático inicializado');
    }
    
    verificarCarpetaBackups() {
        try {
            if (typeof nodeVerificarCarpeta === 'function') {
                nodeVerificarCarpeta(this.rutaBackups);
                console.log(`📁 Carpeta de backups verificada: ${this.rutaBackups}`);
            } else {
                console.warn('⚠️ Función nodeVerificarCarpeta no disponible - usando localStorage como respaldo');
            }
        } catch (error) {
            console.error('❌ Error verificando carpeta de backups:', error);
        }
    }
    
    async crearBackupCompleto(motivo = 'Backup automático') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const nombreArchivo = `backup_lnb_${timestamp}.json`;
        
        try {
            console.log(`🔄 Creando backup: ${motivo}`);
            
            // Recopilar todos los datos importantes
            const datosBackup = {
                metadata: {
                    version: '1.0',
                    fecha: new Date().toISOString(),
                    motivo: motivo,
                    bot_version: 'LNB v4.0',
                    total_jugadores: Object.keys(estadisticasGlobales?.jugadores || {}).length,
                    total_partidos: estadisticasGlobales?.totalPartidos || 0
                },
                
                // Datos principales
                estadisticas_globales: estadisticasGlobales || {},
                
                // Configuraciones importantes
                configuracion: {
                    mapa_actual: mapaActual,
                    auto_start_enabled: autoStartEnabled,
                    auto_stop_enabled: autoStopEnabled,
                    cambios_camiseta_red: cambiosCamisetaRed,
                    cambios_camiseta_blue: cambiosCamisetaBlue,
                    contraseña_actual: contraseñaActual ? '[PROTEGIDA]' : null,
                    ultimo_cambio_contraseña: ultimoCambioContraseña
                },
                
                // Datos de sesión importantes (sin datos sensibles)
                datos_sesion: {
                    jugadores_roles: Array.from(jugadoresConRoles.entries()).map(([id, rol]) => ({
                        id: id,
                        rol: rol.role,
                        asignado: rol.assignedAt
                    })),
                    
                    mensajes_personalizados: Array.from(mensajesPersonalizados.entries()).map(([id, msgs]) => ({
                        id: id,
                        mensajes: msgs,
                        ultimo_uso: msgs.ultimoUso
                    })),
                    
                    cooldown_llamar_admin: cooldownLlamarAdmin
                },
                
                // Estadísticas del sistema
                estadisticas_sistema: {
                    tiempo_actividad: Date.now() - (estadisticasGlobales?.fechaCreacion ? new Date(estadisticasGlobales.fechaCreacion).getTime() : Date.now()),
                    partidos_hoy: this.contarPartidosHoy(),
                    jugadores_activos_7_dias: this.contarJugadoresActivos7Dias()
                }
            };
            
            // Intentar guardar usando función de Node.js si está disponible
            if (typeof nodeGuardarBackup === 'function') {
                const resultado = await nodeGuardarBackup(this.rutaBackups + nombreArchivo, datosBackup);
                
                if (resultado.success) {
                    console.log(`✅ Backup creado exitosamente: ${nombreArchivo}`);
                    console.log(`📊 Estadísticas del backup:`);
                    console.log(`   - Jugadores: ${datosBackup.metadata.total_jugadores}`);
                    console.log(`   - Partidos: ${datosBackup.metadata.total_partidos}`);
                    console.log(`   - Tamaño: ${this.formatearTamaño(JSON.stringify(datosBackup).length)}`);
                    
                    // Actualizar información del último backup
                    this.ultimoBackup = {
                        fecha: new Date().toISOString(),
                        archivo: nombreArchivo,
                        motivo: motivo,
                        tamaño: JSON.stringify(datosBackup).length
                    };
                    
                    // Guardar info del último backup
                    this.guardarInfoUltimoBackup();
                    
                    // Limpiar backups antiguos
                    await this.limpiarBackupsAntiguos();
                    
                    // Anunciar en el juego si hay jugadores conectados
                    if (typeof room !== 'undefined' && room && room.getPlayerList) {
                        const jugadores = room.getPlayerList();
                        if (jugadores.length > 1) { // Solo si hay jugadores (más que el bot)
                            anunciarInfo(`💾 Backup automático completado - ${datosBackup.metadata.total_jugadores} jugadores guardados`);
                        }
                    }
                    
                    return {
                        success: true,
                        archivo: nombreArchivo,
                        datos: datosBackup.metadata
                    };
                } else {
                    throw new Error(resultado.error || 'Error desconocido en nodeGuardarBackup');
                }
            } else {
                // Respaldo usando localStorage/sessionStorage
                console.warn('⚠️ nodeGuardarBackup no disponible, usando localStorage como respaldo');
                
                const backupComprimido = this.comprimirDatos(datosBackup);
                localStorage.setItem(`backup_${timestamp}`, backupComprimido);
                
                console.log(`✅ Backup guardado en localStorage: backup_${timestamp}`);
                
                // Limpiar backups antiguos del localStorage
                this.limpiarBackupsLocalStorage();
                
                return {
                    success: true,
                    archivo: `backup_${timestamp}`,
                    storage: 'localStorage'
                };
            }
            
        } catch (error) {
            console.error('❌ Error creando backup:', error);
            
            // Anunciar error si hay jugadores conectados
            if (typeof room !== 'undefined' && room && room.getPlayerList) {
                const jugadores = room.getPlayerList();
                if (jugadores.length > 1) {
                    anunciarAdvertencia('⚠️ Error en backup automático - contactar administrador');
                }
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    contarPartidosHoy() {
        if (!estadisticasGlobales || !estadisticasGlobales.jugadores) return 0;
        
        const hoy = new Date().toISOString().split('T')[0];
        let partidosHoy = 0;
        
        // Estimar partidos de hoy basado en actividad de jugadores
        Object.values(estadisticasGlobales.jugadores).forEach(jugador => {
            if (jugador.fechaUltimoPartido && jugador.fechaUltimoPartido.startsWith(hoy)) {
                partidosHoy++;
            }
        });
        
        return Math.floor(partidosHoy / 6); // Aproximación (6 jugadores promedio por partido)
    }
    
    contarJugadoresActivos7Dias() {
        if (!estadisticasGlobales || !estadisticasGlobales.jugadores) return 0;
        
        const hace7Dias = new Date();
        hace7Dias.setDate(hace7Dias.getDate() - 7);
        
        let jugadoresActivos = 0;
        
        Object.values(estadisticasGlobales.jugadores).forEach(jugador => {
            if (jugador.fechaUltimoPartido) {
                const fechaUltimoPartido = new Date(jugador.fechaUltimoPartido);
                if (fechaUltimoPartido >= hace7Dias) {
                    jugadoresActivos++;
                }
            }
        });
        
        return jugadoresActivos;
    }
    
    comprimirDatos(datos) {
        // Comprimir datos para localStorage (simple)
        try {
            return JSON.stringify(datos);
        } catch (error) {
            console.error('❌ Error comprimiendo datos:', error);
            return '{}';
        }
    }
    
    formatearTamaño(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    programarProximoBackup() {
        // Limpiar timer anterior si existe
        if (this.timerBackup) {
            clearTimeout(this.timerBackup);
        }
        
        // Calcular tiempo hasta el próximo backup
        let tiempoHastaProximoBackup = this.intervaloBackup;
        
        if (this.ultimoBackup && this.ultimoBackup.fecha) {
            const tiempoTranscurrido = Date.now() - new Date(this.ultimoBackup.fecha).getTime();
            tiempoHastaProximoBackup = Math.max(0, this.intervaloBackup - tiempoTranscurrido);
        }
        
        console.log(`⏰ Próximo backup automático en: ${this.formatearTiempo(tiempoHastaProximoBackup)}`);
        
        // Programar el próximo backup
        this.timerBackup = setTimeout(() => {
            this.ejecutarBackupAutomatico();
        }, tiempoHastaProximoBackup);
    }
    
    async ejecutarBackupAutomatico() {
        console.log('🕐 Ejecutando backup automático programado...');
        
        const resultado = await this.crearBackupCompleto('Backup automático diario');
        
        if (resultado.success) {
            console.log('✅ Backup automático completado exitosamente');
        } else {
            console.error('❌ Backup automático falló:', resultado.error);
        }
        
        // Programar el siguiente backup
        this.programarProximoBackup();
    }
    
    formatearTiempo(milisegundos) {
        const horas = Math.floor(milisegundos / (1000 * 60 * 60));
        const minutos = Math.floor((milisegundos % (1000 * 60 * 60)) / (1000 * 60));
        
        if (horas > 0) {
            return `${horas}h ${minutos}m`;
        } else {
            return `${minutos}m`;
        }
    }
    
    verificarBackupInicial() {
        // Si no hay backup reciente (últimas 25 horas), crear uno inmediatamente
        if (!this.ultimoBackup || 
            (Date.now() - new Date(this.ultimoBackup.fecha).getTime()) > (25 * 60 * 60 * 1000)) {
            
            console.log('📝 No hay backup reciente, creando backup inicial...');
            
            // Crear backup inicial después de 30 segundos (dar tiempo a que se carguen los datos)
            setTimeout(() => {
                this.crearBackupCompleto('Backup inicial al iniciar');
            }, 30000);
        }
    }
    
    cargarInfoUltimoBackup() {
        try {
            const info = localStorage.getItem('ultimo_backup_info');
            if (info) {
                this.ultimoBackup = JSON.parse(info);
                console.log(`📄 Último backup: ${this.ultimoBackup.archivo} (${new Date(this.ultimoBackup.fecha).toLocaleString()})`);
            }
        } catch (error) {
            console.warn('⚠️ No se pudo cargar info del último backup:', error.message);
        }
    }
    
    guardarInfoUltimoBackup() {
        try {
            localStorage.setItem('ultimo_backup_info', JSON.stringify(this.ultimoBackup));
        } catch (error) {
            console.warn('⚠️ No se pudo guardar info del último backup:', error.message);
        }
    }
    
    async limpiarBackupsAntiguos() {
        try {
            if (typeof nodeLimpiarBackupsAntiguos === 'function') {
                const resultado = await nodeLimpiarBackupsAntiguos(this.rutaBackups, this.maxBackupsGuardados);
                if (resultado.success) {
                    console.log(`🧹 Backups antiguos limpiados: ${resultado.eliminados} archivos`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Error limpiando backups antiguos:', error.message);
        }
    }
    
    limpiarBackupsLocalStorage() {
        try {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('backup_'));
            
            // Mantener solo los últimos 3 backups en localStorage
            if (keys.length > 3) {
                const backupsOrdenados = keys
                    .map(key => ({ key, fecha: key.replace('backup_', '') }))
                    .sort((a, b) => b.fecha.localeCompare(a.fecha));
                
                // Eliminar los más antiguos
                for (let i = 3; i < backupsOrdenados.length; i++) {
                    localStorage.removeItem(backupsOrdenados[i].key);
                }
                
                console.log(`🧹 Limpiados ${backupsOrdenados.length - 3} backups antiguos de localStorage`);
            }
        } catch (error) {
            console.warn('⚠️ Error limpiando backups de localStorage:', error.message);
        }
    }
    
    // Método para crear backup manual
    async crearBackupManual(motivo = 'Backup manual') {
        return await this.crearBackupCompleto(motivo);
    }
    
    // Método para obtener estadísticas de backups
    obtenerEstadisticasBackup() {
        return {
            ultimo_backup: this.ultimoBackup,
            proximo_backup: this.timerBackup ? new Date(Date.now() + this.intervaloBackup).toISOString() : null,
            intervalo_horas: this.intervaloBackup / (1000 * 60 * 60),
            max_backups_guardados: this.maxBackupsGuardados,
            ruta_backups: this.rutaBackups
        };
    }
}

// Instancia global del sistema de backup
let sistemaBackup = null;

// ==================== FUNCIÓN PARA VERIFICAR DISPONIBILIDAD DE FUNCIONES NODE.JS ====================
function verificarFuncionesNodeDisponibles() {
    const funcionesRequeridas = [
        'nodeGetRole', 'nodeAssignRole', 'cargarEstadisticasGlobales',
        'guardarEstadisticasGlobales', 'nodeObtenerJugadorPorAuth'
    ];
    
    let funcionesDisponibles = 0;
    const estadoFunciones = {};
    
    funcionesRequeridas.forEach(nombreFuncion => {
        const disponible = typeof window[nombreFuncion] === 'function' || typeof global[nombreFuncion] === 'function';
        estadoFunciones[nombreFuncion] = disponible;
        if (disponible) funcionesDisponibles++;
    });
    
    return {
        total: funcionesRequeridas.length,
        disponibles: funcionesDisponibles,
        estado: estadoFunciones,
        completo: funcionesDisponibles === funcionesRequeridas.length
    };
}

async function cargarEstadisticasGlobalesDB() {
    try {
        // Buscar función expuesta desde Node.js en el contexto global
        if (typeof cargarEstadisticasGlobales !== 'undefined') {
            console.log('🔄 Cargando estadísticas desde base de datos...');
            const datos = await cargarEstadisticasGlobales();
            console.log('✅ Estadísticas cargadas desde base de datos:', datos ? Object.keys(datos.jugadores || {}).length + ' jugadores' : 'null');
            return datos;
        } else if (typeof window !== 'undefined' && typeof window.cargarEstadisticasGlobales !== 'undefined') {
            console.log('🔄 Cargando estadísticas desde window.cargarEstadisticasGlobales...');
            const datos = await window.cargarEstadisticasGlobales();
            return datos;
        } else if (typeof global !== 'undefined' && typeof global.cargarEstadisticasGlobales !== 'undefined') {
            console.log('🔄 Cargando estadísticas desde global.cargarEstadisticasGlobales...');
            const datos = await global.cargarEstadisticasGlobales();
            return datos;
        } else {
            console.warn('⚠️ Sistema de base de datos no disponible');
            return null;
        }
    } catch (error) {
        console.error("❌ Error al cargar datos:", error);
        return null;
    }
}

function guardarEstadisticasGlobalesDB(datos) {
    try {
        // Buscar función expuesta desde Node.js en el contexto global
        if (typeof guardarEstadisticasGlobales !== 'undefined') {
            return guardarEstadisticasGlobales(datos);
        } else if (typeof window !== 'undefined' && typeof window.guardarEstadisticasGlobales !== 'undefined') {
            return window.guardarEstadisticasGlobales(datos);
        } else if (typeof global !== 'undefined' && typeof global.guardarEstadisticasGlobales !== 'undefined') {
            return global.guardarEstadisticasGlobales(datos);
        } else {
            console.warn('⚠️ Sistema de base de datos no disponible');
            return false;
        }
    } catch (error) {
        console.error("❌ Error al guardar datos:", error);
        return false;
    }
}

function inicializarBaseDatos() {
    // La inicialización se maneja desde Node.js con MySQL
    // Esta función mantiene compatibilidad con el código existente
    return {
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
        contadorJugadores: 0
    };
}

// ==================== FUNCIÓN CORREGIDA: AUTH_ID (SIN USAR NOMBRE COMO IDENTIFICADOR) ====================
async function obtenerEstadisticasJugador(identificador) {
    try {
        // Requiere objeto jugador de HaxBall
        if (typeof identificador === 'object' && identificador.name) {
            return await obtenerEstadisticasJugadorSeguro(identificador);
        }
        
        // Si llega un string (nombre), rechazar por política
        if (typeof identificador === 'string') {
            console.warn('🚫 Política activa: el nombre no se usa como identificador. Pase el objeto jugador.');
            return null;
        }
        
        console.warn('⚠️ Identificador inválido para obtenerEstadisticasJugador');
        return null;
        
    } catch (error) {
        console.error("❌ Error al obtener estadísticas del jugador:", error);
        return null;
    }
}

// Nueva función segura que usa auth_id (sin migración por nombre ni fallback por nombre)
async function obtenerEstadisticasJugadorSeguro(jugadorHB) {
    try {
        const authId = jugadorHB.auth;
        const nombre = jugadorHB.name;
        
        console.log('🔍 Obteniendo estadísticas:', nombre, '(Auth:', authId || 'SIN_AUTH', ')');
        
        // Buscar únicamente por auth_id
        if (authId && typeof nodeObtenerJugadorPorAuth !== 'undefined') {
            const resultado = await nodeObtenerJugadorPorAuth(authId);
            if (resultado) {
                console.log('✅ Encontrado por auth_id:', authId);
                return resultado;
            }
        }
        
        // Si no tiene auth_id, no persistimos ni buscamos por nombre
        if (!authId) {
            console.warn('🚫 Jugador sin auth_id: no se consultan ni persisten estadísticas por nombre.');
            return null;
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas por auth:', error);
        return null;
    }
}

// ==================== FUNCIÓN CORREGIDA: REGISTRAR SOLO POR AUTH_ID ====================
async function registrarJugador(jugadorHB) {
    try {
        // Rechazar strings por política (nunca usar nombre como identificador)
        if (typeof jugadorHB === 'string') {
            console.warn('🚫 registrarJugador: el nombre no se usa como identificador. Pase el objeto jugador.');
            return;
        }
        
        const authId = jugadorHB.auth;
        const nombre = jugadorHB.name;
        
        console.log('🔍 Registrando jugador:', nombre, '(Auth:', authId || 'SIN_AUTH', ')');
        
        if (!authId) {
            console.warn('🚫 Jugador sin auth_id: no se registrará en DB.');
            return;
        }
        
        // Verificar si ya existe usando función segura (solo auth)
        const jugadorExistente = await obtenerEstadisticasJugadorSeguro(jugadorHB);
        
        if (!jugadorExistente) {
            const nuevoJugador = {
                auth_id: authId,
                nombre: nombre,
                partidos: 0,
                victorias: 0,
                derrotas: 0,
                goles: 0,
                asistencias: 0,
                autogoles: 0,
                mejorRachaGoles: 0,
                mejorRachaAsistencias: 0,
                hatTricks: 0,
                vallasInvictas: 0,
                tiempoJugado: 0,
                promedioGoles: 0.0,
                promedioAsistencias: 0.0,
                fechaPrimerPartido: new Date().toISOString(),
                fechaUltimoPartido: new Date().toISOString(),
                xp: 40,
                nivel: 1
            };
            
            await nodeGuardarJugadorPorAuth(authId, nombre, nuevoJugador);
            console.log('✅ Registrado por auth_id:', nombre, '(' + authId + ')');
        } else {
            console.log('ℹ️ Jugador ya existe (auth):', nombre);
        }
    } catch (error) {
        console.error("❌ Error al registrar jugador:", error);
    }
}

// HBInit y fetch están disponibles globalmente en el navegador

// ==================== CONFIGURACIÓN DE LA SALA ====================
// Variables de configuración (estas deben coincidir con bot.js)
const roomName = "⚡🔥🟣 ❰LNB❱ JUEGAN TODOS X7 🟣🔥⚡";
const maxPlayers = 18;
const roomPublic = true;
const roomPassword = null;
const token = "thr1.AAAAAGjQ6vpcghIaLmIBSw.4c4TkDjP7fQ";
const geo = { code: 'AR', lat: -34.7000, lon: -58.2800 };  // Ajustado para Quilmes, Buenos Aires

// Variable para almacenar el objeto room
let room = null;

// Variables para sistema AFK
let advertenciasAFK = new Map();
let comandoCooldown = new Map();

// SISTEMA DE LOGGING OPTIMIZADO PARA REDUCIR SPAM
let logSpamControl = new Map();
const LOG_SPAM_INTERVAL = 5000; // 5 segundos mínimo entre logs similares

function logOptimizado(mensaje, categoria = 'general') {
    const ahora = Date.now();
    const clave = `${categoria}_${mensaje.substring(0, 50)}`; // Primeros 50 caracteres como clave
    
    const ultimoLog = logSpamControl.get(clave);
    if (!ultimoLog || (ahora - ultimoLog) > LOG_SPAM_INTERVAL) {
        console.log(mensaje);
        logSpamControl.set(clave, ahora);
    }
    
    // Limpiar mapa cada 10 minutos para evitar acumulación
    if (logSpamControl.size > 100) {
        logSpamControl.clear();
    }
}

// CACHE OPTIMIZADO PARA getPlayerList
let playerListCache = null;
let playerListCacheTime = 0;
const PLAYER_CACHE_DURATION = 100; // Cache por 100ms

function getPlayerListCached() {
    const ahora = Date.now();
    if (!playerListCache || (ahora - playerListCacheTime) > PLAYER_CACHE_DURATION) {
        if (room && room.getPlayerList) {
            playerListCache = room.getPlayerList();
            playerListCacheTime = ahora;
        } else {
            return [];
        }
    }
    return playerListCache;
}

// SISTEMA DE OPTIMIZACIÓN DE RENDIMIENTO
// Función debounce para optimizar funciones que se ejecutan frecuentemente
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ==================== LÓGICA SEPARADA: HAT-TRICKS Y MVPs ====================
// Procesar y registrar hat-tricks de un jugador en un partido
function procesarHatTricks(jugadorPartido, statsGlobal, fechaActual) {
    try {
        if (!jugadorPartido || !statsGlobal) return;
        // Criterio: 3 o más goles en el partido
        if ((jugadorPartido.goles || 0) >= 3) {
            statsGlobal.hatTricks = (statsGlobal.hatTricks || 0) + 1;
            if (estadisticasGlobales && estadisticasGlobales.records && Array.isArray(estadisticasGlobales.records.hatTricks)) {
                estadisticasGlobales.records.hatTricks.push({
                    jugador: jugadorPartido.nombre,
                    goles: jugadorPartido.goles,
                    fecha: fechaActual
                });
            }
            // Otorgar XP por hat-trick
            try { otorgarXP(jugadorPartido.nombre, 'hat_trick'); } catch (e) {}
        }
    } catch (e) {
        console.error('❌ Error en procesarHatTricks:', e);
    }
}

// Procesar y registrar MVP del partido (SOLO en canchas x4 y x7)
function procesarMVPPartido(nombreMVP, fechaActual) {
    try {
        if (!nombreMVP) return;
        
        // ====================== VALIDAR CANCHA ANTES DE REGISTRAR MVP ======================
        if (!esPartidoValido()) {
            console.log(`📊 MVP NO registrado para ${nombreMVP}: Partido en cancha no válida (${mapaActual})`);
            return;
        }
        
        // Resolver authID del MVP actual (solo si está en sala)
        const jugadorEnSala = room.getPlayerList().find(j => obtenerNombreOriginal(j) === nombreMVP);
        if (!jugadorEnSala) {
            console.warn(`🚫 MVP no registrado: ${nombreMVP} no está en sala (no se usa nombre como identificador)`);
            return;
        }
        const authIDMVP = jugadoresUID.get(jugadorEnSala.id);
        if (!authIDMVP) {
            console.warn(`🚫 MVP no registrado: ${nombreMVP} sin authID`);
            return;
        }
        
        const statsGlobal = registrarJugadorGlobal(authIDMVP, nombreMVP);
        if (!statsGlobal) return;
        statsGlobal.mvps = (statsGlobal.mvps || 0) + 1;
        console.log(`🏆 MVP registrado para ${nombreMVP} en cancha válida (${mapaActual})`);
        
        // Opcional: aquí podríamos llevar un historial de MVPs si fuese necesario
    } catch (e) {
        console.error('❌ Error en procesarMVPPartido:', e);
    }
}

// Variables para cambio de camisetas (separado por equipos)
let cambiosCamisetaRed = 0;
let cambiosCamisetaBlue = 0;
let maxCambiosCamiseta = 4;

// Variables para rastrear camisetas actuales de cada equipo
let camisetaActualRed = null;
let camisetaActualBlue = null;

// Variables para contraseñas automáticas
let contraseñaActual = null;
let ultimoCambioContraseña = null;

// Variable para almacenar el enlace real de la sala
let enlaceRealSala = "https://www.haxball.com/play?c=abcd1234"; // Valor por defecto
let enlaceRealConfirmado = false; // Flag para indicar que el enlace real ya fue enviado exitosamente

// Variable para almacenar el ID del último mensaje enviado a Discord
let ultimoMensajeDiscordId = null;
// Objeto para almacenar IDs de diferentes tipos de mensajes de Discord
const MENSAJE_IDS_DISCORD = {
    reportesSala: null,    // ID del último mensaje de reportes de sala
    estadoSala: null,      // ID del último mensaje de estado de sala
    partidoReporte: null   // ID del último mensaje de reporte de partido
};

// Variable para controlar el throttling de reportes de sala
let ultimoReporteSala = 0;
const INTERVALO_MINIMO_REPORTE = 5000; // 5 segundos mínimo entre reportes
// Flag para controlar si el mapa inicial ya fue aplicado
let mapaInicialAplicado = false;
// WEBHOOK PARA INFORMES DE SALA (diferente al de reportes de partidos)
const discordWebhookUrl = "https://discord.com/api/webhooks/1389450191396143265/JxHRCmfNCFooAr3YjynXPmihlVSjnGw-FLql4VUHNUx15Yl8d8BipjaRd51uXpcXfiXv";

// WEBHOOK PARA NOTIFICACIONES DE BAN/KICK
const webhookBanKick = "https://discord.com/api/webhooks/1392211274888122529/c8c1N6c4pWCIL9WyO3GLOPafo_lcbl3ae1E6CoZc-hzVc54_za4yqdNg3wRLGFuTyDPm";

// WEBHOOK PARA LOGS DE SALIDAS (pedido del usuario)
const webhookLogsSalidas = "https://discord.com/api/webhooks/1411872670504587354/PnnoV1fg7V4FCK_oJTYORYK1MuJCZ9BBVvvhkDLeQX6tUrpCqeYZ0kHDItom915HReGk";

// Función para enviar reporte de SALIDA al webhook de logs de salidas
function enviarReporteSalidaDiscord({ nombre, authId, salaId, fechaHora, playerId }) {
    try {
        if (!webhookLogsSalidas) return;
        
        // El playerId ya se pasa como parámetro desde onPlayerLeave
        const playerIdFinal = playerId || 'N/D';
        
        // Formatear fecha según el formato solicitado: dd/mm/yyyy hh:mm:ss
        const fecha = new Date();
        const fechaFormateada = fecha.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
        }).replace(/\//g, '/') + ' ' + fecha.toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        // Usar nueva sintaxis solicitada
        const emoji = "<:biggerx7:1378054762137915482>";
        const contenido = `<:biggerx7:1378054762137915482> \`\`\`[🕒 ${fechaFormateada}] 👤 ${nombre} | 🆔 #${playerIdFinal} | 🔑 AuthID: ${authId || 'N/D'}\`\`\``;
        
        const payload = { content: contenido };
        fetch(webhookLogsSalidas, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => {});
    } catch (e) {
        // Silencioso para no romper el flujo de salida
    }
}

// Función throttle para limitar la frecuencia de ejecución
function throttle(func, delay) {
    let lastExecution = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastExecution >= delay) {
            lastExecution = now;
            func.apply(this, args);
        }
    };
}

// Cache para resultados de funciones costosas
const funcionesCache = new Map();

// Función para limpiar cache expirado
function limpiarCacheExpirado() {
    const ahora = Date.now();
    for (const [key, value] of funcionesCache.entries()) {
        if (ahora - value.timestamp > 30000) { // TTL de 30 segundos
            funcionesCache.delete(key);
        }
    }
}

// Función para cachear resultados con limpieza automática
function cache(func, cacheKey, ttl = 30000) {
    limpiarCacheExpirado(); // Limpiar antes de cachear
    const cached = funcionesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.result;
    }
    
    const result = func();
    funcionesCache.set(cacheKey, {
        result: result,
        timestamp: Date.now()
    });
    
    return result;
}

// SISTEMA DE GESTIÓN DE MEMORIA
function limpiarDatosExpirados() {
    const ahora = Date.now();
    
    // Limpiar cache de funciones expirado
    for (const [key, value] of funcionesCache.entries()) {
        if (ahora - value.timestamp > 300000) { // 5 minutos
            funcionesCache.delete(key);
        }
    }
    
    // Limpiar desafíos PPT expirados
    for (const [key, desafio] of desafiosPPT.entries()) {
        if (ahora - desafio.tiempoInicio > 60000) { // 1 minuto
            if (desafio.timeout) clearTimeout(desafio.timeout);
            desafiosPPT.delete(key);
        }
    }
    
    // Limpiar datos AFK de jugadores desconectados solo si room está disponible
    if (typeof room !== 'undefined' && room && room.getPlayerList) {
        const jugadoresActuales = new Set(room.getPlayerList().map(j => j.id));
        for (const [playerId] of jugadoresAFK.entries()) {
            if (!jugadoresActuales.has(playerId)) {
                jugadoresAFK.delete(playerId);
            }
        }
        
        // Limpiar advertencias AFK de jugadores desconectados
        for (const [playerId] of advertenciasAFK.entries()) {
            if (!jugadoresActuales.has(playerId)) {
                advertenciasAFK.delete(playerId);
            }
        }
    }
    
    // Limpiar mensajes personalizados antiguos (opcional, después de 24 horas sin uso)
    if (typeof room !== 'undefined' && room && room.getPlayerList) {
        const jugadoresActuales2 = new Set(room.getPlayerList().map(j => j.id));
        for (const [playerId, messages] of mensajesPersonalizados.entries()) {
            if (!jugadoresActuales2.has(playerId) && messages.ultimoUso && 
                ahora - messages.ultimoUso > 86400000) { // 24 horas
                mensajesPersonalizados.delete(playerId);
            }
        }
    }
    
    // Limitar tamaño de records de hat-tricks (mantener solo últimos 50)
    if (estadisticasGlobales.records.hatTricks.length > 50) {
        estadisticasGlobales.records.hatTricks = estadisticasGlobales.records.hatTricks
            .slice(-50);
    }
    
    // Limitar tamaño de records de vallas invictas (mantener solo últimos 50)
    if (estadisticasGlobales.records.vallasInvictas.length > 50) {
        estadisticasGlobales.records.vallasInvictas = estadisticasGlobales.records.vallasInvictas
            .slice(-50);
    }
}

// SISTEMA ANTI-SPAM MEJORADO
let spamControl = new Map(); // {playerID: {count, lastMessage, timestamp, warnings}}
let cooldownGlobal = new Map(); // {playerID: timestamp}
let jugadoresSilenciadosPorSpam = new Map(); // {playerID: {finSilencio: timestamp, razon: string}}

function verificarSpam(jugador, mensaje) {
    // EXCEPCIÓN PARA ADMINISTRADORES - Los admins no pueden ser silenciados por spam
    if (esAdminBasico(jugador)) {
        return false; // Los administradores están exentos del sistema anti-spam
    }
    
    const ahora = Date.now();
    const control = spamControl.get(jugador.id) || {
        count: 0, 
        lastMessage: '', 
        timestamp: 0, 
        warnings: 0,
        messageHistory: []
    };
    
    // Resetear contador si ha pasado tiempo suficiente (cambiar a 3 segundos)
    if (ahora - control.timestamp > 3000) {
        control.count = 0;
        control.warnings = 0;
        control.messageHistory = [];
    }
    
    // Agregar mensaje al historial
    control.messageHistory.push({mensaje, timestamp: ahora});
    if (control.messageHistory.length > 5) {
        control.messageHistory.shift(); // Mantener solo últimos 5 mensajes
    }
    
    // Contar mensajes en los últimos 3 segundos
    const mensajesEn3Segundos = control.messageHistory.filter(m => ahora - m.timestamp <= 3000);
    
    // Si hay 5 o más mensajes en 3 segundos, aplicar silencio
    if (mensajesEn3Segundos.length >= 5) {
        aplicarSilencioPorSpam(jugador, 30000, "Spam: 5+ mensajes en 3 segundos");
        spamControl.delete(jugador.id); // Limpiar control después del silencio
        return true;
    }
    
    // Verificar mensaje repetido exacto
    if (control.lastMessage === mensaje && ahora - control.timestamp < 2000) {
        control.count += 2; // Penalizar mensajes idénticos
        control.warnings++;
        
        if (control.warnings === 1) {
            // Mensaje de advertencia removido
        } else if (control.warnings >= 2) {
            anunciarAdvertencia("🚫 Último aviso por spam. Próxima infracción = silencio", jugador);
        }
    } else {
        control.count++;
    }
    
    // Verificar patrones de spam adicionales
    const mensajesRecientes = control.messageHistory.filter(m => ahora - m.timestamp < 10000);
    const mensajesCortos = mensajesRecientes.filter(m => m.mensaje.length < 3);
    
    // Penalizar mensajes muy cortos frecuentes
    if (mensajesCortos.length >= 3) {
        control.count += 2;
    }
    
    // Verificar flood de comandos
    const comandosRecientes = mensajesRecientes.filter(m => m.mensaje.startsWith('!'));
    if (comandosRecientes.length >= 4) {
        control.count += 2;
        anunciarAdvertencia("⚠️ Evita usar muchos comandos seguidos", jugador);
    }
    
    control.lastMessage = mensaje;
    control.timestamp = ahora;
    spamControl.set(jugador.id, control);
    
    return false; // No es spam
}

// Función para aplicar silencio por spam
function aplicarSilencioPorSpam(jugador, duracion, razon) {
    const finSilencio = Date.now() + duracion;
    
    // Registrar en el mapa de silenciados por spam
    jugadoresSilenciadosPorSpam.set(jugador.id, {
        finSilencio: finSilencio,
        razon: razon
    });
    
    const segundos = Math.floor(duracion / 1000);
    anunciarAdvertencia(`🔇 ${jugador.name} ha sido silenciado por ${segundos} segundos. Razón: ${razon}`);
    
    // Programar remoción automática del silencio
    setTimeout(() => {
        if (typeof room !== 'undefined' && room && room.getPlayerList) {
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            if (jugadorActual && jugadoresSilenciadosPorSpam.has(jugador.id)) {
                jugadoresSilenciadosPorSpam.delete(jugador.id);
                // Mensaje privado al jugador que fue desmutado
                room.sendAnnouncement("ℹ️ ✅ Finalizó tu muteo", jugador.id, parseInt(CELESTE_LNB, 16), "normal", 0);
            }
        }
    }, duracion);
}

// Función para verificar si un jugador está silenciado por spam
function estaSilenciadoPorSpam(jugador) {
    const silencio = jugadoresSilenciadosPorSpam.get(jugador.id);
    if (silencio && Date.now() < silencio.finSilencio) {
        const tiempoRestante = Math.ceil((silencio.finSilencio - Date.now()) / 1000);
        anunciarAdvertencia(`🔇 Estás silenciado por ${tiempoRestante} segundos más (${silencio.razon})`, jugador);
        return true;
    } else if (silencio) {
        // El silencio ha expirado, eliminarlo
        jugadoresSilenciadosPorSpam.delete(jugador.id);
    }
    return false;
}

// Función para verificar si un jugador está muteado por admin
function estaMuteadoPorAdmin(jugador) {
    // Verificar mute permanente
    if (jugadoresMuteados.has(jugador.id)) {
        anunciarAdvertencia(`🔇 Estás silenciado permanentemente. Contacta a un admin.`, jugador);
        return true;
    }
    
    // Verificar mute temporal
    const muteTemp = jugadoresMuteadosTemporales.get(jugador.id);
    if (muteTemp && Date.now() < muteTemp.finMute) {
        const tiempoRestante = Math.ceil((muteTemp.finMute - Date.now()) / (60 * 1000));
        anunciarAdvertencia(`🔇 Estás silenciado por ${tiempoRestante} minutos más (${muteTemp.razon})`, jugador);
        return true;
    } else if (muteTemp) {
        // El mute temporal ha expirado, eliminarlo
        clearTimeout(muteTemp.timeoutId);
        jugadoresMuteadosTemporales.delete(jugador.id);
    }
    
    return false;
}

// Función para verificar si un jugador está en timeout (mantenida para compatibilidad)
function estaEnTimeout(jugador) {
    const timeout = cooldownGlobal.get(jugador.id);
    if (timeout && Date.now() < timeout) {
        const tiempoRestante = Math.ceil((timeout - Date.now()) / 1000);
        anunciarAdvertencia(`⏰ Estás en timeout por ${tiempoRestante} segundos más`, jugador);
        return true;
    }
    return false;
}

// Función para limpiar datos de spam de jugadores desconectados
function limpiarDatosSpam() {
    if (typeof room === 'undefined' || !room || !room.getPlayerList) return;
    
    const jugadoresActuales = new Set(room.getPlayerList().map(j => j.id));
    
    for (const [playerId] of spamControl.entries()) {
        if (!jugadoresActuales.has(playerId)) {
            spamControl.delete(playerId);
        }
    }
    
    for (const [playerId] of cooldownGlobal.entries()) {
        if (!jugadoresActuales.has(playerId)) {
            cooldownGlobal.delete(playerId);
        }
    }
    
    for (const [playerId] of jugadoresSilenciadosPorSpam.entries()) {
        if (!jugadoresActuales.has(playerId)) {
            jugadoresSilenciadosPorSpam.delete(playerId);
        }
    }
    
    // Limpiar mutes temporales de jugadores desconectados
    for (const [playerId, muteData] of jugadoresMuteadosTemporales.entries()) {
        if (!jugadoresActuales.has(playerId)) {
            clearTimeout(muteData.timeoutId);
            jugadoresMuteadosTemporales.delete(playerId);
        }
    }
}

// POSICIONES AFK Y ESPERA
const posicionEsperando = {x: 0, y: 0};
const posicionAFK = {x: 200, y: 0};

// CONFIGURACIÓN DEL BOT
const adminPassword = "LnbAB17";
const duracionPartido = 3; // 3 minutos
const scoreLimitPartido = 3; // 3 goles
const guardarReplaysEnPC = false; // ❌ DESACTIVADO - No descargar replays automáticamente en PC
const guardarAmistosos = true;
const segundosMinimoPartido = 178; // 2 minutos 58 segundos para considerar válido
const enviarReplaysDiscord = true; // Enviar replays automáticamente a Discord
const guardarReplaysOficiales = true; // Guardar replays de partidos oficiales
const guardarReplaysAmistosos = true; // Guardar replays de partidos amistosos

// SISTEMA DE ROLES Y PERMISOS
const ROLES = {
    SUPER_ADMIN: {
        level: 4,
        nombre: "Super Administrador",
        color: "FF0000",
        permisos: ["*"], // Todos los permisos
        prefix: "👑"
    },
    ADMIN_FULL: {
        level: 3,
        nombre: "Admin Full",
        color: "FF6B6B",
        permisos: [
            "admin.claim", "admin.password", "admin.bans", 
            "admin.swap", "admin.pause", "admin.stop", "admin.autostart", 
            "admin.autostop", "admin.balance", "admin.replay_config", 
            "admin.kick", "admin.mute", "moderation.warn", "moderation.timeout"
        ],
        prefix: "🛡️"
    },
    ADMIN_BASICO: {
        level: 2,
        nombre: "Admin Básico",
        color: "FFA500",
        permisos: [
            "moderation.warn", "moderation.timeout", "moderation.mute", 
            "room.colors", "room.maps", "stats.view_all", "admin.kick"
        ],
        prefix: "⚖️"
    },
    VIP: {
        level: 1.5,
        nombre: "VIP",
        color: "FFD700",
        permisos: [
            "basic.stats", "basic.help", "basic.replay", "basic.chat", 
            "basic.team_chat", "basic.whisper", "basic.afk", "vip.commands", "vip.priority_join"
        ],
        prefix: "⭐"
    },
    PLAYER: {
        level: 1,
        nombre: "Jugador",
        color: "87CEEB",
        permisos: [
            "basic.stats", "basic.help", "basic.replay", "basic.chat", 
            "basic.team_chat", "basic.whisper", "basic.afk"
        ],
        prefix: ""
    }
};

const PERMISOS = {
    // Permisos de administración
    "admin.claim": "Reclamar administrador",
    "admin.password": "Gestionar contraseña de sala",
    "admin.bans": "Gestionar baneos",
    "admin.swap": "Intercambiar equipos",
    "admin.pause": "Pausar/reanudar partidos",
    "admin.stop": "Detener partidos",
    "admin.autostart": "Configurar auto-start",
    "admin.autostop": "Configurar auto-stop",
    "admin.balance": "Balance manual de equipos",
    "admin.replay_config": "Configurar sistema de replays",
    "admin.kick": "Expulsar jugadores",
    "admin.mute": "Silenciar jugadores",
    
    // Permisos de moderación
    "moderation.warn": "Advertir jugadores",
    "moderation.timeout": "Timeout temporal",
    "moderation.mute": "Silenciar temporalmente",
    
    // Permisos de sala
    "room.colors": "Cambiar colores de equipos",
    "room.maps": "Cambiar mapas",
    "room.priority_join": "Unirse con prioridad",
    
    // Permisos de estadísticas
    "stats.view_all": "Ver estadísticas de cualquier jugador",
    "stats.detailed": "Ver estadísticas detalladas",
    
    // Permisos de replay
    "replay.download": "Descargar replays",
    
    // Permisos de mensajes
    "messages.custom": "Mensajes personalizados",
    
    // Permisos básicos
    "basic.stats": "Ver estadísticas propias",
    "basic.help": "Ver ayuda",
    "basic.replay": "Ver enlace de replay",
    "basic.chat": "Chat público",
    "basic.team_chat": "Chat de equipo",
    "basic.whisper": "Mensajes privados",
    "basic.afk": "Comando AFK"
};

// Contraseñas para roles especiales
const ROLE_PASSWORDS = {
    SUPER_ADMIN: "1708CRL",
    ADMIN_FULL: "LnbAB17", 
    ADMIN_BASICO: "AdmBase2k251708"
};

// SISTEMA DE XP (EXPERIENCIA)
const XP_POR_ACCION = {
    gol: 10,
    asistencia: 5,
    victoria: 20,
    partido_completo: 5,
    hat_trick: 25,
    valla_invicta: 15
};

// ========== SISTEMA EXPONENCIAL DE NIVELES ==========
function calcularXPRequerida(nivel) {
    if (nivel <= 1) return 0;
    const base = 100;
    const multiplicador = 1.15; // 15% más difícil cada nivel
    return Math.floor(base * Math.pow(multiplicador, nivel - 2));
}

function calcularXPTotalParaNivel(nivel) {
    let total = 0;
    for (let i = 2; i <= nivel; i++) {
        total += calcularXPRequerida(i);
    }
    return total;
}

function calcularNivelPorXP(xpTotal) {
    if (xpTotal < 100) return 1;
    let nivel = 1;
    let xpAcumulada = 0;
    while (xpAcumulada <= xpTotal) {
        nivel++;
        const xpParaSiguienteNivel = calcularXPRequerida(nivel);
        if (xpAcumulada + xpParaSiguienteNivel > xpTotal) break;
        xpAcumulada += xpParaSiguienteNivel;
    }
    return nivel - 1;
}
// ====================================================

// Función para calcular y otorgar XP
// Variables para el sistema de guardado throttled
let timeoutGuardado = null;
let cambiosPendientes = false;

// Cache de mensajes personalizados para evitar consultas durante goles
let cacheMensajesPersonalizados = new Map(); // {authId: {gol: string, asistencia: string}}
let ultimaActualizacionCache = 0;

// Función para actualizar el cache de mensajes
function actualizarCacheMensajes() {
    const ahora = Date.now();
    // Actualizar cache solo cada 30 segundos
    if (ahora - ultimaActualizacionCache < 30000) {
        return;
    }
    
    ultimaActualizacionCache = ahora;
    const jugadores = room.getPlayerList();
    
    jugadores.forEach(jugador => {
        if (jugador.auth && obtenerMensajeFestejo) {
            try {
                const mensajeGol = obtenerMensajeFestejo(jugador.auth, 'gol');
                const mensajeAsistencia = obtenerMensajeFestejo(jugador.auth, 'asistencia');
                
                if (mensajeGol || mensajeAsistencia) {
                    cacheMensajesPersonalizados.set(jugador.auth, {
                        gol: mensajeGol,
                        asistencia: mensajeAsistencia
                    });
                }
            } catch (error) {
                // Error silencioso en cache
            }
        }
    });
}

// Función para obtener mensaje desde cache (rápido)
function obtenerMensajeDesdeCache(auth, tipo) {
    const cache = cacheMensajesPersonalizados.get(auth);
    return cache ? cache[tipo] : null;
}

// Función para programar guardado con throttle
function programarGuardadoThrottled() {
    cambiosPendientes = true;
    
    // Si ya hay un timeout programado, no crear otro
    if (timeoutGuardado) {
        return;
    }
    
    // Programar guardado después de 2 segundos de inactividad
    timeoutGuardado = setTimeout(() => {
        if (cambiosPendientes) {
            guardarEstadisticasGlobalesCompletas();
            cambiosPendientes = false;
        }
        timeoutGuardado = null;
    }, 2000);
}

// Heurística: ¿Podemos guardar ahora sin afectar el juego/conectividad?
let guardadoEnCurso = false;
function puedeGuardarAhora() {
    try {
        const jugadores = (typeof room !== 'undefined' && room && typeof room.getPlayerList === 'function') ? room.getPlayerList() : [];
        const enPartido = (typeof partidoEnCurso !== 'undefined') ? !!partidoEnCurso : false;
        // Guardar solo si no hay partido en curso y hay pocos jugadores (<= 2)
        return !guardadoEnCurso && !enPartido && jugadores.length <= 2;
    } catch (_) {
        return !guardadoEnCurso;
    }
}

// Sistema de guardado automático en lotes cada 30 segundos (idle saver)
let intervalGuardadoAutomatico = null;

function iniciarGuardadoAutomatico() {
    // Limpiar intervalo anterior si existe
    if (intervalGuardadoAutomatico) {
        clearInterval(intervalGuardadoAutomatico);
    }
    
    intervalGuardadoAutomatico = setInterval(() => {
        try {
            // Solo intentar guardar si hay cambios pendientes y estamos en condiciones "idle"
            if (cambiosPendientes && puedeGuardarAhora()) {
                guardarEstadisticasGlobalesCompletas();
                cambiosPendientes = false;
            }
        } catch (error) {
            console.error('❌ Error en guardado automático/idle:', error);
        }
        
        // LIMPIEZA DE MEMORIA: Limpiar Maps que pueden crecer indefinidamente
        limpiarMemoriaPeriodicamente();
        
    }, 30000); // Comprobar cada 30s para guardar en momentos "idle"
}

// FUNCIÓN DE LIMPIEZA PERIÓDICA DE MEMORIA
function limpiarMemoriaPeriodicamente() {
    try {
        // Limpiar cache de jugadores si es muy grande
        if (playerListCache && playerListCache.length > 20) {
            playerListCache = null;
        }
        
        // Limpiar advertencias AFK antiguas (más de 10 minutos)
        const ahora = Date.now();
        for (const [id, data] of advertenciasAFK.entries()) {
            if (ahora - data.timestamp > 600000) { // 10 minutos
                advertenciasAFK.delete(id);
            }
        }
        
        // Limpiar cooldowns de comandos antiguos
        for (const [key, timestamp] of comandoCooldown.entries()) {
            if (ahora - timestamp > 300000) { // 5 minutos
                comandoCooldown.delete(key);
            }
        }
        
        // Limpiar logs de spam control
        if (logSpamControl.size > 50) {
            logSpamControl.clear();
        }
        
        // Limpiar movimientos del bot antiguo
        if (movimientoIniciadorPorBot && movimientoIniciadorPorBot.size > 20) {
            movimientoIniciadorPorBot.clear();
        }
        
        // Limpieza de memoria completada silenciosamente
        
    } catch (error) {
        console.error('❌ Error en limpieza de memoria:', error);
    }
}

function otorgarXP(identificador, accion, cantidad = null) {
    // Verificar que estadisticasGlobales y jugadores existan
    if (!estadisticasGlobales || !estadisticasGlobales.jugadores) {
        console.error('❌ Error: estadisticasGlobales no inicializado en otorgarXP');
        return;
    }
    
    // Determinar authID y nombre a mostrar
    let authID = null;
    let nombreMostrar = null;
    
    if (identificador && typeof identificador === 'object' && 'id' in identificador) {
        // Objeto jugador de HaxBall
        authID = jugadoresUID.get(identificador.id) || null;
        nombreMostrar = obtenerNombreOriginal(identificador);
    } else if (typeof identificador === 'string') {
        // Buscar jugador conectado con ese nombre original
        const coincidencias = room.getPlayerList().filter(p => obtenerNombreOriginal(p) === identificador);
        if (coincidencias.length !== 1) {
            console.warn(`🚫 otorgarXP cancelado: ${coincidencias.length} coincidencias para nombre "${identificador}"`);
            return;
        }
        const jugador = coincidencias[0];
        authID = jugadoresUID.get(jugador.id) || null;
        nombreMostrar = identificador;
    } else if (typeof identificador === 'string' && identificador.length > 20) {
        // Podría ser un authID directamente
        authID = identificador;
        // Intentar obtener nombre desde memoria si está conectado
        const p = room.getPlayerList().find(p => jugadoresUID.get(p.id) === authID);
        nombreMostrar = p ? obtenerNombreOriginal(p) : 'Jugador';
    }
    
    if (!authID) {
        console.warn('🚫 otorgarXP cancelado: sin authID resoluble');
        return;
    }
    
    if (!estadisticasGlobales.jugadores[authID]) {
        registrarJugadorGlobal(authID, nombreMostrar);
    }
    
    const stats = estadisticasGlobales.jugadores[authID];
    if (!stats) {
        console.error(`❌ Error: No se pudo crear/obtener estadísticas para ${nombreJugador}`);
        return;
    }
    
    if (!stats.xp) stats.xp = 0;
    if (!stats.nivel) stats.nivel = 1;
    
    const xpGanada = cantidad || XP_POR_ACCION[accion] || 0;
    const xpAnterior = stats.xp;
    const nivelAnterior = stats.nivel;
    
    stats.xp += xpGanada;
    
    // Calcular nuevo nivel usando el sistema exponencial
    const nuevoNivel = calcularNivelPorXP(stats.xp);
    
    if (nuevoNivel > nivelAnterior) {
        stats.nivel = nuevoNivel;
        anunciarGeneral(`🎉 ¡${nombreJugador} subió a NIVEL ${nuevoNivel}!`, "FFD700", "bold");
        
        // Recompensas por subir de nivel
        if (nuevoNivel % 5 === 0) {
            anunciarGeneral(`👑 ¡${nombreJugador} alcanzó el NIVEL ${nuevoNivel}! ¡Felicitaciones!`, "FF6B6B", "bold");
        }
        
        // Actualizar nombre con nuevo nivel de forma asíncrona
        setTimeout(() => {
            actualizarTodosLosNombres();
        }, 1000);
    }
    
    // Usar guardado throttled en lugar de inmediato
    programarGuardadoThrottled();
}

// Función para calcular rango basado en XP
function calcularRango(xp) {
    if (xp >= 5000) return '🏆 Leyenda';
    if (xp >= 3000) return '💎 Diamante';
    if (xp >= 2000) return '🥇 Oro';
    if (xp >= 1000) return '🥈 Plata';
    if (xp >= 500) return '🥉 Bronce';
    if (xp >= 100) return '⚡ Hierro';
    return '🔰 Novato';
}

// Función para obtener emoji según el nivel
function obtenerEmojiNivel(nivel) {
    if (nivel >= 100) return '🐐'; // Cabra (nivel 100+)
    if (nivel >= 90) return '🌟'; // Estrella brillante (nivel 90-99)
    if (nivel >= 80) return '👑'; // Corona (nivel 80-89)
    if (nivel >= 70) return '💫'; // Estrella fugaz (nivel 70-79)
    if (nivel >= 60) return '⚡'; // Rayo (nivel 60-69)
    if (nivel >= 50) return '🧸'; // Osito de peluche (nivel 50-59)
    if (nivel >= 40) return '🏆'; // Trofeo (nivel 40-49)
    if (nivel >= 30) return '💎'; // Diamante (nivel 30-39)
    if (nivel >= 20) return '🚀'; // Cohete (nivel 20-29)
    if (nivel >= 10) return '🐣'; // Pollito (nivel 10-19)
    return '⭐'; // Estrella básica (nivel 1-9)
}

// Sistema para actualizar nombres con niveles
let nombresOriginales = new Map(); // {playerID: nombreOriginal}
let ultimaActualizacionNombres = 0;

// Función para obtener el nivel de un jugador
function obtenerNivelJugador(nombreJugador) {
    try {
        const jugador = room.getPlayerList().find(p => obtenerNombreOriginal(p) === nombreJugador);
        if (!jugador) return 1;
        const authID = jugadoresUID.get(jugador.id);
        if (!authID) return 1;
        const stats = estadisticasGlobales.jugadores[authID];
        if (!stats || !stats.xp) return 1;
        return stats.nivel || Math.floor(stats.xp / 100) + 1;
    } catch {
        return 1;
    }
}

// Función para actualizar el nombre de un jugador con su nivel
function actualizarNombreConNivel(jugador) {
    // NO cambiar avatar/nombre si el jugador es admin (cualquier nivel)
    // Los admins pueden elegir su propio avatar
    if (esAdminBasico(jugador)) {
        return;
    }
    
    // Guardar nombre original si no existe
    if (!nombresOriginales.has(jugador.id)) {
        nombresOriginales.set(jugador.id, jugador.name);
    }
    
    const nombreOriginal = nombresOriginales.get(jugador.id);
    
    // Solo actualizar si el nombre ha cambiado (mantener nombre original sin nivel)
    // COMENTADO: Los jugadores ahora pueden elegir su propio avatar también
    // if (jugador.name !== nombreOriginal) {
    //     try {
    //         room.setPlayerAvatar(jugador.id, nombreOriginal);
    //     } catch (error) {
    //         // No se pudo actualizar el nombre
    //     }
    // }
}

// Función para actualizar todos los nombres con niveles
function actualizarTodosLosNombres() {
    const ahora = Date.now();
    // Evitar actualizaciones muy frecuentes
    if (ahora - ultimaActualizacionNombres < 2000) return;
    
    ultimaActualizacionNombres = ahora;
    
    const jugadores = room.getPlayerList();
    jugadores.forEach(jugador => {
        actualizarNombreConNivel(jugador);
    });
}

// Función para obtener el nombre original de un jugador
function obtenerNombreOriginal(jugador) {
    return nombresOriginales.get(jugador.id) || jugador.name.replace(/^\[\d+\]\s/, '');
}

// Función para actualizar el nombre de un jugador con su rol
function actualizarNombreConRol(jugador) {
    try {
        const rolInfo = jugadoresConRoles.get(jugador.id);
        if (rolInfo && ROLES[rolInfo.role]) {
            const rol = ROLES[rolInfo.role];
            const nombreOriginal = obtenerNombreOriginal(jugador);
            const nuevoNombre = `${rol.prefix} ${nombreOriginal}`;
            
            // Solo actualizar si el nombre ha cambiado
            // NOTA: Los admins SÍ pueden tener su prefijo de rol actualizado
            if (jugador.name !== nuevoNombre) {
                room.setPlayerAvatar(jugador.id, nuevoNombre);
            }
        }
    } catch (error) {
        // Error al actualizar nombre con rol
    }
}

// Sistema de jugadores con roles
let jugadoresConRoles = new Map(); // {playerID: {role: "ADMIN", assignedBy: "SuperAdmin", timestamp: Date}}

// DISCORD WEBHOOK PARA REPORTES DE PARTIDOS Y REPLAYS
const discordWebhook = "https://discord.com/api/webhooks/1389450191396143265/JxHRCmfNCFooAr3YjynXPmihlVSjnGw-FLql4VUHNUx15Yl8d8BipjaRd51uXpcXfiXv";

// WEBHOOK PARA LLAMAR ADMIN
const webhookLlamarAdmin = "https://discord.com/api/webhooks/1389648292987666662/0fn4qY2ITwfTzKvPt19fC3MPUjXuxGZvJUZHLSVZ9l3lFQe2s2vt-crhx7DOT6ogx8aF";

// WEBHOOK PARA REPORTES DE SALA (ESTADO ACTUAL)
const webhookReportesSala = "https://discord.com/api/webhooks/1390368471577133187/-QKunqo71mOgK_op4dZxP4lK3HVA7Utqs9bFP5dRyyexKUdOUCSV573sz1eZvirS8JUA";
const webhookModeracion = "https://discord.com/api/webhooks/1392211274888122529/c8c1N6c4pWCIL9WyO3GLOPafo_lcbl3ae1E6CoZc-hzVc54_za4yqdNg3wRLGFuTyDPm";

// WEBHOOK PARA REPORTES DE PARTIDO OFICIAL

// SISTEMA DE COLORES CONSISTENTE LNB
const COLORES = {
    // Colores principales LNB
    PRIMARIO: "87CEEB",      // Celeste LNB principal
    SECUNDARIO: "87CEEB",    // Celeste LNB secundario
    
    // Colores de estado
    EXITO: "00FF00",         // Verde para éxitos
    ERROR: "FF0000",         // Rojo para errores
    ADVERTENCIA: "FFA500",   // Naranja para advertencias
    INFO: "87CEEB",          // Celeste para información
    
    // Colores especiales
    DORADO: "FFD700",        // Oro para destacados/premios
    PLATINO: "E5E4E2",       // Platino para elementos premium
    GRIS: "888888",          // Gris para mensajes secundarios
    ROSA: "FF69B4",          // Rosa para ship/diversión
    
    // Colores de equipos
    ROJO: "FF0000",          // Equipo rojo
    AZUL: "87CEEB",          // Equipo azul
    
    // Colores de chat
    CHAT_TEAM_ROJO: "FF6B6B", // Chat de equipo rojo (mismo color que el archivo de referencia)
    CHAT_TEAM_AZUL: "87CEEB", // Chat de equipo azul
    CHAT_PRIVADO: "FFD700",   // Mensajes privados
    CHAT_NIVEL: "FFFFFF",     // Color base para niveles
    
    // Colores de moderación
    TIMEOUT: "FF8C00",       // Color para timeouts
    MUTE: "696969",          // Color para silenciados
    BAN: "8B0000",           // Color para baneos
    
    // Colores de estadísticas
    STATS_HEADER: "87CEEB",  // Encabezados de stats
    STATS_VALOR: "87CEEB",   // Valores de stats
    RECORD: "FFD700",        // Récords
    
    // Transparente para casos especiales
    TRANSPARENTE: null
};

// Mantener compatibilidad con código existente
const AZUL_LNB = COLORES.PRIMARIO;
const CELESTE_LNB = COLORES.SECUNDARIO;

// MAPAS DE LNB
const mapas = {
    biggerx7: {
        nombre: "LNB Bigger x7",
        minJugadores: 10,
        maxJugadores: 14,
        hbs: `{

	"name" : "LNB Bigger x7",

	"width" : 1300,

	"height" : 670,

	"bg" : { "width" : 1150, "height" : 600, "kickOffRadius" : 180, "color" : "444444" },

	"vertexes" : [
		 { "x" : 0, "y" : 600, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		 { "x" : 0, "y" : -180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		 { "x" : 0, "y" : -600, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 1150, "y" : 320, "cMask" : [ ] },
		{ "x" : 840, "y" : 320, "cMask" : [ ] },
		{ "x" : 1150, "y" : -320, "cMask" : [ ] },
		{ "x" : 840, "y" : -320, "cMask" : [ ] },
		{ "x" : 1150, "y" : 180, "cMask" : [ ] },
		{ "x" : 1030, "y" : 180, "cMask" : [ ] },
		 { "x" : 1150, "y" : -180, "cMask" : [ ] },
		 { "x" : 1030, "y" : -180, "cMask" : [ ] },
		 { "x" : 840, "y" : -130, "cMask" : [ ] },
		 { "x" : 840, "y" : 130, "cMask" : [ ] },
		 { "x" : -1150, "y" : -320, "cMask" : [ ] },
		 { "x" : -840, "y" : -320, "cMask" : [ ] },
		{ "x" : -1150, "y" : 320, "cMask" : [ ] },
		{ "x" : -840, "y" : 320, "cMask" : [ ] },
		{ "x" : -1150, "y" : -180, "cMask" : [ ] },
		{ "x" : -1030, "y" : -180, "cMask" : [ ] },
		{ "x" : -1150, "y" : 180, "cMask" : [ ] },
		 { "x" : -1030, "y" : 180, "cMask" : [ ] },
		{ "x" : -840, "y" : 130, "cMask" : [ ] },
		 { "x" : -840, "y" : -130, "cMask" : [ ] },
		 { "x" : 935, "y" : 3, "cMask" : [ ] },
		 { "x" : 935, "y" : -3, "cMask" : [ ] },
		 { "x" : -935, "y" : 3, "cMask" : [ ] },
		 { "x" : -935, "y" : -3, "cMask" : [ ] },
		 { "x" : 0, "y" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "x" : 0, "y" : -180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		 { "x" : 0, "y" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		 { "x" : -1150, "y" : -130, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -1215, "y" : -80, "bCoef" : 0, "cMask" : ["ball" ] },
		 { "x" : -1150, "y" : 130, "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		 { "x" : -1215, "y" : 80, "bCoef" : 0, "cMask" : ["ball" ] },
		 { "x" : 1150, "y" : 130, "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		 { "x" : 1215, "y" : 80, "bCoef" : 0, "cMask" : ["ball" ] },
		 { "x" : 1150, "y" : -130, "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "x" : 1215, "y" : -80, "bCoef" : 0, "cMask" : ["ball" ] },
		 { "x" : -1150, "y" : 600, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		 { "x" : 1150, "y" : 600, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -1150, "y" : 130, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
	 { "x" : -1150, "y" : -600, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 1150, "y" : -600, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		 { "x" : 1150, "y" : -130, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		 { "x" : 1150, "y" : 130, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 1160, "y" : 130, "cMask" : ["ball" ], "cGroup" : ["ball" ] },
		 { "x" : -1160, "y" : 130, "cMask" : ["ball" ], "cGroup" : ["ball" ] },
		 { "x" : -1160, "y" : -130, "cMask" : ["ball" ], "cGroup" : ["ball" ] },
		{ "x" : 1160, "y" : -130, "cMask" : ["ball" ], "cGroup" : ["ball" ] },
		 { "x" : -1215, "y" : -3, "bCoef" : 0, "cMask" : ["ball" ] },
		 { "x" : -1215, "y" : 10, "bCoef" : 0, "cMask" : ["ball" ] },
		 { "x" : 1215, "y" : 10, "bCoef" : 0, "cMask" : ["ball" ] },
		 { "x" : 1215, "y" : -10, "bCoef" : 0, "cMask" : ["ball" ] },
		 { "x" : -1150, "y" : -130, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		 { "x" : 1150, "y" : 130 },
		 { "x" : 1150, "y" : -130 },
		 { "x" : 1150, "y" : 130, "cMask" : [ ] },
		 { "x" : 1150, "y" : -130, "cMask" : [ ] },
		 { "x" : 0, "y" : 180, "cMask" : [ ] },
		 { "x" : 0, "y" : -180, "cMask" : [ ] },
		 { "x" : 0, "y" : -670, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		 { "x" : 0, "y" : 670, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		 { "x" : 0, "y" : -180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		 { "x" : 0, "y" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		
		 { "x" : -0.16091272635117526, "y" : 106.34640929026283, "trait" : "line", "color" : "ffffff" },
		 { "x" : 97.77015892869004, "y" : 54.94996033655326, "trait" : "line", "color" : "ffffff" },
		{ "x" : 97.07561232120747, "y" : -73.54116204772068, "trait" : "line", "color" : "ffffff" },
		 { "x" : 74.85012088176549, "y" : -72.84661544023811, "trait" : "line", "color" : "ffffff" },
		 { "x" : 0.5336338811313858, "y" : -108.96303902933133, "trait" : "line", "color" : "ffffff" },
		{ "x" : -73.08830651202017, "y" : -73.54116204772068, "trait" : "line", "color" : "ffffff" },
		 { "x" : -96.70289116642726, "y" : -73.54116204772068, "trait" : "line", "color" : "ffffff" },
		 { "x" : -96.00834455894471, "y" : 55.644506944035825, "trait" : "line", "color" : "ffffff" },
		 { "x" : -0.16091272635117526, "y" : 98.70639660795466, "trait" : "line", "color" : "ffffff" },
		{ "x" : 90.13014624638186, "y" : 51.47722729914045, "trait" : "line", "color" : "ffffff" },
		 { "x" : 90.13014624638186, "y" : -66.59569597289506, "trait" : "line", "color" : "ffffff" },
		 { "x" : 73.46102766680038, "y" : -66.59569597289506, "trait" : "line", "color" : "ffffff" },
		 { "x" : 0.5336338811313858, "y" : -102.01757295450571, "trait" : "line", "color" : "ffffff" },
		 { "x" : -72.3937599045376, "y" : -66.59569597289506, "trait" : "line", "color" : "ffffff" },
		 { "x" : -89.75742509160165, "y" : -66.59569597289506, "trait" : "line", "color" : "ffffff" },
		 { "x" : -89.0628784841191, "y" : 50.78268069165789, "trait" : "line", "color" : "ffffff" },
		 { "x" : -76.56103954943298, "y" : -50.62112400079613, "trait" : "line", "color" : "0070d1" },
		 { "x" : -65.44829382971199, "y" : -56.177496860656625, "trait" : "line", "color" : "0070d1" },
		 { "x" : -65.44829382971199, "y" : 34.11356211207641, "trait" : "line", "color" : "0070d1" },
		 { "x" : -46.00098882020025, "y" : 43.14266800934972, "trait" : "line", "color" : "0070d1" },
		 { "x" : -45.3064422127177, "y" : 16.0553503175298, "trait" : "line", "color" : "0070d1" },
		 { "x" : -33.49914988551415, "y" : 16.749896925012365, "trait" : "line", "color" : "0070d1" },
		 { "x" : -33.49914988551415, "y" : 63.28451962634401, "trait" : "line", "color" : "0070d1" },
		{ "x" : -77.25558615691554, "y" : 41.059028186902026, "trait" : "line", "color" : "0070d1" },
		 { "x" : -25.859137203205965, "y" : -73.54116204772068, "trait" : "line", "color" : "0070d1" },
		{ "x" : -7.106378801176793, "y" : -81.87572133751141, "trait" : "line", "color" : "0070d1" },
		 { "x" : 10.25728638588725, "y" : -17.977433449115725, "trait" : "line", "color" : "0070d1" },
		 { "x" : 10.25728638588725, "y" : -81.87572133751141, "trait" : "line", "color" : "0070d1" },
		{ "x" : 24.148218535538486, "y" : -74.23570865520324, "trait" : "line", "color" : "0070d1" },
		{ "x" : 23.453671928055925, "y" : 68.8408924862045, "trait" : "line", "color" : "0070d1" },
		{ "x" : 10.25728638588725, "y" : 75.78635856103011, "trait" : "line", "color" : "0070d1" },
		{ "x" : 10.25728638588725, "y" : 30.6408290746636, "trait" : "line", "color" : "0070d1" },
		{ "x" : -11.968205053554724, "y" : -40.2029248885577, "trait" : "line", "color" : "0070d1" },
		{ "x" : -11.968205053554724, "y" : 75.78635856103011, "trait" : "line", "color" : "0070d1" },
		{ "x" : -25.859137203205965, "y" : 67.45179927123938, "trait" : "line", "color" : "0070d1" },
		 { "x" : 32.48277782532923, "y" : -72.15206883275555, "trait" : "line", "color" : "0070d1" },
		 { "x" : 72.76648105931781, "y" : -51.315670608278694, "trait" : "line", "color" : "0070d1" },
		 { "x" : 78.3228539191783, "y" : -39.508378281075146, "trait" : "line", "color" : "0070d1" },
		 { "x" : 77.62830731169574, "y" : -21.450166486528534, "trait" : "line", "color" : "0070d1" },
		 { "x" : 67.21010819945731, "y" : -8.25378094435986, "trait" : "line", "color" : "0070d1" },
		 { "x" : 78.3228539191783, "y" : 4.94260459780881, "trait" : "line", "color" : "0070d1" },
		 { "x" : 77.62830731169574, "y" : 35.50265532704152, "trait" : "line", "color" : "0070d1" },
		 { "x" : 71.37738784435268, "y" : 43.83721461683227, "trait" : "line", "color" : "0070d1" },
		 { "x" : 32.48277782532923, "y" : 64.67361284130912, "trait" : "line", "color" : "0070d1" },
		 { "x" : 47.06825658246302, "y" : -15.199247019185478, "trait" : "line", "color" : "0070d1" },
		 { "x" : 56.79190908721889, "y" : -15.199247019185478, "trait" : "line", "color" : "0070d1" },
		 { "x" : 65.8210149844922, "y" : -24.922899523941346, "trait" : "line", "color" : "0070d1" },
		 { "x" : 65.8210149844922, "y" : -36.730191851144895, "trait" : "line", "color" : "0070d1" },
		 { "x" : 60.95918873211426, "y" : -44.37020453345308, "trait" : "line", "color" : "0070d1" },
		 { "x" : 47.06825658246302, "y" : -51.315670608278694, "trait" : "line", "color" : "0070d1" },
		 { "x" : 45.6791633674979, "y" : 0.08077834543087903, "trait" : "line", "color" : "0070d1" },
		 { "x" : 58.18100230218401, "y" : 0.08077834543087903, "trait" : "line", "color" : "0070d1" },
		 { "x" : 65.8210149844922, "y" : 8.415337635221618, "trait" : "line", "color" : "0070d1" },
		 { "x" : 65.8210149844922, "y" : 28.557189252215913, "trait" : "line", "color" : "0070d1" },
		 { "x" : 61.65373533959682, "y" : 36.1972019345241, "trait" : "line", "color" : "0070d1" },
		 { "x" : 46.373709974980464, "y" : 43.14266800934972, "trait" : "line", "color" : "0070d1" },
		 { "x" : -73.20019266386399, "y" : 39.853967259395404, "trait" : "line" },
		 { "x" : -73.72607742958498, "y" : -51.198438208844244, "trait" : "line" },
		 { "x" : -68.88464583469232, "y" : 42.29567142246687, "trait" : "line" },
		 { "x" : -68.21066688450273, "y" : -54.11744615954227, "trait" : "line" },
		 { "x" : -71.3749309758582, "y" : 41.018458490899896, "trait" : "line" },
		 { "x" : -71.22023254454545, "y" : -51.9143938902841, "trait" : "line" },
		 { "x" : -74.88278878915264, "y" : 40.2185493469595, "trait" : "line" },
		 { "x" : -36.10935929876115, "y" : 59.40198468274805, "trait" : "line" },
		 { "x" : -67.44495459987579, "y" : 41.60070410665214, "trait" : "line" },
		 { "x" : -36.19801526163238, "y" : 54.56715733469955, "trait" : "line" },
		 { "x" : -35.65774637713042, "y" : 16.208066535059274, "trait" : "line" },
		 { "x" : -39.439628568644224, "y" : 54.02688845019758, "trait" : "line" },
		 { "x" : -37.27855303063632, "y" : 16.748335419561258, "trait" : "line" },
		 { "x" : -42.140972991154115, "y" : 55.64769510370351, "trait" : "line" },
		 { "x" : -39.43962856864425, "y" : 16.748335419561243, "trait" : "line" },
		 { "x" : -47.0033929516719, "y" : 54.02688845019759, "trait" : "line" },
		 { "x" : -43.221510760158054, "y" : 16.208066535059277, "trait" : "line" },
		 { "x" : -43.76177964466005, "y" : 54.02688845019759, "trait" : "line" },
		 { "x" : -68.61414833175093, "y" : 31.875864185616578, "trait" : "line" },
		 { "x" : -44.30204852916202, "y" : 48.08393072067585, "trait" : "line" },
		 { "x" : -72.39603052326476, "y" : 35.65774637713041, "trait" : "line" },
		 { "x" : -61.050383948723265, "y" : 40.52016633764819, "trait" : "line" },
		 { "x" : -68.61414833175093, "y" : 34.577208608126455, "trait" : "line" },
		 { "x" : -22.417324094397376, "y" : 68.4248837565368, "trait" : "line" },
		 { "x" : -22.656099083073315, "y" : -73.67793350740735, "trait" : "line" },
		 { "x" : -19.898640000257473, "y" : 70.65528244853897, "trait" : "line" },
		 { "x" : -20.218838782852174, "y" : -75.92043283933401, "trait" : "line" },
		 { "x" : -17.417365679654893, "y" : 71.46623970217384, "trait" : "line" },
		 { "x" : -18.013749224462828, "y" : -77.03838038187526, "trait" : "line" },
		 { "x" : -15.46975599671012, "y" : 72.64140975878486, "trait" : "line" },
		 { "x" : -16.304914530193997, "y" : -77.07579015541256, "trait" : "line" },
		 { "x" : -13.346090232239533, "y" : 73.86059383577734, "trait" : "line" },
		 { "x" : -16.537085272025763, "y" : -77.82952489497765, "trait" : "line" },
		 { "x" : 18.278898324776634, "y" : 37.25435175078734, "trait" : "line" },
		 { "x" : 21.307045776725353, "y" : -74.91471461740466, "trait" : "line" },
		 { "x" : 21.527115878632642, "y" : 69.72659948121185, "trait" : "line" },
		 { "x" : 19.836986071132443, "y" : -76.71818159928057, "trait" : "line" },
		 { "x" : 18.869785476504234, "y" : 70.38570193316988, "trait" : "line" },
		 { "x" : 18.909410957569165, "y" : -77.79871936828451, "trait" : "line" },
		 { "x" : 16.208066535059288, "y" : 70.77522386975882, "trait" : "line" },
		 { "x" : 17.288604304063256, "y" : -76.71818159928056, "trait" : "line" },
		 { "x" : 14.046990997051353, "y" : 73.47656829226871, "trait" : "line" },
		 { "x" : 16.20806653505926, "y" : -78.87925713728848, "trait" : "line" },
		 { "x" : 12.426184343545458, "y" : 74.55710606127266, "trait" : "line" },
		 { "x" : 14.587259881553337, "y" : -79.95979490629244, "trait" : "line" },
		 { "x" : 14.104907821469993, "y" : 20.167156920689756, "trait" : "line" },
		 { "x" : 12.032004165412815, "y" : -79.49300259008272, "trait" : "line" },
		 { "x" : 14.281251585371422, "y" : 20.976263602119914, "trait" : "line" },
		 { "x" : -7.683055752725693, "y" : -79.4869515785763, "trait" : "line" },
		 { "x" : 14.191350842990289, "y" : -0.6249830455918861, "trait" : "line" },
		 { "x" : -10.562472799567402, "y" : -80.20442865719492, "trait" : "line" },
		 { "x" : 14.64171898511114, "y" : 22.244382727822945, "trait" : "line" },
		 { "x" : -14.882895015152812, "y" : -78.49112797066226, "trait" : "line" },
		 { "x" : 14.28557373644746, "y" : 22.60830784842348, "trait" : "line" },
		 { "x" : -12.067445804236115, "y" : -78.42024469301559, "trait" : "line" },
		 { "x" : 14.531071917565129, "y" : 4.144078451683955, "trait" : "line" },
		 { "x" : -17.43123528957176, "y" : -68.97893788256667, "trait" : "line" },
		 { "x" : 11.918763807221154, "y" : 22.41381105000277, "trait" : "line" },
		 { "x" : -18.2420708314323, "y" : -54.666566809447914, "trait" : "line" },
		 { "x" : 3.8138661094763506, "y" : -12.077818966818565, "trait" : "line" },
		 { "x" : -23.201306976052834, "y" : -67.45235412251789, "trait" : "line" },
		 { "x" : 33.84244292520377, "y" : -71.76931861724246, "trait" : "line" },
		 { "x" : 35.00942371572802, "y" : 61.849981897786186, "trait" : "line" },
		 { "x" : 36.75989490151443, "y" : -68.26837624566966, "trait" : "line" },
		 { "x" : 37.343385296776574, "y" : 60.099510711999784, "trait" : "line" },
		 { "x" : 39.6773468778251, "y" : -67.1013954551454, "trait" : "line" },
		 { "x" : 40.260837273087226, "y" : 58.93252992147552, "trait" : "line" },
		 { "x" : 42.59479885413576, "y" : -65.35092426935898, "trait" : "line" },
		 { "x" : 43.178289249397906, "y" : 58.34903952621338, "trait" : "line" },
		 { "x" : 75.27026098881524, "y" : 38.51036608730084, "trait" : "line" },
		 { "x" : 76.43724177933952, "y" : 3.5009423715728047, "trait" : "line" },
		 { "x" : 71.76931861724248, "y" : 40.844327668349365, "trait" : "line" },
		 { "x" : 76.43724177933952, "y" : -7.105427357601002e-15, "trait" : "line" },
		 { "x" : 67.68488585040754, "y" : 44.34527003992217, "trait" : "line", "color" : "0070d1" },
		 { "x" : 73.51978980302889, "y" : -4.667923162097071, "trait" : "line", "color" : "0070d1" },
		 { "x" : 42.594798854135774, "y" : 0.5834903952621335, "trait" : "line", "color" : "0070d1" },
		 { "x" : 77.60422256986382, "y" : -29.758010158368823, "trait" : "line", "color" : "0070d1" },
		 { "x" : 68.85186664093179, "y" : -50.76366438780563, "trait" : "line", "color" : "0070d1" },
		 { "x" : 44.928760435184316, "y" : -1.1669807905242635, "trait" : "line", "color" : "0070d1" },
		 { "x" : 72.93629940776674, "y" : -49.59668359728137, "trait" : "line", "color" : "0070d1" },
		 { "x" : 43.76177964466004, "y" : -5.834903952621346, "trait" : "line", "color" : "0070d1" },
		 { "x" : 62.43347229304829, "y" : 45.51225083044645, "trait" : "line", "color" : "0070d1" },
		 { "x" : 42.01130845887366, "y" : 54.264606759378445, "trait" : "line", "color" : "0070d1" },
		 { "x" : 67.6848858504075, "y" : 40.844327668349365, "trait" : "line", "color" : "0070d1", "curve" : 0 },
		 { "x" : 60.099510711999784, "y" : -8.752355928932008, "trait" : "line", "curve" : 0 },
		 { "x" : 63.01696268831046, "y" : 44.9287604351843, "trait" : "line", "curve" : 0 },
		 { "x" : 61.84998189778618, "y" : -7.001884743145606, "trait" : "line", "curve" : 0 },
		 { "x" : 47.26272201623286, "y" : -53.68111636411631, "trait" : "line", "curve" : 0 },
		 { "x" : 41.42781806361151, "y" : -64.18394347883472, "trait" : "line", "curve" : 0 },
		 { "x" : 76.43724177933952, "y" : -37.926875692038706, "trait" : "line", "curve" : 0 },
		 { "x" : 43.76177964466004, "y" : -65.35092426935898, "trait" : "line", "curve" : 0 },
		 { "x" : 77.60422256986381, "y" : -37.926875692038706, "trait" : "line", "curve" : 0 },
		 { "x" : 42.594798854135774, "y" : -53.68111636411631, "trait" : "line", "curve" : 0 },
		 { "x" : 47.26272201623283, "y" : -60.09951071199979, "trait" : "line" },
		 { "x" : 71.76931861724248, "y" : -48.429702806757106, "trait" : "line" },
		 { "x" : 40.26083727308723, "y" : -10.50282711471841, "trait" : "line" },
		 { "x" : 39.093856482562956, "y" : -15.754240672077618, "trait" : "line" },
		 { "x" : 77.02073217460166, "y" : 2.9174519763106694, "trait" : "line", "curve" : 0 },
		 { "x" : 42.59479885413576, "y" : -16.921221462601878, "trait" : "line", "curve" : 0 },
		 { "x" : 40.26083727308726, "y" : 51.93064517832991, "trait" : "line", "curve" : 0 },
		 { "x" : 70.01884743145607, "y" : 32.09197173941736, "trait" : "line", "curve" : 0 },
		 { "x" : 37.926875692038706, "y" : 46.6792316209707, "trait" : "line", "curve" : 0 },
		{ "x" : 70.01884743145607, "y" : 27.424048577320285, "trait" : "line", "curve" : 0 },
		 { "x" : 36.17640450625228, "y" : 61.84998189778619, "trait" : "line", "curve" : 0 },
		 { "x" : 65.93441466462112, "y" : 39.09385648256297, "trait" : "line", "curve" : 0 },
		 { "x" : 65.35092426935898, "y" : -11.086317509980542, "trait" : "line" },
		 { "x" : 75.85375138407741, "y" : -49.59668359728136, "trait" : "line" },
		 { "x" : 42.594798854135774, "y" : -58.34903952621338, "trait" : "line" },
		 { "x" : 45.51225083044645, "y" : -12.253298300504802, "trait" : "line" },
		 { "x" : 66.9057260566766, "y" : -45.461583089793066, "trait" : "line" },
		{ "x" : 44.60381737111774, "y" : -61.33024888528688, "trait" : "line" },
		{ "x" : 44.17493451178008, "y" : -4.7177114527143775, "trait" : "line" },
		 { "x" : 70.76567179071563, "y" : -3.8599457340390346, "trait" : "line" },
		 { "x" : 49.321528823832125, "y" : -14.153134358143127, "trait" : "line" }

	],

	"segments" : [
		{ "v0" : 0, "v1" : 1, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 2, "v1" : 3, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 4, "v1" : 5, "cMask" : [ ] },
		{ "v0" : 5, "v1" : 7, "cMask" : [ ] },
		{ "v0" : 6, "v1" : 7, "cMask" : [ ] },
		{ "v0" : 8, "v1" : 9, "cMask" : [ ] },
		{ "v0" : 9, "v1" : 11, "cMask" : [ ] },
		{ "v0" : 10, "v1" : 11, "cMask" : [ ] },
		{ "v0" : 13, "v1" : 12, "curve" : 130, "cMask" : [ ], "curveF" : 0.4663076581549986 },
		{ "v0" : 14, "v1" : 15, "cMask" : [ ] },
		{ "v0" : 15, "v1" : 17, "cMask" : [ ] },
		{ "v0" : 16, "v1" : 17, "cMask" : [ ] },
		{ "v0" : 18, "v1" : 19, "cMask" : [ ] },
		{ "v0" : 19, "v1" : 21, "cMask" : [ ] },
		{ "v0" : 20, "v1" : 21, "cMask" : [ ] },
		{ "v0" : 23, "v1" : 22, "curve" : 130, "cMask" : [ ], "curveF" : 0.4663076581549986 },
		{ "v0" : 25, "v1" : 24, "curve" : 180, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 27, "v1" : 26, "curve" : 180, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 24, "v1" : 25, "curve" : 180, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 26, "v1" : 27, "curve" : 180, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 24, "v1" : 25, "curve" : 89.99999999999999, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 1.0000000000000002 },
		{ "v0" : 26, "v1" : 27, "curve" : 89.99999999999999, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 1.0000000000000002 },
		{ "v0" : 25, "v1" : 24, "curve" : 89.99999999999999, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 1.0000000000000002 },
		{ "v0" : 27, "v1" : 26, "curve" : 89.99999999999999, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 1.0000000000000002 },
		{ "v0" : 24, "v1" : 25, "color" : "C7E6BD", "cMask" : [ ] },
		{ "v0" : 26, "v1" : 27, "color" : "C7E6BD", "cMask" : [ ] },
		{ "v0" : 28, "v1" : 29, "curve" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 29, "v1" : 30, "curve" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 32, "v1" : 31, "curve" : 89.99999999999999, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 33, "v1" : 34, "curve" : 89.99999999999999, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 34, "v1" : 32, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "v0" : 36, "v1" : 35, "curve" : 89.99999999999999, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 37, "v1" : 38, "curve" : 89.99999999999999, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 36, "v1" : 38, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "v0" : 39, "v1" : 40, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : 60 },
		{ "v0" : 39, "v1" : 41, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -65 },
		{ "v0" : 31, "v1" : 42, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -65 },
		{ "v0" : 42, "v1" : 43, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -60 },
		{ "v0" : 43, "v1" : 44, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -65 },
		{ "v0" : 40, "v1" : 45, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : 65 },
		{ "v0" : 50, "v1" : 51, "color" : "000000", "bCoef" : 0, "cMask" : ["ball" ] },
		{ "v0" : 52, "v1" : 53, "color" : "000000", "bCoef" : 0, "cMask" : ["ball" ] },
		{ "v0" : 41, "v1" : 54, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "v0" : 57, "v1" : 58, "cMask" : [ ] },
		{ "v0" : 3, "v1" : 61, "vis" : false, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 0, "v1" : 62, "vis" : false, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		
		{ "v0" : 65, "v1" : 66, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 66, "v1" : 67, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 67, "v1" : 68, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 68, "v1" : 69, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 69, "v1" : 70, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 70, "v1" : 71, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 71, "v1" : 72, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 72, "v1" : 65, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 73, "v1" : 74, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 74, "v1" : 75, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 75, "v1" : 76, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 76, "v1" : 77, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 77, "v1" : 78, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 78, "v1" : 79, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 79, "v1" : 80, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 80, "v1" : 73, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 81, "v1" : 82, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 82, "v1" : 83, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 83, "v1" : 84, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 84, "v1" : 85, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 85, "v1" : 86, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 86, "v1" : 87, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 87, "v1" : 88, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 88, "v1" : 81, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 89, "v1" : 90, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 90, "v1" : 91, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 91, "v1" : 92, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 92, "v1" : 93, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 93, "v1" : 94, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 94, "v1" : 95, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 95, "v1" : 96, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 96, "v1" : 97, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 97, "v1" : 98, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 98, "v1" : 99, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 99, "v1" : 89, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 100, "v1" : 101, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 101, "v1" : 102, "curve" : 58.58272434196851, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 102, "v1" : 103, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 103, "v1" : 104, "curve" : 62.85913122967704, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 104, "v1" : 105, "curve" : 68.76068944768971, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 105, "v1" : 106, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 106, "v1" : 107, "curve" : 77.03385261420553, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 107, "v1" : 108, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 108, "v1" : 100, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 109, "v1" : 110, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 110, "v1" : 111, "curve" : -71.07535558394879, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 111, "v1" : 112, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 112, "v1" : 113, "curve" : -67.38013505195958, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 113, "v1" : 114, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 114, "v1" : 109, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 115, "v1" : 116, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 116, "v1" : 117, "curve" : 73.73979529168805, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 117, "v1" : 118, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 118, "v1" : 119, "curve" : 73.73979529168803, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 119, "v1" : 120, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 120, "v1" : 115, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 88, "v1" : 82, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 83, "v1" : 81, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 84, "v1" : 87, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 87, "v1" : 85, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 86, "v1" : 84, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 88, "v1" : 84, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 81, "v1" : 121, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 121, "v1" : 122, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 122, "v1" : 123, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 123, "v1" : 124, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 124, "v1" : 125, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 125, "v1" : 126, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 126, "v1" : 127, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 127, "v1" : 128, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 128, "v1" : 129, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 129, "v1" : 130, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 130, "v1" : 131, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 131, "v1" : 132, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 132, "v1" : 133, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 133, "v1" : 134, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 134, "v1" : 135, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 135, "v1" : 136, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 136, "v1" : 137, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 137, "v1" : 138, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 138, "v1" : 139, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 139, "v1" : 140, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 140, "v1" : 141, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 141, "v1" : 142, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 142, "v1" : 143, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 99, "v1" : 97, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 97, "v1" : 91, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 91, "v1" : 89, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 89, "v1" : 97, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 97, "v1" : 90, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 90, "v1" : 96, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 96, "v1" : 93, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 93, "v1" : 95, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 94, "v1" : 91, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 89, "v1" : 144, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 144, "v1" : 145, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 145, "v1" : 146, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 146, "v1" : 147, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 147, "v1" : 148, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 148, "v1" : 149, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 149, "v1" : 150, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 150, "v1" : 151, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 151, "v1" : 152, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 152, "v1" : 153, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 153, "v1" : 154, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 154, "v1" : 155, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 155, "v1" : 156, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 156, "v1" : 157, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 157, "v1" : 158, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 158, "v1" : 159, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 159, "v1" : 160, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 160, "v1" : 161, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 161, "v1" : 162, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 162, "v1" : 163, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 163, "v1" : 164, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 164, "v1" : 165, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 165, "v1" : 166, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 166, "v1" : 167, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 167, "v1" : 168, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 168, "v1" : 169, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 169, "v1" : 170, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 170, "v1" : 171, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 171, "v1" : 172, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 172, "v1" : 173, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 173, "v1" : 174, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 174, "v1" : 175, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 175, "v1" : 176, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 176, "v1" : 177, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 177, "v1" : 178, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 178, "v1" : 179, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 179, "v1" : 180, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 180, "v1" : 181, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 108, "v1" : 114, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 114, "v1" : 100, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 114, "v1" : 101, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 101, "v1" : 112, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 112, "v1" : 102, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 102, "v1" : 111, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 111, "v1" : 103, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 111, "v1" : 101, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 101, "v1" : 104, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 104, "v1" : 110, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 110, "v1" : 116, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 116, "v1" : 105, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 105, "v1" : 117, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 117, "v1" : 106, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 106, "v1" : 118, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 118, "v1" : 107, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 107, "v1" : 120, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 120, "v1" : 100, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 100, "v1" : 109, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 109, "v1" : 115, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 115, "v1" : 110, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 108, "v1" : 182, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 182, "v1" : 183, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 183, "v1" : 184, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 184, "v1" : 185, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 185, "v1" : 186, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 186, "v1" : 187, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 187, "v1" : 188, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 188, "v1" : 189, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 189, "v1" : 190, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 190, "v1" : 191, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 191, "v1" : 192, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 192, "v1" : 193, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 193, "v1" : 194, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 194, "v1" : 195, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 195, "v1" : 196, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 196, "v1" : 197, "curve" : -78.01125795896596, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 197, "v1" : 198, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 198, "v1" : 199, "curve" : 122.06595941822708, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 199, "v1" : 200, "curve" : -86.13882511766587, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 200, "v1" : 201, "curve" : 97.08953291118974, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 201, "v1" : 202, "curve" : 145.02983571516123, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 202, "v1" : 203, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 203, "v1" : 204, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 204, "v1" : 205, "curve" : -49.420603834635095, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 205, "v1" : 206, "curve" : 53.014703038658844, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 206, "v1" : 207, "curve" : -89.9999999999999, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 207, "v1" : 208, "curve" : -145.00048688191518, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 208, "v1" : 209, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 209, "v1" : 210, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 210, "v1" : 211, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 211, "v1" : 212, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 212, "v1" : 213, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 213, "v1" : 214, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 214, "v1" : 215, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 215, "v1" : 216, "curve" : 122.91265944406533, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 216, "v1" : 217, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 217, "v1" : 218, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 218, "v1" : 219, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 219, "v1" : 220, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 220, "v1" : 221, "curve" : -24.42551709088418, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 221, "v1" : 222, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 222, "v1" : 223, "curve" : -72.45176457002817, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 223, "v1" : 224, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 224, "v1" : 225, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 225, "v1" : 226, "curve" : -45.88781781879237, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 226, "v1" : 227, "curve" : -33.839081845799754, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 227, "v1" : 228, "curve" : 41.11209043916688, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 228, "v1" : 229, "curve" : -72.45176457002817, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 213, "v1" : 230, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 230, "v1" : 231, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 231, "v1" : 232, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 232, "v1" : 233, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 233, "v1" : 234, "color" : "0070d1", "trait" : "line" }

	],

	"planes" : [
		{ "normal" : [0,1 ], "dist" : -670, "bCoef" : 0 },
		{ "normal" : [1,0 ], "dist" : -1300, "bCoef" : 0 },
		{ "normal" : [-1,0 ], "dist" : -1300, "bCoef" : 0 }

	],

	"goals" : [
		{ "p0" : [-1161.3,130 ], "p1" : [-1161.3,-130 ], "team" : "red" },
		{ "p0" : [1161.3,130 ], "p1" : [1161.3,-130 ], "team" : "blue" }

	],

	"discs" : [
		{ "radius" : 8.75, "invMass" : 1.11, "pos" : [0,0 ], "color" : "FFFFFF", "cGroup" : ["ball","kick","score" ], "damping" : 0.991 },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [-5,-1 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [5,-1 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [0,-5 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [-3,4 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [3,4 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [0,0 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		



		{ "radius" : 0, "invMass" : 0, "pos" : [-1311,-19 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["red" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1310,29 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1308,62 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["red","blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [-1150,130 ], "color" : "e56e56", "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [1150,-130 ], "color" : "5689e5", "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [1150,130 ], "color" : "5689e5", "cGroup" : ["ball" ] },
		{ "radius" : 0, "pos" : [-1149,-485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,-485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1150,-130 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1149,485 ], "cMask" : [ ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [-1150,-130 ], "color" : "e56e56", "cGroup" : ["ball" ] },
		{ "radius" : 2.003390790792821, "pos" : [-0.3579305730959277,599.1800461283714 ], "color" : "5689e5", "cMask" : [ ] }

	],

	"playerPhysics" : {
		"bCoef" : 0.4,
		"damping" : 0.9605,
		"acceleration" : 0.12,
		"kickStrength" : 5.75,
		"cGroup" : [ "red", "blue"
		]

	},

	"ballPhysics" : "disc0",

	"spawnDistance" : 600,

	"traits" : {
		"line" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["" ] }

	},



	"redSpawnPoints" : [
		

	],

	"blueSpawnPoints" : [
		

	],



"joints":[{"d0":0,"d1":1,"length":5.0990195135927845,"color":"transparent"},
{"d0":0,"d1":2,"length":5.0990195135927845,"color":"transparent"},
{"d0":0,"d1":3,"length":5,"color":"transparent"},
{"d0":0,"d1":4,"length":5,"color":"transparent"},
{"d0":0,"d1":5,"length":5,"color":"transparent"},
{"d0":0,"d1":6,"length":0,"color":"transparent"},
{"d0":1,"d1":2,"length":10,"color":"transparent"},
{"d0":1,"d1":3,"length":6.4031242374328485,"color":"transparent"},
{"d0":1,"d1":4,"length":5.385164807134504,"color":"transparent"},
{"d0":1,"d1":5,"length":9.433981132056603,"color":"transparent"},
{"d0":1,"d1":6,"length":5.0990195135927845,"color":"transparent"},
{"d0":2,"d1":3,"length":6.4031242374328485,"color":"transparent"},
{"d0":2,"d1":4,"length":9.433981132056603,"color":"transparent"},
{"d0":2,"d1":5,"length":5.385164807134504,"color":"transparent"},
{"d0":2,"d1":6,"length":5.0990195135927845,"color":"transparent"},
{"d0":3,"d1":4,"length":9.486832980505138,"color":"transparent"},
{"d0":3,"d1":5,"length":9.486832980505138,"color":"transparent"},
{"d0":3,"d1":6,"length":5,"color":"transparent"},
{"d0":4,"d1":5,"length":6,"color":"transparent"},
{"d0":4,"d1":6,"length":5,"color":"transparent"},
{"d0":5,"d1":6,"length":5,"color":"transparent"}],

	"canBeStored" : false
}
`
    },
    biggerx5: {
        nombre: "LNB Bigger x4",
        minJugadores: 5,
        maxJugadores: 10,
        hbs: `{

	"name" : "LNB Bigger x4",

	"width" : 870,

	"height" : 445,

	"bg" : { "width" : 750, "height" : 400, "kickOffRadius" : 180, "color" : "444444" },

	"vertexes" : [
		{ "x" : 0, "y" : 400, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : 120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : -120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : -400, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 750, "y" : 215, "cMask" : [ ] },
		{ "x" : 560, "y" : 215, "cMask" : [ ] },
		{ "x" : 750, "y" : -215, "cMask" : [ ] },
		{ "x" : 560, "y" : -215, "cMask" : [ ] },
		{ "x" : 750, "y" : 140, "cMask" : [ ] },
		{ "x" : 665, "y" : 140, "cMask" : [ ] },
		{ "x" : 750, "y" : -140, "cMask" : [ ] },
		{ "x" : 665, "y" : -140, "cMask" : [ ] },
		{ "x" : 560, "y" : -130, "cMask" : [ ] },
		{ "x" : 560, "y" : 130, "cMask" : [ ] },
		{ "x" : -750, "y" : -215, "cMask" : [ ] },
		{ "x" : -560, "y" : -215, "cMask" : [ ] },
		{ "x" : -750, "y" : 215, "cMask" : [ ] },
		{ "x" : -560, "y" : 215, "cMask" : [ ] },
		{ "x" : -750, "y" : -140, "cMask" : [ ] },
		{ "x" : -665, "y" : -140, "cMask" : [ ] },
		{ "x" : -750, "y" : 140, "cMask" : [ ] },
		{ "x" : -665, "y" : 140, "cMask" : [ ] },
		{ "x" : -560, "y" : 130, "cMask" : [ ] },
		{ "x" : -560, "y" : -130, "cMask" : [ ] },
		{ "x" : 615, "y" : 3, "cMask" : [ ] },
		{ "x" : 615, "y" : -3, "cMask" : [ ] },
		{ "x" : -615, "y" : 3, "cMask" : [ ] },
		{ "x" : -615, "y" : -3, "cMask" : [ ] },
		{ "x" : 0, "y" : 120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "x" : 0, "y" : -120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "x" : 0, "y" : 120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "x" : -750, "y" : -100, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "color" : "000000" },
		{ "x" : -805, "y" : -70, "bCoef" : 0, "cMask" : ["ball" ], "color" : "000000" },
		{ "x" : -750, "y" : 100, "bCoef" : 0, "cMask" : ["red","blue","ball" ], "color" : "000000" },
		{ "x" : -805, "y" : 70, "bCoef" : 0, "cMask" : ["ball" ], "color" : "000000" },
		{ "x" : 750, "y" : 100, "bCoef" : 0, "cMask" : ["red","blue","ball" ], "color" : "000000" },
		{ "x" : 805, "y" : 70, "bCoef" : 0, "cMask" : ["ball" ], "color" : "000000" },
		{ "x" : 750, "y" : -100, "bCoef" : 0, "cMask" : ["red","blue","ball" ], "color" : "000000" },
		{ "x" : 805, "y" : -70, "bCoef" : 0, "cMask" : ["ball" ], "color" : "000000" },
		{ "x" : -750, "y" : 400, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 750, "y" : 400, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -750, "y" : 100, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -750, "y" : -400, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 750, "y" : -400, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 750, "y" : -100, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 750, "y" : 100, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -805, "y" : -10, "bCoef" : 0, "cMask" : ["ball" ], "color" : "000000" },
		{ "x" : -805, "y" : 10, "bCoef" : 0, "cMask" : ["ball" ], "color" : "000000" },
		{ "x" : 805, "y" : 10, "bCoef" : 0, "cMask" : ["ball" ], "color" : "000000" },
		{ "x" : 805, "y" : -10, "bCoef" : 0, "cMask" : ["ball" ], "color" : "000000" },
		{ "x" : -750, "y" : -100, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "x" : 750, "y" : 100, "cMask" : [ ] },
		{ "x" : 750, "y" : -100, "cMask" : [ ] },
		{ "x" : 0, "y" : 120, "cMask" : [ ] },
		{ "x" : 0, "y" : -120, "cMask" : [ ] },
		{ "x" : 0, "y" : -445, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : 445, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : -120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : 120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		
		{ "x" : -0.10592225218889376, "y" : 70.00348225809711, "trait" : "line", "color" : "ffffff" },
		{ "x" : 64.35808817254119, "y" : 36.17130657419622, "trait" : "line", "color" : "ffffff" },
		{ "x" : 63.90089660924522, "y" : -48.409132635556006, "trait" : "line", "color" : "ffffff" },
		{ "x" : 49.27076658377456, "y" : -47.95194107226005, "trait" : "line", "color" : "ffffff" },
		{ "x" : 0.3512693111070637, "y" : -71.72590236364987, "trait" : "line", "color" : "ffffff" },
		{ "x" : -48.11103639826448, "y" : -48.409132635556006, "trait" : "line", "color" : "ffffff" },
		{ "x" : -63.65554955032705, "y" : -48.409132635556006, "trait" : "line", "color" : "ffffff" },
		{ "x" : -63.1983579870311, "y" : 36.62849813749218, "trait" : "line", "color" : "ffffff" },
		{ "x" : -0.10592225218889376, "y" : 64.97437506184157, "trait" : "line", "color" : "ffffff" },
		{ "x" : 59.32898097628564, "y" : 33.88534875771643, "trait" : "line", "color" : "ffffff" },
		{ "x" : 59.32898097628564, "y" : -43.837217002596425, "trait" : "line", "color" : "ffffff" },
		{ "x" : 48.35638345718265, "y" : -43.837217002596425, "trait" : "line", "color" : "ffffff" },
		{ "x" : 0.3512693111070637, "y" : -67.15398673069028, "trait" : "line", "color" : "ffffff" },
		{ "x" : -47.653844834968524, "y" : -43.837217002596425, "trait" : "line", "color" : "ffffff" },
		{ "x" : -59.08363391736747, "y" : -43.837217002596425, "trait" : "line", "color" : "ffffff" },
		{ "x" : -58.62644235407152, "y" : 33.42815719442047, "trait" : "line", "color" : "ffffff" },
		{ "x" : -50.396994214744275, "y" : -33.321811046789385, "trait" : "line", "color" : "0070d1" },
		{ "x" : -43.08192920200894, "y" : -36.97934355315705, "trait" : "line", "color" : "0070d1" },
		{ "x" : -43.08192920200894, "y" : 22.455559675317485, "trait" : "line", "color" : "0070d1" },
		{ "x" : -30.280565429722117, "y" : 28.39904999816494, "trait" : "line", "color" : "0070d1" },
		{ "x" : -29.823373866426167, "y" : 10.568579029622576, "trait" : "line", "color" : "0070d1" },
		{ "x" : -22.05111729039488, "y" : 11.025770592918535, "trait" : "line", "color" : "0070d1" },
		{ "x" : -22.05111729039488, "y" : 41.65760533374772, "trait" : "line", "color" : "0070d1" },
		{ "x" : -50.85418577804023, "y" : 27.02747530827706, "trait" : "line", "color" : "0070d1" },
		{ "x" : -17.02201009413934, "y" : -48.409132635556006, "trait" : "line", "color" : "0070d1" },
		{ "x" : -4.677837885148473, "y" : -53.895431395107494, "trait" : "line", "color" : "0070d1" },
		{ "x" : 6.751951197250475, "y" : -11.833807571879364, "trait" : "line", "color" : "0070d1" },
		{ "x" : 6.751951197250475, "y" : -53.895431395107494, "trait" : "line", "color" : "0070d1" },
		{ "x" : 15.895782463169635, "y" : -48.86632419885196, "trait" : "line", "color" : "0070d1" },
		{ "x" : 15.438590899873677, "y" : 45.31513784011538, "trait" : "line", "color" : "0070d1" },
		{ "x" : 6.751951197250475, "y" : 49.88705347307496, "trait" : "line", "color" : "0070d1" },
		{ "x" : 6.751951197250475, "y" : 20.169601858837694, "trait" : "line", "color" : "0070d1" },
		{ "x" : -7.878178828220179, "y" : -26.463937597350018, "trait" : "line", "color" : "0070d1" },
		{ "x" : -7.878178828220179, "y" : 49.88705347307496, "trait" : "line", "color" : "0070d1" },
		{ "x" : -17.02201009413934, "y" : 44.40075471352347, "trait" : "line", "color" : "0070d1" },
		{ "x" : 21.38208122272113, "y" : -47.494749508964084, "trait" : "line", "color" : "0070d1" },
		{ "x" : 47.899191893886695, "y" : -33.77900261008535, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.55672440025435, "y" : -26.006746034054064, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.099532836958396, "y" : -14.119765388359154, "trait" : "line", "color" : "0070d1" },
		{ "x" : 44.24165938751902, "y" : -5.433125685735952, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.55672440025435, "y" : 3.2535140168872467, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.099532836958396, "y" : 23.369942801909392, "trait" : "line", "color" : "0070d1" },
		{ "x" : 46.98480876729477, "y" : 28.856241561460894, "trait" : "line", "color" : "0070d1" },
		{ "x" : 21.38208122272113, "y" : 42.57198846033963, "trait" : "line", "color" : "0070d1" },
		{ "x" : 30.983104051936245, "y" : -10.005041318695532, "trait" : "line", "color" : "0070d1" },
		{ "x" : 37.38378593807966, "y" : -10.005041318695532, "trait" : "line", "color" : "0070d1" },
		{ "x" : 43.327276260927114, "y" : -16.405723204838946, "trait" : "line", "color" : "0070d1" },
		{ "x" : 43.327276260927114, "y" : -24.17797978087023, "trait" : "line", "color" : "0070d1" },
		{ "x" : 40.126935317855406, "y" : -29.20708697712577, "trait" : "line", "color" : "0070d1" },
		{ "x" : 30.983104051936245, "y" : -33.77900261008535, "trait" : "line", "color" : "0070d1" },
		{ "x" : 30.06872092534433, "y" : 0.053173073815541934, "trait" : "line", "color" : "0070d1" },
		{ "x" : 38.298169064671576, "y" : 0.053173073815541934, "trait" : "line", "color" : "0070d1" },
		{ "x" : 43.327276260927114, "y" : 5.5394718333670365, "trait" : "line", "color" : "0070d1" },
		{ "x" : 43.327276260927114, "y" : 18.79802716894982, "trait" : "line", "color" : "0070d1" },
		{ "x" : 40.58412688115136, "y" : 23.827134365205364, "trait" : "line", "color" : "0070d1" },
		{ "x" : 30.52591248864029, "y" : 28.39904999816494, "trait" : "line", "color" : "0070d1" },
		{ "x" : -48.18468646597996, "y" : 26.23423309331532, "trait" : "line" },
		{ "x" : -48.530854852036825, "y" : -33.70183332671552, "trait" : "line" },
		{ "x" : -45.34393887604166, "y" : 27.841506862122724, "trait" : "line" },
		{ "x" : -44.900286158504656, "y" : -35.62329661496068, "trait" : "line" },
		{ "x" : -46.98319151146816, "y" : 27.00076994028904, "trait" : "line" },
		{ "x" : -46.881359874988554, "y" : -34.173117605872164, "trait" : "line" },
		{ "x" : -49.29227052819965, "y" : 26.47422253789312, "trait" : "line" },
		{ "x" : -23.76931115861874, "y" : 39.10189171958485, "trait" : "line" },
		{ "x" : -44.39624914691749, "y" : 27.384038363775893, "trait" : "line" },
		{ "x" : -23.827669745103698, "y" : 35.919323048589156, "trait" : "line" },
		{ "x" : -23.472032883236494, "y" : 10.669105856016582, "trait" : "line" },
		{ "x" : -25.96149091630701, "y" : 35.56368618672194, "trait" : "line" },
		{ "x" : -24.53894346883813, "y" : 11.024742717883806, "trait" : "line" },
		{ "x" : -27.739675225643115, "y" : 36.6305967723236, "trait" : "line" },
		{ "x" : -25.961490916307028, "y" : 11.024742717883797, "trait" : "line" },
		{ "x" : -30.94040698244809, "y" : 35.563686186721945, "trait" : "line" },
		{ "x" : -28.450948949377544, "y" : 10.669105856016584, "trait" : "line" },
		{ "x" : -28.80658581124478, "y" : 35.563686186721945, "trait" : "line" },
		{ "x" : -45.16588145713686, "y" : 20.98257485016595, "trait" : "line" },
		{ "x" : -29.162222673111994, "y" : 31.65168070618253, "trait" : "line" },
		{ "x" : -47.655339490207396, "y" : 23.472032883236484, "trait" : "line" },
		{ "x" : -40.186965390995795, "y" : 26.67276464004146, "trait" : "line" },
		{ "x" : -45.16588145713686, "y" : 22.760759159502044, "trait" : "line" },
		{ "x" : -14.75640559929883, "y" : 45.04129634494068, "trait" : "line" },
		{ "x" : -14.913581387320324, "y" : -48.499163681413485, "trait" : "line" },
		{ "x" : -13.09845909715945, "y" : 46.50947638323326, "trait" : "line" },
		{ "x" : -13.309232831280108, "y" : -49.975309074981524, "trait" : "line" },
		{ "x" : -11.465137915569931, "y" : 47.043296303395834, "trait" : "line" },
		{ "x" : -11.857712758261926, "y" : -50.711208119265805, "trait" : "line" },
		{ "x" : -10.183106290848157, "y" : 47.816862583228364, "trait" : "line" },
		{ "x" : -10.732856921561647, "y" : -50.73583343981566, "trait" : "line" },
		{ "x" : -8.785184163929134, "y" : 48.619401488610215, "trait" : "line" },
		{ "x" : -10.885685404583663, "y" : -51.231986124429966, "trait" : "line" },
		{ "x" : 12.032249542939878, "y" : 24.523012758287226, "trait" : "line" },
		{ "x" : 14.025554891396087, "y" : -49.31328599234678, "trait" : "line" },
		{ "x" : 14.17041801914266, "y" : 45.89816245114517, "trait" : "line" },
		{ "x" : 13.057874842717291, "y" : -50.500434385145155, "trait" : "line" },
		{ "x" : 12.421206335355885, "y" : 46.33202257966139, "trait" : "line" },
		{ "x" : 12.447290165352687, "y" : -51.21170810887959, "trait" : "line" },
		{ "x" : 10.669105856016591, "y" : 46.588428904605735, "trait" : "line" },
		{ "x" : 11.38037957975104, "y" : -50.50043438514515, "trait" : "line" },
		{ "x" : 9.246558408547692, "y" : 48.36661321394184, "trait" : "line" },
		{ "x" : 10.669105856016571, "y" : -51.922981832614035, "trait" : "line" },
		{ "x" : 8.179647822946055, "y" : 49.077886937676276, "trait" : "line" },
		{ "x" : 9.602195270414917, "y" : -52.634255556348485, "trait" : "line" },
		{ "x" : 9.284682680139877, "y" : 13.275212779779567, "trait" : "line" },
		{ "x" : 7.920175168527731, "y" : -52.3269853076952, "trait" : "line" },
		{ "x" : 9.400762551853326, "y" : 13.807814544111915, "trait" : "line" },
		{ "x" : -5.0574406852413505, "y" : -52.32300217484229, "trait" : "line" },
		{ "x" : 9.341584578038619, "y" : -0.41140072180799975, "trait" : "line" },
		{ "x" : -6.952842904248869, "y" : -52.79528792740196, "trait" : "line" },
		{ "x" : 9.638043466091135, "y" : 14.642565386286648, "trait" : "line" },
		{ "x" : -9.796799761228655, "y" : -51.66749231104863, "trait" : "line" },
		{ "x" : 9.403607646748279, "y" : 14.882122376440408, "trait" : "line" },
		{ "x" : -7.943504946666201, "y" : -51.62083275477164, "trait" : "line" },
		{ "x" : 9.565209036780725, "y" : 2.7278769852663194, "trait" : "line" },
		 { "x" : -11.474267711283975, "y" : -45.406007466269614, "trait" : "line" },
		 { "x" : 7.845633682280331, "y" : 14.754093106168211, "trait" : "line" },
		 { "x" : -12.008007513574281, "y" : -35.98476023117272, "trait" : "line" },
		 { "x" : 2.5105117352930773, "y" : -7.950333174414061, "trait" : "line" },
		 { "x" : -15.27246939602586, "y" : -44.4011199493776, "trait" : "line" },
		 { "x" : 22.277093027362625, "y" : -47.242800730441424, "trait" : "line" },
		 { "x" : 23.04526864899581, "y" : 40.713307946559276, "trait" : "line" },
		 { "x" : 24.197532081445605, "y" : -44.93827386554184, "trait" : "line" },
		 { "x" : 24.58161989226221, "y" : 39.56104451410948, "trait" : "line" },
		 { "x" : 26.11797113552859, "y" : -44.17009824390865, "trait" : "line" },
		 { "x" : 26.502058946345183, "y" : 38.79286889247629, "trait" : "line" },
		 { "x" : 28.038410189611568, "y" : -43.017834811458854, "trait" : "line" },
		 { "x" : 28.422498000428174, "y" : 38.40878108165969, "trait" : "line" },
		 { "x" : 49.54732759534099, "y" : 25.3497955138954, "trait" : "line" },
		 { "x" : 50.315503216974186, "y" : 2.3045268648995827, "trait" : "line" },
		 { "x" : 47.24280073044143, "y" : 26.886146757161782, "trait" : "line" },
		 { "x" : 50.315503216974186, "y" : -4.677211588840756e-15, "trait" : "line" },
		 { "x" : 44.55418605472525, "y" : 29.190673622061365, "trait" : "line", "color" : "0070d1" },
		 { "x" : 48.395064162891224, "y" : -3.0727024865327754, "trait" : "line", "color" : "0070d1" },
		 { "x" : 28.03841018961158, "y" : 0.3840878108165967, "trait" : "line", "color" : "0070d1" },
		 { "x" : 51.083678838607405, "y" : -19.58847835164644, "trait" : "line", "color" : "0070d1" },
		 { "x" : 45.32236167635843, "y" : -33.41563954104392, "trait" : "line", "color" : "0070d1" },
		 { "x" : 29.57476143287797, "y" : -0.7681756216331911, "trait" : "line", "color" : "0070d1" },
		 { "x" : 48.01097635207462, "y" : -32.64746391941073, "trait" : "line", "color" : "0070d1" },
		 { "x" : 28.80658581124477, "y" : -3.8408781081659744, "trait" : "line", "color" : "0070d1" },
		 { "x" : 41.09739575737585, "y" : 29.958849243694566, "trait" : "line", "color" : "0070d1" },
		 { "x" : 27.65432237879499, "y" : 35.720166405943516, "trait" : "line", "color" : "0070d1" },
		 { "x" : 44.55418605472523, "y" : 26.886146757161782, "trait" : "line", "color" : "0070d1", "curve" : 0 },
		 { "x" : 39.56104451410948, "y" : -5.761317162248955, "trait" : "line", "curve" : 0 },
		 { "x" : 41.481483568192466, "y" : 29.57476143287796, "trait" : "line", "curve" : 0 },
		 { "x" : 40.71330794655927, "y" : -4.609053729799163, "trait" : "line", "curve" : 0 },
		 { "x" : 31.111112676144362, "y" : -35.33607859512692, "trait" : "line", "curve" : 0 },
		 { "x" : 27.270234567978388, "y" : -42.249659189825664, "trait" : "line", "curve" : 0 },
		 { "x" : 50.315503216974186, "y" : -24.965707703078806, "trait" : "line", "curve" : 0 },
		 { "x" : 28.80658581124477, "y" : -43.017834811458854, "trait" : "line", "curve" : 0 },
		 { "x" : 51.0836788386074, "y" : -24.965707703078806, "trait" : "line", "curve" : 0 },
		 { "x" : 28.03841018961158, "y" : -35.33607859512692, "trait" : "line", "curve" : 0 },
		 { "x" : 31.111112676144344, "y" : -39.56104451410949, "trait" : "line" },
		 { "x" : 47.24280073044143, "y" : -31.879288297777542, "trait" : "line" },
		 { "x" : 26.502058946345187, "y" : -6.913580594698746, "trait" : "line" },
		 { "x" : 25.733883324711986, "y" : -10.37037089204812, "trait" : "line" },
		 { "x" : 50.69959102779079, "y" : 1.9204390540829848, "trait" : "line", "curve" : 0 },
		 { "x" : 28.038410189611568, "y" : -11.138546513681309, "trait" : "line", "curve" : 0 },
		 { "x" : 26.502058946345205, "y" : 34.18381516267713, "trait" : "line", "curve" : 0 },
		 { "x" : 46.09053729799164, "y" : 21.124829594912832, "trait" : "line", "curve" : 0 },
		 { "x" : 24.965707703078806, "y" : 30.72702486532775, "trait" : "line", "curve" : 0 },
		 { "x" : 46.09053729799164, "y" : 18.052127108380052, "trait" : "line", "curve" : 0 },
		 { "x" : 23.813444270629, "y" : 40.713307946559276, "trait" : "line", "curve" : 0 },
		 { "x" : 43.40192262227545, "y" : 25.733883324711996, "trait" : "line", "curve" : 0 },
		 { "x" : 43.017834811458854, "y" : -7.297668405515341, "trait" : "line" },
		 { "x" : 49.93141540615761, "y" : -32.64746391941073, "trait" : "line" },
		 { "x" : 28.03841018961158, "y" : -38.40878108165969, "trait" : "line" },
		 { "x" : 29.958849243694566, "y" : -8.06584402714853, "trait" : "line" },
		 { "x" : 44.04129709908789, "y" : -29.925496746816126, "trait" : "line" },
		 { "x" : 29.360864732725265, "y" : -40.37118900749723, "trait" : "line" },
		 { "x" : 29.078548725679838, "y" : -3.1054760774997883, "trait" : "line" },
		 { "x" : 46.582141162496804, "y" : -2.5408440634089167, "trait" : "line" },
		 { "x" : 32.466340810225056, "y" : -9.316428232499362, "trait" : "line" }

	],

	"segments" : [
		{ "v0" : 0, "v1" : 1, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 2, "v1" : 3, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 4, "v1" : 5, "cMask" : [ ] },
		{ "v0" : 5, "v1" : 7, "cMask" : [ ] },
		{ "v0" : 6, "v1" : 7, "cMask" : [ ] },
		{ "v0" : 8, "v1" : 9, "cMask" : [ ] },
		{ "v0" : 9, "v1" : 11, "cMask" : [ ] },
		{ "v0" : 10, "v1" : 11, "cMask" : [ ] },
		{ "v0" : 13, "v1" : 12, "curve" : 130, "cMask" : [ ], "curveF" : 0.4663076581549986 },
		{ "v0" : 14, "v1" : 15, "cMask" : [ ] },
		{ "v0" : 15, "v1" : 17, "cMask" : [ ] },
		{ "v0" : 16, "v1" : 17, "cMask" : [ ] },
		{ "v0" : 18, "v1" : 19, "cMask" : [ ] },
		{ "v0" : 19, "v1" : 21, "cMask" : [ ] },
		{ "v0" : 20, "v1" : 21, "cMask" : [ ] },
		{ "v0" : 23, "v1" : 22, "curve" : 130, "cMask" : [ ], "curveF" : 0.4663076581549986 },
		{ "v0" : 25, "v1" : 24, "curve" : 180, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 27, "v1" : 26, "curve" : 180, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 24, "v1" : 25, "curve" : 180, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 26, "v1" : 27, "curve" : 180, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 24, "v1" : 25, "curve" : 89.99999999999999, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 1.0000000000000002 },
		{ "v0" : 26, "v1" : 27, "curve" : 89.99999999999999, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 1.0000000000000002 },
		{ "v0" : 25, "v1" : 24, "curve" : 89.99999999999999, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 1.0000000000000002 },
		{ "v0" : 27, "v1" : 26, "curve" : 89.99999999999999, "color" : "C7E6BD", "cMask" : [ ], "curveF" : 1.0000000000000002 },
		{ "v0" : 24, "v1" : 25, "color" : "C7E6BD", "cMask" : [ ] },
		{ "v0" : 26, "v1" : 27, "color" : "C7E6BD", "cMask" : [ ] },
		{ "v0" : 28, "v1" : 29, "curve" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 29, "v1" : 30, "curve" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 32, "v1" : 31, "curve" : 89.99999999999999, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 33, "v1" : 34, "curve" : 89.99999999999999, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 34, "v1" : 32, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "v0" : 36, "v1" : 35, "curve" : 89.99999999999999, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 37, "v1" : 38, "curve" : 89.99999999999999, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 36, "v1" : 38, "color" : "000000", "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "v0" : 39, "v1" : 40, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : 50 },
		{ "v0" : 39, "v1" : 41, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -60 },
		{ "v0" : 31, "v1" : 42, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -60 },
		{ "v0" : 42, "v1" : 43, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -50 },
		{ "v0" : 43, "v1" : 44, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -60 },
		{ "v0" : 40, "v1" : 45, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : 60 },
		{ "v0" : 46, "v1" : 47, "color" : "000000", "bCoef" : 0, "cMask" : ["ball" ] },
		{ "v0" : 48, "v1" : 49, "color" : "000000", "bCoef" : 0, "cMask" : ["ball" ] },
		{ "v0" : 41, "v1" : 50, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "v0" : 51, "v1" : 52, "cMask" : [ ] },
		{ "v0" : 3, "v1" : 55, "vis" : false, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 0, "v1" : 56, "vis" : false, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		
		{ "v0" : 59, "v1" : 60, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 60, "v1" : 61, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 61, "v1" : 62, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 62, "v1" : 63, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 63, "v1" : 64, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 64, "v1" : 65, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 65, "v1" : 66, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 66, "v1" : 59, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 67, "v1" : 68, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 68, "v1" : 69, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 69, "v1" : 70, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 70, "v1" : 71, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 71, "v1" : 72, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 72, "v1" : 73, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 73, "v1" : 74, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 74, "v1" : 67, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 75, "v1" : 76, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 76, "v1" : 77, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 77, "v1" : 78, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 78, "v1" : 79, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 79, "v1" : 80, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 80, "v1" : 81, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 81, "v1" : 82, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 82, "v1" : 75, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 83, "v1" : 84, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 84, "v1" : 85, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 85, "v1" : 86, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 86, "v1" : 87, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 87, "v1" : 88, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 88, "v1" : 89, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 89, "v1" : 90, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 90, "v1" : 91, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 91, "v1" : 92, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 92, "v1" : 93, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 93, "v1" : 83, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 94, "v1" : 95, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 95, "v1" : 96, "curve" : 58.58272434196851, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 96, "v1" : 97, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 97, "v1" : 98, "curve" : 62.85913122967704, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 98, "v1" : 99, "curve" : 68.76068944768971, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 99, "v1" : 100, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 100, "v1" : 101, "curve" : 77.03385261420553, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 101, "v1" : 102, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 102, "v1" : 94, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 103, "v1" : 104, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 104, "v1" : 105, "curve" : -71.07535558394879, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 105, "v1" : 106, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 106, "v1" : 107, "curve" : -67.38013505195958, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 107, "v1" : 108, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 108, "v1" : 103, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 109, "v1" : 110, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 110, "v1" : 111, "curve" : 73.73979529168805, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 111, "v1" : 112, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 112, "v1" : 113, "curve" : 73.73979529168803, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 113, "v1" : 114, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 114, "v1" : 109, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 82, "v1" : 76, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 77, "v1" : 75, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 78, "v1" : 81, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 81, "v1" : 79, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 80, "v1" : 78, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 82, "v1" : 78, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 75, "v1" : 115, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 115, "v1" : 116, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 116, "v1" : 117, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 117, "v1" : 118, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 118, "v1" : 119, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 119, "v1" : 120, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 120, "v1" : 121, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 121, "v1" : 122, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 122, "v1" : 123, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 123, "v1" : 124, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 124, "v1" : 125, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 125, "v1" : 126, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 126, "v1" : 127, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 127, "v1" : 128, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 128, "v1" : 129, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 129, "v1" : 130, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 130, "v1" : 131, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 131, "v1" : 132, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 132, "v1" : 133, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 133, "v1" : 134, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 134, "v1" : 135, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 135, "v1" : 136, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 136, "v1" : 137, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 93, "v1" : 91, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 91, "v1" : 85, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 85, "v1" : 83, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 83, "v1" : 91, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 91, "v1" : 84, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 84, "v1" : 90, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 90, "v1" : 87, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 87, "v1" : 89, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 88, "v1" : 85, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 83, "v1" : 138, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 138, "v1" : 139, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 139, "v1" : 140, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 140, "v1" : 141, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 141, "v1" : 142, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 142, "v1" : 143, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 143, "v1" : 144, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 144, "v1" : 145, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 145, "v1" : 146, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 146, "v1" : 147, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 147, "v1" : 148, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 148, "v1" : 149, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 149, "v1" : 150, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 150, "v1" : 151, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 151, "v1" : 152, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 152, "v1" : 153, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 153, "v1" : 154, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 154, "v1" : 155, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 155, "v1" : 156, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 156, "v1" : 157, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 157, "v1" : 158, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 158, "v1" : 159, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 159, "v1" : 160, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 160, "v1" : 161, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 161, "v1" : 162, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 162, "v1" : 163, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 163, "v1" : 164, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 164, "v1" : 165, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 165, "v1" : 166, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 166, "v1" : 167, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 167, "v1" : 168, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 168, "v1" : 169, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 169, "v1" : 170, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 170, "v1" : 171, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 171, "v1" : 172, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 172, "v1" : 173, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 173, "v1" : 174, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 174, "v1" : 175, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 102, "v1" : 108, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 108, "v1" : 94, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 108, "v1" : 95, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 95, "v1" : 106, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 106, "v1" : 96, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 96, "v1" : 105, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 105, "v1" : 97, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 105, "v1" : 95, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 95, "v1" : 98, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 98, "v1" : 104, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 104, "v1" : 110, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 110, "v1" : 99, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 99, "v1" : 111, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 111, "v1" : 100, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 100, "v1" : 112, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 112, "v1" : 101, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 101, "v1" : 114, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 114, "v1" : 94, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 94, "v1" : 103, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 103, "v1" : 109, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 109, "v1" : 104, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 102, "v1" : 176, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 176, "v1" : 177, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 177, "v1" : 178, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 178, "v1" : 179, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 179, "v1" : 180, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 180, "v1" : 181, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 181, "v1" : 182, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 182, "v1" : 183, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 183, "v1" : 184, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 184, "v1" : 185, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 185, "v1" : 186, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 186, "v1" : 187, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 187, "v1" : 188, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 188, "v1" : 189, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 189, "v1" : 190, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 190, "v1" : 191, "curve" : -78.01125795896596, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 191, "v1" : 192, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 192, "v1" : 193, "curve" : 122.06595941822708, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 193, "v1" : 194, "curve" : -86.13882511766587, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 194, "v1" : 195, "curve" : 97.08953291118974, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 195, "v1" : 196, "curve" : 145.02983571516123, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 196, "v1" : 197, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 197, "v1" : 198, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 198, "v1" : 199, "curve" : -49.420603834635095, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 199, "v1" : 200, "curve" : 53.014703038658844, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 200, "v1" : 201, "curve" : -89.9999999999999, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 201, "v1" : 202, "curve" : -145.00048688191518, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 202, "v1" : 203, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 203, "v1" : 204, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 204, "v1" : 205, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 205, "v1" : 206, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 206, "v1" : 207, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 207, "v1" : 208, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 208, "v1" : 209, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 209, "v1" : 210, "curve" : 122.91265944406533, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 210, "v1" : 211, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 211, "v1" : 212, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 212, "v1" : 213, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 213, "v1" : 214, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 214, "v1" : 215, "curve" : -24.42551709088418, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 215, "v1" : 216, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 216, "v1" : 217, "curve" : -72.45176457002817, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 217, "v1" : 218, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 218, "v1" : 219, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 219, "v1" : 220, "curve" : -45.88781781879237, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 220, "v1" : 221, "curve" : -33.839081845799754, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 221, "v1" : 222, "curve" : 41.11209043916688, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 222, "v1" : 223, "curve" : -72.45176457002817, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 207, "v1" : 224, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 224, "v1" : 225, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 225, "v1" : 226, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 226, "v1" : 227, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 227, "v1" : 228, "color" : "0070d1", "trait" : "line" }

	],

	"planes" : [
		{ "normal" : [0,1 ], "dist" : -445, "bCoef" : 0 },
		{ "normal" : [0,-1 ], "dist" : -445, "bCoef" : 0 },
		{ "normal" : [1,0 ], "dist" : -870, "bCoef" : 0 },
		{ "normal" : [-1,0 ], "dist" : -870, "bCoef" : 0 }

	],

	"goals" : [
		{ "p0" : [-761.3,100 ], "p1" : [-761.3,-100 ], "team" : "red" },
		{ "p0" : [761.3,100 ], "p1" : [761.3,-100 ], "team" : "blue" }

	],

	"discs" : [
		{ "radius" : 8.75, "invMass" : 1.11, "pos" : [0,0 ], "color" : "FFFFFF", "cGroup" : ["ball","kick","score" ], "damping" : 0.991 },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [-5,-1 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [5,-1 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [0,-5 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [-3,4 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [3,4 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [0,0 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		


		{ "radius" : 0, "invMass" : 0, "pos" : [-1311,-19 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["red" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1310,29 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1308,62 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["red","blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [-750,100 ], "color" : "e56e56", "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [750,-100 ], "color" : "5689e5", "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [750,100 ], "color" : "5689e5", "cGroup" : ["ball" ] },
		{ "radius" : 0, "pos" : [-1149,-485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,-485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1155.671526641948,-102.2725364171434 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1149,485 ], "cMask" : [ ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [-750,-100 ], "color" : "e56e56", "cGroup" : ["ball" ] }

	],

	"playerPhysics" : {
		"bCoef" : 0.4,
		"damping" : 0.9605,
		"acceleration" : 0.12,
		"kickStrength" : 5.75,
		"cGroup" : [ "red", "blue"
		]

	},

	"ballPhysics" : "disc0",

	"spawnDistance" : 400,




	"traits" : {
		"line" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["" ] }

	},



	"redSpawnPoints" : [
		

	],

	"blueSpawnPoints" : [
		

	],



"joints":[{"d0":0,"d1":1,"length":5.0990195135927845,"color":"transparent"},
{"d0":0,"d1":2,"length":5.0990195135927845,"color":"transparent"},
{"d0":0,"d1":3,"length":5,"color":"transparent"},
{"d0":0,"d1":4,"length":5,"color":"transparent"},
{"d0":0,"d1":5,"length":5,"color":"transparent"},
{"d0":0,"d1":6,"length":0,"color":"transparent"},
{"d0":1,"d1":2,"length":10,"color":"transparent"},
{"d0":1,"d1":3,"length":6.4031242374328485,"color":"transparent"},
{"d0":1,"d1":4,"length":5.385164807134504,"color":"transparent"},
{"d0":1,"d1":5,"length":9.433981132056603,"color":"transparent"},
{"d0":1,"d1":6,"length":5.0990195135927845,"color":"transparent"},
{"d0":2,"d1":3,"length":6.4031242374328485,"color":"transparent"},
{"d0":2,"d1":4,"length":9.433981132056603,"color":"transparent"},
{"d0":2,"d1":5,"length":5.385164807134504,"color":"transparent"},
{"d0":2,"d1":6,"length":5.0990195135927845,"color":"transparent"},
{"d0":3,"d1":4,"length":9.486832980505138,"color":"transparent"},
{"d0":3,"d1":5,"length":9.486832980505138,"color":"transparent"},
{"d0":3,"d1":6,"length":5,"color":"transparent"},
{"d0":4,"d1":5,"length":6,"color":"transparent"},
{"d0":4,"d1":6,"length":5,"color":"transparent"},
{"d0":5,"d1":6,"length":5,"color":"transparent"}],

	"canBeStored" : false
}`
    },
    biggerx3: {
        nombre: "LNB Bigger x3",
        minJugadores: 2,
        maxJugadores: 6,
        hbs: `{

	"name" : "LNB Bigger x3",

	"width" : 600,

	"height" : 270,

	"bg" : { "width" : 550, "height" : 240, "kickOffRadius" : 180, "color" : "444444" },

	"vertexes" : [
		{ "x" : -1.5884550345839648, "y" : 240.39711375864601, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : 120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : -120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : -240, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : 120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "x" : 0, "y" : -120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ] },
		{ "x" : 0, "y" : 120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ] },
		{ "x" : -550, "y" : 90, "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "x" : 550, "y" : 90, "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "x" : 605, "y" : 65, "bCoef" : 0, "cMask" : ["ball" ] },
		{ "x" : 550, "y" : -90, "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "x" : 605, "y" : -60, "bCoef" : 0, "cMask" : ["ball" ] },
		{ "x" : -550, "y" : 240, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 550, "y" : 240, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -550, "y" : 90, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -550, "y" : -240, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 550, "y" : -240, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 550, "y" : -90, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 550, "y" : 90, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -550, "y" : -100, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ] },
		{ "x" : 550, "y" : 90, "cMask" : [ ] },
		{ "x" : 550, "y" : -90, "cMask" : [ ] },
		{ "x" : 0, "y" : 120, "cMask" : [ ] },
		{ "x" : 0, "y" : -120, "cMask" : [ ] },
		{ "x" : 0, "y" : -120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : 0, "y" : 120, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : -550, "y" : -240, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 550, "y" : -240, "cMask" : ["ball" ], "cGroup" : ["ball" ] },
		{ "x" : 550, "y" : -90, "cMask" : ["ball" ], "cGroup" : ["ball" ] },
		{ "x" : 550, "y" : 90, "cMask" : [ ] },
		{ "x" : 550, "y" : -90, "cMask" : [ ] },
		{ "x" : -550, "y" : -90 },
		{ "x" : -550, "y" : 90 },
		{ "x" : -605, "y" : -65, "bCoef" : 0 },
		{ "x" : -605, "y" : 65, "bCoef" : 0 },
		{ "x" : -550, "y" : 90 },
		{ "x" : -550, "y" : 90, "cMask" : [ ] },
		{ "x" : -550, "y" : -90, "cMask" : [ ] },
		{ "x" : -550, "y" : -240, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -550, "y" : -90, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -550, "y" : -240, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : -550, "y" : -90, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ] },
		{ "x" : 0, "y" : -294.23859342943956, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "x" : -1.5884550345839648, "y" : 292.97791388580566, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		
		{ "x" : -0.10592225218889376, "y" : 70.00348225809711, "trait" : "line", "color" : "ffffff" },
		{ "x" : 64.35808817254119, "y" : 36.17130657419622, "trait" : "line", "color" : "ffffff" },
		{ "x" : 63.90089660924522, "y" : -48.409132635556006, "trait" : "line", "color" : "ffffff" },
		{ "x" : 49.27076658377456, "y" : -47.95194107226005, "trait" : "line", "color" : "ffffff" },
		{ "x" : 0.3512693111070637, "y" : -71.72590236364987, "trait" : "line", "color" : "ffffff" },
		{ "x" : -48.11103639826448, "y" : -48.409132635556006, "trait" : "line", "color" : "ffffff" },
		{ "x" : -63.65554955032705, "y" : -48.409132635556006, "trait" : "line", "color" : "ffffff" },
		{ "x" : -63.1983579870311, "y" : 36.62849813749218, "trait" : "line", "color" : "ffffff" },
		{ "x" : -0.10592225218889376, "y" : 64.97437506184157, "trait" : "line", "color" : "ffffff" },
		{ "x" : 59.32898097628564, "y" : 33.88534875771643, "trait" : "line", "color" : "ffffff" },
		{ "x" : 59.32898097628564, "y" : -43.837217002596425, "trait" : "line", "color" : "ffffff" },
		{ "x" : 48.35638345718265, "y" : -43.837217002596425, "trait" : "line", "color" : "ffffff" },
		{ "x" : 0.3512693111070637, "y" : -67.15398673069028, "trait" : "line", "color" : "ffffff" },
		{ "x" : -47.653844834968524, "y" : -43.837217002596425, "trait" : "line", "color" : "ffffff" },
		{ "x" : -59.08363391736747, "y" : -43.837217002596425, "trait" : "line", "color" : "ffffff" },
		{ "x" : -58.62644235407152, "y" : 33.42815719442047, "trait" : "line", "color" : "ffffff" },
		{ "x" : -50.396994214744275, "y" : -33.321811046789385, "trait" : "line", "color" : "0070d1" },
		{ "x" : -43.08192920200894, "y" : -36.97934355315705, "trait" : "line", "color" : "0070d1" },
		{ "x" : -43.08192920200894, "y" : 22.455559675317485, "trait" : "line", "color" : "0070d1" },
		{ "x" : -30.280565429722117, "y" : 28.39904999816494, "trait" : "line", "color" : "0070d1" },
		{ "x" : -29.823373866426167, "y" : 10.568579029622576, "trait" : "line", "color" : "0070d1" },
		{ "x" : -22.05111729039488, "y" : 11.025770592918535, "trait" : "line", "color" : "0070d1" },
		{ "x" : -22.05111729039488, "y" : 41.65760533374772, "trait" : "line", "color" : "0070d1" },
		{ "x" : -50.85418577804023, "y" : 27.02747530827706, "trait" : "line", "color" : "0070d1" },
		{ "x" : -17.02201009413934, "y" : -48.409132635556006, "trait" : "line", "color" : "0070d1" },
		{ "x" : -4.677837885148473, "y" : -53.895431395107494, "trait" : "line", "color" : "0070d1" },
		{ "x" : 6.751951197250475, "y" : -11.833807571879364, "trait" : "line", "color" : "0070d1" },
		{ "x" : 6.751951197250475, "y" : -53.895431395107494, "trait" : "line", "color" : "0070d1" },
		{ "x" : 15.895782463169635, "y" : -48.86632419885196, "trait" : "line", "color" : "0070d1" },
		{ "x" : 15.438590899873677, "y" : 45.31513784011538, "trait" : "line", "color" : "0070d1" },
		{ "x" : 6.751951197250475, "y" : 49.88705347307496, "trait" : "line", "color" : "0070d1" },
		{ "x" : 6.751951197250475, "y" : 20.169601858837694, "trait" : "line", "color" : "0070d1" },
		{ "x" : -7.878178828220179, "y" : -26.463937597350018, "trait" : "line", "color" : "0070d1" },
		{ "x" : -7.878178828220179, "y" : 49.88705347307496, "trait" : "line", "color" : "0070d1" },
		{ "x" : -17.02201009413934, "y" : 44.40075471352347, "trait" : "line", "color" : "0070d1" },
		{ "x" : 21.38208122272113, "y" : -47.494749508964084, "trait" : "line", "color" : "0070d1" },
		{ "x" : 47.899191893886695, "y" : -33.77900261008535, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.55672440025435, "y" : -26.006746034054064, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.099532836958396, "y" : -14.119765388359154, "trait" : "line", "color" : "0070d1" },
		{ "x" : 44.24165938751902, "y" : -5.433125685735952, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.55672440025435, "y" : 3.2535140168872467, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.099532836958396, "y" : 23.369942801909392, "trait" : "line", "color" : "0070d1" },
		{ "x" : 46.98480876729477, "y" : 28.856241561460894, "trait" : "line", "color" : "0070d1" },
		{ "x" : 21.38208122272113, "y" : 42.57198846033963, "trait" : "line", "color" : "0070d1" },
		{ "x" : 30.983104051936245, "y" : -10.005041318695532, "trait" : "line", "color" : "0070d1" },
		{ "x" : 37.38378593807966, "y" : -10.005041318695532, "trait" : "line", "color" : "0070d1" },
		{ "x" : 43.327276260927114, "y" : -16.405723204838946, "trait" : "line", "color" : "0070d1" },
		{ "x" : 43.327276260927114, "y" : -24.17797978087023, "trait" : "line", "color" : "0070d1" },
		{ "x" : 40.126935317855406, "y" : -29.20708697712577, "trait" : "line", "color" : "0070d1" },
		{ "x" : 30.983104051936245, "y" : -33.77900261008535, "trait" : "line", "color" : "0070d1" },
		{ "x" : 30.06872092534433, "y" : 0.053173073815541934, "trait" : "line", "color" : "0070d1" },
		{ "x" : 38.298169064671576, "y" : 0.053173073815541934, "trait" : "line", "color" : "0070d1" },
		{ "x" : 43.327276260927114, "y" : 5.5394718333670365, "trait" : "line", "color" : "0070d1" },
		{ "x" : 43.327276260927114, "y" : 18.79802716894982, "trait" : "line", "color" : "0070d1" },
		{ "x" : 40.58412688115136, "y" : 23.827134365205364, "trait" : "line", "color" : "0070d1" },
		{ "x" : 30.52591248864029, "y" : 28.39904999816494, "trait" : "line", "color" : "0070d1" },
		{ "x" : -48.18468646597996, "y" : 26.23423309331532, "trait" : "line" },
		{ "x" : -48.530854852036825, "y" : -33.70183332671552, "trait" : "line" },
		{ "x" : -45.34393887604166, "y" : 27.841506862122724, "trait" : "line" },
		{ "x" : -44.900286158504656, "y" : -35.62329661496068, "trait" : "line" },
		{ "x" : -46.98319151146816, "y" : 27.00076994028904, "trait" : "line" },
		{ "x" : -46.881359874988554, "y" : -34.173117605872164, "trait" : "line" },
		{ "x" : -49.29227052819965, "y" : 26.47422253789312, "trait" : "line" },
		{ "x" : -23.76931115861874, "y" : 39.10189171958485, "trait" : "line" },
		{ "x" : -44.39624914691749, "y" : 27.384038363775893, "trait" : "line" },
		{ "x" : -23.827669745103698, "y" : 35.919323048589156, "trait" : "line" },
		{ "x" : -23.472032883236494, "y" : 10.669105856016582, "trait" : "line" },
		{ "x" : -25.96149091630701, "y" : 35.56368618672194, "trait" : "line" },
		{ "x" : -24.53894346883813, "y" : 11.024742717883806, "trait" : "line" },
		{ "x" : -27.739675225643115, "y" : 36.6305967723236, "trait" : "line" },
		{ "x" : -25.961490916307028, "y" : 11.024742717883797, "trait" : "line" },
		{ "x" : -30.94040698244809, "y" : 35.563686186721945, "trait" : "line" },
		{ "x" : -28.450948949377544, "y" : 10.669105856016584, "trait" : "line" },
		{ "x" : -28.80658581124478, "y" : 35.563686186721945, "trait" : "line" },
		{ "x" : -45.16588145713686, "y" : 20.98257485016595, "trait" : "line" },
		{ "x" : -29.162222673111994, "y" : 31.65168070618253, "trait" : "line" },
		{ "x" : -47.655339490207396, "y" : 23.472032883236484, "trait" : "line" },
		{ "x" : -40.186965390995795, "y" : 26.67276464004146, "trait" : "line" },
		{ "x" : -45.16588145713686, "y" : 22.760759159502044, "trait" : "line" },
		{ "x" : -14.75640559929883, "y" : 45.04129634494068, "trait" : "line" },
		{ "x" : -14.913581387320324, "y" : -48.499163681413485, "trait" : "line" },
		{ "x" : -13.09845909715945, "y" : 46.50947638323326, "trait" : "line" },
		{ "x" : -13.309232831280108, "y" : -49.975309074981524, "trait" : "line" },
		{ "x" : -11.465137915569931, "y" : 47.043296303395834, "trait" : "line" },
		{ "x" : -11.857712758261926, "y" : -50.711208119265805, "trait" : "line" },
		{ "x" : -10.183106290848157, "y" : 47.816862583228364, "trait" : "line" },
		{ "x" : -10.732856921561647, "y" : -50.73583343981566, "trait" : "line" },
		{ "x" : -8.785184163929134, "y" : 48.619401488610215, "trait" : "line" },
		{ "x" : -10.885685404583663, "y" : -51.231986124429966, "trait" : "line" },
		{ "x" : 12.032249542939878, "y" : 24.523012758287226, "trait" : "line" },
		{ "x" : 14.025554891396087, "y" : -49.31328599234678, "trait" : "line" },
		{ "x" : 14.17041801914266, "y" : 45.89816245114517, "trait" : "line" },
		{ "x" : 13.057874842717291, "y" : -50.500434385145155, "trait" : "line" },
		{ "x" : 12.421206335355885, "y" : 46.33202257966139, "trait" : "line" },
		{ "x" : 12.447290165352687, "y" : -51.21170810887959, "trait" : "line" },
		{ "x" : 10.669105856016591, "y" : 46.588428904605735, "trait" : "line" },
		{ "x" : 11.38037957975104, "y" : -50.50043438514515, "trait" : "line" },
		{ "x" : 9.246558408547692, "y" : 48.36661321394184, "trait" : "line" },
		{ "x" : 10.669105856016571, "y" : -51.922981832614035, "trait" : "line" },
		{ "x" : 8.179647822946055, "y" : 49.077886937676276, "trait" : "line" },
		{ "x" : 9.602195270414917, "y" : -52.634255556348485, "trait" : "line" },
		{ "x" : 9.284682680139877, "y" : 13.275212779779567, "trait" : "line" },
		{ "x" : 7.920175168527731, "y" : -52.3269853076952, "trait" : "line" },
		{ "x" : 9.400762551853326, "y" : 13.807814544111915, "trait" : "line" },
		{ "x" : -5.0574406852413505, "y" : -52.32300217484229, "trait" : "line" },
		{ "x" : 9.341584578038619, "y" : -0.41140072180799975, "trait" : "line" },
		{ "x" : -6.952842904248869, "y" : -52.79528792740196, "trait" : "line" },
		{ "x" : 9.638043466091135, "y" : 14.642565386286648, "trait" : "line" },
		{ "x" : -9.796799761228655, "y" : -51.66749231104863, "trait" : "line" },
		{ "x" : 9.403607646748279, "y" : 14.882122376440408, "trait" : "line" },
		{ "x" : -7.943504946666201, "y" : -51.62083275477164, "trait" : "line" },
		{ "x" : 9.565209036780725, "y" : 2.7278769852663194, "trait" : "line" },
		{ "x" : -11.474267711283975, "y" : -45.406007466269614, "trait" : "line" },
		{ "x" : 7.845633682280331, "y" : 14.754093106168211, "trait" : "line" },
		{ "x" : -12.008007513574281, "y" : -35.98476023117272, "trait" : "line" },
		{ "x" : 2.5105117352930773, "y" : -7.950333174414061, "trait" : "line" },
		{ "x" : -15.27246939602586, "y" : -44.4011199493776, "trait" : "line" },
		{ "x" : 22.277093027362625, "y" : -47.242800730441424, "trait" : "line" },
		{ "x" : 23.04526864899581, "y" : 40.713307946559276, "trait" : "line" },
		{ "x" : 24.197532081445605, "y" : -44.93827386554184, "trait" : "line" },
		{ "x" : 24.58161989226221, "y" : 39.56104451410948, "trait" : "line" },
		{ "x" : 26.11797113552859, "y" : -44.17009824390865, "trait" : "line" },
		{ "x" : 26.502058946345183, "y" : 38.79286889247629, "trait" : "line" },
		{ "x" : 28.038410189611568, "y" : -43.017834811458854, "trait" : "line" },
		{ "x" : 28.422498000428174, "y" : 38.40878108165969, "trait" : "line" },
		{ "x" : 49.54732759534099, "y" : 25.3497955138954, "trait" : "line" },
		{ "x" : 50.315503216974186, "y" : 2.3045268648995827, "trait" : "line" },
		{ "x" : 47.24280073044143, "y" : 26.886146757161782, "trait" : "line" },
		{ "x" : 50.315503216974186, "y" : -4.677211588840756e-15, "trait" : "line" },
		{ "x" : 44.55418605472525, "y" : 29.190673622061365, "trait" : "line", "color" : "0070d1" },
		{ "x" : 48.395064162891224, "y" : -3.0727024865327754, "trait" : "line", "color" : "0070d1" },
		{ "x" : 28.03841018961158, "y" : 0.3840878108165967, "trait" : "line", "color" : "0070d1" },
		{ "x" : 51.083678838607405, "y" : -19.58847835164644, "trait" : "line", "color" : "0070d1" },
		{ "x" : 45.32236167635843, "y" : -33.41563954104392, "trait" : "line", "color" : "0070d1" },
		{ "x" : 29.57476143287797, "y" : -0.7681756216331911, "trait" : "line", "color" : "0070d1" },
		{ "x" : 48.01097635207462, "y" : -32.64746391941073, "trait" : "line", "color" : "0070d1" },
		{ "x" : 28.80658581124477, "y" : -3.8408781081659744, "trait" : "line", "color" : "0070d1" },
		{ "x" : 41.09739575737585, "y" : 29.958849243694566, "trait" : "line", "color" : "0070d1" },
		{ "x" : 27.65432237879499, "y" : 35.720166405943516, "trait" : "line", "color" : "0070d1" },
		{ "x" : 44.55418605472523, "y" : 26.886146757161782, "trait" : "line", "color" : "0070d1", "curve" : 0 },
		{ "x" : 39.56104451410948, "y" : -5.761317162248955, "trait" : "line", "curve" : 0 },
		{ "x" : 41.481483568192466, "y" : 29.57476143287796, "trait" : "line", "curve" : 0 },
		{ "x" : 40.71330794655927, "y" : -4.609053729799163, "trait" : "line", "curve" : 0 },
		{ "x" : 31.111112676144362, "y" : -35.33607859512692, "trait" : "line", "curve" : 0 },
		{ "x" : 27.270234567978388, "y" : -42.249659189825664, "trait" : "line", "curve" : 0 },
		{ "x" : 50.315503216974186, "y" : -24.965707703078806, "trait" : "line", "curve" : 0 },
		{ "x" : 28.80658581124477, "y" : -43.017834811458854, "trait" : "line", "curve" : 0 },
		{ "x" : 51.0836788386074, "y" : -24.965707703078806, "trait" : "line", "curve" : 0 },
		{ "x" : 28.03841018961158, "y" : -35.33607859512692, "trait" : "line", "curve" : 0 },
		{ "x" : 31.111112676144344, "y" : -39.56104451410949, "trait" : "line" },
		{ "x" : 47.24280073044143, "y" : -31.879288297777542, "trait" : "line" },
		{ "x" : 26.502058946345187, "y" : -6.913580594698746, "trait" : "line" },
		{ "x" : 25.733883324711986, "y" : -10.37037089204812, "trait" : "line" },
		{ "x" : 50.69959102779079, "y" : 1.9204390540829848, "trait" : "line", "curve" : 0 },
		{ "x" : 28.038410189611568, "y" : -11.138546513681309, "trait" : "line", "curve" : 0 },
		{ "x" : 26.502058946345205, "y" : 34.18381516267713, "trait" : "line", "curve" : 0 },
		{ "x" : 46.09053729799164, "y" : 21.124829594912832, "trait" : "line", "curve" : 0 },
		{ "x" : 24.965707703078806, "y" : 30.72702486532775, "trait" : "line", "curve" : 0 },
		{ "x" : 46.09053729799164, "y" : 18.052127108380052, "trait" : "line", "curve" : 0 },
		{ "x" : 23.813444270629, "y" : 40.713307946559276, "trait" : "line", "curve" : 0 },
		{ "x" : 43.40192262227545, "y" : 25.733883324711996, "trait" : "line", "curve" : 0 },
		{ "x" : 43.017834811458854, "y" : -7.297668405515341, "trait" : "line" },
		{ "x" : 49.93141540615761, "y" : -32.64746391941073, "trait" : "line" },
		{ "x" : 28.03841018961158, "y" : -38.40878108165969, "trait" : "line" },
		{ "x" : 29.958849243694566, "y" : -8.06584402714853, "trait" : "line" },
		{ "x" : 44.04129709908789, "y" : -29.925496746816126, "trait" : "line" },
		{ "x" : 29.360864732725265, "y" : -40.37118900749723, "trait" : "line" },
		{ "x" : 29.078548725679838, "y" : -3.1054760774997883, "trait" : "line" },
		{ "x" : 46.582141162496804, "y" : -2.5408440634089167, "trait" : "line" },
		{ "x" : 32.466340810225056, "y" : -9.316428232499362, "trait" : "line" }

	],

	"segments" : [
		{ "v0" : 0, "v1" : 1, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 2, "v1" : 3, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 4, "v1" : 5, "curve" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["blueKO" ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 5, "v1" : 6, "curve" : 180, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO" ], "curveF" : 6.123233995736766e-17 },
		{ "v0" : 9, "v1" : 8, "curve" : 89.99999999999999, "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 10, "v1" : 11, "curve" : 89.99999999999999, "bCoef" : 0, "cMask" : ["red","blue","ball" ], "curveF" : 1.0000000000000002 },
		{ "v0" : 9, "v1" : 11, "bCoef" : 0, "cMask" : ["red","blue","ball" ] },
		{ "v0" : 12, "v1" : 13, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : 50 },
		{ "v0" : 12, "v1" : 14, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -60 },
		{ "v0" : 13, "v1" : 18, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : 60 },
		{ "v0" : 20, "v1" : 21, "cMask" : [ ] },
		{ "v0" : 26, "v1" : 27, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : -50 },
		{ "v0" : 27, "v1" : 28, "cMask" : ["ball" ], "cGroup" : ["ball" ], "bias" : -60 },
		{ "v0" : 33, "v1" : 31, "curve" : 89.99999998999999, "curveF" : 1.000000000174533 },
		{ "v0" : 33, "v1" : 34, "bCoef" : 0 },
		{ "v0" : 35, "v1" : 34, "curve" : 89.99999998999999, "curveF" : 1.000000000174533 },
		{ "v0" : 36, "v1" : 37, "cMask" : [ ] },
		{ "v0" : 40, "v1" : 41, "cMask" : ["ball" ], "cGroup" : ["red","blue","wall" ], "bias" : 50 },
		{ "v0" : 3, "v1" : 42, "vis" : false, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 43, "v1" : 0, "vis" : false, "bCoef" : 0.1, "cMask" : ["red","blue" ], "cGroup" : ["redKO","blueKO" ] },
		{ "v0" : 44, "v1" : 45, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 45, "v1" : 46, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 46, "v1" : 47, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 47, "v1" : 48, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 48, "v1" : 49, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 49, "v1" : 50, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 50, "v1" : 51, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 51, "v1" : 44, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 52, "v1" : 53, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 53, "v1" : 54, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 54, "v1" : 55, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 55, "v1" : 56, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 56, "v1" : 57, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 57, "v1" : 58, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 58, "v1" : 59, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 59, "v1" : 52, "color" : "ffffff", "trait" : "line" },
		{ "v0" : 60, "v1" : 61, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 61, "v1" : 62, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 62, "v1" : 63, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 63, "v1" : 64, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 64, "v1" : 65, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 65, "v1" : 66, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 66, "v1" : 67, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 67, "v1" : 60, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 68, "v1" : 69, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 69, "v1" : 70, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 70, "v1" : 71, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 71, "v1" : 72, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 72, "v1" : 73, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 73, "v1" : 74, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 74, "v1" : 75, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 75, "v1" : 76, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 76, "v1" : 77, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 77, "v1" : 78, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 78, "v1" : 68, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 79, "v1" : 80, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 80, "v1" : 81, "curve" : 58.58272434196851, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 81, "v1" : 82, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 82, "v1" : 83, "curve" : 62.85913122967704, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 83, "v1" : 84, "curve" : 68.76068944768971, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 84, "v1" : 85, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 85, "v1" : 86, "curve" : 77.03385261420553, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 86, "v1" : 87, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 87, "v1" : 79, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 88, "v1" : 89, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 89, "v1" : 90, "curve" : -71.07535558394879, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 90, "v1" : 91, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 91, "v1" : 92, "curve" : -67.38013505195958, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 92, "v1" : 93, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 93, "v1" : 88, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 94, "v1" : 95, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 95, "v1" : 96, "curve" : 73.73979529168805, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 96, "v1" : 97, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 97, "v1" : 98, "curve" : 73.73979529168803, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 98, "v1" : 99, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 99, "v1" : 94, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 67, "v1" : 61, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 62, "v1" : 60, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 63, "v1" : 66, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 66, "v1" : 64, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 65, "v1" : 63, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 67, "v1" : 63, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 60, "v1" : 100, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 100, "v1" : 101, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 101, "v1" : 102, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 102, "v1" : 103, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 103, "v1" : 104, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 104, "v1" : 105, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 105, "v1" : 106, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 106, "v1" : 107, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 107, "v1" : 108, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 108, "v1" : 109, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 109, "v1" : 110, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 110, "v1" : 111, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 111, "v1" : 112, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 112, "v1" : 113, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 113, "v1" : 114, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 114, "v1" : 115, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 115, "v1" : 116, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 116, "v1" : 117, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 117, "v1" : 118, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 118, "v1" : 119, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 119, "v1" : 120, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 120, "v1" : 121, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 121, "v1" : 122, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 78, "v1" : 76, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 76, "v1" : 70, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 70, "v1" : 68, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 68, "v1" : 76, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 76, "v1" : 69, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 69, "v1" : 75, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 75, "v1" : 72, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 72, "v1" : 74, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 73, "v1" : 70, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 68, "v1" : 123, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 123, "v1" : 124, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 124, "v1" : 125, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 125, "v1" : 126, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 126, "v1" : 127, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 127, "v1" : 128, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 128, "v1" : 129, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 129, "v1" : 130, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 130, "v1" : 131, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 131, "v1" : 132, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 132, "v1" : 133, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 133, "v1" : 134, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 134, "v1" : 135, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 135, "v1" : 136, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 136, "v1" : 137, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 137, "v1" : 138, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 138, "v1" : 139, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 139, "v1" : 140, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 140, "v1" : 141, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 141, "v1" : 142, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 142, "v1" : 143, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 143, "v1" : 144, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 144, "v1" : 145, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 145, "v1" : 146, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 146, "v1" : 147, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 147, "v1" : 148, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 148, "v1" : 149, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 149, "v1" : 150, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 150, "v1" : 151, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 151, "v1" : 152, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 152, "v1" : 153, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 153, "v1" : 154, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 154, "v1" : 155, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 155, "v1" : 156, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 156, "v1" : 157, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 157, "v1" : 158, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 158, "v1" : 159, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 159, "v1" : 160, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 87, "v1" : 93, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 93, "v1" : 79, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 93, "v1" : 80, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 80, "v1" : 91, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 91, "v1" : 81, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 81, "v1" : 90, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 90, "v1" : 82, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 90, "v1" : 80, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 80, "v1" : 83, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 83, "v1" : 89, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 89, "v1" : 95, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 95, "v1" : 84, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 84, "v1" : 96, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 96, "v1" : 85, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 85, "v1" : 97, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 97, "v1" : 86, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 86, "v1" : 99, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 99, "v1" : 79, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 79, "v1" : 88, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 88, "v1" : 94, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 94, "v1" : 89, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 87, "v1" : 161, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 161, "v1" : 162, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 162, "v1" : 163, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 163, "v1" : 164, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 164, "v1" : 165, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 165, "v1" : 166, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 166, "v1" : 167, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 167, "v1" : 168, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 168, "v1" : 169, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 169, "v1" : 170, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 170, "v1" : 171, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 171, "v1" : 172, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 172, "v1" : 173, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 173, "v1" : 174, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 174, "v1" : 175, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 175, "v1" : 176, "curve" : -78.01125795896596, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 176, "v1" : 177, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 177, "v1" : 178, "curve" : 122.06595941822708, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 178, "v1" : 179, "curve" : -86.13882511766587, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 179, "v1" : 180, "curve" : 97.08953291118974, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 180, "v1" : 181, "curve" : 145.02983571516123, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 181, "v1" : 182, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 182, "v1" : 183, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 183, "v1" : 184, "curve" : -49.420603834635095, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 184, "v1" : 185, "curve" : 53.014703038658844, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 185, "v1" : 186, "curve" : -89.9999999999999, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 186, "v1" : 187, "curve" : -145.00048688191518, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 187, "v1" : 188, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 188, "v1" : 189, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 189, "v1" : 190, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 190, "v1" : 191, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 191, "v1" : 192, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 192, "v1" : 193, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 193, "v1" : 194, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 194, "v1" : 195, "curve" : 122.91265944406533, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 195, "v1" : 196, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 196, "v1" : 197, "curve" : 12.987050625078458, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 197, "v1" : 198, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 198, "v1" : 199, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 199, "v1" : 200, "curve" : -24.42551709088418, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 200, "v1" : 201, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 201, "v1" : 202, "curve" : -72.45176457002817, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 202, "v1" : 203, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 203, "v1" : 204, "curve" : 0, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 204, "v1" : 205, "curve" : -45.88781781879237, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 205, "v1" : 206, "curve" : -33.839081845799754, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 206, "v1" : 207, "curve" : 41.11209043916688, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 207, "v1" : 208, "curve" : -72.45176457002817, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 192, "v1" : 209, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 209, "v1" : 210, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 210, "v1" : 211, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 211, "v1" : 212, "color" : "0070d1", "trait" : "line" },
		{ "v0" : 212, "v1" : 213, "color" : "0070d1", "trait" : "line" }

	],

	"planes" : [
		{ "normal" : [0,1 ], "dist" : -295.5069602335031, "bCoef" : 0 },
		{ "normal" : [0,-1 ], "dist" : -307.1558067516866, "bCoef" : 0 },
		{ "normal" : [1,0 ], "dist" : -608.1657367142399, "bCoef" : 0 },
		{ "normal" : [-1,0 ], "dist" : -604.9919880683518, "bCoef" : 0 }

	],

	"goals" : [
		{ "p0" : [-561.3,80 ], "p1" : [-561.3,-80 ], "team" : "red" },
		{ "p0" : [561.3,80 ], "p1" : [561.3,-80 ], "team" : "blue" }

	],

	"discs" : [
		{ "radius" : 8.75, "invMass" : 1.11, "pos" : [0,0 ], "color" : "FFFFFF", "cGroup" : ["ball","kick","score" ], "damping" : 0.991 },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [-5,-1 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [5,-1 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [0,-5 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [-3,4 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [3,4 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		{ "radius" : 0.01, "invMass" : 1e+300, "pos" : [0,0 ], "color" : "0", "cMask" : [ ], "cGroup" : [ ] },
		

		{ "radius" : 0, "invMass" : 0, "pos" : [-1311,-19 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["red" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1310,29 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 0, "invMass" : 0, "pos" : [-1308,62 ], "color" : "transparent", "bCoef" : 0, "cMask" : ["red","blue" ], "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [-550,-90 ], "color" : "E56E56", "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [550,-90 ], "color" : "5689E5", "cGroup" : ["ball" ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [550,90 ], "color" : "5689E5", "cGroup" : ["ball" ] },
		{ "radius" : 0, "pos" : [-1149,-485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,-485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1155.671526641948,-102.2725364171434 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [-1149,485 ], "cMask" : [ ] },
		{ "radius" : 0, "pos" : [1149,485 ], "cMask" : [ ] },
		{ "radius" : 8, "invMass" : 0, "pos" : [-550,90 ], "color" : "E56E56", "cGroup" : ["ball" ] }

	],

	"playerPhysics" : {
		"bCoef" : 0.4,
		"damping" : 0.9605,
		"acceleration" : 0.12,
		"kickStrength" : 5.75,
		"cGroup" : [ "red", "blue"
		]

	},

	"ballPhysics" : "disc0",

	"spawnDistance" : 400,



	"traits" : {
		"line" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["" ] }

	},



	"redSpawnPoints" : [
		

	],

	"blueSpawnPoints" : [
		

	],



"joints":[{"d0":0,"d1":1,"length":5.0990195135927845,"color":"transparent"},
{"d0":0,"d1":2,"length":5.0990195135927845,"color":"transparent"},
{"d0":0,"d1":3,"length":5,"color":"transparent"},
{"d0":0,"d1":4,"length":5,"color":"transparent"},
{"d0":0,"d1":5,"length":5,"color":"transparent"},
{"d0":0,"d1":6,"length":0,"color":"transparent"},
{"d0":1,"d1":2,"length":10,"color":"transparent"},
{"d0":1,"d1":3,"length":6.4031242374328485,"color":"transparent"},
{"d0":1,"d1":4,"length":5.385164807134504,"color":"transparent"},
{"d0":1,"d1":5,"length":9.433981132056603,"color":"transparent"},
{"d0":1,"d1":6,"length":5.0990195135927845,"color":"transparent"},
{"d0":2,"d1":3,"length":6.4031242374328485,"color":"transparent"},
{"d0":2,"d1":4,"length":9.433981132056603,"color":"transparent"},
{"d0":2,"d1":5,"length":5.385164807134504,"color":"transparent"},
{"d0":2,"d1":6,"length":5.0990195135927845,"color":"transparent"},
{"d0":3,"d1":4,"length":9.486832980505138,"color":"transparent"},
{"d0":3,"d1":5,"length":9.486832980505138,"color":"transparent"},
{"d0":3,"d1":6,"length":5,"color":"transparent"},
{"d0":4,"d1":5,"length":6,"color":"transparent"},
{"d0":4,"d1":6,"length":5,"color":"transparent"},
{"d0":5,"d1":6,"length":5,"color":"transparent"}],

	"canBeStored" : false
}`
    },
    biggerx1: {
        nombre: "Bigger x1 LNB",
        minJugadores: 2,
        maxJugadores: 6,
        hbs: `{"name":"Bigger x1 LNB","width":420,"height":200,"bg":{"width":380,"height":170,"kickOffRadius":120,"color":"444444"},"vertexes":[{"x":0,"y":170,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"vis":false},{"x":0,"y":85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-170,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"bias":0,"curve":0,"vis":false},{"x":520,"y":150,"cMask":[]},{"x":520,"y":100,"cMask":[]},{"x":520,"y":-100,"cMask":[]},{"x":-520,"y":150,"cMask":[]},{"x":-520,"y":100,"cMask":[]},{"x":0,"y":85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":-85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":-384.8105676799998,"y":-76.16293376,"cMask":["ball"],"cGroup":["red","blue","wall"],"color":"000000","curve":89.99999999999999},{"x":-380,"y":65,"bCoef":0,"cMask":["red","blue","ball"],"color":"000000"},{"x":380,"y":65,"bCoef":0,"cMask":["red","blue","ball"],"color":"000000"},{"x":420,"y":45,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":380,"y":-65,"bCoef":0,"cMask":["red","blue","ball"],"color":"000000"},{"x":420,"y":-42,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":-380,"y":170,"cMask":["ball"],"cGroup":["red","blue","wall"],"curve":0},{"x":380,"y":170,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-380,"y":65,"cMask":["ball"],"cGroup":["red","blue","wall"],"curve":0},{"x":-380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":380,"y":-65,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":380,"y":65,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":420,"y":7,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":420,"y":-7,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":-380,"y":-70,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":380,"y":65,"cMask":[]},{"x":380,"y":-65,"cMask":[]},{"x":0,"y":85,"cMask":[]},{"x":0,"y":-85,"cMask":[]},{"x":0,"y":-310,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":310,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":380,"y":-170,"cMask":["ball"],"cGroup":["ball"],"color":"000000","bias":-60},{"x":380,"y":-65,"cMask":["ball"],"cGroup":["ball"],"color":"000000","bias":-60},{"x":380,"y":65,"cMask":[],"curve":0},{"x":380,"y":-65,"cMask":[],"curve":0},{"x":-380,"y":-65,"curve":-89.99999999,"color":"000000"},{"x":-380,"y":65,"curve":0,"color":"000000"},{"x":-420,"y":-45,"bCoef":0,"curve":0},{"x":-420,"y":45,"bCoef":0,"curve":-89.99999999},{"x":-380,"y":65,"curve":-89.99999999},{"x":-380,"y":65,"cMask":[],"curve":0},{"x":-380,"y":-65,"cMask":[],"curve":0},{"x":-380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"],"curve":0},{"x":-380,"y":-65,"cMask":["ball"],"cGroup":["red","blue","wall"],"color":"000000","curve":0},{"x":-380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"x":-380,"y":-65,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"x":0,"y":200,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"vis":false},{"x":0,"y":-200,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"bias":0,"curve":0,"vis":false}],"segments":[{"v0":0,"v1":1,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":2,"v1":3,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"curve":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"curveF":6.123233995736766e-17},{"v0":10,"v1":11,"curve":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"curveF":6.123233995736766e-17},{"v0":15,"v1":14,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":16,"v1":17,"curve":89.99999999999999,"color":"000000","bCoef":0,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":15,"v1":17,"color":"000000","bCoef":0,"cMask":["red","blue","ball"]},{"v0":18,"v1":19,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"v0":18,"v1":20,"curve":0,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-60},{"v0":19,"v1":24,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":60},{"v0":25,"v1":26,"color":"000000","bCoef":0,"cMask":["ball"]},{"v0":28,"v1":29,"cMask":[]},{"v0":36,"v1":37,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-50},{"v0":37,"v1":38,"color":"000000","cMask":["ball"],"cGroup":["ball"],"bias":-60},{"v0":41,"v1":43,"curve":-89.99999999,"color":"000000"},{"v0":43,"v1":44,"curve":0,"color":"000000","bCoef":0},{"v0":44,"v1":45,"curve":-89.99999999,"color":"000000"},{"v0":46,"v1":47,"curve":0,"cMask":[]},{"v0":50,"v1":51,"curve":0,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"v0":0,"v1":52,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":3,"v1":53,"curve":0,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"bias":0}],"planes":[{"normal":[0,1],"dist":-210,"bCoef":0},{"normal":[0,-1],"dist":-210,"bCoef":0},{"normal":[1,0],"dist":-430,"bCoef":0},{"normal":[-1,0],"dist":-430,"bCoef":0}],"goals":[{"p0":[-390,55],"p1":[-390,-55],"team":"red"},{"p0":[390,55],"p1":[390,-55],"team":"blue"}],"discs":[{"radius":8.75,"invMass":1.11,"pos":[0,0],"color":"FFFFFF","cGroup":["ball","kick","score"],"damping":0.991},{"radius":0,"invMass":0,"pos":[-900,-19],"color":"transparent","bCoef":0,"cMask":["red"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-900,29],"color":"transparent","bCoef":0,"cMask":["blue"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-900,62],"color":"transparent","bCoef":0,"cMask":["red","blue"],"cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[-380,-65],"color":"e56e56","cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[380,-65],"color":"5689e5","cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[380,65],"color":"5689e5","cGroup":["ball"]},{"radius":0,"pos":[-800,-340],"cMask":[]},{"radius":0,"pos":[-800,-340],"cMask":[]},{"radius":0,"pos":[800,-72],"cMask":[]},{"radius":0,"pos":[-800,340],"cMask":[]},{"radius":0,"pos":[800,340],"cMask":[]},{"radius":0,"pos":[-800,340],"cMask":[]},{"radius":0,"pos":[800,340],"cMask":[]},{"radius":8,"invMass":0,"pos":[-380,65],"color":"e56e56","cGroup":["ball"]}],"playerPhysics":{"bCoef":0.4,"damping":0.9605,"acceleration":0.12,"kickStrength":5.75,"cGroup":["red","blue"]},"ballPhysics":"disc0","spawnDistance":280,"canBeStored":false}`
    },
    training: {
        nombre: "LNB Training x1",
        minJugadores: 1,
        maxJugadores: 1,
        soloConUnJugador: true, // Flag especial para indicar que solo se activa con 1 jugador
        hbs: `{"name":"LNB training x1","width":420,"height":200,"bg":{"width":380,"height":170,"kickOffRadius":120,"color":"444444"},"vertexes":[{"x":0,"y":170,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"vis":false},{"x":0,"y":85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-170,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"bias":0,"curve":0,"vis":false},{"x":520,"y":150,"cMask":[]},{"x":520,"y":100,"cMask":[]},{"x":520,"y":-100,"cMask":[]},{"x":-520,"y":150,"cMask":[]},{"x":-520,"y":100,"cMask":[]},{"x":0,"y":85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":-85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":0,"y":85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":-384.8105676799998,"y":-76.16293376,"cMask":["ball"],"cGroup":["red","blue","wall"],"color":"000000","curve":90},{"x":-380,"y":65,"bCoef":0,"cMask":["red","blue","ball"],"color":"000000"},{"x":380,"y":65,"bCoef":2,"cMask":["red","blue","ball"],"color":"000000","curve":90},{"x":420,"y":45,"bCoef":2,"cMask":["ball"],"color":"000000","_selected":"segment","curve":90},{"x":380,"y":-65,"bCoef":2,"cMask":["red","blue","ball"],"color":"000000","curve":90},{"x":420,"y":-42,"bCoef":2,"cMask":["ball"],"color":"000000","curve":90,"_selected":"segment"},{"x":-380,"y":170,"cMask":["ball"],"cGroup":["red","blue","wall"],"curve":0},{"x":380,"y":170,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":-380,"y":65,"cMask":["ball"],"cGroup":["red","blue","wall"],"curve":0},{"x":-380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":380,"y":-65,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":380,"y":65,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":420,"y":7,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":420,"y":-7,"bCoef":0,"cMask":["ball"],"color":"000000"},{"x":-380,"y":-70,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"]},{"x":380,"y":65,"cMask":[]},{"x":380,"y":-65,"cMask":[]},{"x":0,"y":85,"cMask":[]},{"x":0,"y":-85,"cMask":[]},{"x":0,"y":-310,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":310,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":-85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":0,"y":85,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"x":-380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"]},{"x":380,"y":-170,"cMask":["ball"],"cGroup":["ball"],"color":"000000","bias":-60},{"x":380,"y":-65,"cMask":["ball"],"cGroup":["ball"],"color":"000000","bias":-60},{"x":380,"y":65,"cMask":[],"curve":0},{"x":380,"y":-65,"cMask":[],"curve":0},{"x":-380,"y":-65,"bCoef":2,"curve":-90,"color":"000000"},{"x":-380,"y":65,"curve":0,"color":"000000"},{"x":-420,"y":-45,"bCoef":2,"curve":-90},{"x":-420,"y":45,"bCoef":2,"curve":-90},{"x":-380,"y":65,"bCoef":2,"curve":-90},{"x":-380,"y":65,"cMask":[],"curve":0},{"x":-380,"y":-65,"cMask":[],"curve":0},{"x":-380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"],"curve":0},{"x":-380,"y":-65,"cMask":["ball"],"cGroup":["red","blue","wall"],"color":"000000","curve":0},{"x":-380,"y":-170,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"x":-380,"y":-65,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"x":0,"y":200,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"vis":false},{"x":0,"y":-200,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"bias":0,"curve":0,"vis":false}],"segments":[{"v0":0,"v1":1,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":2,"v1":3,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":9,"v1":10,"curve":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"curveF":6.123233995736766e-17},{"v0":10,"v1":11,"curve":180,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"curveF":6.123233995736766e-17},{"v0":15,"v1":14,"curve":90,"color":"000000","bCoef":2,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":16,"v1":17,"curve":90,"color":"000000","bCoef":2,"cMask":["red","blue","ball"],"curveF":1.0000000000000002},{"v0":15,"v1":17,"color":"000000","bCoef":2,"cMask":["red","blue","ball"],"_selected":true},{"v0":18,"v1":19,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"v0":18,"v1":20,"curve":0,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-60},{"v0":19,"v1":24,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":60},{"v0":25,"v1":26,"color":"000000","bCoef":0,"cMask":["ball"]},{"v0":28,"v1":29,"cMask":[]},{"v0":36,"v1":37,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":-50},{"v0":37,"v1":38,"color":"000000","cMask":["ball"],"cGroup":["ball"],"bias":-60},{"v0":41,"v1":43,"curve":-90,"color":"000000","bCoef":2},{"v0":43,"v1":44,"curve":0,"color":"000000","bCoef":2},{"v0":44,"v1":45,"curve":-90,"color":"000000","bCoef":2},{"v0":46,"v1":47,"curve":0,"cMask":[]},{"v0":50,"v1":51,"curve":0,"cMask":["ball"],"cGroup":["red","blue","wall"],"bias":50},{"v0":0,"v1":52,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":3,"v1":53,"curve":0,"vis":false,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"bias":0}],"planes":[{"normal":[0,1],"dist":-210,"bCoef":0},{"normal":[0,-1],"dist":-210,"bCoef":0},{"normal":[1,0],"dist":-430,"bCoef":0},{"normal":[-1,0],"dist":-430,"bCoef":0}],"goals":[],"discs":[{"radius":8.75,"invMass":1.11,"pos":[0,0],"color":"FFFFFF","cGroup":["ball","kick","score"],"damping":0.991},{"radius":0,"invMass":0,"pos":[-900,-19],"color":"transparent","bCoef":0,"cMask":["red"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-900,29],"color":"transparent","bCoef":0,"cMask":["blue"],"cGroup":["ball"]},{"radius":0,"invMass":0,"pos":[-900,62],"color":"transparent","bCoef":0,"cMask":["red","blue"],"cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[-380,-65],"color":"e56e56","cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[380,-65],"color":"5689e5","cGroup":["ball"]},{"radius":8,"invMass":0,"pos":[380,65],"color":"5689e5","cGroup":["ball"]},{"radius":0,"pos":[-800,-340],"cMask":[]},{"radius":0,"pos":[-800,-340],"cMask":[]},{"radius":0,"pos":[800,-72],"cMask":[]},{"radius":0,"pos":[-800,340],"cMask":[]},{"radius":0,"pos":[800,340],"cMask":[]},{"radius":0,"pos":[-800,340],"cMask":[]},{"radius":0,"pos":[800,340],"cMask":[]},{"radius":8,"invMass":0,"pos":[-380,65],"color":"e56e56","cGroup":["ball"]}],"playerPhysics":{"bCoef":0.4,"damping":0.9605,"acceleration":0.12,"kickStrength":5.75,"cGroup":["red","blue"]},"ballPhysics":"disc0","spawnDistance":280,"traits":{},"joints":[],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false}`
    }
};

// VARIABLES GLOBALES
let mapaActual = "training"; // Mapa inicial que será actualizado cuando se configure la sala
let mapaRealmenteAplicado = false; // Flag para verificar que el mapa inicial se haya aplicado correctamente
let adminActual = null;

// SISTEMA DE CONTRASEÑA AUTOMÁTICA (variables ya declaradas arriba)
const INTERVALO_CAMBIO_CONTRASEÑA = 30 * 24 * 60 * 60 * 1000; // 30 días en milisegundos
let timerCambioContraseña = null;

// ESTADO DE LA SALA
let salaEsPublica = roomPublic;
let ultimoEstadoSala = roomPublic;

// FUNCIÓN PARA GENERAR CONTRASEÑA ALEATORIA
function generarContraseñaAleatoria() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// FUNCIÓN PARA CAMBIAR CONTRASEÑA AUTOMÁTICAMENTE
function cambiarContraseñaAutomatica() {
    const nuevaContraseña = generarContraseñaAleatoria();
    contraseñaActual = nuevaContraseña;
    ultimoCambioContraseña = Date.now();
    
    // Cambiar la contraseña en la sala
    room.setPassword(nuevaContraseña);
    
            // Enviar reporte
            enviarOEditarReporteSala("Cambio automático de contraseña mensual", true);
    
    anunciarGeneral(`🔐 ⚠️ CONTRASEÑA CAMBIADA AUTOMÁTICAMENTE ⚠️ 🔐`, "FF6B6B", "bold");
    anunciarGeneral(`🔑 Nueva contraseña: ${nuevaContraseña}`, "FFD700", "bold");
}

// FUNCIÓN PARA PROGRAMAR PRÓXIMO CAMBIO DE CONTRASEÑA
function programarCambioContraseña() {
    const tiempoRestante = INTERVALO_CAMBIO_CONTRASEÑA - (Date.now() - ultimoCambioContraseña);
    
    if (tiempoRestante <= 0) {
        // Ya es hora de cambiar
        cambiarContraseñaAutomatica();
    } else {
        // Programar para el futuro
        if (timerCambioContraseña) {
            clearTimeout(timerCambioContraseña);
        }
        
        timerCambioContraseña = setTimeout(() => {
            cambiarContraseñaAutomatica();
            // Programar el siguiente cambio
            programarCambioContraseña();
        }, tiempoRestante);
        
        const diasRestantes = Math.ceil(tiempoRestante / (24 * 60 * 60 * 1000));
        // Próximo cambio de contraseña programado
    }
}

// FUNCIÓN PARA OBTENER INFORMACIÓN DE LA SALA
function obtenerInfoSala() {
    const jugadores = room.getPlayerList();
    const totalJugadores = jugadores.filter(j => !esBot(j)).length;
    const jugadoresEnJuego = jugadores.filter(j => j.team === 1 || j.team === 2).length;
    
    // Obtener enlace de la sala (simulado ya que no tenemos acceso directo)
    const enlaceSala = `[Enlace no disponible desde el bot]`;
    
    // Determinar estado del partido
    let estadoPartido = "En espera";
    let tiempoPartido = "--:--";
    let resultadoActual = "0 - 0";
    
    if (partidoEnCurso) {
        const scores = room.getScores();
        if (scores) {
            const minutos = Math.floor(scores.time / 60);
            const segundos = Math.floor(scores.time % 60);
            tiempoPartido = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            resultadoActual = `${scores.red} - ${scores.blue}`;
            estadoPartido = "En partido";
        }
    }
    
    return {
        nombre: roomName,
        enlace: enlaceSala,
        jugadoresTotales: totalJugadores,
        jugadoresEnJuego: jugadoresEnJuego,
        maxJugadores: maxPlayers,
        contraseña: contraseñaActual,
        esPublica: salaEsPublica,
        estadoPartido,
        tiempoPartido,
        resultadoActual
    };
}

// FUNCIÓN ELIMINADA: enviarReporteSala (generaba spam de mensajes nuevos)
// Se usa enviarOEditarReporteSala en su lugar para editar mensajes existentes

// FUNCIÓN PARA DETECTAR CAMBIOS EN EL ESTADO DE LA SALA
function verificarCambioEstadoSala() {
    const esPublicaAhora = room.getPassword() === null;
    
    if (esPublicaAhora !== salaEsPublica) {
        const estadoAnterior = salaEsPublica ? "pública" : "privada";
        const estadoNuevo = esPublicaAhora ? "pública" : "privada";
        
        salaEsPublica = esPublicaAhora;
        
        // Estado de sala cambió
        
        // Enviar reporte del cambio
        const razon = `Admin cambió sala de ${estadoAnterior} a ${estadoNuevo}`;
        enviarOEditarReporteSala(razon);
        
        anunciarGeneral(`🔄 La sala cambió de ${estadoAnterior} a ${estadoNuevo}`, "87CEEB", "bold");
    }
}
let estadisticasPartido = {
    jugadores: {},
    golesRed: 0,
    golesBlue: 0,
    iniciado: false,
    duracion: 0,
    mejorJugador: null,
    arqueroRed: null,
    arqueroBlue: null,
    tiempoVallaInvictaRed: 0,
    tiempoVallaInvictaBlue: 0
};
let replayActual = null;
let partidoEnCurso = false;
let replayData = null; // Datos del replay para enviar a Discord
let tiempoInicioPartido = null; // Timestamp de inicio del partido
let reporteEnviado = false; // Flag para evitar envíos duplicados

// SISTEMA DE ESTADÍSTICAS PERSISTENTES
let estadisticasGlobales = {
    jugadores: {}, // {identificadorUnico: {nombre, partidos, goles, etc}}
    records: {
        mayorGoles: {jugador: "", cantidad: 0, fecha: ""},
        mayorAsistencias: {jugador: "", cantidad: 0, fecha: ""},
        partidoMasLargo: {duracion: 0, fecha: "", equipos: ""},
        goleadaMasGrande: {diferencia: 0, resultado: "", fecha: ""},
        hatTricks: [], // [{jugador, fecha, goles}]
        vallasInvictas: [] // [{jugador, tiempo, fecha}]
    },
    totalPartidos: 0,
    fechaCreacion: new Date().toISOString(),
    contadorJugadores: 0 // Para generar IDs únicos
};

// Mapeo de jugadores activos en la sesión actual
let jugadoresActivos = new Map(); // {playerID: identificadorUnico}

// SISTEMA AUTO START/STOP
let autoStartEnabled = true;
let autoStopEnabled = true;
let minJugadoresParaIniciar = 2; // Mínimo de jugadores para auto start (se ajustará según el mapa)
let tiempoEsperaInicio = 300; // 0.3 segundos de espera antes de iniciar (ULTRA RÁPIDO)
let timeoutAutoStart = null;
let mensajeAutoStartMostrado = false; // Controla si ya se mostró el mensaje de auto-start

// SISTEMA DE BLOQUEO DE AUTO-START PARA REPLAY
let bloqueadoPorReplay = false; // Bloquea auto-start hasta completar envío de replay
let intentosAutoStartBloqueados = 0; // Contador de intentos bloqueados

// SISTEMA AFK
let jugadoresAFK = new Map(); // {id: {ultimaActividad: timestamp, posicionAnterior: {x, y}}}
const TIEMPO_AFK = 15000; // 15 segundos en milisegundos para mover a espectadores
const TIEMPO_AFK_KICK = 120000; // 2 minutos en milisegundos para kickear por inactividad
const TIEMPO_AFK_SALA_LLENA = 120000; // 2 minutos en milisegundos para expulsar cuando sala está llena
const MINIMO_MOVIMIENTO_AFK = 2; // Distancia mínima para no ser considerado AFK
const COOLDOWN_COMANDO = 15000; // 15 segundos de cooldown para comandos
let intervalAFK = null;

// SISTEMA DE BLOQUEO DE MOVIMIENTO - BLOQUEO PERMANENTE
let bloqueoMovimientoActivo = true; // Variable para bloquear SIEMPRE el movimiento manual entre equipos
let equiposJugadoresAntesMovimiento = new Map(); // Para rastrear posiciones antes del movimiento
let mezclaProcesandose = false; // Variable para evitar múltiples llamadas durante la mezcla
let movimientoPermitidoPorComando = new Set(); // IDs de jugadores que tienen permitido moverse temporalmente por comandos
let movimientoIniciadorPorBot = new Set(); // Set para tracking movimientos iniciados por el bot

// Variables para el seguimiento de la pelota
let ultimoTocador = null;
let penultimoTocador = null;
let tiempoUltimoToque = 0;

// Sistema de mensajes personalizados
let mensajesPersonalizados = new Map(); // {id: {gol: "mensaje", asistencia: "mensaje"}}

// Sistema de votación para llamar admin
let votacionLlamarAdmin = {
    activa: false,
    iniciador: null,
    mensaje: "",
    votos: new Set(), // IDs de jugadores que han votado
    tiempoInicio: 0,
    timeout: null
};

// Sistema de cooldown para llamar admin (30 minutos)
let cooldownLlamarAdmin = {
    ultimoUso: 0,
    duracionCooldown: 30 * 60 * 1000 // 30 minutos en milisegundos
};

// Sistema de Piedra, Papel o Tijeras
let desafiosPPT = new Map(); // {desafiadorID: {oponente, jugadaDesafiador, tiempoInicio, timeout}}

// SISTEMA DE MODERACIÓN
let jugadoresMuteados = new Set(); // IDs de jugadores silenciados permanentemente
let jugadoresMuteadosTemporales = new Map(); // {playerID: {finMute: timestamp, razon: string, timeoutId: timeoutId}}

// SISTEMA PARA MANEJAR SALIDAS VOLUNTARIAS
let jugadoresSaliendoVoluntariamente = new Set(); // IDs de jugadores que están saliendo voluntariamente (!nv, !bb)

// SISTEMA DE UID PARA BANEOS
let jugadoresBaneadosUID = new Map(); // {auth: {nombre: string, razon: string, fecha: string, admin: string, duracion?: number}}
let jugadoresUID = new Map(); // {playerID: auth} - Mapeo temporal de IDs a UIDs

// SISTEMA DE TRACKING DE JUGADORES PARA WEBHOOK DISCORD
let jugadoresTracker = new Map(); // {auth: {nombres: Set(nombres), ips: Set(ips), primeraConexion: timestamp, ultimaConexion: timestamp}}
let historialNombresJugadores = new Map(); // {playerID: {auth: string, nombres: Array(nombres)}}
const WEBHOOK_JUGADORES_URL = "https://discord.com/api/webhooks/1409271835018919947/eIXwPUhKsuGSm8pYYIV44nX6dwBJJyKktPjMyB6iNXvuV7Bo6F3_1WMwDxvrG-Qj9EEo";

// SISTEMA DE PROTECCIÓN CONTRA MÚLTIPLES CONEXIONES DEL MISMO NAVEGADOR
const MAX_JUGADORES_POR_IP = 1; // Máximo 1 jugador por navegador/IP
let conexionesPorAuth = new Map(); // {auth: {jugadores: Set(playerIDs), timestamp: number}}
let jugadoresPorAuth = new Map(); // {playerID: auth} - Mapeo temporal de IDs a UIDs
let conexionesPorIP = new Map(); // {ip: {jugadores: Set(playerIDs), timestamp: number}}
let jugadoresPorIP = new Map(); // {playerID: ip} - Mapeo de jugador a IP
const TIEMPO_LIMITE_IP = 30 * 60 * 1000; // 30 minutos de gracia para la misma IP
let ipsBloqueadas = new Map(); // {ip: {razon: string, timestamp: number}} - IPs temporalmente bloqueadas

// ==================== FUNCIONES AUXILIARES PARA PROTECCIÓN IP ====================

/**
 * Obtiene un identificador único de conexión para el jugador
 * @param {Object} jugador - El objeto jugador
 * @returns {string|null} - El identificador único de conexión
 */
function obtenerIdentificadorConexion(jugador) {
    try {
        // Para detectar el mismo navegador, usamos solo factores que sean iguales entre pestañas
        let identificadores = [];
        
        // 1. Auth del jugador (MISMO para todas las pestañas del mismo navegador)
        if (jugador && jugador.auth) {
            identificadores.push(`auth:${jugador.auth}`);
        } else {
            // Si no hay auth, usar una combinación del nombre y conexión base
            if (jugador && jugador.name) {
                identificadores.push(`name:${jugador.name}`);
            }
            // Agregar un identificador por defecto para navegadores sin auth
            identificadores.push('noauth:default');
        }
        
        // NO incluir ID único ni timestamp para que sea igual entre pestañas
        
        // Crear identificador consistente para el mismo navegador
        const identificadorCompleto = identificadores.join('|');
        const hash = simpleHash(identificadorCompleto);
        
        // Generar "IP simulada" basada solo en factores consistentes
        return `192.168.${Math.floor(hash / 256) % 256}.${hash % 256}`;
        
    } catch (error) {
        console.error(`❌ Error obteniendo identificador para jugador ${jugador?.name}:`, error);
        return null;
    }
}

/**
 * Detecta si un jugador está usando múltiples pestañas/conexiones
 * @param {Object} jugador - El objeto jugador
 * @returns {boolean} - True si se detectan múltiples conexiones
 */
function detectarMultiplesConexiones(jugador) {
    try {
        if (!jugador) {
            return false;
        }
        
        console.log(`🔍 DEBUG: Verificando múltiples conexiones para ${jugador.name} (ID: ${jugador.id}, Auth: ${jugador.auth})`);
        
        // Obtener todos los jugadores conectados EXCLUYENDO al jugador actual
        const jugadoresConectados = room.getPlayerList().filter(j => j.id !== jugador.id);
        
        console.log(`🔍 DEBUG: Jugadores ya conectados: ${jugadoresConectados.length}`);
        jugadoresConectados.forEach(j => {
            console.log(`  - ${j.name} (ID: ${j.id}, Auth: ${j.auth})`);
        });
        
        // MÉTODO 1: Verificar por AUTH (más confiable)
        if (jugador.auth) {
            const jugadoresConMismoAuth = jugadoresConectados.filter(j => 
                j.auth && j.auth === jugador.auth
            );
            
            if (jugadoresConMismoAuth.length > 0) {
                console.log(`🚫 DEBUG: Detectadas ${jugadoresConMismoAuth.length} conexiones con el mismo AUTH: ${jugador.auth}`);
                jugadoresConMismoAuth.forEach(j => {
                    console.log(`  - Jugador duplicado: ${j.name} (ID: ${j.id})`);
                });
                return true;
            }
        }
        
        // MÉTODO 2: Verificar por IP simulada como respaldo
        /*
        const ipJugador = obtenerIdentificadorConexion(jugador);
        if (ipJugador) {
            const jugadoresConMismaIP = jugadoresConectados.filter(j => {
                const ipOtroJugador = obtenerIdentificadorConexion(j);
                return ipOtroJugador === ipJugador;
            });
            
            if (jugadoresConMismaIP.length > 0) {
                console.log(`🚫 DEBUG: Detectadas ${jugadoresConMismaIP.length} conexiones con la misma IP: ${ipJugador}`);
                jugadoresConMismaIP.forEach(j => {
                    console.log(`  - Jugador con misma IP: ${j.name} (ID: ${j.id})`);
                });
                return true;
            }
        }
        */
        
        console.log(`✅ DEBUG: No se detectaron múltiples conexiones para ${jugador.name}`);
        return false;
        
    } catch (error) {
        console.error(`❌ Error detectando múltiples conexiones:`, error);
        return false;
    }
}

/**
 * Obtiene la IP de un jugador (mantenida para compatibilidad)
 * @param {Object} jugador - El objeto jugador
 * @returns {string|null} - La IP del jugador o null si no se puede obtener
 */
function obtenerIPJugador(jugador) {
    // Redirigir a la nueva función
    return obtenerIdentificadorConexion(jugador);
}

/**
 * Función hash simple para generar IPs consistentes
 * @param {string} str - String a hashear
 * @returns {number} - Valor hash
 */
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Limpia las conexiones IP de un jugador específico
 * @param {Object} jugador - El jugador que se desconectó
 */
function limpiarConexionesIP(jugador) {
    try {
        const ipJugador = jugadoresPorIP.get(jugador.id);
        
        if (ipJugador) {
            console.log(`🧹 DEBUG IP: Limpiando conexión de ${jugador.name} (IP: ${ipJugador})`);
            
            // Remover el jugador del mapeo
            jugadoresPorIP.delete(jugador.id);
            
            // Actualizar la lista de conexiones de esta IP
            const conexionIP = conexionesPorIP.get(ipJugador);
            if (conexionIP) {
                conexionIP.jugadores.delete(jugador.id);
                
                // Si no quedan más jugadores de esta IP, eliminar la entrada
                if (conexionIP.jugadores.size === 0) {
                    conexionesPorIP.delete(ipJugador);
                    console.log(`🧹 DEBUG IP: IP ${ipJugador} completamente limpia`);
                    
                    // *** IMPORTANTE: Limpiar también el bloqueo temporal si no hay más conexiones ***
                    const bloqueIP = ipsBloqueadas.get(ipJugador);
                    if (bloqueIP) {
                        ipsBloqueadas.delete(ipJugador);
                        console.log(`🔓 DEBUG IP: Bloqueo temporal removido para IP ${ipJugador} (jugador desconectado)`);
                    }
                } else {
                    console.log(`🧹 DEBUG IP: IP ${ipJugador} aún tiene ${conexionIP.jugadores.size} conexiones`);
                }
            }
        } else {
            console.log(`⚠️ DEBUG IP: No se encontró IP para jugador ${jugador.name} al limpiar`);
        }
    } catch (error) {
        console.error(`❌ Error limpiando conexiones IP para ${jugador?.name}:`, error);
    }
}

/**
 * Envía notificación sobre IP bloqueada (Discord webhook si está disponible)
 * @param {string} ip - La IP bloqueada
 * @param {string} nombreJugador - Nombre del jugador que intentó conectarse
 * @param {string} jugadoresConectados - Lista de jugadores ya conectados desde esa IP
 */
function enviarNotificacionIPBloqueada(ip, nombreJugador, jugadoresConectados) {
    try {
        console.log(`🚫 NOTIFICACIÓN IP BLOQUEADA:`);
        console.log(`   IP: ${ip}`);
        console.log(`   Jugador rechazado: ${nombreJugador}`);
        console.log(`   Jugadores ya conectados: ${jugadoresConectados}`);
        console.log(`   Tiempo: ${new Date().toISOString()}`);
        
        // Si tienes webhook de Discord configurado, enviar notificación
        if (typeof enviarDiscordEmbed === 'function') {
            const embed = {
                title: "🚫 IP Bloqueada - Múltiples Conexiones",
                description: `Se bloqueó temporalmente la IP **${ip}** por intentos de múltiples conexiones.`,
                color: 0xFF0000, // Rojo
                fields: [
                    {
                        name: "Jugador Rechazado",
                        value: nombreJugador,
                        inline: true
                    },
                    {
                        name: "Ya Conectados",
                        value: jugadoresConectados || "Ninguno",
                        inline: true
                    },
                    {
                        name: "Límite",
                        value: `${MAX_JUGADORES_POR_IP} jugadores por red`,
                        inline: true
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Sistema de Protección LNB"
                }
            };
            
            enviarDiscordEmbed(embed, "Protección IP activada");
        }
        
        // Log adicional para estadísticas
        console.log(`📊 ESTADÍSTICA IP: Bloqueo de IP registrado - Total IPs bloqueadas: ${ipsBloqueadas.size}`);
        
    } catch (error) {
        console.error(`❌ Error enviando notificación de IP bloqueada:`, error);
    }
}

/**
 * Limpia IPs bloqueadas que han expirado
 */
function limpiarIPsBloqueadasExpiradas() {
    try {
        const ahora = Date.now();
        let limpiezasRealizadas = 0;
        
        for (const [ip, bloqueo] of ipsBloqueadas.entries()) {
            if (ahora - bloqueo.timestamp >= TIEMPO_LIMITE_IP) {
                ipsBloqueadas.delete(ip);
                limpiezasRealizadas++;
                console.log(`🧹 DEBUG IP: Bloqueo expirado removido para IP ${ip}`);
            }
        }
        
        if (limpiezasRealizadas > 0) {
            console.log(`🧹 DEBUG IP: Se limpiaron ${limpiezasRealizadas} bloqueos de IP expirados`);
        }
    } catch (error) {
        console.error(`❌ Error limpiando IPs bloqueadas expiradas:`, error);
    }
}

/**
 * Obtiene estadísticas de conexiones IP
 * @returns {Object} - Estadísticas de las conexiones IP
 */
function obtenerEstadisticasIP() {
    try {
        const stats = {
            conexiones_activas: conexionesPorIP.size,
            ips_bloqueadas: ipsBloqueadas.size,
            total_jugadores_conectados: jugadoresPorIP.size,
            conexiones_multiples: 0,
            detalle_conexiones: []
        };
        
        // Analizar conexiones múltiples
        for (const [ip, conexion] of conexionesPorIP.entries()) {
            if (conexion.jugadores.size > 1) {
                stats.conexiones_multiples++;
                
                // Obtener nombres de jugadores
                const nombres = Array.from(conexion.jugadores).map(playerId => {
                    const jugador = room.getPlayerList().find(p => p.id === playerId);
                    return jugador ? jugador.name : `ID:${playerId}`;
                });
                
                stats.detalle_conexiones.push({
                    ip: ip,
                    cantidad: conexion.jugadores.size,
                    jugadores: nombres
                });
            }
        }
        
        return stats;
    } catch (error) {
        console.error(`❌ Error obteniendo estadísticas IP:`, error);
        return {
            conexiones_activas: 0,
            ips_bloqueadas: 0,
            total_jugadores_conectados: 0,
            conexiones_multiples: 0,
            detalle_conexiones: [],
            error: error.message
        };
    }
}

// Limpieza automática de IPs bloqueadas cada 10 minutos
setInterval(limpiarIPsBloqueadasExpiradas, 10 * 60 * 1000);

// ==================== FIN FUNCIONES AUXILIARES PARA PROTECCIÓN IP ====================

// ==================== SISTEMA DE TRACKING DE JUGADORES PARA WEBHOOK ====================

/**
 * Registra o actualiza los datos de tracking de un jugador
 * @param {Object} jugador - El objeto jugador de HaxBall
 */
function trackearJugador(jugador) {
    try {
        if (!jugador || !jugador.auth) {
            console.log(`⚠️ TRACKING: No se puede trackear jugador sin auth: ${jugador?.name}`);
            return;
        }
        
        const auth = jugador.auth;
        const nombre = jugador.name;
        const ipSimulada = obtenerIdentificadorConexion(jugador);
        const ahora = Date.now();
        
        console.log(`📊 TRACKING: Registrando jugador ${nombre} (Auth: ${auth}, IP: ${ipSimulada})`);
        
        // Obtener o crear datos de tracking para este auth
        let datosTracking = jugadoresTracker.get(auth);
        
        if (!datosTracking) {
            // Primera vez que vemos este auth
            datosTracking = {
                nombres: new Set([nombre]),
                ips: new Set([ipSimulada]),
                primeraConexion: ahora,
                ultimaConexion: ahora,
                totalConexiones: 1,
                conexionesHoy: 1,
                ultimaFechaConexion: new Date().toISOString().split('T')[0] // Solo la fecha
            };
            
            console.log(`✨ TRACKING: Nuevo jugador registrado - Auth: ${auth}`);
        } else {
            // Actualizar datos existentes
            datosTracking.nombres.add(nombre);
            if (ipSimulada) {
                datosTracking.ips.add(ipSimulada);
            }
            datosTracking.ultimaConexion = ahora;
            datosTracking.totalConexiones = (datosTracking.totalConexiones || 0) + 1;
            
            // Actualizar conexiones de hoy
            const fechaHoy = new Date().toISOString().split('T')[0];
            if (datosTracking.ultimaFechaConexion !== fechaHoy) {
                datosTracking.conexionesHoy = 1;
                datosTracking.ultimaFechaConexion = fechaHoy;
            } else {
                datosTracking.conexionesHoy = (datosTracking.conexionesHoy || 0) + 1;
            }
            
            console.log(`🔄 TRACKING: Datos actualizados para Auth: ${auth}`);
            console.log(`   - Nombres totales: ${datosTracking.nombres.size}`);
            console.log(`   - IPs totales: ${datosTracking.ips.size}`);
            console.log(`   - Conexiones hoy: ${datosTracking.conexionesHoy}`);
        }
        
        // Guardar en el Map principal
        jugadoresTracker.set(auth, datosTracking);
        
        // Actualizar historial de nombres para esta sesión
        actualizarHistorialNombres(jugador, auth);
        
        console.log(`✅ TRACKING: Jugador ${nombre} trackeado correctamente`);
        
    } catch (error) {
        console.error(`❌ Error en trackearJugador:`, error);
    }
}

/**
 * Actualiza el historial de nombres para la sesión actual
 * @param {Object} jugador - El objeto jugador de HaxBall
 * @param {string} auth - El auth del jugador
 */
function actualizarHistorialNombres(jugador, auth) {
    try {
        if (!jugador || !auth) {
            return;
        }
        
        // Obtener o crear historial para este jugador en la sesión
        let historial = historialNombresJugadores.get(jugador.id);
        
        if (!historial) {
            historial = {
                auth: auth,
                nombres: [jugador.name],
                inicioSesion: Date.now()
            };
        } else {
            // Agregar el nombre si no existe ya
            if (!historial.nombres.includes(jugador.name)) {
                historial.nombres.push(jugador.name);
            }
        }
        
        historialNombresJugadores.set(jugador.id, historial);
        
        console.log(`📝 HISTORIAL: Actualizado para ${jugador.name} - Total nombres en sesión: ${historial.nombres.length}`);
        
    } catch (error) {
        console.error(`❌ Error actualizando historial de nombres:`, error);
    }
}

/**
 * Obtiene datos completos de un jugador para el reporte
 * @param {Object} jugador - El objeto jugador de HaxBall
 * @param {string} tipoEvento - Tipo de evento ("join", "leave", "kick", "ban")
 * @returns {Object} - Datos del jugador para el reporte
 */
function obtenerDatosJugadorParaReporte(jugador, tipoEvento = "join") {
    try {
        const auth = jugador.auth || "Sin Auth";
        const ipSimulada = obtenerIdentificadorConexion(jugador) || "Desconocida";
        const datosTracking = jugadoresTracker.get(auth);
        const historialSesion = historialNombresJugadores.get(jugador.id);
        
        // Datos básicos del jugador
        const datosBasicos = {
            nombre: jugador.name,
            id: jugador.id,
            auth: auth,
            ip: ipSimulada,
            tipoEvento: tipoEvento,
            timestamp: Date.now(),
            fecha: new Date().toISOString()
        };
        
        // Datos de tracking (historial completo)
        const datosHistorial = {
            esNuevoJugador: !datosTracking,
            nombresHistoricos: datosTracking ? Array.from(datosTracking.nombres) : [jugador.name],
            ipsHistoricas: datosTracking ? Array.from(datosTracking.ips) : [ipSimulada],
            primeraVezVisto: datosTracking ? new Date(datosTracking.primeraConexion).toISOString() : new Date().toISOString(),
            ultimaConexionAnterior: datosTracking ? new Date(datosTracking.ultimaConexion).toISOString() : null,
            totalConexionesHistoricas: datosTracking ? datosTracking.totalConexiones : 1,
            conexionesHoy: datosTracking ? datosTracking.conexionesHoy : 1
        };
        
        // Datos de la sesión actual
        const datosSesion = {
            nombresEnSesion: historialSesion ? historialSesion.nombres : [jugador.name],
            tiempoEnSesion: historialSesion ? Date.now() - historialSesion.inicioSesion : 0
        };
        
        // Datos del estado actual de la sala
        const jugadoresEnSala = room.getPlayerList().filter(j => j.id !== 0);
        const datosSala = {
            jugadoresConectados: jugadoresEnSala.length,
            maxJugadores: room.getConfig?.()?.maxPlayers || maxPlayers,
            nombresSala: jugadoresEnSala.map(j => j.name),
            hayPartidoEnCurso: room.getGame?.()?.isRunning || false
        };
        
        return {
            ...datosBasicos,
            historial: datosHistorial,
            sesion: datosSesion,
            sala: datosSala
        };
        
    } catch (error) {
        console.error(`❌ Error obteniendo datos para reporte:`, error);
        return {
            nombre: jugador?.name || "Desconocido",
            id: jugador?.id || 0,
            auth: jugador?.auth || "Sin Auth",
            tipoEvento: tipoEvento,
            error: error.message
        };
    }
}

/**
 * Envía un reporte de jugador al webhook de Discord
 * @param {Object} datosJugador - Datos del jugador obtenidos de obtenerDatosJugadorParaReporte
 * @param {string} razonAdicional - Razón adicional para eventos como kick o ban
 */
function enviarReporteJugadorDiscord(datosJugador, razonAdicional = null) {
    try {
        if (!WEBHOOK_JUGADORES_URL) {
            console.log(`⚠️ WEBHOOK: URL del webhook no configurada`);
            return;
        }
        
        console.log(`📤 WEBHOOK: Enviando reporte de ${datosJugador.tipoEvento} para ${datosJugador.nombre}`);
        
        // Determinar color y emoji según el tipo de evento
        let color = 0x87CEEB; // Celeste por defecto
        let emoji = "👋";
        let titulo = "Jugador Conectado";
        
        switch (datosJugador.tipoEvento) {
            case "join":
                color = 0x00FF00; // Verde
                emoji = "🟢";
                titulo = "Jugador Conectado";
                break;
            case "leave":
                color = 0xFFA500; // Naranja
                emoji = "🟠";
                titulo = "Jugador Desconectado";
                break;
            case "kick":
                color = 0xFF6B6B; // Rojo claro
                emoji = "🔴";
                titulo = "Jugador Expulsado";
                break;
            case "ban":
                color = 0xFF0000; // Rojo
                emoji = "🚫";
                titulo = "Jugador Baneado";
                break;
        }
        
        // Crear embed principal
        const embed = {
            title: `${emoji} ${titulo}`,
            color: color,
            timestamp: datosJugador.fecha,
            footer: {
                text: "Sistema de Tracking LNB",
                icon_url: "https://i.imgur.com/4M34hi2.png"
            },
            fields: [
                {
                    name: "👤 Información del Jugador",
                    value: `**Nombre:** ${datosJugador.nombre}\n**Auth:** \`${datosJugador.auth}\`\n**ID:** ${datosJugador.id}`,
                    inline: true
                },
                {
                    name: "🌐 Conexión",
                    value: `**IP:** \`${datosJugador.ip}\`\n**Conexiones Hoy:** ${datosJugador.historial.conexionesHoy}`,
                    inline: true
                },
                {
                    name: "🏠 Estado de la Sala",
                    value: `**Jugadores:** ${datosJugador.sala.jugadoresConectados}/${datosJugador.sala.maxJugadores}\n**Partido:** ${datosJugador.sala.hayPartidoEnCurso ? '🟢 Activo' : '🔴 Detenido'}`,
                    inline: true
                }
            ]
        };
        
        // Agregar información de historial si no es un jugador nuevo
        if (!datosJugador.historial.esNuevoJugador) {
            const nombresHistoricos = datosJugador.historial.nombresHistoricos.slice(0, 5); // Solo primeros 5
            const nombresTexto = nombresHistoricos.length > 5 
                ? nombresHistoricos.slice(0, 4).join(', ') + `, +${nombresHistoricos.length - 4} más`
                : nombresHistoricos.join(', ');
                
            embed.fields.push({
                name: "📚 Historial",
                value: `**Primera vez visto:** <t:${Math.floor(new Date(datosJugador.historial.primeraVezVisto).getTime() / 1000)}:R>\n**Total conexiones:** ${datosJugador.historial.totalConexionesHistoricas}\n**Nombres usados:** ${nombresTexto}`,
                inline: false
            });
        } else {
            embed.fields.push({
                name: "✨ Jugador Nuevo",
                value: "Este es la primera vez que vemos a este jugador",
                inline: false
            });
        }
        
        // Agregar información de sesión actual
        if (datosJugador.sesion.nombresEnSesion.length > 1) {
            embed.fields.push({
                name: "📝 En esta sesión",
                value: `**Nombres usados:** ${datosJugador.sesion.nombresEnSesion.join(', ')}\n**Tiempo en sala:** ${Math.floor(datosJugador.sesion.tiempoEnSesion / 60000)} minutos`,
                inline: false
            });
        }
        
        // Agregar razón adicional si la hay (para kicks/bans)
        if (razonAdicional) {
            embed.fields.push({
                name: "⚠️ Motivo",
                value: razonAdicional,
                inline: false
            });
        }
        
        // Crear payload completo
        const payload = {
            embeds: [embed],
            username: "LNB Tracker Bot",
            avatar_url: "https://i.imgur.com/4M34hi2.png"
        };
        
        // Enviar webhook
        enviarWebhook(WEBHOOK_JUGADORES_URL, payload)
            .then(() => {
                console.log(`✅ WEBHOOK: Reporte enviado exitosamente para ${datosJugador.nombre}`);
            })
            .catch(error => {
                console.error(`❌ WEBHOOK: Error enviando reporte:`, error);
            });
            
    } catch (error) {
        console.error(`❌ Error en enviarReporteJugadorDiscord:`, error);
    }
}

/**
 * Función helper para enviar webhook HTTP
 * @param {string} webhookUrl - URL del webhook
 * @param {Object} payload - Datos a enviar
 * @returns {Promise} - Promesa del envío
 */
function enviarWebhook(webhookUrl, payload) {
    return new Promise((resolve, reject) => {
        try {
            // Prioridad 1: Usar nodeEnviarWebhook si está disponible (más confiable)
            if (typeof nodeEnviarWebhook === 'function') {
                console.log(`📤 WEBHOOK: Usando nodeEnviarWebhook para mejor compatibilidad`);
                
                nodeEnviarWebhook(webhookUrl, payload)
                    .then(response => {
                        console.log(`✅ WEBHOOK: Enviado exitosamente con nodeEnviarWebhook`);
                        resolve(response);
                    })
                    .catch(error => {
                        console.log(`⚠️ WEBHOOK: Error con nodeEnviarWebhook, intentando fallback con fetch`);
                        // Fallback a fetch si nodeEnviarWebhook falla
                        enviarWebhookConFetch(webhookUrl, payload)
                            .then(resolve)
                            .catch(reject);
                    });
                return;
            }
            
            // Fallback: Usar fetch si nodeEnviarWebhook no está disponible
            console.log(`📤 WEBHOOK: nodeEnviarWebhook no disponible, usando fetch como fallback`);
            enviarWebhookConFetch(webhookUrl, payload)
                .then(resolve)
                .catch(reject);
                
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Función fallback para enviar webhook usando fetch
 * @param {string} webhookUrl - URL del webhook
 * @param {Object} payload - Datos a enviar
 * @returns {Promise} - Promesa del envío
 */
function enviarWebhookConFetch(webhookUrl, payload) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof fetch === 'undefined') {
                console.log(`⚠️ WEBHOOK: fetch no disponible, webhook omitido`);
                resolve();
                return;
            }
            
            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if (response.ok) {
                    console.log(`✅ WEBHOOK: Enviado exitosamente con fetch`);
                    resolve(response);
                } else {
                    reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                }
            })
            .catch(error => {
                reject(error);
            });
            
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Limpia datos de tracking de jugadores desconectados
 * (Solo limpia datos de la sesión, mantiene el historial persistente)
 */
function limpiarDatosTrackingDesconectados() {
    try {
        if (typeof room === 'undefined' || !room || !room.getPlayerList) {
            return;
        }
        
        const jugadoresActuales = new Set(room.getPlayerList().map(j => j.id));
        let limpiezasRealizadas = 0;
        
        // Limpiar historial de nombres de la sesión para jugadores desconectados
        for (const [playerId] of historialNombresJugadores.entries()) {
            if (!jugadoresActuales.has(playerId)) {
                historialNombresJugadores.delete(playerId);
                limpiezasRealizadas++;
            }
        }
        
        if (limpiezasRealizadas > 0) {
            console.log(`🧹 TRACKING: Limpiados ${limpiezasRealizadas} historiales de sesión de jugadores desconectados`);
        }
        
    } catch (error) {
        console.error(`❌ Error limpiando datos de tracking:`, error);
    }
}

/**
 * Obtiene estadísticas del sistema de tracking
 * @returns {Object} - Estadísticas del tracking
 */
function obtenerEstadisticasTracking() {
    try {
        const stats = {
            jugadores_unicos_historicos: jugadoresTracker.size,
            jugadores_en_sesion_actual: historialNombresJugadores.size,
            total_nombres_unicos: 0,
            total_ips_unicas: 0,
            jugadores_nuevos_hoy: 0,
            conexiones_totales_hoy: 0
        };
        
        const fechaHoy = new Date().toISOString().split('T')[0];
        const nombresUnicos = new Set();
        const ipsUnicas = new Set();
        
        // Analizar datos de tracking
        for (const [auth, datos] of jugadoresTracker.entries()) {
            // Contar nombres únicos
            datos.nombres.forEach(nombre => nombresUnicos.add(nombre));
            
            // Contar IPs únicas
            datos.ips.forEach(ip => ipsUnicas.add(ip));
            
            // Contar jugadores nuevos y conexiones de hoy
            if (datos.ultimaFechaConexion === fechaHoy) {
                stats.conexiones_totales_hoy += datos.conexionesHoy;
                
                // Es nuevo si su primera conexión fue hoy
                const fechaPrimeraConexion = new Date(datos.primeraConexion).toISOString().split('T')[0];
                if (fechaPrimeraConexion === fechaHoy) {
                    stats.jugadores_nuevos_hoy++;
                }
            }
        }
        
        stats.total_nombres_unicos = nombresUnicos.size;
        stats.total_ips_unicas = ipsUnicas.size;
        
        return stats;
        
    } catch (error) {
        console.error(`❌ Error obteniendo estadísticas de tracking:`, error);
        return {
            error: error.message,
            jugadores_unicos_historicos: 0,
            jugadores_en_sesion_actual: 0
        };
    }
}

// Limpieza automática de datos de tracking cada 5 minutos
setInterval(limpiarDatosTrackingDesconectados, 5 * 60 * 1000);

// ==================== FIN SISTEMA DE TRACKING DE JUGADORES ====================


// FUNCIÓN AUXILIAR PARA OBTENER JUGADORES SIN HOST
function obtenerJugadoresSinHost() {
    return room.getPlayerList().filter(j => j.id !== 0); // Filtrar Host (ID 0)
}

// FUNCIÓN PARA VERIFICAR SI UN JUGADOR ES EL BOT
function esBot(jugador) {
    if (!jugador) return false;
    return jugador.name === "HOST LNB" || jugador.id === 0;
}

// FUNCIÓN DE PROTECCIÓN CONTRA MOVIMIENTO DEL BOT
function protegerBot(jugadorAMover, accion = "mover") {
    if (esBot(jugadorAMover)) {
        return true; // Permitir la acción si es el bot
    }
    // Protección silenciosa para jugadores normales
    return false; // Bloquear la acción
}

// FUNCIÓN AUXILIAR PARA BUSCAR JUGADORES
function obtenerJugadorPorNombre(nombre) {
    const jugadores = obtenerJugadoresSinHost(); // Usar función sin Host
    
    // Limpiar el nombre de entrada
    const nombreLimpio = nombre.trim().replace(/^@/, '');
    const nombreBusqueda = nombreLimpio.toLowerCase();
    
    console.log(`🔍 DEBUG búsqueda: Buscando jugador "${nombreLimpio}" (original: "${nombre}")`);
    
    // 1. Buscar coincidencia exacta primero
    let jugadorEncontrado = jugadores.find(j => {
        const nombreJugador = j.name.toLowerCase();
        const nombreOriginal = obtenerNombreOriginal(j).toLowerCase();
        
        return nombreJugador === nombreBusqueda || nombreOriginal === nombreBusqueda;
    });
    
    if (jugadorEncontrado) {
        console.log(`✅ DEBUG búsqueda: Coincidencia exacta encontrada: ${jugadorEncontrado.name}`);
        return jugadorEncontrado;
    }
    
    // 2. Buscar con includes (parcial)
    jugadorEncontrado = jugadores.find(j => {
        const nombreJugador = j.name.toLowerCase();
        const nombreOriginal = obtenerNombreOriginal(j).toLowerCase();
        
        return nombreJugador.includes(nombreBusqueda) || nombreOriginal.includes(nombreBusqueda);
    });
    
    if (jugadorEncontrado) {
        console.log(`✅ DEBUG búsqueda: Coincidencia parcial encontrada: ${jugadorEncontrado.name}`);
        return jugadorEncontrado;
    }
    
    // 3. Buscar reemplazando guiones bajos con espacios (solo si no se encontró antes)
    const nombreConEspacios = nombreBusqueda.replace(/_/g, ' ');
    if (nombreConEspacios !== nombreBusqueda) {
        console.log(`🔄 DEBUG búsqueda: Probando con espacios en lugar de guiones bajos: "${nombreConEspacios}"`);
        
        jugadorEncontrado = jugadores.find(j => {
            const nombreJugador = j.name.toLowerCase();
            const nombreOriginal = obtenerNombreOriginal(j).toLowerCase();
            
            return nombreJugador.includes(nombreConEspacios) || nombreOriginal.includes(nombreConEspacios);
        });
        
        if (jugadorEncontrado) {
            console.log(`✅ DEBUG búsqueda: Encontrado con espacios: ${jugadorEncontrado.name}`);
            return jugadorEncontrado;
        }
    }
    
    // 4. Buscar reemplazando espacios con guiones bajos
    const nombreConGuiones = nombreBusqueda.replace(/ /g, '_');
    if (nombreConGuiones !== nombreBusqueda) {
        console.log(`🔄 DEBUG búsqueda: Probando con guiones bajos en lugar de espacios: "${nombreConGuiones}"`);
        
        jugadorEncontrado = jugadores.find(j => {
            const nombreJugador = j.name.toLowerCase();
            const nombreOriginal = obtenerNombreOriginal(j).toLowerCase();
            
            return nombreJugador.includes(nombreConGuiones) || nombreOriginal.includes(nombreConGuiones);
        });
        
        if (jugadorEncontrado) {
            console.log(`✅ DEBUG búsqueda: Encontrado con guiones bajos: ${jugadorEncontrado.name}`);
            return jugadorEncontrado;
        }
    }
    
    // 5. Buscar de forma más flexible (sin caracteres especiales)
    const nombreSinEspeciales = nombreBusqueda.replace(/[^a-zA-Z0-9ΐ-ϿЀ-ӿ٠-ۿ]/g, '');
    if (nombreSinEspeciales.length >= 3) {
        console.log(`🔄 DEBUG búsqueda: Probando sin caracteres especiales: "${nombreSinEspeciales}"`);
        
        jugadorEncontrado = jugadores.find(j => {
            const nombreJugadorSinEspeciales = j.name.toLowerCase().replace(/[^a-zA-Z0-9ΐ-ϿЀ-ӿ٠-ۿ]/g, '');
            const nombreOriginalSinEspeciales = obtenerNombreOriginal(j).toLowerCase().replace(/[^a-zA-Z0-9ΐ-ϿЀ-ӿ٠-ۿ]/g, '');
            
            return nombreJugadorSinEspeciales.includes(nombreSinEspeciales) || nombreOriginalSinEspeciales.includes(nombreSinEspeciales);
        });
        
        if (jugadorEncontrado) {
            console.log(`✅ DEBUG búsqueda: Encontrado sin caracteres especiales: ${jugadorEncontrado.name}`);
            return jugadorEncontrado;
        }
    }
    
    // 6. Mostrar jugadores disponibles para debug
    console.log(`❌ DEBUG búsqueda: Jugador "${nombreLimpio}" no encontrado.`);
    console.log(`📋 DEBUG jugadores disponibles:`);
    jugadores.forEach(j => {
        console.log(`  - "${j.name}" (original: "${obtenerNombreOriginal(j)}", ID: ${j.id})`);
    });
    
    return null;
}

// FUNCIÓN AUXILIAR PARA BUSCAR JUGADORES POR NOMBRE O UID
function obtenerJugadorPorNombreOUID(identificador) {
    const jugadores = obtenerJugadoresSinHost();
    
    // Primero intentar por nombre
    let jugador = jugadores.find(j => 
        j.name.toLowerCase().includes(identificador.toLowerCase()) ||
        obtenerNombreOriginal(j).toLowerCase().includes(identificador.toLowerCase())
    );
    
    if (jugador) {
        return jugador;
    }
    
    // Si no se encuentra por nombre, intentar por UID (auth)
    if (identificador.length >= 8) { // Los UIDs suelen ser largos
        jugador = jugadores.find(j => j.auth && j.auth.includes(identificador));
        if (jugador) {
            return jugador;
        }
    }
    
    return null;
}

// FUNCIÓN PARA OBTENER JUGADOR POR ID NUMÉRICO (ID REAL DEL JUGADOR)
function obtenerJugadorPorID(id) {
    const jugadores = obtenerJugadoresSinHost();
    const idNum = parseInt(id);
    
    // Debug detallado
    console.log(`🔍 DEBUG obtenerJugadorPorID: Buscando ID ${id} (convertido a ${idNum})`);
    console.log(`📊 DEBUG obtenerJugadorPorID: Total jugadores sin host: ${jugadores.length}`);
    console.log(`📋 DEBUG obtenerJugadorPorID: Lista de jugadores:`);
    jugadores.forEach((j, index) => {
        console.log(`  [${index}] ${j.name} (ID real: ${j.id})`);
    });
    
    // Verificar que el ID sea válido
    if (isNaN(idNum)) {
        console.log(`❌ DEBUG obtenerJugadorPorID: ID no es un número válido: ${id}`);
        return null;
    }
    
    if (idNum < 0) {
        console.log(`❌ DEBUG obtenerJugadorPorID: ID es negativo: ${idNum}`);
        return null;
    }
    
    // Buscar jugador por ID real en lugar de índice del array
    const jugadorEncontrado = jugadores.find(j => j.id === idNum);
    
    if (!jugadorEncontrado) {
        console.log(`❌ DEBUG obtenerJugadorPorID: Jugador con ID real ${idNum} no encontrado`);
        return null;
    }
    
    console.log(`✅ DEBUG obtenerJugadorPorID: Jugador encontrado con ID real ${idNum}: ${jugadorEncontrado.name}`);
    
    return jugadorEncontrado;
}

// FUNCIÓN UNIFICADA PARA BUSCAR JUGADORES POR NOMBRE O ID
function obtenerJugadorPorNombreOID(input) {
    if (!input || typeof input !== 'string') {
        console.log(`❌ DEBUG obtenerJugadorPorNombreOID: Input inválido: ${input}`);
        return null;
    }
    
    // Verificar si es un ID numérico (empieza con #)
    if (input.startsWith('#')) {
        const id = input.substring(1);
        console.log(`🔍 DEBUG obtenerJugadorPorNombreOID: Buscando por ID #${id}`);
        return obtenerJugadorPorID(id);
    } else {
        // Búsqueda por nombre tradicional
        console.log(`🔍 DEBUG obtenerJugadorPorNombreOID: Buscando por nombre "${input}"`);
        return obtenerJugadorPorNombre(input);
    }
}

// FUNCIÓN PARA MOSTRAR LISTA DE JUGADORES CON IDs
function mostrarListaJugadoresConIDs(jugador) {
    const jugadores = obtenerJugadoresSinHost();
    
    if (jugadores.length === 0) {
        anunciarInfo("📋 No hay jugadores en la sala actualmente.", jugador);
        return;
    }
    
    room.sendAnnouncement("📋 LISTA DE JUGADORES CON IDs:", jugador.id, parseInt(COLORES.INFO, 16), "bold", 0);
    room.sendAnnouncement("═══════════════════════════════════════", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
    
    jugadores.forEach((j, index) => {
        const nombreOriginal = obtenerNombreOriginal(j);
        const equipo = j.team === 1 ? "🔴" : j.team === 2 ? "🔵" : "⚪";
        const estado = j.team === 0 ? "SPEC" : `EQUIPO ${j.team === 1 ? "ROJO" : "AZUL"}`;
        
        room.sendAnnouncement(
            `(${index}) ${equipo} ${nombreOriginal} - ${estado}`, 
            jugador.id, 
            parseInt(COLORES.PRIMARIO, 16), 
            "normal", 
            0
        );
    });
    
    room.sendAnnouncement("═══════════════════════════════════════", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
    room.sendAnnouncement("💡 Usa !kick #ID o !ban #ID para moderar por ID", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
}

// FUNCIÓN MEJORADA PARA OBTENER UID DE UN JUGADOR CON VERIFICACIÓN ROBUSTA DE DUPLICADOS
function obtenerUID(jugador) {
    try {
        // Validación inicial más robusta
        if (!jugador) {
            console.error('❌ obtenerUID: jugador es null o undefined');
            return null;
        }
        
        if (jugador.id === undefined || jugador.id === null) {
            console.error('❌ obtenerUID: jugador.id es null o undefined para jugador:', jugador.name || 'sin nombre');
            return null;
        }
        
        // Verificar si ya tenemos un UID generado para este jugador
        const uidExistente = jugadoresUID.get(jugador.id);
        if (uidExistente && uidExistente.length > 0) {
            // VERIFICACIÓN ADICIONAL: Asegurar que este UID no esté duplicado en otros jugadores
            const otrosJugadoresConMismoUID = Array.from(jugadoresUID.entries()).filter(
                ([otroId, otroUID]) => otroId !== jugador.id && otroUID === uidExistente
            );
            
            if (otrosJugadoresConMismoUID.length > 0) {
                console.warn(`🚨 DUPLICADO DETECTADO: UID ${uidExistente} ya existe en otros jugadores, regenerando...`);
                jugadoresUID.delete(jugador.id); // Eliminar UID duplicado
            } else {
                console.log(`✅ UID existente verificado para ${jugador.name}: ${uidExistente}`);
                return uidExistente;
            }
        }
        
        // PRIORIDAD 1: Verificar auth (propiedad principal de HaxBall para UID)
        if (jugador.auth && typeof jugador.auth === 'string' && jugador.auth.length > 0) {
            // Verificar que este auth no esté ya asignado a otro jugador
            const jugadorConMismoAuth = Array.from(jugadoresUID.entries()).find(
                ([otroId, otroUID]) => otroId !== jugador.id && otroUID === jugador.auth
            );
            
            if (!jugadorConMismoAuth) {
                console.log(`✅ UID obtenido de jugador.auth: ${jugador.auth}`);
                jugadoresUID.set(jugador.id, jugador.auth);
                return jugador.auth;
            } else {
                console.warn(`⚠️ Auth ${jugador.auth} ya está asignado al jugador ID ${jugadorConMismoAuth[0]}`);
            }
        }
        
        // PRIORIDAD 2: Verificar si el conn (connection ID) puede servir como UID temporal
        if (jugador.conn && typeof jugador.conn === 'string' && jugador.conn.length > 8) {
            // Verificar que este conn no esté ya asignado a otro jugador
            const jugadorConMismoConn = Array.from(jugadoresUID.entries()).find(
                ([otroId, otroUID]) => otroId !== jugador.id && otroUID === jugador.conn
            );
            
            if (!jugadorConMismoConn) {
                console.log(`✅ UID temporal obtenido de jugador.conn: ${jugador.conn}`);
                jugadoresUID.set(jugador.id, jugador.conn);
                return jugador.conn;
            } else {
                console.warn(`⚠️ Conn ${jugador.conn} ya está asignado al jugador ID ${jugadorConMismoConn[0]}`);
            }
        }
        
        // Debug detallado: mostrar todas las propiedades del jugador
        console.warn('⚠️ obtenerUID: No se encontró UID natural único en el jugador');
        console.log('🔍 DEBUG UID - Propiedades del jugador:', {
            id: jugador.id,
            name: jugador.name,
            auth: jugador.auth ? `${jugador.auth} (${typeof jugador.auth}, length: ${jugador.auth.length})` : 'null/undefined',
            conn: jugador.conn ? `${jugador.conn} (${typeof jugador.conn}, length: ${jugador.conn.length})` : 'null/undefined',
            team: jugador.team,
            admin: jugador.admin,
            position: jugador.position ? 'tiene posición' : 'sin posición',
            allProperties: Object.keys(jugador)
        });
        
        // PRIORIDAD 3: Generar UID único y robusto con verificación exhaustiva
        let uidGenerado = null;
        let intentos = 0;
        const maxIntentos = 10;
        
        while (intentos < maxIntentos) {
            uidGenerado = generarUIDUnicoMejorado(jugador, intentos);
            
            // Verificar que el UID no esté duplicado
            const existeUID = Array.from(jugadoresUID.values()).includes(uidGenerado);
            
            if (!existeUID && uidGenerado && uidGenerado.length > 0) {
                console.log(`✅ UID único generado para ${jugador.name} en intento ${intentos + 1}: ${uidGenerado}`);
                break;
            }
            
            console.warn(`⚠️ Intento ${intentos + 1}/${maxIntentos} - UID duplicado o inválido: ${uidGenerado}`);
            intentos++;
            uidGenerado = null;
        }
        
        // Validar que el UID generado sea válido
        if (!uidGenerado || uidGenerado.length === 0) {
            console.error(`❌ Error crítico: No se pudo generar UID único para ${jugador.name} después de ${maxIntentos} intentos`);
            return null;
        }
        
        // Verificación final de duplicados antes de asignar
        const verificacionFinal = Array.from(jugadoresUID.values()).filter(uid => uid === uidGenerado);
        if (verificacionFinal.length > 0) {
            console.error(`❌ VERIFICACIÓN FINAL FALLIDA: UID ${uidGenerado} sigue estando duplicado`);
            // Generar UID de emergencia con timestamp
            uidGenerado = `emergency_${jugador.id}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
            console.warn(`🆘 UID de emergencia generado: ${uidGenerado}`);
        }
        
        // Guardar el UID generado
        jugadoresUID.set(jugador.id, uidGenerado);
        console.log(`📝 UID asignado definitivamente para ${jugador.name}: ${uidGenerado}`);
        
        return uidGenerado;
        
    } catch (error) {
        console.error(`❌ Error crítico en obtenerUID para jugador ${jugador?.name || 'desconocido'}:`, error);
        console.error(`📊 Stack trace:`, error.stack);
        return null;
    }
}

// FUNCIÓN PARA GENERAR UID ÚNICO Y CONSISTENTE
function generarUIDUnico(jugador) {
    try {
        // Usar crypto si está disponible (Node.js)
        if (typeof require !== 'undefined') {
            try {
                const crypto = require('crypto');
                // Generar hash basado en nombre + timestamp + datos únicos
                const data = `${jugador.name}_${jugador.id}_${Date.now()}_${Math.random()}`;
                return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
            } catch (e) {
                console.warn('❌ Crypto no disponible, usando generador alternativo');
            }
        }
        
        // Fallback: generador usando hash simple
        const data = `${jugador.name}_${jugador.id}_${Date.now()}_${Math.random()}`;
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a 32bit integer
        }
        
        // Convertir a string hexadecimal y asegurar que tenga al menos 16 caracteres
        const uidBase = Math.abs(hash).toString(16).padStart(8, '0');
        const timestamp = Date.now().toString(16);
        return `${uidBase}${timestamp}`.substring(0, 16);
        
    } catch (error) {
        console.error('❌ Error generando UID único:', error);
        // Fallback final
        return `uid_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    }
}

// FUNCIÓN MEJORADA PARA GENERAR UID ÚNICO ESPECÍFICO POR JUGADOR CON ANTI-DUPLICADOS
function generarUIDUnicoMejorado(jugador, intentoNumero = 0) {
    try {
        console.log(`🔧 DEBUG UID: Generando UID para ${jugador.name} - intento ${intentoNumero + 1}`);
        
        // Crear un identificador único basado en múltiples propiedades del jugador
        let datosJugador = '';
        
        // 1. Nombre del jugador (limpio)
        const nombreLimpio = jugador.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        datosJugador += nombreLimpio;
        
        // 2. ID del jugador (único en la sesión)
        datosJugador += `_id${jugador.id}`;
        
        // 3. NUEVO: Agregar timestamp actual para unicidad temporal
        const timestamp = Date.now();
        datosJugador += `_ts${timestamp}`;
        
        // 4. NUEVO: Agregar número de intento para generar UIDs diferentes en cada intento
        datosJugador += `_att${intentoNumero}`;
        
        // 5. Información adicional si está disponible
        if (jugador.admin !== undefined) {
            datosJugador += `_adm${jugador.admin ? '1' : '0'}`;
        }
        
        // 6. NUEVO: Agregar información de auth y conn si están disponibles
        if (jugador.auth) {
            const authHash = simpleHash(jugador.auth);
            datosJugador += `_auth${authHash}`;
        }
        
        if (jugador.conn) {
            const connHash = simpleHash(jugador.conn);
            datosJugador += `_conn${connHash}`;
        }
        
        // 7. NUEVO: Agregar factor aleatorio para evitar patrones predecibles
        const factorAleatorio = Math.floor(Math.random() * 10000);
        datosJugador += `_rand${factorAleatorio}`;
        
        console.log(`🔍 DEBUG UID: Datos base para ${jugador.name}: ${datosJugador.substring(0, 50)}...`);
        
        // Usar crypto si está disponible para mejor hashing
        if (typeof require !== 'undefined') {
            try {
                const crypto = require('crypto');
                const hash = crypto.createHash('sha256').update(datosJugador).digest('hex');
                const uidFinal = hash.substring(0, 32); // UID más largo y único
                console.log(`✅ DEBUG UID: UID generado con crypto para ${jugador.name}: ${uidFinal}`);
                return uidFinal;
            } catch (e) {
                console.warn('⚠️ Crypto no disponible para UID mejorado, usando alternativo');
            }
        }
        
        // Fallback: Sistema de hash múltiple mejorado
        const hashCombinado = generarHashCombinado(datosJugador);
        
        // Generar UID final usando timestamp y número de intento para unicidad
        const timestampHex = timestamp.toString(16).substring(-8); // Últimos 8 caracteres del timestamp en hex
        const intentoHex = intentoNumero.toString(16).padStart(2, '0');
        const aleatorioHex = factorAleatorio.toString(16).padStart(4, '0');
        
        const uidFinal = `${hashCombinado}${timestampHex}${intentoHex}${aleatorioHex}`.substring(0, 32);
        
        console.log(`✅ DEBUG UID: UID generado con fallback para ${jugador.name}: ${uidFinal}`);
        return uidFinal;
        
    } catch (error) {
        console.error('❌ Error en generarUIDUnicoMejorado:', error);
        // Fallback final usando la función original con timestamp
        const emergencyUID = `emergency_${jugador.id}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
        console.warn(`🆘 DEBUG UID: UID de emergencia generado para ${jugador.name}: ${emergencyUID}`);
        return emergencyUID;
    }
}

// FUNCIÓN AUXILIAR PARA GENERAR HASH COMBINADO
function generarHashCombinado(datos) {
    console.log(`🔧 DEBUG HASH: Generando hash combinado para datos de longitud ${datos.length}`);
    
    // Hash 1: Algoritmo estándar
    let hash1 = 5381; // Usar constante DJB2
    for (let i = 0; i < datos.length; i++) {
        hash1 = ((hash1 << 5) + hash1) + datos.charCodeAt(i);
        hash1 = hash1 & hash1; // Convertir a 32bit
    }
    
    // Hash 2: Algoritmo FNV-1a simplificado
    let hash2 = 2166136261; // FNV offset basis
    for (let i = 0; i < datos.length; i++) {
        hash2 ^= datos.charCodeAt(i);
        hash2 *= 16777619; // FNV prime
        hash2 = hash2 & hash2; // Convertir a 32bit
    }
    
    // Hash 3: Algoritmo personalizado con datos invertidos
    let hash3 = 0;
    const datosInvertidos = datos.split('').reverse().join('');
    for (let i = 0; i < datosInvertidos.length; i++) {
        const char = datosInvertidos.charCodeAt(i);
        hash3 = ((hash3 << 7) - hash3) + char;
        hash3 = hash3 & hash3;
    }
    
    // Combinar los tres hashes
    const hashFinal = (Math.abs(hash1) ^ Math.abs(hash2) ^ Math.abs(hash3)).toString(16).padStart(16, '0');
    
    console.log(`✅ DEBUG HASH: Hash combinado generado: ${hashFinal}`);
    return hashFinal;
}

// FUNCIONES DE ANUNCIO CON VERIFICACIÓN DE SEGURIDAD
function anunciarGeneral(mensaje, color = AZUL_LNB, estilo = "normal") {
    // Cambiar color a crema si el mensaje es un número rápido
    if (/^\d{2}$/.test(mensaje)) {
        color = "F5DEB3"; // Código hexadecimal para color crema
    }
    if (typeof room !== 'undefined' && room && room.sendAnnouncement) {
        room.sendAnnouncement(mensaje, null, parseInt(color, 16), estilo, 1);
    } else {
        // Anuncio general enviado
    }
}

function anunciarExito(mensaje) {
    if (typeof room !== 'undefined' && room && room.sendAnnouncement) {
        room.sendAnnouncement("✅ " + mensaje, null, parseInt("00FF00", 16), "bold", 1);
    } else {
        // Mensaje de éxito enviado
    }
}

function anunciarError(mensaje, jugador) {
    if (typeof room !== 'undefined' && room && room.sendAnnouncement) {
        if (jugador && jugador.id !== undefined) {
            room.sendAnnouncement("[PV] ❌ " + mensaje, jugador.id, parseInt("FF0000", 16), "bold", 0);
        } else {
            // Si no hay jugador válido, enviar como mensaje general
            room.sendAnnouncement("❌ " + mensaje, null, parseInt("FF0000", 16), "bold", 1);
        }
    } else {
        // Mensaje de error enviado
    }
}

function anunciarAdvertencia(mensaje, jugador = null) {
    if (typeof room !== 'undefined' && room && room.sendAnnouncement) {
        const targetId = jugador ? jugador.id : null;
        const prefix = targetId ? "[PV] ⚠️ " : "⚠️ ";
        room.sendAnnouncement(prefix + mensaje, targetId, parseInt("FFD700", 16), "bold", targetId ? 0 : 1);
    } else {
        // Mensaje de advertencia enviado
    }
}

function anunciarInfo(mensaje, jugador = null) {
    if (typeof room !== 'undefined' && room && room.sendAnnouncement) {
        if (jugador && jugador.id !== undefined) {
            // Mensaje privado con formato [PV]
            room.sendAnnouncement("[PV] ℹ️ " + mensaje, jugador.id, parseInt(CELESTE_LNB, 16), "normal", 0);
        } else {
            // Mensaje general
            room.sendAnnouncement("ℹ️ " + mensaje, null, parseInt(CELESTE_LNB, 16), "normal", 1);
        }
    } else {
        // Mensaje de información enviado
    }
}

function agregarJugadorAEquipo(jugador) {
    // CORRECCIÓN MEJORADA: Verificar múltiples condiciones antes de agregar a un equipo
    
    // 1. Verificar si el jugador está marcado como AFK
    if (jugadoresAFK.has(jugador.id)) {
        logOptimizado(`🚫 DEBUG: No agregando ${jugador.name} a equipo (marcado como AFK)`, 'balance');
        return;
    }
    
    // 1.5. NUEVA VERIFICACIÓN: Verificar si el jugador fue movido recientemente a espectadores por inactividad
    // Esto previene que jugadores recién marcados como AFK sean inmediatamente movidos de vuelta
    const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
    if (jugadorActual && jugadorActual.team === 0) {
        // Verificar si hay advertencias AFK recientes (últimos 30 segundos)
        const advertenciaAFK = advertenciasAFK.get(jugador.id);
        if (advertenciaAFK && Date.now() - advertenciaAFK.timestamp < 30000) {
            logOptimizado(`🚫 DEBUG: No agregando ${jugador.name} - tiene advertencias AFK recientes`, 'balance');
            return;
        }
    }
    
    // 2. Verificar si el jugador ya está en un equipo
    if (jugador.team !== 0) {
        return;
    }
    
    // 3. Excluir bot del sistema automático
    if (esBot(jugador)) {
        return;
    }
    
    // 4. NUEVA VERIFICACIÓN: Asegurar que no está en proceso de ser movido a espectadores
    if (movimientoIniciadorPorBot.has(jugador.id)) {
        return;
    }
    
    // Agregar jugador al equipo con menos jugadores
    const jugadoresRed = room.getPlayerList().filter(j => j.team === 1).length;
    const jugadoresBlue = room.getPlayerList().filter(j => j.team === 2).length;
    const equipo = jugadoresRed > jugadoresBlue ? 2 : 1;
    
    // CRÍTICO: Marcar este movimiento como iniciado por el bot
    movimientoIniciadorPorBot.add(jugador.id);
    
    room.setPlayerTeam(jugador.id, equipo);
    
    // Mensaje de unión al equipo removido para evitar spam
    
    // Llamar al auto balance después de agregar jugador
    setTimeout(() => {
        autoBalanceEquipos();
        verificarAutoStart();
    }, 500);
}

// FUNCIÓN DE BALANCE INTELIGENTE MEJORADA
function balanceInteligente(razon = "balance automático") {
    const jugadores = room.getPlayerList();
    const jugadoresRed = jugadores.filter(j => j.team === 1);
    const jugadoresBlue = jugadores.filter(j => j.team === 2);
    const totalJugadoresEnEquipos = jugadoresRed.length + jugadoresBlue.length;
    const diferencia = Math.abs(jugadoresRed.length - jugadoresBlue.length);

    // Debug balanceInteligente optimizado
    
    // CASO ESPECIAL: Training con 1 jugador - mantener en equipo rojo
    if (mapaActual === "training" && totalJugadoresEnEquipos === 1) {
        const unicoJugador = jugadoresRed.length === 1 ? jugadoresRed[0] : jugadoresBlue[0];
        
        if (unicoJugador && unicoJugador.team !== 1) {
            
            // Permitir movimiento por sistema automático
            if (movimientoPermitidoPorComando) {
                movimientoPermitidoPorComando.add(unicoJugador.id);
            }
            
            room.setPlayerTeam(unicoJugador.id, 1);
            // anunciarInfo(`🔴 ${unicoJugador.name} movido al equipo rojo para entrenar`, unicoJugador);
        } else {
            console.log(`✅ DEBUG: Único jugador ya está en equipo rojo para training`);
        }
        return; // No ejecutar balance normal en training con 1 jugador
    }
    
    // Si no hay jugadores en equipos, no hacer nada
    if (totalJugadoresEnEquipos === 0) {
        console.log(`❌ DEBUG: No hay jugadores en equipos para balancear`);
        return;
    }
    
    // Durante partidos, solo balancear si hay una diferencia muy grande (3 o más)
    // Fuera de partidos, balancear con diferencia de 2 o más
    const umbralBalance = partidoEnCurso ? 3 : 2;
    
    // Si la diferencia es menor al umbral, no hacer nada
    if (diferencia < umbralBalance) {
        console.log(`✅ DEBUG: Equipos balanceados (diferencia ${diferencia} < umbral ${umbralBalance})`);
        return;
    }
    
    // CASO ESPECIAL: Si un equipo está completamente vacío
    // Solo entonces hacer mezcla completa (pero solo si no está en partido)
    const equipoVacio = jugadoresRed.length === 0 || jugadoresBlue.length === 0;
    if (equipoVacio && totalJugadoresEnEquipos >= 2 && !partidoEnCurso) {
        console.log(`🔥 DEBUG: Equipo completamente vacío con ${totalJugadoresEnEquipos} jugadores. Activando mezcla completa...`);
        // anunciarGeneral(`🔄 ⚡ REORGANIZANDO EQUIPOS POR EQUIPO VACÍO... ⚡ 🔄`, "FFD700", "bold");
        
        setTimeout(() => {
            mezclarEquiposAleatoriamente();
        }, 300);
        
        return; // Salir temprano, la mezcla se encargará del resto
    }
    
    // BALANCE MÍNIMO: Solo mover los jugadores necesarios
    const jugadoresAMover = Math.floor(diferencia / 2);
    const equipoMayor = jugadoresRed.length > jugadoresBlue.length ? jugadoresRed : jugadoresBlue;
    const equipoMenorEnum = jugadoresRed.length > jugadoresBlue.length ? 2 : 1;
    const equipoMayorEnum = jugadoresRed.length > jugadoresBlue.length ? 1 : 2;

    // Filtrar candidatos válidos (excluir bots y jugadores AFK)
    const candidatos = equipoMayor.filter(p => {
        if (esBot(p)) return false;
        if (jugadoresAFK.has(p.id)) {
            console.log(`🚫 DEBUG: Excluyendo del balance a ${p.name} (marcado como AFK)`);
            return false;
        }
        return true;
    });

    if (candidatos.length === 0) {
        console.log(`⚠️ DEBUG: No hay candidatos válidos para balance mínimo`);
        return;
    }

    // Mezclar candidatos aleatoriamente para fairness
    for (let i = candidatos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidatos[i], candidatos[j]] = [candidatos[j], candidatos[i]];
    }
    
    console.log(`⚖️ DEBUG: Balance mínimo - moviendo ${jugadoresAMover} jugador(es) del equipo ${equipoMayorEnum === 1 ? 'ROJO' : 'AZUL'} al ${equipoMenorEnum === 1 ? 'ROJO' : 'AZUL'}`);
    
    // Mover solo los jugadores necesarios
    for (let i = 0; i < jugadoresAMover && i < candidatos.length; i++) {
        const jugador = candidatos[i];
        
        // Marcar movimiento como iniciado por el bot
        movimientoIniciadorPorBot.add(jugador.id);
        
        room.setPlayerTeam(jugador.id, equipoMenorEnum);
        const equipoDestinoNombre = equipoMenorEnum === 1 ? '🔴 ROJO' : '🔵 AZUL';
        
        // Mensajes de movimiento deshabilitados para evitar spam en el chat
        // if (partidoEnCurso) {
        //     anunciarGeneral(`⚖️ 🔄 Balance: ${jugador.name} → ${equipoDestinoNombre}`, "FFD700", "bold");
        // } else {
        //     anunciarGeneral(`⚖️ 🔄 Auto Balance: ${jugador.name} → ${equipoDestinoNombre}`, "87CEEB", "bold");
        // }
    }
}

// ========== SISTEMA DE BALANCE DINÁMICO - VERSIÓN INTEGRADA ==========
// Esta función calcula el número óptimo de jugadores a mover para equilibrar TODOS los casos
function calcularJugadoresOptimosAMover(equipoMayorSize, equipoMenorSize, totalJugadores) {
    const diferenciaEquipos = equipoMayorSize - equipoMenorSize;
    
    // Si no hay diferencia significativa, no mover nada
    if (diferenciaEquipos <= 1) {
        return 0;
    }
    
    // FÓRMULA BASE: Mover la mitad de la diferencia (redondeado hacia abajo)
    let jugadoresAMover = Math.floor(diferenciaEquipos / 2);
    
    // CASOS ESPECIALES OPTIMIZADOS para obtener el mejor equilibrio posible
    
    // Casos básicos pequeños
    if (equipoMayorSize === 3 && equipoMenorSize === 1) {
        jugadoresAMover = 1; // 3v1 → 2v2 (perfecto)
    } else if (equipoMayorSize === 4 && equipoMenorSize === 2) {
        jugadoresAMover = 1; // 4v2 → 3v3 (perfecto)
    } 
    
    // Casos con 5 jugadores en equipo mayor
    else if (equipoMayorSize === 5 && equipoMenorSize === 1) {
        jugadoresAMover = 2; // 5v1 → 3v3 (perfecto)
    } else if (equipoMayorSize === 5 && equipoMenorSize === 2) {
        jugadoresAMover = 1; // 5v2 → 4v3 (diferencia mínima)
    } else if (equipoMayorSize === 5 && equipoMenorSize === 3) {
        jugadoresAMover = 1; // 5v3 → 4v4 (perfecto)
    }
    
    // Casos con 6 jugadores en equipo mayor
    else if (equipoMayorSize === 6 && equipoMenorSize === 2) {
        jugadoresAMover = 2; // 6v2 → 4v4 (perfecto)
    } else if (equipoMayorSize === 6 && equipoMenorSize === 4) {
        jugadoresAMover = 1; // 6v4 → 5v5 (perfecto)
    }
    
    // Casos con 7 jugadores en equipo mayor
    else if (equipoMayorSize === 7 && equipoMenorSize === 1) {
        jugadoresAMover = 3; // 7v1 → 4v4 (perfecto)
    } else if (equipoMayorSize === 7 && equipoMenorSize === 3) {
        jugadoresAMover = 2; // 7v3 → 5v5 (perfecto)
    } else if (equipoMayorSize === 7 && equipoMenorSize === 5) {
        jugadoresAMover = 1; // 7v5 → 6v6 (perfecto)
    }
    
    // Casos con 8 jugadores en equipo mayor
    else if (equipoMayorSize === 8 && equipoMenorSize === 2) {
        jugadoresAMover = 3; // 8v2 → 5v5 (perfecto)
    } else if (equipoMayorSize === 8 && equipoMenorSize === 4) {
        jugadoresAMover = 2; // 8v4 → 6v6 (perfecto)
    } else if (equipoMayorSize === 8 && equipoMenorSize === 6) {
        jugadoresAMover = 1; // 8v6 → 7v7 (perfecto)
    }
    
    // Casos con 9 jugadores en equipo mayor
    else if (equipoMayorSize === 9 && equipoMenorSize === 1) {
        jugadoresAMover = 4; // 9v1 → 5v5 (perfecto)
    } else if (equipoMayorSize === 9 && equipoMenorSize === 3) {
        jugadoresAMover = 3; // 9v3 → 6v6 (perfecto)
    } else if (equipoMayorSize === 9 && equipoMenorSize === 5) {
        jugadoresAMover = 2; // 9v5 → 7v7 (perfecto)
    } else if (equipoMayorSize === 9 && equipoMenorSize === 7) {
        jugadoresAMover = 1; // 9v7 → 8v8 (perfecto)
    }
    
    // Casos con 10 jugadores en equipo mayor
    else if (equipoMayorSize === 10 && equipoMenorSize === 2) {
        jugadoresAMover = 4; // 10v2 → 6v6 (perfecto)
    } else if (equipoMayorSize === 10 && equipoMenorSize === 4) {
        jugadoresAMover = 3; // 10v4 → 7v7 (perfecto)
    } else if (equipoMayorSize === 10 && equipoMenorSize === 6) {
        jugadoresAMover = 2; // 10v6 → 8v8 (perfecto)
    } else if (equipoMayorSize === 10 && equipoMenorSize === 8) {
        jugadoresAMover = 1; // 10v8 → 9v9 (perfecto)
    }
    
    // CASOS EXTREMOS: Para diferencias muy grandes, usar fórmula dinámica
    else if (diferenciaEquipos > 8) {
        // Para casos extremos, mover suficientes jugadores para lograr equilibrio cerca del ideal
        const ideal = Math.round(totalJugadores / 2);
        jugadoresAMover = equipoMayorSize - ideal;
        
        // Limitar para evitar movimientos extremos
        if (jugadoresAMover > Math.floor(equipoMayorSize * 0.7)) {
            jugadoresAMover = Math.floor(equipoMayorSize * 0.7);
        }
        
        // Asegurar al menos 1 movimiento
        if (jugadoresAMover < 1) {
            jugadoresAMover = 1;
        }
    }
    
    // VALIDACIÓN FINAL: Asegurar que siempre se mueva al menos 1 jugador si hay diferencia > 1
    if (diferenciaEquipos > 1 && jugadoresAMover === 0) {
        jugadoresAMover = 1;
    }
    
    // Debug logging
    console.log(`🧮 DEBUG calcularJugadores: ${equipoMayorSize}v${equipoMenorSize} (diff=${diferenciaEquipos}) → mover ${jugadoresAMover} jugador(es)`);
    
    return jugadoresAMover;
}

// FUNCIÓN DE BALANCE INTELIGENTE ESPECÍFICA PARA CUANDO UN JUGADOR SALE
// SISTEMA AVANZADO: Balance dinámico que maneja TODOS los casos específicos (3v1→2v2, 4v2→3v3, 5v1→3v3, etc.)
function balanceInteligentePostSalida(nombreJugadorSalido = "jugador") {
    const jugadores = room.getPlayerList();
    const jugadoresRed = jugadores.filter(j => j.team === 1);
    const jugadoresBlue = jugadores.filter(j => j.team === 2);
    const totalJugadoresEnEquipos = jugadoresRed.length + jugadoresBlue.length;
    const diferencia = Math.abs(jugadoresRed.length - jugadoresBlue.length);

    console.log(`⚖️ DEBUG balancePostSalida (${nombreJugadorSalido} salió): Rojo=${jugadoresRed.length}, Azul=${jugadoresBlue.length}, Total=${totalJugadoresEnEquipos}, Diferencia=${diferencia}`);
    
    // Si no hay jugadores en equipos o muy pocos, no hacer nada
    if (totalJugadoresEnEquipos <= 2) {
        console.log(`✅ DEBUG: Muy pocos jugadores (${totalJugadoresEnEquipos}) - sin balance necesario`);
        return;
    }
    
    // SISTEMA AVANZADO: Usar balance dinámico solo para diferencias >= 2
    if (diferencia < 2) {
        console.log(`✅ DEBUG: Equipos equilibrados (diferencia ${diferencia} < 2) - no se requiere balance`);
        return;
    }
    
    console.log(`⚖️ DEBUG: Balance necesario - diferencia de ${diferencia} jugadores`);
    
    // CASO ESPECIAL: Un equipo completamente vacío -> mezcla completa (solo fuera de partidos)
    const equipoVacio = jugadoresRed.length === 0 || jugadoresBlue.length === 0;
    if (equipoVacio && totalJugadoresEnEquipos >= 2 && !partidoEnCurso) {
        console.log(`🔥 DEBUG: Aplicando mezcla completa por equipo vacío`);
        // anunciarGeneral(`🔄 ⚡ REORGANIZANDO EQUIPOS (equipo vacío tras salida)... ⚡ 🔄`, "FFD700", "bold");
        
        setTimeout(() => {
            mezclarEquiposAleatoriamente();
        }, 300);
        
        return;
    } else if (equipoVacio && partidoEnCurso) {
        console.log(`🚫 DEBUG: Equipo vacío detectado pero partido en curso - no se hace mezcla`);
        return;
    }
    
    // DETERMINAR EQUIPOS
    const equipoMayor = jugadoresRed.length > jugadoresBlue.length ? jugadoresRed : jugadoresBlue;
    const equipoMenor = jugadoresRed.length > jugadoresBlue.length ? jugadoresBlue : jugadoresRed;
    const equipoMenorEnum = jugadoresRed.length > jugadoresBlue.length ? 2 : 1;
    const equipoMayorEnum = jugadoresRed.length > jugadoresBlue.length ? 1 : 2;
    const equipoMayorNombre = equipoMayorEnum === 1 ? 'ROJO' : 'AZUL';
    const equipoMenorNombre = equipoMenorEnum === 1 ? 'ROJO' : 'AZUL';

    // USAR EL SISTEMA DE BALANCE DINÁMICO INTEGRADO
    const jugadoresAMover = calcularJugadoresOptimosAMover(equipoMayor.length, equipoMenor.length, totalJugadoresEnEquipos);
    
    if (jugadoresAMover === 0) {
        console.log(`✅ DEBUG: Sistema dinámico determinó que no se requiere balance`);
        return;
    }

    // Filtrar candidatos válidos (excluir bots y jugadores AFK)
    const candidatos = equipoMayor.filter(p => {
        if (esBot(p)) return false;
        if (jugadoresAFK.has(p.id)) {
            console.log(`🚫 DEBUG: Excluyendo del balance a ${p.name} (marcado como AFK)`);
            return false;
        }
        return true;
    });

    if (candidatos.length === 0) {
        console.log(`⚠️ DEBUG: No hay candidatos válidos para balance post-salida`);
        return;
    }

    // Mezclar candidatos para fairness
    for (let i = candidatos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidatos[i], candidatos[j]] = [candidatos[j], candidatos[i]];
    }
    
    // MOSTRAR MENSAJE ESPECÍFICO SEGÚN EL CASO DETECTADO
    const equipoMayorSize = equipoMayor.length;
    const equipoMenorSize = equipoMenor.length;
    let mensajeBalance = "";
    
    // Casos específicos con mensajes personalizados
    if (equipoMayorSize === 3 && equipoMenorSize === 1) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 3v1 → 2v2 (perfecto) ⚡`;
    } else if (equipoMayorSize === 4 && equipoMenorSize === 2) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 4v2 → 3v3 (perfecto) ⚡`;
    } else if (equipoMayorSize === 5 && equipoMenorSize === 1) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 5v1 → 3v3 (perfecto) ⚡`;
    } else if (equipoMayorSize === 5 && equipoMenorSize === 3) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 5v3 → 4v4 (perfecto) ⚡`;
    } else if (equipoMayorSize === 6 && equipoMenorSize === 2) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 6v2 → 4v4 (perfecto) ⚡`;
    } else if (equipoMayorSize === 6 && equipoMenorSize === 4) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 6v4 → 5v5 (perfecto) ⚡`;
    } else if (equipoMayorSize === 7 && equipoMenorSize === 1) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 7v1 → 4v4 (perfecto) ⚡`;
    } else if (equipoMayorSize === 7 && equipoMenorSize === 3) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 7v3 → 5v5 (perfecto) ⚡`;
    } else if (equipoMayorSize === 7 && equipoMenorSize === 5) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 7v5 → 6v6 (perfecto) ⚡`;
    } else if (equipoMayorSize === 8 && equipoMenorSize === 2) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 8v2 → 5v5 (perfecto) ⚡`;
    } else if (equipoMayorSize === 8 && equipoMenorSize === 4) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 8v4 → 6v6 (perfecto) ⚡`;
    } else if (equipoMayorSize === 8 && equipoMenorSize === 6) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 8v6 → 7v7 (perfecto) ⚡`;
    } else if (equipoMayorSize === 9 && equipoMenorSize === 1) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 9v1 → 5v5 (perfecto) ⚡`;
    } else if (equipoMayorSize === 9 && equipoMenorSize === 3) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 9v3 → 6v6 (perfecto) ⚡`;
    } else if (equipoMayorSize === 9 && equipoMenorSize === 5) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 9v5 → 7v7 (perfecto) ⚡`;
    } else if (equipoMayorSize === 9 && equipoMenorSize === 7) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 9v7 → 8v8 (perfecto) ⚡`;
    } else if (equipoMayorSize === 10 && equipoMenorSize === 2) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 10v2 → 6v6 (perfecto) ⚡`;
    } else if (equipoMayorSize === 10 && equipoMenorSize === 4) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 10v4 → 7v7 (perfecto) ⚡`;
    } else if (equipoMayorSize === 10 && equipoMenorSize === 6) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 10v6 → 8v8 (perfecto) ⚡`;
    } else if (equipoMayorSize === 10 && equipoMenorSize === 8) {
        mensajeBalance = `⚖️ ⚡ Balance Inteligente: 10v8 → 9v9 (perfecto) ⚡`;
    } else {
        // Caso genérico para situaciones no específicas
        const equipoMayorFinal = equipoMayorSize - jugadoresAMover;
        const equipoMenorFinal = equipoMenorSize + jugadoresAMover;
        mensajeBalance = `⚖️ ⚡ Balance Dinámico: ${equipoMayorSize}v${equipoMenorSize} → ${equipoMayorFinal}v${equipoMenorFinal} ⚡`;
    }
    
    // Anunciar el balance con mensaje específico - DESACTIVADO
    // if (partidoEnCurso) {
    //     anunciarGeneral(mensajeBalance + " (en partido)", "FFD700", "bold");
    // } else {
    //     anunciarGeneral(mensajeBalance, "87CEEB", "bold");
    // }
    
    console.log(`⚖️ DEBUG: Sistema dinámico - moviendo ${jugadoresAMover} jugador(es) del equipo ${equipoMayorNombre} al ${equipoMenorNombre}`);
    
    // Mover los jugadores calculados por el sistema dinámico
    for (let i = 0; i < jugadoresAMover && i < candidatos.length; i++) {
        const jugadorSeleccionado = candidatos[i]; // Usar el orden mezclado
        
        // Marcar movimiento como iniciado por el bot
        movimientoIniciadorPorBot.add(jugadorSeleccionado.id);
        
        room.setPlayerTeam(jugadorSeleccionado.id, equipoMenorEnum);
        const equipoDestinoNombre = equipoMenorEnum === 1 ? '🔴 ROJO' : '🔵 AZUL';
        
        // Mensaje individual de cada movimiento - DESHABILITADO
        // anunciarGeneral(`⚖️ ${jugadorSeleccionado.name} → ${equipoDestinoNombre} (${i + 1}/${jugadoresAMover})`, "90EE90", "normal");
        
        console.log(`✅ DEBUG: Movido ${jugadorSeleccionado.name} al equipo ${equipoMenorNombre} (${i + 1}/${jugadoresAMover})`);
    }
    
    // Verificar resultado del balance después de un breve delay
    setTimeout(() => {
        const jugadoresPost = room.getPlayerList();
        const jugadoresRedPost = jugadoresPost.filter(j => j.team === 1);
        const jugadoresBluePost = jugadoresPost.filter(j => j.team === 2);
        const diferenciaPost = Math.abs(jugadoresRedPost.length - jugadoresBluePost.length);
        
        console.log(`📊 DEBUG Post-balance: Rojo=${jugadoresRedPost.length}, Azul=${jugadoresBluePost.length}, Diferencia=${diferenciaPost}`);
        
        if (diferenciaPost <= 1) {
            console.log(`✅ DEBUG: Balance completado exitosamente - diferencia final: ${diferenciaPost}`);
        } else {
            console.log(`⚠️ DEBUG: Balance parcial - diferencia restante: ${diferenciaPost}`);
        }
    }, 500);
}

// FUNCIÓN PARA OBTENER CANTIDAD DE JUGADORES POR EQUIPO
function obtenerCantidadJugadoresPorEquipo() {
    if (typeof room === 'undefined' || !room || !room.getPlayerList) {
        console.warn('⚠️ Room no disponible para obtener jugadores');
        return { rojo: 0, azul: 0, espectadores: 0, total: 0 };
    }
    
    const jugadores = room.getPlayerList();
    const jugadoresRojo = jugadores.filter(j => j.team === 1);
    const jugadoresAzul = jugadores.filter(j => j.team === 2);
    const espectadores = jugadores.filter(j => j.team === 0);
    
    return {
        rojo: jugadoresRojo.length,
        azul: jugadoresAzul.length,
        espectadores: espectadores.length,
        total: jugadores.length,
        jugadoresRojo: jugadoresRojo,
        jugadoresAzul: jugadoresAzul,
        diferencia: Math.abs(jugadoresRojo.length - jugadoresAzul.length)
    };
}

// FUNCIÓN DE BALANCE AUTOMÁTICO CONTINUO
// Esta función se ejecuta automáticamente y balancea cuando la diferencia es mayor a 1 jugador

// ========== FUNCIÓN DE BALANCE AUTOMÁTICO CORREGIDA ==========
function balanceAutomaticoContinuo() {
    // Logs eliminados para mejor rendimiento en VPS
    
    if (typeof room === 'undefined' || !room || !room.getPlayerList) {
        return false;
    }
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const { rojo, azul, diferencia, jugadoresRojo, jugadoresAzul } = equipos;
    
    // Si no hay jugadores en equipos, no hacer nada
    if (rojo === 0 && azul === 0) {
        return false;
    }
    
    // CONDICIÓN PRINCIPAL: Balancear siempre que la diferencia sea mayor a 1 jugador
    if (diferencia <= 1) {
        return false;
    }
    
    // Determinar equipo con más jugadores y equipo con menos jugadores
    const equipoConMas = rojo > azul ? jugadoresRojo : jugadoresAzul;
    const equipoConMenos = rojo > azul ? 2 : 1; // 1=rojo, 2=azul
    const equipoConMasNombre = rojo > azul ? 'ROJO' : 'AZUL';
    const equipoConMenosNombre = rojo > azul ? 'AZUL' : 'ROJO';
    
    // Log eliminado para mejor rendimiento
    
    // CORRECCIÓN: Verificar que esBot está definida y usar versión mejorada
    let funcionEsBot = esBot;
    if (typeof funcionEsBot !== 'function') {
        funcionEsBot = function(jugador) {
            if (!jugador || !jugador.name) return false;
            
            // Lista comprensiva de patrones para bots
            const patronesBots = [
                'HOST LNB',           // Bot principal
                '[BOT]',              // Bots marcados explícitamente
                'Bot',                // Bots con "Bot" en mayúsculas  
                'bot'                 // Bots con "bot" en minúsculas
            ];
            
            // Verificar ID especiales (0 = host)
            if (jugador.id === 0) return true;
            
            // Verificar nombres vacíos
            if (jugador.name === '') return true;
            
            // Verificar patrones en el nombre
            return patronesBots.some(patron => jugador.name.includes(patron));
        };
        console.log(`⚠️ DEBUG balanceAutomaticoContinuo: Usando función esBot mejorada`);
    }
    
    // CORRECCIÓN: Filtrar candidatos válidos con lógica de fallback mejorada
    console.log(`🔍 DEBUG balanceAutomaticoContinuo: Iniciando filtrado de candidatos...`);
    
    // Función auxiliar para debugging detallado
    function debugearCandidatos(equipoConMas, jugadoresAFK, funcionEsBot) {
        console.log(`🔍 DEBUG DETALLADO DE CANDIDATOS:`);
        equipoConMas.forEach((jugador, index) => {
            const esValido = jugador && typeof jugador.id !== 'undefined';
            const esBot = funcionEsBot(jugador);
            const estaAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            const enEquipo = jugadorActual && jugadorActual.team !== 0;
            
            console.log(`  ${index + 1}. ${jugador.name}: Válido=${esValido}, Bot=${esBot}, AFK=${estaAFK}, EnEquipo=${enEquipo}`);
        });
    }
    
    // Debug inicial
    debugearCandidatos(equipoConMas, jugadoresAFK, funcionEsBot);
    
    // PASO 1: Filtrado normal con criterios estrictos
    let candidatos = equipoConMas.filter(jugador => {
        // Verificar que el jugador existe y tiene las propiedades necesarias
        if (!jugador || typeof jugador.id === 'undefined') {
            console.log(`🚫 DEBUG balanceAutomaticoContinuo: Jugador inválido detectado`);
            return false;
        }
        
        // Verificar si es bot
        if (funcionEsBot(jugador)) {
            console.log(`🚫 DEBUG balanceAutomaticoContinuo: Excluyendo bot ${jugador.name} del balance`);
            return false;
        }
        
        // Verificar si está AFK
        if (jugadoresAFK && jugadoresAFK.has(jugador.id)) {
            console.log(`🚫 DEBUG balanceAutomaticoContinuo: Excluyendo ${jugador.name} del balance (marcado como AFK)`);
            return false;
        }
        
        // NUEVA VERIFICACIÓN: Asegurar que el jugador aún esté en el equipo correcto
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        if (!jugadorActual || jugadorActual.team === 0) {
            console.log(`🚫 DEBUG balanceAutomaticoContinuo: ${jugador.name} ya no está en equipo, excluyendo`);
            return false;
        }
        
        console.log(`✅ DEBUG balanceAutomaticoContinuo: ${jugador.name} es candidato válido`);
        return true;
    });
    
    console.log(`🎯 DEBUG balanceAutomaticoContinuo: Candidatos válidos (criterios estrictos): ${candidatos.length}/${equipoConMas.length}`);
    
    // PASO 2: Si no hay candidatos, aplicar lógica de fallback
    if (candidatos.length === 0) {
        console.log(`⚠️ DEBUG balanceAutomaticoContinuo: No hay candidatos con criterios estrictos, aplicando fallback...`);
        
        // Fallback 1: Relajar criterio AFK
        candidatos = equipoConMas.filter(jugador => {
            if (!jugador || typeof jugador.id === 'undefined') return false;
            if (funcionEsBot(jugador)) return false;
            
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            if (!jugadorActual || jugadorActual.team === 0) return false;
            
            return true;
        });
        
        console.log(`🔄 DEBUG balanceAutomaticoContinuo: Candidatos sin restricción AFK: ${candidatos.length}`);
        
        // Fallback 2: Solo excluir bots muy obvios
        if (candidatos.length === 0) {
            console.log(`⚠️ DEBUG balanceAutomaticoContinuo: Aplicando fallback final (solo bots obvios)...`);
            
            candidatos = equipoConMas.filter(jugador => {
                if (!jugador || typeof jugador.id === 'undefined') return false;
                
                // Solo excluir HOST LNB e ID 0
                if (jugador.id === 0 || jugador.name === 'HOST LNB') return false;
                
                const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
                if (!jugadorActual || jugadorActual.team === 0) return false;
                
                return true;
            });
            
            console.log(`🔄 DEBUG balanceAutomaticoContinuo: Candidatos con criterios mínimos: ${candidatos.length}`);
        }
    }
    
    console.log(`🎯 DEBUG balanceAutomaticoContinuo: Candidatos válidos: ${candidatos.length}/${equipoConMas.length}`);
    candidatos.forEach(c => console.log(`  - ${c.name} (ID: ${c.id}, Team: ${c.team})`));
    
    // CORRECCIÓN CRÍTICA: Verificar que hay candidatos antes de continuar
    if (candidatos.length === 0) {
        console.log(`⚠️ DEBUG balanceAutomaticoContinuo: NO HAY candidatos válidos para balance automático continuo`);
        console.log(`📊 DEBUG balanceAutomaticoContinuo: Estado AFK: ${jugadoresAFK ? Array.from(jugadoresAFK.keys()).join(', ') : 'N/A'}`);
        
        // Mostrar información detallada para debug
        equipoConMas.forEach(jugador => {
            const esBot = funcionEsBot(jugador);
            const esAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            const enEquipo = jugadorActual && jugadorActual.team !== 0;
            console.log(`   ${jugador.name}: Bot=${esBot}, AFK=${esAFK}, EnEquipo=${enEquipo}`);
        });
        
        // PROBLEMA DETECTADO: Informar al chat que no se puede balancear - DESACTIVADO
        // if (equipoConMas.length > 0) {
        //     anunciarGeneral(`⚖️ ❌ No se puede equilibrar: jugadores no disponibles para balance`, "FFA500", "normal");
        // }
        
        return false;
    }
    
    // CORRECCIÓN: Calcular mejor el número de jugadores a mover
    let jugadoresAMover = Math.floor(diferencia / 2);
    
    // Asegurar que movemos al menos 1 jugador si hay diferencia > 1
    if (diferencia > 1 && jugadoresAMover === 0) {
        jugadoresAMover = 1;
    }
    
    // Limitar por candidatos disponibles
    jugadoresAMover = Math.min(jugadoresAMover, candidatos.length);
    
    console.log(`⚖️ DEBUG balanceAutomaticoContinuo: Calculado - mover ${jugadoresAMover} jugador(es) del equipo ${equipoConMasNombre} al ${equipoConMenosNombre}`);
    
    // CORRECCIÓN: Verificar que tenemos al menos un jugador para mover
    if (jugadoresAMover === 0) {
        console.log(`⚠️ DEBUG balanceAutomaticoContinuo: No hay jugadores calculados para mover`);
        return false;
    }
    
    // CORRECIÓN: Anunciar el balance ANTES de mover jugadores (para confirmar que llega hasta aquí) - DESACTIVADO
    // anunciarGeneral(`⚖️ 🔄 Equilibrando equipos por desconexión (${jugadoresAMover} jugador${jugadoresAMover > 1 ? 'es' : ''})…`, "87CEEB", "bold");
    
    // CORRECCIÓN: Mezclar candidatos y mover uno por uno con verificaciones
    const candidatosAleatorios = [...candidatos].sort(() => 0.5 - Math.random());
    let jugadoresMovidos = 0;
    
    for (let i = 0; i < jugadoresAMover && i < candidatosAleatorios.length; i++) {
        const jugadorSeleccionado = candidatosAleatorios[i];
        
        try {
            // Verificar una vez más que el jugador está disponible
            const jugadorActual = room.getPlayerList().find(j => j.id === jugadorSeleccionado.id);
            if (!jugadorActual || jugadorActual.team === 0) {
                console.log(`⚠️ DEBUG balanceAutomaticoContinuo: ${jugadorSeleccionado.name} ya no está disponible para mover`);
                continue;
            }
            
            console.log(`🎲 DEBUG balanceAutomaticoContinuo: Seleccionado para mover: ${jugadorSeleccionado.name} (${i+1}/${jugadoresAMover})`);
            
            // CORRECCIÓN: Marcar movimiento como iniciado por el bot ANTES de mover
            if (movimientoIniciadorPorBot) {
                movimientoIniciadorPorBot.add(jugadorSeleccionado.id);
                console.log(`🤖 DEBUG balanceAutomaticoContinuo: Marcado movimiento iniciado por bot para ${jugadorSeleccionado.name}`);
            }
            
            // CORRECCIÓN CRÍTICA: Ejecutar el movimiento
            console.log(`➡️ DEBUG balanceAutomaticoContinuo: EJECUTANDO room.setPlayerTeam(${jugadorSeleccionado.id}, ${equipoConMenos}) para ${jugadorSeleccionado.name}`);
            const equipoAnterior = jugadorActual.team;
            
            room.setPlayerTeam(jugadorSeleccionado.id, equipoConMenos);
            
            // Verificar inmediatamente que el movimiento fue exitoso
            const verificarMovimiento = () => {
                const jugadorDespues = room.getPlayerList().find(j => j.id === jugadorSeleccionado.id);
                if (jugadorDespues && jugadorDespues.team === equipoConMenos) {
                    console.log(`✅ DEBUG balanceAutomaticoContinuo: ${jugadorSeleccionado.name} movido EXITOSAMENTE de equipo ${equipoAnterior} al ${equipoConMenos}`);
                    
                    // Anunciar el movimiento individual - DESHABILITADO
                    const equipoDestinoEmoji = equipoConMenos === 1 ? '🔴' : '🔵';
                    // anunciarGeneral(`⚖️ ${jugadorSeleccionado.name} → ${equipoDestinoEmoji} ${equipoConMenosNombre}`, "90EE90", "normal");
                } else {
                    console.log(`❌ DEBUG balanceAutomaticoContinuo: FALLO al mover ${jugadorSeleccionado.name} - equipo actual: ${jugadorDespues ? jugadorDespues.team : 'desconectado'}`);
                }
            };
            
            // Verificar después de un pequeño delay
            setTimeout(verificarMovimiento, 100);
            
            jugadoresMovidos++;
            
        } catch (error) {
            console.log(`❌ ERROR balanceAutomaticoContinuo moviendo ${jugadorSeleccionado.name}: ${error.message}`);
            console.log(`   Stack trace: ${error.stack}`);
        }
    }
    
    console.log(`🏁 DEBUG balanceAutomaticoContinuo: Movimientos completados - ${jugadoresMovidos} jugadores procesados, esperando verificación...`);
    
    // CORRECCIÓN: Verificar resultado después de un delay apropiado
    setTimeout(() => {
        const equiposPostBalance = obtenerCantidadJugadoresPorEquipo();
        console.log(`📊 DEBUG balanceAutomaticoContinuo Post-balance: Rojo=${equiposPostBalance.rojo}, Azul=${equiposPostBalance.azul}, Diferencia=${equiposPostBalance.diferencia}`);
        
        if (equiposPostBalance.diferencia <= 1) {
            console.log(`✅ DEBUG balanceAutomaticoContinuo: Balance COMPLETADO exitosamente - diferencia final: ${equiposPostBalance.diferencia}`);
            // anunciarGeneral(`✅ Equipos equilibrados correctamente`, "90EE90", "normal");
        } else if (equiposPostBalance.diferencia > 1 && equiposPostBalance.rojo > 0 && equiposPostBalance.azul > 0) {
            console.log(`🔄 DEBUG balanceAutomaticoContinuo: AÚN hay diferencia mayor a 1 (${equiposPostBalance.diferencia}), programando nuevo balance en 2s`);
            setTimeout(() => {
                console.log(`🔄 DEBUG balanceAutomaticoContinuo: Ejecutando balance recursivo...`);
                balanceAutomaticoContinuo();
            }, 2000);
        }
    }, 1000);
    
    return jugadoresMovidos > 0;
}
// ========== FIN DE LA FUNCIÓN CORREGIDA ==========

// FUNCIÓN DE AUTO BALANCE DE EQUIPOS (MANTENER COMPATIBILIDAD)
function autoBalanceEquipos() {
    // Primero ejecutar el balance automático continuo
    balanceAutomaticoContinuo();
    
    // Luego usar la función de balance inteligente como respaldo
    setTimeout(() => {
        balanceInteligente("auto balance");
    }, 1000);
}

// Variables para controlar la frecuencia de verificarAutoStart
let ultimaVerificacionAutoStart = 0;
let verificandoAutoStart = false;
const INTERVALO_MINIMO_VERIFICACION = 1000; // 1 segundo mínimo (CORREGIDO para mezclas)

// FUNCIÓN PARA VERIFICAR AUTO START
function verificarAutoStart(forzarVerificacion = false) {
    const ahora = Date.now();
    
    // Evitar llamadas muy frecuentes (excepto si se fuerza)
    if (!forzarVerificacion && ahora - ultimaVerificacionAutoStart < INTERVALO_MINIMO_VERIFICACION) {
        return;
    }
    
    // Evitar ejecuciones simultáneas
    if (verificandoAutoStart) {
        return;
    }
    
    // NUEVO: Bloquear auto-start si hay un reporte de replay pendiente
    if (bloqueadoPorReplay) {
        intentosAutoStartBloqueados++;
        console.log(`🎬 DEBUG: Auto-start bloqueado por envío de replay pendiente (intento #${intentosAutoStartBloqueados})`);
        
        // Mostrar mensaje solo en el primer intento bloqueado
        // if (intentosAutoStartBloqueados === 1) {
        //     anunciarInfo("⏳ Esperando completar envío de replay antes de iniciar próximo partido...");
        // }
        
        // TIMEOUT DE SEGURIDAD: Solo 8 intentos = 8 segundos máximo
        if (intentosAutoStartBloqueados >= 8) {
            console.log(`⚠️ DEBUG: TIMEOUT - Liberando bloqueo después de ${intentosAutoStartBloqueados} intentos`);
            // anunciarAdvertencia("⚠️ Timeout: Liberando bloqueo (8s)");
            liberarBloqueoReplay("Timeout de seguridad");
            // No retornar, continuar con la verificación normal
        } else {
            // Reintentar verificación en 1 segundo
            setTimeout(() => {
                verificarAutoStart();
            }, 1000);
            return;
        }
    }
    
    verificandoAutoStart = true;
    ultimaVerificacionAutoStart = ahora;
    
    // Logs eliminados para mejor rendimiento en VPS
    
    if (!autoStartEnabled || partidoEnCurso) {
        verificandoAutoStart = false;
        return;
    }
    
    // CORRECCIÓN: Usar siempre datos frescos para evitar problemas post-mezcla
    const jugadores = room.getPlayerList();
    const jugadoresRed = jugadores.filter(j => j.team === 1).length;
    const jugadoresBlue = jugadores.filter(j => j.team === 2).length;
    const totalJugadores = jugadoresRed + jugadoresBlue;
    
    console.log(`🔍 DEBUG AutoStart: ${totalJugadores} jugadores (R:${jugadoresRed}, B:${jugadoresBlue}), Mapa: ${mapaActual}, Min: ${mapas[mapaActual]?.minJugadores || 2}`);
    
    // Obtener mínimo de jugadores según el mapa actual
    const minJugadoresActual = mapas[mapaActual] ? mapas[mapaActual].minJugadores : 2;
    
    // Verificar si hay suficientes jugadores y equipos balanceados
    if (totalJugadores >= minJugadoresActual && Math.abs(jugadoresRed - jugadoresBlue) <= 1) {
        // Condiciones cumplidas
        console.log(`✅ DEBUG AutoStart: Condiciones cumplidas para iniciar partido`);
        
        if (timeoutAutoStart) {
            clearTimeout(timeoutAutoStart);
        }
        
        timeoutAutoStart = setTimeout(() => {
            console.log(`⏰ DEBUG: Ejecutando timeout de autostart...`);
            
            // Verificar nuevamente antes de iniciar
            const jugadoresActuales = room.getPlayerList();
            const redActuales = jugadoresActuales.filter(j => j.team === 1).length;
            const blueActuales = jugadoresActuales.filter(j => j.team === 2).length;
            const totalActuales = redActuales + blueActuales;
            const minActual = mapas[mapaActual] ? mapas[mapaActual].minJugadores : 2;
            
            // Logs reducidos para mejor rendimiento
            
            if (totalActuales >= minActual && Math.abs(redActuales - blueActuales) <= 1 && !partidoEnCurso) {
                // Mensaje de inicio automático eliminado
                room.startGame();
                // Resetear la variable para permitir el mensaje en el próximo partido
                mensajeAutoStartMostrado = false;
            }
        }, tiempoEsperaInicio);
        
        // Solo mostrar el mensaje una vez por intento de inicio
        if (!mensajeAutoStartMostrado) {
            // Mensaje removido para evitar spam
            mensajeAutoStartMostrado = true;
        }
    } else {
        // CORRECCIÓN: Loguear por qué no se cumplen las condiciones
        const razonFalla = [];
        if (totalJugadores < minJugadoresActual) {
            razonFalla.push(`jugadores insuficientes (${totalJugadores}/${minJugadoresActual})`);
        }
        if (Math.abs(jugadoresRed - jugadoresBlue) > 1) {
            razonFalla.push(`equipos desbalanceados (R:${jugadoresRed}, B:${jugadoresBlue})`);
        }
        console.log(`❌ DEBUG AutoStart: Condiciones NO cumplidas - ${razonFalla.join(", ")}`);
        
        // Cancelar auto start si las condiciones no se cumplen
        if (timeoutAutoStart) {
            clearTimeout(timeoutAutoStart);
            timeoutAutoStart = null;
        }
        // Resetear la variable cuando las condiciones no se cumplen
        mensajeAutoStartMostrado = false;
    }
    
    // IMPORTANTE: Desactivar flag al final
    verificandoAutoStart = false;
}

// FUNCIÓN PARA MEZCLAR EQUIPOS AL FINAL DEL PARTIDO (SIN VERIFICAR AUTO START INMEDIATAMENTE)
function mezclarEquiposAleatoriamenteFinPartido() {
    // VERIFICACIÓN CRÍTICA: No mezclar si el partido ya está en curso
    if (partidoEnCurso) {
        console.log(`🚫 DEBUG: Mezcla cancelada - partido ya en curso`);
        return;
    }
    
    // Activar la variable de control para evitar múltiples verificaciones
    mezclaProcesandose = true;
    
    const todosJugadores = room.getPlayerList().filter(j => !esBot(j)); // Excluir el bot
    
    // Solo considerar jugadores que están actualmente en equipos (no en espectadores/AFK)
    const jugadoresEnEquipos = todosJugadores.filter(j => j.team === 1 || j.team === 2);
    
    if (jugadoresEnEquipos.length < 2) {
        // Silenciosamente cancelar la mezcla si no hay suficientes jugadores
        mezclaProcesandose = false; // Desactivar control
        return;
    }
    
    // CORRECCIÓN CRÍTICA: Verificar cambio de mapa ANTES de mover jugadores
    const jugadoresActivos = jugadoresEnEquipos.length;
    let requiereCambioMapa = false;
    let nuevoMapa = null;
    
    // Detectar si se necesita cambio de mapa basado en la cantidad de jugadores
    if (mapaActual === "biggerx5" && jugadoresActivos >= 12) {
        requiereCambioMapa = true;
        nuevoMapa = "biggerx7";
    } else if (mapaActual === "biggerx3" && jugadoresActivos >= 9) {
        requiereCambioMapa = true;
        nuevoMapa = "biggerx5";
    } else if (mapaActual === "biggerx1" && jugadoresActivos >= 5) {
        requiereCambioMapa = true;
        nuevoMapa = "biggerx3";
    }
    
    // Si se requiere cambio de mapa, hacerlo ANTES de mezclar equipos
    if (requiereCambioMapa && nuevoMapa) {
        console.log(`🗺️ DEBUG: Cambiando mapa ANTES de mezclar equipos: ${mapaActual} -> ${nuevoMapa}`);
        
        const mapaAnterior = mapaActual;
        if (cambiarMapa(nuevoMapa)) {
            console.log(`✅ DEBUG: Cambio de mapa exitoso: ${mapaAnterior} -> ${nuevoMapa}`);
            const formatoAnterior = mapaAnterior === "biggerx5" ? "x4" : mapaAnterior === "biggerx3" ? "x3" : "x1";
            const formatoNuevo = nuevoMapa === "biggerx7" ? "x7" : nuevoMapa === "biggerx5" ? "x4" : "x3";
            anunciarExito(`🎯 ¡Cambio automático! Detectados ${jugadoresActivos} jugadores - Cambiando de ${formatoAnterior} a ${formatoNuevo}`);
        } else {
            console.log(`❌ DEBUG: Fallo al cambiar mapa, continuando con mezcla en mapa actual`);
        }
    }
    
    // Paso 1: Mover SOLO a los jugadores que están en equipos a espectadores temporalmente
    // Mensaje de mezclado eliminado
    
    // Guardar los IDs de los jugadores que vamos a mezclar
    const idsJugadoresAMezclar = jugadoresEnEquipos.map(j => j.id);
    
    // CORRECCIÓN: Marcar todos los movimientos como iniciados por bot para evitar mensajes duplicados
    jugadoresEnEquipos.forEach(jugador => {
        if (movimientoIniciadorPorBot) {
            movimientoIniciadorPorBot.add(jugador.id);
        }
        room.setPlayerTeam(jugador.id, 0);
    });
    
    // Paso 2: Esperar un momento y luego mezclar aleatoriamente SOLO a los que estaban en equipos
    setTimeout(() => {
        // Obtener solo los jugadores que estaban en equipos antes de la mezcla
        const jugadoresParaMezclar = room.getPlayerList().filter(j => 
            !esBot(j) && idsJugadoresAMezclar.includes(j.id)
        );
        
        if (jugadoresParaMezclar.length < 2) {
            anunciarInfo("⚠️ No hay suficientes jugadores para mezclar");
            mezclaProcesandose = false; // Desactivar control
            return;
        }
        
        // Crear una copia del array de jugadores y mezclarlo
        const jugadoresMezclados = [...jugadoresParaMezclar];
        
        // Algoritmo Fisher-Yates para mezclar aleatoriamente
        for (let i = jugadoresMezclados.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [jugadoresMezclados[i], jugadoresMezclados[j]] = [jugadoresMezclados[j], jugadoresMezclados[i]];
        }
        
        // Dividir los jugadores mezclados entre los dos equipos
        const mitad = Math.ceil(jugadoresMezclados.length / 2);
        
        // Activar flag de mezcla para permitir movimientos del sistema durante la mezcla
        mezclaProcesandose = true;
        
        // Asignar primera mitad al equipo rojo (1)
        for (let i = 0; i < mitad && i < jugadoresMezclados.length; i++) {
            room.setPlayerTeam(jugadoresMezclados[i].id, 1);
        }
        
        // Asignar segunda mitad al equipo azul (2)
        for (let i = mitad; i < jugadoresMezclados.length; i++) {
            room.setPlayerTeam(jugadoresMezclados[i].id, 2);
        }
        
        
        
        // Mostrar los equipos formados y verificar que se hicieron correctamente
        setTimeout(() => {
            // Verificar auto start después de formar equipos con delay adicional
            setTimeout(() => {
                mezclaProcesandose = false; // Desactivar control ANTES de verificar auto start
                    
// IMPORTANTE: Detectar cambio de mapa necesario (ej. biggerx5 -> biggerx7 con 12+ jugadores)
                    console.log(`🔄 DEBUG fin partido: Verificando cambio de mapa tras mezcla...`);
                    // Verificación explícita para biggerx5 -> biggerx7
                    const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                    console.log(`🔍 DEBUG: Verificación específica post-mezcla - Jugadores activos: ${jugadoresActivos}, Mapa actual: ${mapaActual}`);
                    if (mapaActual === "biggerx5" && jugadoresActivos >= 12) {
                        console.log(`⚠️ DEBUG: Detectado umbral crítico de 12+ jugadores (${jugadoresActivos}) en mapa x5 - Forzando cambio a x7`);
                        cambiarMapa("biggerx7");
                        anunciarExito(`🎯 ¡Cambio automático! Detectados ${jugadoresActivos} jugadores - Cambiando de x4 a x7`);
                    } else {
                        detectarCambioMapa();
                    }
                    
                    // CORRECCIÓN: Llamadas forzadas para asegurar que se ejecute post-mezcla
                    console.log(`🚀 DEBUG fin partido: Forzando verificarAutoStart post-mezcla...`);
                    verificarAutoStart(true);
                    
                    // Llamada adicional después de 500ms para garantizar que funcione
                    setTimeout(() => {
                        console.log(`🚀 DEBUG fin partido: Segunda llamada forzada a verificarAutoStart...`);
                        verificarAutoStart(true);
                    }, 500);
                    
                    // Tercera llamada como respaldo final
                    setTimeout(() => {
                        console.log(`🚀 DEBUG fin partido: Tercera llamada forzada a verificarAutoStart (respaldo)...`);
                        verificarAutoStart(true);
                    }, 2000);
                    
                }, 500); // Aumentado a 500ms para dar más tiempo
        }, 30); // Optimizado a 30ms
        
    }, 150); // Optimizado a 150ms
}

// FUNCIÓN PARA MEZCLAR EQUIPOS ALEATORIAMENTE
function mezclarEquiposAleatoriamente() {
    // VERIFICACIÓN CRÍTICA: No mezclar si el partido ya está en curso
    if (partidoEnCurso) {
        console.log(`🚫 DEBUG: Mezcla manual cancelada - partido ya en curso`);
        anunciarError("❌ No se puede mezclar equipos durante un partido");
        return;
    }
    
    const todosJugadores = room.getPlayerList().filter(j => !esBot(j)); // Excluir el bot
    
    // Solo considerar jugadores que están actualmente en equipos (no en espectadores/AFK)
    const jugadoresEnEquipos = todosJugadores.filter(j => j.team === 1 || j.team === 2);
    
    console.log(`🔄 DEBUG mezcla: ${jugadoresEnEquipos.length} jugadores en equipos de ${todosJugadores.length} totales`);
    
    if (jugadoresEnEquipos.length < 2) {
        // Silenciosamente cancelar la mezcla si no hay suficientes jugadores
        console.log(`❌ DEBUG mezcla: No hay suficientes jugadores (${jugadoresEnEquipos.length})`);
        return;
    }
    
    // Paso 1: Mover SOLO a los jugadores que están en equipos a espectadores temporalmente
    anunciarGeneral("🔄 ⚡ MEZCLANDO EQUIPOS... ⚡ 🔄", "FFD700", "bold");
    
    // Guardar los IDs de los jugadores que vamos a mezclar
    const idsJugadoresAMezclar = jugadoresEnEquipos.map(j => j.id);
    console.log(`📋 DEBUG mezcla: IDs a mezclar: [${idsJugadoresAMezclar.join(', ')}]`);
    
    jugadoresEnEquipos.forEach(jugador => {
        console.log(`➡️ DEBUG: Moviendo ${jugador.name} (ID: ${jugador.id}) a espectadores`);
        room.setPlayerTeam(jugador.id, 0);
    });
    
    // Paso 2: Esperar un momento y luego mezclar aleatoriamente SOLO a los que estaban en equipos
    setTimeout(() => {
        console.log(`⏰ DEBUG: Ejecutando mezcla después del timeout...`);
        
        // Obtener solo los jugadores que estaban en equipos antes de la mezcla
        const jugadoresParaMezclar = room.getPlayerList().filter(j => 
            !esBot(j) && idsJugadoresAMezclar.includes(j.id)
        );
        
        console.log(`👥 DEBUG mezcla: ${jugadoresParaMezclar.length} jugadores encontrados para mezclar`);
        jugadoresParaMezclar.forEach(j => {
            console.log(`  - ${j.name} (ID: ${j.id}, equipo actual: ${j.team})`);
        });
        
        if (jugadoresParaMezclar.length < 2) {
            anunciarInfo("⚠️ No hay suficientes jugadores para mezclar");
            console.log(`❌ DEBUG: No hay suficientes jugadores después del timeout`);
            return;
        }
        
        // Crear una copia del array de jugadores y mezclarlo
        const jugadoresMezclados = [...jugadoresParaMezclar];
        
        // Algoritmo Fisher-Yates para mezclar aleatoriamente
        for (let i = jugadoresMezclados.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [jugadoresMezclados[i], jugadoresMezclados[j]] = [jugadoresMezclados[j], jugadoresMezclados[i]];
        }
        
        // Dividir los jugadores mezclados entre los dos equipos
        const mitad = Math.ceil(jugadoresMezclados.length / 2);
        console.log(`⚖️ DEBUG distribución: ${mitad} al rojo, ${jugadoresMezclados.length - mitad} al azul`);
        
        // Activar flag de mezcla para permitir movimientos del sistema
        mezclaProcesandose = true;
        console.log(`🔄 DEBUG: Activando flag de mezcla para permitir movimientos del sistema`);
        
        // Asignar primera mitad al equipo rojo (1)
        for (let i = 0; i < mitad && i < jugadoresMezclados.length; i++) {
            console.log(`🔴 DEBUG: Asignando ${jugadoresMezclados[i].name} (ID: ${jugadoresMezclados[i].id}) al equipo ROJO`);
            room.setPlayerTeam(jugadoresMezclados[i].id, 1);
            
            // Verificar inmediatamente después de la asignación
            setTimeout(() => {
                const jugadorVerificar = room.getPlayerList().find(j => j.id === jugadoresMezclados[i].id);
                if (jugadorVerificar) {
                    console.log(`✅ DEBUG inmediato: ${jugadorVerificar.name} (ID: ${jugadorVerificar.id}) está en equipo ${jugadorVerificar.team}`);
                    if (jugadorVerificar.team !== 1) {
                        console.log(`❌ DEBUG ERROR: Jugador NO está en equipo rojo como se esperaba!`);
                    }
                } else {
                    console.log(`❌ DEBUG ERROR: Jugador ID ${jugadoresMezclados[i].id} no encontrado después de asignación`);
                }
            }, 50);
        }
        
        // Asignar segunda mitad al equipo azul (2)
        for (let i = mitad; i < jugadoresMezclados.length; i++) {
            console.log(`🔵 DEBUG: Asignando ${jugadoresMezclados[i].name} (ID: ${jugadoresMezclados[i].id}) al equipo AZUL`);
            room.setPlayerTeam(jugadoresMezclados[i].id, 2);
            
            // Verificar inmediatamente después de la asignación
            setTimeout(() => {
                const jugadorVerificar = room.getPlayerList().find(j => j.id === jugadoresMezclados[i].id);
                if (jugadorVerificar) {
                    console.log(`✅ DEBUG inmediato: ${jugadorVerificar.name} (ID: ${jugadorVerificar.id}) está en equipo ${jugadorVerificar.team}`);
                    if (jugadorVerificar.team !== 2) {
                        console.log(`❌ DEBUG ERROR: Jugador NO está en equipo azul como se esperaba!`);
                    }
                } else {
                    console.log(`❌ DEBUG ERROR: Jugador ID ${jugadoresMezclados[i].id} no encontrado después de asignación`);
                }
            }, 50);
        }
        
        // Desactivar flag de mezcla y recordar que el bloqueo es permanente
        mezclaProcesandose = false;
        anunciarGeneral("🔒 Equipos formados. Solo puedes usar !afk para salir o !back para volver", "FFA500", "bold");
        
        // Mensaje informativo sobre jugadores AFK
        const jugadoresAFK = todosJugadores.filter(j => j.team === 0 && !idsJugadoresAMezclar.includes(j.id));
        if (jugadoresAFK.length > 0) {
            anunciarInfo(`💤 Jugadores AFK mantienen su estado: ${jugadoresAFK.map(j => j.name).join(", ")}`);
        }
        
        // Mostrar los equipos formados y verificar que se hicieron correctamente (ACELERADO)
        setTimeout(() => {
            console.log(`🔍 DEBUG: Verificando equipos después de 100ms... (ULTRA RÁPIDO)`);
            
            const jugadoresActualizados = room.getPlayerList();
            console.log(`👥 DEBUG: ${jugadoresActualizados.length} jugadores conectados total`);
            jugadoresActualizados.forEach(j => {
                console.log(`  - ${j.name} (ID: ${j.id}, equipo: ${j.team})`);
            });
            
            const equipoRojo = jugadoresActualizados.filter(j => j.team === 1);
            const equipoAzul = jugadoresActualizados.filter(j => j.team === 2);
            const espectadores = jugadoresActualizados.filter(j => j.team === 0);
            
            console.log(`✅ DEBUG equipos formados:`);
            console.log(`  🔴 Equipo Rojo (${equipoRojo.length}): ${equipoRojo.map(j => `${j.name}(${j.id})`).join(', ')}`);
            console.log(`  🔵 Equipo Azul (${equipoAzul.length}): ${equipoAzul.map(j => `${j.name}(${j.id})`).join(', ')}`);
            console.log(`  ⚪ Espectadores (${espectadores.length}): ${espectadores.map(j => `${j.name}(${j.id})`).join(', ')}`);
            
            // Verificar si los IDs originales siguen conectados
            idsJugadoresAMezclar.forEach(id => {
                const jugadorActual = jugadoresActualizados.find(j => j.id === id);
                if (jugadorActual) {
                    console.log(`✅ DEBUG: Jugador ID ${id} (${jugadorActual.name}) sigue conectado en equipo ${jugadorActual.team}`);
                } else {
                    console.log(`❌ DEBUG: Jugador ID ${id} se desconectó después de la asignación`);
                }
            });
            
            // NO desactivar bloqueo - el bloqueo es permanente
            setTimeout(() => {
                // Mensaje informativo sobre el sistema permanente
                anunciarInfo("ℹ️ Recordatorio: Usa !afk para ir a espectadores o !back para unirte a un equipo");
                
                // CORRECCIÓN: Verificar auto start con llamadas forzadas post-mezcla manual
                setTimeout(() => {
                    console.log(`🚀 DEBUG: Forzando verificarAutoStart después de la mezcla manual...`);
                    verificarAutoStart(true);
                    
                    // Llamada adicional como respaldo
                    setTimeout(() => {
                        console.log(`🔄 DEBUG: Segunda llamada forzada post-mezcla manual...`);
                        verificarAutoStart(true);
                    }, 1000);
                }, 200); // Mayor delay para asegurar que los equipos estén formados
            }, 100); // ULTRA RÁPIDO: 100ms en lugar de 500ms
        }, 100); // ULTRA RÁPIDO: 100ms en lugar de 500ms
        
    }, 100); // ULTRA RÁPIDO: 100ms en lugar de 500ms para mezclar
}

// FUNCIÓN PARA VERIFICAR AUTO STOP
function verificarAutoStop(jugadorDesconectado = null) {
    if (!autoStopEnabled || !partidoEnCurso) return;
    
    const jugadores = room.getPlayerList();
    const jugadoresRed = jugadores.filter(j => j.team === 1).length;
    const jugadoresBlue = jugadores.filter(j => j.team === 2).length;
    const totalJugadores = jugadoresRed + jugadoresBlue;
    
    // Parar partido si quedan muy pocos jugadores
    if (totalJugadores < 2 || jugadoresRed === 0 || jugadoresBlue === 0) {
        anunciarAdvertencia("⏹️ Auto parando partido por falta de jugadores...", null);
        room.stopGame();
    }
}

// ==================== SISTEMA OPTIMIZADO DE INTERVALOS DINÁMICOS ====================
let intervaloActualAFK = 5000; // Intervalo inicial: 5 segundos (ULTRA RÁPIDO para detección)
let ultimaVerificacionJugadores = 0;
let cacheJugadoresCount = 0;

// FUNCIÓN OPTIMIZADA: Calcula intervalos según carga de jugadores
function calcularIntervaloOptimo(numeroJugadores) {
    if (numeroJugadores === 0) return 10000;      // 10s - sala vacía (ACELERADO)
    if (numeroJugadores <= 6) return 5000;       // 5s - pocos jugadores (ULTRA RÁPIDO)
    if (numeroJugadores <= 12) return 3000;      // 3s - carga media (ULTRA RÁPIDO)
    if (numeroJugadores <= 18) return 2000;      // 2s - carga alta (ULTRA RÁPIDO)
    return 1000;                                  // 1s - sala llena (ULTRA RÁPIDO para auto-start)
}

// FUNCIÓN OPTIMIZADA: Actualiza intervalo dinámicamente
function actualizarIntervaloAFK(numeroJugadores) {
    const nuevoIntervalo = calcularIntervaloOptimo(numeroJugadores);
    
    if (nuevoIntervalo !== intervaloActualAFK) {
        // Log de optimización eliminado para mejor rendimiento en VPS
        intervaloActualAFK = nuevoIntervalo;
        
        // Reiniciar intervalo con nueva frecuencia
        if (intervalAFK) {
            clearInterval(intervalAFK);
        }
        intervalAFK = setInterval(verificarInactividad, nuevoIntervalo);
    }
}

// MOVIMIENTO AUTOMÁTICO A ESPECTADORES POR INACTIVIDAD - VERSIÓN OPTIMIZADA
function verificarInactividad() {
    const ahora = Date.now();
    const jugadoresConectados = room.getPlayerList();
    const numeroJugadores = jugadoresConectados.length;
    
    // OPTIMIZACIÓN 1: Pausar si no hay jugadores
    if (numeroJugadores === 0) {
        return; // Log eliminado para mejor rendimiento
    }
    
    // OPTIMIZACIÓN 2: Actualizar intervalo dinámicamente solo si cambió significativamente
    if (Math.abs(numeroJugadores - cacheJugadoresCount) >= 2) {
        actualizarIntervaloAFK(numeroJugadores);
        cacheJugadoresCount = numeroJugadores;
    }
    
    const salaLlena = numeroJugadores >= maxPlayers;
    const TIEMPO_AFK_KICK_SALA_LLENA = 5 * 60 * 1000; // 5 minutos
    const TIEMPO_AFK_KICK_MENOS_18 = 12 * 60 * 1000; // 12 minutos

    // OPTIMIZACIÓN 3: Batch processing - agrupar operaciones
    const jugadoresParaProcesar = [];
    const jugadoresParaActualizar = [];
    
    jugadoresConectados.forEach(jugador => {
        const infoAFK = jugadoresAFK.get(jugador.id);
        const stats = estadisticasPartido.jugadores[jugador.id];

        // Excluir arqueros del sistema AFK
        if (stats && stats.arquero) return;
        
        // Excluir administradores del sistema AFK
        if (esAdminBasico(jugador)) return;

        if (infoAFK && jugador.position) {
            const { ultimaActividad, posicionAnterior } = infoAFK;
            const dx = jugador.position.x - posicionAnterior.x;
            const dy = jugador.position.y - posicionAnterior.y;
            
            // OPTIMIZACIÓN CRÍTICA: Eliminar Math.sqrt costoso usando distancia al cuadrado
            const distanciaCuadrada = dx * dx + dy * dy;
            const MINIMO_MOVIMIENTO_AFK_CUADRADO = MINIMO_MOVIMIENTO_AFK * MINIMO_MOVIMIENTO_AFK;

            if (distanciaCuadrada < MINIMO_MOVIMIENTO_AFK_CUADRADO) {
                enviarAdvertenciaAFK(jugador);

                let tiempoParaAccion = null;
                let accion = null; // 'expulsar' o 'mover'
                let motivo = '';

                // Verificar si debe ser kickeado (2 minutos AFK)
                if (ahora - ultimaActividad > TIEMPO_AFK_KICK) {
                    tiempoParaAccion = TIEMPO_AFK_KICK;
                    accion = 'expulsar';
                    motivo = "2 minutos AFK = 👋";
                } else if (salaLlena && ahora - ultimaActividad > TIEMPO_AFK_KICK_SALA_LLENA) {
                    tiempoParaAccion = TIEMPO_AFK_KICK_SALA_LLENA;
                    accion = 'expulsar';
                    motivo = "Expulsado por inactividad (2 minutos en sala llena)";
                } else if (ahora - ultimaActividad > TIEMPO_AFK) {
                    // Mover a espectadores por inactividad (tiempo más corto)
                    tiempoParaAccion = TIEMPO_AFK;
                    accion = 'mover';
                    motivo = "Movido a espectadores por inactividad";
                }

                if (tiempoParaAccion && ahora - ultimaActividad > tiempoParaAccion) {
                    // OPTIMIZACIÓN: Agregar a batch para procesamiento
                    jugadoresParaProcesar.push({
                        jugador,
                        accion,
                        motivo
                    });
                }
            } else {
                jugadoresParaActualizar.push(jugador);
            }
        } else if (jugador.position) {
            jugadoresAFK.set(jugador.id, { ultimaActividad: ahora, posicionAnterior: { ...jugador.position } });
        }
    });
    
    // OPTIMIZACIÓN 4: Batch processing - procesar todos los jugadores AFK de una vez
    if (jugadoresParaProcesar.length > 0) {
        // Log eliminado para mejor rendimiento en VPS
        
        jugadoresParaProcesar.forEach(({jugador, accion, motivo}) => {
            if (accion === 'expulsar') {
                room.kickPlayer(jugador.id, motivo, false);
                anunciarAdvertencia(`🚫 ${jugador.name} fue expulsado. Motivo: ${motivo}`, null);
            } else if (accion === 'mover') {
                movimientoIniciadorPorBot.add(jugador.id);
                room.setPlayerTeam(jugador.id, 0);
                anunciarAdvertencia(`💤 ${jugador.name} ha sido movido a espectadores por inactividad`, null);
                
                // OPTIMIZACIÓN: Mensaje único agrupado para reducir spam
                setTimeout(() => {
                    const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
                    if (jugadorActual) {
                        room.sendAnnouncement(
                            `💤 Movido por inactividad. Usa !back para volver o !ayuda para comandos`,
                            jugador.id,
                            parseInt("FFA500", 16),
                            "bold",
                            0
                        );
                    }
                }, 1000);
            }
            
            jugadoresAFK.delete(jugador.id);
            advertenciasAFK.delete(jugador.id);
        });
        
        // OPTIMIZACIÓN: Una sola llamada de balance/autostart después de procesar todos
        setTimeout(() => {
            autoBalanceEquipos();
            verificarAutoStart();
            if (jugadoresParaProcesar.some(j => j.accion === 'expulsar')) {
                verificarAutoStop();
            }
        }, 500);
    }
    
    // OPTIMIZACIÓN 5: Actualizar jugadores activos en batch
    jugadoresParaActualizar.forEach(jugador => {
        jugadoresAFK.set(jugador.id, { ultimaActividad: ahora, posicionAnterior: { ...jugador.position } });
        advertenciasAFK.delete(jugador.id);
    });
}

// Variable para controlar cambios de mapa múltiples
let cambioMapaEnProceso = false;
// Variable para detectar si el partido terminó por cambio de mapa
let terminoPorCambioMapa = false;
// Variable para controlar cambios de mapa pendientes (que esperan al final del partido)
let cambioMapaPendiente = null; // {mapa: 'biggerx7', razon: 'x5 -> x7 con 12+ jugadores'}
// Variables para controlar el spam de logs
let ultimoEstadoLogeado = {
    jugadores: -1,
    mapa: '',
    partido: false,
    timestamp: 0
};
const INTERVALO_LOG_THROTTLE = 60000; // Solo loguear cambios cada 60 segundos
// Control específico para el mensaje "Cambio de mapa ya en proceso"
let ultimoLogCambioEnProceso = 0;
const INTERVALO_LOG_CAMBIO_PROCESO = 120000; // Solo loguear "cambio en proceso" cada 2 minutos

// FUNCIÓN PARA VERIFICAR CAMBIO DE MAPA DESPUÉS DEL PARTIDO
// 🔄 IMPLEMENTA HISTÉRESIS PARA EVITAR CICLOS INFINITOS DE REINICIO:
//
// ✨ PROBLEMA SOLUCIONADO: Evita que jugadores entrando/saliendo en los umbrales exactos
//    (ej: 7, 10 jugadores) causen reinicios constantes del partido.
//
// 🎯 SOLUCIÓN: Usa umbrales diferentes para subir vs bajar de mapa:
//    • Para SUBIR de mapa: Umbrales normales (3->x3, 7->x4, 10->x7)
//    • Para BAJAR de mapa: Umbrales con tolerancia (< 2->x1, < 5->x3, < 8->x4)
//
// ⚙️ EJEMPLO: Tienes x4 con 7 jugadores y alguien sale/entra repetidamente:
//    ✅ SIN histéresis: 7 jugadores -> mantiene x4, 6 jugadores -> cambia a x3, 7 jugadores -> cambia a x4 (BUCLE!)
//    ✅ CON histéresis: 7 jugadores -> mantiene x4, 6 jugadores -> mantiene x4, 4 jugadores -> cambia a x3
function verificarCambioMapaPostPartido() {
    // Contar jugadores activos (en equipos 1 y 2, no espectadores)
    const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
    
    // CAMBIO CON HISTÉRESIS: De biggerx7 a biggerx5 si hay menos de 8 jugadores activos (tolerancia)
    if (mapaActual === "biggerx7" && jugadoresActivos < 8) {
        cambioMapaEnProceso = true;
        if (cambiarMapa("biggerx5")) {
            anunciarExito(`🎯 ¡Cambio automático! Detectados ${jugadoresActivos} jugadores - Cambiando de x7 a x4`);
            
            // Asegurar que el cambio se complete correctamente
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos
                console.log(`🔧 DEBUG: Iniciando secuencia post-cambio post-partido...`);
                
                // 1. Primero balance de equipos
                autoBalanceEquipos();
                
                // 2. Luego esperar un poco y verificar auto-start con más tiempo
                setTimeout(() => {
                    console.log(`⚙️ DEBUG: Ejecutando verificarAutoStart post-cambio post-partido...`);
                    verificarAutoStart(true);
                    
                    // 3. Verificación adicional para asegurar inicio
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            console.log(`🔄 DEBUG: Verificación adicional post-partido - Forzando auto-start...`);
                            verificarAutoStart(true);
                        }
                        
                        // 4. Finalmente liberar el bloqueo
                        cambioMapaEnProceso = false;
                        console.log(`✅ DEBUG: Secuencia post-cambio post-partido completada`);
                    }, 3000);
                }, 2000);
            }, 1500);
        } else {
            cambioMapaEnProceso = false;
        }
        return;
    }
    
// CAMBIO CON HISTÉRESIS: De biggerx5 (x4) a biggerx7 si hay 10 o más jugadores activos
    if (mapaActual === "biggerx5" && jugadoresActivos >= 10) {
        cambioMapaEnProceso = true;
        if (cambiarMapa("biggerx7")) {
            anunciarExito(`🎯 ¡Cambio automático! Detectados ${jugadoresActivos} jugadores - Cambiando de x4 a x7`);
            
            // Asegurar que el cambio se complete correctamente
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos  
                autoBalanceEquipos();
                setTimeout(() => {
                    verificarAutoStart(true);
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            verificarAutoStart(true);
                        }
                        cambioMapaEnProceso = false;
                    }, 3000);
                }, 2000);
            }, 1500);
        } else {
            cambioMapaEnProceso = false;
        }
        return;
    }
    
    // CAMBIO CON HISTÉRESIS: De biggerx5 a biggerx3 si hay menos de 5 jugadores activos (tolerancia)
    if (mapaActual === "biggerx5" && jugadoresActivos < 5) {
        console.log(`📉 DEBUG: Cambiando de x5 a x3 post-partido con histéresis (${jugadoresActivos} < 5 jugadores)`);
        
        cambioMapaEnProceso = true;
        if (cambiarMapa("biggerx3")) {
            anunciarExito(`🎯 ¡Cambio automático! Detectados ${jugadoresActivos} jugadores - Cambiando de x4 a x3`);
            
            // Asegurar que el cambio se complete correctamente
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos  
                autoBalanceEquipos();
                setTimeout(() => {
                    verificarAutoStart(true);
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            verificarAutoStart(true);
                        }
                        cambioMapaEnProceso = false;
                    }, 3000);
                }, 2000);
            }, 1500);
        } else {
            console.error(`❌ Error al cambiar de x5 a x3 con ${jugadoresActivos} jugadores`);
            cambioMapaEnProceso = false;
        }
        return;
    }
    
    // CAMBIO CON HISTÉRESIS: De biggerx3 a biggerx5 si hay 7-9 jugadores
    if (mapaActual === "biggerx3" && jugadoresActivos >= 7 && jugadoresActivos < 10) {
        console.log(`📈 DEBUG: Cambiando de x3 a x5 post-partido (${jugadoresActivos} jugadores)`);
        
        cambioMapaEnProceso = true;
        if (cambiarMapa("biggerx5")) {
            anunciarExito(`🎯 ¡Cambio automático! Detectados ${jugadoresActivos} jugadores - Cambiando a x4`);
            
            // Asegurar que el cambio se complete correctamente
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos  
                autoBalanceEquipos();
                setTimeout(() => {
                    verificarAutoStart(true);
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            verificarAutoStart(true);
                        }
                        cambioMapaEnProceso = false;
                    }, 3000);
                }, 2000);
            }, 1500);
        } else {
            console.error(`❌ Error al cambiar de x3 a x5 con ${jugadoresActivos} jugadores`);
            cambioMapaEnProceso = false;
        }
        return;
    }
    
    // CAMBIO CON HISTÉRESIS: De biggerx3 a biggerx1 si hay menos de 2 jugadores activos (tolerancia)
    if (mapaActual === "biggerx3" && jugadoresActivos < 2) {
        console.log(`📉 DEBUG: Cambiando de x3 a x1 post-partido con histéresis (${jugadoresActivos} < 2 jugadores)`);
        
        cambioMapaEnProceso = true;
        if (cambiarMapa("biggerx1")) {
            anunciarExito(`🎯 ¡Cambio automático! Detectados ${jugadoresActivos} jugadores - Cambiando de x3 a x1`);
            
            // Asegurar que el cambio se complete correctamente
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos  
                autoBalanceEquipos();
                setTimeout(() => {
                    verificarAutoStart(true);
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            verificarAutoStart(true);
                        }
                        cambioMapaEnProceso = false;
                    }, 3000);
                }, 2000);
            }, 1500);
        } else {
            console.error(`❌ Error al cambiar de x3 a x1 con ${jugadoresActivos} jugadores`);
            cambioMapaEnProceso = false;
        }
        return;
    }
    
    // CAMBIO CON HISTÉRESIS: De biggerx1 a biggerx3 si hay 3-6 jugadores
    if (mapaActual === "biggerx1" && jugadoresActivos >= 3 && jugadoresActivos <= 6) {
        console.log(`📈 DEBUG: Cambiando de x1 a x3 post-partido (${jugadoresActivos} jugadores)`);
        
        cambioMapaEnProceso = true;
        if (cambiarMapa("biggerx3")) {
            anunciarExito(`🎯 ¡Cambio automático! Detectados ${jugadoresActivos} jugadores - Cambiando a x3`);
            
            // Asegurar que el cambio se complete correctamente
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos  
                autoBalanceEquipos();
                setTimeout(() => {
                    verificarAutoStart(true);
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            verificarAutoStart(true);
                        }
                        cambioMapaEnProceso = false;
                    }, 3000);
                }, 2000);
            }, 1500);
        } else {
            console.error(`❌ Error al cambiar de x1 a x3 con ${jugadoresActivos} jugadores`);
            cambioMapaEnProceso = false;
        }
        return;
    }
    
    console.log(`✅ DEBUG: No se necesita cambio de mapa post-partido (${jugadoresActivos} jugadores en ${mapaActual})`);
}

// ==================== SISTEMA OPTIMIZADO PARA DETECTAR CAMBIO DE MAPA ====================
let intervaloActualMapa = 5000; // 5s inicial (ULTRA RÁPIDO para cambios de mapa)
let ultimoCountJugadoresMapa = 0;
let ultimaVerificacionMapa = 0;

// FUNCIÓN OPTIMIZADA: Calcula intervalo según estado del juego
function calcularIntervaloMapa(partidoEnCurso, numeroJugadores) {
    if (numeroJugadores === 0) return 10000;          // 10s - sala vacía (ACELERADO)
    if (!partidoEnCurso && numeroJugadores <= 4) return 3000;  // 3s - sin partido, pocos jugadores (ULTRA RÁPIDO)
    if (!partidoEnCurso) return 2000;                 // 2s - sin partido (ULTRA RÁPIDO para auto-start)
    if (partidoEnCurso && numeroJugadores >= 12) return 5000; // 5s - partido activo, muchos jugadores
    return 3000;                                      // 3s - partido activo, jugadores normales
}

// FUNCIÓN OPTIMIZADA: Actualiza intervalo de detección de mapa
function actualizarIntervaloMapa(partidoEnCurso, numeroJugadores) {
    const nuevoIntervalo = calcularIntervaloMapa(partidoEnCurso, numeroJugadores);
    
    if (Math.abs(nuevoIntervalo - intervaloActualMapa) >= 5000) { // Solo cambiar si la diferencia es significativa
        // Log de optimización eliminado para mejor rendimiento en VPS
        intervaloActualMapa = nuevoIntervalo;
        
        // Reiniciar intervalo con nueva frecuencia (si existe)
        const intervalos = setInterval(() => {}, 1);
        const intervalId = intervalos - 1;
        if (intervalId > 0) {
            clearInterval(intervalId);
            setInterval(detectarCambioMapa, nuevoIntervalo);
        }
    }
}

// FUNCIÓN OPTIMIZADA PARA DETECTAR CAMBIO DE MAPA
function detectarCambioMapa() {
    // OPTIMIZACIÓN 1: Si ya hay un cambio de mapa en proceso, no ejecutar otro
    if (cambioMapaEnProceso) {
        const ahora = Date.now();
        if (ahora - ultimoLogCambioEnProceso > INTERVALO_LOG_CAMBIO_PROCESO) {
            console.log("🔄 DEBUG: Cambio de mapa ya en proceso, saltando...");
            ultimoLogCambioEnProceso = ahora;
        }
        return;
    }
    
    // OPTIMIZACIÓN 2: Si el mapa inicial no se ha aplicado correctamente, forzar la aplicación
    if (!mapaRealmenteAplicado) {
        console.log(`🔧 DEBUG: Mapa inicial no aplicado correctamente, forzando aplicación de ${mapaActual}`);
        if (cambiarMapa(mapaActual)) {
            mapaRealmenteAplicado = true;
            console.log(`✅ DEBUG: Mapa inicial aplicado correctamente: ${mapaActual}`);
        } else {
            console.error(`❌ DEBUG: Error al aplicar mapa inicial: ${mapaActual}`);
        }
        return;
    }
    
    // OPTIMIZACIÓN 3: Cache de jugadores activos y verificación temprana
    const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
    const ahora = Date.now();
    
    // OPTIMIZACIÓN 4: Actualizar intervalo dinámicamente solo cuando sea necesario
    if (Math.abs(jugadoresActivos - ultimoCountJugadoresMapa) >= 2 || 
        (ahora - ultimaVerificacionMapa) > 60000) { // Cada minuto o cambio significativo
        actualizarIntervaloMapa(partidoEnCurso, jugadoresActivos);
        ultimoCountJugadoresMapa = jugadoresActivos;
        ultimaVerificacionMapa = ahora;
    }
    
    // OPTIMIZACIÓN 5: Pausa cuando la sala está vacía
    if (jugadoresActivos === 0) {
        return; // Log eliminado para mejor rendimiento
    }
    
// OPTIMIZACIÓN 6: Usar la misma variable ahora ya declarada
if (ahora - ultimoEstadoLogeado.timestamp > INTERVALO_LOG_THROTTLE || jugadoresActivos !== ultimoEstadoLogeado.jugadores || mapaActual !== ultimoEstadoLogeado.mapa || partidoEnCurso !== ultimoEstadoLogeado.partido) {
    console.log(`🔍 DEBUG detectarCambioMapa: ${jugadoresActivos} jugadores activos, mapa actual: ${mapaActual}, partido en curso: ${partidoEnCurso}`);
    ultimoEstadoLogeado = {
        jugadores: jugadoresActivos,
        mapa: mapaActual,
        partido: partidoEnCurso,
        timestamp: ahora
    };
}

    // Durante partidos, cambiar mapas tanto a menores (si bajan jugadores) como a mayores (si suben jugadores)
    if (partidoEnCurso) {
        console.log(`⚽ DEBUG: Partido en curso, verificando cambios de mapa necesarios...`);
        
        // CAMBIOS A MAPAS MENORES (cuando bajan jugadores) - CON HISTÉRESIS PARA EVITAR OSCILACIONES
        // Cambiar de biggerx7 a biggerx5 si hay menos de 8 jugadores (tolerancia de 2)
        if (mapaActual === "biggerx7" && jugadoresActivos < 8) {
            cambioMapaEnProceso = true;
            terminoPorCambioMapa = true; // Marcar que el partido terminará por cambio de mapa
            // Log eliminado para mejor rendimiento
            anunciarAdvertencia("⏹️ Deteniendo partido para cambio de mapa...");
            room.stopGame();
            cambiarMapa("biggerx5");
            anunciarInfo(`🔄 Menos de 8 jugadores durante partido (${jugadoresActivos}). Cambiando de x7 a x4...`);
            
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos
                console.log(`🔧 DEBUG: Iniciando secuencia post-cambio de mapa...`);
                
                // 1. Primero balance de equipos
                autoBalanceEquipos();
                
                // 2. Luego esperar un poco y verificar auto-start con más tiempo
                setTimeout(() => {
                    console.log(`⚙️ DEBUG: Ejecutando verificarAutoStart post-cambio...`);
                    verificarAutoStart(true);
                    
                    // 3. Verificación adicional para asegurar inicio
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            console.log(`🔄 DEBUG: Verificación adicional - Forzando auto-start...`);
                            verificarAutoStart(true);
                        }
                        
                        // 4. Finalmente liberar el bloqueo
                        setTimeout(() => {
                            cambioMapaEnProceso = false;
                            terminoPorCambioMapa = false;
                            console.log(`✅ DEBUG: Secuencia post-cambio completada`);
                        }, 2000);
                    }, 3000);
                }, 2000);
            }, 1500);
            return;
        }
        
        // Cambiar de biggerx5 a biggerx3 si hay menos de 5 jugadores (tolerancia de 2)
        if (mapaActual === "biggerx5" && jugadoresActivos < 5) {
            cambioMapaEnProceso = true;
            terminoPorCambioMapa = true; // Marcar que el partido terminará por cambio de mapa
            // Log eliminado para mejor rendimiento
            anunciarAdvertencia("⏹️ Deteniendo partido para cambio de mapa...");
            room.stopGame();
            cambiarMapa("biggerx3");
            anunciarInfo(`🔄 Menos de 5 jugadores durante partido (${jugadoresActivos}). Cambiando de x4 a x3...`);
            
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos
                console.log(`🔧 DEBUG: Iniciando secuencia post-cambio de mapa...`);
                
                // 1. Primero balance de equipos
                autoBalanceEquipos();
                
                // 2. Luego esperar un poco y verificar auto-start con más tiempo
                setTimeout(() => {
                    console.log(`⚙️ DEBUG: Ejecutando verificarAutoStart post-cambio...`);
                    verificarAutoStart(true);
                    
                    // 3. Verificación adicional para asegurar inicio
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            console.log(`🔄 DEBUG: Verificación adicional - Forzando auto-start...`);
                            verificarAutoStart(true);
                        }
                        
                        // 4. Finalmente liberar el bloqueo
                        setTimeout(() => {
                            cambioMapaEnProceso = false;
                            terminoPorCambioMapa = false;
                            console.log(`✅ DEBUG: Secuencia post-cambio completada`);
                        }, 2000);
                    }, 3000);
                }, 2000);
            }, 1500);
            return;
        }
        
        // Cambiar de biggerx3 a biggerx1 si hay menos de 3 jugadores
        if (mapaActual === "biggerx3" && jugadoresActivos < 3) {
            cambioMapaEnProceso = true;
            terminoPorCambioMapa = true; // Marcar que el partido terminará por cambio de mapa
            // Log eliminado para mejor rendimiento
            anunciarAdvertencia("⏹️ Deteniendo partido para cambio de mapa...");
            room.stopGame();
            cambiarMapa("biggerx1");
            // Cambio de mapa silencioso de x3 a x1
            
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos
                console.log(`🔧 DEBUG: Iniciando secuencia post-cambio de mapa...`);
                
                // 1. Primero balance de equipos
                autoBalanceEquipos();
                
                // 2. Luego esperar un poco y verificar auto-start con más tiempo
                setTimeout(() => {
                    console.log(`⚙️ DEBUG: Ejecutando verificarAutoStart post-cambio...`);
                    verificarAutoStart(true);
                    
                    // 3. Verificación adicional para asegurar inicio
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            console.log(`🔄 DEBUG: Verificación adicional - Forzando auto-start...`);
                            verificarAutoStart(true);
                        }
                        
                        // 4. Finalmente liberar el bloqueo
                        setTimeout(() => {
                            cambioMapaEnProceso = false;
                            terminoPorCambioMapa = false;
                            console.log(`✅ DEBUG: Secuencia post-cambio completada`);
                        }, 2000);
                    }, 3000);
                }, 2000);
            }, 1500);
            return;
        }
        
        // CAMBIOS A MAPAS MAYORES (cuando suben jugadores)
        // NUEVO: Cambiar de training a biggerx1 si hay 2 o más jugadores durante partido
        if (mapaActual === "training" && jugadoresActivos >= 2) {
            cambioMapaEnProceso = true;
            terminoPorCambioMapa = true; // Marcar que el partido terminará por cambio de mapa
            console.log(`📈 DEBUG CR�ÍTICO: Cambiando de training a x1 durante partido (${jugadoresActivos} >= 2)`);
            anunciarAdvertencia("⏹️ Deteniendo partido para cambio de mapa...");
            room.stopGame();
            cambiarMapa("biggerx1");
            anunciarInfo(`🔄 ${jugadoresActivos} jugadores detectados durante partido. Cambiando de training a x1...`);
            
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos
                console.log(`🔧 DEBUG: Iniciando secuencia post-cambio de mapa...`);
                
                // 1. Primero balance de equipos
                autoBalanceEquipos();
                
                // 2. Luego esperar un poco y verificar auto-start con más tiempo
                setTimeout(() => {
                    console.log(`⚙️ DEBUG: Ejecutando verificarAutoStart post-cambio...`);
                    verificarAutoStart();
                    
                    // 3. Verificación adicional para asegurar inicio
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            console.log(`🔄 DEBUG: Verificación adicional - Forzando auto-start...`);
                            verificarAutoStart();
                        }
                        
                        // 4. Finalmente liberar el bloqueo
                        setTimeout(() => {
                            cambioMapaEnProceso = false;
                            terminoPorCambioMapa = false;
                            console.log(`✅ DEBUG: Secuencia post-cambio completada`);
                        }, 2000);
                    }, 3000);
                }, 2000);
            }, 1500);
            return;
        }
        
        // Cambiar de biggerx1 a biggerx3 si hay 3 o más jugadores
        if (mapaActual === "biggerx1" && jugadoresActivos >= 3) {
            cambioMapaEnProceso = true;
            terminoPorCambioMapa = true; // Marcar que el partido terminará por cambio de mapa
            console.log(`📈 DEBUG: Cambiando de x1 a x3 durante partido (${jugadoresActivos} >= 3)`);
            anunciarAdvertencia("⏹️ Deteniendo partido para cambio de mapa...");
            room.stopGame();
            cambiarMapa("biggerx3");
            anunciarInfo(`🔄 ${jugadoresActivos} jugadores detectados durante partido. Cambiando de x1 a x3...`);
            
            setTimeout(() => {
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos
                console.log(`🔧 DEBUG: Iniciando secuencia post-cambio de mapa...`);
                
                // 1. Primero balance de equipos
                autoBalanceEquipos();
                
                // 2. Luego esperar un poco y verificar auto-start con más tiempo
                setTimeout(() => {
                    console.log(`⚙️ DEBUG: Ejecutando verificarAutoStart post-cambio...`);
                    verificarAutoStart();
                    
                    // 3. Verificación adicional para asegurar inicio
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            console.log(`🔄 DEBUG: Verificación adicional - Forzando auto-start...`);
                            verificarAutoStart();
                        }
                        
                        // 4. Finalmente liberar el bloqueo
                        setTimeout(() => {
                            cambioMapaEnProceso = false;
                            terminoPorCambioMapa = false;
                            console.log(`✅ DEBUG: Secuencia post-cambio completada`);
                        }, 2000);
                    }, 3000);
                }, 2000);
            }, 1500);
            return;
        }
        
        // Cambiar de biggerx3 a biggerx5 si hay 7 o más jugadores
        if (mapaActual === "biggerx3" && jugadoresActivos >= 7) {
            cambioMapaEnProceso = true;
            terminoPorCambioMapa = true; // Marcar que el partido terminará por cambio de mapa
            console.log(`📈 DEBUG: Cambiando de x3 a x5 durante partido (${jugadoresActivos} >= 7)`);
            anunciarAdvertencia("⏹️ Deteniendo partido para cambio de mapa...");
            room.stopGame();
            cambiarMapa("biggerx5");
            anunciarInfo(`🔄 ${jugadoresActivos} jugadores detectados durante partido. Cambiando de x3 a x5...`);
            
            setTimeout(() => {
                autoBalanceEquipos();
                verificarAutoStart();
                setTimeout(() => { 
                    cambioMapaEnProceso = false;
                    terminoPorCambioMapa = false; // Resetear la bandera
                }, 5000);
            }, 1000);
            return;
        }
        
        // Cambiar de biggerx5 a biggerx7 si hay 12 o más jugadores
        if (mapaActual === "biggerx5" && jugadoresActivos >= 12) {
            console.log(`📈 DEBUG CRÍTICO: Detectado cambio crítico x5->x7 durante partido (${jugadoresActivos} >= 12)`);
            console.log(`⏰ DEBUG: En lugar de detener inmediatamente, programando cambio pendiente para fin de partido`);
            
            // Programar cambio pendiente en lugar de detener el partido inmediatamente
            cambioMapaPendiente = {
                mapa: 'biggerx7',
                razon: `x5 -> x7 con ${jugadoresActivos}+ jugadores`,
                momento: 'fin_partido'
            };
            
            // Notificar que el cambio está pendiente
            // anunciarInfo(`⚡ El mapa cambiará al terminar el partido actual para una mejor experiencia de juego!`);
            
            console.log(`✅ DEBUG: Cambio de mapa pendiente configurado:`, cambioMapaPendiente);
            return; // Continuar con el partido actual
        }
        
        console.log(`✅ DEBUG: No se necesita cambio de mapa durante partido (${jugadoresActivos} jugadores en ${mapaActual})`);
        return;
    }
    
    // FUERA DE PARTIDO: Cambiar mapas según cantidad de jugadores
    // Log eliminado para mejor rendimiento en VPS
    
    // LÓGICA CON HISTÉRESIS PARA EVITAR OSCILACIONES:
    // - Para subir de mapa: usar umbrales normales
    // - Para bajar de mapa: usar umbrales con tolerancia (más restrictivos)
    //
    // Umbrales para SUBIR:      Umbrales para BAJAR:
    // 1: training               < 1: training
    // 2: x1                     < 2: x1 
    // 3-6: x3                   < 2: x3 -> x1 (tolerancia)
    // 7-9: x4                   < 5: x4 -> x3 (tolerancia)
    // 10+: x7                   < 8: x7 -> x4 (tolerancia)
    
    let mapaRequerido = null;
    
    // Lógica con histéresis según mapa actual
    if (mapaActual === "biggerx7") {
        // Desde x7: solo bajar si hay menos de 8 jugadores (tolerancia)
        if (jugadoresActivos < 8) {
            mapaRequerido = jugadoresActivos >= 3 ? "biggerx5" : (jugadoresActivos >= 2 ? "biggerx1" : "training");
        } else {
            mapaRequerido = "biggerx7"; // Mantener x7
        }
    } else if (mapaActual === "biggerx5") {
        // Desde x4: subir a x7 si hay 10+, bajar a x3 si hay menos de 5 (tolerancia)
        if (jugadoresActivos >= 10) {
            mapaRequerido = "biggerx7";
        } else if (jugadoresActivos < 5) {
            mapaRequerido = jugadoresActivos >= 2 ? "biggerx1" : "training";
        } else {
            mapaRequerido = "biggerx5"; // Mantener x4
        }
    } else if (mapaActual === "biggerx3") {
        // Desde x3: subir a x4 si hay 7+, bajar a x1 si hay menos de 2 (tolerancia)
        if (jugadoresActivos >= 7) {
            mapaRequerido = jugadoresActivos >= 10 ? "biggerx7" : "biggerx5";
        } else if (jugadoresActivos < 2) {
            mapaRequerido = "biggerx1";
        } else {
            mapaRequerido = "biggerx3"; // Mantener x3
        }
    } else {
        // Desde otros mapas (x1, training): usar lógica normal de subida
        if (jugadoresActivos === 1) {
            mapaRequerido = "training";
        } else if (jugadoresActivos === 2) {
            mapaRequerido = "biggerx1";
        } else if (jugadoresActivos >= 3 && jugadoresActivos <= 6) {
            mapaRequerido = "biggerx3";
        } else if (jugadoresActivos >= 7 && jugadoresActivos <= 9) {
            mapaRequerido = "biggerx5";
        } else if (jugadoresActivos >= 10) {
            mapaRequerido = "biggerx7";
        }
    }
    
    // Logs eliminados para mejor rendimiento en VPS
    
    if (mapaRequerido && mapaRequerido !== mapaActual) {
        // Logs eliminados para mejor rendimiento
        
        cambioMapaEnProceso = true;
        
        if (cambiarMapa(mapaRequerido)) {
            const nombreMapa = mapas[mapaRequerido] ? mapas[mapaRequerido].nombre : mapaRequerido;
            // Log eliminado para mejor rendimiento
            // anunciarInfo(`🔄 ${jugadoresActivos} jugadores detectados. Cambiando a ${nombreMapa}...`);
            
            setTimeout(() => {
                // CASO ESPECIAL: Mover único jugador al equipo rojo en training
                if (mapaRequerido === "training" && jugadoresActivos === 1) {
                    console.log(`🎯 DEBUG: Aplicando lógica especial para training con 1 jugador`);
                    const jugadores = room.getPlayerList().filter(j => j.team === 1 || j.team === 2);
                    if (jugadores.length === 1) {
                        const jugador = jugadores[0];
                        if (jugador.team !== 1) {
                            // Permitir movimiento por sistema automático
                            if (movimientoPermitidoPorComando) {
                                movimientoPermitidoPorComando.add(jugador.id);
                            }
                            
                            room.setPlayerTeam(jugador.id, 1); // Mover al equipo rojo
                            console.log(`🔴 DEBUG: Jugador ${jugador.name} movido al equipo rojo para training`);
                            // anunciarInfo(`🔴 ${jugador.name} movido al equipo rojo para entrenar`, jugador);
                        } else {
                            console.log(`✅ DEBUG: Jugador ${jugador.name} ya está en el equipo rojo`);
                        }
                    }
                }
                
                // CORRECCIÓN: Secuencia optimizada para evitar conflictos
                console.log(`🔧 DEBUG: Iniciando secuencia post-cambio de mapa (fuera de partido)...`);
                
                // 1. Primero balance de equipos
                autoBalanceEquipos();
                
                // 2. Luego esperar un poco y verificar auto-start con más tiempo
                setTimeout(() => {
                    console.log(`⚙️ DEBUG: Ejecutando verificarAutoStart post-cambio (fuera de partido)...`);
                    verificarAutoStart(true);
                    
                    // 3. Verificación adicional para asegurar inicio
                    setTimeout(() => {
                        const jugadoresActivos = room.getPlayerList().filter(j => j.team === 1 || j.team === 2).length;
                        if (!partidoEnCurso && jugadoresActivos >= 2 && autoStartEnabled) {
                            console.log(`🔄 DEBUG: Verificación adicional fuera de partido - Forzando auto-start...`);
                            verificarAutoStart(true);
                        }
                        
                        // 4. Finalmente liberar el bloqueo
                        setTimeout(() => {
                            cambioMapaEnProceso = false;
                            console.log(`✅ DEBUG: Secuencia post-cambio fuera de partido completada`);
                        }, 2000);
                    }, 3000);
                }, 2000);
            }, 1000);
        } else {
            console.error(`❌ DEBUG: Error al cambiar mapa a ${mapaRequerido}`);
            cambioMapaEnProceso = false;
        }
    } else {
        // Logs eliminados para mejor rendimiento en VPS
    }
}

// FUNCIÓN PARA CAMBIAR MAPA
function cambiarMapa(codigoMapa) {
    if (mapas[codigoMapa]) {
        const mapa = mapas[codigoMapa];
        try {
            room.setCustomStadium(mapa.hbs);
            mapaActual = codigoMapa;
            mapaRealmenteAplicado = true; // Confirmar que se aplicó correctamente
            console.log(`🗺️ DEBUG: Mapa cambiado exitosamente a ${codigoMapa} (${mapa.nombre})`);
            
            // Configurar límites estándar para todos los mapas
            if (codigoMapa === "biggerx1") {
                room.setTimeLimit(duracionPartido); // 3 minutos
                room.setScoreLimit(scoreLimitPartido); // 3 goles
            } else if (codigoMapa === "biggerx3") {
                room.setTimeLimit(3); // 3 minutos
                room.setScoreLimit(3); // Máximo 3 goles
            } else if (codigoMapa === "biggerx5") {
                room.setTimeLimit(5); // 5 minutos
                room.setScoreLimit(4); // Máximo 4 goles
            } else if (codigoMapa === "biggerx7") {
                room.setTimeLimit(5); // 5 minutos
                room.setScoreLimit(5); // Máximo 5 goles
            } else {
                room.setTimeLimit(5); // 5 minutos
                room.setScoreLimit(0); // Sin límite de goles
            }
            
            anunciarInfo(`🗺️ Mapa cambiado a: ${mapa.nombre}`);
            return true;
        } catch (error) {
            console.error(`❌ Error al cambiar mapa a ${codigoMapa}:`, error);
            return false;
        }
    } else {
        console.error(`❌ Mapa '${codigoMapa}' no encontrado en la lista de mapas`);
    }
    return false;
}

// FUNCIÓN PARA VALIDAR MAPA PERSONALIZADO
function validarMapaPersonalizado() {
    const mapasOficiales = Object.keys(mapas);
    if (!mapasOficiales.includes(mapaActual)) {
        anunciarAdvertencia("⚠️ Mapa personalizado detectado. Estadísticas desactivadas para evitar datos inconsistentes.");
        return false;
    }
    return true;
}

// FUNCION PARA ENVIAR ADVERTENCIA
function enviarAdvertenciaAFK(jugador) {
    if (!advertenciasAFK.has(jugador.id)) {
        advertenciasAFK.set(jugador.id, { nivel: 0, timestamp: Date.now() });
    }

    const advertencia = advertenciasAFK.get(jugador.id);
    const ahora = Date.now();

    if (advertencia.nivel < 2 && ahora - advertencia.timestamp >= 5000) {
        advertencia.nivel++;
        advertencia.timestamp = ahora;

        if (advertencia.nivel === 1) {
anunciarAdvertencia(`${jugador.name}, serás movido a espectadores en 10 segundos si no te mueves.`, jugador);
        } else if (advertencia.nivel === 2) {
anunciarAdvertencia(`${jugador.name}, serás movido a espectadores en 5 segundos. ¡MUÉVETE!`, jugador);
        }
    }
}

// INICIAR VERIFICACIÓN DE INACTIVIDAD se moverá a la función inicializar()


// ANUNCIAR DISCORD CADA 10 MINUTOS
let intervalDiscord = null;
function iniciarAnunciosDiscord() {
    if (intervalDiscord) clearInterval(intervalDiscord);
    intervalDiscord = setInterval(() => {
        try {
            if (typeof room !== 'undefined' && room && room.sendAnnouncement) {
                room.sendAnnouncement("🏆 ¿Tᴇɴᴇ́s ᴇǫᴜɪᴘᴏ ᴏ ǫᴜᴇʀᴇ́s ᴀʀᴍᴀʀ ᴜɴᴏ ᴘᴀʀᴀ ᴊᴜɢᴀʀ Bɪɢɢᴇʀ ᴄᴏᴍᴘᴇᴛɪᴛɪᴠᴏ? ❯❯❯ 👉 UNITE: DISCORD.GG/NJRHZXRNCA", null, parseInt(COLORES.DORADO, 16), "bold", 0);
            }
        } catch (error) {
            // Error en anuncio de Discord
        }
    }, 600000); // 10 minutos
}

// VERIFICACIÓN PERIÓDICA DE ADMIN DE SALA
let intervalVerificacionAdmin = null;
function iniciarVerificacionAdminSala() {
    if (intervalVerificacionAdmin) clearInterval(intervalVerificacionAdmin);
    intervalVerificacionAdmin = setInterval(() => {
        try {
            const jugadores = room.getPlayerList();
            jugadores.forEach(jugador => {
                if (jugador.admin) {
                    // Verificar si este jugador admin tiene rol de SUPER_ADMIN
                    const rolJugador = jugadoresConRoles.get(jugador.id);
                    const esSuperAdmin = rolJugador && rolJugador.role === "SUPER_ADMIN";
                    
                    if (!esSuperAdmin) {
                        console.log(`🚨 SEGURIDAD: Detectado admin no autorizado ${jugador.name}, removiendo...`);
                        room.setPlayerAdmin(jugador.id, false);
                    }
                }
            });
        } catch (error) {
            console.error('❌ Error en verificación de admin:', error);
        }
    }, 30000); // Cada 30 segundos
}



// FUNCIONES DE COMANDOS
function mostrarAyuda(jugador, contexto) {
const comandosPublicos = [];

    const comandosMovimiento = [
        "\n🏃 Sala / Movimiento:",
        "!back !afk !nv !bb !llamaradmin [msg]",
        "\n🎨 Camisetas:",
        "!tbl, !dd, !dd2, !hyz, !hyz2, !fnv, !fnv2, !avh, !avh2, !avh3, !lmdt, !lmdt2, !adb, !adb2, !adb3, !do, !do1, !do2."
    ];

    const comandosPersonalizacion = [
        "\n🎨 Personalización:",
        "!colors [código] !colors list !festejo gol/asis [msg]",
        "!ver_mensajes !limpiar_mensajes"
    ];

    const comandosSala = [
        "\n🏟️ COMANDOS DE INFORMACIÓN DE SALA:",
        "!mapa - Ver información del mapa actual",
        "!tiempo - Ver tiempo transcurrido del partido", 
        "!puntuacion - Ver tu puntuación en el partido actual (1-10)",
        "\n💬 COMANDOS DE CHAT:",
        "t [mensaje] - Enviar mensaje al chat de equipo",
        "@@[jugador] [mensaje] - Enviar mensaje privado",
        "\n📱 SISTEMA ANTI-SPAM:",
        "- Máximo 3 mensajes cada 5 segundos",
        "- Cooldown automático por spam excesivo",
        "- Mensajes duplicados filtrados"
    ];

    const comandosModeracion = [
        "\n⚖️ COMANDOS DE MODERACIÓN (ADMINS):",
        "!mute [jugador] [tiempo_min] [razón] - Silenciar jugador temporalmente",
        "!unmute [jugador] - Quitar silencio a un jugador", 
        "!kick <jugador|#ID> [razón] - Expulsar jugador de la sala",
        "!ban <jugador|#ID> [tiempo_min] [razón] - Banear jugador",
        "!unban [uid/nombre/ip] - Desbanear jugador",
        "!banlist - Ver lista de jugadores baneados activos",
        "!clearbans - Limpiar todos los baneos masivamente",
        "!clear_bans - Limpiar lista de baneos de HaxBall",
        "\n🚫 BANEOS OFFLINE (SUPERADMINS):",
        "!banoffline <jugador|auth_id> <duracion_min> <razón> - Banear jugador desconectado",
        "!findplayer <nombre|auth_id> - Buscar jugador en historial",
        "!banstatus <jugador|auth_id> - Verificar estado de baneo",
        "# - Ver lista de jugadores con sus IDs numéricos",
    ];


    const comandosAvanzado = [
        "\n⚙️ COMANDOS AVANZADOS (ADMINS):",
        "!claim [contraseña] - Reclamar rol de administrador",
        "!mapa [código] - Cambiar mapa (biggerx3, biggerx5, biggerx7, training)",
        "!biggerx3 / !3 - Cambiar a mapa Bigger x3",
        "!biggerx5 / !5 - Cambiar a mapa Bigger x5",
        "!biggerx7 / !7 - Cambiar a mapa Bigger x7",
        "!training / !tr - Cambiar a mapa de entrenamiento",
        "!pw [contraseña] - Establecer contraseña de sala",
        "!clear_password - Eliminar contraseña de sala",
        "!pause - Pausar partido",
        "!resume - Reanudar partido",
        "!stop - Detener partido manualmente",
        "!autostart - Activar/desactivar inicio automático",
        "!autostop - Activar/desactivar parada automática",
        "!balance - Balancear equipos manualmente",
        "!replay_config - Ver configuración de replays",
        "!toggle_replays [tipo] - Activar/desactivar tipos de replays"
    ];

    const comandosChat = [
        "\n💬 COMANDOS DE CHAT:",
        "t [mensaje] - Chat de equipo",
        "@@[jugador] [mensaje] - Mensaje privado",
        "Explicación del sistema anti-spam"
    ];

    const comandosStats = [
        "\n📊 Estadísticas:",
        "!stats [jugador], !me, !record, !compare <jugador1> <jugador2>, !h2h, !top [estadística], !codigo, !recuperar <código>, !puntuacion ."
    ];

    const comandosFun = [
        "\n🎲 Fun:",
        "!coin !random [n] !ship !ppt [opc] [jugador] !cm !nenazo !nov"
    ];
    
    const comandosAdmin = [
        "\n🔧 COMANDOS DE ADMIN:",
        "!claim <clave> - Reclamar rol (admin/superadmin)",
        "!pw <contraseña> - Establecer contraseña de sala",
        "!clear_password - Eliminar contraseña de sala",
        "!warn <jugador> [razón] - Advertir jugador",
        "!mute <jugador> [tiempo] [razón] - Silenciar (superadmin)",
        "!kick <jugador|#ID> [razón] - Expulsar (superadmin)",
        "!ban <jugador|#ID> [tiempo] [razón] - Banear (superadmin)",
        "# - Ver lista de jugadores con IDs"
    ];
    
    const comandosRedes = [
        "\n🌐 COMANDOS DE REDES SOCIALES:",
        "!discord / !ds - Ver enlace del servidor de Discord",
        "!instagram / !ig - Ver enlace de Instagram oficial",
        "!youtube / !yt - Ver enlace del canal de YouTube",
        "!tiktok / !tt - Ver enlace de TikTok oficial"
    ];

    let output = [];
    switch (contexto) {
        case 'admin':
            output = comandosAdmin;
            break;
        case 'stats':
            output = comandosStats;
            break;
        case 'fun':
            output = comandosFun;
            break;
        case 'movimiento':
            output = comandosMovimiento;
            break;
        case 'personalizacion':
            output = comandosPersonalizacion;
            break;
        case 'moderacion':
            output = comandosModeracion;
            break;
        case 'avanzado':
            output = comandosAvanzado;
            break;
        case 'chat':
            output = comandosChat;
            break;
        case 'redes':
            output = comandosRedes;
            break;
        default:
            output = [
                ...comandosPublicos,
                "\n💡 Usa !ayuda stats, !ayuda fun, !ayuda admin, !ayuda movimiento, !ayuda personalizacion, !ayuda moderacion, !ayuda avanzado, !ayuda chat, o !ayuda redes para más comandos."
            ];
    }
    
    output.forEach(cmd => {
        room.sendAnnouncement(cmd, jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
    });
}

async function procesarComando(jugador, mensaje) {
    const args = mensaje.slice(1).split(" ");
    const comando = args[0].toLowerCase();
    
    switch (comando) {
        case "#":
            // Comando especial para mostrar lista de jugadores con IDs
            mostrarListaJugadoresConIDs(jugador);
            break;
        case "ship":
            if (args[1]) {
                const nombreObjetivo = args.slice(1).join(" ");
                calcularCompatibilidad(jugador, nombreObjetivo);
            } else {
                anunciarError("Uso: !ship <jugador>", jugador);
            }
            break;
            
        case "ppt":
            if (args[1] && args[2]) {
                const jugada = args[1].toLowerCase();
                const nombreOponente = args.slice(2).join(" ");
                if (["piedra", "papel", "tijeras"].includes(jugada)) {
                    desafiarPPT(jugador, nombreOponente, jugada);
                } else {
                    anunciarError("Uso: !ppt <piedra|papel|tijeras> <jugador>", jugador);
                }
            } else {
                anunciarError("📝 Uso: !ppt <piedra|papel|tijeras> <jugador>", jugador);
            }
            break;
            
        case "piedra":
        case "papel":
        case "tijeras":
            responderDesafioPPT(jugador, comando);
            break;

        case "ayuda":
        case "help":
            mostrarAyuda(jugador, args[1]);
            break;
            
        case "ds":
        case "discord":
            room.sendAnnouncement("━━━━━━━━━━━━━┓ LNB 🔥 Discord: 'discord.gg/nJRhZXRNCA' ┏━━━━━━━━━━━━━", jugador.id, parseInt(COLORES.INFO, 16), "bold", 0);
            room.sendAnnouncement("¡Únete a la comunidad para enterarte de torneos, eventos y mucho más!", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
            break;

        case "mapa":
            if (!esAdmin(jugador)) {
                anunciarError("❌ Solo los administradores pueden cambiar el mapa.", jugador);
                return;
            }
            if (args[1]) {
                if (cambiarMapa(args[1])) {
                    detectarCambioMapa();
                } else {
                    anunciarError("Mapa no encontrado. Usa: biggerx3, biggerx5, biggerx7, training", jugador);
                }
            } else {
                anunciarInfo("📋 Uso: !mapa <código> (biggerx3, biggerx5, biggerx7, training)");
            }
            break;
            
        case "biggerx3":
        case "3": // Abreviación para biggerx3
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ Solo los administradores pueden cambiar el mapa.", jugador);
                return;
            }
            cambiarMapa("biggerx3");
            detectarCambioMapa();
            break;
            
        case "biggerx5":
        case "5": // Abreviación para biggerx5
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ Solo los administradores pueden cambiar el mapa.", jugador);
                return;
            }
            cambiarMapa("biggerx5");
            detectarCambioMapa();
            break;
            
        case "biggerx7":
        case "7": // Abreviación para biggerx7
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ Solo los administradores pueden cambiar el mapa.", jugador);
                return;
            }
            cambiarMapa("biggerx7");
            detectarCambioMapa();
            break;
            
        case "training":
        case "tr": // Abreviación para training
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ Solo los administradores pueden cambiar el mapa.", jugador);
                return;
            }
            cambiarMapa("training");
            break;
            
        case "colors":
        case "camis":
            if (args[1] === "list") {
                mostrarColores(jugador);
            } else if (args[1]) {
                // Verificar que el jugador esté en un equipo
                if (jugador.team === 0) {
                    anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                    return;
                }
                
                // Detectar automáticamente el equipo del jugador
                const equipoTexto = jugador.team === 1 ? "red" : "blue";
                const codigoCamiseta = args[1];
                
                asignarColor(equipoTexto, codigoCamiseta, jugador);
            } else {
                const comandoUsado = comando === "colors" ? "!colors" : "!camis";
                anunciarError(`📋 Uso: ${comandoUsado} <código> | ${comandoUsado} list`, jugador);
                anunciarError(`💡 Ejemplo: ${comandoUsado} dd | ${comandoUsado} bov | ${comandoUsado} realMadrid`, jugador);
            }
            break;
            
        // Comandos específicos de camisetas personalizadas
        case "tbl":
            // !camis TBL -> /colors red 60 000000 363636 303030
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoTBL = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoTBL, "tbl", jugador);
            break;
            
        case "dd2":
            // !camis dd2 -> /colors blue 0 FFFFFF FFFFFF 1F3821 FFFFFF
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoDD2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoDD2, "dd2", jugador);
            break;
            
        case "hyz":
            // !camis hyz -> /colors red 60 4D4D4D 000000 000000 000000
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoHYZ = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoHYZ, "hyz", jugador);
            break;
            
        case "hyz2":
            // !camis hyz2 -> /colors red 60 26C5FF 801296 801296 26C5FF
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoHYZ2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoHYZ2, "hyz2", jugador);
            break;
            
        case "fnv":
            // !camis fnv -> /colors red 60 000000 F8842B F8842B E86B27
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoFNV = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoFNV, "fnv", jugador);
            break;
            
        case "fnv2":
            // !camis fnv2 -> /colors blue 60 000000 F8842B F8842B E86B27
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoFNV2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoFNV2, "fnv2", jugador);
            break;
            
        case "avh":
            // !camis avh -> /colors red 60 A4A800 000029 000221 00001C
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoAVH = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoAVH, "avh", jugador);
            break;
            
        case "avh2":
            // !camis avh2 -> /colors red 180 39373B 949E9C 8D9695 868F8E
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoAVH2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoAVH2, "avh2", jugador);
            break;
            
        case "avh3":
            // !camis avh3 -> /colors red 66 FFCBA3 3B0047 54084A 690942
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoAVH3 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoAVH3, "avh3", jugador);
            break;
            
        case "lmdt":
            // !camis lmdt -> /colors red 120 FADB69 090A0E
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoLMDT = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoLMDT, "lmdt", jugador);
            break;
            
        case "lmdt2":
            // !camis lmdt2 -> /colors red 120 090A0E FADB69
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoLMDT2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoLMDT2, "lmdt2", jugador);
            break;
            
        case "adb2":
            // !camis adb2 -> /colors red 90 C70C0C 1E7315 FFFFFF 000000
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoADB2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoADB2, "adb2", jugador);
            break;
            
        case "adb3":
            // !camis adb3 -> /colors red 66 A35417 FF3BF2 4FFF72 4EA2F5
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoADB3 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoADB3, "adb3", jugador);
            break;
            
        case "cate":
            // !camis cate -> /colors red 90 00C710 011F01
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoCate = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoCate, "cate", jugador);
            break;
            
        case "cate2":
            // !camis cate2 -> /colors blue 0 FFFFFF 009C05 0F0F0F
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
                return;
            }
            // Detectar automáticamente el equipo del jugador
            const equipoTextoCate2 = jugador.team === 1 ? "red" : "blue";
            asignarColor(equipoTextoCate2, "cate2", jugador);
            break;
            
            
            
        case "festejo":
            // USAR SISTEMA PERSISTENTE: Comando festejo corregido para usar auth
            if (args.length === 1) {
                room.sendAnnouncement("📢 Uso: !festejo gol [mensaje] | !festejo asis [mensaje]", jugador.id, parseInt(AZUL_LNB, 16), "bold", 0);
                room.sendAnnouncement("💡 Sin argumentos muestra tu mensaje actual", jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
                return;
            }
            
            const tipoFestejo = args[1].toLowerCase();
            const mensajeArgs = args.slice(2);
            
            if (tipoFestejo === 'gol') {
                if (mensajeArgs.length === 0) {
                    // USAR SISTEMA PERSISTENTE: Obtener mensaje actual usando auth via funciones expuestas
                    let mensajeActual = "¡GOOOOOL!";
                    const authJugadorGol = jugador.auth || jugadoresUID.get(jugador.id);
                    if (typeof nodeObtenerMensajeFestejo === 'function' && authJugadorGol) {
                        try {
                            const mensajePersistente = await nodeObtenerMensajeFestejo(authJugadorGol, 'gol');
                            if (mensajePersistente) {
                                mensajeActual = mensajePersistente;
                            }
                        } catch (error) {
                            console.error('❌ Error obteniendo mensaje de gol:', error);
                        }
                    }
                    room.sendAnnouncement(`🎯 Tu mensaje de gol actual: "${mensajeActual}"`, jugador.id, parseInt(AZUL_LNB, 16), "bold", 0);
                } else {
                    const mensaje = mensajeArgs.join(' ');
                    if (mensaje.length > 50) {
                        anunciarError("❌ El mensaje de gol no puede superar los 50 caracteres", jugador);
                        return;
                    }
                    
                    // USAR SISTEMA PERSISTENTE: Guardar mensaje usando auth via funciones expuestas
                    console.log(`🎉 [FESTEJO DEBUG] Intentando guardar festejo de gol para ${jugador.name}:`);
                    console.log(`🎉 [FESTEJO DEBUG] - nodeGuardarFestejo disponible: ${typeof nodeGuardarFestejo === 'function'}`);
                    console.log(`🎉 [FESTEJO DEBUG] - jugador.auth disponible: ${!!jugador.auth}`);
                    console.log(`🎉 [FESTEJO DEBUG] - jugador.auth valor: ${jugador.auth}`);
                    
                    // CORRECIÓN CRÍTICA: Usar jugadoresUID para obtener el auth guardado
                    const authJugador = jugador.auth || jugadoresUID.get(jugador.id);
                    console.log(`🎉 [FESTEJO DEBUG] - auth desde jugadoresUID: ${jugadoresUID.get(jugador.id)}`);
                    console.log(`🎉 [FESTEJO DEBUG] - auth final a usar: ${authJugador}`);
                    console.log(`🎉 [FESTEJO DEBUG] - mensaje: "${mensaje}"`);
                    
                    if (typeof nodeGuardarFestejo === 'function' && authJugador) {
                        console.log(`🎉 [FESTEJO DEBUG] Usando sistema persistente para guardar`);
                        try {
                            console.log(`🎉 [FESTEJO DEBUG] Llamando nodeGuardarFestejo con auth: ${authJugador}`);
                            const resultado = await nodeGuardarFestejo(authJugador, jugador.name || 'Desconocido', 'gol', mensaje);
                            console.log(`🎉 [FESTEJO DEBUG] Resultado de nodeGuardarFestejo:`, resultado);
                            if (resultado.success) {
                                room.sendAnnouncement(`[PV] Mensaje de gol configurado: "${mensaje}"`, jugador.id, parseInt("00FF00", 16), "bold", 0);
                                console.log(`💾 [FESTEJOS] Mensaje de gol guardado para jugador ${jugador.name} (${jugador.auth}): "${mensaje}"`);
                                
                                // CORRECIÓN: Actualizar cache inmediatamente usando el auth correcto
                                const cacheExistente = cacheMensajesPersonalizados.get(authJugador) || {};
                                cacheExistente.gol = mensaje;
                                cacheMensajesPersonalizados.set(authJugador, cacheExistente);
                                console.log(`💾 [CACHE DEBUG] Cache actualizado tras guardar gol para ${jugador.name} con auth: ${authJugador}`);
                            } else {
                                anunciarError("❌ Error al guardar el mensaje de gol: " + (resultado.error || 'Unknown'), jugador);
                            }
                        } catch (error) {
                            console.error('❌ Error en nodeGuardarFestejo:', error);
                            anunciarError("❌ Error al guardar el mensaje de gol", jugador);
                        }
                    } else {
                        console.log(`🎉 [FESTEJO DEBUG] Usando fallback - sistema temporal`);
                        console.log(`🎉 [FESTEJO DEBUG] - Razón: nodeGuardarFestejo=${typeof nodeGuardarFestejo === 'function'}, authFinal=${!!authJugador}`);
                        // Fallback al sistema anterior si no está disponible el persistente
                        if (!mensajesPersonalizados.has(jugador.id)) {
                            mensajesPersonalizados.set(jugador.id, {});
                        }
                        const msgs = mensajesPersonalizados.get(jugador.id);
                        msgs.gol = mensaje;
                        msgs.ultimoUso = Date.now();
                        console.log(`🎉 [FESTEJO DEBUG] Mensaje guardado en sistema temporal para ID ${jugador.id}`);
                        room.sendAnnouncement(`[PV] Mensaje de gol configurado: "${mensaje}" (temporal)`, jugador.id, parseInt("00FF00", 16), "bold", 0);
                    }
                }
            } else if (tipoFestejo === 'asis' || tipoFestejo === 'asistencia') {
                if (mensajeArgs.length === 0) {
                    // USAR SISTEMA PERSISTENTE: Obtener mensaje actual usando auth via funciones expuestas
                    let mensajeActual = "¡Qué asistencia!";
                    const authJugadorAsist = jugador.auth || jugadoresUID.get(jugador.id);
                    if (typeof nodeObtenerMensajeFestejo === 'function' && authJugadorAsist) {
                        try {
                            const mensajePersistente = await nodeObtenerMensajeFestejo(authJugadorAsist, 'asistencia');
                            if (mensajePersistente) {
                                mensajeActual = mensajePersistente;
                            }
                        } catch (error) {
                            console.error('❌ Error obteniendo mensaje de asistencia:', error);
                        }
                    }
                    room.sendAnnouncement(`🎯 Tu mensaje de asistencia actual: "${mensajeActual}"`, jugador.id, parseInt(AZUL_LNB, 16), "bold", 0);
                } else {
                    const mensaje = mensajeArgs.join(' ');
                    if (mensaje.length > 50) {
                        anunciarError("❌ El mensaje de asistencia no puede superar los 50 caracteres", jugador);
                        return;
                    }
                    
                    // USAR SISTEMA PERSISTENTE: Guardar mensaje usando auth via funciones expuestas
                    const authJugadorAsist2 = jugador.auth || jugadoresUID.get(jugador.id);
                    console.log(`🎯 [FESTEJO DEBUG] Guardando asistencia con auth: ${authJugadorAsist2}`);
                    if (typeof nodeGuardarFestejo === 'function' && authJugadorAsist2) {
                        try {
                            const resultado = await nodeGuardarFestejo(authJugadorAsist2, jugador.name || 'Desconocido', 'asistencia', mensaje);
                            if (resultado.success) {
                                room.sendAnnouncement(`[PV] 🎯 Mensaje de asistencia configurado: "${mensaje}"`, jugador.id, parseInt("00FF00", 16), "bold", 0);
                                console.log(`💾 [FESTEJOS] Mensaje de asistencia guardado para jugador ${jugador.name} (${jugador.auth}): "${mensaje}"`);
                                
                                // CORRECIÓN: Actualizar cache inmediatamente usando el auth correcto
                                const cacheExistente = cacheMensajesPersonalizados.get(authJugadorAsist2) || {};
                                cacheExistente.asistencia = mensaje;
                                cacheMensajesPersonalizados.set(authJugadorAsist2, cacheExistente);
                                console.log(`💾 [CACHE DEBUG] Cache actualizado tras guardar asistencia para ${jugador.name}`);
                            } else {
                                anunciarError("❌ Error al guardar el mensaje de asistencia: " + (resultado.error || 'Unknown'), jugador);
                            }
                        } catch (error) {
                            console.error('❌ Error en nodeGuardarFestejo:', error);
                            anunciarError("❌ Error al guardar el mensaje de asistencia", jugador);
                        }
                    } else {
                        // Fallback al sistema anterior si no está disponible el persistente
                        if (!mensajesPersonalizados.has(jugador.id)) {
                            mensajesPersonalizados.set(jugador.id, {});
                        }
                        const msgs = mensajesPersonalizados.get(jugador.id);
                        msgs.asistencia = mensaje;
                        msgs.ultimoUso = Date.now();
                        room.sendAnnouncement(`[PV] 🎯 Mensaje de asistencia configurado: "${mensaje}"`, jugador.id, parseInt("00FF00", 16), "bold", 0);
                    }
                }
            } else {
                anunciarError("❌ Tipo de festejo inválido. Usa: gol o asis", jugador);
            }
            break;
            
        case "ver_mensajes":
            // Usar sistema persistente primero, y fallback al temporal
            try {
                let mensajesEncontrados = false;
                
                // 1. Intentar obtener del sistema persistente via funciones expuestas
                const authJugadorVer = jugador.auth || jugadoresUID.get(jugador.id);
                if (typeof nodeObtenerMensajeFestejo === 'function' && authJugadorVer) {
                    try {
                        const msgGolPersistente = await nodeObtenerMensajeFestejo(authJugadorVer, 'gol');
                        const msgAsistPersistente = await nodeObtenerMensajeFestejo(authJugadorVer, 'asistencia');
                        
                        if (msgGolPersistente || msgAsistPersistente) {
                            mensajesEncontrados = true;
                            room.sendAnnouncement(`⚽ Mensaje de gol: "${msgGolPersistente || 'No configurado'}"`, jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
                            room.sendAnnouncement(`🎯 Mensaje de asistencia: "${msgAsistPersistente || 'No configurado'}"`, jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
                            room.sendAnnouncement(`📝 Tus mensajes están guardados con persistencia`, jugador.id, parseInt(COLORES.EXITO, 16), "normal", 0);
                        }
                    } catch (error) {
                        console.error('❌ Error obteniendo mensajes persistentes:', error);
                    }
                }
                
                // 2. Si no se encuentran en el sistema persistente, verificar el temporal
                if (!mensajesEncontrados) {
                    const misMessagess = mensajesPersonalizados.get(jugador.id);
                    if (misMessagess) {
                        const msgGol = misMessagess.gol || "No configurado";
                        const msgAsist = misMessagess.asistencia || "No configurado";
                        room.sendAnnouncement(`⚽ Mensaje de gol: "${msgGol}"`, jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
                        room.sendAnnouncement(`🎯 Mensaje de asistencia: "${msgAsist}"`, jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
                        
                        // Si el jugador tiene auth, sugerir migración
                        if (jugador.auth) {
                            room.sendAnnouncement(`💡 Usa !festejo para hacer que tus mensajes sean persistentes`, jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                        }
                    } else {
                        room.sendAnnouncement("❌ No tienes mensajes personalizados configurados", jugador.id, parseInt("FF0000", 16), "normal", 0);
                    }
                }
            } catch (error) {
                console.error('❌ Error en ver_mensajes:', error);
                room.sendAnnouncement("❌ Error al obtener tus mensajes", jugador.id, parseInt("FF0000", 16), "normal", 0);
            }
            break;
            
        case "limpiar_mensajes":
            try {
                let resultadoLimpieza = false;
                
                // 1. Limpiar mensajes del sistema temporal (en memoria)
                mensajesPersonalizados.delete(jugador.id);
                resultadoLimpieza = true;
                
                // 2. Limpiar mensajes del sistema persistente si está disponible via funciones expuestas
                const authJugadorLimp = jugador.auth || jugadoresUID.get(jugador.id);
                if (typeof nodeLimpiarFestejos === 'function' && authJugadorLimp) {
                    try {
                        const resultado = await nodeLimpiarFestejos(authJugadorLimp, jugador.name, 'all');
                        if (resultado && resultado.success) {
                            anunciarExito(`🧹 Mensajes personalizados eliminados completamente (persistencia + memoria)`, jugador);
                        } else {
                            anunciarExito(`🧹 Mensajes eliminados solo de la memoria`, jugador);
                        }
                    } catch (error) {
                        console.error('❌ Error en limpiar_mensajes (persistente):', error);
                        anunciarExito(`🧹 Mensajes eliminados solo de la memoria (error en sistema persistente)`, jugador);
                    }
                } else {
                    // Si no hay sistema persistente disponible o no hay auth
                    anunciarExito(`🧹 Mensajes personalizados eliminados de la memoria`, jugador);
                }
            } catch (error) {
                console.error('❌ Error en limpiar_mensajes:', error);
                anunciarError("❌ Error al limpiar tus mensajes", jugador);
            }
            break;
            
        case "ship":
            if (args[1]) {
                const nombreObjetivo = args.slice(1).join(" ");
                calcularCompatibilidad(jugador, nombreObjetivo);
            } else {
                anunciarError("📝 Uso: !ship <jugador>", jugador);
            }
            break;
            
        case "llamaradmin":
            if (args[1]) {
                const mensaje = args.slice(1).join(" ");
                llamarAdmin(jugador, mensaje);
            } else {
                // Si no hay mensaje, verificar si hay votación activa para votar
                if (votacionLlamarAdmin.activa) {
                    llamarAdmin(jugador, ""); // Llamar sin mensaje para procesar el voto
                } else {
                anunciarError("📝 Uso: !llamaradmin <mensaje>", jugador);
                }
            }
            break;
            
        case "me":
            mostrarEstadisticasJugador(jugador, jugador.name);
            break;
            
        case "compare":
            if (args[1] && args[2]) {
                compararEstadisticas(jugador, args[1], args[2]);
            } else {
                anunciarError("📝 Uso: !compare <jugador1> <jugador2>", jugador);
            }
            break;
            
        case "h2h":
        case "headtohead":
            if (args[1] && args[2]) {
                mostrarHeadToHead(jugador, args[1], args[2]);
            } else if (args[1]) {
                // Si solo se proporciona un jugador, comparar con el solicitante
                mostrarHeadToHead(jugador, jugador.name, args[1]);
            } else {
                anunciarError("📝 Uso: !h2h <jugador1> <jugador2> o !h2h <jugador> (para comparar contigo)", jugador);
            }
            break;

        case "coin":
            const resultado = Math.random() > 0.5 ? "Cara" : "Cruz";
            anunciarGeneral(`🪙 ${jugador.name} lanzó una moneda y salió... ¡${resultado}!`);
            break;

        case "random":
            const limite = parseInt(args[1]);
            if (isNaN(limite) || limite <= 0) {
                anunciarError("📝 Uso: !random <número_mayor_a_0>", jugador);
            } else {
                const numero = Math.floor(Math.random() * limite) + 1;
                anunciarGeneral(`🎲 ${jugador.name} sacó un ${numero} (de 1 a ${limite})`);
            }
            break;
        case "record":
        case "records":
            mostrarRecords(jugador);
            break;
            
        case "top":
            if (args[1]) {
                mostrarTopJugadores(jugador, args[1].toLowerCase());
            } else {
                room.sendAnnouncement("📝 Uso: !top <estadística>", jugador.id, parseInt("FF0000", 16), "normal", 0);
                room.sendAnnouncement("📊 Estadísticas disponibles: goles, asistencias, vallas, autogoles, mvps, hattrick, rank", jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
            }
            break;
            
        case "codigo":
        case "cod": // Abreviación para codigo
            mostrarCodigoRecuperacion(jugador);
            break;
            
        case "recuperar":
            if (args[1]) {
                recuperarEstadisticas(jugador, args[1]);
            } else {
                anunciarError("📝 Uso: !recuperar <código>", jugador);
            }
            break;
            
        case "puntuacion":
            mostrarPuntuacionJugador(jugador);
            break;
            
        case "nenazo":
            const mensajeNenazo = "uno, sos nenazo, dos, terrible sensible, tres, sos admin jajaja terrible fraca, cuatro, no te juna nadie, cinco, bajale el lompa a gerson virgen, seis, no insulté a len nomas descansamos a gerson pq es virgen mal jajaj y pq me dijeron q lo haga, siete, conseguite una vida vos panchito q manejas un fracaso encima, escoria, ocho, sos un chiste q nadie te respeta, nueve, tenes menos admin q blind, diez, no sabes separar lo externo al host q abusas del admin y once, mamala puton jajja";
            anunciarGeneral(`🔥 💯 ${jugador.name.toUpperCase()}: ${mensajeNenazo} 💯`, "FF6B6B", "bold");
            break;
            
        case "nov":
            const mensajeNov = "Hola chicos, voy a estar inactivo pq bueno estoy pensando sobre el tema del suicidi0, no le voy a decir porque ando en eso porque no les quiero poner mal o algo asi, igual mi hermanito menor también juega hax y el ya que es el menor tendra mi celular, los quiero mucho y sobre todo, YALLAH.";
            anunciarGeneral(`💬 📢 ${jugador.name.toUpperCase()}: ${mensajeNov} 📢`, "8A2BE2", "bold");
            break;
            
        case "salidas":
            // COMANDO OPTIMIZADO: Mostrar las últimas 30 personas que se fueron (máximo 3 páginas)
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ Solo los administradores pueden ver el historial de salidas.", jugador);
                return;
            }
            
            // Obtener número de página (por defecto página 1, máximo 3)
            let paginaSolicitada = 1;
            if (args[1] && !isNaN(parseInt(args[1]))) {
                paginaSolicitada = parseInt(args[1]);
                if (paginaSolicitada < 1) {
                    paginaSolicitada = 1;
                } else if (paginaSolicitada > 3) {
                    anunciarError("❌ Solo hay 3 páginas disponibles (máximo 30 salidas). Usa !salidas 1, !salidas 2 o !salidas 3", jugador);
                    return;
                }
            }
            
            console.log(`🔍 DEBUG: Admin ${jugador.name} solicitó ver salidas - página ${paginaSolicitada}`);
            
            // Verificar si la función está disponible
            if (typeof nodeObtenerUltimasSalidas === 'function') {
                try {
                    console.log(`🔄 DEBUG: Llamando a nodeObtenerUltimasSalidas con página ${paginaSolicitada}`);
                    
                    nodeObtenerUltimasSalidas(paginaSolicitada, 10).then(resultado => {
                        console.log(`✅ DEBUG: Resultado recibido:`, resultado);
                        
                        if (!resultado.success) {
                            anunciarError(`❌ Error al obtener historial de salidas: ${resultado.error}`, jugador);
                            return;
                        }
                        
                        const salidas = resultado.data;
                        const total = resultado.total;
                        const totalPaginas = Math.ceil(total / 10);
                        
                        console.log(`📊 DEBUG: Salidas encontradas: ${salidas.length}, Total: ${total}, Páginas: ${totalPaginas}`);
                        
                        if (salidas.length === 0) {
                            if (paginaSolicitada === 1) {
                                room.sendAnnouncement("📝 No hay registros de salidas disponibles.", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                            } else {
                                room.sendAnnouncement(`📝 No hay más salidas en la página ${paginaSolicitada}.`, jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                                room.sendAnnouncement(`💡 Total de páginas disponibles: ${totalPaginas}`, jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                            }
                            return;
                        }
                        
                        // Crear formato compacto en una sola línea
                        const salidasFormateadas = [];
                        
                        salidas.forEach((salida, index) => {
                            // Emojis basados en el orden de posición en la página actual
                            let emoji = "";
                            if (paginaSolicitada === 1) {
                                // Solo en la primera página usamos emojis especiales
                                switch (index) {
                                    case 0: emoji = "🥇"; break; // Último (más reciente)
                                    case 1: emoji = "🥈"; break; // Anteúltimo  
                                    case 2: emoji = "🥉"; break; // Tercero
                                    case 3: emoji = "4️⃣"; break; // Cuarto
                                    case 4: emoji = "5️⃣"; break; // Quinto
                                    case 5: emoji = "6️⃣"; break; // Sexto
                                    case 6: emoji = "7️⃣"; break; // Séptimo
                                    case 7: emoji = "8️⃣"; break; // Octavo
                                    case 8: emoji = "9️⃣"; break; // Noveno
                                    case 9: emoji = "🔟"; break; // Décimo
                                    default: emoji = "📤"; break;
                                }
                            } else {
                                emoji = "📤"; // Para páginas posteriores usar emoji uniforme
                            }
                            
                            // Formatear fecha solo hora:minuto
                            const fecha = new Date(salida.fecha_salida);
                            const horaFormateada = fecha.toLocaleString('es-AR', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false // Formato 24 horas
                            });
                            
                            // Crear formato compacto: emoji nombre[IDx]-hora
                            const salidaFormateada = `${emoji} ${salida.nombre}[ID${salida.player_id}]-${horaFormateada}`;
                            salidasFormateadas.push(salidaFormateada);
                        });
                        
                        // Mostrar todo en una sola línea con nuevo formato
                        const mensajeCompacto = `🚪 𝐇𝐢𝐬𝐭𝐨𝐫𝐢𝐚𝐥 [Pág.${paginaSolicitada}/${totalPaginas}] ➤ \n${salidasFormateadas.join(' | ')}`;
                        room.sendAnnouncement(mensajeCompacto, jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                        
                        if (totalPaginas > 1) {
                            room.sendAnnouncement(`💡 Usa !salidas ${paginaSolicitada + 1} para ver la siguiente página`, jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                        }
                        
                        console.log(`✅ DEBUG: Comando !salidas completado exitosamente para ${jugador.name}`);
                        
                    }).catch(error => {
                        console.error(`❌ ERROR en nodeObtenerUltimasSalidas:`, error);
                        anunciarError(`❌ Error al consultar el historial de salidas: ${error.message}`, jugador);
                    });
                    
                } catch (error) {
                    console.error(`❌ ERROR ejecutando comando !salidas:`, error);
                    anunciarError(`❌ Error interno al procesar comando !salidas`, jugador);
                }
            } else {
                console.warn(`⚠️ DEBUG: Función nodeObtenerUltimasSalidas no está disponible`);
                anunciarError("❌ Sistema de tracking de salidas no disponible", jugador);
            }
            break;

        case "cm":
        case "memide":
            let objetivo;
            if (args[1]) {
                const nombreObjetivo = args.slice(1).join(" ");
                objetivo = obtenerJugadorPorNombreOID(nombreObjetivo);

                if (!objetivo) {
                    anunciarError(`❌ No se encontró a ningún jugador con el nombre "${nombreObjetivo}"`, jugador);
                    return;
                }
            } else {
                objetivo = jugador;
            }

            // Generar tamaño COMPLETAMENTE ALEATORIO entre 7 y 32
            const tamano = Math.floor(Math.random() * 26) + 7; // 26 posibilidades (7-32)

            // Determinar comentario según el tamaño
            let comentario = "";
            let emoji = "";

            if (tamano >= 25) {
                // Gigante (25-32 cm)
                const comentariosGigante = [
                    "¡BESTIAL! 🐎 Eso ya es un arma de destrucción masiva",
                    "¡MONSTRUOSO! 🦍 Eso debería estar en un museo",
                    "¡LEGENDARIO! 🗿 Los científicos quieren estudiarlo",
                    "¡ÉPICO! ⚔️ Con eso podrías conquistar países",
                    "¡TITÁNICO! 🚢 Eso tiene su propio código de área"
                ];
                comentario = comentariosGigante[Math.floor(Math.random() * comentariosGigante.length)];
                emoji = "🍆💥";
            } else if (tamano >= 20) {
                // Larga (20-24 cm)
                const comentariosLarga = [
                    "¡IMPRESIONANTE! 🤯 Eso ya es considerado patrimonio nacional",
                    "¡WOW! 😱 Con eso podría trabajar de modelo",
                    "¡TREMENDO! 🔥 Eso debe tener su propio código postal",
                    "¡INCREÍBLE! 👑 Rey de reyes, señor de señores",
                    "¡ESPECTACULAR! 🎭 Debería estar en el circo",
                    "¡COLOSAL! 🏛️ Material de leyenda"
                ];
                comentario = comentariosLarga[Math.floor(Math.random() * comentariosLarga.length)];
                emoji = "🍆👑";
            } else if (tamano >= 17) {
                // Un poco más grande (17-19 cm)
                const comentariosMayorPromedio = [
                    "¡Muy bien! 😎 Por encima del promedio, felicitaciones",
                    "¡Excelente! 👏 Definitivamente tienes con qué presumir",
                    "¡Genial! 🎯 En el rango perfecto, ni mucho ni poco",
                    "¡Muy bueno! ⭐ Justo lo que las estadísticas recomiendan",
                    "¡Sobresaliente! 🎓 Arriba del promedio mundial",
                    "¡Destacado! 🏅 En la liga de los grandes"
                ];
                comentario = comentariosMayorPromedio[Math.floor(Math.random() * comentariosMayorPromedio.length)];
                emoji = "🍆✨";
            } else if (tamano >= 13) {
                // Normal (13-16 cm)
                const comentariosNormal = [
                    "Normal 👍 Perfectamente funcional",
                    "Estándar 📏 En el rango promedio mundial",
                    "Clásico 😌 Lo importante no es el tamaño sino la técnica",
                    "Regular 🙂 Dentro de lo esperado",
                    "Promedio 📊 Exactamente lo que dice la estadística",
                    "Convencional 💼 Tamaño ejecutivo"
                ];
                comentario = comentariosNormal[Math.floor(Math.random() * comentariosNormal.length)];
                emoji = "🍆😊";
            } else {
                // Pequeña (7-12 cm)
                const comentariosChica = [
                    "Pequeña pero valiente 🥺 Tamaño de bolsillo",
                    "Compacta 📱 Versión travel size",
                    "Mini 🤏 Pero con mucho corazón",
                    "Pocket edition 🎮 Lo bueno viene en envase pequeño",
                    "Formato ahorro 💰 Económica en combustible",
                    "Portátil 🎒 Fácil de transportar",
                    "Concentrada 💊 La potencia está en el interior"
                ];
                comentario = comentariosChica[Math.floor(Math.random() * comentariosChica.length)];
                emoji = "🍆🥺";
            }

            // Mensaje final
            const mensajeFinal = `${emoji} A ${objetivo.name} le mide ${tamano} CM. ${comentario} ${emoji}`;
            anunciarGeneral(mensajeFinal, "FF69B4", "bold");
            break;

        case "afk":
            // Verificar si el jugador es admin
            if (esAdminBasico(jugador)) {
                // FUNCIONALIDAD PARA ADMINS: Mover jugador a espectadores
                if (jugador.team === 0) {
                    anunciarError("❌ Ya estás en espectadores", jugador);
                    return;
                }
                
                // Verificar cooldown del comando
                const cooldownAfk = comandoCooldown.get(jugador.id);
                if (cooldownAfk && Date.now() - cooldownAfk < COOLDOWN_COMANDO) {
                    const tiempoRestante = Math.ceil((COOLDOWN_COMANDO - (Date.now() - cooldownAfk)) / 1000);
                    anunciarError(`⏰ Debes esperar ${tiempoRestante} segundos antes de usar este comando de nuevo`, jugador);
                    return;
                }
                
                // Permitir movimiento por comando
                movimientoPermitidoPorComando.add(jugador.id);
                
                room.setPlayerTeam(jugador.id, 0);
                anunciarGeneral(`💤 ${jugador.name} se fue AFK a espectadores`, "888888");
                
                // Limpiar datos AFK y establecer cooldown
                jugadoresAFK.delete(jugador.id);
                advertenciasAFK.delete(jugador.id);
                comandoCooldown.set(jugador.id, Date.now());
                
                // Verificar balance y auto start/stop después del cambio
                setTimeout(() => {
                    autoBalanceEquipos();
                    verificarAutoStart();
                    verificarAutoStop(null);
                }, 500);
                
            } else {
                // FUNCIONALIDAD PARA JUGADORES NORMALES: Ejecutar como !back
                if (jugador.team !== 0) {
                    anunciarError("❌ Ya estás en un equipo. Solo los admins pueden usar !afk para ir a espectadores", jugador);
                    return;
                }
                
                // Verificar cooldown del comando
                const cooldownBack = comandoCooldown.get(jugador.id);
                if (cooldownBack && Date.now() - cooldownBack < COOLDOWN_COMANDO) {
                    const tiempoRestante = Math.ceil((COOLDOWN_COMANDO - (Date.now() - cooldownBack)) / 1000);
                    anunciarError(`⏰ Debes esperar ${tiempoRestante} segundos antes de usar este comando de nuevo`, jugador);
                    return;
                }
                
                // Asignar al equipo con menos jugadores
                const jugadoresRed = room.getPlayerList().filter(j => j.team === 1).length;
                const jugadoresBlue = room.getPlayerList().filter(j => j.team === 2).length;
                const equipoDestino = jugadoresRed <= jugadoresBlue ? 1 : 2;
                
                // Permitir movimiento por comando
                movimientoPermitidoPorComando.add(jugador.id);
                
                room.setPlayerTeam(jugador.id, equipoDestino);
                
                const equipoNombre = equipoDestino === 1 ? '🔴 ROJO' : '🔵 AZUL';
                // anunciarGeneral(`🔙 ✨ ${jugador.name} regresó del AFK al equipo ${equipoNombre} ✨`, "00FF00", "bold");
                
                // Limpiar datos AFK y establecer cooldown
                jugadoresAFK.delete(jugador.id);
                advertenciasAFK.delete(jugador.id);
                comandoCooldown.set(jugador.id, Date.now());
                
                // Verificar balance y auto start después del cambio
                setTimeout(() => {
                    autoBalanceEquipos();
                    verificarAutoStart();
                }, 500);
            }
            break;
            
        case "nv":
        case "bb":
            // Marcar que este jugador se va voluntariamente para evitar mensajes duplicados
            jugadoresSaliendoVoluntariamente.add(jugador.id);
            
            // Mostrar solo UN mensaje de despedida
            anunciarGeneral(`👋 ${jugador.name} abandonó la sala. ¡Hasta la vista!`, "888888");
            
            // Usar setTimeout para permitir que el mensaje se muestre antes de la expulsión
            setTimeout(() => {
                room.kickPlayer(jugador.id, "Has abandonado la sala voluntariamente", false);
            }, 100);
            break;

        // Los comandos rápidos numéricos ahora se procesan automáticamente antes de llegar aquí
            
        case "back":
            // Mover jugador de espectadores a un equipo
            if (jugador.team !== 0) {
                anunciarError("❌ Ya estás en un equipo. Usa !afk para ir a espectadores", jugador);
                return;
            }
            
            // Verificar cooldown del comando
            const cooldownBack = comandoCooldown.get(jugador.id);
            if (cooldownBack && Date.now() - cooldownBack < COOLDOWN_COMANDO) {
                const tiempoRestante = Math.ceil((COOLDOWN_COMANDO - (Date.now() - cooldownBack)) / 1000);
                anunciarError(`⏰ Debes esperar ${tiempoRestante} segundos antes de usar este comando de nuevo`, jugador);
                return;
            }
            
            // Asignar al equipo con menos jugadores
            const jugadoresRed = room.getPlayerList().filter(j => j.team === 1).length;
            const jugadoresBlue = room.getPlayerList().filter(j => j.team === 2).length;
            const equipoDestino = jugadoresRed <= jugadoresBlue ? 1 : 2;
            
            // Permitir movimiento por comando
            movimientoPermitidoPorComando.add(jugador.id);
            
            room.setPlayerTeam(jugador.id, equipoDestino);
            
            const equipoNombre = equipoDestino === 1 ? '🔴 ROJO' : '🔵 AZUL';
            // anunciarGeneral(`🔙 ✨ ${jugador.name} regresó del AFK al equipo ${equipoNombre} ✨`, "00FF00", "bold");
            
            // Limpiar datos AFK y establecer cooldown
            jugadoresAFK.delete(jugador.id);
            advertenciasAFK.delete(jugador.id);
            comandoCooldown.set(jugador.id, Date.now());
            
            // Verificar balance y auto start después del cambio
            setTimeout(() => {
                autoBalanceEquipos();
                verificarAutoStart();
            }, 500);
            break;
            
        // COMANDOS DE ADMIN
        case "claim":
        case "admin":
            // ==================== DEBUG COMPLETO DEL JUGADOR ====================
            console.log('🔍 [CLAIM DEBUG] =================================');
            console.log('🔍 [CLAIM DEBUG] Estado completo del jugador:');
            console.log('🔍 [CLAIM DEBUG] - ID:', jugador.id);
            console.log('🔍 [CLAIM DEBUG] - Nombre:', jugador.name);
            console.log('🔍 [CLAIM DEBUG] - Auth (tipo):', typeof jugador.auth);
            console.log('🔍 [CLAIM DEBUG] - Auth (valor):', JSON.stringify(jugador.auth));
            console.log('🔍 [CLAIM DEBUG] - Auth (string):', String(jugador.auth));
            console.log('🔍 [CLAIM DEBUG] - Auth (length):', jugador.auth ? jugador.auth.length : 'N/A');
            console.log('🔍 [CLAIM DEBUG] - Propiedades del jugador:', Object.keys(jugador));
            
            // Verificar si hay otros jugadores con auth válido
            const jugadoresConAuth = room.getPlayerList().filter(p => p.auth && typeof p.auth === 'string' && p.auth.length > 0);
            console.log('🔍 [CLAIM DEBUG] - Total jugadores con auth válido:', jugadoresConAuth.length);
            jugadoresConAuth.forEach(p => {
                console.log(`🔍 [CLAIM DEBUG]   - ${p.name}: ${p.auth}`);
            });
            console.log('🔍 [CLAIM DEBUG] =================================');
            
            if (args[1]) {
                const password = args[1];
                let rolAsignado = null;
                
                // Verificar contraseñas de roles
                if (password === ROLE_PASSWORDS.SUPER_ADMIN) {
                    rolAsignado = "SUPER_ADMIN";
                } else if (password === ROLE_PASSWORDS.ADMIN_FULL || password === adminPassword) {
                    rolAsignado = "ADMIN_FULL";
                } else if (password === ROLE_PASSWORDS.ADMIN_BASICO) {
                    rolAsignado = "ADMIN_BASICO";
                }
                
                if (rolAsignado) {
                    // Asignar rol en el nuevo sistema
                    jugadoresConRoles.set(jugador.id, {
                        role: rolAsignado,
                        assignedAt: Date.now(),
                        assignedBy: jugador.name
                    });
                    
                    // ==================== GUARDAR ROL DE FORMA PERSISTENTE ====================
                    // Obtener auth desde jugadoresUID (guardado al conectarse) en lugar de jugador.auth
                    const authGuardado = jugadoresUID.get(jugador.id);
                    console.log('[DEBUG AUTH LEGACY]', jugador.name, { 
                        type: typeof jugador.auth, 
                        auth: jugador.auth,
                        authGuardado: authGuardado,
                        jugadorId: jugador.id 
                    });
                    
                    // Guardar el rol en el sistema de persistencia si está disponible
                    try {
                        if (typeof nodeAssignRole === 'function') {
                            // Verificar que tenemos un auth válido antes de intentar guardar
                            if (!authGuardado || authGuardado.length === 0) {
                                console.warn(`⚠️ No se puede guardar rol persistente para ${jugador.name} - Auth no disponible`);
                                anunciarError("🔑 ⚠️ Para que tu rol sea permanente, debes estar logueado en Haxball.com", jugador);
                                anunciarInfo(`📝 Ve a https://www.haxball.com/ y haz login antes de usar !claim`, jugador);
                                anunciarInfo(`🔍 Debug: Auth guardado: ${typeof authGuardado} - "${authGuardado}"`, jugador);
                            } else {
                                const resultado = await nodeAssignRole(
                                    authGuardado, // Usar auth guardado en lugar de jugador.auth
                                    rolAsignado,
                                    'SISTEMA_CLAIM', // Indicar que fue por comando !claim
                                    jugador.name
                                );
                                
                                if (resultado?.ok) {
                                    console.log(`🔑 ROL GUARDADO PERSISTENTEMENTE: ${jugador.name} (${authGuardado}) -> ${rolAsignado}`);
                                    // anunciarInfo(`✅ Rol ${rolAsignado} guardado permanentemente`, jugador);
                                } else if (resultado?.reason === 'AUTH_REQUIRED') {
                                    // Notificar al jugador que necesita login de Haxball
                                    // anunciarError("🔑 ⚠️ Para que tu rol sea permanente, debes estar logueado en Haxball.com", jugador);
                                    // anunciarInfo(`📝 Ve a https://www.haxball.com/ y haz login antes de usar !claim`, jugador);
                                    // anunciarInfo(`🔍 Debug: AuthID recibido: ${typeof authGuardado} - "${authGuardado}"`, jugador);
                                } else {
                                    console.error(`❌ Error guardando rol persistente para ${jugador.name}:`, resultado);
                                }
                            }
                        } else {
                            console.warn(`⚠️ Sistema de roles persistentes no disponible`);
                        }
                    } catch (error) {
                        console.error(`❌ Error guardando rol persistente:`, error);
                    }
                    
                    const rol = ROLES[rolAsignado];
                    
                    // CONFIGURACIÓN DE ADMIN DE SALA: Solo SUPER_ADMIN tiene admin real
                    if (rolAsignado === "SUPER_ADMIN") {
                        adminActual = jugador;
                        room.setPlayerAdmin(jugador.id, true); // Solo SUPER_ADMIN tiene admin de sala
                        console.log(`👑 Admin de sala otorgado a SUPER_ADMIN: ${jugador.name}`);
                    } else if (rolAsignado === "ADMIN_FULL" || rolAsignado === "ADMIN_BASICO") {
                        adminActual = jugador; // Funciones de admin pero no admin de sala
                        // NO dar room.setPlayerAdmin - solo funciones internas del bot
                        console.log(`🛡️ Funciones de admin otorgadas (sin admin de sala) a ${rolAsignado}: ${jugador.name}`);
                    }
                    
                    // No cambiar el nombre/avatar del jugador al asignar rol
                    
                    // Anuncio según el rol
                    let mensaje, color;
                    switch (rolAsignado) {
                        case "SUPER_ADMIN":
                            mensaje = `👑 ⚡ ${jugador.name.toUpperCase()} ES AHORA SUPER ADMINISTRADOR ⚡ 👑`;
                            color = "FF0000";
                            break;
                        case "ADMIN_FULL":
                            mensaje = `🛡️ ⚡ ${jugador.name.toUpperCase()} ES AHORA ADMIN FULL ⚡ 🛡️`;
                            color = "FFD700";
                            break;
                        case "ADMIN_BASICO":
                            mensaje = `⚖️ ⚡ ${jugador.name.toUpperCase()} ES AHORA ADMIN BÁSICO ⚡ ⚖️`;
                            color = "FFA500";
                            break;
                    }
                    
                    anunciarGeneral(mensaje, color, "bold");
                    
                } else {
                    anunciarError("🔐 Contraseña incorrecta", jugador);
                }
            } else {
                anunciarError("📝 Uso: !claim <contraseña>", jugador);
            }
            break;
            
            
        case "set_password":
        case "pw":
            if (!esAdmin(jugador)) return;
            if (args[1]) {
                room.setPassword(args[1]);
                contraseñaActual = args[1];
                anunciarGeneral(`🔒 🛡️ CONTRASEÑA DE SALA ESTABLECIDA: ${args[1]} 🛡️ 🔒`, "FFD700", "bold");
                // Enviar reporte de cambio de estado
                setTimeout(() => {
                    // Generar informe verificando enlace real
                    if (tieneEnlaceReal()) {
                        const mensaje = generarInformeSala();
                        enviarReporteDiscord(mensaje);
                    // Reporte enviado con enlace real después de !pw
                } else {
                    // No se envía reporte de !pw - esperando enlace real
                }
                }, 1000);
            } else {
anunciarError("Uso: !pw <contraseña>", jugador);
            }
            break;
            
        case "clear_password":
        case "clear":
        case "clearpassword":
            if (!esAdmin(jugador)) return;
            room.setPassword(null);
            contraseñaActual = null;
            anunciarGeneral(`🔓 ✨ CONTRASEÑA ELIMINADA - SALA ABIERTA ✨ 🔓`, "00FF00", "bold");
            // Enviar reporte de cambio de estado
            setTimeout(() => {
                // Generar informe verificando enlace real
                if (tieneEnlaceReal()) {
                    const mensaje = generarInformeSala();
                    enviarReporteDiscord(mensaje);
                    // Reporte enviado con enlace real después de !clear_password
                } else {
                    // No se envía reporte de !clear_password - esperando enlace real
                }
            }, 1000);
            break;
            
        case "clear_bans":
            if (!esAdmin(jugador)) return;
            room.clearBans();
            anunciarExito("🧹 Lista de baneos limpiada");
            break;
            
            
        case "pause":
            if (!esAdmin(jugador)) return;
            room.pauseGame(true);
            anunciarInfo("⏸️ Juego pausado");
            break;
            
        case "resume":
            if (!esAdmin(jugador)) return;
            room.pauseGame(false);
            anunciarInfo("▶️ Juego reanudado");
            break;
            
        case "autostart":
            if (!esAdmin(jugador)) return;
            autoStartEnabled = !autoStartEnabled;
        const estado = autoStartEnabled ? '✅ ACTIVADO' : '❌ DESACTIVADO';
        anunciarGeneral(`🤖 ⚙️ AUTO START ${estado} ⚙️ 🤖`, autoStartEnabled ? "00FF00" : "FF6B6B", "bold");
            if (autoStartEnabled) verificarAutoStart();
            break;
            
        case "autostop":
            if (!esAdmin(jugador)) return;
            autoStopEnabled = !autoStopEnabled;
            anunciarExito(`🤖 Auto stop ${autoStopEnabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
            break;
            
        case "balance":
            if (!esAdmin(jugador)) return;
            autoBalanceEquipos();
            anunciarExito("⚖️ Balance de equipos ejecutado manualmente");
            break;
            
        case "replay_config":
            if (!esAdmin(jugador)) return;
            mostrarConfigReplays(jugador);
            break;
            
        case "toggle_replays":
            if (!esAdmin(jugador)) return;
            if (args[1]) {
                const tipo = args[1].toLowerCase();
                if (tipo === "discord") {
                    enviarReplaysDiscord = !enviarReplaysDiscord;
                    anunciarExito(`🎬 Envío de replays a Discord: ${enviarReplaysDiscord ? 'ACTIVADO' : 'DESACTIVADO'}`);
                } else if (tipo === "oficiales") {
                    guardarReplaysOficiales = !guardarReplaysOficiales;
                    anunciarExito(`🏆 Replays oficiales: ${guardarReplaysOficiales ? 'ACTIVADO' : 'DESACTIVADO'}`);
                } else if (tipo === "amistosos") {
                    guardarReplaysAmistosos = !guardarReplaysAmistosos;
                    anunciarExito(`⚽ Replays amistosos: ${guardarReplaysAmistosos ? 'ACTIVADO' : 'DESACTIVADO'}`);
                } else {
                    anunciarError("Usa: !toggle_replays discord|oficiales|amistosos");
                }
            } else {
                anunciarError("Usa: !toggle_replays discord|oficiales|amistosos");
            }
            break;
            
        case "stop":
            if (!esAdmin(jugador)) return;
            if (partidoEnCurso) {
                room.stopGame();
                anunciarInfo("⏹️ Partido finalizado manualmente por el administrador");
            } else {
                anunciarError("⚠️ No hay partido en curso para detener", jugador);
            }
            break;
            
        case "mute":
            // Verificar si el usuario es al menos admin básico
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ No tienes permisos para mutear jugadores.", jugador);
                return;
            }
            
            if (args[1]) {
                const nombreJugador = args[1];
                let tiempo = args[2] ? parseInt(args[2]) : null; // tiempo en minutos
                let razon = args.slice(tiempo ? 3 : 2).join(" ") || "Muteado por admin";
                const jugadorObjetivo = obtenerJugadorPorNombreOID(nombreJugador);
                
                if (jugadorObjetivo) {
                    // Prevenir que los admins se muteen entre sí
                    if (esAdminBasico(jugadorObjetivo)) {
                        anunciarError("❌ No puedes mutear a otro administrador.", jugador);
                        return;
                    }
                    
                    // Aplicar límites de tiempo según el rol
                    if (esSuperAdmin(jugador)) {
                        // Super Admin no tiene límite de tiempo y puede mutear permanentemente
                        if (!razon.includes("superadmin")) {
                            razon = razon || "Muteado por superadmin";
                        }
                    } else if (esAdmin(jugador)) { // Admin Full
                        if (tiempo === null) {
                            anunciarError("❌ Como Admin Full, debes especificar un tiempo de muteo.", jugador);
                            return;
                        }
                        const maxTiempo = 600;
                        if (tiempo > maxTiempo) {
                            anunciarError(`❌ Tu límite de muteo es de ${maxTiempo} minutos.`, jugador);
                            return;
                        }
                    } else { // Admin Básico
                        if (tiempo === null) {
                            anunciarError("❌ Como Admin Básico, debes especificar un tiempo de muteo.", jugador);
                            return;
                        }
                        const maxTiempo = 60;
                        if (tiempo > maxTiempo) {
                            anunciarError(`❌ Tu límite de muteo es de ${maxTiempo} minutos.`, jugador);
                            return;
                        }
                    }
                    
                    // Verificar si ya está muteado y desmutear
                    if (jugadoresMuteados.has(jugadorObjetivo.id) || jugadoresMuteadosTemporales.has(jugadorObjetivo.id)) {
                        // Desmutear jugador
                        jugadoresMuteados.delete(jugadorObjetivo.id);
                        
                        const muteTemp = jugadoresMuteadosTemporales.get(jugadorObjetivo.id);
                        if (muteTemp) {
                            clearTimeout(muteTemp.timeoutId);
                            jugadoresMuteadosTemporales.delete(jugadorObjetivo.id);
                        }
                        
                        anunciarExito(`🔊 ${jugadorObjetivo.name} ya no está silenciado`);
                        // Mensaje privado al jugador desmutado
                        room.sendAnnouncement("ℹ️ ✅ Finalizó tu muteo", jugadorObjetivo.id, parseInt(CELESTE_LNB, 16), "normal", 0);
                        
                        // Enviar notificación al webhook
                        enviarNotificacionMute("unmute", jugador.name, jugadorObjetivo.name, jugadorObjetivo.id);
                        return;
                    }
                    
                    // Aplicar mute
                    if (tiempo && tiempo > 0) {
                        // Mute temporal
                        const finMute = Date.now() + (tiempo * 60 * 1000);
                        
                        // Crear timeout para desmutear automáticamente
                        const timeoutId = setTimeout(() => {
                            if (jugadoresMuteadosTemporales.has(jugadorObjetivo.id)) {
                                jugadoresMuteadosTemporales.delete(jugadorObjetivo.id);
                                // Verificar si el jugador sigue conectado
                                const jugadorActual = room.getPlayerList().find(j => j.id === jugadorObjetivo.id);
                                if (jugadorActual) {
                                    anunciarInfo(`✅ ${jugadorObjetivo.name} ya no está silenciado (tiempo expirado)`);
                                    // Mensaje privado al jugador desmutado
                                    room.sendAnnouncement("ℹ️ ✅ Finalizó tu muteo", jugadorObjetivo.id, parseInt(CELESTE_LNB, 16), "normal", 0);
                                }
                            }
                        }, tiempo * 60 * 1000);
                        
                        jugadoresMuteadosTemporales.set(jugadorObjetivo.id, {
                            finMute: finMute,
                            razon: razon,
                            timeoutId: timeoutId
                        });
                        
                        anunciarAdvertencia(`🔇 ${jugadorObjetivo.name} ha sido silenciado por ${tiempo} minutos: ${razon}`);
                        
                        // Enviar notificación al webhook
                        enviarNotificacionMute("mute", jugador.name, jugadorObjetivo.name, jugadorObjetivo.id, tiempo, razon);
                    } else {
                        // Mute permanente
                        jugadoresMuteados.add(jugadorObjetivo.id);
                        anunciarAdvertencia(`🔇 ${jugadorObjetivo.name} ha sido silenciado permanentemente: ${razon}`);
                        
                        // Enviar notificación al webhook
                        enviarNotificacionMute("mute", jugador.name, jugadorObjetivo.name, jugadorObjetivo.id, null, razon);
                    }
                } else {
                    anunciarError("Jugador no encontrado", jugador);
                }
            } else {
                anunciarError("📝 Uso: !mute \u003cjugador\u003e [tiempo_minutos] [razón]", jugador);
            }
            break;
            
            
        case "kick":
            // Verificar permisos básicos - cualquier tipo de admin puede kickear
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ No tienes permisos para expulsar jugadores.", jugador);
                return;
            }
            
            if (args[1]) {
                const inputJugador = args[1];
                const razon = args.slice(2).join(" ") || "Expulsado por admin";
                let jugadorObjetivo = null;
                
                // Verificar si es un ID numérico (empieza con #)
                if (inputJugador.startsWith('#')) {
                    const id = inputJugador.substring(1);
                    jugadorObjetivo = obtenerJugadorPorID(id);
                    
                    if (!jugadorObjetivo) {
                        anunciarError(`❌ ID inválido: ${id}. Usa # para ver la lista de jugadores con IDs.`, jugador);
                        return;
                    }
                    
                    // anunciarInfo(`🎯 Jugador seleccionado por ID #${id}: ${jugadorObjetivo.name}`, jugador);
                } else {
                    // Búsqueda por nombre tradicional
                    jugadorObjetivo = obtenerJugadorPorNombre(inputJugador);
                }
                
                if (jugadorObjetivo) {
                    // Verificar jerarquía de permisos
                    if (esSuperAdmin(jugadorObjetivo)) {
                        anunciarError("❌ No puedes hacer kick a un Super Admin", jugador);
                        return;
                    }
                    
                    if (esAdmin(jugadorObjetivo) && !esSuperAdmin(jugador)) {
                        anunciarError("❌ No puedes hacer kick a un Admin Full (necesitas ser Super Admin)", jugador);
                        return;
                    }
                    
                    if (esAdminBasico(jugadorObjetivo) && !esAdmin(jugador)) {
                        anunciarError("❌ No puedes hacer kick a otro Admin Básico (necesitas ser Admin Full o superior)", jugador);
                        return;
                    }
                    
                    // Ejecutar kick
                    room.kickPlayer(jugadorObjetivo.id, razon, false);
                    
                    // Mensaje personalizado según el tipo de admin que ejecuta el kick
                    const tipoAdmin = esSuperAdmin(jugador) ? "Super Admin" : 
                                     esAdmin(jugador) ? "Admin Full" : "Admin Básico";
                    
                    // Enviar notificación al webhook
                    const ipJugadorObjetivo = obtenerIPJugador(jugadorObjetivo);
                    enviarNotificacionBanKick("kick", jugador.name, jugadorObjetivo.name, jugadorObjetivo.id, null, razon, ipJugadorObjetivo);
                    
                } else {
                    anunciarError("❌ Jugador no encontrado", jugador);
                }
            } else {
                anunciarError("📝 Uso: !kick <jugador|#ID> [razón]. Usa # para ver IDs de jugadores.", jugador);
            }
            break;
            
        case "unmute":
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ No tienes permisos para desmutear jugadores.", jugador);
                return;
            }
            if (args[1]) {
                const nombreJugador = args[1];
                const jugadorObjetivo = obtenerJugadorPorNombreOID(nombreJugador);
                
                if (jugadorObjetivo) {
                    let jugadorDesmmuteado = false;
                    
                    // Verificar y remover mute permanente
                    if (jugadoresMuteados.has(jugadorObjetivo.id)) {
                        jugadoresMuteados.delete(jugadorObjetivo.id);
                        jugadorDesmmuteado = true;
                    }
                    
                    // Verificar y remover mute temporal
                    const muteTemp = jugadoresMuteadosTemporales.get(jugadorObjetivo.id);
                    if (muteTemp) {
                        clearTimeout(muteTemp.timeoutId);
                        jugadoresMuteadosTemporales.delete(jugadorObjetivo.id);
                        jugadorDesmmuteado = true;
                    }
                    
                    if (jugadorDesmmuteado) {
                        anunciarExito(`🔊 ${jugadorObjetivo.name} ha sido desmuteado por ${jugador.name}`);
                        
                        // Enviar notificación al webhook
                        enviarNotificacionMute("unmute", jugador.name, jugadorObjetivo.name, jugadorObjetivo.id);
                    } else {
                        anunciarError(`❌ ${jugadorObjetivo.name} no está muteado`, jugador);
                    }
                } else {
                    anunciarError("❌ Jugador no encontrado", jugador);
                }
            } else {
                anunciarError("📝 Uso: !unmute <jugador>", jugador);
            }
            break;
            
        case "ban":
            // 1. Verificar si el usuario es al menos admin básico
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ No tienes permisos para banear jugadores.", jugador);
                return;
            }

            // 2. Validar argumentos
            if (!args[1]) {
                anunciarError("📝 Uso: !ban <jugador|#ID> [tiempo] [razón]. El tiempo es en minutos. Usa # para ver IDs.", jugador);
                return;
            }
            
            const inputJugador = args[1];
            let jugadorObjetivo = null;
            
            // Verificar si es un ID numérico (empieza con #)
            if (inputJugador.startsWith('#')) {
                const id = inputJugador.substring(1);
                jugadorObjetivo = obtenerJugadorPorID(id);
                
                if (!jugadorObjetivo) {
                    anunciarError(`❌ ID inválido: ${id}. Usa # para ver la lista de jugadores con IDs.`, jugador);
                    return;
                }
                
                // anunciarInfo(`🎯 Jugador seleccionado por ID #${id}: ${jugadorObjetivo.name}`, jugador);
            } else {
                // Búsqueda por nombre tradicional
                jugadorObjetivo = obtenerJugadorPorNombre(inputJugador);
                
                if (!jugadorObjetivo) {
                    // ==================== INTEGRACIÓN BANEO OFFLINE ====================
                    // Si no encontramos al jugador online y tenemos el sistema offline disponible
                    if (offlineBanSystem && esSuperAdmin(jugador)) {
                        anunciarInfo(`🔍 Jugador "${inputJugador}" no encontrado en sala. Intentando baneo offline...`, jugador);
                        
                        // Preparar argumentos para el sistema offline
                        const tiempoInput = args[2];
                        const tiempo = (tiempoInput && !isNaN(parseInt(tiempoInput))) ? parseInt(tiempoInput) : 0;
                        const razon = tiempo > 0 ? args.slice(3).join(' ') || 'Baneado por admin' : args.slice(2).join(' ') || 'Baneado por admin';
                        
                        // Validar límites de tiempo para baneos offline también
                        if (!esSuperAdmin(jugador)) {
                            if (tiempo === 0) {
                                anunciarError("❌ Solo Super Admins pueden hacer baneos offline permanentes", jugador);
                                return;
                            }
                            const maxTiempo = esAdmin(jugador) ? 600 : 60;
                            if (tiempo > maxTiempo) {
                                anunciarError(`❌ Tu límite para baneos offline es de ${maxTiempo} minutos`, jugador);
                                return;
                            }
                        }
                        
                        // Ejecutar baneo offline
                        try {
                            await procesarBaneoOffline(jugador, [null, inputJugador, tiempo.toString(), razon]);
                            return; // Salir del comando ban después del baneo offline
                        } catch (offlineError) {
                            console.error('❌ Error en baneo offline desde comando ban:', offlineError);
                            anunciarError(`❌ Error ejecutando baneo offline: ${offlineError.message}`, jugador);
                            return;
                        }
                    } else if (offlineBanSystem && !esSuperAdmin(jugador)) {
                        anunciarError(`❌ Jugador "${inputJugador}" no encontrado en sala. Solo Super Admins pueden usar baneos offline.`, jugador);
                        anunciarInfo(`💡 Alternativas: Esperar a que se conecte o usar !findplayer para buscarlo`, jugador);
                        return;
                    } else {
                        anunciarError(`❌ Jugador "${inputJugador}" no encontrado. Usa # para ver IDs de jugadores.`, jugador);
                        anunciarInfo(`💡 Si el jugador está desconectado, un Super Admin puede usar !banoffline`, jugador);
                        return;
                    }
                }
            }

            // 3. Prevenir que los admins se baneen entre sí
            if (esAdminBasico(jugadorObjetivo)) {
                anunciarError("❌ No puedes banear a otro administrador.", jugador);
                return;
            }

            // 4. Analizar tiempo y razón
            let tiempoInput = args[2];
            let tiempo = null; // null = ban permanente
            let razon = args.slice(2).join(" ") || "Baneado por admin"; // Razón por defecto

            if (tiempoInput && !isNaN(parseInt(tiempoInput))) {
                tiempo = parseInt(tiempoInput);
                razon = args.slice(3).join(" ") || "Baneado por admin";
            }
            
            // 5. Aplicar límites de tiempo según el rol
            if (esSuperAdmin(jugador)) {
                // Super Admin no tiene límite de tiempo y puede banear permanentemente
            } else if (esAdmin(jugador)) { // Admin Full
                if (tiempo === null) {
                    anunciarError("❌ Como Admin Full, debes especificar un tiempo de baneo.", jugador);
                    return;
                }
                const maxTiempo = 600;
                if (tiempo > maxTiempo) {
                    anunciarError(`❌ Tu límite de baneo es de ${maxTiempo} minutos.`, jugador);
                    return;
                }
            } else { // Admin Básico
                if (tiempo === null) {
                    anunciarError("❌ Como Admin Básico, debes especificar un tiempo de baneo.", jugador);
                    return;
                }
                const maxTiempo = 60;
                if (tiempo > maxTiempo) {
                    anunciarError(`❌ Tu límite de baneo es de ${maxTiempo} minutos.`, jugador);
                    return;
                }
            }

            // 6. Obtener UID e IP del jugador
            const uid = obtenerUID(jugadorObjetivo);
            const ipJugador = obtenerIPJugador(jugadorObjetivo); // Obtener IP para el desbaneo
            
            if (!uid) {
                console.warn(`⚠️ WARN BAN: UID no disponible inmediatamente para ${jugadorObjetivo.name}, iniciando sistema de reintentos...`);
                
                // Sistema de reintentos múltiples con tiempos incrementales
                const intentarObtenerUID = (intento = 1, maxIntentos = 5) => {
                    const tiempoEspera = intento * 500; // 500ms, 1s, 1.5s, 2s, 2.5s
                    
                    setTimeout(() => {
                        const uidRetry = obtenerUID(jugadorObjetivo);
                        
                        if (uidRetry) {
                            console.log(`✅ UID obtenido en intento ${intento}/${maxIntentos} para ${jugadorObjetivo.name}: ${uidRetry}`);
                            anunciarInfo(`🔄 UID obtenido después de ${intento} intento(s), procediendo con el baneo...`, jugador);
                            ejecutarBaneoMejorado(jugador, jugadorObjetivo, uidRetry, tiempo, razon);
                        } else if (intento < maxIntentos) {
                            console.warn(`⚠️ RETRY BAN: Intento ${intento}/${maxIntentos} fallido para ${jugadorObjetivo.name}, reintentando en ${tiempoEspera + 500}ms...`);
                            intentarObtenerUID(intento + 1, maxIntentos);
                        } else {
                            console.error(`❌ ERROR BAN: Todos los intentos (${maxIntentos}) fallaron para obtener UID de ${jugadorObjetivo.name}`);
                            console.error(`📊 INFO DEBUG: ID: ${jugadorObjetivo.id}, Auth: ${jugadorObjetivo.auth}, Team: ${jugadorObjetivo.team}`);
                            
                            anunciarError(`❌ No se pudo obtener el UID de ${jugadorObjetivo.name} después de ${maxIntentos} intentos.`, jugador);
                            anunciarAdvertencia(`⚠️ Esto puede deberse a que el jugador no está autenticado o tiene problemas de conexión.`);
                            anunciarAdvertencia(`💡 Alternativas: !kick ${jugadorObjetivo.name} (expulsar) o esperar a que se reconecte.`);
                        }
                    }, tiempoEspera);
                };
                
                intentarObtenerUID();
                return;
            }

            // 7. Ejecutar el baneo en HaxBall
            const tiempoTexto = tiempo ? `${tiempo} minutos` : "permanentemente";
            try {
                room.kickPlayer(jugadorObjetivo.id, `${razon} (${tiempoTexto})`, true); // true para banear
                anunciarAdvertencia(`🚫 ${jugadorObjetivo.name} ha sido baneado ${tiempoTexto}. Razón: ${razon}`);
                
                // 7.1. Programar desbaneo automático si es temporal
                if (tiempo && tiempo > 0) {
                    const tiempoMs = tiempo * 60 * 1000; // Convertir minutos a millisegundos
                    
                    setTimeout(() => {
                        try {
                            // Desbanear por ID del jugador (si aún está disponible)
                            if (jugadorObjetivo.id !== undefined) {
                                room.clearBan(jugadorObjetivo.id);
                                console.log(`⏰ Ban automáticamente levantado para ${jugadorObjetivo.name} (ID: ${jugadorObjetivo.id})`);
                            }
                            
                            // Desbanear por UID (más confiable)
                            if (uid) {
                                room.clearBan(uid);
                                console.log(`⏰ Ban automáticamente levantado para ${jugadorObjetivo.name} (UID: ${uid})`);
                            }
                            
                            // Desbanear por IP si está disponible
                            if (ipJugador) {
                                room.clearBan(ipJugador);
                                console.log(`⏰ Ban automáticamente levantado para ${jugadorObjetivo.name} (IP: ${ipJugador})`);
                            }
                            
                            // Actualizar en la base de datos si está disponible
                            if (typeof nodeDesbanearJugador === 'function') {
                                nodeDesbanearJugador(uid, `Auto-desban después de ${tiempo} minutos`)
                                    .then(() => {
                                        console.log(`✅ Auto-desban registrado en DB para ${jugadorObjetivo.name}`);
                                    })
                                    .catch((error) => {
                                        console.error(`❌ Error registrando auto-desban en DB:`, error);
                                    });
                            }
                            
                            anunciarInfo(`⏰ El ban temporal de ${jugadorObjetivo.name} ha expirado automáticamente.`);
                            
                        } catch (error) {
                            console.error(`❌ Error en desbaneo automático para ${jugadorObjetivo.name}:`, error);
                        }
                    }, tiempoMs);
                    
                    console.log(`⏰ Desbaneo automático programado para ${jugadorObjetivo.name} en ${tiempo} minutos`);
                }
                
                // 8. Registrar el baneo en la base de datos
                if (typeof nodeCrearBaneo === 'function') {
                    // Parámetros correctos: (authId, nombre, razon, admin, duracion)
                    nodeCrearBaneo(uid, jugadorObjetivo.name, razon, jugador.name, tiempo || 0)
                        .then((resultado) => {
                            console.log(`✅ Baneo registrado en DB:`, resultado);
                            console.log(`📊 DEBUG: Baneo guardado - ID: ${resultado.id}, Duración: ${tiempo || 0} min`);
                        })
                        .catch((error) => {
                            console.error(`❌ Error registrando baneo en DB:`, error);
                            console.error(`❌ DEBUG: Parámetros usados - UID: ${uid}, Nombre: ${jugadorObjetivo.name}, Razón: ${razon}, Admin: ${jugador.name}, Tiempo: ${tiempo || 0}`);
                            anunciarAdvertencia(`⚠️ Jugador baneado pero no se pudo registrar en la base de datos`);
                        });
                } else {
                    console.warn('⚠️ Función nodeCrearBaneo no disponible');
                }
                
                // 9. Enviar notificación al webhook
                enviarNotificacionBanKick("ban", jugador.name, jugadorObjetivo.name, uid, tiempo, razon, ipJugador, jugadorObjetivo.id);
                
            } catch (error) {
                anunciarError(`❌ Error al banear jugador: ${error.message}`, jugador);
                console.error(`❌ Error en comando ban:`, error);
            }
            break;

        case "unban":
        case "desban":
        case "banınıkaldır": // Comando en turco
            // COMANDO SIMPLIFICADO: Usar la misma lógica que el desbaneo automático
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ No tienes permisos para desbanear jugadores.", jugador);
                return;
            }
            
            if (!args[1]) {
                anunciarError("📝 Uso: !unban <auth_id|ID_secuencial>", jugador);
                anunciarInfo("💡 Ejemplos: !unban ABC123DEF (auth_id) o !unban 1 (desde !bans)", jugador);
                return;
            }
            
            const input = args[1];
            console.log(`🔧 UNBAN: Admin ${jugador.name} solicita desbanear: "${input}"`);
            anunciarInfo(`🔄 Procesando desbaneo para: ${input}...`, jugador);
            
            try {
                let authIdReal = input;
                let jugadorObjetivo = null;
                
                // Si el input es un número (ID secuencial del comando !bans)
                if (/^\d+$/.test(input)) {
                    const idSecuencial = parseInt(input, 10);
                    console.log(`🔧 UNBAN: Detectado ID secuencial: ${idSecuencial}`);
                    
                    if (typeof nodeObtenerBaneosActivos === 'function') {
                        const jugadoresBaneados = await nodeObtenerBaneosActivos();
                        const indice = idSecuencial - 1;
                        
                        if (indice >= 0 && indice < jugadoresBaneados.length) {
                            jugadorObjetivo = jugadoresBaneados[indice];
                            authIdReal = jugadorObjetivo.authId;
                            console.log(`✅ UNBAN: ID ${idSecuencial} mapeado a "${jugadorObjetivo.nombre}" (${authIdReal})`);
                        } else {
                            anunciarError(`❌ ID ${idSecuencial} no válido. Usa !bans para ver los IDs válidos.`, jugador);
                            return;
                        }
                    } else {
                        anunciarError(`❌ No se puede mapear ID secuencial: función de base de datos no disponible`, jugador);
                        return;
                    }
                }
                
                // Verificar que no intente desbanearse a sí mismo
                if (jugador.auth && authIdReal === jugador.auth) {
                    anunciarError(`❌ No puedes desbanearte a ti mismo`, jugador);
                    return;
                }
                
                // USAR LA MISMA LÓGICA DEL DESBANEO AUTOMÁTICO (lines 9094-9125)
                console.log(`🔧 UNBAN: Ejecutando desbaneo automático para authId: ${authIdReal}`);
                
                let exitoso = false;
                
                try {
                    // Método 1: Desbanear por authId (más confiable)
                    room.clearBan(authIdReal);
                    console.log(`✅ UNBAN: clearBan por authId exitoso`);
                    exitoso = true;
                } catch (error) {
                    console.warn(`⚠️ UNBAN: clearBan por authId falló:`, error.message);
                }
                
                // Método 2: Si tenemos info del jugador objetivo, usar su ID si está disponible
                if (jugadorObjetivo && jugadorObjetivo.playerId) {
                    try {
                        room.clearBan(jugadorObjetivo.playerId);
                        console.log(`✅ UNBAN: clearBan por playerId exitoso`);
                        exitoso = true;
                    } catch (error) {
                        console.warn(`⚠️ UNBAN: clearBan por playerId falló:`, error.message);
                    }
                }
                
                // Método 3: Si tenemos IP del jugador, desbanear por IP
                if (jugadorObjetivo && jugadorObjetivo.ip) {
                    try {
                        room.clearBan(jugadorObjetivo.ip);
                        console.log(`✅ UNBAN: clearBan por IP exitoso`);
                        exitoso = true;
                    } catch (error) {
                        console.warn(`⚠️ UNBAN: clearBan por IP falló:`, error.message);
                    }
                }
                
                // Actualizar en la base de datos si está disponible
                if (typeof nodeDesbanearJugador === 'function') {
                    try {
                        await nodeDesbanearJugador(authIdReal, `Desban manual por ${jugador.name}`);
                        console.log(`✅ UNBAN: Desban registrado en DB`);
                    } catch (dbError) {
                        console.warn(`⚠️ UNBAN: Error registrando desban en DB:`, dbError.message);
                    }
                }
                
                if (exitoso) {
                    const nombreJugador = jugadorObjetivo ? jugadorObjetivo.nombre : input;
                    anunciarExito(`✅ ${nombreJugador} ha sido desbaneado por ${jugador.name}`);
                    console.log(`✅ UNBAN: Desbaneo completado para ${nombreJugador}`);
                } else {
                    anunciarError(`❌ No se pudo desbanear "${input}". Puede que ya estuviera desbaneado.`, jugador);
                }
                
            } catch (error) {
                console.error(`❌ UNBAN: Error en comando:`, error);
                anunciarError(`❌ Error al desbanear "${input}": ${error.message}`, jugador);
            }
            break;


        case "bans":
            if (!esAdminBasico(jugador)) return;
            
            // Usar la función principal de baneos activos
            if (typeof nodeObtenerBaneosActivos === 'function') {
                nodeObtenerBaneosActivos()
                    .then((jugadores) => {
                        if (jugadores.length === 0) {
                            anunciarInfo('📋 No hay jugadores baneados actualmente.', jugador);
                        } else {
                            // ==================== PARCHE APLICADO ====================
                            // Mapear jugadores baneados con ID de selección para !unban
                            const jugadoresBaneados = jugadores.map((j, index) => {
                                // CAMBIO: En lugar de buscar jugadores baneados en la sala actual
                                // (que obviamente no están), usar el índice + 1 como ID de selección
                                const idSeleccion = index + 1;
                                
                                console.log(`🔍 DEBUG bans: Jugador baneado "${j.nombre}" (UID: ${j.uid || 'N/A'}) -> ID selección: ${idSeleccion}`);
                                
                                // Información adicional para debug
                                const infoDebug = {
                                    nombre: j.nombre,
                                    uid: j.uid || 'N/A',
                                    idSeleccion: idSeleccion,
                                    razon: j.razon || 'Sin razón',
                                    fechaBan: j.fecha_ban || j.fecha || 'Desconocida'
                                };
                                
                                console.log(`📊 DEBUG bans: Info completa [${idSeleccion}]: ${JSON.stringify(infoDebug)}`);
                                
                                // Mostrar ID de selección que funciona con !unban
                                return `${j.nombre} (ID: ${idSeleccion})`;
                            }).join(', ');
                            
                            // Agregar mensaje informativo sobre cómo usar los IDs
                            const mensajeCompleto = `🚨 Jugadores baneados: ${jugadoresBaneados}\n💡 Usa !unban <ID> para desbanear (ej: !unban 1, !unban 2, etc.)`;
                            // ==================== FIN PARCHE ====================
                            room.sendAnnouncement(mensajeCompleto, jugador.id, parseInt(COLORES.ADVERTENCIA, 16), "bold", 0);
                        }
                    })
                    .catch((error) => {
                        console.error('❌ Error obteniendo baneos activos:', error);
                        anunciarError('❌ Error obteniendo la lista de baneos activos.', jugador);
                    });
            } else {
                anunciarError('❌ Función de base de datos no disponible.', jugador);
            }
            break;

        case "clearbans":
            if (!esAdmin(jugador)) return; // Solo Admin Full o superior
            
            anunciarInfo("🔄 Iniciando limpieza masiva de baneos...", jugador);
            
            // Obtener todos los jugadores baneados activos de la nueva tabla baneos
            if (typeof nodeObtenerBaneosActivos === 'function') {
                nodeObtenerBaneosActivos()
                    .then((jugadoresBaneados) => {
                        if (jugadoresBaneados.length === 0) {
                            // No hay baneos en BD, pero puede haber desincronización con HaxBall
                            anunciarAdvertencia("📋 No hay baneos activos en la base de datos.", jugador);
                            anunciarInfo("🧹 Ejecutando limpieza completa de HaxBall para resolver posibles desincronizaciones...", jugador);
                            
                            try {
                                // Limpiar TODOS los baneos de HaxBall
                                room.clearBans();
                                console.log('✅ CLEARBANS: room.clearBans() ejecutado - Todos los baneos de HaxBall limpiados');
                                
                                // Limpiar también bloqueos IP relacionados con baneos
                                let ipLimpiadas = 0;
                                for (const [ip, bloqueo] of ipsBloqueadas.entries()) {
                                    if (bloqueo.razon && (bloqueo.razon.includes('ban') || bloqueo.razon.includes('múltiples'))) {
                                        ipsBloqueadas.delete(ip);
                                        ipLimpiadas++;
                                    }
                                }
                                
                                // Limpiar conexiones para permitir reconexión
                                conexionesPorIP.clear();
                                jugadoresPorIP.clear();
                                
                                anunciarExito(`✅ Limpieza completa de HaxBall realizada por ${jugador.name}`);
                                anunciarInfo(`🧹 Se limpiaron todos los baneos de HaxBall + ${ipLimpiadas} IP(s) bloqueadas`);
                                anunciarInfo(`💡 Esta limpieza resuelve desincronizaciones entre BD y HaxBall`);
                                
                                // Enviar notificación a Discord sobre la limpieza completa
                                enviarNotificacionClearBans(jugador.name, "completa", 0, ipLimpiadas);
                                
                            } catch (error) {
                                console.error('❌ Error ejecutando room.clearBans():', error);
                                anunciarError('❌ Error ejecutando limpieza completa de HaxBall', jugador);
                            }
                            return;
                        }
                        
                        anunciarInfo(`📊 Encontrados ${jugadoresBaneados.length} jugadores baneados. Iniciando desbaneo masivo...`, jugador);
                        
                        let procesados = 0;
                        let exitosos = 0;
                        let errores = 0;
                        
                        // Procesar cada jugador baneado
                        jugadoresBaneados.forEach((jugadorBaneado, index) => {
                            const uid = jugadorBaneado.uid;
                            
                            if (!uid) {
                                console.warn(`⚠️ CLEARBANS: Jugador ${jugadorBaneado.nombre} no tiene UID, saltando...`);
                                procesados++;
                                errores++;
                                return;
                            }
                            
                            // Desbanear en HaxBall
                            try {
                                room.clearBan(uid);
                                console.log(`✅ CLEARBANS: room.clearBan(${uid}) ejecutado para ${jugadorBaneado.nombre}`);
                                
                                // Actualizar en base de datos
                                if (typeof nodeDesbanearJugador === 'function') {
                                    nodeDesbanearJugador(uid)
                                        .then((resultado) => {
                                            console.log(`✅ CLEARBANS: ${jugadorBaneado.nombre} desbaneado en BD exitosamente`);
                                            exitosos++;
                                        })
                                        .catch((error) => {
                                            console.error(`❌ CLEARBANS: Error actualizando BD para ${jugadorBaneado.nombre}:`, error);
                                            errores++;
                                        })
                                        .finally(() => {
                                            procesados++;
                                            
                                            // Cuando termine de procesar todos
                                            if (procesados === jugadoresBaneados.length) {
                                                anunciarExito(`✅ Limpieza masiva completada por ${jugador.name}`);
                                                anunciarInfo(`📊 Resultados: ${exitosos} exitosos, ${errores} errores de ${jugadoresBaneados.length} total`);
                                                
                                                // Limpiar también bloqueos IP relacionados con baneos
                                                let ipLimpiadas = 0;
                                                for (const [ip, bloqueo] of ipsBloqueadas.entries()) {
                                                    if (bloqueo.razon && (bloqueo.razon.includes('ban') || bloqueo.razon.includes('múltiples'))) {
                                                        ipsBloqueadas.delete(ip);
                                                        ipLimpiadas++;
                                                    }
                                                }
                                                
                                                // Limpiar conexiones para permitir reconexión
                                                conexionesPorIP.clear();
                                                jugadoresPorIP.clear();
                                                
                                                if (ipLimpiadas > 0) {
                                                    anunciarInfo(`🧹 Limpiadas ${ipLimpiadas} IP(s) bloqueadas y conexiones reiniciadas`);
                                                }
                                                
                                                console.log(`✅ CLEARBANS COMPLETO: ${exitosos}/${jugadoresBaneados.length} exitosos, ${ipLimpiadas} IPs limpiadas`);
                                                
                                                // Enviar notificación a Discord sobre la limpieza masiva
                                                enviarNotificacionClearBans(jugador.name, "masiva", exitosos, ipLimpiadas);
                                            }
                                        });
                                } else {
                                    // Si no hay función de BD, al menos contar como procesado
                                    exitosos++;
                                    procesados++;
                                    
                                    if (procesados === jugadoresBaneados.length) {
                                        anunciarExito(`✅ Limpieza masiva completada (solo HaxBall) por ${jugador.name}`);
                                        anunciarAdvertencia(`⚠️ Los registros en BD no se pudieron actualizar`);
                                        
                                        // Enviar notificación a Discord sobre la limpieza masiva (solo HaxBall)
                                        enviarNotificacionClearBans(jugador.name, "masiva_solo_haxball", exitosos, 0);
                                    }
                                }
                                
                            } catch (error) {
                                console.error(`❌ CLEARBANS: Error en room.clearBan para ${jugadorBaneado.nombre} (${uid}):`, error);
                                errores++;
                                procesados++;
                            }
                        });
                        
                    })
                    .catch((error) => {
                        console.error('❌ Error obteniendo jugadores baneados para clearbans:', error);
                        anunciarError('❌ Error obteniendo la lista de jugadores baneados.', jugador);
                    });
            } else {
                // Método alternativo usando la función de 24h si no está disponible la principal
                anunciarAdvertencia('⚠️ Función principal no disponible, usando método alternativo...', jugador);
                
                if (typeof nodeObtenerJugadoresBaneados24h === 'function') {
                    nodeObtenerJugadoresBaneados24h()
                        .then((jugadores24h) => {
                            if (jugadores24h.length === 0) {
                                anunciarInfo('📋 No hay jugadores baneados en las últimas 24h para limpiar.', jugador);
                                return;
                            }
                            
                            anunciarInfo(`📊 Limpiando ${jugadores24h.length} jugadores baneados en las últimas 24h...`, jugador);
                            
                            let exitosos = 0;
                            jugadores24h.forEach(j => {
                                if (j.uid) {
                                    try {
                                        room.clearBan(j.uid);
                                        exitosos++;
                                        console.log(`✅ CLEARBANS ALT: Desbaneado ${j.nombre} (${j.uid})`);
                                    } catch (error) {
                                        console.error(`❌ CLEARBANS ALT: Error con ${j.nombre}:`, error);
                                    }
                                }
                            });
                            
                            anunciarExito(`✅ Limpieza alternativa completada: ${exitosos}/${jugadores24h.length} procesados`);
                            anunciarAdvertencia('⚠️ Solo se limpiaron baneos de las últimas 24h. Para limpieza completa, contactar desarrollador.');
                            
                            // Enviar notificación a Discord sobre la limpieza alternativa
                            enviarNotificacionClearBans(jugador.name, "alternativa_24h", exitosos, 0);
                        })
                        .catch((error) => {
                            console.error('❌ Error en clearbans alternativo:', error);
                            anunciarError('❌ Error en método alternativo de limpieza.', jugador);
                        });
                } else {
                    anunciarError('❌ No hay funciones de base de datos disponibles para clearbans.', jugador);
                    anunciarInfo('💡 Para desbanear jugadores específicos, usa: !unban <UID>', jugador);
                    anunciarInfo('💡 Para obtener UIDs, usa: !banlist o !uid', jugador);
                }
            }
            break;
            
        case "uid":
            if (!esAdminBasico(jugador)) return;
            if (args[1]) {
                // Buscar UID de un jugador específico
                const nombreBuscado = args.slice(1).join(" ");
                const jugadorObjetivo = obtenerJugadorPorNombre(nombreBuscado);
                if (jugadorObjetivo) {
                    const uid = obtenerUID(jugadorObjetivo);
                    if (uid) {
                        room.sendAnnouncement(`🆔 UID de ${jugadorObjetivo.name}: ${uid}`, jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                        room.sendAnnouncement(`💡 Para desbanear usa: !unban ${uid}`, jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                    } else {
                        room.sendAnnouncement(`⚠️ El jugador ${jugadorObjetivo.name} no tiene UID disponible`, jugador.id, parseInt(COLORES.ADVERTENCIA, 16), "normal", 0);
                        room.sendAnnouncement(`📋 Información del jugador:`, jugador.id, parseInt(COLORES.INFO, 16), "bold", 0);
                        room.sendAnnouncement(`   • ID: ${jugadorObjetivo.id}`, jugador.id, parseInt(COLORES.GRIS, 16), "normal", 0);
                        room.sendAnnouncement(`   • Nombre: ${jugadorObjetivo.name}`, jugador.id, parseInt(COLORES.GRIS, 16), "normal", 0);
                        room.sendAnnouncement(`   • Equipo: ${jugadorObjetivo.team === 1 ? '🔴 Rojo' : jugadorObjetivo.team === 2 ? '🔵 Azul' : '⚪ Espectador'}`, jugador.id, parseInt(COLORES.GRIS, 16), "normal", 0);
                        room.sendAnnouncement(`   • Admin: ${jugadorObjetivo.admin ? '✅ Sí' : '❌ No'}`, jugador.id, parseInt(COLORES.GRIS, 16), "normal", 0);
                        room.sendAnnouncement(`💡 Sin UID no se puede usar !unban. Usa !kick o !ban por nombre`, jugador.id, parseInt(COLORES.ADVERTENCIA, 16), "normal", 0);
                    }
                } else {
                    anunciarError(`❌ Jugador "${nombreBuscado}" no encontrado`, jugador);
                }
            } else {
                // Mostrar UIDs de todos los jugadores conectados
                const jugadores = obtenerJugadoresSinHost();
                if (jugadores.length > 0) {
                    room.sendAnnouncement("🆔 LISTA DE UIDs DE JUGADORES CONECTADOS:", jugador.id, parseInt(COLORES.INFO, 16), "bold", 0);
                    room.sendAnnouncement("══════════════════════════════════════════════════════════", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                    
                    let jugadoresConUID = 0;
                    let jugadoresSinUID = 0;
                    
                    jugadores.forEach(j => {
                        const uid = obtenerUID(j);
                        const equipoTexto = j.team === 1 ? "🔴" : j.team === 2 ? "🔵" : "⚪";
                        if (uid) {
                            room.sendAnnouncement(`${equipoTexto} ${j.name}: ${uid}`, jugador.id, parseInt(COLORES.GRIS, 16), "normal", 0);
                            jugadoresConUID++;
                        } else {
                            room.sendAnnouncement(`${equipoTexto} ${j.name}: ⚠️ SIN UID (ID: ${j.id})`, jugador.id, parseInt(COLORES.ADVERTENCIA, 16), "normal", 0);
                            jugadoresSinUID++;
                        }
                    });
                    
                    room.sendAnnouncement("══════════════════════════════════════════════════════════", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                    room.sendAnnouncement(`📊 Resumen: ${jugadoresConUID} con UID, ${jugadoresSinUID} sin UID`, jugador.id, parseInt(COLORES.INFO, 16), "bold", 0);
                    room.sendAnnouncement("💡 Uso: !uid <nombre_jugador> - para UID específico", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                    room.sendAnnouncement("💡 Uso: !unban <UID> - para desbanear (solo con UID)", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                    room.sendAnnouncement("💡 Uso: !kick <nombre> - para expulsar sin UID", jugador.id, parseInt(COLORES.INFO, 16), "normal", 0);
                } else {
                    anunciarError("❌ No hay jugadores conectados para mostrar UIDs", jugador);
                }
            }
            break;
            
        case "ig":
        case "instagram":
            room.sendAnnouncement("━━━━━━━━━┓ LNB 🔥 Instagram: 'https://www.instagram.com/lnbhaxball/' ┏━━━━━━━━━", jugador.id, parseInt(CELESTE_LNB, 16), "bold", 0);
            room.sendAnnouncement("📲 Seguinos para ver clips, historias, resultados y lo mejor de cada jornada", jugador.id, parseInt(CELESTE_LNB, 16), "normal", 0);
            break;
            
        case "tiktok":
        case "tt":
            room.sendAnnouncement("━━━━━━━━━━━━━┓ LNB 🔥 TikTok: 'https://www.tiktok.com/@lnbhaxball' ┏━━━━━━━━━━━━━", jugador.id, parseInt(CELESTE_LNB, 16), "bold", 0);
            room.sendAnnouncement("🔥 Mirá los mejores goles, fails y momentos virales... ¡Seguinos y sumate al show!", jugador.id, parseInt(CELESTE_LNB, 16), "normal", 0);
            break;
            
        case "youtube":
        case "yt":
            room.sendAnnouncement("━━━━━━━━━┓ LNB 🔥 Youtube: 'https://youtube.com/liganacionaldebigger' ┏━━━━━━━━━", jugador.id, parseInt(CELESTE_LNB, 16), "bold", 0);
            room.sendAnnouncement("📲 Seguinos y activá la campanita para no perderte partidos, goles y momentos épicos de la liga.", jugador.id, parseInt(CELESTE_LNB, 16), "normal", 0);
            break;
            
        // ==================== SISTEMA VIP COMPLETO ====================
        case "givevip":
        case "addvip":
        case "giveultravip":
        case "addultravip":
        case "removevip":
        case "delvip":
        case "viplist":
        case "listvips":
        case "vipinfo":
        case "checkvip":
        case "vipstats":
        case "vipreport":
        case "vipcleanup":
        case "viphelp":
        case "mystatus":
        case "vipstatus":
        case "vipbenefits":
        case "mystats":
        case "myrecord":
        case "playtime":
        case "customcolor":
        case "effect":
        case "premium":
        case "exclusive":
            // Usar el sistema VIP completo si está disponible
            if (vipBot) {
                try {
                    const vipResponse = await vipBot.handlePlayerMessage(jugador.name, mensaje, jugador.auth);
                    if (vipResponse) {
                        // Enviar respuesta del sistema VIP al jugador
                        const lineas = vipResponse.split('\n');
                        for (const linea of lineas) {
                            if (linea.trim()) {
                                room.sendAnnouncement(linea.trim(), jugador.id, parseInt("FFD700", 16), "normal", 0);
                            }
                        }
                        return;
                    }
                } catch (error) {
                    console.error('❌ Error en comando VIP:', error);
                    anunciarError("⚠️ Error procesando comando VIP. Contacta un administrador.", jugador);
                    return;
                }
            }
            
            
            break;
            
        case "activarvip":
        case "desactivarvip":
            // Mantener comandos básicos para compatibilidad
            if (comando === "activarvip") {
                if (!esSuperAdmin(jugador)) {
                    anunciarError("❌ Solo los Super Admins pueden activar VIP", jugador);
                    return;
                }
                
                if (args[1]) {
                    const idJugador = args[1];
                    
                    // Verificar que sea un ID válido (debe empezar con #)
                    if (!idJugador.startsWith('#')) {
                        anunciarError("📝 Uso: !activarvip #ID\n💡 Ejemplo: !activarvip #3\n⚠️ Solo se permiten IDs de jugadores (#1, #2, #3, etc.)", jugador);
                        return;
                    }
                    
                    const jugadorObjetivo = obtenerJugadorPorID(idJugador.substring(1));
                    
                    if (jugadorObjetivo) {
                        if (jugadoresVIP.has(jugadorObjetivo.id)) {
                            anunciarError(`❌ ${jugadorObjetivo.name} ya tiene VIP activo`, jugador);
                            return;
                        }
                        
                        // Activar VIP básico
                        activarVIPJugador(jugadorObjetivo.id, jugadorObjetivo.name);
                        anunciarExito(`👑 VIP básico activado para ${jugadorObjetivo.name} por ${jugador.name}`);
                        room.sendAnnouncement(
                            "👑 ¡VIP básico activado! Para VIP completo usa !givevip",
                            jugadorObjetivo.id,
                            parseInt("FFD700", 16),
                            "bold",
                            1
                        );
                    } else {
                        anunciarError("❌ Jugador no encontrado. Usa # para ver lista de IDs", jugador);
                    }
                } else {
                    anunciarError("📝 Uso: !activarvip #ID\n💡 Ejemplo: !activarvip #3\n⚠️ Solo se permiten IDs de jugadores (#1, #2, #3, etc.)", jugador);
                }
            } else if (comando === "desactivarvip") {
                if (!esSuperAdmin(jugador)) {
                    anunciarError("❌ Solo los Super Admins pueden desactivar VIP", jugador);
                    return;
                }
                
                if (args[1]) {
                    const idJugador = args[1];
                    
                    // Verificar que sea un ID válido (debe empezar con #)
                    if (!idJugador.startsWith('#')) {
                        anunciarError("📝 Uso: !desactivarvip #ID\n💡 Ejemplo: !desactivarvip #3\n⚠️ Solo se permiten IDs de jugadores (#1, #2, #3, etc.)", jugador);
                        return;
                    }
                    
                    const jugadorObjetivo = obtenerJugadorPorID(idJugador.substring(1));
                    
                    if (jugadorObjetivo) {
                        if (!jugadoresVIP.has(jugadorObjetivo.id)) {
                            anunciarError(`❌ ${jugadorObjetivo.name} no tiene VIP activo`, jugador);
                            return;
                        }
                        
                        // Desactivar VIP
                        desactivarVIPJugador(jugadorObjetivo.id);
                        anunciarAdvertencia(`👑 VIP desactivado para ${jugadorObjetivo.name} por ${jugador.name}`);
                        room.sendAnnouncement(
                            "👑 Tu VIP ha sido desactivado",
                            jugadorObjetivo.id,
                            parseInt("FFA500", 16),
                            "bold",
                            1
                        );
                    } else {
                        anunciarError("❌ Jugador no encontrado. Usa # para ver lista de IDs", jugador);
                    }
                } else {
                    anunciarError("📝 Uso: !desactivarvip #ID\n💡 Ejemplo: !desactivarvip #3\n⚠️ Solo se permiten IDs de jugadores (#1, #2, #3, etc.)", jugador);
                }
            }
            break;
            
        // ==================== COMANDOS DE BANEOS OFFLINE ====================
        case "banoffline":
        case "offlineban":
            // Banear jugador aunque no esté conectado
            if (!esSuperAdmin(jugador)) {
                anunciarError("❌ Solo los Super Admins pueden banear offline", jugador);
                return;
            }
            
            if (args.length < 3) {
                anunciarError("📝 Uso: !banoffline <jugador|auth_id> <duracion_minutos> <razón>", jugador);
                anunciarError("💡 Ejemplo: !banoffline Carlos 60 Insultos", jugador);
                anunciarError("💡 Duración 0 = permanente", jugador);
                return;
            }
            
            await procesarBaneoOffline(jugador, args);
            break;
            
        case "findplayer":
        case "buscarjugador":
            // Buscar jugador en historial para banear offline
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ Solo los admins pueden usar este comando", jugador);
                return;
            }
            
            if (args.length < 2) {
                anunciarError("📝 Uso: !findplayer <nombre|auth_id>", jugador);
                anunciarError("💡 Ejemplo: !findplayer Carlos", jugador);
                return;
            }
            
            await procesarBusquedaJugador(jugador, args[1]);
            break;
            
        case "banstatus":
        case "checkban":
            // Verificar estado de baneo de un jugador
            if (!esAdminBasico(jugador)) {
                anunciarError("❌ Solo los admins pueden usar este comando", jugador);
                return;
            }
            
            if (args.length < 2) {
                anunciarError("📝 Uso: !banstatus <jugador|auth_id>", jugador);
                return;
            }
            
            await procesarEstadoBaneo(jugador, args[1]);
            break;
            
        default:
anunciarError("Comando no reconocido. Usa !ayuda para ver comandos disponibles", jugador);
    }
}

function esAdmin(jugador) {
    const rolJugador = jugadoresConRoles.get(jugador.id);
    return rolJugador && (ROLES[rolJugador.role]?.level || 0) >= ROLES.ADMIN_FULL.level;
}

function esSuperAdmin(jugador) {
    const rolJugador = jugadoresConRoles.get(jugador.id);
    return rolJugador && rolJugador.role === "SUPER_ADMIN";
}

function esAdminBasico(jugador) {
    const rolJugador = jugadoresConRoles.get(jugador.id);
    return rolJugador && (ROLES[rolJugador.role]?.level || 0) >= ROLES.ADMIN_BASICO.level;
}

// FUNCIÓN AUXILIAR PARA VERIFICAR SI UN AUTH ES VÁLIDO
function tieneAuth(jugador) {
    return jugador && 
           typeof jugador.auth === 'string' && 
           jugador.auth.length > 0 && 
           jugador.auth !== 'null' && 
           jugador.auth !== 'undefined';
}

// ==================== FUNCIÓN DE VERIFICACIÓN Y RESTAURACIÓN DE ROLES PERSISTENTES MEJORADA ====================
/**
 * Verifica si un jugador tiene un rol persistente guardado y lo restaura en la sesión actual
 * Incluye migración automática desde sistema de fallback por nombre hacia authID
 * @param {Object} jugador - Objeto jugador con propiedades id, name, auth
 */
async function verificarYRestaurarRol(jugador) {
    try {
        console.log(`🔍 [DEBUG AUTH] Verificando rol para jugador: ${jugador.name}`);
        console.log(`🔍 [DEBUG AUTH] - Tipo auth: ${typeof jugador.auth}`);
        console.log(`🔍 [DEBUG AUTH] - Valor auth: "${jugador.auth}"`);
        console.log(`🔍 [DEBUG AUTH] - Auth válido: ${tieneAuth(jugador)}`);
        
        // Verificar si tenemos acceso a las funciones expuestas desde Node con retry logic
        if (typeof nodeGetRole !== 'function') {
            console.log(`⚠️ nodeGetRole no disponible inmediatamente para ${jugador.name}, intentando después de delay...`);
            
            // Retry después de un pequeño delay - las funciones pueden no estar listas aún
            return new Promise((resolve) => {
                setTimeout(async () => {
                    try {
                        if (typeof nodeGetRole === 'function') {
                            console.log(`✅ nodeGetRole ahora disponible para ${jugador.name}, reintentando...`);
                            const resultado = await verificarYRestaurarRol(jugador);
                            resolve(resultado);
                        } else {
                            console.log(`❌ nodeGetRole sigue no disponible después del delay para ${jugador.name}`);
                            resolve(false);
                        }
                    } catch (error) {
                        console.error(`❌ Error en retry de verificarYRestaurarRol:`, error);
                        resolve(false);
                    }
                }, 1000); // 1 segundo de delay
            });
        }
        
        // Verificar si el jugador tiene auth válido
        const tieneAuthValido = tieneAuth(jugador);
        const authID = tieneAuthValido ? jugador.auth : null;
        
        console.log(`🔍 [DEBUG AUTH] AuthID final para búsqueda: ${authID}`);
        
        let rolGuardado = null;
        let migrationPerformed = false;
        let restorationMethod = 'NONE';
        
        // PASO 1: Buscar por authID si está disponible
        if (authID) {
            rolGuardado = await nodeGetRole(authID);
            console.log(`🔍 [DEBUG AUTH] Búsqueda por auth "${authID}": ${rolGuardado ? 'ENCONTRADO' : 'NO ENCONTRADO'}`);
            if (rolGuardado) {
                restorationMethod = 'AUTH_ID';
            }
        }
        
        // PASO 2: Si no se encontró por auth pero el jugador tiene auth válido, buscar por nombre (fallback)
        if (!rolGuardado && authID) {
            console.log(`🔍 [DEBUG AUTH] Búsqueda fallback por nombre: "${jugador.name}"`);
            const rolPorNombre = await nodeGetRole(jugador.name);
            
            if (rolPorNombre) {
                console.log(`🔄 [MIGRATION] Rol encontrado por nombre, iniciando migración a authID`);
                console.log(`🔄 [MIGRATION] - Nombre: ${jugador.name} -> AuthID: ${authID}`);
                console.log(`🔄 [MIGRATION] - Rol: ${rolPorNombre.role}`);
                
                // Migrar de nombre a authID
                        const resultadoMigracion = await nodeAssignRole(
                            authID,
                            rolPorNombre.role,
                            'MIGRATION_AUTO',
                            jugador.name
                        );
                
                if (resultadoMigracion?.ok) {
                    // Eliminar el rol guardado por nombre
                    rolesPersistentSystem.removeRole(jugador.name);
                    rolGuardado = rolPorNombre;
                    migrationPerformed = true;
                    restorationMethod = 'MIGRATED_FROM_NAME';
                    console.log(`✅ [MIGRATION] Migración completada exitosamente`);
                } else {
                    console.error(`❌ [MIGRATION] Error en migración:`, resultadoMigracion);
                }
            }
        }
        
        // PASO 3: Si no hay auth válido, intentar búsqueda por nombre (solo lectura, sin migración)
        if (!rolGuardado && !authID) {
            console.log(`🔍 [DEBUG AUTH] Búsqueda por nombre sin auth válido: "${jugador.name}"`);
            const rolPorNombre = await nodeGetRole(jugador.name);
            
            if (rolPorNombre) {
                rolGuardado = rolPorNombre;
                restorationMethod = 'NAME_FALLBACK';
                console.log(`⚠️ [RESTORE] Rol encontrado por nombre, pero sin auth válido para migrar`);
            }
        }
        
        // PASO 4: Si se encontró un rol, aplicarlo
        if (rolGuardado) {
            console.log(`✅ [RESTORE] Rol encontrado para ${jugador.name}: ${rolGuardado.role} (método: ${restorationMethod})`);
            if (migrationPerformed) {
                console.log(`✅ [RESTORE] Rol migrado de sistema fallback (nombre) a authID`);
            }
            
            // Verificar que el rol existe en el sistema actual
            if (!ROLES[rolGuardado.role]) {
                console.error(`❌ [RESTORE] Rol guardado '${rolGuardado.role}' no existe en ROLES actual - saltando`);
                return false;
            }
            
            // Aplicar rol a la sesión actual
            const rolData = {
                role: rolGuardado.role,
                assignedBy: migrationPerformed ? 'SISTEMA_MIGRATION_RESTORE' : rolGuardado.assignedBy || 'SISTEMA_AUTO_RESTORE',
                assignedAt: rolGuardado.assignedAt || Date.now(),
                restored: true,
                timestamp: Date.now(),
                migrated: migrationPerformed,
                restorationMethod: restorationMethod
            };
            
            // Asignar rol en el mapa de sesión actual
            jugadoresConRoles.set(jugador.id, rolData);
            
            // Actualizar último acceso en el sistema persistente si tenemos authID
            if (authID) {
                if (rolesPersistentSystem) { rolesPersistentSystem.updateLastSeen(authID, jugador.name); }
            }
            
            const rolInfo = ROLES[rolGuardado.role];
            
            // CONFIGURACIÓN DE ADMIN DE SALA: Solo SUPER_ADMIN tiene admin real
            const esRolAdmin = ['SUPER_ADMIN', 'ADMIN_FULL', 'ADMIN_BASICO'].includes(rolGuardado.role);
            
            if (esRolAdmin) {
                console.log(`👑 [RESTORE] Procesando permisos para ${jugador.name} con rol ${rolGuardado.role}`);
                
                // DELAY IMPORTANTE: aplicar permisos después de un pequeño delay
                setTimeout(() => {
                    try {
                        if (rolGuardado.role === 'SUPER_ADMIN') {
                            // Solo SUPER_ADMIN obtiene admin de sala real
                            room.setPlayerAdmin(jugador.id, true);
                            adminActual = jugador;
                            console.log(`👑 [RESTORE] Admin de sala otorgado a SUPER_ADMIN: ${jugador.name}`);
                        } else {
                            // ADMIN_FULL y ADMIN_BASICO solo obtienen funciones internas
                            adminActual = jugador; // Funciones de admin pero no admin de sala
                            console.log(`🛡️ [RESTORE] Funciones de admin restauradas (sin admin de sala) para ${rolGuardado.role}: ${jugador.name}`);
                        }
                        
                        // Mensaje de bienvenida para admin - COMENTADO para evitar duplicación
                        /*
                        let mensajeBienvenida;
                        if (migrationPerformed) {
                            mensajeBienvenida = `👑 🔄 Bienvenido de vuelta, ${rolInfo.nombre} ${jugador.name}! (Sistema migrado)`;
                        } else if (restorationMethod === 'NAME_FALLBACK') {
                            mensajeBienvenida = `👑 ⚠️ Bienvenido de vuelta, ${rolInfo.nombre} ${jugador.name}! (Requiere login para persistencia)`;
                        } else {
                            mensajeBienvenida = `👑 Bienvenido de vuelta, ${rolInfo.nombre} ${jugador.name}!`;
                        }
                            
                        anunciarGeneral(mensajeBienvenida, COLORES.DORADO, "bold");
                        */
                        
                        if (restorationMethod === 'NAME_FALLBACK') {
                            setTimeout(() => {
                                room.sendAnnouncement(
                                    "⚠️ Para hacer tu rol completamente persistente, inicia sesión en haxball.com",
                                    jugador.id,
                                    parseInt(COLORES.ADVERTENCIA, 16),
                                    "normal",
                                    0
                                );
                            }, 2000);
                        }
                        
                    } catch (error) {
                        console.error(`❌ [RESTORE] Error aplicando admin para ${jugador.name}:`, error);
                    }
                }, 500); // 500ms de delay
            } else {
                console.log(`ℹ️ [RESTORE] Rol ${rolGuardado.role} no requiere permisos de admin`);
                
                // Mensaje de bienvenida para roles no-admin - COMENTADO para evitar duplicación
                /*
                let mensajeBienvenida;
                if (migrationPerformed) {
                    mensajeBienvenida = `🎉 🔄 ¡Bienvenido de vuelta! Tu rol de ${rolInfo.nombre} ha sido restaurado (sistema migrado).`;
                } else if (restorationMethod === 'NAME_FALLBACK') {
                    mensajeBienvenida = `🎉 ⚠️ ¡Bienvenido de vuelta! Tu rol de ${rolInfo.nombre} ha sido restaurado.`;
                } else {
                    mensajeBienvenida = `🎉 ¡Bienvenido de vuelta! Tu rol de ${rolInfo.nombre} ha sido restaurado.`;
                }
                
                room.sendAnnouncement(
                    mensajeBienvenida,
                    jugador.id,
                    parseInt(rolInfo.color, 16),
                    "bold",
                    1
                );
                */
                
                if (restorationMethod === 'NAME_FALLBACK') {
                    setTimeout(() => {
                        room.sendAnnouncement(
                            "⚠️ Para hacer tu rol completamente persistente, inicia sesión en haxball.com",
                            jugador.id,
                            parseInt(COLORES.ADVERTENCIA, 16),
                            "normal",
                            0
                        );
                    }, 2000);
                }
            }
            
            // DESACTIVADO: Los admins ahora pueden elegir libremente su avatar de ficha
            // No se fuerzan avatares o nombres automáticamente
            // setTimeout(() => {
            //     actualizarNombreConRol(jugador);
            // }, 1000);
            
            console.log(`🎯 [RESTORE] Rol ${rolGuardado.role} restaurado exitosamente para ${jugador.name}`);
            
            // Log de éxito extendido
            console.log(`✅ [RESTORE SUCCESS] Detalles completos:`);
            console.log(`   - Jugador: ${jugador.name}`);
            console.log(`   - Auth: ${authID || 'NO_AUTH'}`);
            console.log(`   - Rol: ${rolGuardado.role}`);
            console.log(`   - Método: ${restorationMethod}`);
            console.log(`   - Migración: ${migrationPerformed ? 'SÍ' : 'NO'}`);
            console.log(`   - Admin aplicado: ${esRolAdmin ? 'SÍ' : 'NO'}`);
            
            return true;
            
        } else {
            // No hay rol guardado
            const motivoSinRol = !authID ? 'sin auth válido' : 'no encontrado en sistema';
            console.log(`ℹ️ [RESTORE] No hay rol guardado para ${jugador.name} (${motivoSinRol})`);
            
            if (!authID) {
                console.log(`ℹ️ [RESTORE] El jugador ${jugador.name} necesita auth válido para roles persistentes`);
            }
            
            return false;
        }
        
    } catch (error) {
        console.error(`❌ [RESTORE ERROR] Error verificando rol para ${jugador?.name}:`, error);
        console.error(`❌ [RESTORE ERROR] Stack trace:`, error.stack);
        return false;
    }
}

function mostrarColores(jugador) {
    const colores = [
       "📋 CÓDIGOS DE COLORES:",
        "dd2 - Camiseta Azul DD2",
       "dd - Camiseta oficial LNB",
        "bov - Camiseta Bolívar titular",
        "bov1 - Camiseta Bolívar suplente",
        "bov2 - Camiseta Bolívar alternativa",
        "adb - Camiseta The Strongest",
        "realMadrid - Camiseta Real Madrid (España)",
        "barcelona - Camiseta FC Barcelona (España)",
        "betis - Camiseta Real Betis (España)",
        "atleticoMadrid - Camiseta Atlético de Madrid (España)",
        "manchesterUnited - Camiseta Manchester United (Inglaterra)",
        "liverpool - Camiseta Liverpool (Inglaterra)",
        "chelsea - Camiseta Chelsea (Inglaterra)",
        "psg - Camiseta Paris Saint-Germain (Francia)",
        "marseille - Camiseta Olympique de Marseille (Francia)",
        "lyon - Camiseta Olympique Lyonnais (Francia)",
        "juventus - Camiseta Juventus (Italia)",
        "milan - Camiseta AC Milan (Italia)",
        "inter - Camiseta Inter de Milán (Italia)",
        "bayern - Camiseta Bayern Múnich (Alemania)",
        "dortmund - Camiseta Borussia Dortmund (Alemania)",
        "leipzig - Camiseta RB Leipzig (Alemania)",
        "flamengo - Camiseta Flamengo (Brasil)",
        "palmeiras - Camiseta Palmeiras (Brasil)",
        "corinthians - Camiseta Corinthians (Brasil)",
        "argentina - Camiseta Selección Argentina",
        "brasil - Camiseta Selección Brasil",
        "alemania - Camiseta Selección Alemania",
        "nacional - Camiseta Nacional (Uruguay)",
        "penarol - Camiseta Peñarol (Uruguay)",
        "defensorSporting - Camiseta Defensor Sporting (Uruguay)",
        "bocaJuniors - Camiseta Boca Juniors (Argentina)",
        "riverPlate - Camiseta River Plate (Argentina)",
        "independiente - Camiseta Independiente (Argentina)",
        "racing - Camiseta Racing Club (Argentina)",
        "sanLorenzo - Camiseta San Lorenzo (Argentina)",
        "newells - Camiseta Newell's Old Boys (Argentina)",
        "rosarioCentral - Camiseta Rosario Central (Argentina)",
        "pfc - Camiseta PFC titular",
        "pfc2 - Camiseta PFC alternativa"
];
    
    colores.forEach(color => {
        room.sendAnnouncement(color, jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
    });
}

function asignarColor(equipo, codigo, jugador) {
    if (!jugador) {
        // Error: jugador no definido en asignarColor
        return;
    }
    
    const team = jugador.team;

    if ((equipo.toLowerCase() === "red" && team !== 1) || (equipo.toLowerCase() === "blue" && team !== 2)) {
        anunciarError("No puedes cambiar la camiseta del equipo rival", jugador);
        return;
    }

    if (team === 0) {
        anunciarError("Uso: !colors red|blue código", jugador);
        return;
    }
    
    // Verificar si el otro equipo ya está usando la misma camiseta (excepto para administradores)
    if (!esAdminBasico(jugador)) {
        const camisetaEquipoContrario = team === 1 ? camisetaActualBlue : camisetaActualRed;
        const equipoContrarioNombre = team === 1 ? "Azul" : "Rojo";
        
        if (camisetaEquipoContrario && camisetaEquipoContrario.toLowerCase() === codigo.toLowerCase()) {
            anunciarError(`❌ El equipo ${equipoContrarioNombre} ya está usando la camiseta "${codigo.toUpperCase()}". Elige otra camiseta.`, jugador);
            return;
        }
    }
    
    // Verificar si ya se alcanzó el máximo de cambios para este equipo (excepto para administradores)
    const cambiosEquipo = team === 1 ? cambiosCamisetaRed : cambiosCamisetaBlue;
    if (cambiosEquipo >= maxCambiosCamiseta && !esAdminBasico(jugador)) {
        const equipoNombre = team === 1 ? "Rojo" : "Azul";
        anunciarError(`❌ El equipo ${equipoNombre} ha alcanzado el máximo de cambios de camiseta para este partido (${cambiosEquipo}/${maxCambiosCamiseta})`, jugador);
        return;
    }
    
    const colores = {
        realMadrid: {
            textColor: "000000",
            colors: ["FFFFFF", "FFFFFF", "FFFFFF"]
        },
        
        barcelona: {
            angle: 90,
            textColor: "FFFFFF",
            colors: ["A50044", "004D98", "A50044"]
        },
        
        atleticoMadrid: {
            angle: 90,
            textColor: "FFFFFF",
            colors: ["D50000", "FFFFFF", "D50000"]
        },

        nacional: {
            angle: 0,
            textColor: "000000",
            colors: ["FFFFFF", "FFFFFF", "0000FF"]
        },
        
        penarol: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["FFD100", "FFD100", "000000"]
        },

        defensorSporting: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["5A2D82", "5A2D82", "FFFFFF"]
        },

        manchesterUnited: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["DA291C", "DA291C", "000000"]
        },
        
        liverpool: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["C8102E", "C8102E", "FFFFFF"]
        },

        chelsea: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["034694", "034694", "FFFFFF"]
        },

        flamengo: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["000000", "D50000", "000000"]
        },

        palmeiras: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["00AEEF", "00AEEF", "FFFFFF"]
        },

        pfc: {
            angle: 90,
            textColor: "000000",
            colors: ["FF90DA", "FF88DA", "FF80DA"]
        },

        pfc2: {
            angle: 120,
            textColor: "F954FF",
            colors: ["3D3D3D", "383838", "2E2E2E"]
        },

        argentina: {
            angle: 0,
            textColor: "000000",
            colors: ["FFFFFF", "FFFFFF", "000000"]
        },

        independiente: {
            colors: ["DA291C", "DA291C", "FFFFFF"],
            textColor: "FFFFFF",
            angle: 0,
        },

        bocaJuniors: {
            angle: 270,
            textColor: "FFFFFF",
            colors: ["081F92", "FFCC00", "081F92"]
        },

        newells: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["D50000", "000000", "D50000"]
        },

        rosarioCentral: {
            angle: 90,
            textColor: "000000",
            colors: ["002664", "FFD100", "002664"]
        },

        sanLorenzo: {
            angle: 90,
            textColor: "FFFFFF",
            colors: ["112E8A", "A50044", "112E8A"]
        },

        betis: {
            angle: 90,
            textColor: "007A33",
            colors: ["007A33", "FFFFFF", "007A33"]
        },

        bayern: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["DC052D", "DC052D", "FFFFFF"]
        },


        dortmund: {
            angle: 0,
            textColor: "000000",
            colors: ["FDE100", "FDE100", "000000"]
        },

        leipzig: {
            angle: 0,
            textColor: "D50000",
            colors: ["FFFFFF", "D50000", "FFFFFF"]
        },

        milan: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["D50000", "000000", "D50000"]
        },

        inter: {
            angle: 90,
            textColor: "FFFFFF",
            colors: ["0055A4", "000000", "0055A4"]
        },

        psg: {
            angle: 90,
            textColor: "FF0000",
            colors: ["004170", "FF0000", "004170"]
        },

        racing: {
            textColor: "000000",
            colors: ["00AEEF", "FFFFFF", "00AEEF"],
            angle: 0
        },

        riverPlate: {
            angle: 45,
            textColor: "D50000",
            colors: ["FFFFFF", "FFFFFF", "D50000"]
        },

        juventus: {
            angle: 0,
            textColor: "000000",
            colors: ["FFFFFF", "000000", "FFFFFF"]
        },
        
        argentina: {
            angle: 0,
            textColor: "000000",
            colors: ["75AADB", "FFFFFF", "75AADB"]
        },
        
        brasil: {
            angle: 0,
            textColor: "0000FF",
            colors: ["FFDF00", "FFDF00", "0000FF"]
        },
        
        alemania: {
            angle: 0,
            textColor: "000000",
            colors: ["FFFFFF", "000000", "FF0000"]
        },
        // Camisetas especiales
        dd: { 
            angle: 0, 
            textColor: "FFFFFF", 
            colors: ["043B00", "000000", "043B00"] 
        }, 

        dd2: { 
            angle: 0, 
            textColor: "FFFFFF", 
            colors: ["FFFFFF", "1F3821", "FFFFFF"] 
        },

        adb: { 
            angle: 90, 
            textColor: "11630E", 
            colors: ["DB0F00", "FFFFFF", "000000"] 
        },
        
        // Camisetas ESC
        esc: { 
            angle: 61, 
            textColor: "202020", 
            colors: ["DECE83", "202020", "17171720"] 
        },
        
        esc1: { 
            angle: 61, 
            textColor: "FFFFFF", 
            colors: ["DECE83", "FFFFFF", "DEDEDE"] 
        },
        
        esc2: {
            angle: 61, 
            textColor: "DECE83", 
            colors: ["000000", "DECE83", "A69A62"] 
        },
        
        // Camisetas especiales adicionales
        tbl: {
            angle: 60,
            textColor: "000000",
            colors: ["363636", "303030"]
        },
        
        hyz: {
            angle: 60,
            textColor: "4D4D4D",
            colors: ["000000", "000000", "000000"]
        },
        
        hyz2: {
            angle: 60,
            textColor: "26C5FF",
            colors: ["801296", "801296", "26C5FF"]
        },
        
        fnv: {
            angle: 60,
            textColor: "000000",
            colors: ["F8842B", "F8842B", "E86B27"]
        },
        
        fnv2: {
            angle: 60,
            textColor: "ABABAB ",
            colors: ["052F99", "052C8F", "042B8C"]
        },
        
        avh: {
            angle: 60,
            textColor: "A4A800",
            colors: ["000029", "000221", "00001C"]
        },
        
        avh2: {
            angle: 180,
            textColor: "39373B",
            colors: ["949E9C", "8D9695", "868F8E"]
        },
        
        avh3: {
            angle: 66,
            textColor: "FFCBA3",
            colors: ["3B0047", "54084A", "690942"]
        },
        
        lmdt: {
            angle: 120,
            textColor: "FADB69",
            colors: ["090A0E"]
        },
        
        lmdt2: {
            angle: 120,
            textColor: "090A0E",
            colors: ["FADB69"]
        },
        
        adb2: {
            angle: 90,
            textColor: "C70C0C",
            colors: ["1E7315", "FFFFFF", "000000"]
        },
        
        adb3: {
            angle: 66,
            textColor: "A35417",
            colors: ["A35417", "FF3BF2", "4FFF72", "4EA2F5"]
        },
        
        cate: {
            angle: 90,
            textColor: "00C710",
            colors: ["011F01"]
        },
        
        cate2: {
            angle: 0,
            textColor: "FFFFFF",
            colors: ["009C05", "0F0F0F"]
        },
        
        do: {
            angle: 0,
            textColor: "000000",
            colors: ["570B0B", "000000", "570B0B"]
        },
        
        do1: {
            angle: 0,
            textColor: "F5F5F5",
            colors: ["FFFFFF", "8A2222", "FCFCFC"]
        },
        
        do2: {
            angle: 90,
            textColor: "F5F5F5",
            colors: ["4A2626", "000000", "4A2626"]
        },
    };
    
    if (colores[codigo]) {
        // Incrementar contador del equipo específico (solo para no-administradores)
        if (!esAdminBasico(jugador)) {
            if (team === 1) {
                cambiosCamisetaRed++;
            } else {
                cambiosCamisetaBlue++;
            }
        }
        
        const equipoNombre = team === 1 ? "Rojo" : "Azul";
        const cambiosEquipo = team === 1 ? cambiosCamisetaRed : cambiosCamisetaBlue;
        
        // Aplicar el color antes del anuncio
        const color = colores[codigo];
        
        // Convertir colores hexadecimales a enteros para Haxball
        const hexColors = color.colors.map(c => parseInt(c, 16));
        const hexTextColor = parseInt(color.textColor, 16);
        
        room.setTeamColors(team, color.angle || 0, hexTextColor, hexColors);
        
        // Actualizar la camiseta actual del equipo
        if (team === 1) {
            camisetaActualRed = codigo;
        } else {
            camisetaActualBlue = codigo;
        }
        
        // NOTA: setPlayerTeamColors removido para evitar problemas de expulsión
        // Los colores se aplicarán automáticamente cuando los jugadores cambien de equipo
        // o se unan nuevos jugadores al equipo
        
        // Mensaje principal del cambio
        const mensajeCambios = esAdminBasico(jugador) ? "(Admin - Ilimitados)" : `(${cambiosEquipo}/${maxCambiosCamiseta})`;
        room.sendAnnouncement(`👕 ${jugador.name} cambió la camiseta del equipo ${equipoNombre} a "${codigo.toUpperCase()}". Cambios: ${mensajeCambios}`, null, parseInt("FF8C00", 16), "bold", 1);
        
        // Verificar si se alcanzó el máximo para este equipo (solo para no-administradores)
        if (!esAdminBasico(jugador)) {
            if (cambiosEquipo >= maxCambiosCamiseta) {
                room.sendAnnouncement(`⚠️ El equipo ${equipoNombre} ha alcanzado el número máximo de cambios de camiseta para este partido.`, null, parseInt("FF0000", 16), "bold", 1);
            } else if (cambiosEquipo === maxCambiosCamiseta - 1) {
                room.sendAnnouncement(`⚠️ ¡Atención! El equipo ${equipoNombre} solo tiene 1 cambio de camiseta disponible.`, null, parseInt("FFA500", 16), "bold", 1);
            }
        }
        
        anunciarExito(`Color ${codigo.toUpperCase()} aplicado correctamente al equipo ${equipoNombre}`, jugador);
    } else {
        anunciarError("Código de color no válido. Usa !colors list", jugador);
    }
}


function mostrarConfigReplays(jugador) {
    const config = [
        "🎬 CONFIGURACIÓN DE REPLAYS:",
        `📤 Envío a Discord: ${enviarReplaysDiscord ? 'ACTIVADO' : 'DESACTIVADO'}`,
        `🏆 Replays oficiales: ${guardarReplaysOficiales ? 'ACTIVADO' : 'DESACTIVADO'}`,
        `⚽ Replays amistosos: ${guardarReplaysAmistosos ? 'ACTIVADO' : 'DESACTIVADO'}`,
        `💾 Guardar en PC: ${guardarReplaysEnPC ? 'ACTIVADO' : 'DESACTIVADO'}`,
        "",
        "🔧 COMANDOS:",
        "!toggle_replays discord - Activar/desactivar envío a Discord",
        "!toggle_replays oficiales - Activar/desactivar replays oficiales",
        "!toggle_replays amistosos - Activar/desactivar replays amistosos"
    ];
    
    config.forEach(linea => {
        room.sendAnnouncement(linea, jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
    });
}

// Función para aplicar camisetas especiales
function aplicarCamisetaEspecial(jugador, configuracion) {
    const team = jugador.team;
    
    // Verificar que el jugador esté en un equipo
    if (team === 0) {
        anunciarError("❌ Debes estar en un equipo para cambiar la camiseta", jugador);
        return;
    }
    
    // Verificar si ya se alcanzó el máximo de cambios para este equipo (excepto para administradores)
    const cambiosEquipo = team === 1 ? cambiosCamisetaRed : cambiosCamisetaBlue;
    if (cambiosEquipo >= maxCambiosCamiseta && !esAdminBasico(jugador)) {
        const equipoNombre = team === 1 ? "Rojo" : "Azul";
        anunciarError(`❌ El equipo ${equipoNombre} ha alcanzado el máximo de cambios de camiseta (${cambiosEquipo}/${maxCambiosCamiseta})`, jugador);
        return;
    }
    
    // Incrementar contador del equipo específico (solo para no-administradores)
    if (!esAdminBasico(jugador)) {
        if (team === 1) {
            cambiosCamisetaRed++;
        } else {
            cambiosCamisetaBlue++;
        }
    }
    
    const equipoNombre = team === 1 ? "Rojo" : "Azul";
    const cambiosEquipoActual = team === 1 ? cambiosCamisetaRed : cambiosCamisetaBlue;
    
    // Aplicar la configuración de camiseta
    const { angle = 0, textColor, colors } = configuracion;
    
    // Convertir colores hexadecimales a enteros para Haxball
    const hexColors = colors.map(c => parseInt(c, 16));
    const hexTextColor = parseInt(textColor, 16);
    
    room.setTeamColors(team, angle, hexTextColor, hexColors);
    
    // Mensaje principal del cambio
    const mensajeCambiosEspecial = esAdminBasico(jugador) ? "(Admin - Ilimitados)" : `(${cambiosEquipoActual}/${maxCambiosCamiseta})`;
    room.sendAnnouncement(`👕 ${jugador.name} cambió la camiseta del equipo ${equipoNombre} a un diseño especial. Cambios: ${mensajeCambiosEspecial}`, null, parseInt("FF8C00", 16), "bold", 1);
    
    // Verificar si se alcanzó el máximo para este equipo (solo para no-administradores)
    if (!esAdminBasico(jugador)) {
        if (cambiosEquipoActual >= maxCambiosCamiseta) {
            room.sendAnnouncement(`⚠️ El equipo ${equipoNombre} ha alcanzado el número máximo de cambios de camiseta para este partido.`, null, parseInt("FF0000", 16), "bold", 1);
        } else if (cambiosEquipoActual === maxCambiosCamiseta - 1) {
            room.sendAnnouncement(`⚠️ ¡Atención! El equipo ${equipoNombre} solo tiene 1 cambio de camiseta disponible.`, null, parseInt("FFA500", 16), "bold", 1);
        }
    }
    
    anunciarExito(`Camiseta especial aplicada correctamente al equipo ${equipoNombre}`, jugador);
}


// FUNCIONES DE ESTADÍSTICAS PERSISTENTES CON LOCALSTORAGE
async function cargarEstadisticasGlobalesCompletas() {
    try {
        console.log('🔄 Iniciando carga de estadísticas globales...');
        
        // Obtener TODOS los jugadores de la base de datos
        if (typeof nodeObtenerTodosJugadores === 'function') {
            const todosJugadores = await nodeObtenerTodosJugadores();
            
            if (todosJugadores && todosJugadores.length > 0) {
                console.log(`📊 ${todosJugadores.length} jugadores encontrados en DB`);
                
                // Inicializar estructura
                estadisticasGlobales = {
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
                    contadorJugadores: todosJugadores.length
                };
                
                // Convertir cada jugador al formato interno
                let totalPartidos = 0;
                todosJugadores.forEach(jugadorDB => {
                    // Política: solo indexar por auth_id; ignorar registros sin auth_id
                    const claveAuth = jugadorDB.auth_id;
                    if (!claveAuth) {
                        return;
                    }
                    estadisticasGlobales.jugadores[claveAuth] = {
                        auth_id: jugadorDB.auth_id,
                        nombre: jugadorDB.nombre,
                        nombre_display: jugadorDB.nombre_display || jugadorDB.nombre,
                        partidos: jugadorDB.partidos || 0,
                        victorias: jugadorDB.victorias || 0,
                        derrotas: jugadorDB.derrotas || 0,
                        goles: jugadorDB.goles || 0,
                        asistencias: jugadorDB.asistencias || 0,
                        autogoles: jugadorDB.autogoles || 0,
                        mejorRachaGoles: jugadorDB.mejorRachaGoles || 0,
                        mejorRachaAsistencias: jugadorDB.mejorRachaAsistencias || 0,
                        hatTricks: jugadorDB.hatTricks || 0,
                        mvps: jugadorDB.mvps || 0,
                        vallasInvictas: jugadorDB.vallasInvictas || 0,
                        tiempoJugado: jugadorDB.tiempoJugado || 0,
                        promedioGoles: jugadorDB.promedioGoles || 0,
                        promedioAsistencias: jugadorDB.promedioAsistencias || 0,
                        fechaPrimerPartido: jugadorDB.fechaPrimerPartido || new Date().toISOString(),
                        fechaUltimoPartido: jugadorDB.fechaUltimoPartido || new Date().toISOString(),
                        xp: jugadorDB.xp || 40,
                        nivel: jugadorDB.nivel || 1,
                        codigoRecuperacion: jugadorDB.codigoRecuperacion,
                        fechaCodigoCreado: jugadorDB.fechaCodigoCreado
                    };
                    
                    totalPartidos += (jugadorDB.partidos || 0);
                });
                
                estadisticasGlobales.totalPartidos = Math.floor(totalPartidos / 6);
                
                console.log(`✅ Estadísticas cargadas: ${Object.keys(estadisticasGlobales.jugadores).length} jugadores`);
                
                // Verificar top partidos
                const topPartidos = Object.values(estadisticasGlobales.jugadores)
                    .filter(j => j.partidos > 0)
                    .sort((a, b) => b.partidos - a.partidos)
                    .slice(0, 3);
                    
                if (topPartidos.length > 0) {
                    console.log('🏆 Top 3 partidos cargado:');
                    topPartidos.forEach((j, i) => {
                        console.log(`   ${i+1}. ${j.nombre}: ${j.partidos} partidos`);
                    });
                } else {
                    console.warn('⚠️ No se encontraron jugadores con partidos > 0');
                }
                
                return true;
            } else {
                console.warn('⚠️ No se encontraron jugadores en la base de datos');
                return false;
            }
        } else {
            console.error('❌ Función nodeObtenerTodosJugadores no disponible');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error al cargar estadísticas globales:', error);
        estadisticasGlobales = inicializarBaseDatos();
        console.log('📊 Estadísticas globales inicializadas de emergencia');
        return false;
    }
    
    // Verificación final
    if (!estadisticasGlobales || !estadisticasGlobales.jugadores) {
        console.error('❌ CRÍTICO: estadisticasGlobales sigue siendo null después de la inicialización');
        inicializarEstadisticasGlobalesEmergencia();
    }
}

// Función de emergencia para inicializar estadísticas globales
function inicializarEstadisticasGlobalesEmergencia() {
    console.log('🚨 Inicializando estadísticas globales de emergencia...');
    estadisticasGlobales = {
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
        contadorJugadores: 0
    };
    console.log('✅ Estadísticas globales de emergencia inicializadas');
}

function guardarEstadisticasGlobalesCompletas() {
    try {
        if (!estadisticasGlobales) {
            console.error('❌ No se puede guardar: estadisticasGlobales es null');
            return false;
        }
        // Si no conviene guardar ahora, marcar pendiente y salir
        if (!puedeGuardarAhora()) {
            cambiosPendientes = true;
            return false;
        }
        guardadoEnCurso = true;
        const res = guardarEstadisticasGlobalesDB(estadisticasGlobales);
        // Si el guardado es una promesa, monitorear finalización
        if (res && typeof res.then === 'function') {
            res.finally(() => { guardadoEnCurso = false; });
        } else {
            guardadoEnCurso = false;
        }
        return res;
    } catch (error) {
        guardadoEnCurso = false;
        console.error('❌ Error al guardar estadísticas globales:', error);
        return false;
    }
}

function registrarJugadorGlobal(authID, nombre) {
    // Verificar que estadisticasGlobales esté inicializado
    if (!estadisticasGlobales || !estadisticasGlobales.jugadores) {
        console.error('❌ ERROR: estadisticasGlobales no inicializado en registrarJugadorGlobal');
        // Intentar inicializar estadísticas globales de emergencia
        inicializarEstadisticasGlobalesEmergencia();
        if (!estadisticasGlobales || !estadisticasGlobales.jugadores) {
            console.error('❌ ERROR CRÍTICO: No se pudo inicializar estadisticasGlobales');
            return null;
        }
    }
    
    // Si no hay authID, no registrar al jugador (solo jugadores con auth)
    if (!authID || authID.length === 0) {
        console.log(`🚫 No se registrará a ${nombre}: Sin auth ID`);
        return null;
    }
    
    if (!estadisticasGlobales.jugadores[authID]) {
        estadisticasGlobales.jugadores[authID] = {
            authID: authID,
            nombre: nombre, // Nombre actual del jugador
            partidos: 0,
            victorias: 0,
            derrotas: 0,
            goles: 0,
            asistencias: 0,
            autogoles: 0,
            mejorRachaGoles: 0,
            mejorRachaAsistencias: 0,
            hatTricks: 0,
            mvps: 0, // Campo separado para MVPs
            vallasInvictas: 0,
            tiempoJugado: 0, // en segundos
            promedioGoles: 0,
            promedioAsistencias: 0,
            fechaPrimerPartido: new Date().toISOString(),
            fechaUltimoPartido: new Date().toISOString(),
            xp: 40,  // XP inicial para jugadores nuevos
            nivel: 1 // Nivel inicial
        };
        console.log(`✅ Nuevo jugador registrado: ${nombre} (${authID})`);
    } else {
        // Actualizar nombre si ha cambiado
        if (estadisticasGlobales.jugadores[authID].nombre !== nombre) {
            console.log(`📝 Actualizando nombre: ${estadisticasGlobales.jugadores[authID].nombre} -> ${nombre}`);
            estadisticasGlobales.jugadores[authID].nombre = nombre;
        }
    }
    return estadisticasGlobales.jugadores[authID];
}

// ====================== FUNCIÓN DE VALIDACIÓN DE CANCHA ======================
function esPartidoValido() {
    // Verificar que el partido se jugó en cancha x4 o x7
    const canchasValidas = ['biggerx4', 'biggerx7'];
    const esValido = canchasValidas.includes(mapaActual);
    
    if (!esValido) {
        console.log(`📊 Stats no válidas: Partido jugado en ${mapaActual} (solo x4 y x7 cuentan para estadísticas)`);
    } else {
        console.log(`✅ Stats válidas: Partido en ${mapaActual} cuenta para estadísticas`);
    }
    
    return esValido;
}

function actualizarEstadisticasGlobales(datosPartido) {
    if (!datosPartido.iniciado) return;
    
    // ====================== VALIDAR CANCHA ANTES DE ACTUALIZAR STATS ======================
    if (!esPartidoValido()) {
        console.log('📊 Estadísticas NO actualizadas: Partido en cancha no válida');
        return;
    }
    
    // Verificar que estadisticasGlobales esté inicializado
    if (!estadisticasGlobales || !estadisticasGlobales.jugadores) {
        console.error('❌ ERROR: estadisticasGlobales no inicializado en actualizarEstadisticasGlobales');
        inicializarEstadisticasGlobalesEmergencia();
        if (!estadisticasGlobales || !estadisticasGlobales.jugadores) {
            console.error('❌ ERROR CRÍTICO: No se pudo inicializar estadisticasGlobales');
            return;
        }
    }
    
    const fechaActual = new Date().toISOString().split('T')[0];
    estadisticasGlobales.totalPartidos++;
    
    // Determinar equipos ganador y perdedor
    const equipoGanador = datosPartido.golesRed > datosPartido.golesBlue ? 1 : 
                         datosPartido.golesBlue > datosPartido.golesRed ? 2 : 0;
    
    // Actualizar estadísticas de cada jugador
    Object.values(datosPartido.jugadores).forEach(jugadorPartido => {
        // Obtener auth ID desde jugadoresUID (guardado al conectarse)
        const jugadorEnSala = room.getPlayerList().find(j => j.name === jugadorPartido.nombre);
        const authID = jugadorEnSala ? jugadoresUID.get(jugadorEnSala.id) : null;
        
        const statsGlobal = registrarJugadorGlobal(authID, jugadorPartido.nombre);
        
        // Si no tiene auth ID, no guardar estadísticas
        if (!statsGlobal) {
            console.log(`🚫 Estadísticas no guardadas para ${jugadorPartido.nombre}: Sin auth ID`);
            return; // Continuar con el siguiente jugador
        }
        
        // Estadísticas básicas
        statsGlobal.partidos++;
        statsGlobal.goles += jugadorPartido.goles;
        statsGlobal.asistencias += jugadorPartido.asistencias;
        statsGlobal.autogoles += jugadorPartido.autogoles;
        statsGlobal.tiempoJugado += datosPartido.duracion;
        statsGlobal.fechaUltimoPartido = new Date().toISOString();
        
        // Victorias/Derrotas
        if (equipoGanador !== 0) {
            if (jugadorPartido.equipo === equipoGanador) {
                statsGlobal.victorias++;
            } else {
                statsGlobal.derrotas++;
            }
        }
        
        // Hat-tricks
        procesarHatTricks(jugadorPartido, statsGlobal, fechaActual);
        
        // Vallas Invictas
        const esArqueroRojo = jugadorPartido.nombre === datosPartido.arqueroRed;
        const esArqueroAzul = jugadorPartido.nombre === datosPartido.arqueroBlue;
        
        if (esArqueroRojo && datosPartido.golesBlue === 0) {
            statsGlobal.vallasInvictas++;
            estadisticasGlobales.records.vallasInvictas.push({
                jugador: jugadorPartido.nombre,
                tiempo: datosPartido.duracion,
                fecha: fechaActual
            });
        }
        
        if (esArqueroAzul && datosPartido.golesRed === 0) {
            statsGlobal.vallasInvictas++;
            estadisticasGlobales.records.vallasInvictas.push({
                jugador: jugadorPartido.nombre,
                tiempo: datosPartido.duracion,
                fecha: fechaActual
            });
        }

        // Récords individuales del partido
        if (jugadorPartido.goles > estadisticasGlobales.records.mayorGoles.cantidad) {
            estadisticasGlobales.records.mayorGoles = {
                jugador: jugadorPartido.nombre,
                cantidad: jugadorPartido.goles,
                fecha: fechaActual
            };
        }
        
        if (jugadorPartido.asistencias > estadisticasGlobales.records.mayorAsistencias.cantidad) {
            estadisticasGlobales.records.mayorAsistencias = {
                jugador: jugadorPartido.nombre,
                cantidad: jugadorPartido.asistencias,
                fecha: fechaActual
            };
        }
        
        // Actualizar promedios
        statsGlobal.promedioGoles = (statsGlobal.goles / statsGlobal.partidos).toFixed(2);
        statsGlobal.promedioAsistencias = (statsGlobal.asistencias / statsGlobal.partidos).toFixed(2);
        
        // ====================== GENERACIÓN AUTOMÁTICA DE CÓDIGO DE RECUPERACIÓN ======================
// Generar código automáticamente cuando el jugador alcanza exactamente 5 partidos
        if (statsGlobal.partidos === 5 && !statsGlobal.codigoRecuperacion) {
            statsGlobal.codigoRecuperacion = generarCodigoRecuperacion(jugadorPartido.nombre);
            statsGlobal.fechaCodigoCreado = new Date().toISOString();
            
            // Notificar al jugador si está en la sala
            const jugadorEnSala = room.getPlayerList().find(j => j.name === jugadorPartido.nombre);
            if (jugadorEnSala) {
                setTimeout(() => {
                    room.sendAnnouncement("🎉 ¡FELICITACIONES! Has alcanzado 5 partidos jugados", jugadorEnSala.id, parseInt("00FF00", 16), "bold", 0);
                    room.sendAnnouncement(`🔐 Tu código de recuperación se ha generado automáticamente: ${statsGlobal.codigoRecuperacion}`, jugadorEnSala.id, parseInt(AZUL_LNB, 16), "bold", 0);
                    room.sendAnnouncement("💡 Guarda este código en un lugar seguro. Úsalo con '!recuperar [código]' para recuperar tus estadísticas", jugadorEnSala.id, parseInt("87CEEB", 16), "normal", 0);
                    room.sendAnnouncement("📋 Puedes ver tu código en cualquier momento con '!codigo' o '!cod'", jugadorEnSala.id, parseInt("87CEEB", 16), "normal", 0);
                }, 3000); // Mostrar después de 3 segundos para no interferir con otros mensajes
            }
            
            console.log(`🔐 Código de recuperación generado automáticamente para ${jugadorPartido.nombre}: ${statsGlobal.codigoRecuperacion}`);
        }
    });

    // MVP del partido (si está presente en los datos)
    if (datosPartido.mejorJugador) {
        const nombreMVP = typeof datosPartido.mejorJugador === 'string' ? datosPartido.mejorJugador : datosPartido.mejorJugador.nombre;
        if (nombreMVP) {
            procesarMVPPartido(nombreMVP, fechaActual);
        }
    }
    
    // Récords del partido
    if (datosPartido.duracion > estadisticasGlobales.records.partidoMasLargo.duracion) {
        estadisticasGlobales.records.partidoMasLargo = {
            duracion: datosPartido.duracion,
            fecha: fechaActual,
            equipos: `${datosPartido.golesRed}-${datosPartido.golesBlue}`
        };
    }
    
    const diferencia = Math.abs(datosPartido.golesRed - datosPartido.golesBlue);
    if (diferencia > estadisticasGlobales.records.goleadaMasGrande.diferencia) {
        estadisticasGlobales.records.goleadaMasGrande = {
            diferencia: diferencia,
            resultado: `${datosPartido.golesRed}-${datosPartido.golesBlue}`,
            fecha: fechaActual
        };
    }
    
    guardarEstadisticasGlobalesCompletas();
}

function mostrarEstadisticasJugador(solicitante, nombreJugador) {
    // Obtener auth ID del jugador solicitante para sus propias estadísticas
    const authIDSolicitante = jugadoresUID.get(solicitante.id);
    
    // Si está consultando sus propias estadísticas
    if (solicitante.name === nombreJugador) {
        if (!authIDSolicitante) {
            anunciarError("❌ Debes estar logueado en Haxball.com para ver tus estadísticas", solicitante);
            anunciarInfo("🔗 Ve a https://www.haxball.com/ y haz login antes de usar comandos de estadísticas", solicitante);
            return;
        }
        
        const stats = estadisticasGlobales.jugadores[authIDSolicitante];
        if (!stats) {
            anunciarError(`❌ No tienes estadísticas guardadas aún. Juega algunos partidos primero.`, solicitante);
            return;
        }
        
        mostrarEstadisticasCompletas(solicitante, stats, true);
    } else {
        // SEGURIDAD: Solo permitir ver estadísticas de jugadores que están actualmente en la sala con auth_id
        // Esto previene el robo de estadísticas al usar nombres de jugadores que no están presentes
        
        const jugadorEnSala = room.getPlayerList().find(j => j.name === nombreJugador);
        if (!jugadorEnSala) {
            anunciarError(`❌ ${nombreJugador} no está en la sala actualmente`, solicitante);
            anunciarInfo(`🔒 Por seguridad, solo puedes consultar estadísticas de jugadores presentes`, solicitante);
            return;
        }
        
        const authIDJugador = jugadoresUID.get(jugadorEnSala.id);
        if (!authIDJugador) {
            anunciarError(`❌ ${nombreJugador} no tiene cuenta registrada (sin login)`, solicitante);
            anunciarInfo(`💡 Solo los jugadores logueados en Haxball.com tienen estadísticas`, solicitante);
            return;
        }
        
        const stats = estadisticasGlobales.jugadores[authIDJugador];
        if (!stats) {
            anunciarError(`❌ ${nombreJugador} no tiene estadísticas guardadas aún`, solicitante);
            return;
        }
        
        console.log(`🔍 Consulta segura: ${solicitante.name} consultó stats de ${nombreJugador} (${authIDJugador})`);
        mostrarEstadisticasCompletas(solicitante, stats, false);
    }
}

function mostrarEstadisticasCompletas(solicitante, stats, esPropioJugador) {
    const winRate = stats.partidos > 0 ? ((stats.victorias / stats.partidos) * 100).toFixed(1) : "0.0";
    const horasJugadas = (stats.tiempoJugado / 3600).toFixed(1);
    const fechaPrimera = new Date(stats.fechaPrimerPartido).toLocaleDateString();
    const fechaUltima = new Date(stats.fechaUltimoPartido).toLocaleDateString();
    
    const statsMessage = `📊 ${stats.nombre.toUpperCase()} | 🎮 Partidos: ${stats.partidos} | ⏱️ Tiempo: ${horasJugadas} h | 🏆 V: ${stats.victorias} | 💔 D: ${stats.derrotas} | 📈 WR: ${winRate}% | ⚽ Goles: ${stats.goles} (${stats.promedioGoles}/partido) | 🎯 Asistencias: ${stats.asistencias} (${stats.promedioAsistencias}/partido) | 😱 Autogoles: ${stats.autogoles} | 🎩 Hat-tricks: ${stats.hatTricks} | 🛡️ Vallas invictas: ${stats.vallasInvictas} | 📅 ${fechaUltima}`;
    
    room.sendAnnouncement(statsMessage, solicitante.id, 0xFFFF00, "normal", 0);
    
    // Mostrar código de recuperación solo si es el propio jugador
    if (esPropioJugador && stats.partidos > 0) {
        // Generar código si no existe
        if (!stats.codigoRecuperacion) {
            stats.codigoRecuperacion = generarCodigoRecuperacion(stats.nombre);
            stats.fechaCodigoCreado = new Date().toISOString();
            guardarEstadisticasGlobalesCompletas();
        }
        
        // Mostrar código de recuperación
        room.sendAnnouncement(`🔐 Tu código de recuperación: ${stats.codigoRecuperacion}`, solicitante.id, parseInt(AZUL_LNB, 16), "bold", 0);
        room.sendAnnouncement("💡 Guarda este código para recuperar tus estadísticas en otro dispositivo con '!recuperar [código]'", solicitante.id, parseInt("87CEEB", 16), "normal", 0);
    }
}

function mostrarRecords(solicitante) {
    const records = estadisticasGlobales.records;
    
    // Top 5 goleadores históricos
    const topGoleadores = Object.values(estadisticasGlobales.jugadores)
        .sort((a, b) => b.goles - a.goles)
        .slice(0, 5);
    
    // Top 5 asistentes históricos
    const topAsistentes = Object.values(estadisticasGlobales.jugadores)
        .sort((a, b) => b.asistencias - a.asistencias)
        .slice(0, 5);
    
// Top 5 por win rate (mínimo 5 partidos)
    const topWinRate = Object.values(estadisticasGlobales.jugadores)
        .filter(j => j.partidos >= 5)
        .sort((a, b) => (b.victorias/b.partidos) - (a.victorias/a.partidos))
        .slice(0, 5);
    
    const lineas = [
        `🏆 RÉCORDS HISTÓRICOS DE LA SALA`,
        `📊 Total de partidos: ${estadisticasGlobales.totalPartidos}`,
        ``,
        `🏟️ RÉCORDS DE PARTIDOS:`,
        `⏱️ Partido más largo: ${Math.floor(records.partidoMasLargo.duracion/60)}:${(records.partidoMasLargo.duracion%60).toString().padStart(2,'0')} (${records.partidoMasLargo.equipos}) - ${records.partidoMasLargo.fecha}`,
        `🎩 Hat-tricks totales: ${records.hatTricks.length}`,
        ``,
        `👑 TOP 5 GOLEADORES HISTÓRICOS:`
    ];
    
    // TOP 5 GOLEADORES - Formato compacto
    const goleadoresCompacto = [];
    topGoleadores.forEach((jugador, i) => {
        let posicionEmoji = "";
        if (i === 0) posicionEmoji = "🥇";
        else if (i === 1) posicionEmoji = "🥈";
        else if (i === 2) posicionEmoji = "🥉";
        else if (i === 3) posicionEmoji = "4️⃣";
        else if (i === 4) posicionEmoji = "5️⃣";
        else if (i === 5) posicionEmoji = "6️⃣";
        else if (i === 6) posicionEmoji = "7️⃣";
        else if (i === 7) posicionEmoji = "8️⃣";
        else if (i === 8) posicionEmoji = "9️⃣";
        else if (i === 9) posicionEmoji = "🔟";
        else posicionEmoji = `${i + 1}.`;
        
        goleadoresCompacto.push(`${posicionEmoji} ${jugador.nombre}: ${jugador.goles} goles`);
    });
    
    // Agregar goleadores en una sola línea
    lineas.push(goleadoresCompacto.join(" • "));
    
    lineas.push(``);
    lineas.push(`🎯 TOP 5 ASISTENTES HISTÓRICOS:`);
    
    // TOP 5 ASISTENTES - Formato compacto
    const asistentesCompacto = [];
    topAsistentes.forEach((jugador, i) => {
        let posicionEmoji = "";
        if (i === 0) posicionEmoji = "🥇";
        else if (i === 1) posicionEmoji = "🥈";
        else if (i === 2) posicionEmoji = "🥉";
        else posicionEmoji = `${i + 1}.`;
        
        asistentesCompacto.push(`${posicionEmoji} ${jugador.nombre}: ${jugador.asistencias} asistencias`);
    });
    
    // Agregar asistentes en una sola línea
    lineas.push(asistentesCompacto.join(" • "));
    
    if (topWinRate.length > 0) {
        lineas.push(``);
        lineas.push(`📈 TOP 5 WIN RATE (mín. 10 partidos):`);
        
        // TOP 5 WIN RATE - Formato compacto
        const winRateCompacto = [];
        topWinRate.forEach((jugador, i) => {
            let posicionEmoji = "";
            if (i === 0) posicionEmoji = "🥇";
            else if (i === 1) posicionEmoji = "🥈";
            else if (i === 2) posicionEmoji = "🥉";
            else posicionEmoji = `${i + 1}.`;
            
            const wr = jugador.partidos > 0 ? ((jugador.victorias / jugador.partidos) * 100).toFixed(1) : '0.0';
            winRateCompacto.push(`${posicionEmoji} ${jugador.nombre}: ${wr}% (${jugador.victorias}/${jugador.partidos})`);
        });
        
        // Agregar win rate en una sola línea
        lineas.push(winRateCompacto.join(" • "));
    }
    
    lineas.forEach(linea => {
        room.sendAnnouncement(linea, solicitante.id, parseInt(AZUL_LNB, 16), "normal", 0);
    });
}

// Utilidad: convierte texto a un estilo "small caps" similar al usado en los títulos
function estilizarSmallCaps(texto) {
    if (!texto) return texto;
    const mapa = {
        'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'ꜱ','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ',
        'A':'ᴀ','B':'ʙ','C':'ᴄ','D':'ᴅ','E':'ᴇ','F':'ꜰ','G':'ɢ','H':'ʜ','I':'ɪ','J':'ᴊ','K':'ᴋ','L':'ʟ','M':'ᴍ','N':'ɴ','O':'ᴏ','P':'ᴘ','Q':'ǫ','R':'ʀ','S':'ꜱ','T':'ᴛ','U':'ᴜ','V':'ᴠ','W':'ᴡ','X':'x','Y':'ʏ','Z':'ᴢ'
        // Caracteres acentuados, ñ, etc. se mantienen tal cual
    };
    let out = '';
    for (const ch of texto) {
        out += (mapa[ch] || ch);
    }
    return out;
}

async function mostrarTopJugadores(solicitante, estadistica) {
    // Público: permitir ver rankings sin requerir login, usando solo datos por auth_id
    
    // Solo jugadores con auth_id que han jugado al menos un partido
    const jugadores = Object.values(estadisticasGlobales.jugadores)
        .filter(j => j.partidos > 0 && (j.authID || j.auth_id)); // Solo jugadores registrados con auth_id
    
    if (jugadores.length === 0) {
        // Intentar TOP directo desde la base de datos
        try {
            if (typeof nodeObtenerTopJugadores === 'function') {
                let campo = 'goles';
                switch(estadistica) {
                    case 'goles': campo = 'goles'; break;
                    case 'asistencias':
                    case 'asis': campo = 'asistencias'; break;
                    case 'vallas':
                    case 'vallasInvictas':
                    case 'vallasinvictas': campo = 'vallasInvictas'; break;
                    case 'autogoles': campo = 'autogoles'; break;
                    case 'mvps': campo = 'mvps'; break;
                    case 'partidos':
                    case 'pj': campo = 'partidos'; break;
                    default: campo = 'goles'; break;
                }
                const topDB = await nodeObtenerTopJugadores(campo, 10);
                if (Array.isArray(topDB) && topDB.length > 0) {
                    let titulo = '';
                    switch(estadistica) {
                        case 'goles': titulo = "[PV] ⚽ Gᴏʟᴇs ❯❯❯"; break;
                        case 'asistencias':
                        case 'asis': titulo = "[PV] 👟 Asɪsᴛᴇɴᴄɪᴀs ❯❯❯"; break;
                        case 'vallas':
                        case 'vallasInvictas':
                        case 'vallasinvictas': titulo = "[PV] 🥅 Vᴀʟʟᴀs ❯❯❯"; break;
                        case 'autogoles': titulo = "[PV] 😱 Aᴜᴛᴏɢᴏʟᴇs ❯❯❯"; break;
                        case 'mvps': titulo = "[PV] 👑 MVPꜱ ❯❯❯"; break;
                        case 'partidos':
                        case 'pj': titulo = "[PV] 🎮 Pᴀʀᴛɪᴅᴏꜱ ❯❯❯"; break;
                        default: titulo = "[PV] 🏆 Top ❯❯❯"; break;
                    }
                    const lineas = [ `${titulo}` ];
                    topDB.forEach((jug, i) => {
                        let posicionEmoji = '';
                        if (i === 0) posicionEmoji = '🥇';
                        else if (i === 1) posicionEmoji = '🥈';
                        else if (i === 2) posicionEmoji = '🥉';
                        else if (i === 9) posicionEmoji = '🔟';
                        else posicionEmoji = `${i + 1}.`;
                        const nombreMostrar = jug.nombre_display || jug.nombre;
                        const valor = jug[campo] ?? 0;
                        const nombreFancy = estilizarSmallCaps(nombreMostrar);
                        const valorFancy = estilizarSmallCaps(String(valor));
                        lineas.push(`${posicionEmoji} ${nombreFancy} [${valorFancy}]`);
                    });
                    room.sendAnnouncement(lineas[0], solicitante.id, parseInt(COLORES.DORADO, 16), "bold", 0);
                    const separador = " ❯ ";
                    const jugadoresEnLinea = lineas.slice(1).join(separador);
                    room.sendAnnouncement(jugadoresEnLinea, solicitante.id, parseInt(COLORES.DORADO, 16), "bold", 0);
                    return;
                } else if (typeof nodeObtenerTopDesdeBackup === 'function') {
                    const backup = await nodeObtenerTopDesdeBackup(campo, 10);
                    if (backup && backup.success && Array.isArray(backup.data) && backup.data.length > 0) {
                        let titulo = '';
                        switch(estadistica) {
                            case 'goles': titulo = "[PV] ⚽ Gᴏʟᴇs ❯❯❯"; break;
                            case 'asistencias':
                            case 'asis': titulo = "[PV] 👟 Asɪsᴛᴇɴᴄɪᴀs ❯❯❯"; break;
                            case 'vallas':
                            case 'vallasInvictas':
                            case 'vallasinvictas': titulo = "[PV] 🥅 Vᴀʟʟᴀs ❯❯❯"; break;
                            case 'autogoles': titulo = "[PV] 😱 Aᴜᴛᴏɢᴏʟᴇs ❯❯❯"; break;
                            case 'mvps': titulo = "[PV] 👑 MVPꜱ ❯❯❯"; break;
                            case 'partidos':
                            case 'pj': titulo = "[PV] 🎮 Pᴀʀᴛɪᴅᴏꜱ ❯❯❯"; break;
                            default: titulo = "[PV] 🏆 Top ❯❯❯"; break;
                        }
                        const lineas = [ `${titulo}` ];
                        backup.data.forEach((jug, i) => {
                            let posicionEmoji = '';
                            if (i === 0) posicionEmoji = '🥇';
                            else if (i === 1) posicionEmoji = '🥈';
                            else if (i === 2) posicionEmoji = '🥉';
                            else if (i === 9) posicionEmoji = '🔟';
                            else posicionEmoji = `${i + 1}.`;
                            const nombreMostrar = jug.nombre_display || jug.nombre;
                            const valor = jug[campo] ?? 0;
                            const nombreFancy = estilizarSmallCaps(nombreMostrar);
                            const valorFancy = estilizarSmallCaps(String(valor));
                            lineas.push(`${posicionEmoji} ${nombreFancy} [${valorFancy}]`);
                        });
                        room.sendAnnouncement(lineas[0], solicitante.id, parseInt(COLORES.DORADO, 16), "bold", 0);
                        const separador = " ❯ ";
                        const jugadoresEnLinea = lineas.slice(1).join(separador);
                        room.sendAnnouncement(jugadoresEnLinea, solicitante.id, parseInt(COLORES.DORADO, 16), "bold", 0);
                        return;
                    }
                }
            }
        } catch (e) {
            console.log('⚠️ TOP desde DB falló:', e?.message || e);
        }
        
        // Fallback simple: mostrar 10 jugadores aleatorios de la base con valor 0
        try {
            if (typeof nodeObtenerTodosJugadores === 'function') {
                const todos = await nodeObtenerTodosJugadores();
                if (Array.isArray(todos) && todos.length > 0) {
                    // Mezclar aleatoriamente y tomar 10
                    const mezclados = todos
                        .map(v => ({ v, r: Math.random() }))
                        .sort((a, b) => a.r - b.r)
                        .slice(0, 10)
                        .map(x => x.v);

                    let titulo = '';
                    switch(estadistica) {
                        case 'goles': titulo = "[PV] ⚽ Gᴏʟᴇs ❯❯❯"; break;
                        case 'asistencias':
                        case 'asis': titulo = "[PV] 👟 Asɪsᴛᴇɴᴄɪᴀs ❯❯❯"; break;
                        case 'vallas':
                        case 'vallasInvictas':
                        case 'vallasinvictas': titulo = "[PV] 🥅 Vᴀʟʟᴀs ❯❯❯"; break;
                        case 'autogoles': titulo = "[PV] 😱 Aᴜᴛᴏɢᴏʟᴇs ❯❯❯"; break;
                        case 'mvps': titulo = "[PV] 👑 MVPꜱ ❯❯❯"; break;
                        case 'partidos':
                        case 'pj': titulo = "[PV] 🎮 Pᴀʀᴛɪᴅᴏꜱ ❯❯❯"; break;
                        default: titulo = "[PV] 🏆 Top ❯❯❯"; break;
                    }

                    const lineas = [ `${titulo}` ];
                    mezclados.forEach((jug, i) => {
                        let posicionEmoji = '';
                        if (i === 0) posicionEmoji = '🥇';
                        else if (i === 1) posicionEmoji = '🥈';
                        else if (i === 2) posicionEmoji = '🥉';
                        else if (i === 9) posicionEmoji = '🔟';
                        else posicionEmoji = `${i + 1}.`;

                        const nombreMostrar = jug.nombre_display || jug.nombre;
                        const nombreFancy = estilizarSmallCaps(nombreMostrar);
                        const valorFancy = estilizarSmallCaps(String(0));
                        lineas.push(`${posicionEmoji} ${nombreFancy} [${valorFancy}]`);
                    });

                    // Enviar título y línea compacta
                    room.sendAnnouncement(lineas[0], solicitante.id, parseInt(COLORES.DORADO, 16), "bold", 0);
                    const separador = " ❯ ";
                    const jugadoresEnLinea = lineas.slice(1).join(separador);
                    room.sendAnnouncement(jugadoresEnLinea, solicitante.id, parseInt(COLORES.DORADO, 16), "bold", 0);
                    return;
                }
            }
        } catch (e) {
            console.log('⚠️ Fallback aleatorio falló:', e?.message || e);
        }
        // Si no hay datos, mensaje informativo
        anunciarError("❌ No hay estadísticas disponibles aún.", solicitante);
        anunciarInfo("💡 Las estadísticas se mostrarán automáticamente cuando haya datos registrados.", solicitante);
        return;
    }
    
    console.log(`📊 ${solicitante.name} consultó top ${estadistica} (${jugadores.length} jugadores registrados)`);
    
    let topJugadores = [];
    let titulo = "";
    let emoji = "";
    let unidad = "";
    
    switch(estadistica) {
        case "goles":
            topJugadores = jugadores
                .sort((a, b) => b.goles - a.goles)
                .slice(0, 10);
            titulo = "[PV] ⚽ Gᴏʟᴇs ❯❯❯";
            unidad = "";
            // Eliminar el emoji de título adicional
            break;
            
        case "asistencias":
        case "asis":
            topJugadores = jugadores
                .sort((a, b) => b.asistencias - a.asistencias)
                .slice(0, 10);
            titulo = "[PV] 👟 Asɪsᴛᴇɴᴄɪᴀs ❯❯❯";
            emoji = "🎯";
            unidad = "";
            break;
            
        case "vallas":
        case "vallasInvictas":
        case "vallasinvictas":
            topJugadores = jugadores
                .sort((a, b) => b.vallasInvictas - a.vallasInvictas)
                .slice(0, 10);
            titulo = "[PV] 🥅 Vᴀʟʟᴀs ❯❯❯";
            emoji = "🛡️";
            unidad = ""; // Formato compacto: solo el número
            break;
            
        case "autogoles":
            topJugadores = jugadores
                .sort((a, b) => b.autogoles - a.autogoles)
                .slice(0, 10);
            titulo = "[PV] 😱 Aᴜᴛᴏɢᴏʟᴇs ❯❯❯";
            emoji = "😱";
            unidad = "";
            break;
            
        case "hattrick":
        case "hattricks":
            topJugadores = jugadores
                .sort((a, b) => b.hatTricks - a.hatTricks)
                .slice(0, 10);
            titulo = "[PV] 🎩 Hᴀᴛ-ᴛʀɪᴄᴋꜱ ❯❯❯";
            emoji = "🎩";
            unidad = "";
            break;
            
        case "mvp":
        case "mvps":
            topJugadores = jugadores
                .sort((a, b) => (b.mvps || 0) - (a.mvps || 0))
                .slice(0, 10);
            titulo = "[PV] 👑 MVPꜱ ❯❯❯";
            emoji = "👑";
            unidad = "";
            break;
            
        case "partidos":
        case "pj":
            topJugadores = jugadores
                .sort((a, b) => b.partidos - a.partidos)
                .slice(0, 10);
            titulo = "[PV] 🎮 Pᴀʀᴛɪᴅᴏꜱ ❯❯❯";
            emoji = "🎮";
            unidad = "";
            break;
            
        case "rank":
            // Calcular ranking basado en goles + asistencias + vallas invictas
            topJugadores = jugadores
                .map(j => ({
                    ...j,
                    puntuacionRank: j.goles + j.asistencias + j.vallasInvictas
                }))
                .sort((a, b) => b.puntuacionRank - a.puntuacionRank)
                .slice(0, 10);
            titulo = "[PV] 🏆 Rᴀɴᴋɪɴɢ ❯❯❯";
            emoji = "🏆";
            unidad = "puntos";
            break;
            
        default:
            room.sendAnnouncement("❌ Estadística no válida. Usa: goles, asistencias (asis), vallas, autogoles, partidos (pj), mvps, rank", solicitante.id, parseInt("FF0000", 16), "normal", 0);
            return;
    }
    
    const lineas = [
        `${titulo}`
    ];
    
    topJugadores.forEach((jugador, i) => {
        let valor = 0;
        let info = "";
        
        switch(estadistica) {
            case "goles":
                valor = jugador.goles;
                info = "";
                break;
            case "asistencias":
            case "asis":
                valor = jugador.asistencias;
                info = "";
                break;
            case "vallas":
            case "vallasInvictas":
            case "vallasinvictas":
                valor = jugador.vallasInvictas;
                info = "";
                break;
            case "autogoles":
                valor = jugador.autogoles;
                info = ``; // Removed party count as requested
                break;
            case "mvp":
            case "mvps":
                valor = jugador.mvps || 0;
                info = ``;
                break;
                
            case "hattrick":
            case "hattricks":
                valor = jugador.hatTricks;
                info = ``;
                break;
                
            case "partidos":
            case "pj":
                valor = jugador.partidos;
                info = "";
                break;
                
            case "rank":
                valor = jugador.puntuacionRank;
                info = ``; // Sin información adicional para el rank
                break;
        }
        
        // Emojis de posición
        let posicionEmoji = "";
        // Emojis especiales para todas las estadísticas
        if (i === 0) posicionEmoji = "🥇";
        else if (i === 1) posicionEmoji = "🥈";
        else if (i === 2) posicionEmoji = "🥉";
        else if (i === 3) posicionEmoji = "⿤";
        else if (i === 4) posicionEmoji = "⿥";
        else if (i === 5) posicionEmoji = "⿦";
        else if (i === 6) posicionEmoji = "⿧";
        else if (i === 7) posicionEmoji = "⿨";
        else if (i === 8) posicionEmoji = "⿩";
        else if (i === 9) posicionEmoji = "🔟";
        else posicionEmoji = `${i + 1}.`;
        
        // Usar nombre_display si está disponible, sino usar nombre como fallback
        const nombreMostrar = jugador.nombre_display || jugador.nombre;
        const nombreFancy = estilizarSmallCaps(nombreMostrar);
        const valorFancy = estilizarSmallCaps(String(valor));
        if (estadistica === "rank") {
            // Formato especial para rank: nombre [valor]
            lineas.push(`${posicionEmoji} ${nombreFancy} [${valorFancy}]`);
        } else {
            // Formato con corchetes para todas las estadísticas: nombre [valor]
            lineas.push(`${posicionEmoji} ${nombreFancy} [${valorFancy}]`);
        }
    });
    
    // Enviar título en línea separada
    room.sendAnnouncement(lineas[0], solicitante.id, parseInt(COLORES.DORADO, 16), "bold", 0);
    
    // Unir todos los jugadores en una sola línea
    const separador = " ❯ "; // Usar separador ❯ para todas las estadísticas
    const jugadoresEnLinea = lineas.slice(1).join(separador); // Omitir solo el título
    room.sendAnnouncement(jugadoresEnLinea, solicitante.id, parseInt(COLORES.DORADO, 16), "bold", 0);
}

// FUNCIONES DE CÓDIGO DE RECUPERACIÓN
function generarCodigoRecuperacion(nombre) {
    // Generar un código único basado en el nombre del jugador y un timestamp
    const timestamp = Date.now();
    const nombreLimpio = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
    const seed = nombreLimpio + timestamp.toString();
    
    // Crear un hash simple del seed
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convertir a 32-bit integer
    }
    
    // Convertir a código alfanumérico de 8 caracteres
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    let hashPos = Math.abs(hash);
    
    for (let i = 0; i < 8; i++) {
        codigo += chars[hashPos % chars.length];
        hashPos = Math.floor(hashPos / chars.length);
    }
    
    return codigo;
}

function mostrarCodigoRecuperacion(jugador) {
    // Obtener auth ID del jugador
    const authID = jugadoresUID.get(jugador.id);
    
    if (!authID) {
        anunciarError("❌ Debes estar logueado en Haxball.com para usar códigos de recuperación", jugador);
        anunciarInfo("🔗 Ve a https://www.haxball.com/ y haz login antes de usar este comando", jugador);
        return;
    }
    
    // Verificar si el jugador ya tiene estadísticas
    const stats = estadisticasGlobales.jugadores[authID];
    
    if (!stats || stats.partidos === 0) {
        anunciarError("❌ No tienes estadísticas guardadas aún. Juega algunos partidos primero.", jugador);
        return;
    }
    
    // Generar o recuperar código existente
    if (!stats.codigoRecuperacion) {
        stats.codigoRecuperacion = generarCodigoRecuperacion(jugador.name);
        stats.fechaCodigoCreado = new Date().toISOString();
        guardarEstadisticasGlobalesCompletas();
    }
    
    const lineas = [
        `[PV] 🔐 Código de recuperación: ${stats.codigoRecuperacion} (${new Date(stats.fechaCodigoCreado).toLocaleDateString()})`,
        "[PV] 💡 Usá '!recuperar [código]' desde otro dispositivo y guardalo en un lugar seguro.",
        `[PV] 📊 Stats: ${stats.partidos} partidos, ${stats.goles} goles`
    ];
    
    lineas.forEach(linea => {
        room.sendAnnouncement(linea, jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
    });
}

function recuperarEstadisticas(jugador, codigo) {
    // Obtener auth ID del jugador
    const authID = jugadoresUID.get(jugador.id);
    
    if (!authID) {
        anunciarError("❌ Debes estar logueado en Haxball.com para recuperar estadísticas", jugador);
        anunciarInfo("🔗 Ve a https://www.haxball.com/ y haz login antes de usar este comando", jugador);
        return;
    }
    
    if (!codigo || codigo.length !== 8) {
        anunciarError("❌ Código inválido. Debe tener 8 caracteres.", jugador);
        return;
    }
    
    const codigoLimpio = codigo.toUpperCase();
    
    // Buscar el authID que tiene este código
    let authIDOriginal = null;
    let statsOriginales = null;
    
    for (const [authIDKey, stats] of Object.entries(estadisticasGlobales.jugadores)) {
        if (stats.codigoRecuperacion === codigoLimpio) {
            authIDOriginal = authIDKey;
            statsOriginales = stats;
            break;
        }
    }
    
    if (!authIDOriginal || !statsOriginales) {
        anunciarError("❌ Código de recuperación no encontrado. Verifica que sea correcto.", jugador);
        return;
    }
    
    // Verificar si ya existe estadísticas para este authID
    const statsActuales = estadisticasGlobales.jugadores[authID];
    
    if (statsActuales && statsActuales.partidos > 0) {
        // Mostrar comparación sin fusionar automáticamente
        anunciarAdvertencia("Ya tienes estadísticas existentes:", jugador);
        anunciarInfo(`📊 Actuales: ${statsActuales.partidos} PJ | ${statsActuales.goles} G | ${statsActuales.asistencias} A`, jugador);
        anunciarInfo(`🔄 A recuperar: ${statsOriginales.partidos} PJ | ${statsOriginales.goles} G | ${statsOriginales.asistencias} A`, jugador);
        anunciarError("❌ No se puede recuperar porque ya tienes estadísticas. Contacta a un administrador si necesitas ayuda.", jugador);
        return;
    } else {
        // No hay estadísticas actuales, recuperar directamente
        estadisticasGlobales.jugadores[authID] = {
            ...statsOriginales,
            authID: authID,
            nombre: jugador.name, // Actualizar con el nombre actual
            fechaRecuperacion: new Date().toISOString(),
            dispositivo: "recuperado"
        };
        
        const wrRec = statsOriginales.partidos > 0 ? ((statsOriginales.victorias / statsOriginales.partidos) * 100).toFixed(1) : '0.0';
        const mensaje = `[PV] ✅ Stats recuperadas: ${statsOriginales.partidos} PJ | ${statsOriginales.goles} G | ${statsOriginales.asistencias} A | ${statsOriginales.victorias} V | ${statsOriginales.derrotas} D | Win Rate: ${wrRec}%`;
        room.sendAnnouncement(mensaje, jugador.id, parseInt("00FF00", 16), "normal", 0);
    }
    
    // Eliminar las estadísticas del authID original si es diferente
    if (authIDOriginal !== authID) {
        delete estadisticasGlobales.jugadores[authIDOriginal];
    }
    
    guardarEstadisticasGlobalesCompletas();
    
    anunciarInfo("🎮 Usá '!me' para ver tus estadísticas completas.", jugador);
    
    // Anuncio público
    anunciarExito(`🔄 ${jugador.name} ha recuperado sus estadísticas`);
}

// FUNCIÓN PARA DESAFIAR A PPT
function desafiarPPT(jugador, nombreOponente, jugadaDesafiador) {
    const oponente = room.getPlayerList().find(j => j.name.toLowerCase().includes(nombreOponente.toLowerCase()));

    if (!oponente) {
anunciarError(`❌ No se encontró a ningún jugador con el nombre "${nombreOponente}"`, jugador);
        return;
    }

    if (oponente.id === jugador.id) {
anunciarError("❌ No puedes desafiarte a ti mismo 😅", jugador);
        return;
    }

    // Verificar si ya hay un desafío activo del jugador
    if (desafiosPPT.has(jugador.id)) {
anunciarError("❌ Ya tienes un desafío activo. Espera a que termine.", jugador);
        return;
    }

    // Verificar si el oponente ya tiene un desafío pendiente
    const desafioExistente = Array.from(desafiosPPT.values()).find(d => d.oponente.id === oponente.id);
    if (desafioExistente) {
anunciarError(`❌ ${oponente.name} ya tiene un desafío pendiente.`, jugador);
        return;
    }

    // Crear el desafío con la jugada del desafiador ya definida
    desafiosPPT.set(jugador.id, { 
        oponente: oponente, 
        jugadaDesafiador: jugadaDesafiador, 
        tiempoInicio: Date.now(), 
        timeout: setTimeout(() => {
            if (desafiosPPT.has(jugador.id)) {
                desafiosPPT.delete(jugador.id);
anunciarAdvertencia(`⏰ El desafío de ${jugador.name} a ${oponente.name} ha expirado.`, jugador);
            }
        }, 30000) 
    }); // 30 segundos para responder

    anunciarGeneral(`🎮 ${jugador.name} ha desafiado a ${oponente.name} a Piedra, Papel o Tijeras!`);
    anunciarGeneral(`✋ ${oponente.name}, responde con !piedra, !papel o !tijeras para aceptar el desafío.`);
}

// FUNCIÓN PARA RESPONDER A UN DESAFÍO DE PPT
function responderDesafioPPT(jugador, jugada) {
    // Buscar si este jugador tiene un desafío pendiente donde él es el oponente
    let desafioKey = null;
    let desafio = null;
    
    for (const [key, value] of desafiosPPT.entries()) {
        if (value.oponente.id === jugador.id) {
            desafioKey = key;
            desafio = value;
            break;
        }
    }

    if (!desafio) {
anunciarError("❌ No tienes ningún desafío pendiente.", jugador);
        return;
    }

    // Limpiar timeout
    if (desafio.timeout) {
        clearTimeout(desafio.timeout);
    }

    // Buscar al jugador desafiador
    const desafiador = room.getPlayerList().find(j => j.id === desafioKey);
    if (!desafiador) {
anunciarError("❌ El jugador que te desafió se desconectó.", jugador);
        desafiosPPT.delete(desafioKey);
        return;
    }

    const jugadaDesafiador = desafio.jugadaDesafiador;

    // Comparar jugadas
    const jugadas = { piedra: 0, papel: 1, tijeras: 2 };
    const resultado = (jugadas[jugada] - jugadas[jugadaDesafiador] + 3) % 3;

    let mensajeResultado;

    if (resultado === 0) {
        mensajeResultado = `🤝 ¡Empate! Ambos eligieron ${jugada}.`;
    } else if (resultado === 1) {
        mensajeResultado = `🎉 ${jugador.name} gana con ${jugada} contra ${jugadaDesafiador} de ${desafiador.name}!`;
    } else {
        mensajeResultado = `🎉 ${desafiador.name} gana con ${jugadaDesafiador} contra ${jugada} de ${jugador.name}!`;
    }

    // Anunciar resultado y limpiar desafío
    anunciarGeneral(mensajeResultado);
    desafiosPPT.delete(desafioKey);
}

// FUNCIÓN PARA MOSTRAR HEAD TO HEAD (H2H) - SEGURO
function mostrarHeadToHead(solicitante, nombre1, nombre2) {
    // Verificar que el solicitante tenga auth ID
    const authIDSolicitante = jugadoresUID.get(solicitante.id);
    if (!authIDSolicitante) {
        anunciarError("❌ Debes estar logueado en Haxball.com para usar comparaciones", solicitante);
        anunciarInfo("🔗 Ve a https://www.haxball.com/ y haz login antes de usar este comando", solicitante);
        return;
    }
    
    // SEGURIDAD: Solo permitir comparar jugadores que están actualmente en la sala con auth_id
    function obtenerStatsSeguro(nombreJugador) {
        const jugadorEnSala = room.getPlayerList().find(j => j.name === nombreJugador);
        if (!jugadorEnSala) {
            return { error: `${nombreJugador} no está en la sala actualmente` };
        }
        
        const authIDJugador = jugadoresUID.get(jugadorEnSala.id);
        if (!authIDJugador) {
            return { error: `${nombreJugador} no tiene cuenta registrada (sin login)` };
        }
        
        const stats = estadisticasGlobales.jugadores[authIDJugador];
        if (!stats) {
            return { error: `${nombreJugador} no tiene estadísticas guardadas aún` };
        }
        
        return { stats, authID: authIDJugador };
    }
    
    // Obtener estadísticas de ambos jugadores de forma segura
    const resultado1 = obtenerStatsSeguro(nombre1);
    const resultado2 = obtenerStatsSeguro(nombre2);
    
    if (resultado1.error) {
        anunciarError(`❌ ${resultado1.error}`, solicitante);
        anunciarInfo(`🔒 Por seguridad, solo puedes comparar jugadores presentes y logueados`, solicitante);
        return;
    }
    if (resultado2.error) {
        anunciarError(`❌ ${resultado2.error}`, solicitante);
        anunciarInfo(`🔒 Por seguridad, solo puedes comparar jugadores presentes y logueados`, solicitante);
        return;
    }
    
    const stats1 = resultado1.stats;
    const stats2 = resultado2.stats;
    
    console.log(`🔍 H2H seguro: ${solicitante.name} comparó ${nombre1} (${resultado1.authID}) vs ${nombre2} (${resultado2.authID})`);
    
    
    // Calcular estadísticas comparativas
    const winRate1 = stats1.partidos > 0 ? ((stats1.victorias / stats1.partidos) * 100).toFixed(1) : "0.0";
    const winRate2 = stats2.partidos > 0 ? ((stats2.victorias / stats2.partidos) * 100).toFixed(1) : "0.0";
    
    const promedioGoles1 = stats1.partidos > 0 ? (stats1.goles / stats1.partidos).toFixed(2) : "0.00";
    const promedioGoles2 = stats2.partidos > 0 ? (stats2.goles / stats2.partidos).toFixed(2) : "0.00";
    
    const promedioAsist1 = stats1.partidos > 0 ? (stats1.asistencias / stats1.partidos).toFixed(2) : "0.00";
    const promedioAsist2 = stats2.partidos > 0 ? (stats2.asistencias / stats2.partidos).toFixed(2) : "0.00";
    
    // Determinar quién es mejor en cada categoría
    const mejorGoleador = stats1.goles > stats2.goles ? stats1.nombre : 
                         stats2.goles > stats1.goles ? stats2.nombre : "Empate";
    
    const mejorAsistente = stats1.asistencias > stats2.asistencias ? stats1.nombre : 
                          stats2.asistencias > stats1.asistencias ? stats2.nombre : "Empate";
    
    const mejorWinRate = parseFloat(winRate1) > parseFloat(winRate2) ? stats1.nombre : 
                        parseFloat(winRate2) > parseFloat(winRate1) ? stats2.nombre : "Empate";
    
    const masPartidos = stats1.partidos > stats2.partidos ? stats1.nombre : 
                       stats2.partidos > stats1.partidos ? stats2.nombre : "Empate";
    
    const masHatTricks = stats1.hatTricks > stats2.hatTricks ? stats1.nombre : 
                        stats2.hatTricks > stats1.hatTricks ? stats2.nombre : "Empate";
    
    // Calcular "dominio" general basado en múltiples métricas
    let puntos1 = 0, puntos2 = 0;
    
    if (stats1.goles > stats2.goles) puntos1++; else if (stats2.goles > stats1.goles) puntos2++;
    if (stats1.asistencias > stats2.asistencias) puntos1++; else if (stats2.asistencias > stats1.asistencias) puntos2++;
    if (parseFloat(winRate1) > parseFloat(winRate2)) puntos1++; else if (parseFloat(winRate2) > parseFloat(winRate1)) puntos2++;
    if (stats1.hatTricks > stats2.hatTricks) puntos1++; else if (stats2.hatTricks > stats1.hatTricks) puntos2++;
    if (stats1.vallasInvictas > stats2.vallasInvictas) puntos1++; else if (stats2.vallasInvictas > stats1.vallasInvictas) puntos2++;
    
    let dominancia = "";
    if (puntos1 > puntos2) {
        dominancia = `🔥 ${stats1.nombre} domina (${puntos1}-${puntos2})`;
    } else if (puntos2 > puntos1) {
        dominancia = `🔥 ${stats2.nombre} domina (${puntos2}-${puntos1})`;
    } else {
        dominancia = `🤝 Están muy parejos (${puntos1}-${puntos2})`;
    }
    
    // Crear el reporte H2H
    const lineas = [
        `⚔️ HEAD TO HEAD: ${stats1.nombre} 🆚 ${stats2.nombre}`,
        `═══════════════════════════════════════════════════════`,
        `🎮 PARTIDOS JUGADOS:`,
        `   ${stats1.nombre}: ${stats1.partidos} | ${stats2.nombre}: ${stats2.partidos}`,
        `   👑 Más activo: ${masPartidos}`,
        ``,
        `⚽ GOLES TOTALES:`,
        `   ${stats1.nombre}: ${stats1.goles} (${promedioGoles1}/partido)`,
        `   ${stats2.nombre}: ${stats2.goles} (${promedioGoles2}/partido)`,
        `   👑 Mejor goleador: ${mejorGoleador}`,
        ``,
        `🎯 ASISTENCIAS TOTALES:`,
        `   ${stats1.nombre}: ${stats1.asistencias} (${promedioAsist1}/partido)`,
        `   ${stats2.nombre}: ${stats2.asistencias} (${promedioAsist2}/partido)`,
        `   👑 Mejor asistente: ${mejorAsistente}`,
        ``,
        `📈 WIN RATE:`,
        `   ${stats1.nombre}: ${winRate1}% (${stats1.victorias}V-${stats1.derrotas}D)`,
        `   ${stats2.nombre}: ${winRate2}% (${stats2.victorias}V-${stats2.derrotas}D)`,
        `   👑 Mejor win rate: ${mejorWinRate}`,
        ``,
        `🎩 HAT-TRICKS (MVP):`,
        `   ${stats1.nombre}: ${stats1.hatTricks} | ${stats2.nombre}: ${stats2.hatTricks}`,
        `   👑 Más MVPs: ${masHatTricks}`,
        ``,
        `🛡️ VALLAS INVICTAS:`,
        `   ${stats1.nombre}: ${stats1.vallasInvictas} | ${stats2.nombre}: ${stats2.vallasInvictas}`,
        ``,
        `═══════════════════════════════════════════════════════`,
        `${dominancia}`,
        `═══════════════════════════════════════════════════════`
    ];
    
    // Enviar el reporte H2H al solicitante
    lineas.forEach(linea => {
        room.sendAnnouncement(linea, solicitante.id, parseInt(AZUL_LNB, 16), "normal", 0);
    });
    
    // Anuncio público opcional (comentado para evitar spam)
    // anunciarInfo(`📊 ${solicitante.name} consultó H2H: ${stats1.nombre} vs ${stats2.nombre}`);
}

// FUNCIONES DE ESTADÍSTICAS DEL PARTIDO

// FUNCIÓN PARA CALCULAR COMPATIBILIDAD
function calcularCompatibilidad(jugador, nombreObjetivo) {
    // Buscar al jugador objetivo en la sala
    const jugadores = room.getPlayerList();
    const objetivo = jugadores.find(j => j.name.toLowerCase().includes(nombreObjetivo.toLowerCase()));
    
    if (!objetivo) {
        anunciarError(`❌ No se encontró a ningún jugador con el nombre "${nombreObjetivo}"`, jugador);
        return;
    }
    
    if (objetivo.id === jugador.id) {
        anunciarError("❌ No puedes hacer ship contigo mismo 😅", jugador);
        return;
    }
    
    // Generar un porcentaje de compatibilidad COMPLETAMENTE ALEATORIO cada vez
    // Usar Math.random() para garantizar variación
    const compatibilidad = Math.floor(Math.random() * 101);
    
    // Determinar el mensaje según el porcentaje
    let mensaje, color;
    
    if (compatibilidad >= 90) {
        mensaje = "¡MATCH PERFECTO! 💕 Están hechos el uno para el otro";
        color = "FF69B4"; // Rosa intenso
    } else if (compatibilidad >= 80) {
        mensaje = "¡Excelente compatibilidad! 💖 Muy buena química";
        color = "FF1493"; // Rosa fuerte
    } else if (compatibilidad >= 70) {
        mensaje = "¡Buena compatibilidad! 💗 Hay potencial aquí";
        color = "FF6347"; // Rojo tomate
    } else if (compatibilidad >= 60) {
        mensaje = "Compatibilidad moderada 💛 Pueden ser buenos amigos";
        color = "FFD700"; // Dorado
    } else if (compatibilidad >= 50) {
        mensaje = "Compatibilidad promedio 🤝 Normal, nada especial";
        color = "FFA500"; // Naranja
    } else if (compatibilidad >= 30) {
        mensaje = "Baja compatibilidad 😐 Mejor como conocidos";
        color = "87CEEB"; // Azul cielo
    } else if (compatibilidad >= 15) {
        mensaje = "Muy baja compatibilidad 😬 Polos opuestos";
        color = "778899"; // Gris azulado
    } else {
        mensaje = "¡Incompatibles! 💀 Mejor manténganse alejados";
        color = "696969"; // Gris oscuro
    }
    
    // Agregar algunos casos especiales divertidos
    const emojis = ["💕", "💖", "💗", "💓", "💘", "💝", "💟", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎"];
    const emojiAleatorio = emojis[Math.floor(Math.random() * emojis.length)];
    
    // Anunciar resultado
    anunciarGeneral(
        `💕 SHIP: ${jugador.name} + ${objetivo.name} = ${compatibilidad}% ${emojiAleatorio}`,
        color,
        "bold"
    );
    
    anunciarGeneral(mensaje, color, "normal");
    
    // Agregar una frase divertida ocasional
    if (Math.random() < 0.3) { // 30% de probabilidad
        const frasesDivertidas = [
            "📸 ¡Foto para el álbum!",
            "🎭 El drama que no sabíamos que necesitábamos",
            "🔮 El oráculo del amor ha hablado",
            "📱 Esto va directo a los chismes del grupo",
            "🎪 Señoras y señores, ¡tenemos espectáculo!",
            "📊 Estadística oficial del corazón",
            "🎲 Los dados del destino han decidido"
        ];
        
        const fraseAleatoria = frasesDivertidas[Math.floor(Math.random() * frasesDivertidas.length)];
        setTimeout(() => {
            anunciarInfo(fraseAleatoria);
        }, 1000);
    }
}

// FUNCIONES DE ESTADÍSTICAS DEL PARTIDO
function inicializarEstadisticas() {
    estadisticasPartido = {
        jugadores: {},
        golesRed: 0,
        golesBlue: 0,
        iniciado: true,
        duracion: 0,
        mejorJugador: null,
        arqueroRed: null,
        arqueroBlue: null,
        tiempoInicio: Date.now(),
        tiempoVallaInvictaRed: 0,
        tiempoVallaInvictaBlue: 0,
        tiempoEsperaSaque: 0, // Tiempo total de espera por saque después de goles
        tiempoEsperaSaqueRed: 0, // Tiempo de espera acumulado para el equipo rojo
        tiempoEsperaSaqueBlue: 0 // Tiempo de espera acumulado para el equipo azul
    };
    
    // Resetear contadores de cambios de camiseta por equipo al iniciar nuevo partido
    cambiosCamisetaRed = 0;
    cambiosCamisetaBlue = 0;
    
    // Inicializar replay para el nuevo partido
    replayData = null;
    replayActual = null;
    tiempoInicioPartido = Date.now();
    reporteEnviado = false; // Reset del flag de reporte enviado
    
        // Registrar jugadores iniciales
        const jugadores = room.getPlayerList();
        jugadores.forEach(jugador => {
            if (jugador.team !== 0) {
                const nombreOriginal = obtenerNombreOriginal(jugador);
                estadisticasPartido.jugadores[jugador.id] = {
                    nombre: nombreOriginal,
                    equipo: jugador.team,
                    goles: 0,
                    asistencias: 0,
                    autogoles: 0,
                    arquero: false,
                    tiempo: 0
                };
            }
        });
    
    anunciarInfo("📊 Estadísticas iniciadas para el partido");
}

async function registrarGol(goleador, equipo, asistente) {
    const statsGoleador = estadisticasPartido.jugadores[goleador.id];
    if (statsGoleador) {
        const nombreGoleador = obtenerNombreOriginal(goleador);
        
        // Obtener tiempo del gol
        const scores = room.getScores();
        const tiempoMinutos = Math.floor(scores.time / 60);
        const tiempoSegundos = Math.floor(scores.time % 60);
        const tiempoFormateado = `${tiempoMinutos.toString().padStart(2, '0')}:${tiempoSegundos.toString().padStart(2, '0')}`;
        
        // Calcular velocidad de disparo (simulada por ahora)
        const velocidadDisparo = (Math.random() * 20 + 10).toFixed(2);
        
        // CORRECCIÓN: Usar goleador.team en lugar de statsGoleador.equipo para verificar el equipo actual
        if (goleador.team === equipo) {
            statsGoleador.goles++;
            
            // Otorgar XP por gol con bonificación VIP de forma asíncrona para evitar lag
            setTimeout(async () => {
                if (vipBot) {
                    try {
                        const goalResult = await vipBot.onPlayerGoal(nombreGoleador, {});
                        if (goalResult && goalResult.xpMessage) {
                            // Mostrar mensaje con bonificación VIP si la hay
                            anunciarInfo(`🏆 ${goalResult.xpMessage}`);
                        }
                    } catch (error) {
                        console.error('❌ Error aplicando XP VIP por gol:', error);
                        // Fallback a XP normal si hay error
                        otorgarXP(nombreGoleador, 'gol');
                    }
                } else {
                    // Sistema XP normal si no hay sistema VIP
                    otorgarXP(nombreGoleador, 'gol');
                }
            }, 50);
            
            // Verificar si hay asistente válido primero para determinar el formato del mensaje
            let tieneAsistenciaValida = false;
            let nombreAsistente = "";
            let mensajeAsistenciaPersonalizado = "";
            
            if (asistente && asistente.id !== goleador.id) {
                const statsAsistente = estadisticasPartido.jugadores[asistente.id];
                if (statsAsistente && asistente.team === equipo) {
                    tieneAsistenciaValida = true;
                    nombreAsistente = obtenerNombreOriginal(asistente);
                    
                    // Registrar asistencia y XP con bonificación VIP de forma asíncrona
                    statsAsistente.asistencias++;
                    setTimeout(async () => {
                        if (vipBot) {
                            try {
                                const assistResult = await vipBot.onPlayerAssist(nombreAsistente, {});
                                if (assistResult && assistResult.xpMessage) {
                                    // Mostrar mensaje con bonificación VIP si la hay
                                    anunciarInfo(`🎖️ ${assistResult.xpMessage}`);
                                }
                            } catch (error) {
                                console.error('❌ Error aplicando XP VIP por asistencia:', error);
                                // Fallback a XP normal si hay error
                                otorgarXP(nombreAsistente, 'asistencia');
                            }
                        } else {
                            // Sistema XP normal si no hay sistema VIP
                            otorgarXP(nombreAsistente, 'asistencia');
                        }
                    }, 75);
                    
                    // Obtener mensaje personalizado de asistencia si existe
                    const mensajesAsistente = mensajesPersonalizados.get(asistente.id);
                    if (mensajesAsistente && mensajesAsistente.asistencia) {
                        mensajeAsistenciaPersonalizado = mensajesAsistente.asistencia;
                    }
                }
            }
            
            // 1. Anunciar el gol con el formato correcto según si hay asistencia personalizada
            // CORREGIDO: Usar jugadoresUID para obtener auth como en el sistema de admins
            let mensajeGolPersonalizado = null;
            const authGoleador = jugadoresUID.get(goleador.id); // Obtener auth guardado al conectarse
            console.log(`🎉 [GOL DEBUG] Buscando festejo para goleador ${nombreGoleador} (ID: ${goleador.id})`);
            console.log(`🎉 [GOL DEBUG] Auth guardado en jugadoresUID: ${authGoleador}`);
            console.log(`🎉 [GOL DEBUG] Función nodeObtenerMensajeFestejo disponible: ${typeof nodeObtenerMensajeFestejo === 'function'}`);
            
            if (authGoleador && typeof nodeObtenerMensajeFestejo === 'function') {
                try {
                    console.log(`🎉 [GOL DEBUG] Llamando nodeObtenerMensajeFestejo(${authGoleador}, 'gol')`);
                    mensajeGolPersonalizado = await nodeObtenerMensajeFestejo(authGoleador, 'gol');
                    console.log(`🎉 [GOL DEBUG] Respuesta de nodeObtenerMensajeFestejo: "${mensajeGolPersonalizado || 'null'}"`);
                } catch (error) {
                    console.error('❌ [GOL DEBUG] Error obteniendo mensaje de gol persistente:', error);
                }
            } else {
                console.log(`⚠️ [GOL DEBUG] No se pudo obtener mensaje de gol para ${nombreGoleador}: authGuardado=${authGoleador ? 'disponible' : 'no disponible'}, nodeObtenerMensajeFestejo=${typeof nodeObtenerMensajeFestejo === 'function' ? 'disponible' : 'no disponible'}`);
            }
            
            // Fallback al cache local si el sistema persistente no tiene el mensaje
            if (!mensajeGolPersonalizado && authGoleador) {
                console.log(`🔄 [GOL DEBUG] Buscando en cache local con auth: ${authGoleador}`);
                mensajeGolPersonalizado = obtenerMensajeDesdeCache(authGoleador, 'gol');
                console.log(`🔄 [GOL DEBUG] Mensaje encontrado en cache: "${mensajeGolPersonalizado || 'null'}"`);
            }
            
            // Fallback final al sistema temporal
            if (!mensajeGolPersonalizado) {
                console.log(`🔄 [GOL DEBUG] Buscando en sistema temporal con ID: ${goleador.id}`);
                const mensajesGoleador = mensajesPersonalizados.get(goleador.id);
                if (mensajesGoleador && mensajesGoleador.gol) {
                    mensajeGolPersonalizado = mensajesGoleador.gol;
                    console.log(`🔄 [GOL DEBUG] Mensaje encontrado en sistema temporal: "${mensajeGolPersonalizado}"`);
                } else {
                    console.log(`🔄 [GOL DEBUG] No se encontró mensaje en sistema temporal`);
                }
            }
            
            // Construir el mensaje base del gol
            let mensajeGolBase = "";
            
            if (mensajeGolPersonalizado) {
                // El goleador tiene mensaje personalizado
                mensajeGolBase = `🔵 [${tiempoFormateado}]  ⚽ ${mensajeGolPersonalizado}`;
            } else {
                // Mensaje estándar de gol
                mensajeGolBase = `🔵 [${tiempoFormateado}]  ⚽ Gol de ${nombreGoleador.toLowerCase()}`;
            }
            
            // Agregar información de asistencia solo si existe
            if (tieneAsistenciaValida) {
                // CORREGIDO: Usar jugadoresUID para obtener auth como en el sistema de admins
                let mensajeAsistenciaPersonalizado = null;
                const authAsistente = asistente ? jugadoresUID.get(asistente.id) : null; // Obtener auth guardado
                if (authAsistente && typeof nodeObtenerMensajeFestejo === 'function') {
                    try {
                        mensajeAsistenciaPersonalizado = await nodeObtenerMensajeFestejo(authAsistente, 'asistencia');
                        console.log(`🎯 [FESTEJOS DEBUG] Obtenido mensaje de asistencia persistente para ${nombreAsistente}: "${mensajeAsistenciaPersonalizado || 'null'}"`);
                    } catch (error) {
                        console.error('❌ Error obteniendo mensaje de asistencia persistente:', error);
                    }
                } else {
                    if (asistente) {
                        console.log(`⚠️ [FESTEJOS DEBUG] No se pudo obtener mensaje de asistencia para ${nombreAsistente}: authGuardado=${authAsistente ? 'disponible' : 'no disponible'}, nodeObtenerMensajeFestejo=${typeof nodeObtenerMensajeFestejo === 'function' ? 'disponible' : 'no disponible'}`);
                    }
                }
                
                // Fallback al cache local si el sistema persistente no tiene el mensaje
                if (!mensajeAsistenciaPersonalizado && authAsistente) {
                    mensajeAsistenciaPersonalizado = obtenerMensajeDesdeCache(authAsistente, 'asistencia');
                }
                
                // Fallback final al sistema temporal
                if (!mensajeAsistenciaPersonalizado) {
                    const mensajesAsistente = mensajesPersonalizados.get(asistente?.id);
                    if (mensajesAsistente && mensajesAsistente.asistencia) {
                        mensajeAsistenciaPersonalizado = mensajesAsistente.asistencia;
                    }
                }
                
                if (mensajeAsistenciaPersonalizado) {
                    // Hay asistencia con mensaje personalizado
                    mensajeGolBase += ` • ${mensajeAsistenciaPersonalizado}`;
                } else {
                    // Hay asistencia sin mensaje personalizado
                    mensajeGolBase += ` • Asistencia de ${nombreAsistente.toLowerCase()}`;
                }
            }
            
            // Agregar velocidad de disparo y cerrar el mensaje
            mensajeGolBase += ` • Velocidad de disparo: ${velocidadDisparo}km/h 🔵`;
            
            // Enviar el mensaje final
            anunciarGeneral(mensajeGolBase, COLORES.DORADO, "bold");

            // Asistencia ya procesada arriba y incluida en el mensaje del gol - no enviar mensaje separado
        } else {
            statsGoleador.autogoles++;
            // Formato autogol igual que gol normal pero con "Gol en contra"
            const mensajeAutogol = `🔵 [${tiempoFormateado}]  ⚽💀 Gol en contra de ${nombreGoleador.toLowerCase()} • Velocidad de disparo: ${velocidadDisparo}km/h 🔵`;
            anunciarGeneral(mensajeAutogol, "FF6B6B", "bold");
        }

        // Ya no necesitamos el bloque separado de asistencias porque se maneja arriba
    }

    if (equipo === 1) {
        estadisticasPartido.golesRed++;
    } else {
        estadisticasPartido.golesBlue++;
    }

    // Actualizar replay de forma asíncrona para evitar lag
    setTimeout(() => actualizarReplay(), 100);

    // Programar guardado con throttle para evitar guardado excesivo
    programarGuardadoThrottled();
}

function calcularPuntuacion(jugador) {
    // Definir un sistema simple de puntuación basado en métricas clave
    const golesPuntos = jugador.goles * 3;
    const asistenciasPuntos = jugador.asistencias * 2;
    const autogolesPuntos = jugador.autogoles * -2;
    const tiempoPuntos = Math.min(jugador.tiempo / 60, 2); // Máximo 2 puntos por tiempo en partido

    // Sumar todas las métricas para obtener una puntuación provisional
    let puntuacion = golesPuntos + asistenciasPuntos + autogolesPuntos + tiempoPuntos;

    // BONIFICACIÓN POR VICTORIA - Determinar equipo ganador
    const equipoGanador = estadisticasPartido.golesRed > estadisticasPartido.golesBlue ? 1 : 
                         estadisticasPartido.golesBlue > estadisticasPartido.golesRed ? 2 : 0;
    
    // Aplicar bonificaciones
    if (jugador.autogoles === 0) {
        puntuacion = Math.max(puntuacion, 4); // Mínimo 4 si no hay autogoles
    }
    
    if (equipoGanador !== 0 && jugador.equipo === equipoGanador) {
        puntuacion = Math.max(puntuacion, 7); // Mínimo 7 si ganas
    }

    // Bloquear puntuación entre 1 y 10
    puntuacion = Math.max(1, Math.min(Math.round(puntuacion), 10));
    
    return puntuacion;
}

function calcularMejorJugador() {
    let mejorJugador = null;
    let mejorPuntuacion = -1;
    
    Object.values(estadisticasPartido.jugadores).forEach(jugador => {
        // Calcular puntuación por partido
        jugador.puntuacionPartido = calcularPuntuacion(jugador);

        if (jugador.puntuacionPartido > mejorPuntuacion) {
            mejorPuntuacion = jugador.puntuacionPartido;
            mejorJugador = jugador;
        }
    });
    
    return mejorJugador;
}

// FUNCIÓN PARA CORREGIR POSICIONES DE SPAWN - CORREGIDA PARA EVITAR MOVIMIENTOS INCORRECTOS
function corregirPosicionesSpawn() {
    try {
        const jugadores = room.getPlayerList();
        const jugadoresEnEquipos = jugadores.filter(j => j.team === 1 || j.team === 2);
        
        if (jugadoresEnEquipos.length === 0) return;
        
        // Obtener configuraciones específicas del mapa - CORREGIDAS
        let configuracionMapa = {};
        
        // CORRECCIÓN CRÍTICA: Ajustar límites para solo corregir posiciones REALMENTE problemáticas
        switch(mapaActual) {
            case 'biggerx7':
                configuracionMapa = {
                    // Solo corregir si están DENTRO del arco (muy extremo)
                    limiteArcoIzquierdoPeligroso: -950,  // Muy dentro del arco
                    limiteArcoDerechoPeligroso: 950,     // Muy dentro del arco
                    posicionSeguraRoja: { x: -100, y: 0 },
                    posicionSeguraAzul: { x: 100, y: 0 }
                };
                break;
            case 'biggerx5':
                configuracionMapa = {
                    limiteArcoIzquierdoPeligroso: -600,  // Muy dentro del arco
                    limiteArcoDerechoPeligroso: 600,     // Muy dentro del arco
                    posicionSeguraRoja: { x: -100, y: 0 },
                    posicionSeguraAzul: { x: 100, y: 0 }
                };
                break;
            case 'biggerx3':
                configuracionMapa = {
                    limiteArcoIzquierdoPeligroso: -430,  // Muy dentro del arco
                    limiteArcoDerechoPeligroso: 430,     // Muy dentro del arco
                    posicionSeguraRoja: { x: -100, y: 0 },
                    posicionSeguraAzul: { x: 100, y: 0 }
                };
                break;
            case 'biggerx4':
                configuracionMapa = {
                    limiteArcoIzquierdoPeligroso: -530,  // Muy dentro del arco
                    limiteArcoDerechoPeligroso: 530,     // Muy dentro del arco
                    posicionSeguraRoja: { x: -100, y: 0 },
                    posicionSeguraAzul: { x: 100, y: 0 }
                };
                break;
            case 'biggerx1':
                configuracionMapa = {
                    limiteArcoIzquierdoPeligroso: -270,  // Muy dentro del arco
                    limiteArcoDerechoPeligroso: 270,     // Muy dentro del arco
                    posicionSeguraRoja: { x: -100, y: 0 },
                    posicionSeguraAzul: { x: 100, y: 0 }
                };
                break;
            default:
                // Para mapas no reconocidos, usar valores muy conservadores
                configuracionMapa = {
                    limiteArcoIzquierdoPeligroso: -400,
                    limiteArcoDerechoPeligroso: 400,
                    posicionSeguraRoja: { x: -100, y: 0 },
                    posicionSeguraAzul: { x: 100, y: 0 }
                };
        }
        
        let correccionesRealizadas = 0;
        let jugadoresRevisados = 0;
        
        // Verificar jugadores SOLO si están en posiciones realmente problemáticas
        jugadoresEnEquipos.forEach(jugador => {
            jugadoresRevisados++;
            
            if (!jugador.position) {
                // NO mover jugadores sin posición, dejar que Haxball maneje el spawn
                return;
            }
            
            const posX = jugador.position.x;
            const posY = jugador.position.y;
            let necesitaCorreccion = false;
            let nuevaX = posX;
            let nuevaY = posY;
            
            // CORRECCIÓN CRÍTICA: Solo mover si están en posiciones EXTREMADAMENTE problemáticas
            if (jugador.team === 1) {
                // Equipo rojo: Solo corregir si están MUY dentro del arco contrario (lado derecho)
                if (posX > configuracionMapa.limiteArcoDerechoPeligroso) {
                    nuevaX = configuracionMapa.posicionSeguraRoja.x;
                    necesitaCorreccion = true;
                    console.log(`🚨 DEBUG: Jugador rojo ${jugador.name} EN ARCO CONTRARIO (x:${posX}) -> corrigiendo a (x:${nuevaX})`);
                }
            } else if (jugador.team === 2) {
                // Equipo azul: Solo corregir si están MUY dentro del arco contrario (lado izquierdo)
                if (posX < configuracionMapa.limiteArcoIzquierdoPeligroso) {
                    nuevaX = configuracionMapa.posicionSeguraAzul.x;
                    necesitaCorreccion = true;
                    console.log(`🚨 DEBUG: Jugador azul ${jugador.name} EN ARCO CONTRARIO (x:${posX}) -> corrigiendo a (x:${nuevaX})`);
                }
            }
            
            // Corregir posiciones Y solo si están MUY fuera del campo
            if (Math.abs(posY) > 400) { // Aumentado de 250 a 400 para ser más permisivo
                nuevaY = 0;
                necesitaCorreccion = true;
                console.log(`🚨 DEBUG: Jugador ${jugador.name} MUY fuera del campo (y:${posY}) -> corrigiendo a (y:${nuevaY})`);
            }
            
            // Aplicar corrección SOLO si es realmente necesaria
            if (necesitaCorreccion) {
                try {
                    room.setPlayerDiscProperties(jugador.id, {
                        x: nuevaX,
                        y: nuevaY
                    });
                    correccionesRealizadas++;
                    console.log(`✅ DEBUG: Posición corregida para ${jugador.name}: (${posX}, ${posY}) -> (${nuevaX}, ${nuevaY})`);
                } catch (error) {
                    console.error(`❌ ERROR: No se pudo corregir posición de ${jugador.name}:`, error);
                }
            }
        });
        
        // Corrección de spawn completada silenciosamente
        
    } catch (error) {
        console.error("❌ ERROR en corregirPosicionesSpawn:", error);
    }
}

function detectarArqueros() {
    // Lógica simplificada: el jugador más cercano al arco
    const jugadores = room.getPlayerList();
    let arqueroRed = null, arqueroBlue = null;
    
    jugadores.forEach(jugador => {
        if (jugador.team === 1 && jugador.position) {
            if (!arqueroRed || jugador.position.x < arqueroRed.position.x) {
                arqueroRed = jugador;
            }
        } else if (jugador.team === 2 && jugador.position) {
            if (!arqueroBlue || jugador.position.x > arqueroBlue.position.x) {
                arqueroBlue = jugador;
            }
        }
    });
    
    if (arqueroRed) {
        estadisticasPartido.arqueroRed = arqueroRed.name;
        const stats = estadisticasPartido.jugadores[arqueroRed.id];
        if (stats) stats.arquero = true;
    }
    
    if (arqueroBlue) {
        estadisticasPartido.arqueroBlue = arqueroBlue.name;
        const stats = estadisticasPartido.jugadores[arqueroBlue.id];
        if (stats) stats.arquero = true;
    }
}

// FUNCIÓN PARA ACTUALIZAR REPLAY (durante el partido)
function actualizarReplay() {
    try {
        // Durante el partido, solo usar getReplay para no interrumpir la grabación
        if (typeof room.getReplay === 'function') {
            replayData = room.getReplay();
        }
        
        if (replayData) {
            replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}`;
        } else {
            // Crear identificador para el replay aunque no tengamos datos
            replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}`;
        }
    } catch (error) {
        replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}_error`;
    }
}

// FUNCIÓN PARA FINALIZAR REPLAY (al terminar el partido)
function finalizarReplay() {
    try {
        // Al final del partido, detener definitivamente la grabación
        if (typeof room.stopRecording === 'function') {
            replayData = room.stopRecording();
            console.log("🎬 Grabación de replay finalizada");
        } else if (typeof room.getReplay === 'function') {
            replayData = room.getReplay();
        }
        
        if (replayData) {
            replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}`;
            console.log(`🎬 Replay final capturado: ${replayActual}`);
        } else {
            // Crear identificador para el replay aunque no tengamos datos
            replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}`;
            console.log(`⚠️ Replay final sin datos: ${replayActual}`);
        }
    } catch (error) {
        console.log("❌ Error al finalizar replay:", error);
        replayActual = `Replay_${Date.now()}_${estadisticasPartido.golesRed}_${estadisticasPartido.golesBlue}_error`;
    }
}

// FUNCIÓN PARA GUARDAR REPLAY EN PC (solo para referencia)
function guardarReplayEnPC() {
    if (!guardarReplaysEnPC) return;
    
    try {
        if (replayData && typeof window !== 'undefined' && window.URL) {
            // Solo funciona en navegador
            const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const nombreArchivo = `LNB_${fecha}_${estadisticasPartido.golesRed}-${estadisticasPartido.golesBlue}.hbr2`;
            
            const blob = new Blob([replayData], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = nombreArchivo;
            a.click();
            window.URL.revokeObjectURL(url);
            
            anunciarExito(`💾 Replay guardado: ${nombreArchivo}`);
        } else {
        }
    } catch (error) {
    }
}

// FUNCIÓN PARA ENVIAR REPORTE A DISCORD CON REPLAY
function enviarReportePartidoDiscord() {
    // Evitar envíos duplicados
    if (reporteEnviado) {
        return;
    }
    
    // Validar duración mínima del partido
    // EXCEPCIÓN: Si el partido terminó por diferencia de gol (límite alcanzado), enviar igual
    const scores = room.getScores();
    const terminoPorGoles = scores && scores.scoreLimit > 0 && 
        (estadisticasPartido.golesRed >= scores.scoreLimit || estadisticasPartido.golesBlue >= scores.scoreLimit);
    
    // Debug: Mostrar información de scores para diagnosticar
    
    // Verificar límite de goles del mapa actual como respaldo
    let limiteGolesRespaldo = 0;
    if (mapaActual === "biggerx1") {
        limiteGolesRespaldo = 3;
    } else if (mapaActual === "biggerx3") {
        limiteGolesRespaldo = 5;
    } else if (mapaActual === "biggerx5") {
        limiteGolesRespaldo = 4;
    } else if (mapaActual === "biggerx7") {
        limiteGolesRespaldo = 5;
    }
    
    const terminoPorGolesRespaldo = limiteGolesRespaldo > 0 && 
        (estadisticasPartido.golesRed >= limiteGolesRespaldo || estadisticasPartido.golesBlue >= limiteGolesRespaldo);
    
    
    const terminoEfectivoPorGoles = terminoPorGoles || terminoPorGolesRespaldo;
    
    if (estadisticasPartido.duracion < segundosMinimoPartido && !terminoEfectivoPorGoles) {
        anunciarInfo(`⚠️ Partido muy corto para generar reporte (${Math.floor(estadisticasPartido.duracion/60)}:${(estadisticasPartido.duracion%60).toString().padStart(2,'0')} < ${Math.floor(segundosMinimoPartido/60)}:${(segundosMinimoPartido%60).toString().padStart(2,'0')})`);
        return;
    }
    
    // Si terminó por goles y fue corto, mostrar mensaje explicativo
    if (estadisticasPartido.duracion < segundosMinimoPartido && terminoEfectivoPorGoles) {
        // Mensaje removido
    }
    
    if (!validarMapaPersonalizado()) return;
    
    const duracionMinutos = Math.floor(estadisticasPartido.duracion / 60);
    const duracionSegundos = estadisticasPartido.duracion % 60;
    
    // Verificar si debe enviar replay
    const debeEnviarReplay = enviarReplaysDiscord && guardarReplaysAmistosos;
    
    // Generar reporte con la nueva estética
    const mejorJugador = calcularMejorJugador();
    
    // Separar jugadores por equipos
    const jugadoresRed = Object.values(estadisticasPartido.jugadores).filter(j => j.equipo === 1);
    const jugadoresBlue = Object.values(estadisticasPartido.jugadores).filter(j => j.equipo === 2);
    
    // Crear listas de jugadores para cada equipo
    const listaRed = jugadoresRed.map(j => j.nombre).join(" - ") || "Sin jugadores";
    const listaBlue = jugadoresBlue.map(j => j.nombre).join(" - ") || "Sin jugadores";
    
// Crear lista de goles RED (incluir autogoles de jugadores del equipo contrario)
    let golesRed = [];
    
    // Goles normales del equipo rojo
    jugadoresRed.forEach(j => {
        if (j.goles > 0) {
            golesRed.push(`${j.nombre} x${j.goles}`);
        }
    });
    
    // Autogoles del equipo azul que suman al rojo
    jugadoresBlue.forEach(j => {
        if (j.autogoles > 0) {
            golesRed.push(`${j.nombre} (e/c) x${j.autogoles}`);
        }
    });
    
    const golesRedTexto = golesRed.join(", ") || "---";

    // Crear lista de goles BLUE (incluir autogoles de jugadores del equipo contrario)
    let golesBlue = [];
    
    // Goles normales del equipo azul
    jugadoresBlue.forEach(j => {
        if (j.goles > 0) {
            golesBlue.push(`${j.nombre} x${j.goles}`);
        }
    });
    
    // Autogoles del equipo rojo que suman al azul
    jugadoresRed.forEach(j => {
        if (j.autogoles > 0) {
            golesBlue.push(`${j.nombre} (e/c) x${j.autogoles}`);
        }
    });
    
    const golesBlueTexto = golesBlue.join(", ") || "---";
    
    // Crear lista de asistencias RED
    const asistenciasRed = jugadoresRed
        .filter(j => j.asistencias > 0)
        .map(j => `${j.nombre} x${j.asistencias}`)
        .join(", ");
    
    // Crear lista de asistencias BLUE
    const asistenciasBlue = jugadoresBlue
        .filter(j => j.asistencias > 0)
        .map(j => `${j.nombre} x${j.asistencias}`)
        .join(", ");
    
    // Crear top 3 mejores jugadores (excluyendo al MVP)
    const todosJugadores = Object.values(estadisticasPartido.jugadores)
        .filter(j => mejorJugador ? j.nombre !== mejorJugador.nombre : true)
        .map(j => ({...j, puntuacion: (j.goles * 3) + (j.asistencias * 2) - (j.autogoles * 2)}))
        .sort((a, b) => b.puntuacion - a.puntuacion)
        .slice(0, 3);
    
    const top3 = todosJugadores.map(j => j.nombre).join(", ");
    
    // Calcular tiempos de valla invicta correctamente
    let tiempoVallaRealRed, tiempoVallaRealBlue;
    
    if (estadisticasPartido.golesBlue === 0) {
        // Equipo rojo no recibió goles: tiempo total del partido
        const scores = room.getScores();
        tiempoVallaRealRed = scores ? Math.floor(scores.time) : estadisticasPartido.duracion;
    } else {
        // Equipo rojo recibió goles: tiempo hasta el primer gol
        tiempoVallaRealRed = estadisticasPartido.tiempoVallaInvictaRed;
    }
    
    if (estadisticasPartido.golesRed === 0) {
        // Equipo azul no recibió goles: tiempo total del partido
        const scores = room.getScores();
        tiempoVallaRealBlue = scores ? Math.floor(scores.time) : estadisticasPartido.duracion;
    } else {
        // Equipo azul recibió goles: tiempo hasta el primer gol
        tiempoVallaRealBlue = estadisticasPartido.tiempoVallaInvictaBlue;
    }
    
    // Asegurar que los tiempos no sean negativos
    tiempoVallaRealRed = Math.max(0, tiempoVallaRealRed);
    tiempoVallaRealBlue = Math.max(0, tiempoVallaRealBlue);
    
    const minVallaRed = Math.floor(tiempoVallaRealRed / 60);
    const segVallaRed = tiempoVallaRealRed % 60;
    const minVallaBlue = Math.floor(tiempoVallaRealBlue / 60);
    const segVallaBlue = tiempoVallaRealBlue % 60;
    
    // Generar el reporte con la nueva estética
    const reporteTexto = `RED  ${estadisticasPartido.golesRed} - ${estadisticasPartido.golesBlue}  BLUE
🔴 :  ${listaRed}
🔵 :  ${listaBlue}

⚽🔴 : ${golesRedTexto || "---"}
👟🔴 : ${asistenciasRed || "---"}
🥅🔴 : ${estadisticasPartido.arqueroRed || "---"} ${minVallaRed}:${segVallaRed.toString().padStart(2, "0")}

⚽🔵 : ${golesBlueTexto || "---"}
👟🔵 : ${asistenciasBlue || "---"}
🥅🔵 : ${estadisticasPartido.arqueroBlue || "---"} ${minVallaBlue}:${segVallaBlue.toString().padStart(2, "0")}

⭐ : ${mejorJugador ? mejorJugador.nombre : "---"}

🏅 : ${top3 || "---"}

Script by ИФT`;
    
    const embed = {
        title: "🏆 REPORTE DE PARTIDO LNB",
        description: reporteTexto,
        color: parseInt(AZUL_LNB, 16),
        fields: [
            {
                name: "🗺️ Mapa",
                value: mapas[mapaActual].nombre,
                inline: true
            },
            {
                name: "⏱️ Duración",
                value: `${duracionMinutos}:${duracionSegundos.toString().padStart(2, "0")}`,
                inline: true
            }
        ],
        footer: {
            text: "Liga Nacional de Bigger LNB • " + new Date().toLocaleString('es-AR', { 
                timeZone: 'America/Argentina/Buenos_Aires',
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: false 
            })
        }
    };
    
    
    // Payload base
    const payload = {
content: "",
        embeds: [embed]
    };

    // Enviar primero el informe de estadísticas
    enviarInforme(payload, debeEnviarReplay);
}

// FUNCIÓN PARA LIBERAR BLOQUEO DE REPLAY
function liberarBloqueoReplay(mensaje = "Envío de replay completado") {
    console.log(`🔓 DEBUG: ${mensaje} - liberando bloqueo`);
    bloqueadoPorReplay = false;
    intentosAutoStartBloqueados = 0;
    
    // Verificar auto-start después de liberar el bloqueo
    setTimeout(() => {
        console.log(`🔓 DEBUG: Verificando auto-start después de liberar bloqueo`);
        verificarAutoStart();
    }, 1000);
}

// FUNCIÓN PARA ENVIAR INFORME PRIMERO
function enviarInforme(payload, debeEnviarReplay) {
    // Seleccionar webhook según modo oficial
    const webhookUrl = discordWebhook;
    
    if (webhookUrl && webhookUrl.length > 0) {
        fetch(webhookUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                // No enviar mensaje individual de informe
                
                // Si debe enviar replay, enviarlo después del informe
                if (debeEnviarReplay && replayData && typeof FormData !== 'undefined') {
                    setTimeout(() => {
                        enviarReplay();
                    }, 1000); // Reducir espera entre informe y replay
                } else {
                    reporteEnviado = true; // Marcar como completado si no hay replay
                    // Enviar mensaje unificado cuando no hay replay
                    anunciarExito("📤🎬 Informe de estadísticas y Replay enviados a Discord exitosamente");
                    liberarBloqueoReplay("Informe enviado sin replay");
                }
            } else {
                anunciarError("❌ Error al enviar informe a Discord", null);
                reporteEnviado = true;
                liberarBloqueoReplay("Error al enviar informe");
            }
        })
        .catch(error => {
            anunciarError("❌ Error de conexión al enviar informe a Discord", null);
            reporteEnviado = true;
            liberarBloqueoReplay("Error de conexión al enviar informe");
        });
    } else {
        console.log("❌ DEBUG: No hay webhook configurado para enviar informe");
        reporteEnviado = true;
        liberarBloqueoReplay("No hay webhook configurado");
    }
}

// FUNCIÓN PARA ENVIAR REPLAY SEPARADO
function enviarReplay() {
    try {
        const formData = new FormData();
        
        // Crear archivo de replay
        const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const nombreArchivo = `LNB_${fecha}_${estadisticasPartido.golesRed}-${estadisticasPartido.golesBlue}.hbr2`;
        const blob = new Blob([replayData], { type: 'application/octet-stream' });
        
        // Payload vacío para el replay (solo archivo)
        const replayPayload = {
            content: ""
        };
        
        formData.append('payload_json', JSON.stringify(replayPayload));
        formData.append('files[0]', blob, nombreArchivo);
        
        // Seleccionar webhook según modo oficial
        const webhookUrl = discordWebhook;
        
        fetch(webhookUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                reporteEnviado = true; // Marcar como completado
                anunciarExito("📤🎬 Informe de estadísticas y Replay enviados a Discord exitosamente");
                liberarBloqueoReplay("Replay enviado exitosamente");
            } else {
                anunciarError("❌ Error al enviar replay a Discord", null);
                reporteEnviado = true; // Marcar como completado aunque falle el replay
                liberarBloqueoReplay("Error al enviar replay");
            }
        })
        .catch(error => {
            anunciarError("❌ Error de conexión al enviar replay a Discord", null);
            reporteEnviado = true; // Marcar como completado aunque falle el replay
            liberarBloqueoReplay("Error de conexión al enviar replay");
        });
    } catch (error) {
        reporteEnviado = true; // Marcar como completado aunque falle el replay
        liberarBloqueoReplay("Excepción al enviar replay");
    }
}

// FUNCIÓN PARA ENVIAR CON REPLAY (solo navegador)
function enviarConReplay(payload) {
    try {
        const formData = new FormData();
        
        // Crear archivo de replay
        const fecha = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const nombreArchivo = `LNB_${fecha}_${estadisticasPartido.golesRed}-${estadisticasPartido.golesBlue}.hbr2`;
        const blob = new Blob([replayData], { type: 'application/octet-stream' });
        
        formData.append('payload_json', JSON.stringify(payload));
        formData.append('files[0]', blob, nombreArchivo);
        
        fetch(discordWebhook, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                reporteEnviado = true; // Marcar como enviado exitosamente
                anunciarExito("📤 Reporte y replay enviados a Discord exitosamente");
                liberarBloqueoReplay("Reporte y replay enviados exitosamente");
            } else {
                anunciarError("❌ Error al enviar reporte con replay a Discord", null);
                // Intentar envío sin replay como respaldo
                enviarSinReplay(payload, false);
            }
        })
        .catch(error => {
            anunciarError("❌ Error de conexión al enviar replay a Discord", null);
            // Intentar envío sin replay como respaldo
            enviarSinReplay(payload, false);
        });
    } catch (error) {
        enviarSinReplay(payload, false);
    }
}

// FUNCIÓN PARA ENVIAR SIN REPLAY
function enviarSinReplay(payload, incluyeNotaReplay = false) {
    if (incluyeNotaReplay) {
        payload.content += "\n🎬 *Replay disponible - contacta admin para obtenerlo*";
    }
    
    // Seleccionar webhook según modo oficial
    const webhookUrl = modoOficial ? webhookOficial : discordWebhook;
    
    if (webhookUrl && webhookUrl.length > 0) {
        fetch(webhookUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                reporteEnviado = true; // Marcar como enviado exitosamente
                const mensaje = incluyeNotaReplay ? 
                    "📤 Reporte enviado a Discord (replay disponible localmente)" : 
                    "📤 Reporte enviado a Discord exitosamente";
                anunciarExito(mensaje);
                liberarBloqueoReplay("Reporte enviado sin replay");
            } else {
                anunciarError("❌ Error al enviar reporte a Discord", null);
                reporteEnviado = true;
                liberarBloqueoReplay("Error al enviar reporte sin replay");
            }
        })
        .catch(error => {
            anunciarError("❌ Error de conexión con Discord", null);
            reporteEnviado = true;
            liberarBloqueoReplay("Error de conexión al enviar reporte sin replay");
        });
    }
}

// FUNCIÓN PARA LLAMAR ADMIN
function llamarAdmin(jugador, mensaje) {
// Verificar número mínimo de jugadores (5)
    const jugadores = room.getPlayerList();
    const jugadoresEnHost = jugadores.filter(j => !esBot(j)).length;
    if (jugadoresEnHost < 5) {
        anunciarError("❌ Se necesitan al menos 5 jugadores para llamar admin", jugador);
        return;
    }

    // Verificar cooldown de 30 minutos
    const tiempoActual = Date.now();
    const tiempoRestanteCooldown = cooldownLlamarAdmin.duracionCooldown - (tiempoActual - cooldownLlamarAdmin.ultimoUso);
    
    if (tiempoRestanteCooldown > 0) {
        const minutosRestantes = Math.ceil(tiempoRestanteCooldown / (60 * 1000));
anunciarError(`⏰ El comando !llamaradmin está en cooldown. Tiempo restante: ${minutosRestantes} minutos`, jugador);
        return;
    }
    
    
    // Obtener jugadores activos en los equipos
    const jugadoresEnEquipos = jugadores.filter(j => j.team === 1 || j.team === 2);
    const totalJugadores = jugadoresEnEquipos.length;
    
    // Definir votantes mínimos según el mapa
    let votantesMinimos;
    if (mapaActual === "biggerx5") {
        votantesMinimos = 5;
    } else if (mapaActual === "biggerx7") {
        votantesMinimos = 8;
    } else {
        votantesMinimos = 3; // Por defecto para otros mapas
    }
    
    // Verificar si hay suficientes jugadores para la votación
    if (totalJugadores < votantesMinimos) {
anunciarError(`❌ Se necesitan al menos ${votantesMinimos} jugadores en ${mapaActual} para usar !llamaradmin. Actualmente hay ${totalJugadores}`, jugador);
        return;
    }
    
    // Verificar si ya hay una votación activa
    if (votacionLlamarAdmin.activa) {
        // Si es el mismo jugador, mostrar estado
        if (votacionLlamarAdmin.iniciador.id === jugador.id) {
            const tiempoRestante = Math.max(0, 60 - Math.floor((Date.now() - votacionLlamarAdmin.tiempoInicio) / 1000));
            anunciarInfo(`⏳ Tu votación está activa. Votos: ${votacionLlamarAdmin.votos.size}/${votantesMinimos}. Tiempo restante: ${tiempoRestante}s`);
            return;
        }
        
        // Si es otro jugador, verificar si ya votó
        if (votacionLlamarAdmin.votos.has(jugador.id)) {
anunciarError("❌ Ya has votado en la votación actual", jugador);
            return;
        }
        
        // Agregar voto
        votacionLlamarAdmin.votos.add(jugador.id);
        
        // Mostrar el motivo nuevamente cuando alguien vota (en color amarillo como el de gol)
        anunciarGeneral(`🚨 MOTIVO: "${votacionLlamarAdmin.mensaje.toUpperCase()}"`, COLORES.DORADO, "bold");
        
        // Mostrar votos actuales en color amarillo como el de gol
        anunciarGeneral(`🗳️ ${jugador.name.toUpperCase()} VOTÓ PARA LLAMAR ADMIN. VOTOS: ${votacionLlamarAdmin.votos.size}/${votantesMinimos}`, COLORES.DORADO, "bold");
        
        // Verificar si se alcanzó el mínimo
        if (votacionLlamarAdmin.votos.size >= votantesMinimos) {
            enviarSolicitudAdmin(votacionLlamarAdmin.iniciador, votacionLlamarAdmin.mensaje, votacionLlamarAdmin.votos.size);
            limpiarVotacion();
        }
        return;
    }
    
    // Iniciar nueva votación
    votacionLlamarAdmin = {
        activa: true,
        iniciador: jugador,
        mensaje: mensaje,
        votos: new Set([jugador.id]), // El iniciador vota automáticamente
        tiempoInicio: Date.now(),
        timeout: null
    };
    
    // Configurar timeout de 60 segundos
    votacionLlamarAdmin.timeout = setTimeout(() => {
        if (votacionLlamarAdmin.activa) {
anunciarAdvertencia(`⏰ TIEMPO AGOTADO PARA LA VOTACIÓN DE LLAMAR ADMIN. SE OBTUVIERON ${votacionLlamarAdmin.votos.size}/${votantesMinimos} VOTOS`, jugador);
            limpiarVotacion();
        }
    }, 60000);
    
    // Anunciar votación
anunciarAdvertencia(`🚨 ${jugador.name.toUpperCase()} QUIERE LLAMAR A UN ADMIN: "${mensaje.toUpperCase()}"`, jugador);
    anunciarInfo(`🗳️ ESCRIBAN !LLAMARADMIN PARA VOTAR. SE NECESITAN ${votantesMinimos} VOTOS. TIEMPO: 60 SEGUNDOS`);
    anunciarInfo(`📊 VOTOS ACTUALES: 1/${votantesMinimos}`);
}

// FUNCIÓN PARA ENVIAR SOLICITUD DE ADMIN
function enviarSolicitudAdmin(iniciador, mensaje, totalVotos) {
    const embed = {
        title: "🚨 SOLICITUD DE ADMIN APROBADA",
        description: `**Jugador:** ${iniciador.name}\n**Mensaje:** ${mensaje}\n**Votos obtenidos:** ${totalVotos}\n**Mapa:** ${mapas[mapaActual].nombre}`,
        color: parseInt("FF0000", 16), // Color rojo para alertas
        timestamp: new Date().toISOString(),
        footer: {
            text: "Liga Nacional de Bigger LNB • Solicitud de Admin"
        }
    };
    
    const payload = {
        content: "🚨 **UN JUGADOR NECESITA AYUDA DE UN ADMIN** 🚨 <@&1389653604461183037>",
        embeds: [embed]
    };
    
    if (webhookLlamarAdmin && webhookLlamarAdmin.length > 0) {
        fetch(webhookLlamarAdmin, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (response.ok) {
                // Activar cooldown después del envío exitoso
                cooldownLlamarAdmin.ultimoUso = Date.now();
                anunciarExito(`🚨 ¡SOLICITUD DE ADMIN ENVIADA CON ${totalVotos} VOTOS!`);
                anunciarInfo("📱 UN ADMIN SERÁ NOTIFICADO EN DISCORD Y VENDRÁ A AYUDARTE");
                anunciarInfo("⏰ COOLDOWN DE 30 MINUTOS ACTIVADO PARA PRÓXIMAS SOLICITUDES");
            } else {
anunciarError("❌ Error al enviar mensaje a los administradores", null);
            }
        })
        .catch(error => {
anunciarError("❌ Error de conexión al enviar mensaje a admins", null);
        });
    } else {
anunciarError("❌ Webhook de administradores no configurado", null);
    }
}

// FUNCIÓN PARA LIMPIAR VOTACIÓN
function limpiarVotacion() {
    if (votacionLlamarAdmin.timeout) {
        clearTimeout(votacionLlamarAdmin.timeout);
    }
    votacionLlamarAdmin = {
        activa: false,
        iniciador: null,
        mensaje: "",
        votos: new Set(),
        tiempoInicio: 0,
        timeout: null
    };
}

// FUNCIÓN PARA ENVIAR NOTIFICACIÓN DE CLEARBANS AL WEBHOOK
function enviarNotificacionClearBans(adminNombre, tipoLimpieza, jugadoresLimpiados, ipsLimpiadas) {
    if (!webhookBanKick || webhookBanKick.length === 0) {
        return;
    }
    
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-AR');
    const hora = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    
    let mensaje = "";
    let accionTexto = "";
    let detalles = "";
    
    switch (tipoLimpieza) {
        case "completa":
            accionTexto = "ejecutó limpieza COMPLETA de baneos";
            detalles = `🧹 Todos los baneos de HaxBall limpiados + ${ipsLimpiadas} IP(s) desbloqueadas | 💡 Resuelve desincronizaciones BD/HaxBall`;
            break;
        case "masiva":
            accionTexto = "ejecutó limpieza MASIVA de baneos";
            detalles = `🔨 ${jugadoresLimpiados} jugadores desbaneados + ${ipsLimpiadas} IP(s) limpiadas`;
            break;
        case "masiva_solo_haxball":
            accionTexto = "ejecutó limpieza MASIVA (solo HaxBall)";
            detalles = `🔨 ${jugadoresLimpiados} jugadores procesados | ⚠️ BD no actualizada`;
            break;
        case "alternativa_24h":
            accionTexto = "ejecutó limpieza de baneos (24h)";
            detalles = `⏰ ${jugadoresLimpiados} jugadores de últimas 24h procesados`;
            break;
        default:
            accionTexto = "ejecutó limpieza de baneos";
            detalles = `${jugadoresLimpiados} jugadores procesados`;
    }
    
    mensaje = `\`\`\`🧹 [${fecha}, ${hora}] 🛡️ ${adminNombre} ${accionTexto} | ${detalles}\`\`\``;
    
    const payload = {
        content: mensaje
    };
    
    fetch(webhookBanKick, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log(`📤 Notificación de clearbans enviada a Discord: ${tipoLimpieza}`);
        } else {
            console.error(`❌ Error enviando notificación clearbans: ${response.status}`);
        }
    })
    .catch(error => {
        console.error(`❌ Error de conexión enviando notificación clearbans:`, error);
    });
}

// FUNCIÓN PARA ENVIAR NOTIFICACIÓN DE MUTE AL WEBHOOK DE MODERACIÓN
function enviarNotificacionMute(tipo, adminNombre, jugadorNombre, jugadorID, duracion = null, razon = "No especificada") {
    if (!webhookBanKick || webhookBanKick.length === 0) {
        return;
    }
    
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-AR');
    const hora = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    
    let mensaje = "";
    let accionTexto = "";
    
    if (tipo === "mute") {
        accionTexto = "muteó a";
        if (duracion) {
            mensaje = `\`\`\`🔇 [${fecha}, ${hora}] 🤐 ${adminNombre} (ID: ${room.getPlayerList().find(p => p.name === adminNombre)?.id || 'N/A'}) ${accionTexto} ${jugadorNombre} (ID: ${jugadorID}) por 🕒 ${duracion} minutos | 📄 Motivo: ${razon}\`\`\``;
        } else {
            mensaje = `\`\`\`🔇 [${fecha}, ${hora}] 🤐 ${adminNombre} (ID: ${room.getPlayerList().find(p => p.name === adminNombre)?.id || 'N/A'}) ${accionTexto} ${jugadorNombre} (ID: ${jugadorID}) permanentemente | 📄 Motivo: ${razon}\`\`\``;
        }
    } else if (tipo === "unmute") {
        accionTexto = "desmuteó a";
        mensaje = `\`\`\`🔊 [${fecha}, ${hora}] 🗣️ ${adminNombre} (ID: ${room.getPlayerList().find(p => p.name === adminNombre)?.id || 'N/A'}) ${accionTexto} ${jugadorNombre} (ID: ${jugadorID}) | 📄 Motivo: Desmuteo manual\`\`\``;
    }
    
    const payload = {
        content: mensaje
    };
    
    fetch(webhookBanKick, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log(`✅ Notificación de ${tipo} enviada al webhook`);
        } else {
            console.warn(`⚠️ Error enviando notificación de ${tipo} al webhook:`, response.status);
        }
    })
    .catch(error => {
        console.error(`❌ Error enviando notificación de ${tipo} al webhook:`, error);
    });
}

// FUNCIÓN PARA ENVIAR NOTIFICACIÓN DE BAN/KICK AL WEBHOOK
function enviarNotificacionBanKick(tipo, adminNombre, jugadorNombre, jugadorIDOUID, duracion = null, razon = "No especificada", ipJugador = null, jugadorIDReal = null) {
    if (!webhookBanKick || webhookBanKick.length === 0) {
        return;
    }
    
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString('es-AR');
    const hora = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    
    let mensaje = "";
    let accionTexto = "";
    
    // Preparar información de IP si está disponible
    const infoIP = ipJugador ? ` | 🌐 IP: ${ipJugador}` : "";
    
    // Usar el ID real del jugador si está disponible, sino usar el UID
    const idParaMostrar = jugadorIDReal || jugadorIDOUID;
    
    if (tipo === "ban") {
        accionTexto = "baneó a";
        if (duracion) {
            mensaje = `\`\`\`⛔ [${fecha}, ${hora}] 🔨 ${adminNombre} (ID: ${room.getPlayerList().find(p => p.name === adminNombre)?.id || 'N/A'}) ${accionTexto} ${jugadorNombre} (ID: ${idParaMostrar}) por 🕒 ${duracion} | 📄 Motivo: ${razon}\`\`\``;
        } else {
            mensaje = `\`\`\`⛔ [${fecha}, ${hora}] 🔨 ${adminNombre} (ID: ${room.getPlayerList().find(p => p.name === adminNombre)?.id || 'N/A'}) ${accionTexto} ${jugadorNombre} (ID: ${idParaMostrar}) permanentemente
        } | 📄 Motivo: ${razon}\`\`\``;
        }
    } else if (tipo === "kick") {
        accionTexto = "expulsó a";
        mensaje = `\`\`\`⛔ [${fecha}, ${hora}] 🦵 ${adminNombre} (ID: ${room.getPlayerList().find(p => p.name === adminNombre)?.id || 'N/A'}) ${accionTexto} ${jugadorNombre} (ID: ${idParaMostrar}) | 📄 Motivo: ${razon}\`\`\``;
    }
    
    const payload = {
        content: mensaje
    };
    
    fetch(webhookBanKick, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
        } else {
        }
    })
    .catch(error => {
    });
}

// FUNCIÓN PARA MOSTRAR PUNTUACIONES DEL PARTIDO
function mostrarPuntuacionesPartido() {
    if (!estadisticasPartido.iniciado) return;
    
    // Obtener todos los jugadores con sus puntuaciones
    const jugadoresConPuntuacion = Object.values(estadisticasPartido.jugadores)
        .map(jugador => ({
            ...jugador,
            puntuacion: calcularPuntuacion(jugador)
        }))
        .sort((a, b) => b.puntuacion - a.puntuacion);
    
    // Mostrar top 3 puntuaciones
    anunciarGeneral("🏆 ══════════ PUNTUACIONES DEL PARTIDO ══════════ 🏆", COLORES.DORADO, "bold");
    
    jugadoresConPuntuacion.slice(0, 3).forEach((jugador, index) => {
        const medallas = ["🥇", "🥈", "🥉"];
        const medalla = medallas[index] || "🏅";
        const equipoColor = jugador.equipo === 1 ? "🔴" : "🔵";
        
        anunciarGeneral(
            `${medalla} ${equipoColor} ${jugador.nombre}: ${jugador.puntuacion}/10 (⚽${jugador.goles} 🎯${jugador.asistencias})`,
            COLORES.DORADO,
            "bold"
        );
    });
    
    // Mostrar puntuaciones de todos los demás jugadores
    if (jugadoresConPuntuacion.length > 3) {
        anunciarGeneral("📊 Otras puntuaciones:", COLORES.INFO);
        
        jugadoresConPuntuacion.slice(3).forEach(jugador => {
            const equipoColor = jugador.equipo === 1 ? "🔴" : "🔵";
            anunciarGeneral(
                `${equipoColor} ${jugador.nombre}: ${jugador.puntuacion}/10`,
                COLORES.GRIS
            );
        });
    }
    
    anunciarGeneral("═══════════════════════════════════════════════════════", COLORES.DORADO, "bold");
}

// FUNCIÓN PARA ENVIAR PUNTUACIONES PRIVADAS AL FINALIZAR PARTIDO
function enviarPuntuacionesPrivadas() {
    if (!estadisticasPartido.iniciado) return;
    
    // Obtener todos los jugadores conectados
    const jugadoresConectados = room.getPlayerList();
    
    // Enviar puntuación a cada jugador que participó en el partido
    Object.entries(estadisticasPartido.jugadores).forEach(([playerId, statsJugador]) => {
        // Verificar si el jugador aún está conectado
        const jugadorConectado = jugadoresConectados.find(j => j.id === parseInt(playerId));
        
        if (jugadorConectado) {
            const puntuacion = calcularPuntuacion(statsJugador);
            const equipoColor = statsJugador.equipo === 1 ? "🔴" : "🔵";
            
            // Determinar el mensaje según la puntuación
            let mensajeCalificacion = "";
            if (puntuacion >= 9) {
                mensajeCalificacion = "🌟 ¡EXCELENTE PARTIDO!";
            } else if (puntuacion >= 7) {
                mensajeCalificacion = "👏 ¡Muy buen partido!";
            } else if (puntuacion >= 5) {
                mensajeCalificacion = "👍 Buen partido";
            } else if (puntuacion >= 3) {
                mensajeCalificacion = "📈 Puedes mejorar";
            } else {
                mensajeCalificacion = "💪 ¡Sigue practicando!";
            }
            
            // Enviar mensajes privados al jugador
            room.sendAnnouncement(
                `🏆 ══════════ TU RENDIMIENTO EN EL PARTIDO ══════════ 🏆`,
                jugadorConectado.id,
                parseInt(COLORES.DORADO, 16),
                "bold",
                0
            );
            
            room.sendAnnouncement(
                `📊 PUNTUACIÓN FINAL: ${puntuacion}/10 ${mensajeCalificacion}`,
                jugadorConectado.id,
                parseInt(COLORES.DORADO, 16),
                "bold",
                0
            );
            
            room.sendAnnouncement(
                `${equipoColor} ⚽ Goles: ${statsJugador.goles} | 🎯 Asistencias: ${statsJugador.asistencias} | 💀 Autogoles: ${statsJugador.autogoles}`,
                jugadorConectado.id,
                parseInt(COLORES.INFO, 16),
                "normal",
                0
            );
            
            // Agregar Discord
            room.sendAnnouncement(
                `━━━━━━━┓ LNB 🔥 Discord: 'discord.gg/nJRhZXRNCA' ┏━━━━━━━`,
                jugadorConectado.id,
                parseInt(COLORES.DORADO, 16),
                "bold",
                0
            );
        }
    });
}

// Función duplicada eliminada - solo mantenemos la función principal

function compararEstadisticas(solicitante, nombre1, nombre2) {
    // SEGURIDAD: Verificar que el solicitante tenga auth_id
    const authIDSolicitante = jugadoresUID.get(solicitante.id);
    if (!authIDSolicitante) {
        anunciarError("❌ Debes estar logueado en Haxball.com para usar comparaciones", solicitante);
        anunciarInfo("🔗 Ve a https://www.haxball.com/ y haz login antes de usar este comando", solicitante);
        return;
    }
    
    // SEGURIDAD: Solo permitir comparar jugadores que están actualmente en la sala con auth_id
    function obtenerStatsSeguroCompare(nombreJugador) {
        const jugadorEnSala = room.getPlayerList().find(j => j.name === nombreJugador);
        if (!jugadorEnSala) {
            return { error: `${nombreJugador} no está en la sala actualmente` };
        }
        
        const authIDJugador = jugadoresUID.get(jugadorEnSala.id);
        if (!authIDJugador) {
            return { error: `${nombreJugador} no tiene cuenta registrada (sin login)` };
        }
        
        const stats = estadisticasGlobales.jugadores[authIDJugador];
        if (!stats) {
            return { error: `${nombreJugador} no tiene estadísticas guardadas aún` };
        }
        
        return { stats, authID: authIDJugador };
    }
    
    // Obtener estadísticas de ambos jugadores de forma segura
    const resultado1 = obtenerStatsSeguroCompare(nombre1);
    const resultado2 = obtenerStatsSeguroCompare(nombre2);
    
    if (resultado1.error) {
        anunciarError(`❌ ${resultado1.error}`, solicitante);
        anunciarInfo(`🔒 Por seguridad, solo puedes comparar jugadores presentes y logueados`, solicitante);
        return;
    }
    if (resultado2.error) {
        anunciarError(`❌ ${resultado2.error}`, solicitante);
        anunciarInfo(`🔒 Por seguridad, solo puedes comparar jugadores presentes y logueados`, solicitante);
        return;
    }
    
    const stats1 = resultado1.stats;
    const stats2 = resultado2.stats;
    
    console.log(`🔍 Compare seguro: ${solicitante.name} comparó ${nombre1} (${resultado1.authID}) vs ${nombre2} (${resultado2.authID})`);

    const w_r1 = stats1.partidos > 0 ? ((stats1.victorias / stats1.partidos) * 100).toFixed(1) : "0";
    const w_r2 = stats2.partidos > 0 ? ((stats2.victorias / stats2.partidos) * 100).toFixed(1) : "0";

    const gpp1 = stats1.partidos > 0 ? (stats1.goles / stats1.partidos).toFixed(2) : "0";
    const gpp2 = stats2.partidos > 0 ? (stats2.goles / stats2.partidos).toFixed(2) : "0";

    const app1 = stats1.partidos > 0 ? (stats1.asistencias / stats1.partidos).toFixed(2) : "0";
    const app2 = stats2.partidos > 0 ? (stats2.asistencias / stats2.partidos).toFixed(2) : "0";

    // Usar nombre_display si está disponible, sino usar nombre como fallback
    const nombreMostrar1 = stats1.nombre_display || stats1.nombre;
    const nombreMostrar2 = stats2.nombre_display || stats2.nombre;
    
    const lineas = [
        `📊 COMPARATIVA: ${nombreMostrar1} vs ${nombreMostrar2}`,
        `------------------------------------------`,
        `Partidos: ${stats1.partidos} vs ${stats2.partidos}`,
        `Victorias: ${stats1.victorias} vs ${stats2.victorias}`,
        `Derrotas: ${stats1.derrotas} vs ${stats2.derrotas}`,
        `Win Rate: ${w_r1}% vs ${w_r2}%`,
        `Goles: ${stats1.goles} vs ${stats2.goles}`,
        `Asistencias: ${stats1.asistencias} vs ${stats2.asistencias}`,
        `Goles/Partido: ${gpp1} vs ${gpp2}`,
        `Asist./Partido: ${app1} vs ${app2}`,
        `Hat-tricks: ${stats1.hatTricks} vs ${stats2.hatTricks}`
    ];

    lineas.forEach(linea => {
        room.sendAnnouncement(linea, solicitante.id, parseInt(CELESTE_LNB, 16), "normal", 0);
    });
}

// EVENTOS DEL ROOM - versión principal
// Función para verificar si un mensaje contiene caracteres prohibidos
function contieneCaracteresProhibidos(mensaje) {
    // Caracteres problemáticos que pueden causar errores de renderizado
    const caracteresProhibidos = [
        // Control characters y caracteres especiales problemáticos
        '\u0000', '\u0001', '\u0002', '\u0003', '\u0004', '\u0005', '\u0006', '\u0007',
        '\u0008', '\u000E', '\u000F', '\u0010', '\u0011', '\u0012', '\u0013', '\u0014',
        '\u0015', '\u0016', '\u0017', '\u0018', '\u0019', '\u001A', '\u001B', '\u001C',
        '\u001D', '\u001E', '\u001F',
        // Algunos caracteres Unicode problemáticos específicos
        '\uFEFF', // BOM
        '\u200B', // Zero-width space
        '\u200C', // Zero-width non-joiner
        '\u200D', // Zero-width joiner
        '\u2060', // Word joiner
    ];

    for (const char of caracteresProhibidos) {
        if (mensaje.includes(char)) {
            return true;
        }
    }
    
    // También verificar si hay caracteres de control generales
    return /[\u0000-\u001F\u007F-\u009F]/.test(mensaje);
}

function configurarEventos() {
    // Chat del jugador
    room.onPlayerChat = function(jugador, mensaje) {
        if (contieneCaracteresProhibidos(mensaje)) {
            return false;
        }
        // PROTECCIÓN AVANZADA CONTRA /store - Interceptar y convertir en comando personalizado
        if (mensaje.toLowerCase().trim() === '/store' || mensaje.toLowerCase().startsWith('/store ')) {
            // Mensaje de error público inmediato
            room.sendAnnouncement("❌ Couldn't store stadium", jugador.id, parseInt("FF0000", 16), "bold", 0);
            
            // Enviar mensajes privados educativos inmediatamente
            setTimeout(() => {
                room.sendAnnouncement(
                    "🎮 ¡Hola! Si buscas los mapas oficiales de LNB, te invitamos al Discord",
                    jugador.id,
                    parseInt(CELESTE_LNB, 16),
                    "bold",
                    0
                );
                
                room.sendAnnouncement(
                    "🔗 DISCORD LNB: discord.gg/nJRhZXRNCA (copia y pega en tu navegador)",
                    jugador.id,
                    parseInt("FFD700", 16),
                    "bold",
                    0
                );
                
                room.sendAnnouncement(
                    "📁 Tenemos un canal exclusivo con todos los mapas oficiales de LNB para descargar",
                    jugador.id,
                    parseInt(CELESTE_LNB, 16),
                    "normal",
                    0
                );
                
                room.sendAnnouncement(
                    "🏆 ¡Únete a la comunidad y descarga los mapas oficiales de la Liga!",
                    jugador.id,
                    parseInt("32CD32", 16),
                    "normal",
                    0
                );
                
                room.sendAnnouncement(
                    "⚠️ IMPORTANTE: /store está deshabilitado para proteger la integridad de los mapas oficiales",
                    jugador.id,
                    parseInt("FF6B6B", 16),
                    "bold",
                    0
                );
            }, 100); // Delay mínimo para asegurar que se procese
            
            anunciarAdvertencia(`⚠️ ${jugador.name} intentó usar /store (comando interceptado)`);
            console.log(`🛡️ Comando /store interceptado y bloqueado para jugador: ${jugador.name} (ID: ${jugador.id})`);
            
            // CRÍTICO: Retornar false para evitar que el comando llegue a HaxBall
            return false;
        }
        
        // PROTECCIÓN ADICIONAL - Bloquear otros comandos de administración de mapas
        const comandosBloqueados = ['/map store', '/stadium store', '/save', '/export'];
        const mensajeLower = mensaje.toLowerCase().trim();
        
        for (const comandoBloqueado of comandosBloqueados) {
            if (mensajeLower === comandoBloqueado || mensajeLower.startsWith(comandoBloqueado + ' ')) {
                anunciarError(`🚫 Comando "${comandoBloqueado}" bloqueado por seguridad.`, jugador);
                anunciarAdvertencia(`⚠️ ${jugador.name} intentó usar comando bloqueado: ${comandoBloqueado}`);
                console.log(`🛡️ Comando bloqueado: ${comandoBloqueado} por jugador: ${jugador.name} (ID: ${jugador.id})`);
                return false;
            }
        }
        
        // Verificar si está silenciado por spam
        if (estaSilenciadoPorSpam(jugador)) {
            return false;
        }
        
        // Verificar si está muteado por admin
        if (estaMuteadoPorAdmin(jugador)) {
            return false;
        }
        
        // Verificar si está en timeout (mantenido para otros tipos de timeout)
        if (estaEnTimeout(jugador)) {
            return false;
        }
        
        // Verificar spam
        if (verificarSpam(jugador, mensaje)) {
            return false;
        }
        
        // Comandos rápidos numéricos SIN ! - PROCESAR PRIMERO
        // Solo procesar si el mensaje NO empieza con espacios
        const numeroSolo = mensaje; // No usar trim() para detectar espacios adelante
        if (/^\d+$/.test(numeroSolo)) {
            const numero = parseInt(numeroSolo);
            let mensajeNumerico = null;
            
            // Mapear números a mensajes
            switch (numero) {
                case 10:
                    mensajeNumerico = "¡Buena parada!";
                    break;
                case 11:
                    mensajeNumerico = "¡El 11 siempre presente!";
                    break;
                case 12:
                    mensajeNumerico = "BOCA BOCA BOCAAAA";
                    break;
                case 13:
                    mensajeNumerico = "Tenes menos timing que semáforo en el campo";
                    break;
                case 14:
                    mensajeNumerico = "Jugué tan mal que me sacaron del grupo familiar";
                    break;
                case 15:
                    mensajeNumerico = "Soy arquero, pero del otro equipo";
                    break;
                case 16:
                    mensajeNumerico = "Le pegué tan fuerte que se fue al metaverso";
                    break;
                case 17:
                    mensajeNumerico = "Vi el pase... pero desde el futuro";
                    break;
                case 18:
                    mensajeNumerico = "El lag es parte de mi estilo de juego";
                    break;
                case 19:
                    mensajeNumerico = "Mi defensa es tan sólida como el wifi de mi vecino";
                    break;
                case 20:
                    mensajeNumerico = "Amura inju";
                    break;
                case 21:
                    mensajeNumerico = "¡Buen disparo!";
                    break;
                case 22:
                    mensajeNumerico = "¡Buen pase!";
                    break;
                case 23:
                    mensajeNumerico = "¡Gracias!";
                    break;
                case 24:
                    mensajeNumerico = "¡Buena salvada!";
                    break;
                case 25:
                    mensajeNumerico = "LA MAFIA A COLOCAAAAAAAAAAAAAAAAAAR";
                    break;
                case 26:
                    mensajeNumerico = "Hacelo cuevas tiro goooooooool";
                    break;
                case 27:
                    mensajeNumerico = "PIPA PIPA PIPA PIPA NONONONONONO";
                    break;
                case 28:
                    mensajeNumerico = "¡Buen riflazo!";
                    break;
                case 29:
                    mensajeNumerico = "¡NOOOO FABIÁNIIII!";
                    break;
                case 30:
                    mensajeNumerico = "¡LO MANDARON A COMPRAR PAN!";
                    break;
                case 31:
                    mensajeNumerico = "Y VA EL TERCEROOOO";
                    break;
                case 32:
                    mensajeNumerico = "NOOOOOOO 😭";
                    break;
                case 33:
                    mensajeNumerico = "EZ 😎";
                    break;
                case 34:
                    mensajeNumerico = "¡PEGÁLEEEEE BURRO!";
                    break;
                case 35:
                    mensajeNumerico = "¡SE LE ESCAPÓ COMO A LUX CONTRA LANÚS!";
                    break;
                case 36:
                    mensajeNumerico = "¡TIRÁ UN CENTRO COMO LA GENTE!";
                    break;
                case 37:
                    mensajeNumerico = "¡TE PESA LA CAMISETA!";
                    break;
                case 38:
                    mensajeNumerico = "¡JUGÁS COMO EL ORT... Y COBRÁS EN DÓLARES!";
                    break;
                case 39:
                    mensajeNumerico = "¡ESTO CON MOSTAZA NO PASABA!";
                    break;
                case 40:
                    mensajeNumerico = "¡MIRALO A ROMÁN, CÓMO CAMINA LA CANCHA!";
                    break;
                case 41:
                    mensajeNumerico = "¡NO SE JUEGA MÁS EN ESA CANCHA, EH!";
                    break;
                case 42:
                    mensajeNumerico = "¡ES UN DESASTRE, MARCELO! (imitando a Ruggeri)";
                    break;
                case 43:
                    mensajeNumerico = "¡ESTE PARTIDO LO DIRIGE EL TÍO DEL 9!";
                    break;
                case 44:
                    mensajeNumerico = "¡LO DEJÓ TIRADO Y LE HIZO EL AMOR EN EL ÁREA!";
                    break;
                case 45:
                    mensajeNumerico = "dale que so vo dale q so vo";
                    break;
                case 46:
                    mensajeNumerico = "¡SE VIENE LA NOCHE, MUCHACHOS!";
                    break;
                case 47:
                    mensajeNumerico = "MAMITA POSHO";
                    break;
                case 48:
                    mensajeNumerico = "Entró la bala.";
                    break;
                case 49:
                    mensajeNumerico = "ANDA A LA CANCHA BOBO";
                    break;
                case 50:
                    mensajeNumerico = "La verdadera leyenda del bigger, bro";
                    break;
                case 51:
                    mensajeNumerico = "EL DIBUUUUUUUUUUU";
                    break;
                case 52:
                    mensajeNumerico = "Para que te traje";
                    break;
                case 53:
                    mensajeNumerico = "La pelota no se mancha";
                    break;
                case 54:
                    mensajeNumerico = "OLEEEEEE";
                    break;
                case 55:
                    mensajeNumerico = "PERO QUE VIVA EL FUTBOL";
                    break;
                case 56:
                    mensajeNumerico = "B 26/06/11";
                    break;
                case 57:
                    mensajeNumerico = "Pero q distinguido";
                    break;
                case 58:
                    mensajeNumerico = "No tag cono";
                    break;
                case 59:
                    mensajeNumerico = "Moriste en Madrid 9/12/18";
                    break;
                case 60:
                    mensajeNumerico = "La pelota siempre al 10";
                    break;
            }
            
            // Si hay un mensaje para este número, procesarlo como mensaje normal
            if (mensajeNumerico) {
        // Obtener el nivel del jugador y mostrar en el chat
        const nombreOriginal = obtenerNombreOriginal(jugador);
        const nivel = obtenerNivelJugador(nombreOriginal);
        const emojiNivel = obtenerEmojiNivel(nivel);
        
        // Determinar formato según el rol de admin
        let prefijoRol = '';
        if (esSuperAdmin(jugador)) {
            prefijoRol = `[👑 • ${emojiNivel} Nv. `;
        } else if (esAdminBasico(jugador)) {
            prefijoRol = `[👮🏻 • ${emojiNivel} Nv. `;
        } else {
            prefijoRol = '〔Nv. ';
        }
        
        // Crear el mensaje con formato de chat normal pero con el mensaje del comando
        const mensajeConNivel = esSuperAdmin(jugador) || esAdminBasico(jugador) 
            ? `${prefijoRol}${nivel}] ${nombreOriginal}: ${mensajeNumerico}`
            : `${prefijoRol}${nivel} ${emojiNivel}〕 ${nombreOriginal}: ${mensajeNumerico}`;
                
                // Retransmitir el mensaje modificado con nivel usando color crema para comandos rápidos
                room.sendAnnouncement(mensajeConNivel, null, parseInt("F5DEB3", 16), "normal", 1);
                
                return false; // No mostrar el mensaje original
            }
        }
        
        // Comandos - PROCESAR PRIMERO para que sean completamente privados
        if (mensaje.startsWith("!")) {
            // Procesar el comando de forma inmediata en un setTimeout para evitar bloqueos
            setTimeout(async () => {
                try {
                    await procesarComando(jugador, mensaje);
                } catch (error) {
                    console.error('❌ Error procesando comando:', error);
                    anunciarError("Error procesando comando", jugador);
                }
            }, 0);
            
            console.log(`🎮 COMANDO INTERCEPTADO: ${jugador.name} -> ${mensaje}`);
            return false; // NO mostrar el comando en el chat público - RETORNO INMEDIATO
        }
        
        // Team chat - INTERCEPTAR INMEDIATAMENTE AL INICIO
        if (mensaje.startsWith("t ") || mensaje.startsWith("T ")) {
            // INTERCEPTACIÓN INMEDIATA - Procesar AHORA mismo sin delays
            const msgEquipo = mensaje.slice(2).trim();
            
            // Verificar que el jugador esté en un equipo (no en espectadores)
            if (jugador.team === 0) {
                anunciarError("❌ Debes estar en un equipo para usar el chat de equipo", jugador);
                return false; // BLOQUEAR mensaje completamente
            }
            
            // Verificar que hay mensaje después del prefijo
            if (!msgEquipo || msgEquipo.length === 0) {
                anunciarError("❌ Escribe un mensaje después de 't '", jugador);
                return false; // BLOQUEAR mensaje completamente
            }
            
            // PROCESAMIENTO INMEDIATO SÍNCRONO
            try {
                const jugadores = room.getPlayerList();
                
                // Determinar color según el equipo
                const colorEquipo = jugador.team === 1 ? COLORES.CHAT_TEAM_ROJO : jugador.team === 2 ? AZUL_LNB : CELESTE_LNB;
                const nombreEquipo = jugador.team === 1 ? "ROJO" : jugador.team === 2 ? "AZUL" : "SPEC";
                
                // Obtener nombre original del jugador
                const nombreOriginal = obtenerNombreOriginal(jugador);
                
                // Enviar mensaje INMEDIATAMENTE - sin setTimeout ni delays
                jugadores.forEach(j => {
                    if (j.team === jugador.team && j.team !== 0) {
                        room.sendAnnouncement(
                            `👥 [EQUIPO ${nombreEquipo}] ${nombreOriginal}: ${msgEquipo}`, 
                            j.id, 
                            parseInt(colorEquipo, 16), 
                            "normal", 
                            0
                        );
                    }
                });
                
                console.log(`📢 TEAM CHAT PROCESADO: ${nombreOriginal} (equipo ${jugador.team}) -> "${msgEquipo}"`);
            } catch (error) {
                console.error('❌ Error en team chat:', error);
                anunciarError("❌ Error al procesar mensaje de equipo", jugador);
            }
            
            // RETORNAR FALSE INMEDIATAMENTE - CRÍTICO
            return false;
        }
        
        // Comando privado (whisper)
        if (mensaje.startsWith("@@")) {
            const textoCompleto = mensaje.slice(2).trim();
            const jugadores = room.getPlayerList();
            let jugadorDestino = null;
            let msgPrivado = '';

            // Primero intentar buscar por nombre original (sin niveles)
            for (const p of jugadores) {
                const nombreOriginal = obtenerNombreOriginal(p);
                const nombreBusqueda = textoCompleto.toLowerCase().replace(/_/g, ' ');
                
                // Buscar coincidencia exacta al inicio
                if (nombreBusqueda.startsWith(nombreOriginal.toLowerCase()) && 
                    (nombreBusqueda.length === nombreOriginal.length || nombreBusqueda[nombreOriginal.length] === ' ')) {
                    jugadorDestino = p;
                    msgPrivado = textoCompleto.substring(nombreOriginal.length).trim();
                    break;
                }
            }
            
            // Si no se encontró con nombre exacto, buscar con includes (más flexible)
            if (!jugadorDestino) {
                for (const p of jugadores) {
                    const nombreOriginal = obtenerNombreOriginal(p);
                    const nombreBusqueda = textoCompleto.toLowerCase().replace(/_/g, ' ');
                    
                    if (nombreOriginal.toLowerCase().includes(nombreBusqueda.split(' ')[0]) && nombreBusqueda.split(' ')[0].length >= 3) {
                        jugadorDestino = p;
                        // Tomar todo después del primer espacio como mensaje
                        const partesTexto = textoCompleto.split(' ');
                        if (partesTexto.length > 1) {
                            msgPrivado = partesTexto.slice(1).join(' ').trim();
                        }
                        break;
                    }
                }
            }

            if (jugadorDestino && msgPrivado) {
                const nombreOriginalRemitente = obtenerNombreOriginal(jugador);
                const nombreOriginalDestino = obtenerNombreOriginal(jugadorDestino);
                room.sendAnnouncement(`💬 [PRIVADO de ${nombreOriginalRemitente}]: ${msgPrivado}`, jugadorDestino.id, parseInt("FFD700", 16), "normal", 0);
                room.sendAnnouncement(`💬 [PRIVADO a ${nombreOriginalDestino}]: ${msgPrivado}`, jugador.id, parseInt("FFD700", 16), "normal", 0);
            } else {
                anunciarError("🔍 Jugador no encontrado o mensaje vacío.", jugador);
            }
            return false;
        }
        
        // ===============================================
        // ARREGLO CRÍTICO: FILTRADO DE MENSAJES NORMALES
        // ===============================================
        // Los mensajes normales DEBEN permitir que HaxBall los procese naturalmente
        // para que el sistema de chat nativo funcione correctamente.
        // Solo interceptamos comandos especiales, team chat y mensajes privados.
        
        // Obtener el nivel del jugador y verificar estado VIP
        const nombreOriginal = obtenerNombreOriginal(jugador);
        const nivel = obtenerNivelJugador(nombreOriginal);
        const emojiNivel = obtenerEmojiNivel(nivel);
        
        // Verificar estado VIP de forma síncrona (para evitar async en onPlayerChat)
        let esVIP = false;
        let tipoVIP = null;
        let colorVIP = "FFFFFF"; // Blanco por defecto
        
        // Verificación VIP básica sin await (para evitar problemas con return false)
        // TODO: Implementar cache VIP síncrono si es necesario
        // Por ahora, solo usar el sistema de roles existente
        
        // Determinar formato según el rol
        let prefijoRol = '';
        let mensajeCompleto = '';
        let estiloMensaje = 'normal'; // Por defecto normal
        
        if (esSuperAdmin(jugador)) {
            prefijoRol = `〔👑 • ${emojiNivel} Nv. `;
            mensajeCompleto = `${prefijoRol}${nivel}〕 ${nombreOriginal}: ${mensaje}`;
            colorVIP = "FFFFFF"; // BLANCO para super admins
        } else if (esAdminBasico(jugador)) {
            prefijoRol = `〔👮🏻 • ${emojiNivel} Nv. `;
            mensajeCompleto = `${prefijoRol}${nivel}〕 ${nombreOriginal}: ${mensaje}`;
            colorVIP = "FFFFFF"; // BLANCO para admins
        } else if (esVIP && (tipoVIP === 'ULTRA_VIP' || tipoVIP === 'VIP')) {
            // VIP y ULTRA VIP: Color naranja y formato bold
            if (tipoVIP === 'ULTRA_VIP') {
                prefijoRol = `〔👑 ULTRA VIP • ${emojiNivel} Nv. `;
                mensajeCompleto = `${prefijoRol}${nivel}〕 ✨${nombreOriginal}✨: ${mensaje}`;
            } else {
                prefijoRol = `〔💎 VIP • ${emojiNivel} Nv. `;
                mensajeCompleto = `${prefijoRol}${nivel}〕 ⭐${nombreOriginal}: ${mensaje}`;
            }
            colorVIP = "FF8800"; // NARANJA para VIPs
            estiloMensaje = 'bold'; // BOLD para VIPs
        } else {
            // Jugador normal
            prefijoRol = '〔Nv. ';
            mensajeCompleto = `${prefijoRol}${nivel} ${emojiNivel}〕 ${nombreOriginal}: ${mensaje}`;
            colorVIP = "FFFFFF"; // BLANCO para jugadores normales
        }
        
        // APLICAR FORMATO A TODOS LOS JUGADORES (admins, VIPs y normales)
        console.log(`🎮 CHAT DEBUG: Enviando mensaje formateado para todos los jugadores`);
        
        // Usar el color y estilo determinados arriba
        const colorChat = parseInt(colorVIP, 16);
        
        // Retransmitir el mensaje con el formato, color y estilo apropiados
        room.sendAnnouncement(mensajeCompleto, null, colorChat, estiloMensaje, 1);
        
        console.log(`🎮 CHAT DEBUG: Mensaje formateado enviado, ocultando mensaje original`);
        return false; // No mostrar el mensaje original sin formato
    };
    
    // Jugador se une
    room.onPlayerJoin = async function(jugador) {
        console.log(`🎮 DEBUG: Jugador se unió: ${jugador.name} (ID: ${jugador.id})`);
        
        // ==================== DEBUG MEJORADO DEL AUTH AL CONECTAR ====================
        console.log('🔍 [AUTH JOIN DEBUG] =================================');
        console.log('🔍 [AUTH JOIN DEBUG] Estado del jugador al conectarse:');
        console.log('🔍 [AUTH JOIN DEBUG] - Nombre:', jugador.name);
        console.log('🔍 [AUTH JOIN DEBUG] - ID:', jugador.id);
        console.log('🔍 [AUTH JOIN DEBUG] - Auth (tipo):', typeof jugador.auth);
        console.log('🔍 [AUTH JOIN DEBUG] - Auth (valor):', JSON.stringify(jugador.auth));
        console.log('🔍 [AUTH JOIN DEBUG] - Auth (string):', String(jugador.auth));
        console.log('🔍 [AUTH JOIN DEBUG] - Auth es null:', jugador.auth === null);
        console.log('🔍 [AUTH JOIN DEBUG] - Auth es undefined:', jugador.auth === undefined);
        console.log('🔍 [AUTH JOIN DEBUG] - Auth length:', jugador.auth ? jugador.auth.length : 'N/A');
        console.log('🔍 [AUTH JOIN DEBUG] - Timestamp:', new Date().toISOString());
        console.log('🔍 [AUTH JOIN DEBUG] - Propiedades completas:', Object.keys(jugador));
        console.log('🔍 [AUTH JOIN DEBUG] =================================');
        
        // GUARDAR EL AUTH EN EL MOMENTO DE LA CONEXIÓN PARA TRACKING
        if (jugador.auth) {
            jugadoresUID.set(jugador.id, jugador.auth);
            console.log(`🔐 [AUTH JOIN DEBUG] Auth guardado en jugadoresUID: ${jugador.id} -> ${jugador.auth}`);
        } else {
            console.log(`⚠️ [AUTH JOIN DEBUG] JUGADOR SIN AUTH DETECTADO: ${jugador.name} (ID: ${jugador.id})`);
        }
        
        // Verificar que room esté disponible antes de proceder
        if (!room || !room.sendAnnouncement) {
            console.error('❌ Room no disponible en onPlayerJoin');
            return;
        }
        
        // ====================== PROTECCIÓN CONTRA MÚLTIPLES CONEXIONES ======================
        // Detectar múltiples pestañas usando auth del jugador
        if (detectarMultiplesConexiones(jugador)) {
            console.log(`🚫 MÚLTIPLES PESTAÑAS: ${jugador.name} (${jugador.auth}) intentó conectarse con múltiples pestañas`);
            
            // Expulsar inmediatamente
            room.kickPlayer(
                jugador.id, 
                `❌ Solo se permite una conexión por jugador. Cierra las otras pestañas/ventanas del juego.`, 
                false
            );
            
            // Registrar en la base de datos el intento de conexión múltiple
            try {
                if (typeof nodeRegistrarConexion === 'function') {
                    nodeRegistrarConexion(jugador.name, jugador.auth, 'REJECTED_IP', 'MULTIPLE_TABS_REJECTED');
                }
            } catch (error) {
                console.error('❌ Error registrando conexión múltiple:', error);
            }
            
            return; // Impedir que continúe el proceso de unión
        }
        
        // Obtener IP del jugador (simulada para HaxBall Headless)
        const ipJugador = obtenerIPJugador(jugador);
        
        if (ipJugador) {
            console.log(`🔍 DEBUG IP: Jugador ${jugador.name} conectado desde IP: ${ipJugador}`);
            
            // Limpiar conexiones expiradas usando la función de base de datos
            try {
                if (typeof nodeLimpiarConexionesInactivas === 'function') {
                    nodeLimpiarConexionesInactivas();
                }
            } catch (error) {
                console.error('❌ Error limpiando conexiones expiradas:', error);
            }
            
            // Verificar conexiones múltiples usando la base de datos
            let puedeConectarse = true;
            try {
                if (typeof nodeVerificarConexionesExistentes === 'function') {
                    try {
                        const verificacion = await nodeVerificarConexionesExistentes(jugador.name, jugador.auth);
                        console.log(`🔍 DEBUG DB: Verificación recibida:`, verificacion);
                        
                        if (verificacion && verificacion.tieneConexionesMultiples && verificacion.conexionesActivas >= 2) {
                            console.log(`🚫 BASE DE DATOS: Conexión rechazada para ${jugador.name}: ${verificacion.conexionesActivas} conexiones detectadas.`);
                            
                            room.kickPlayer(
                                jugador.id, 
                                `❌ Ya tienes una conexión activa. Solo se permite una conexión por jugador.`, 
                                false
                            );
                            
                            // Registrar el rechazo en la base de datos
                            if (typeof nodeRegistrarConexion === 'function') {
                                try {
                                    nodeRegistrarConexion(jugador.name, jugador.auth, 'REJECTED_DB', 'MULTIPLE_CONNECTIONS_DB');
                                } catch (regError) {
                                    console.error('❌ Error registrando rechazo DB:', regError);
                                }
                            }
                            
                            puedeConectarse = false;
                        } else {
                            console.log(`✅ DEBUG DB: Jugador ${jugador.name} puede conectarse - no hay conexiones múltiples`);
                        }
                    } catch (dbError) {
                        console.error('❌ Error específico en verificación DB:', dbError);
                        throw dbError;
                    }
                } else {
                    console.log('⚠️ DEBUG: nodeVerificarConexionesExistentes no está disponible');
                }
            } catch (error) {
                console.error('❌ Error verificando conexiones múltiples:', error);
                console.log('🔄 Continuando con sistema de memoria como respaldo');
                // En caso de error, usar el sistema de memoria como respaldo
            }
            
            if (!puedeConectarse) {
                return; // Impedir que continúe el proceso de unión
            }
            
        // Registrar la conexión en la base de datos
            try {
                if (typeof nodeRegistrarConexion === 'function') {
                    nodeRegistrarConexion(jugador.name, jugador.auth, ipJugador, 'CONNECTED');
                }
            } catch (error) {
                console.error('❌ Error registrando conexión:', error);
            }
            
            // ====================== VERIFICACIÓN DE ROLES PERSISTENTES ======================
            // Verificar si el jugador tiene un rol persistente asignado y restaurarlo
            try {
                await verificarYRestaurarRol(jugador);
            } catch (error) {
                console.error('❌ Error verificando rol persistente:', error);
            }
            
            // Sistema de memoria como respaldo (mantenido para compatibilidad)
            // Verificar si la IP está bloqueada
            const ipBloqueada = ipsBloqueadas.get(ipJugador);
            if (ipBloqueada) {
                const tiempoRestante = Math.ceil((ipBloqueada.timestamp + TIEMPO_LIMITE_IP - Date.now()) / (60 * 1000));
                if (tiempoRestante > 0) {
                    console.log(`🚫 DEBUG IP: IP ${ipJugador} está bloqueada por ${tiempoRestante} minutos`);
                    room.kickPlayer(jugador.id, `Tu IP está temporalmente bloqueada por múltiples conexiones. Espera ${tiempoRestante} minutos.`, false);
                    return;
                } else {
                    // El bloqueo ha expirado, removerlo
                    ipsBloqueadas.delete(ipJugador);
                    console.log(`🔓 DEBUG IP: Bloqueo expirado para IP ${ipJugador}`);
                }
            }
            
            // Verificar conexiones actuales de esta IP (sistema de memoria)
            const conexionIP = conexionesPorIP.get(ipJugador);
            if (conexionIP) {
                const jugadoresActuales = Array.from(conexionIP.jugadores).filter(playerId => {
                    const jugadorExistente = room.getPlayerList().find(p => p.id === playerId);
                    return jugadorExistente !== undefined;
                });
                
                // Limpiar jugadores desconectados
                conexionIP.jugadores = new Set(jugadoresActuales);
                
                console.log(`🔍 DEBUG IP: IP ${ipJugador} tiene ${jugadoresActuales.length} conexiones activas`);
                
                if (jugadoresActuales.length >= MAX_JUGADORES_POR_IP) {
                    console.log(`🚫 DEBUG IP: IP ${ipJugador} excede el límite de ${MAX_JUGADORES_POR_IP} conexiones`);
                   
                    // Obtener nombres de los jugadores ya conectados
                    const nombresConectados = jugadoresActuales
                        .map(playerId => {
                            const p = room.getPlayerList().find(player => player.id === playerId);
                            return p ? p.name : `ID:${playerId}`;
                        })
                        .join(', ');
                    
                    // Expulsar al nuevo jugador
                    room.kickPlayer(
                        jugador.id, 
                        `Solo se permiten ${MAX_JUGADORES_POR_IP} jugadores por red. Ya conectados: ${nombresConectados}`, 
                        false
                    );
                    
                    // Bloquear temporalmente la IP si hay muchos intentos
                    const ahora = Date.now();
                    if (ahora - (conexionIP.timestamp || 0) < 60000) { // Si hay múltiples intentos en 1 minuto
                        ipsBloqueadas.set(ipJugador, {
                            razon: 'Múltiples intentos de conexión excesiva',
                            timestamp: ahora
                        });
                        console.log(`🔒 DEBUG IP: IP ${ipJugador} bloqueada temporalmente por múltiples intentos`);
                        
                        // Enviar notificación a Discord si está configurado
                        enviarNotificacionIPBloqueada(ipJugador, jugador.name, nombresConectados);
                    }
                    
                    return; // Impedir que continúe el proceso de unión
                }
                
                // Agregar el nuevo jugador a la conexión existente
                conexionIP.jugadores.add(jugador.id);
                conexionIP.timestamp = Date.now();
            } else {
                // Primera conexión de esta IP
                conexionesPorIP.set(ipJugador, {
                    jugadores: new Set([jugador.id]),
                    timestamp: Date.now()
                });
                console.log(`✅ DEBUG IP: Primera conexión registrada para IP ${ipJugador}`);
            }
            
            // Mapear jugador a su IP
            jugadoresPorIP.set(jugador.id, ipJugador);
            
            // Mensaje informativo si hay múltiples conexiones de la misma IP
            const conexionesIP = conexionesPorIP.get(ipJugador);
            if (conexionesIP && conexionesIP.jugadores.size > 1) {
                const otrosJugadores = Array.from(conexionesIP.jugadores)
                    .filter(id => id !== jugador.id)
                    .map(id => {
                        const p = room.getPlayerList().find(player => player.id === id);
                        return p ? p.name : `ID:${id}`;
                    })
                    .join(', ');
                
                console.log(`⚠️ DEBUG IP: Múltiples conexiones desde ${ipJugador}: ${jugador.name} + ${otrosJugadores}`);
                
                // Mensaje privado al jugador sobre conexiones de su red
                setTimeout(() => {
                    room.sendAnnouncement(
                        `ℹ️ Detectamos ${conexionesIP.jugadores.size} conexiones desde tu red: ${otrosJugadores}`,
                        jugador.id,
                        parseInt(COLORES.INFO, 16),
                        "normal",
                        0
                    );
                    room.sendAnnouncement(
                        `⚠️ Máximo ${MAX_JUGADORES_POR_IP} jugadores por red. Si alguien más se conecta, serás desconectado.`,
                        jugador.id,
                        parseInt(COLORES.ADVERTENCIA, 16),
                        "normal",
                        0
                    );
                }, 2000);
            }
        } else {
            console.log(`⚠️ DEBUG IP: No se pudo obtener IP para jugador ${jugador.name}`);
        }
        // ====================== FIN PROTECCIÓN CONTRA MÚLTIPLES CONEXIONES ======================
        
        // Guardar nombre original antes de modificarlo
        nombresOriginales.set(jugador.id, jugador.name);
        
        // ====================== GENERAR/VERIFICAR UID DEL JUGADOR (SISTEMA MEJORADO) ======================
        try {
            // Usar el nuevo sistema UID mejorado
            if (typeof nodeObtenerUIDMejorado === 'function') {
                nodeObtenerUIDMejorado(jugador).then(uid => {
                    if (uid) {
                        console.log(`🆔 UID mejorado asignado para ${jugador.name}: ${uid}`);
                        
                        // Actualizar UID en tabla jugadores si es necesario
                        if (typeof nodeActualizarUID === 'function') {
                            try {
                                nodeActualizarUID(jugador.name, uid);
                                console.log(`📊 UID actualizado en tabla jugadores para ${jugador.name}`);
                            } catch (error) {
                                console.error(`❌ Error actualizando UID en tabla jugadores para ${jugador.name}:`, error);
                            }
                        }
                        
                        // También actualizar en el sistema legacy para compatibilidad
                        jugadoresUID.set(jugador.id, uid);
                    }
                }).catch(error => {
                    console.error(`❌ No se pudo generar UID mejorado para ${jugador.name}:`, error);
                    
                    // Fallback al sistema anterior si el nuevo falla
                    const uidLegacy = obtenerUID(jugador);
                    if (uidLegacy) {
                        console.log(`🔄 Usando UID legacy para ${jugador.name}: ${uidLegacy}`);
                        jugadoresUID.set(jugador.id, uidLegacy);
                    }
                });
            } else {
                console.warn('⚠️ Sistema UID mejorado no disponible, usando sistema legacy');
                
                // Usar sistema anterior si las nuevas funciones no están disponibles
                const uid = obtenerUID(jugador);
                if (uid) {
                    console.log(`🆔 UID legacy asignado para ${jugador.name}: ${uid}`);
                    jugadoresUID.set(jugador.id, uid);
                } else {
                    console.error(`❌ No se pudo generar UID legacy para ${jugador.name}`);
                }
            }
        } catch (error) {
            console.error(`❌ Error generando UID mejorado para ${jugador.name}:`, error);
            
            // Fallback al sistema anterior en caso de error
            try {
                const uidLegacy = obtenerUID(jugador);
                if (uidLegacy) {
                    console.log(`🔄 Fallback: UID legacy para ${jugador.name}: ${uidLegacy}`);
                    jugadoresUID.set(jugador.id, uidLegacy);
                }
            } catch (legacyError) {
                console.error(`❌ Error también en sistema UID legacy para ${jugador.name}:`, legacyError);
            }
        }
        // ====================== FIN GENERACIÓN UID MEJORADO =======================
        
        // ====================== VERIFICACIÓN DE BANEOS AL CONECTAR ======================
        // CRÍTICO: Verificar si el jugador está baneado antes de permitir la conexión
        let jugadorBaneado = false;
        
        // 1. VERIFICAR BANEOS OFFLINE PRIMERO (sistema más avanzado)
        if (offlineBanSystem) {
            try {
                const tienebaneoOffline = await offlineBanSystem.checkPlayerOnJoin(jugador);
                if (tienebaneoOffline) {
                    console.log(`🚫 BANEO OFFLINE: Jugador ${jugador.name} baneado por sistema offline`);
                    return; // Impedir que continúe el proceso de unión
                }
            } catch (error) {
                console.error('❌ Error verificando baneo offline:', error);
                // Continuar con verificación estándar si hay error
            }
        }
        
        try {
            console.log(`🚔 DEBUG: Verificando estado de baneo para ${jugador.name} (Auth: ${jugador.auth || 'N/A'})`);
            
            // Función local para manejar expulsión inmediata con control de estado
            const expulsarJugador = (motivo, admin, razon, esBaneoNuevo = true) => {
                if (jugadorBaneado) {
                    console.log(`⚠️ Expulsión ya en proceso para ${jugador.name}, ignorando llamada duplicada`);
                    return; // Evitar múltiples expulsiones
                }
                jugadorBaneado = true;
                
                console.log(`🚫 JUGADOR BANEADO DETECTADO: ${jugador.name} será expulsado inmediatamente`);
                console.log(`📋 Motivo: ${motivo} | Admin: ${admin} | Razón: ${razon}`);
                
                // Expulsar inmediatamente con timeout mínimo para asegurar desconexión
                setTimeout(() => {
                    try {
                        if (room && typeof room.kickPlayer === 'function') {
                            room.kickPlayer(
                                jugador.id, 
                                `🚫 BANEADO: ${razon}. Admin: ${admin}. No intentes evadir el baneo.`, 
                                true // Ban inmediato
                            );
                            console.log(`✅ Jugador baneado ${jugador.name} expulsado exitosamente`);
                        } else {
                            console.error(`❌ Room o kickPlayer no disponible para expulsar a ${jugador.name}`);
                        }
                    } catch (kickError) {
                        console.error(`❌ Error expulsando jugador baneado ${jugador.name}:`, kickError);
                        
                        // Intentar expulsión de respaldo
                        try {
                            if (room && room.kickPlayer) {
                                room.kickPlayer(jugador.id, "🚫 Acceso denegado por sistema de seguridad", false);
                            }
                        } catch (fallbackError) {
                            console.error(`❌ Error también en expulsión de respaldo:`, fallbackError);
                        }
                    }
                }, 50); // Timeout reducido para expulsión más rápida
                
                // Enviar notificación de manera asíncrona
                setTimeout(() => {
                    try {
                        if (typeof enviarNotificacionBanKick === 'function') {
                            enviarNotificacionBanKick(
                                esBaneoNuevo ? "intento_conexion_baneado" : "intento_conexion_baneado_legacy", 
                                admin, 
                                jugador.name, 
                                jugador.auth || 'N/A', 
                                0, 
                                `Jugador baneado intentó conectarse. Motivo: ${motivo}. Razón: ${razon}`, 
                                null, 
                                jugador.auth
                            );
                        }
                    } catch (notifError) {
                        console.error(`❌ Error enviando notificación de baneo:`, notifError);
                    }
                }, 200);
            };
            
            // Verificar en la nueva tabla de baneos usando promesas (más confiable)
            if (typeof nodeEstaBaneadoPromise === 'function' && jugador.auth) {
                console.log(`🔍 DEBUG: Verificando en tabla baneos para auth: ${jugador.auth}`);
                
                try {
                    const baneo = await nodeEstaBaneadoPromise(jugador.auth);
                    
                    if (baneo && !jugadorBaneado) {
                        console.log(`🚫 JUGADOR BANEADO (Tabla nueva): ${jugador.name} (Auth: ${jugador.auth})`);
                        console.log(`📋 Detalles del baneo: Admin: ${baneo.admin}, Razón: ${baneo.razon}, Fecha: ${baneo.fecha}`);
                        
                        expulsarJugador(
                            "tabla_baneos", 
                            baneo.admin || 'Sistema', 
                            baneo.razon || 'Sin razón especificada', 
                            true
                        );
                    } else if (baneo && jugadorBaneado) {
                        console.log(`⚠️ Baneo detectado en tabla nueva pero jugador ya siendo expulsado: ${jugador.name}`);
                    } else {
                        console.log(`✅ DEBUG: Jugador ${jugador.name} no está baneado en tabla baneos`);
                    }
                } catch (error) {
                    console.error(`❌ Error verificando baneo con promesa:`, error);
                    
                    // Fallback: intentar con la versión de callback si la promesa falla
                    if (typeof nodeEstaBaneado === 'function') {
                        console.log(`🔄 DEBUG: Intentando fallback con callback...`);
                        
                        const procesarResultadoBaneo = function(baneo) {
                            try {
                                if (baneo && !jugadorBaneado) {
                                    console.log(`🚫 JUGADOR BANEADO (Fallback): ${jugador.name} (Auth: ${jugador.auth})`);
                                    console.log(`📋 Detalles del baneo: Admin: ${baneo.admin}, Razón: ${baneo.razon}, Fecha: ${baneo.fecha}`);
                                    
                                    expulsarJugador(
                                        "tabla_baneos_fallback", 
                                        baneo.admin || 'Sistema', 
                                        baneo.razon || 'Sin razón especificada', 
                                        true
                                    );
                                } else {
                                    console.log(`✅ DEBUG: Jugador ${jugador.name} no está baneado (fallback)`);
                                }
                            } catch (callbackError) {
                                console.error(`❌ Error en callback fallback:`, callbackError);
                            }
                        };
                        
                        try {
                            nodeEstaBaneado(jugador.auth, procesarResultadoBaneo);
                        } catch (callbackError) {
                            console.error(`❌ Error en fallback callback:`, callbackError);
                        }
                    }
                }
            } else {
                console.log(`⚠️ DEBUG: nodeEstaBaneadoPromise no disponible o jugador sin auth`);
            }
            
            // Verificar en la tabla legacy de jugadores usando promesa
            if (typeof nodeVerificarBaneoJugador === 'function') {
                console.log(`🔍 DEBUG: Verificando en tabla jugadores para: ${jugador.name}`);
                
                nodeVerificarBaneoJugador(jugador.name, jugador.auth).then(resultado => {
                    try {
                        if (resultado && resultado.estaBaneado && !jugadorBaneado) {
                            console.log(`🚫 JUGADOR BANEADO (Tabla legacy): ${jugador.name}`);
                            console.log(`📋 Detalles legacy: Admin: ${resultado.adminBan}, Razón: ${resultado.razonBan}, Fecha: ${resultado.fechaBan}`);
                            
                            expulsarJugador(
                                "tabla_jugadores", 
                                resultado.adminBan || 'Sistema', 
                                resultado.razonBan || 'Sin razón especificada', 
                                false
                            );
                        } else if (resultado && resultado.estaBaneado && jugadorBaneado) {
                            console.log(`⚠️ Baneo detectado en tabla legacy pero jugador ya siendo expulsado: ${jugador.name}`);
                        } else {
                            console.log(`✅ DEBUG: Jugador ${jugador.name} no está baneado en tabla jugadores`);
                        }
                    } catch (promiseError) {
                        console.error(`❌ Error procesando resultado de nodeVerificarBaneoJugador:`, promiseError);
                    }
                }).catch(error => {
                    console.error(`❌ Error verificando baneo legacy para ${jugador.name}:`, error);
                });
            } else {
                console.log(`⚠️ DEBUG: nodeVerificarBaneoJugador no disponible`);
            }
            
        } catch (error) {
            console.error(`❌ Error en verificación de baneos para ${jugador.name}:`, error);
        }
        // ====================== FIN VERIFICACIÓN DE BANEOS ======================
        
        // Solo continuar con el proceso si el jugador no está baneado
        // (el resto del código se ejecutará, pero si está baneado será expulsado rápidamente)
        if (jugadorBaneado) {
            console.log(`⚠️ Jugador ${jugador.name} será expulsado por baneo, cancelando proceso de bienvenida`);
            return; // Terminar el proceso aquí
        }
        
        try {
            // Mensaje de bienvenida centrado y llamativo
            const mensajeBienvenida = `🔵⚡ ¡BIENVENIDO ${jugador.name.toUpperCase()} A LA LIGA NACIONAL DE BIGGER LNB! ⚡🔵`;
            console.log(`📢 DEBUG: Enviando mensaje de bienvenida para ${jugador.name}`);
            room.sendAnnouncement(mensajeBienvenida, null, parseInt("FFD700", 16), "bold", 1);
            
            // Enviar mensajes informativos con delays escalonados
setTimeout(() => {
                if (room && room.sendAnnouncement) {
                    room.sendAnnouncement(
                        "━━━━━━━━━━━┓ 📣 ¡LNB AHORA ESTÁ EN TODAS LAS REDES!! ┏━━━━━━━━━━━━\n" +
                        "🎥 TikTok: https://www.tiktok.com/@lnbhaxball\n" +
                        "📸 Instagram: https://www.instagram.com/lnbhaxball/\n" +
                        "📹 YouTube: https://youtube.com/liganacionaldebigger\n" +
                        "📺 Twitch: https://twitch.tv/liganacionalbigger\n" +
                        "📤 Mandanos tus clips para compartir 💥\n" +
                        "━━━━━━━━━━━━━┓ LNB 🔥 Discord: 'discord.gg/nJRhZXRNCA' ┏━━━━━━━━━━━━━ \n" +
                        "Script by ИФT\n" +
                        "ℹ️ 🔵 Usa !ayuda para ver los comandos disponibles",
                        jugador.id,
                        parseInt(CELESTE_LNB, 16), "bold", 0
                    );
                }
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error enviando mensajes de bienvenida:', error);
        }
        
        // Registrar jugador en estadísticas globales si no existe
        try {
            const authIDJoin = jugadoresUID.get(jugador.id) || jugador.auth;
            if (authIDJoin && !estadisticasGlobales.jugadores[authIDJoin]) {
                registrarJugadorGlobal(authIDJoin, jugador.name);
                console.log(`✅ DEBUG: Jugador nuevo registrado: ${jugador.name} (${authIDJoin}) con XP inicial y nivel 1`);
                
                // Actualizar formato de nombre para jugadores nuevos después de un breve delay
                setTimeout(() => {
                    try {
                        actualizarNombreConNivel(jugador);
                        console.log(`🎨 DEBUG: Formato de nivel aplicado a jugador nuevo: ${jugador.name}`);
                    } catch (updateError) {
                        console.error('❌ Error actualizando formato de nombre:', updateError);
                    }
                }, 1500);
            }
        } catch (error) {
            console.error('❌ Error registrando jugador global:', error);
        }
        
        // ====================== TRACKING DE JUGADORES - SISTEMA INTEGRADO ======================
        // SISTEMA NUEVO: Tracking persistente (con BD)
        try {
            if (typeof obtenerSistemaTracking === 'function') {
                const sistemaTrackingPersistente = obtenerSistemaTracking();
                if (sistemaTrackingPersistente) {
                    console.log(`📊 TRACKING PERSISTENTE: Procesando ${jugador.name}`);
                    sistemaTrackingPersistente.trackearConexionJugador(jugador).catch(error => {
                        console.error(`❌ Error en tracking persistente:`, error);
                        // Fallback al sistema legacy si el persistente falla
                        console.log(`🔄 Fallback: Usando sistema legacy para ${jugador.name}`);
                        trackearJugador(jugador);
                    });
                } else {
                    console.warn(`⚠️ Sistema de tracking persistente no inicializado - usando legacy`);
                    trackearJugador(jugador);
                }
            } else {
                console.warn(`⚠️ Función obtenerSistemaTracking no disponible - usando legacy`);
                trackearJugador(jugador);
            }
        } catch (error) {
            console.error(`❌ Error en sistema de tracking integrado:`, error);
            // Fallback al sistema legacy
            console.log(`🔄 Fallback crítico: Usando sistema legacy para ${jugador.name}`);
            trackearJugador(jugador);
        }
        // ====================== FIN TRACKING INTEGRADO ======================
        
        // ====================== CARGAR FESTEJOS PERSISTENTES ======================
        // CORRECCIÓN CRÍTICA: Cargar festejos automáticamente al conectarse usando funciones expuestas
        try {
            console.log(`🎉 [FESTEJOS DEBUG ENTRY] Iniciando carga de festejos para ${jugador.name}`);
            console.log(`🎉 [FESTEJOS DEBUG ENTRY] - Jugador ID: ${jugador.id}`);
            console.log(`🎉 [FESTEJOS DEBUG ENTRY] - Auth disponible: ${!!jugador.auth}`);
            console.log(`🎉 [FESTEJOS DEBUG ENTRY] - Auth valor: ${jugador.auth}`);
            console.log(`🎉 [FESTEJOS DEBUG ENTRY] - Función nodeCargarFestejos disponible: ${typeof nodeCargarFestejos === 'function'}`);
            
            if (typeof nodeCargarFestejos === 'function' && jugador.auth) {
                console.log(`🎉 [FESTEJOS DEBUG] Llamando nodeCargarFestejos para ${jugador.name} con auth: ${jugador.auth}`);
                
                nodeCargarFestejos(jugador.auth, jugador.name).then(async festejos => {
                    console.log(`🎉 [FESTEJOS DEBUG] Respuesta de nodeCargarFestejos:`, festejos);
                    
                    if (festejos && (festejos.gol || festejos.asistencia)) {
                        console.log(`✅ [FESTEJOS DEBUG] Festejos encontrados para ${jugador.name}:`, {
                            gol: festejos.gol || 'default',
                            asistencia: festejos.asistencia || 'default'
                        });
                        
                        // CORRECIÓN: Actualizar inmediatamente el cache local
                        if (jugador.auth) {
                            console.log(`💾 [CACHE DEBUG] Actualizando cache con auth: ${jugador.auth}`);
                            cacheMensajesPersonalizados.set(jugador.auth, {
                                gol: festejos.gol,
                                asistencia: festejos.asistencia
                            });
                            console.log(`💾 [CACHE DEBUG] Cache actualizado para ${jugador.name}: gol="${festejos.gol || 'null'}", asistencia="${festejos.asistencia || 'null'}"`);
                            console.log(`💾 [CACHE DEBUG] Verificando cache después de actualización:`, cacheMensajesPersonalizados.get(jugador.auth));
                        } else {
                            console.error(`❌ [CACHE DEBUG] No se puede actualizar cache: jugador sin auth`);
                        }
                        
                        // Mensaje informativo al jugador si tiene festejos personalizados - DESACTIVADO
                        // setTimeout(() => {
                        //     const mensajes = [];
                        //     if (festejos.gol) mensajes.push(`⚽ Gol: "${festejos.gol}"`);
                        //     if (festejos.asistencia) mensajes.push(`🎯 Asistencia: "${festejos.asistencia}"`);
                        //     
                        //     room.sendAnnouncement(
                        //         `🎉 Festejos personalizados restaurados: ${mensajes.join(', ')}`,
                        //         jugador.id,
                        //         parseInt("00FF00", 16),
                        //         "normal",
                        //         0
                        //     );
                        // }, 2500); // Delay para no saturar de mensajes al conectarse
                    } else {
                        console.log(`ℹ️ [FESTEJOS DEBUG] Sin festejos persistentes encontrados para ${jugador.name}`);
                        console.log(`ℹ️ [FESTEJOS DEBUG] Respuesta de nodeCargarFestejos era:`, festejos);
                        
                        // ==================== MIGRACIÓN AUTOMÁTICA ====================
                        // Si no hay festejos persistentes, verificar si hay temporales para migrar
                        const mensajesTemporales = mensajesPersonalizados.get(jugador.id);
                        if (mensajesTemporales && migrarFestivoTemporal) {
                            console.log(`🔄 MIGRACIÓN: Encontrados mensajes temporales para ${jugador.name}, iniciando migración...`);
                            
                            try {
                                const resultadoMigracion = await migrarFestivoTemporal(
                                    jugador.auth,
                                    jugador.name,
                                    mensajesTemporales.gol,
                                    mensajesTemporales.asistencia
                                );
                                
                                if (resultadoMigracion && !resultadoMigracion.error) {
                                    console.log(`✅ MIGRACIÓN: Festejos migrados exitosamente para ${jugador.name}`);
                                    
                                    // Limpiar mensajes temporales después de migración exitosa
                                    mensajesPersonalizados.delete(jugador.id);
                                    
                                    // Notificar al jugador sobre la migración
                                    setTimeout(() => {
                                        const mensajes = [];
                                        if (mensajesTemporales.gol) mensajes.push(`⚽ Gol: "${mensajesTemporales.gol}"`);
                                        if (mensajesTemporales.asistencia) mensajes.push(`🎯 Asistencia: "${mensajesTemporales.asistencia}"`);
                                        
                                        room.sendAnnouncement(
                                            `🔄 Tus festejos han sido migrados al sistema persistente: ${mensajes.join(', ')}`,
                                            jugador.id,
                                            parseInt(COLORES.DORADO, 16),
                                            "bold",
                                            0
                                        );
                                        
                                        room.sendAnnouncement(
                                            `💾 Ahora tus mensajes se guardarán automáticamente entre desconexiones`,
                                            jugador.id,
                                            parseInt(COLORES.INFO, 16),
                                            "normal",
                                            0
                                        );
                                    }, 3000);
                                } else {
                                    console.error(`❌ MIGRACIÓN: Error migrando festejos para ${jugador.name}:`, resultadoMigracion?.error);
                                }
                            } catch (error) {
                                console.error(`❌ MIGRACIÓN: Error en proceso de migración para ${jugador.name}:`, error);
                            }
                        }
                        // ==================== FIN MIGRACIÓN AUTOMÁTICA ====================
                    }
                }).catch(error => {
                    console.error(`❌ [FESTEJOS DEBUG] Error cargando festejos para ${jugador.name}:`, error);
                });
            } else {
                if (typeof nodeCargarFestejos !== 'function') {
                    console.warn(`⚠️ [FESTEJOS DEBUG] Función nodeCargarFestejos no disponible`);
                } else if (!jugador.auth) {
                    console.warn(`⚠️ [FESTEJOS DEBUG] Jugador ${jugador.name} sin auth - no se pueden cargar festejos`);
                    console.warn(`⚠️ [FESTEJOS DEBUG] Auth valor actual: ${jugador.auth}`);
                }
            }
        } catch (error) {
            console.error(`❌ [FESTEJOS DEBUG] Error en sistema de festejos persistentes para ${jugador.name}:`, error);
        }
        // ====================== FIN FESTEJOS PERSISTENTES ======================
        
        // ====================== SISTEMA VIP - BIENVENIDA ======================
        // Verificar si el jugador tiene VIP y mostrar mensaje de bienvenida
        if (vipBot) {
            try {
                console.log(`👑 [VIP DEBUG] Verificando estado VIP para ${jugador.name}`);
                const joinResult = await vipBot.onPlayerJoin(jugador.name, jugador.auth);
                
                if (joinResult && joinResult.isVIP && joinResult.welcomeMessage) {
                    console.log(`👑 [VIP DEBUG] Jugador VIP detectado: ${jugador.name} (Tipo: ${joinResult.vipType})`);
                    
                    // Mostrar mensaje de bienvenida VIP personalizado
                    setTimeout(() => {
                        room.sendAnnouncement(
                            joinResult.welcomeMessage,
                            jugador.id,
                            parseInt("FFD700", 16), // Dorado para VIPs
                            "bold",
                            1
                        );
                        
                        // Mensaje adicional con comandos VIP disponibles
                        setTimeout(() => {
                            room.sendAnnouncement(
                                "💬 Usa !viphelp para ver tus comandos especiales",
                                jugador.id,
                                parseInt("00FF00", 16),
                                "normal",
                                0
                            );
                        }, 1500);
                    }, 2000); // Delay para no saturar mensajes al conectarse
                } else {
                    console.log(`👑 [VIP DEBUG] Jugador no VIP: ${jugador.name}`);
                }
            } catch (error) {
                console.error(`❌ [VIP DEBUG] Error verificando estado VIP para ${jugador.name}:`, error);
            }
        }
        // ====================== FIN SISTEMA VIP ======================
        
        // ====================== ENVIAR REPORTE DE CONEXIÓN AL WEBHOOK ======================
        try {
            console.log(`📤 WEBHOOK: Enviando reporte de conexión para ${jugador.name}`);
            
            // Obtener datos completos del jugador para el reporte
            const datosJugador = obtenerDatosJugadorParaReporte(jugador, "join");
            
            // Enviar reporte al webhook de Discord
            enviarReporteJugadorDiscord(datosJugador);
            
        } catch (error) {
            console.error(`❌ Error enviando reporte de conexión para ${jugador.name}:`, error);
        }
        // ====================== FIN REPORTE WEBHOOK ======================
        
        // Actualizar nombre con nivel después de un breve delay
        setTimeout(() => {
            try {
                actualizarNombreConNivel(jugador);
            } catch (error) {
                console.error('❌ Error actualizando nombre con nivel:', error);
            }
        }, 500);
        
        // MOVER AUTOMÁTICAMENTE A EQUIPO - con delay para asegurar que el jugador esté completamente conectado
        // CORRECCIÓN: Agregar verificaciones adicionales antes de mover al jugador
        setTimeout(() => {
            try {
                // Verificar que el jugador aún esté conectado y no esté marcado como AFK
                const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
                if (!jugadorActual) {
                    console.log(`⚠️ DEBUG: ${jugador.name} ya no está conectado, cancelando movimiento automático`);
                    return;
                }
                
                // Verificar que no tenga advertencias AFK recientes
                if (jugadoresAFK.has(jugador.id) || advertenciasAFK.has(jugador.id)) {
                    console.log(`🚫 DEBUG: ${jugador.name} tiene estado AFK, no moviendo automáticamente`);
                    return;
                }
                
                console.log(`🔄 DEBUG: Intentando mover ${jugador.name} a un equipo...`);
                agregarJugadorAEquipo(jugadorActual);
            } catch (error) {
                console.error('❌ Error moviendo jugador a equipo:', error);
            }
        }, 1000);
        
    // Auto-detección de mapa - con múltiples intentos para asegurar el cambio
    setTimeout(() => {
        try {
            console.log(`🔄 DEBUG: Auto-detección de mapa tras entrada de jugador ${jugador.name}`);
            detectarCambioMapa();
        } catch (error) {
            console.error('❌ Error en detección de mapa:', error);
        }
    }, 2000);
    
    // Segundo intento de detección para casos donde el primer intento no funcione
    setTimeout(() => {
        try {
            console.log(`🔄 DEBUG: Segundo intento de auto-detección de mapa`);
            detectarCambioMapa();
        } catch (error) {
            console.error('❌ Error en segundo intento de detección de mapa:', error);
        }
    }, 4000);
    };
    
    // Jugador sale
    room.onPlayerLeave = function(jugador) {
        const nombreOriginal = obtenerNombreOriginal(jugador);
        
        // ====================== CAPTURAR AUTH ANTES DE LIMPIEZA ======================
        // Obtener el auth guardado al momento de la conexión antes de que se elimine
        const authGuardado = jugadoresUID.get(jugador.id);
        const authFinal = jugador.auth || authGuardado || null;
        console.log(`🔍 [AUTH LEAVE DEBUG] Jugador saliendo: ${nombreOriginal}`);
        console.log(`🔍 [AUTH LEAVE DEBUG] - Auth directo: ${jugador.auth}`);
        console.log(`🔍 [AUTH LEAVE DEBUG] - Auth guardado: ${authGuardado}`);
        console.log(`🔍 [AUTH LEAVE DEBUG] - Auth final: ${authFinal}`);
        // ====================== FIN CAPTURA AUTH ======================
        
        // Solo mostrar mensaje de desconexión si NO se fue voluntariamente
        if (!jugadoresSaliendoVoluntariamente.has(jugador.id)) {
            // Mensaje de desconexión eliminado por solicitud del usuario
            // anunciarGeneral(`👋 💨 ${nombreOriginal} se desconectó de la sala 💨`, "888888");
        } else {
            // Limpiar el flag ya que el jugador ya salió
            jugadoresSaliendoVoluntariamente.delete(jugador.id);
        }
        
        // Si era admin
        if (adminActual && adminActual.id === jugador.id) {
            adminActual = null;
            // Mensaje removido para evitar spam
        }
        
        // Limpiar datos del jugador que se fue
        jugadoresAFK.delete(jugador.id);
        advertenciasAFK.delete(jugador.id);
        nombresOriginales.delete(jugador.id);
        desafiosPPT.delete(jugador.id); // Asegurar eliminación de desafíos
        jugadoresActivos.delete(jugador.id);
        jugadoresConRoles.delete(jugador.id);
        mensajesPersonalizados.delete(jugador.id);
        spamControl.delete(jugador.id);
        cooldownGlobal.delete(jugador.id);
        jugadoresSilenciadosPorSpam.delete(jugador.id);
        jugadoresMuteados.delete(jugador.id);
        jugadoresUID.delete(jugador.id); // Limpiar UID generado
        
        // Limpiar mute temporal si existe
        const muteTemp = jugadoresMuteadosTemporales.get(jugador.id);
        if (muteTemp) {
            clearTimeout(muteTemp.timeoutId);
            jugadoresMuteadosTemporales.delete(jugador.id);
        }
        
        // ====================== LIMPIAR CONEXIÓN DE BASE DE DATOS ======================
        // Desactivar todas las conexiones del jugador en la base de datos
        try {
            if (typeof nodeDesactivarConexionesJugador === 'function') {
                // Usar tanto nombre como auth (si está disponible) para limpiar conexiones
                const authJugador = jugador.auth || null;
                nodeDesactivarConexionesJugador(jugador.name, authJugador).then(() => {
                    console.log(`🧹 Conexiones desactivadas para ${jugador.name} al salir`);
                }).catch(error => {
                    console.error(`❌ Error desactivando conexiones para ${jugador.name}:`, error);
                });
            }
        } catch (error) {
            console.error(`❌ Error al desactivar conexiones para ${jugador.name}:`, error);
        }
        
        // Limpiar datos de IP (sistema de memoria)
        try {
            limpiarConexionesIP(jugador);
        } catch (error) {
            console.error(`❌ Error limpiando conexiones IP para ${jugador.name}:`, error);
        }
        // ====================== FIN LIMPIEZA DE CONEXIÓN ======================
        
// ====================== REGISTRAR SALIDA DE JUGADOR ======================
        // Registrar la salida del jugador en la base de datos para tracking
        try {
            if (typeof nodeRegistrarSalidaJugador === 'function') {
                const authJugador = jugador.auth || null;
                const razonSalida = jugadoresSaliendoVoluntariamente.has(jugador.id) ? 'Voluntaria' : 'Desconexión';
                nodeRegistrarSalidaJugador(nombreOriginal, authJugador, jugador.id, razonSalida).then(() => {
                    console.log(`📝 Salida registrada: ${nombreOriginal} (ID: ${jugador.id}) - ${razonSalida}`);
                }).catch(error => {
                    console.error(`❌ Error registrando salida de ${nombreOriginal}:`, error);
                });
            }
        } catch (error) {
            console.error(`❌ Error al registrar salida de ${nombreOriginal}:`, error);
        }
        // ====================== FIN REGISTRO DE SALIDA ======================

        // ====================== WEBHOOK: LOG DE SALIDA ======================
        try {
            // Extraer ID de sala del enlace real (parámetro c=...)
            let salaId = null;
            try {
                if (enlaceRealSala && typeof enlaceRealSala === 'string') {
                    const match = enlaceRealSala.match(/[?&]c=([^&#]+)/);
                    salaId = match ? match[1] : enlaceRealSala;
                }
            } catch (e) {}
            const fechaHora = new Date().toLocaleString('es-AR', { hour12: false });
            enviarReporteSalidaDiscord({
                nombre: nombreOriginal,
                authId: authFinal,
                salaId,
                fechaHora,
                playerId: jugador.id
            });
        } catch (e) {
            // No interrumpir flujo ante fallos del webhook
        }
        // ====================== FIN WEBHOOK: LOG DE SALIDA ======================

        // Registrar puntuación del partido en estadísticas globales
        try {
            const statsGlobal = estadisticasGlobales.jugadores[jugador.name];
            if (statsGlobal) {
                statsGlobal.puntuaciones = statsGlobal.puntuaciones || [];
                const eqStats = estadisticasPartido.jugadores[jugador.id];
                if (eqStats && eqStats.puntuacionPartido !== undefined) {
                    statsGlobal.puntuaciones.push(eqStats.puntuacionPartido);
                }
            }
        } catch (error) {
            console.error(`❌ Error registrando puntuación para ${jugador.name}:`, error);
        }
        
        // Auto-detección de mapa y verificaciones mejoradas
        setTimeout(() => {
            try {
                detectarCambioMapa();
            } catch (error) {
                console.error(`❌ Error en detección de mapa post-salida:`, error);
            }
        }, 500);
        
        // BALANCE AUTOMÁTICO MEJORADO - Múltiples intentos para asegurar el balance
        setTimeout(() => {
            try {
                console.log(`🔄 DEBUG: Ejecutando balance post-salida para ${nombreOriginal}`);
                balanceInteligentePostSalida(nombreOriginal);
            } catch (error) {
                console.error(`❌ Error en balance inteligente post-salida:`, error);
            }
        }, 1000);
        
        // BALANCE AUTOMÁTICO CONTINUO - Segundo intento más robusto
        setTimeout(() => {
            try {
                console.log(`🔄 DEBUG: Ejecutando balance automático continuo tras salida de ${nombreOriginal}`);
                balanceAutomaticoContinuo();
            } catch (error) {
                console.error(`❌ Error en balance automático continuo:`, error);
            }
        }, 1500);
        
        // VERIFICACIÓN FINAL - Asegurar que los equipos estén balanceados
        setTimeout(() => {
            try {
                const equipos = obtenerCantidadJugadoresPorEquipo();
                console.log(`📊 DEBUG: Verificación final post-salida - Rojo: ${equipos.rojo}, Azul: ${equipos.azul}, Diferencia: ${equipos.diferencia}`);
                
                // Si aún hay diferencia mayor a 1, forzar balance adicional
                if (equipos.diferencia > 1 && equipos.rojo > 0 && equipos.azul > 0) {
                    console.log(`⚖️ DEBUG: Forzando balance adicional - diferencia ${equipos.diferencia} > 1`);
                    
                    // DEBUGGING MEJORADO: Verificar candidatos válidos antes del mensaje
                    const jugadoresRojo = equipos.jugadoresRojo || [];
                    const jugadoresAzul = equipos.jugadoresAzul || [];
                    const equipoMayor = jugadoresRojo.length > jugadoresAzul.length ? jugadoresRojo : jugadoresAzul;
                    
                    const candidatosValidos = equipoMayor.filter(jugador => {
                        if (esBot && esBot(jugador)) {
                            console.log(`🚫 DEBUG: ${jugador.name} es bot - excluido del balance`);
                            return false;
                        }
                        if (jugadoresAFK.has(jugador.id)) {
                            console.log(`🚫 DEBUG: ${jugador.name} está AFK - excluido del balance`);
                            return false;
                        }
                        return true;
                    });
                    
                    console.log(`🔍 DEBUG: Candidatos válidos para balance: ${candidatosValidos.length}/${equipoMayor.length}`);
                    candidatosValidos.forEach(c => console.log(`  ✓ ${c.name}`));
                    
                    if (candidatosValidos.length === 0) {
                        console.log(`❌ DEBUG: NO hay candidatos válidos - balance imposible`);
                        anunciarGeneral(`⚖️ ❌ No se puede equilibrar: todos los jugadores están AFK o son bots`, "FFA500", "normal");
                    } else {
                        anunciarGeneral(`⚖️ 🔄 Equilibrando equipos tras desconexión...`, "87CEEB", "bold");
                        balanceAutomaticoContinuo();
                    }
                }
                
                verificarAutoStart();
                verificarAutoStop(null);
            } catch (error) {
                console.error(`❌ Error en verificación final post-salida:`, error);
            }
        }, 2500);
    };
    
    // Enlace de la sala (CRÍTICO para Headless)
    room.onRoomLink = function(url) {
        
        // Verificar que la URL sea válida
        if (!url || typeof url !== 'string' || url.length === 0) {
            console.warn('❌ URL inválida recibida en onRoomLink:', url);
            return;
        }
        
        console.log('\n' + '🎆'.repeat(40));
        console.log('🔗 ¡¡¡ENLACE DE LA SALA CAPTURADO!!!');
        console.log('📋 URL RECIBIDA: ' + url);
        console.log('📍 Tipo de URL: ' + typeof url);
        console.log('📐 Longitud de URL: ' + (url ? url.length : 'null'));
        console.log('🕐 Timestamp: ' + new Date().toISOString());
        console.log('🎆'.repeat(40) + '\n');
        
        // Almacenar el enlace real para usar en los informes
        const enlaceAnterior = enlaceRealSala;
        enlaceRealSala = url;
        
        console.log(`🔄 Enlace actualizado de "${enlaceAnterior}" a "${enlaceRealSala}"`);
        
        // Enviar reporte inmediato con el enlace actualizado usando SOLO formato embed
        setTimeout(() => {
            try {
                console.log('📤 Enviando reporte de sala con enlace actualizado...');
                enviarOEditarReporteSala("Enlace de sala actualizado", false);
            } catch (error) {
                console.error("❌ Error en reporte de sala:", error);
            }
        }, 2000);
    };

    // Gol marcado
room.onTeamGoal = function(equipo) {
        const scores = room.getScores();
        
        console.log(`🥅 DEBUG: Gol detectado para equipo ${equipo}`);
        console.log(`🥅 DEBUG: ultimoTocador: ${ultimoTocador ? ultimoTocador.name + ' (equipo ' + ultimoTocador.team + ')' : 'null'}`);
        console.log(`🥅 DEBUG: penultimoTocador: ${penultimoTocador ? penultimoTocador.name + ' (equipo ' + penultimoTocador.team + ')' : 'null'}`);
        
        // Usar un tiempo de espera fijo de 3 segundos como aproximación del tiempo estándar
        // entre gol y saque del medio en Haxball
        const tiempoEsperaEstandar = 3; // 3 segundos
        
        estadisticasPartido.tiempoEsperaSaque += tiempoEsperaEstandar;
        
        // Acumular tiempo de espera por equipo para cálculo de valla invicta
        if (equipo === 1) {
            // Gol del equipo rojo, el tiempo de espera afecta a la valla del equipo azul
            estadisticasPartido.tiempoEsperaSaqueBlue += tiempoEsperaEstandar;
        } else {
            // Gol del equipo azul, el tiempo de espera afecta a la valla del equipo rojo
            estadisticasPartido.tiempoEsperaSaqueRed += tiempoEsperaEstandar;
        }

        // Registrar tiempo de valla invicta para el equipo que recibió el gol
        if (estadisticasPartido.iniciado) {
            const scores = room.getScores();
            const tiempoJuegoActual = Math.floor(scores ? scores.time : 0); // Tiempo real de juego en segundos
            
            if (equipo === 1) {
                // Gol del equipo rojo, el azul recibió gol - registrar cuánto duró su valla invicta
                if (estadisticasPartido.golesRed === 0) {
                    // Es el primer gol que recibe el azul
                    estadisticasPartido.tiempoVallaInvictaBlue = tiempoJuegoActual;
                }
            } else {
                // Gol del equipo azul, el rojo recibió gol - registrar cuánto duró su valla invicta
                if (estadisticasPartido.golesBlue === 0) {
                    // Es el primer gol que recibe el rojo
                    estadisticasPartido.tiempoVallaInvictaRed = tiempoJuegoActual;
                }
            }
        }
        
        // MEJORADO: Registro más robusto de goles
        if (estadisticasPartido.iniciado) {
            let goleadorDetectado = null;
            let asistenteDetectado = null;
            
            // MÉTODO 1: Usar ultimoTocador si está disponible
            if (ultimoTocador) {
                goleadorDetectado = ultimoTocador;
                // El asistente es el penúltimo tocador si es diferente al goleador
                asistenteDetectado = (penultimoTocador && penultimoTocador.id !== ultimoTocador.id) ? penultimoTocador : null;
                console.log(`🥅 DEBUG: Método 1 - Goleador: ${goleadorDetectado.name} (${goleadorDetectado.team}), Asistente: ${asistenteDetectado ? asistenteDetectado.name : 'ninguno'}`);
            } else {
                // MÉTODO 2: Si no hay ultimoTocador, buscar jugador más cercano al gol
                console.log(`⚠️ DEBUG: ultimoTocador es null, buscando goleador alternativo...`);
                const jugadores = room.getPlayerList();
                const jugadoresEquipoContrario = jugadores.filter(j => j.team !== 0 && j.team !== equipo);
                
                if (jugadoresEquipoContrario.length > 0) {
                    // Asumir que el primer jugador del equipo contrario hizo el autogol
                    goleadorDetectado = jugadoresEquipoContrario[0];
                    console.log(`🥅 DEBUG: Método 2 - Goleador autogol detectado: ${goleadorDetectado.name} (${goleadorDetectado.team})`);
                }
            }
            
            // Registrar el gol si tenemos un goleador
            if (goleadorDetectado) {
                registrarGol(goleadorDetectado, equipo, asistenteDetectado).catch(error => {
                    console.error('❌ Error en registrarGol:', error);
                });
            } else {
                // ÚLTIMO RECURSO: Registrar gol sin goleador específico
                console.log(`❌ DEBUG: No se pudo detectar goleador, registrando gol genérico`);
                registrarGolGenerico(equipo);
            }
        }

// Mostrar resultado actualizado después del gol

        // Detectar golden goal en overtime
        if (scores && scores.timeLimit === scores.time) {
            anunciarGeneral("👑 ¡GOL DE ORO! ¡PARTIDO FINALIZADO!", "FFD700", "bold");
        }
    };

    // Seguimiento de toques de pelota
    room.onPlayerBallKick = function(jugador) {
        const ahora = Date.now();
        
        // Solo actualizar si ha pasado al menos 100ms desde el último toque
        // Esto evita contar múltiples toques muy rápidos del mismo jugador
        if (ahora - tiempoUltimoToque > 100) {
            // Actualizar el seguimiento de tocadores
            if (ultimoTocador && ultimoTocador.id !== jugador.id) {
                penultimoTocador = ultimoTocador;
            }
            ultimoTocador = jugador;
            tiempoUltimoToque = ahora;
        }
    };
    
    // Jugador entra/sale del juego - MOVIMIENTOS BLOQUEADOS COMPLETAMENTE
    room.onPlayerTeamChange = function(jugador, equipoByAdmin) {
        // SISTEMA SIMPLIFICADO: BLOQUEAR TODOS LOS MOVIMIENTOS MANUALES
        // Solo permitir movimientos iniciados por:
        // 1. El bot/sistema (cuando esBot(jugador) es true)
        // 2. Movimientos programados por el bot (tracked in movimientoIniciadorPorBot Set)
        // 3. El equipoByAdmin cuando es explícitamente un admin quien lo mueve
        
        const esMovimientoDelBot = esBot(jugador) || movimientoIniciadorPorBot.has(jugador.id) || movimientoPermitidoPorComando.has(jugador.id);
        const esMovimientoDeAdmin = equipoByAdmin !== null && equipoByAdmin !== undefined;
        const esMezclaProcesandose = mezclaProcesandose; // Permitir movimientos durante mezcla automática
        
        // BLOQUEAR TODOS LOS MOVIMIENTOS MANUALES DE JUGADORES (EXCEPTO DURANTE MEZCLA)
        if (!esMovimientoDelBot && !esMovimientoDeAdmin && !esMezclaProcesandose) {
            // Obtener el equipo anterior del jugador
            const equipoAnterior = equiposJugadoresAntesMovimiento.get(jugador.id) || 0;
            
            console.log(`🚫 MOVIMIENTO BLOQUEADO: ${jugador.name} intentó cambiar de equipo manualmente`);
            console.log(`🔄 Revirtiendo: Equipo ${jugador.team} -> Equipo ${equipoAnterior}`);
            
            // Marcar como movimiento del bot para evitar loops
            movimientoIniciadorPorBot.add(jugador.id);
            
            // Revertir el movimiento inmediatamente
            setTimeout(() => {
                try {
                    room.setPlayerTeam(jugador.id, equipoAnterior);
                } catch (error) {
                    console.error(`❌ Error revirtiendo movimiento de ${jugador.name}:`, error);
                }
            }, 50);
            
            return false; // Bloquear el evento
        }
        
        // El movimiento está permitido - limpiar permisos temporales y actualizar registro
        if (movimientoPermitidoPorComando.has(jugador.id)) {
            movimientoPermitidoPorComando.delete(jugador.id);
            console.log(`✅ DEBUG: Movimiento por comando completado para ${jugador.name} (ID: ${jugador.id})`);
        }
        
        // Limpiar tracking de movimientos iniciados por el bot
        if (movimientoIniciadorPorBot.has(jugador.id)) {
            movimientoIniciadorPorBot.delete(jugador.id);
            console.log(`✅ DEBUG: Movimiento iniciado por bot completado para ${jugador.name} (ID: ${jugador.id})`);
        }
        
        // Actualizar el registro de equipos
        equiposJugadoresAntesMovimiento.set(jugador.id, jugador.team);
        
        // CORRECCIÓN: Registrar jugadores que se unen durante el partido
        if (estadisticasPartido.iniciado && jugador.team !== 0) {
            // Registrar jugador en estadísticas si se une a un equipo durante el partido
            if (!estadisticasPartido.jugadores[jugador.id]) {
                const nombreOriginal = obtenerNombreOriginal(jugador);
                console.log(`🆕 PARTIDO: Registrando jugador tardío ${nombreOriginal} en equipo ${jugador.team}`);
                estadisticasPartido.jugadores[jugador.id] = {
                    nombre: nombreOriginal,
                    equipo: jugador.team, // Usar el equipo actual, no equipoByAdmin
                    goles: 0,
                    asistencias: 0,
                    autogoles: 0,
                    arquero: false,
                    tiempo: 0
                };
            } else {
                // Si ya existía, actualizar el equipo por si cambió
                const statsExistente = estadisticasPartido.jugadores[jugador.id];
                if (statsExistente.equipo !== jugador.team) {
                    console.log(`🔄 PARTIDO: Actualizando equipo de ${statsExistente.nombre}: ${statsExistente.equipo} -> ${jugador.team}`);
                    statsExistente.equipo = jugador.team;
                }
            }
        }
        
        // CORRECCIÓN CRÍTICA: Solo limpiar datos AFK si el jugador se UNIÓ VOLUNTARIAMENTE a un equipo
        // NO limpiar AFK si:
        // 1. Fue movido a espectadores (team = 0)
        // 2. Está siendo movido automáticamente por el sistema
        // 3. Está marcado como AFK y debería permanecer en espectadores
        if (jugador.team !== 0 && !jugadoresAFK.has(jugador.id)) {
            // Solo limpiar advertencias AFK si se unió voluntariamente a un equipo
            advertenciasAFK.delete(jugador.id);
            console.log(`✅ DEBUG: Limpiando advertencias AFK de ${jugador.name} - se unió al equipo ${jugador.team}`);
        } else if (jugador.team === 0) {
            // Si fue movido a espectadores, mantener completamente el estado AFK
            console.log(`🚫 DEBUG: Manteniendo estado AFK completo de ${jugador.name} - movido a espectadores`);
        } else if (jugadoresAFK.has(jugador.id) && jugador.team !== 0) {
            // Si un jugador AFK fue movido a un equipo (posiblemente por admin), mantener su estado AFK
            // hasta que demuestre actividad
            console.log(`⚠️ DEBUG: Jugador AFK ${jugador.name} fue movido al equipo ${jugador.team} - manteniendo estado AFK`);
        }
        
        // Verificar auto start/stop después del cambio de equipo
        setTimeout(() => {
            verificarAutoStart();
            verificarAutoStop(null);
        }, 500);
    };
    
    // Admin change - Solo permitir admin de sala a SUPER_ADMIN
    room.onPlayerAdminChange = function(jugador, esByJugador) {
        if (esByJugador) {
            // Verificar si el jugador tiene rol de SUPER_ADMIN
            const rolJugador = jugadoresConRoles.get(jugador.id);
            const esSuperAdmin = rolJugador && rolJugador.role === "SUPER_ADMIN";
            
            if (esSuperAdmin && !adminActual) {
                adminActual = jugador;
                anunciarExito(`👑 ${jugador.name} (SUPER_ADMIN) reclamó administrador de sala`);
                console.log(`👑 Admin de sala reclamado por SUPER_ADMIN: ${jugador.name}`);
            } else if (!esSuperAdmin) {
                // Remover admin de sala si no es SUPER_ADMIN
                console.log(`🚨 Jugador sin rol SUPER_ADMIN intentó reclamar admin de sala: ${jugador.name}`);
                setTimeout(() => {
                    try {
                        room.setPlayerAdmin(jugador.id, false);
                        anunciarAdvertencia(`⚠️ Solo los SUPER_ADMIN (owners) pueden tener administrador de sala`, jugador);
                        anunciarInfo(`🛡️ Los ADMIN_FULL y ADMIN_BASICO solo tienen comandos del bot, no admin de sala`, jugador);
                    } catch (error) {
                        console.error(`❌ Error removiendo admin de sala no autorizado:`, error);
                    }
                }, 100);
            }
        }
    };

    // Inicio del juego
    room.onGameStart = function(jugadorByAdmin) {
        partidoEnCurso = true;
        tiempoInicioPartido = Date.now(); // Registrar el inicio del partido
        
        if (validarMapaPersonalizado()) {
            inicializarEstadisticas();
            
            // Actualizar cache de mensajes personalizados para optimizar goles
            setTimeout(() => actualizarCacheMensajes(), 1000);
            
            // Mensaje de inicio del partido removido
            
            // Inicializar grabación de replay
            if (typeof room.startRecording === 'function') {
                try {
                    room.startRecording();
                    anunciarInfo("🎥 Grabación de replay iniciada");
                } catch (error) {
                    console.log("❌ Error al iniciar grabación:", error);
                }
            }
            
            // CORRECCIÓN: Verificar posiciones de spawn solo si es necesario
            setTimeout(() => {
                // Solo corregir posiciones al inicio si hay jugadores en posiciones extremas
                const jugadores = room.getPlayerList();
                const hayPosicionesExtremas = jugadores.some(j => {
                    if (!j.position || j.team === 0) return false;
                    const posX = j.position.x;
                    // Solo intervenir si hay jugadores en posiciones muy extremas
                    return (j.team === 1 && posX > 800) || (j.team === 2 && posX < -800);
                });
                
                if (hayPosicionesExtremas) {
                    console.log('🚨 DEBUG: Detectadas posiciones extremas al inicio, corrigiendo...');
                    corregirPosicionesSpawn();
                } else {
                    console.log('✅ DEBUG: Posiciones de spawn parecen normales, no se requiere corrección');
                }
            }, 100);
            
            // Detectar arqueros
            setTimeout(() => {
                detectarArqueros();
            }, 2000);
        }
    };
    
    // Fin del juego
    room.onGameStop = function(jugadorByAdmin) {
        partidoEnCurso = false;
        
        // CORRECCIÓN: Verificar posiciones solo si hay problemas reales al finalizar
        setTimeout(() => {
            try {
                console.log('🔧 DEBUG: Verificando si hay posiciones problemáticas al finalizar partido');
                const jugadores = room.getPlayerList();
                const hayProblemas = jugadores.some(j => {
                    if (!j.position || j.team === 0) return false;
                    const posX = j.position.x;
                    const posY = j.position.y;
                    // Solo corregir si hay posiciones realmente problemáticas
                    return Math.abs(posX) > 900 || Math.abs(posY) > 350;
                });
                
                if (hayProblemas) {
                    console.log('🚨 DEBUG: Detectados problemas de posición al finalizar, corrigiendo...');
                    corregirPosicionesSpawn();
                } else {
                    console.log('✅ DEBUG: No se detectaron problemas de posición al finalizar');
                }
            } catch (error) {
                console.error('❌ Error verificando posiciones al finalizar partido:', error);
            }
        }, 200);
        
        if (estadisticasPartido.iniciado) {
            estadisticasPartido.duracion = Math.floor((Date.now() - tiempoInicioPartido) / 1000) - estadisticasPartido.tiempoEsperaSaque; // Restar el tiempo de espera para saque
            
            // Verificar si el partido terminó por cambio de mapa
            if (terminoPorCambioMapa) {
                console.log('🏁 DEBUG: Partido finalizado por cambio de mapa. Omitiendo envío de replay e informes.');
                estadisticasPartido.iniciado = false;
                liberarBloqueoReplay('Fin por cambio de mapa');
                return;
            }

            // ACTIVAR BLOQUEO DE AUTO-START HASTA COMPLETAR ENVÍO DE REPLAY
            bloqueadoPorReplay = true;
            intentosAutoStartBloqueados = 0; // Resetear contador
            console.log(`🔒 DEBUG: Activando bloqueo de auto-start para envío de replay`);
            
            // Actualizar tiempo jugado de cada jugador activo hasta el final del partido
            const jugadoresActuales = room.getPlayerList();
            jugadoresActuales.forEach(jugadorActual => {
                const stats = estadisticasPartido.jugadores[jugadorActual.id];
                if (stats && jugadorActual.team !== 0) {
                    // El tiempo total que estuvo en un equipo es la duración del partido
                    // (esto es una aproximación, en un sistema más avanzado trackearíamos cambios de equipo)
                    stats.tiempo = estadisticasPartido.duracion;
                }
            });
            
            // PRIMERO: Enviar informe de la sala usando formato embed consistente
            if (tieneEnlaceReal()) {
                console.log(`📤 Enviando reporte de sala post-partido...`);
                enviarOEditarReporteSala("Partido finalizado - Reporte de sala", false);
            }
            
            anunciarGeneral("🏁 ⭐ ¡PARTIDO FINALIZADO! ⭐ 🏁", "FFA500", "bold");
            
const mejorJugador = calcularMejorJugador();
            if (mejorJugador) {
                anunciarGeneral(`⭐ 👑 MEJOR JUGADOR: ${mejorJugador.nombre.toUpperCase()} 👑 ⭐`, "FFD700", "bold");
                // Guardar MVP en las estadísticas del partido para actualizar globales
                estadisticasPartido.mejorJugador = mejorJugador;
            }
            
            // Enviar puntuaciones privadas a cada jugador después de mostrar el resultado
            enviarPuntuacionesPrivadas(); // Eliminado delay innecesario
            
            // Finalizar replay antes de enviar reporte
            finalizarReplay();
            
            // Guardar replay en PC si está configurado
            if (guardarReplaysEnPC) {
                guardarReplayEnPC();
            }
            
            // SEGUNDO: Enviar reporte del partido (con replay) si es oficial o si se guardan amistosos
            if (guardarAmistosos && !reporteEnviado) {
                enviarReportePartidoDiscord(); // Eliminado delay innecesario
            } else {
                // Si no se envía reporte, liberar bloqueo inmediatamente
                console.log(`🔓 DEBUG: No hay reporte que enviar, liberando bloqueo inmediatamente`);
                liberarBloqueoReplay("No hay reporte que enviar");
            }
            
            // Actualizar estadísticas globales antes del reset
            actualizarEstadisticasGlobales(estadisticasPartido);
            
            // Reset estadísticas
            estadisticasPartido.iniciado = false;
            
            // VERIFICAR CAMBIO DE MAPA POST-PARTIDO
            setTimeout(() => {
                verificarCambioMapaPostPartido();
            }, 1000); // Verificar cambio de mapa antes de mezclar equipos
            
            // MEZCLAR EQUIPOS AUTOMÁTICAMENTE - CON DELAY PARA PERMITIR ENVÍO DE REPLAY
            setTimeout(() => {
                mezclarEquiposAleatoriamenteFinPartido();
            }, 3000); // Esperar 3 segundos para que termine el envío del replay
        } else {
            // Si no había estadísticas iniciadas, hacer auto balance y verificar auto start
            setTimeout(() => {
                autoBalanceEquipos();
                
                // El bloqueo de movimiento es permanente - no desactivar
                // Solo limpiar permisos temporales si los hay
                movimientoPermitidoPorComando.clear();
                console.log("🧹 DEBUG: Limpieza de permisos temporales de movimiento");
                
                setTimeout(() => {
                    verificarAutoStart();
                }, 300);
            }, 500);
        }
    };
}

// Función para mostrar puntuación de jugador
function mostrarPuntuacionJugador(jugador) {
const stats = obtenerEstadisticasJugador(jugador);
    
    if (stats) {
        // Calcular puntuación total
        const puntuacionTotal = (
            stats.goles * 3 +           // 3 puntos por gol
            stats.asistencias * 2 +     // 2 puntos por asistencia
            stats.vallasInvictas * 5 +  // 5 puntos por valla invicta
            stats.hatTricks * 10 -      // 10 puntos por hat-trick (MVP)
            stats.autogoles * 2         // -2 puntos por autogol
        );
        
        room.sendAnnouncement("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
        room.sendAnnouncement(`🏆 PUNTUACIÓN DE ${jugador.name.toUpperCase()}`, jugador.id, parseInt(AZUL_LNB, 16), "bold", 0);
        room.sendAnnouncement("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
        room.sendAnnouncement(`⚽ Goles: ${stats.goles} (${stats.goles * 3} pts)`, jugador.id, parseInt("00FF00", 16), "normal", 0);
        room.sendAnnouncement(`🎯 Asistencias: ${stats.asistencias} (${stats.asistencias * 2} pts)`, jugador.id, parseInt("00FF00", 16), "normal", 0);
        room.sendAnnouncement(`🥅 Vallas invictas: ${stats.vallasInvictas} (${stats.vallasInvictas * 5} pts)`, jugador.id, parseInt("00FF00", 16), "normal", 0);
        room.sendAnnouncement(`👑 Hat-tricks: ${stats.hatTricks} (${stats.hatTricks * 10} pts)`, jugador.id, parseInt("FFD700", 16), "normal", 0);
        if (stats.autogoles > 0) {
            room.sendAnnouncement(`🤦 Autogoles: ${stats.autogoles} (-${stats.autogoles * 2} pts)`, jugador.id, parseInt("FF0000", 16), "normal", 0);
        }
        room.sendAnnouncement("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
        room.sendAnnouncement(`📊 PUNTUACIÓN TOTAL: ${puntuacionTotal} puntos`, jugador.id, parseInt("FFD700", 16), "bold", 0);
        room.sendAnnouncement("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", jugador.id, parseInt(AZUL_LNB, 16), "normal", 0);
    } else {
        anunciarError("❌ No tienes estadísticas registradas aún", jugador);
    }
}


// FUNCIÓN CORREGIDA: obtenerInfoSala
function obtenerInfoSala() {
    try {
        if (!room) {
            console.warn('⚠️ Room no disponible para obtener info');
            return {
                nombre: roomName || "Sala LNB",
                enlace: enlaceRealSala || "[Enlace no disponible]",
                jugadoresTotales: 0,
                jugadoresEnJuego: 0,
                maxJugadores: maxPlayers || 23,
                contraseña: contraseñaActual,
                esPublica: !contraseñaActual,
                estadoPartido: "En espera",
                tiempoPartido: "--:--",
                resultadoActual: "0 - 0"
            };
        }
        
        const jugadores = room.getPlayerList();
        const totalJugadores = jugadores.filter(j => j.id !== 0).length; // Excluir bot
        const jugadoresEnJuego = jugadores.filter(j => j.team === 1 || j.team === 2).length;
        
        // Determinar estado del partido
        let estadoPartido = "En espera";
        let tiempoPartido = "--:--";
        let resultadoActual = "0 - 0";
        
        if (partidoEnCurso) {
            try {
                const scores = room.getScores();
                if (scores) {
                    const minutos = Math.floor(scores.time / 60);
                    const segundos = Math.floor(scores.time % 60);
                    tiempoPartido = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
                    resultadoActual = `${scores.red} - ${scores.blue}`;
                    estadoPartido = "En partido";
                }
            } catch (e) {
                console.warn('⚠️ No se pudieron obtener scores:', e.message);
            }
        }
        
        return {
            nombre: roomName || "Sala LNB",
            enlace: enlaceRealSala || "[Enlace no disponible]",
            jugadoresTotales: totalJugadores,
            jugadoresEnJuego: jugadoresEnJuego,
            maxJugadores: maxPlayers || 23,
            contraseña: contraseñaActual,
            esPublica: !contraseñaActual,
            estadoPartido,
            tiempoPartido,
            resultadoActual
        };
    } catch (error) {
        console.error('❌ Error en obtenerInfoSala:', error);
        return {
            nombre: roomName || "Sala LNB",
            enlace: enlaceRealSala || "[Enlace no disponible]",
            jugadoresTotales: 0,
            jugadoresEnJuego: 0,
            maxJugadores: maxPlayers || 23,
            contraseña: contraseñaActual,
            esPublica: !contraseñaActual,
            estadoPartido: "Error",
            tiempoPartido: "--:--",
            resultadoActual: "0 - 0"
        };
    }
}

// Función para enviar o editar mensaje según corresponda
function enviarOEditarReporteSala(razon = "Reporte automático", forzarEnvio = false) {
    try {
        // Control de throttling para evitar spam de reportes
        const ahora = Date.now();
        if (!forzarEnvio && (ahora - ultimoReporteSala) < INTERVALO_MINIMO_REPORTE) {
            console.log('🕐 DEBUG: Reporte ignorado por throttling - muy pronto desde el último');
            return;
        }
        ultimoReporteSala = ahora;
        
        if (!webhookReportesSala || webhookReportesSala.length === 0) {
            console.warn('⚠️ Webhook de reportes no configurado');
            return;
        }
        
        // Siempre editar en lugar de enviar nuevo mensaje
        const ALWAYS_EDIT = true;
        
        console.log('📊 DEBUG: Iniciando envío/edición de reporte de sala');
        console.log('🆔 DEBUG: ID de mensaje actual:', MENSAJE_IDS_DISCORD.reportesSala);
        console.log('🔄 DEBUG: Forzar envío:', forzarEnvio);
        
        const info = obtenerInfoSala();
        const estadoSala = info.esPublica ? "pública" : "privada";
        const iconoEstado = info.esPublica ? "🟢" : "🔴";
        
        // Emojis específicos para contraseña
        const iconoContraseña = info.contraseña ? "🔒" : "🔓";
        const contraseñaTexto = info.contraseña ? `"${info.contraseña}"` : "Sin contraseña";
        
        // Emoji para estado del partido
        let estadoEmoji = "⏳"; // Por defecto esperando jugadores
        let estadoTexto = "Esperando jugadores";
        
        if (info.jugadoresEnJuego >= 2 && !partidoEnCurso) {
            estadoEmoji = "🧍🧍‍♂️";
            estadoTexto = "Jugadores presentes, pero sin juego aún";
        } else if (partidoEnCurso) {
            estadoEmoji = "🕹️";
            estadoTexto = "Partido en juego";
        }
        
        // Formatear el mensaje según el nuevo formato ASCII sin embed
        const tipoSala = info.esPublica ? "Pública" : "Privada";
        const enlaceTexto = info.enlace !== "[Enlace no disponible]" ? info.enlace : "Enlace no disponible";
        
        // Crear mensaje con formato ASCII
        let mensaje = `╭━━━ 🏟️ Sala ${tipoSala} de Haxball ━━━╮\n`;
mensaje += `┃ 🏷️ Nombre: \`${info.nombre}\`\n`;
mensaje += `┃ 🔗 Enlace: ${enlaceTexto}\n`;
mensaje += `┃ 👥 Jugadores: \`${info.jugadoresEnJuego} / ${info.maxJugadores}\`\n`;
mensaje += `┃ ${iconoContraseña} Contraseña: \`${contraseñaTexto}\`\n`;
mensaje += `┃ ${estadoEmoji} Estado: ${estadoTexto}\n`;

        
        if (partidoEnCurso) {
            mensaje += `┃ ⏱️ Tiempo: ${info.tiempoPartido}\n`;
            mensaje += `┃ ⚽ Resultado: 🔴 ${info.resultadoActual} 🔵\n`;
        }
        
        mensaje += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n`;
        
        
        // Si es cambio de contraseña, agregar encabezado especial
        let contenidoFinal = mensaje;
        if (forzarEnvio) {
            contenidoFinal = `🔐 **CAMBIO AUTOMÁTICO DE CONTRASEÑA MENSUAL**\n\n${mensaje}`;
        }
        
        const payload = {
            content: contenidoFinal
        };
        
        // Intentar editar si tenemos ID de mensaje previo de reportes de sala o si ALWAYS_EDIT está activado
        if (MENSAJE_IDS_DISCORD.reportesSala && (ALWAYS_EDIT || !forzarEnvio)) {
            editarMensajeDiscordReportes(payload);
        } else {
            enviarNuevoMensajeDiscordReportes(payload);
        }
    } catch (error) {
        console.error('❌ Error en enviarOEditarReporteSala:', error);
    }
}

// Función para editar mensaje existente de reportes de sala
function editarMensajeDiscordReportes(payload) {
    console.log('🔧 DEBUG: Iniciando edición de mensaje con ID:', MENSAJE_IDS_DISCORD.reportesSala);
    console.log('🔧 DEBUG: Payload para edición:', JSON.stringify(payload, null, 2));

    // Usar nueva función nodeEditarMensajeDiscord si está disponible
    if (typeof nodeEditarMensajeDiscord === 'function') {
        console.log('📡 DEBUG: Usando nodeEditarMensajeDiscord para edición...');
        
        nodeEditarMensajeDiscord(webhookReportesSala, MENSAJE_IDS_DISCORD.reportesSala, payload)
            .then(result => {
                if (result.success) {
                    console.log('✅ DEBUG: Mensaje editado exitosamente via nodeEditarMensajeDiscord');
                    console.log('🆔 DEBUG: ID del mensaje confirmado:', result.messageId);
                    
                    // Actualizar ID si cambió
                    if (result.messageId && result.messageId !== MENSAJE_IDS_DISCORD.reportesSala) {
                        MENSAJE_IDS_DISCORD.reportesSala = result.messageId;
                    }
                } else {
                    console.log('❌ DEBUG: Error en nodeEditarMensajeDiscord:', result.status, result.error);
                    throw new Error(`nodeEditarMensajeDiscord falló: ${result.status || result.error}`);
                }
            })
            .catch(error => {
                console.error('❌ DEBUG: Error en nodeEditarMensajeDiscord:', error);
                console.log('🔄 DEBUG: Intentando con fetch como respaldo...');
                usarFetchParaEdicion(`${webhookReportesSala}/messages/${MENSAJE_IDS_DISCORD.reportesSala}`, payload);
            });
    } else {
        console.log('📡 DEBUG: Usando fetch nativo para edición...');
        usarFetchParaEdicion(`${webhookReportesSala}/messages/${MENSAJE_IDS_DISCORD.reportesSala}`, payload);
    }
}

// Función auxiliar para usar fetch en la edición
function usarFetchParaEdicion(webhookEditUrl, payload) {
    // Construir URL correcta para editar mensaje de webhook
    // Extraer webhook ID y token de la URL original del webhook
    const webhookMatch = webhookReportesSala.match(/\/webhooks\/(\d+)\/([a-zA-Z0-9_-]+)/);
    if (!webhookMatch) {
        console.error('❌ DEBUG: No se pudo extraer webhook ID y token de la URL');
        return;
    }
    
    const webhookId = webhookMatch[1];
    const webhookToken = webhookMatch[2];
    const correctEditUrl = `https://discord.com/api/webhooks/${webhookId}/${webhookToken}/messages/${MENSAJE_IDS_DISCORD.reportesSala}`;
    
    console.log('🔧 DEBUG: URL de webhook original:', webhookReportesSala);
    console.log('🔧 DEBUG: URL de edición corregida:', correctEditUrl);
    console.log('🔧 DEBUG: ID del mensaje a editar:', MENSAJE_IDS_DISCORD.reportesSala);
    
    fetch(correctEditUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        console.log('📡 DEBUG: Respuesta de edición - Status:', response.status);
        console.log('📡 DEBUG: Respuesta OK:', response.ok);
        
        if (response.ok) {
            console.log('✅ DEBUG: Mensaje de reportes editado exitosamente');
            return response.json();
        } else {
            console.log('❌ DEBUG: Error al editar mensaje - status:', response.status);
            return response.text().then(text => {
                console.log('❌ DEBUG: Respuesta de error:', text);
                throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
            });
        }
    })
    .then(data => {
        console.log('📤 DEBUG: Edición completada exitosamente, data:', data);
        // Confirmar que el ID sigue siendo válido
        if (data && data.id && data.id !== MENSAJE_IDS_DISCORD.reportesSala) {
            console.log('🆔 DEBUG: ID del mensaje actualizado:', data.id);
            MENSAJE_IDS_DISCORD.reportesSala = data.id;
        }
    })
    .catch(error => {
        console.error('❌ DEBUG: Error en edición de mensaje de reportes:', error);
        console.log('🔄 DEBUG: El mensaje podría haber sido eliminado, enviando uno nuevo...');
        // Resetear ID y enviar mensaje nuevo
        const idAnterior = MENSAJE_IDS_DISCORD.reportesSala;
        MENSAJE_IDS_DISCORD.reportesSala = null;
        console.log('🗑️ DEBUG: ID resetado de', idAnterior, 'a null');
        
        setTimeout(() => {
            console.log('🔄 DEBUG: Enviando mensaje nuevo como respaldo después de fallo en edición');
            enviarNuevoMensajeDiscordReportes(payload);
        }, 2000); // Aumentar delay a 2 segundos
    });
}

// Función para enviar nuevo mensaje de reportes de sala
function enviarNuevoMensajeDiscordReportes(payload) {
    // console.log('📤 DEBUG: Enviando nuevo mensaje de reportes...');
    // console.log('🔗 DEBUG: Webhook URL:', webhookReportesSala);
    // console.log('📦 DEBUG: Payload:', JSON.stringify(payload, null, 2));
    
    // Usar función nodeEnviarWebhook si está disponible (para Node.js)
    if (typeof nodeEnviarWebhook === 'function') {
        console.log('📡 DEBUG: Usando nodeEnviarWebhook para envío...');
        
        nodeEnviarWebhook(webhookReportesSala, payload)
            .then(result => {
                if (result.success) {
                    console.log('✅ DEBUG: Mensaje enviado exitosamente via nodeEnviarWebhook');
                    
                    // Guardar ID del mensaje si está disponible
                    if (result.messageId) {
                        MENSAJE_IDS_DISCORD.reportesSala = result.messageId;
                        console.log('🆔 DEBUG: ID del mensaje guardado:', result.messageId);
                    } else {
                        console.log('⚠️ DEBUG: No se recibió ID del mensaje con nodeEnviarWebhook');
                    }
                } else {
                    throw new Error('nodeEnviarWebhook falló');
                }
            })
            .catch(error => {
                console.error('❌ DEBUG: Error en nodeEnviarWebhook:', error);
                console.log('🔄 DEBUG: Intentando con fetch como respaldo...');
                usarFetchParaEnvio(payload);
            });
    } else {
        console.log('📡 DEBUG: Usando fetch nativo para envío...');
        usarFetchParaEnvio(payload);
    }
}

// Función auxiliar para usar fetch en el envío
function usarFetchParaEnvio(payload) {
    // Agregar wait=true para obtener el ID real del mensaje
    const webhookUrlConWait = webhookReportesSala + '?wait=true';
    
    fetch(webhookUrlConWait, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        // console.log('📡 DEBUG: Respuesta de envío - Status:', response.status);
        // console.log('📡 DEBUG: Respuesta OK:', response.ok);
        
        if (response.ok) {
            return response.json();
        } else {
            return response.text().then(text => {
                console.log('❌ DEBUG: Error en envío:', text);
                throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
            });
        }
    })
    .then(data => {
        // console.log('✅ DEBUG: Nuevo mensaje de reportes enviado exitosamente');
        // console.log('📋 DEBUG: Respuesta completa:', data);
        
        if (data && data.id) {
            const idAnterior = MENSAJE_IDS_DISCORD.reportesSala;
            MENSAJE_IDS_DISCORD.reportesSala = data.id;
            console.log('🆔 DEBUG: ID del mensaje guardado:', data.id);
            console.log('🔄 DEBUG: ID anterior:', idAnterior, '-> ID nuevo:', data.id);
            
            // Marcar enlace como confirmado si se solicita
            if (!enlaceRealConfirmado && enlaceRealSala && !enlaceRealSala.includes('abcd1234')) {
                enlaceRealConfirmado = true;
                console.log('🔗 DEBUG: enlaceRealConfirmado = true (mensaje nuevo enviado)');
            }
        } else {
            console.warn('⚠️ DEBUG: No se recibió ID en la respuesta:', data);
        }
    })
    .catch(error => {
        console.error('❌ DEBUG: Error al enviar nuevo mensaje de reportes:', error);
        // En caso de error, resetear el ID para forzar nuevos envíos
        MENSAJE_IDS_DISCORD.reportesSala = null;
        console.log('🗑️ DEBUG: ID resetado a null debido al error');
    });
}

// Función para editar mensaje existente en Discord (función general mantenida para compatibilidad)
function editarMensajeDiscord(mensaje) {
    if (!ultimoMensajeDiscordId) {
        console.log('❌ DEBUG: No hay mensaje previo para editar, enviando mensaje nuevo...');
        enviarMensajeDiscord(mensaje);
        return;
    }

    const webhookUrl = webhookReportesSala;
    if (!webhookUrl || webhookUrl.length === 0) {
        console.log('❌ DEBUG: No hay webhook URL configurado para editar');
        return;
    }

    // URL para editar mensaje usando webhook
    const webhookEditUrl = `${webhookUrl}/messages/${ultimoMensajeDiscordId}`;
    console.log('🔧 DEBUG: Editando mensaje con ID:', ultimoMensajeDiscordId);

    const payload = {
        content: mensaje
    };

    fetch(webhookEditUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            console.log('✅ DEBUG: Mensaje editado exitosamente en Discord');
        } else {
            console.log('❌ DEBUG: Error al editar mensaje:', response.status);
            // Si falla la edición, enviar mensaje nuevo como respaldo
            console.log('🔄 DEBUG: Enviando mensaje nuevo como respaldo...');
            ultimoMensajeDiscordId = null; // Resetear ID para próximos envíos
            enviarMensajeDiscord(mensaje);
        }
    })
    .catch(error => {
        console.error('❌ DEBUG: Error en fetch al editar mensaje:', error);
        // Si falla la edición, enviar mensaje nuevo como respaldo
        console.log('🔄 DEBUG: Enviando mensaje nuevo como respaldo...');
        ultimoMensajeDiscordId = null; // Resetear ID para próximos envíos
        enviarMensajeDiscord(mensaje);
    });
}

// FUNCIÓN DEPRECADA - Reemplazada por enviarOEditarReporteSala para consistencia
function enviarOEditarMensajeDiscord(mensaje, confirmarEnlace = false) {
    console.warn('⚠️ enviarOEditarMensajeDiscord() está deprecada - redirigiendo a enviarOEditarReporteSala()');
    console.log('📤 DEBUG: Redirigiendo a formato embed unificado');
    
    // Redirigir a la función unificada
    enviarOEditarReporteSala("Mensaje redirigido desde función deprecada", confirmarEnlace);
}

// FUNCIÓN DEPRECADA - Reemplazada por enviarOEditarReporteSala para consistencia
function enviarMensajeDiscord(mensaje, confirmarEnlace = false) {
    console.warn('⚠️ enviarMensajeDiscord() está deprecada - redirigiendo a enviarOEditarReporteSala()');
    console.log('📤 DEBUG: Redirigiendo mensaje de texto simple a formato embed unificado');
    
    // Redirigir a la función unificada que usa embeds
    enviarOEditarReporteSala("Mensaje redirigido desde función deprecada", confirmarEnlace);
}

// Función fallback usando XMLHttpRequest para entornos donde fetch no funciona
function enviarMensajeDiscordXHR(webhookUrl, payload, confirmarEnlace = false) {
    try {
        console.log('🔄 DEBUG: Usando XMLHttpRequest para enviar mensaje...');
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', webhookUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('📤 DEBUG XHR: Estado final:', xhr.readyState, 'Status:', xhr.status);
                
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log('✅ DEBUG XHR: Mensaje enviado exitosamente');
                    
                    try {
                        const data = JSON.parse(xhr.responseText);
                        if (data && data.id) {
                            ultimoMensajeDiscordId = data.id;
                            console.log('🆔 DEBUG XHR: ID del mensaje guardado:', ultimoMensajeDiscordId);
                        }
                    } catch (parseError) {
                        console.log('⚠️ DEBUG XHR: No se pudo parsear respuesta, pero envío exitoso');
                    }
                    
                    if (confirmarEnlace) {
                        enlaceRealConfirmado = true;
                        console.log('🔗 DEBUG XHR: enlaceRealConfirmado = true');
                    }
                } else {
                    console.error('❌ DEBUG XHR: Error en envío:', xhr.status, xhr.statusText);
                    console.error('❌ DEBUG XHR: Respuesta:', xhr.responseText);
                }
            }
        };
        
        xhr.onerror = function() {
            console.error('❌ DEBUG XHR: Error de red al enviar mensaje');
        };
        
        xhr.ontimeout = function() {
            console.error('❌ DEBUG XHR: Timeout al enviar mensaje');
        };
        
        // Establecer timeout de 10 segundos
        xhr.timeout = 10000;
        
        xhr.send(JSON.stringify(payload));
        console.log('📦 DEBUG XHR: Payload enviado');
        
    } catch (error) {
        console.error('❌ DEBUG XHR: Error general:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}

// Función para verificar si el enlace real está disponible
function tieneEnlaceReal() {
    // Si ya se confirmó el envío exitoso del enlace real, siempre permitir
    if (enlaceRealConfirmado) {
        return true;
    }
    // Si no, verificar que tengamos un enlace real válido
    return enlaceRealSala && !enlaceRealSala.includes('abcd1234');
}

// FUNCIÓN DEPRECADA - Reemplazada por enviarOEditarReporteSala para consistencia
// Esta función ya no se usa para evitar inconsistencias en formatos
function generarInformeSala(razon = "Estado de sala actualizado", forzarEnvio = false) {
    console.warn('⚠️ generarInformeSala() está deprecada - redirigiendo a enviarOEditarReporteSala()');
    
    // Redirigir a la función unificada
    enviarOEditarReporteSala(razon, forzarEnvio);
    
    return "Redirigido a función unificada";
}

// Función para cambiar contraseña automáticamente
function cambiarContraseñaAutomatica() {
    const nuevaContraseña = generarContraseñaAleatoria();
    contraseñaActual = nuevaContraseña;
    ultimoCambioContraseña = Date.now();
    
    room.setPassword(nuevaContraseña);
    
    // Solo enviar reporte si tenemos el enlace real
    if (tieneEnlaceReal()) {
        enviarOEditarReporteSala("Cambio automático de contraseña", true);
    }
    
    anunciarGeneral(`🔐 ⚠️ CONTRASEÑA CAMBIADA AUTOMÁTICAMENTE ⚠️ 🔐`, "FF6B6B", "bold");
    anunciarGeneral(`🔑 Nueva contraseña: ${nuevaContraseña}`, "FFD700", "bold");
}

// Función para verificar si debe cambiar la contraseña (cada mes)
function verificarCambioContraseña() {
    const ahora = Date.now();
    const unMes = 30 * 24 * 60 * 60 * 1000; // 30 días en milisegundos
    
    if (!ultimoCambioContraseña || (ahora - ultimoCambioContraseña) >= unMes) {
        cambiarContraseñaAutomatica();
    }
}

// INICIALIZACIÓN
async function inicializar() {
    console.log('🚀 DEBUG: Iniciando configuración de la sala...');
    console.log('📋 DEBUG: Configuración de sala:', {
        roomName: roomName,
        maxPlayers: maxPlayers,
        public: roomPublic,
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        geo: geo,
        password: roomPassword
    });
    
    // Verificar que HBInit esté disponible
    if (typeof HBInit === 'undefined') {
        console.error('❌ CRITICAL: HBInit no está disponible!');
        console.error('❌ Verificando contexto global:', {
            hasWindow: typeof window !== 'undefined',
            hasGlobal: typeof global !== 'undefined',
            isNode: typeof process !== 'undefined'
        });
        return;
    }
    
    console.log('✅ HBInit está disponible');
    console.log('🔧 DEBUG: Tipo de HBInit:', typeof HBInit);
    
    // Validar el token antes de crear la sala
    if (!token || token.length < 10) {
        console.error('❌ CRITICAL: Token inválido o muy corto:', {
            hasToken: !!token,
            tokenLength: token ? token.length : 0,
            tokenStart: token ? token.substring(0, 10) + '...' : 'N/A'
        });
        return;
    }
    
    console.log('✅ Token válido detectado:', {
        length: token.length,
        start: token.substring(0, 10) + '...'
    });
    
    try {
        console.log('🔧 DEBUG: Llamando a HBInit con configuración...');
        
        const configSala = {
            roomName: roomName,
            playerName: "", // Nombre vacío para ocultar el bot
            password: roomPassword,
            maxPlayers: maxPlayers,
            public: roomPublic,
            token: token,
            geo: geo, // Usar coordenadas de Buenos Aires, Argentina
            noPlayer: true // Bot no aparece como jugador
        };
        
        console.log('📄 DEBUG: Configuración final para HBInit:', configSala);
        
        // Crear sala
        room = HBInit(configSala);
        
        console.log('✅ DEBUG: HBInit ejecutado sin errores');
        console.log('🔍 DEBUG: Objeto room creado:', {
            type: typeof room,
            isNull: room === null,
            isUndefined: room === undefined,
            hasOnRoomLink: room && typeof room.onRoomLink !== 'undefined',
            onRoomLinkType: room ? typeof room.onRoomLink : 'N/A'
        });
        
        // Verificar todas las propiedades importantes del room
        if (room) {
            console.log('🔍 DEBUG: Propiedades del objeto room:', {
                onRoomLink: typeof room.onRoomLink,
                onPlayerJoin: typeof room.onPlayerJoin,
                onPlayerLeave: typeof room.onPlayerLeave,
                onPlayerChat: typeof room.onPlayerChat,
                onGameStart: typeof room.onGameStart,
                onGameStop: typeof room.onGameStop,
                sendAnnouncement: typeof room.sendAnnouncement,
                getPlayerList: typeof room.getPlayerList,
                setCustomStadium: typeof room.setCustomStadium
            });
        } else {
            console.error('❌ CRITICAL: room es null o undefined después de HBInit');
            return;
        }
        
        // Verificar que el objeto room tenga las propiedades esperadas
        if (room && typeof room.onRoomLink !== 'undefined') {
            console.log('✅ DEBUG: room.onRoomLink está disponible:', typeof room.onRoomLink);
            
            if (typeof room.onRoomLink === 'function') {
                console.log('✅ DEBUG: room.onRoomLink es una función válida');
            } else {
                console.log('⚠️ DEBUG: room.onRoomLink existe pero no es función:', typeof room.onRoomLink);
            }
        } else {
            console.error('❌ DEBUG: room.onRoomLink NO está disponible');
            console.error('❌ DEBUG: Propiedades disponibles en room:', Object.keys(room || {}));
        }
        
    // CONFIGURAR MANUALMENTE onRoomLink SI NO ESTÁ DISPONIBLE
    if (room && typeof room.onRoomLink === 'undefined') {
        console.log('🔧 DEBUG: Configurando onRoomLink manualmente...');
        
        // Configurar el evento onRoomLink manualmente
        room.onRoomLink = function(link) {
            console.log('\n' + '🎆'.repeat(40));
            console.log('🔗 ¡¡¡ENLACE DE LA SALA CAPTURADO MANUALMENTE!!!');
            console.log('📋 URL RECIBIDA: ' + link);
            console.log('📍 Tipo de URL: ' + typeof link);
            console.log('📐 Longitud de URL: ' + (link ? link.length : 'null'));
            console.log('🕐 Timestamp: ' + new Date().toISOString());
            console.log('🎆'.repeat(40) + '\n');
            
            if (link && typeof link === 'string' && link.length > 0) {
                enlaceRealSala = link;
                console.log('✅ enlaceRealSala actualizado manualmente: ' + enlaceRealSala);
                
                // Deshabilitar los botones de cambio de equipo al inicializar la sala
                try {
                    room.setTeamsLock(true);
                    console.log('🔒 Botones de cambio de equipo deshabilitados exitosamente');
                } catch (error) {
                    console.error('❌ Error al deshabilitar botones de cambio de equipo:', error);
                }
                
                // Enviar reporte inmediato con el enlace
                setTimeout(() => {
                    try {
                        enviarOEditarReporteSala("Enlace capturado manualmente", false);
                        console.log('📤 Reporte enviado con enlace capturado manualmente');
                    } catch (error) {
                        console.error('❌ Error al enviar reporte:', error);
                    }
                }, 2000);
            } else {
                console.error('❌ ERROR: URL inválida recibida en onRoomLink manual');
            }
        };
            
            console.log('✅ DEBUG: onRoomLink configurado manualmente');
        }
        
        // Verificar si ya hay un enlace disponible inmediatamente
        if (room && typeof room.getLink === 'function') {
            try {
                const linkInmediato = room.getLink();
                console.log('🔗 DEBUG: Enlace inmediato disponible:', linkInmediato);
                if (linkInmediato) {
                    enlaceRealSala = linkInmediato;
                    console.log('✅ DEBUG: Enlace guardado inmediatamente');
                    
                    // Si ya tenemos el enlace, enviar reporte inmediatamente
                    setTimeout(() => {
                        try {
                            enviarOEditarReporteSala("Enlace inmediato disponible", false);
                            console.log('📤 Reporte enviado con enlace inmediato');
                        } catch (error) {
                            console.error('❌ Error al enviar reporte inmediato:', error);
                        }
                    }, 3000);
                }
            } catch (error) {
                console.log('⚠️ DEBUG: No se pudo obtener enlace inmediato:', error.message);
            }
        }
        
    } catch (error) {
        console.error('❌ ERROR CRÍTICO al crear sala con HBInit:', error);
        console.error('❌ Nombre del error:', error.name);
        console.error('❌ Mensaje del error:', error.message);
        console.error('❌ Stack trace completo:', error.stack);
        
        // Intentar diagnosticar el error
        if (error.message && error.message.includes('token')) {
            console.error('💡 POSIBLE CAUSA: Problema con el token de autenticación');
            console.error('🔧 SUGERENCIA: Verificar que el token sea válido y esté actualizado');
        }
        
        if (error.message && error.message.includes('geo')) {
            console.error('💡 POSIBLE CAUSA: Problema con la configuración geográfica');
        }
        
        return;
    }
    
    // Bot configurado - sin intentos de invisibilidad
    
    // ==================== INICIALIZAR SISTEMA DE TRACKING PERSISTENTE ====================
    // Inicializar el sistema de tracking persistente después de crear la sala
    if (PlayerTrackingPersistent && !sistemaTrackingPersistente) {
        try {
            console.log('🔄 Inicializando sistema de tracking persistente...');
            sistemaTrackingPersistente = new PlayerTrackingPersistent();
            console.log('✅ Sistema de tracking persistente inicializado correctamente');
            anunciarInfo('🗄️ Sistema de seguimiento persistente activado');
        } catch (error) {
            console.error('❌ Error al inicializar sistema de tracking persistente:', error);
            anunciarError('⚠️ Error al activar el sistema de seguimiento persistente');
            // El sistema continúa con el tracking legacy (JavaScript Maps)
        }
    } else if (!PlayerTrackingPersistent) {
        console.warn('⚠️ PlayerTrackingPersistent no está disponible - usando sistema legacy');
        anunciarAdvertencia('⚠️ Usando sistema de seguimiento legacy (memoria)');
    } else {
        console.log('✅ Sistema de tracking persistente ya estaba inicializado');
    }
    
    // ==================== INICIALIZAR SISTEMA VIP ====================
    // Inicializar el sistema VIP completo después de crear la sala
    if (BotVIPIntegration && !vipBot) {
        try {
            console.log('🔄 Inicializando sistema VIP...');
            vipBot = new BotVIPIntegration(room); // Pasar referencia del room para soporte #ID
            console.log('✅ Sistema VIP inicializado correctamente');
            anunciarInfo('👑 Sistema VIP activado - Comandos: !givevip, !giveultravip, !viphelp (soporte #ID)');
        } catch (error) {
            console.error('❌ Error al inicializar sistema VIP:', error);
            anunciarError('⚠️ Error al activar el sistema VIP - comandos básicos disponibles');
            // El sistema continúa con los comandos básicos de VIP
        }
    } else if (!BotVIPIntegration) {
        console.warn('⚠️ Sistema VIP no está disponible - usando comandos básicos');
        anunciarAdvertencia('⚠️ Sistema VIP básico activo (sin base de datos)');
    } else {
        console.log('✅ Sistema VIP ya estaba inicializado');
    }
    
    
    // Cargar estadísticas globales desde localStorage
    cargarEstadisticasGlobalesCompletas();
    
    // Configurar eventos
    configurarEventos();
    
    // ==================== INICIALIZACIÓN COMPLETA DE SISTEMAS ====================
    // Inicializar todos los sistemas del bot después de un delay para asegurar disponibilidad
    setTimeout(async () => {
        console.log('🔄 Inicializando sistemas del bot después de configuración...');
        
        try {
            // 1. Verificar funciones de Node.js expuestas
            const estadoFunciones = verificarFuncionesNodeDisponibles();
            console.log(`📊 Funciones Node.js disponibles: ${estadoFunciones.disponibles}/${estadoFunciones.total}`);
            
            // Mostrar estado detallado
            Object.entries(estadoFunciones.estado).forEach(([nombre, disponible]) => {
                if (disponible) {
                    console.log(`✅ Función ${nombre} disponible`);
                } else {
                    console.warn(`⚠️ Función ${nombre} NO disponible`);
                }
            });
            
            if (!estadoFunciones.completo) {
                console.warn('⚠️ Algunas funciones Node.js no están disponibles - funcionalidades limitadas');
            }
            
            // 2. Re-cargar estadísticas globales desde BD para asegurar niveles
            try {
                console.log('📥 Re-cargando estadísticas globales desde BD...');
                const estadisticasCargadas = await cargarEstadisticasGlobalesDB();
                if (estadisticasCargadas && estadisticasCargadas.jugadores) {
                    estadisticasGlobales = estadisticasCargadas;
                    const totalJugadores = Object.keys(estadisticasCargadas.jugadores).length;
                    console.log(`✅ Estadísticas re-cargadas: ${totalJugadores} jugadores`);
                    
                    // Verificar que los niveles estén cargados correctamente
                    let jugadoresConNivel = 0;
                    Object.values(estadisticasCargadas.jugadores).forEach(jugador => {
                        if (jugador.nivel && jugador.nivel > 1) {
                            jugadoresConNivel++;
                        }
                    });
                    console.log(`📊 Jugadores con nivel > 1: ${jugadoresConNivel}/${totalJugadores}`);
                    
                    anunciarInfo(`💾 Base de datos cargada: ${totalJugadores} jugadores, ${jugadoresConNivel} con progreso`);
                } else {
                    console.warn('⚠️ No se pudieron re-cargar estadísticas desde BD');
                }
            } catch (error) {
                console.error('❌ Error re-cargando estadísticas globales:', error);
            }
            
            // 3. Inicializar sistema de backup
            if (!sistemaBackup) {
                try {
                    sistemaBackup = new SistemaBackup();
                    console.log('✅ Sistema de backup inicializado');
                } catch (error) {
                    console.error('❌ Error inicializando sistema de backup:', error);
                }
            }
            
            // 4. Iniciar guardado automático
            try {
                iniciarGuardadoAutomatico();
                console.log('✅ Sistema de guardado automático iniciado');
            } catch (error) {
                console.error('❌ Error iniciando guardado automático:', error);
            }
            
            // 5. Iniciar anuncios top aleatorio
            try {
                iniciarTopAleatorioAutomatico();
                console.log('✅ Sistema de anuncios top aleatorio iniciado');
            } catch (error) {
                console.error('❌ Error iniciando anuncios top aleatorio:', error);
            }
            
            // 6. Pre-cargar roles administrativos persistentes si las funciones están disponibles
            if (estadoFunciones.completo) {
                try {
                    console.log('📎 Precargando roles administrativos persistentes...');
                    
                    // Solo intentar si tenemos la función de obtener todos los roles
                    if (typeof window.nodeGetAllAdminRoles === 'function') {
                        const rolesAdmin = await window.nodeGetAllAdminRoles();
                        if (rolesAdmin && rolesAdmin.length > 0) {
                            console.log(`📄 Encontrados ${rolesAdmin.length} roles administrativos guardados`);
                            rolesAdmin.forEach(rol => {
                                console.log(`  - ${rol.identifier}: ${rol.role} (asignado por ${rol.assignedBy})`);
                            });
                        } else {
                            console.log('📄 No hay roles administrativos guardados');
                        }
                    } else {
                        console.log('📄 Función de precarga de roles no disponible');
                    }
                } catch (error) {
                    console.error('❌ Error precargando roles administrativos:', error);
                }
            }
            
            console.log('✅ Inicialización completa de sistemas finalizada');
            anunciarGeneral('🤖 Bot completamente inicializado - Todos los sistemas activos', COLORES.DORADO, 'bold');
            
        } catch (error) {
            console.error('❌ Error en inicialización completa:', error);
        }
    }, 3000); // 3 segundos de delay para asegurar que todo esté listo
    
    // Deshabilitar los botones de cambio de equipo desde el inicio
    try {
        room.setTeamsLock(true);
        console.log('🔒 Botones de cambio de equipo deshabilitados exitosamente');
    } catch (error) {
        console.error('❌ Error al deshabilitar botones de cambio de equipo:', error);
    }

    // Restaurar baneos persistentes
    restaurarBaneos();
    
    // Establecer mapa inicial usando la variable mapaActual
    console.log('🗺️ DEBUG: Configurando mapa inicial INMEDIATAMENTE...');
    console.log(`🔍 DEBUG: mapaActual definido: ${mapaActual}`);
    
    // Intento inmediato usando la variable mapaActual
    if (cambiarMapa(mapaActual)) {
        console.log(`✅ DEBUG: Mapa inicial configurado correctamente (inmediato): ${mapaActual}`);
        mapaRealmenteAplicado = true;
    } else {
        console.log('⚠️ DEBUG: Fallo en intento inmediato, programando reintento...');
        mapaRealmenteAplicado = false;
    }
    
    // Segundo intento después de 100ms
    setTimeout(() => {
        console.log('🗺️ DEBUG: Configurando mapa inicial (Intento con delay 100ms)...');
        console.log(`🔍 DEBUG: Intentando configurar: ${mapaActual}`);
    
        if (cambiarMapa(mapaActual)) {
            console.log(`✅ DEBUG: Mapa configurado correctamente en intento 100ms: ${mapaActual}`);
            console.log(`🔍 DEBUG: Variable mapaActual confirmada: ${mapaActual}`);
            mapaRealmenteAplicado = true;
        } else {
            console.error(`❌ DEBUG: Error al configurar mapa inicial en intento 100ms: ${mapaActual}`);
            mapaRealmenteAplicado = false;
        }
    }, 100);
    
    // Tercer intento después de 500ms
    setTimeout(() => {
        console.log('🗺️ DEBUG: Configurando mapa inicial (Intento 500ms)...');
        console.log(`🔍 DEBUG: Variable mapaActual antes del cambio: ${mapaActual}`);
        console.log(`🔍 DEBUG: Mapa objetivo: ${mapaActual}`);
    
        // Verificar si el mapa actual no coincide con el objetivo o si falló el cambio
        const mapaConfigurado = mapaActual; // Guardar referencia
        if (!cambiarMapa(mapaActual)) {
            console.log(`🔄 DEBUG: Forzando cambio de mapa a: ${mapaActual}`);
    
            try {
                // Forzar el cambio usando la variable mapaActual
                const mapa = mapas[mapaActual];
                if (mapa && room && typeof room.setCustomStadium === 'function') {
                    room.setCustomStadium(mapa.hbs);
                    
                    // Configurar límites según el mapa
                    if (mapaActual === "biggerx3") {
                        room.setTimeLimit(3); // 3 minutos
                        room.setScoreLimit(5); // Máximo 5 goles
                    } else if (mapaActual === "biggerx5") {
                        room.setTimeLimit(5); // 5 minutos
                        room.setScoreLimit(4); // Máximo 4 goles
                    } else if (mapaActual === "biggerx7") {
                        room.setTimeLimit(5); // 5 minutos
                        room.setScoreLimit(5); // Máximo 5 goles
                    } else {
                        room.setTimeLimit(5); // 5 minutos por defecto
                        room.setScoreLimit(0); // Sin límite por defecto
                    }
    
                    console.log(`✅ DEBUG: Mapa forzado exitosamente a: ${mapaActual}`);
                    anunciarExito(`🗺️ Mapa establecido: ${mapa.nombre}`);
                    mapaRealmenteAplicado = true;
                } else {
                    console.error(`❌ DEBUG: No se pudo forzar el cambio de mapa a: ${mapaActual}`);
                    console.error(`❌ DEBUG: Mapa disponible: ${!!mapas[mapaActual]}`);
                    console.error(`❌ DEBUG: Room disponible: ${!!room}`);
                    console.error(`❌ DEBUG: setCustomStadium disponible: ${!!(room && room.setCustomStadium)}`);
                    mapaRealmenteAplicado = false;
                }
            } catch (error) {
                console.error(`❌ DEBUG: Error al forzar cambio de mapa a ${mapaActual}:`, error);
            }
        } else {
            console.log(`✅ DEBUG: Mapa ya está configurado correctamente: ${mapaActual}`);
        }
    
        setTimeout(() => {
            console.log('🔍 DEBUG: Verificación final del mapa después de intentos...');
            console.log(`🗺️ DEBUG: mapaActual final: ${mapaActual}`);
            console.log(`🗺️ DEBUG: Mapa objetivo era: ${mapaConfigurado}`);
    
            // Verificación final: si no coincide con el objetivo, último intento
            if (mapaActual !== mapaConfigurado) {
                console.error(`❌ DEBUG: CRÍTICO - El mapa no coincide con el objetivo`);
                console.error(`❌ DEBUG: Esperado: ${mapaConfigurado}, Actual: ${mapaActual}`);
                console.error(`❌ DEBUG: Último intento de cambio forzado...`);
    
                try {
                    const mapa = mapas[mapaConfigurado];
                    if (mapa) {
                        room.setCustomStadium(mapa.hbs);
                        mapaActual = mapaConfigurado; // Actualizar la variable
                        
                        // Configurar límites según el mapa
                        if (mapaConfigurado === "biggerx3") {
                            room.setTimeLimit(3);
                            room.setScoreLimit(5);
                        } else if (mapaConfigurado === "biggerx5") {
                            room.setTimeLimit(5);
                            room.setScoreLimit(4);
                        } else if (mapaConfigurado === "biggerx7") {
                            room.setTimeLimit(5);
                            room.setScoreLimit(5);
                        } else {
                            room.setTimeLimit(5);
                            room.setScoreLimit(0);
                        }
                        
                        console.log(`🔧 DEBUG: Cambio forzado en última tentativa exitoso: ${mapaConfigurado}`);
                        anunciarExito(`🗺️ Mapa final establecido: ${mapa.nombre}`);
                        mapaRealmenteAplicado = true;
                    }
                } catch (finalError) {
                    console.error(`❌ DEBUG: FALLO CRÍTICO - No se pudo establecer el mapa ${mapaConfigurado}:`, finalError);
                    mapaRealmenteAplicado = false;
                }
            } else {
                console.log(`✅ DEBUG: Mapa inicial confirmado correctamente: ${mapaActual}`);
                mapaRealmenteAplicado = true;
            }
        }, 2000);
    }, 500);
    
    // Configuración inicial de la sala
    room.setKickRateLimit(2, 1, 0); // Límite de kicks (configurado al inicio)
    
    // SISTEMA OPTIMIZADO: Intervalos dinámicos iniciados con valores optimizados
    intervalAFK = setInterval(verificarInactividad, intervaloActualAFK); // Dinámico: 10-30s según jugadores
    
    // Intervalo de mapa dinámico optimizado para VPS
    setInterval(detectarCambioMapa, intervaloActualMapa); // Dinámico: 20-60s según estado
    
    // SISTEMA VIP: Intervalo de limpieza automática de VIPs expirados
    if (vipBot) {
        console.log('👑 Configurando limpieza automática de VIPs expirados cada hora');
        setInterval(async () => {
            try {
                const cleanupResult = await vipBot.vipSystem.cleanupExpiredVIPs();
                if (cleanupResult.expiredCount > 0) {
                    console.log(`🧩 Limpieza VIP: ${cleanupResult.expiredCount} VIPs expirados removidos automáticamente`);
                    anunciarInfo(`🧩 Limpieza automática: ${cleanupResult.expiredCount} VIPs expirados removidos`);
                }
            } catch (error) {
                console.error('❌ Error en limpieza automática de VIPs:', error);
            }
        }, 60 * 60 * 1000); // Cada hora
    }
    
    // OPTIMIZACIÓN CRÍTICA: Eliminado intervalo innecesario de nombres
    // actualizarTodosLosNombres ahora se ejecuta solo cuando es necesario (al conectarse jugadores)
    
    // Iniciar anuncios de Discord
    iniciarAnunciosDiscord();
    
    // Iniciar verificación de admin de sala (seguridad)
    iniciarVerificacionAdminSala();
    
    // Sistema de contraseñas automáticas DESACTIVADO para mantener sala pública
    // Se eliminó el cambio automático de contraseñas para permitir acceso libre
    
    // Mensaje de bienvenida
    anunciarGeneral("🔵⚡ ¡BIENVENIDOS A LA LIGA NACIONAL DE BIGGER LNB! ⚡🔵", AZUL_LNB, "bold");
    anunciarInfo("🎮 Usa !ayuda para ver todos los comandos disponibles");
    anunciarInfo("🏆 Modo oficial disponible para administradores");
    anunciarInfo("🤖 Auto balance, auto start y auto stop ACTIVADOS");
    
}

// ==================== FUNCIÓN PARA RESTAURAR BANEOS PERSISTENTES ====================
function restaurarBaneos() {
    console.log('🔄 Restaurando baneos persistentes desde la base de datos...');
    
    // Usar la función de DB para obtener todos los baneos activos
    if (typeof nodeObtenerBaneosActivos === 'function') {
        nodeObtenerBaneosActivos()
            .then(baneosActivos => {
                if (baneosActivos && baneosActivos.length > 0) {
                    console.log(`[BAN RESTORE] 🛡️ Se encontraron ${baneosActivos.length} baneos activos para restaurar.`);
                    anunciarAdvertencia(`🛡️ Restaurando ${baneosActivos.length} baneos persistentes...`);

                    let restaurados = 0;
                    baneosActivos.forEach(baneo => {
                        try {
                            // Usamos el authId (UID) para banear, que es el método más fiable
                            if (baneo.auth_id) {
                                room.kickPlayer(baneo.auth_id, `Baneo restaurado: ${baneo.razon}`, true);
                                restaurados++;
                                console.log(`[BAN RESTORE] ✅ Restaurado: ${baneo.nombre} (Auth: ${baneo.auth_id})`);
                            } else {
                                console.warn(`[BAN RESTORE] ⚠️ No se pudo restaurar baneo para ${baneo.nombre} por falta de auth_id.`);
                            }
                        } catch (error) {
                            console.error(`[BAN RESTORE] ❌ Error restaurando baneo para ${baneo.nombre}:`, error.message);
                        }
                    });

                    console.log(`[BAN RESTORE] ✅ Proceso finalizado. ${restaurados} de ${baneosActivos.length} baneos fueron restaurados.`);
                    anunciarExito(`✅ ${restaurados} baneos persistentes han sido restaurados.`);
                } else {
                    console.log('[BAN RESTORE] ✅ No hay baneos activos para restaurar.');
                }
            })
            .catch(error => {
                console.error('[BAN RESTORE] ❌ Error crítico al obtener baneos activos de la DB:', error);
                anunciarError('❌ Error al cargar la lista de baneos desde la base de datos.');
            });
    } else {
        console.warn('[BAN RESTORE] ⚠️ La función nodeObtenerBaneosActivos no está disponible. No se pueden restaurar baneos.');
        anunciarAdvertencia('⚠️ No se pudo acceder a la función para restaurar baneos.');
    }
}

// FUNCIÓN AUXILIAR PARA INICIALIZAR SISTEMAS
async function inicializarSistemas() {
    // Cargar estadísticas globales
    cargarEstadisticasGlobalesCompletas();
    
    // Inicializar intervalos y timers
    if (intervalAFK) {
        clearInterval(intervalAFK);
    }
    intervalAFK = setInterval(verificarInactividad, intervaloActualAFK);
    
    // Iniciar detección de cambio de mapa con intervalo optimizado
    setInterval(detectarCambioMapa, intervaloActualMapa);
    
    // OPTIMIZACIÓN CRÍTICA: Eliminado intervalo innecesario de nombres
    // actualizarTodosLosNombres ahora se ejecuta solo cuando es necesario
    
    // Iniciar anuncios de Discord
    iniciarAnunciosDiscord();

    // Iniciar anuncios automáticos de Top Aleatorio cada 20 minutos
    iniciarTopAleatorioAutomatico();
    
    // Iniciar sistema de guardado automático optimizado
    iniciarGuardadoAutomatico();
    
    // ==================== INICIALIZAR SISTEMA DE BANEOS OFFLINE ====================
    // Inicializar sistema de baneos offline para banear jugadores desconectados
    if (offlineBanSystem && room) {
        try {
            console.log('🔄 Inicializando sistema de baneos offline...');
            await offlineBanSystem.initialize(room);
            console.log('✅ Sistema de baneos offline inicializado correctamente');
            anunciarInfo('🚫 Sistema de baneos offline activado - Comandos: !banoffline, !findplayer');
        } catch (error) {
            console.error('❌ Error al inicializar sistema de baneos offline:', error);
            anunciarError('⚠️ Error al activar el sistema de baneos offline');
        }
    } else {
        console.warn('⚠️ Sistema de baneos offline no está disponible');
    }
    
    // SISTEMA OPTIMIZADO DE LIMPIEZA - Menos frecuente para ahorrar CPU
    setInterval(limpiarDatosExpirados, 180000); // OPTIMIZADO: Cada 3 minutos (era 1 minuto)
    setInterval(limpiarDatosSpam, 300000); // OPTIMIZADO: Cada 5 minutos (era 2 minutos)
    
    console.log('✅ Sistemas inicializados correctamente');
}

// FUNCIÓN PRINCIPAL DE INICIALIZACIÓN DEL BOT
async function inicializarBot() {
    console.log('🤖 Iniciando BOT LNB...');
    
    // PREVENIR DOBLE INICIALIZACIÓN - Verificar si ya existe room
    if (typeof room !== 'undefined' && room !== null) {
        console.log('⚠️ ADVERTENCIA: Room ya existe, evitando doble inicialización');
        console.log('✅ Sala ya creada exitosamente (usando instancia existente)');
        return true;
    }
    
    // Verificar que HBInit esté disponible
    if (typeof HBInit === 'undefined') {
        console.error('❌ HBInit no está disponible');
        return false;
    }
    
    try {
        // Crear la sala
        room = HBInit({
            roomName: roomName,
            playerName: "", // Nombre vacío para ocultar el bot
            maxPlayers: maxPlayers,
            public: roomPublic,
            password: roomPassword,
            token: token,
            geo: geo,
            noPlayer: true // Bot no aparece como jugador (INVISIBLE)
        });
        
        console.log('✅ Sala creada exitosamente');
        
    // Configurar eventos
    configurarEventos();
    
    // Inicializar sistemas
    await inicializarSistemas();
    
    // Deshabilitar los botones de cambio de equipo desde el inicio
    try {
        room.setTeamsLock(true);
        console.log('🔒 Botones de cambio de equipo deshabilitados exitosamente');
    } catch (error) {
        console.error('❌ Error al deshabilitar botones de cambio de equipo:', error);
    }
        
        // Establecer mapa inicial con delay para asegurar que la sala esté completamente lista
        setTimeout(() => {
            console.log('🗺️ Configurando mapa inicial:', mapaActual);
            if (cambiarMapa(mapaActual)) {
                console.log('✅ Mapa configurado exitosamente:', mapas[mapaActual].nombre);
            } else {
                console.error('❌ Error al configurar mapa inicial');
                // Intentar con biggerx1 como respaldo
                if (cambiarMapa('biggerx1')) {
                    console.log('✅ Mapa de respaldo configurado: Bigger x1');
                }
            }
        }, 1000);
        
        console.log('🎮 BOT LNB iniciado completamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error al inicializar el bot:', error);
        return false;
    }
}

// FUNCIÓN PARA LIMPIAR TODAS LAS CONEXIONES AL INICIALIZAR
function limpiarTodasLasConexionesAlInicializar() {
    console.log('🧹 Limpiando todas las conexiones activas al inicializar el bot...');
    
    return new Promise((resolve, reject) => {
        try {
            // Usar la función de Node.js para limpiar todas las conexiones
            if (typeof nodeLimpiarTodasLasConexiones === 'function') {
                nodeLimpiarTodasLasConexiones().then(resultado => {
                    if (resultado && resultado.success) {
                        console.log(`✅ ${resultado.conexionesDesactivadas || 0} conexiones desactivadas al inicializar`);
                    } else {
                        console.warn('⚠️ No se pudieron limpiar las conexiones o no había conexiones activas');
                    }
                    
                    // También limpiar los mapas de memoria
                    conexionesPorIP.clear();
                    jugadoresPorIP.clear();
                    ipsBloqueadas.clear();
                    console.log('🧹 Mapas de memoria de conexiones IP limpiados');
                    
                    resolve();
                }).catch(error => {
                    console.error('❌ Error limpiando conexiones al inicializar:', error);
                    
                    // También limpiar los mapas de memoria aunque falle la BD
                    conexionesPorIP.clear();
                    jugadoresPorIP.clear();
                    ipsBloqueadas.clear();
                    console.log('🧹 Mapas de memoria de conexiones IP limpiados');
                    
                    resolve(); // Resolver aunque falle para continuar con la inicialización
                });
            } else if (typeof nodeLimpiarConexionesInactivas === 'function') {
                // Función alternativa si no existe la función específica
                try {
                    nodeLimpiarConexionesInactivas();
                    console.log('✅ Limpieza de conexiones inactivas ejecutada al inicializar');
                } catch (error) {
                    console.error('❌ Error en nodeLimpiarConexionesInactivas:', error);
                }
                
                // También limpiar los mapas de memoria
                conexionesPorIP.clear();
                jugadoresPorIP.clear();
                ipsBloqueadas.clear();
                console.log('🧹 Mapas de memoria de conexiones IP limpiados');
                
                resolve();
            } else {
                console.warn('⚠️ Funciones de limpieza de conexiones no disponibles');
                
                // Solo limpiar los mapas de memoria
                conexionesPorIP.clear();
                jugadoresPorIP.clear();
                ipsBloqueadas.clear();
                console.log('🧹 Mapas de memoria de conexiones IP limpiados');
                
                resolve();
            }
        } catch (error) {
            console.error('❌ Error limpiando conexiones al inicializar:', error);
            
            // También limpiar los mapas de memoria aunque falle
            conexionesPorIP.clear();
            jugadoresPorIP.clear();
            ipsBloqueadas.clear();
            console.log('🧹 Mapas de memoria de conexiones IP limpiados');
            
            resolve(); // Resolver aunque falle para continuar con la inicialización
        }
    });
}

// ==================== FUNCIONES AUXILIARES PARA BANEOS OFFLINE ====================

/**
 * Procesar comando de baneo offline
 */
async function procesarBaneoOffline(jugadorAdmin, args) {
    try {
        if (!offlineBanSystem) {
            anunciarError("❌ Sistema de baneos offline no disponible", jugadorAdmin);
            return;
        }

        const termBusqueda = args[1];
        const duracionMinutos = parseInt(args[2]) || 0;
        const razon = args.slice(3).join(' ') || 'Sin razón especificada';

        anunciarInfo(`🔍 Buscando jugador: "${termBusqueda}"...`, jugadorAdmin);

        // Buscar jugador en historial
        const jugadorEncontrado = await offlineBanSystem.findPlayerForOfflineBan(termBusqueda);

        if (!jugadorEncontrado) {
            anunciarError(`❌ No se encontró jugador con: "${termBusqueda}"`, jugadorAdmin);
            anunciarError("💡 Intenta con nombre completo o auth_id", jugadorAdmin);
            return;
        }

        // Mostrar información del jugador encontrado
        const tiempoTexto = duracionMinutos > 0 ? `${duracionMinutos} minutos` : 'permanente';
        anunciarInfo(`✅ Jugador encontrado: ${jugadorEncontrado.nombre}`, jugadorAdmin);
        anunciarInfo(`📋 Auth ID: ${jugadorEncontrado.authId}`, jugadorAdmin);
        anunciarInfo(`⏰ Duración: ${tiempoTexto}`, jugadorAdmin);
        anunciarInfo(`📝 Razón: ${razon}`, jugadorAdmin);

        // Si hay alternativas, mostrarlas
        if (jugadorEncontrado.alternativas && jugadorEncontrado.alternativas.length > 0) {
            anunciarAdvertencia(`⚠️ Se encontraron ${jugadorEncontrado.alternativas.length} jugadores similares adicionales`, jugadorAdmin);
            jugadorEncontrado.alternativas.slice(0, 3).forEach((alt, index) => {
                anunciarInfo(`   ${index + 2}. ${alt.nombre} (${alt.authId.substring(0, 8)}...)`, jugadorAdmin);
            });
        }

        // Crear el baneo offline
        const baneoCreado = await offlineBanSystem.createOfflineBan(
            jugadorEncontrado.authId,
            jugadorEncontrado.nombre,
            razon,
            jugadorAdmin.name,
            duracionMinutos
        );

        // Confirmar éxito
        anunciarExito(`✅ Baneo offline creado exitosamente (ID: ${baneoCreado.id})`, jugadorAdmin);
        anunciarExito(`🚫 ${jugadorEncontrado.nombre} será baneado automáticamente al conectarse`, jugadorAdmin);

        // Anunciar a todos los admins
        const mensaje = `🚫 BANEO OFFLINE: ${jugadorAdmin.name} baneó a ${jugadorEncontrado.nombre} (${tiempoTexto}). Razón: ${razon}`;
        room.sendAnnouncement(mensaje, null, parseInt("FF6347", 16), "bold", 1);

    } catch (error) {
        console.error('❌ Error procesando baneo offline:', error);
        anunciarError(`❌ Error: ${error.message}`, jugadorAdmin);
    }
}

/**
 * Procesar búsqueda de jugador para información
 */
async function procesarBusquedaJugador(jugadorAdmin, termBusqueda) {
    try {
        if (!offlineBanSystem) {
            anunciarError("❌ Sistema de baneos offline no disponible", jugadorAdmin);
            return;
        }

        anunciarInfo(`🔍 Buscando: "${termBusqueda}"...`, jugadorAdmin);

        const infoJugador = await offlineBanSystem.getPlayerInfo(termBusqueda);

        if (!infoJugador) {
            anunciarError(`❌ No se encontró jugador con: "${termBusqueda}"`, jugadorAdmin);
            return;
        }

        // Mostrar información detallada
        anunciarInfo(`📋 === INFORMACIÓN DEL JUGADOR ===`, jugadorAdmin);
        anunciarInfo(`👤 Nombre: ${infoJugador.nombre}`, jugadorAdmin);
        anunciarInfo(`🆔 Auth ID: ${infoJugador.authId}`, jugadorAdmin);
        anunciarInfo(`⏰ Última conexión: ${infoJugador.ultimaConexion ? new Date(infoJugador.ultimaConexion).toLocaleString('es-AR') : 'Desconocida'}`, jugadorAdmin);
        anunciarInfo(`🔍 Método de búsqueda: ${infoJugador.metodo === 'auth_id_directo' ? 'Auth ID directo' : 'Búsqueda por nombre'}`, jugadorAdmin);

        // Estado de baneo
        if (infoJugador.estaBaneado) {
            const ban = infoJugador.infoBaneo;
            const tiempoTexto = ban.duracion > 0 ? `${ban.duracion} minutos` : 'permanente';
            anunciarAdvertencia(`🚫 BANEADO: ${tiempoTexto}`, jugadorAdmin);
            anunciarAdvertencia(`📝 Razón: ${ban.razon}`, jugadorAdmin);
            anunciarAdvertencia(`👨‍💼 Admin: ${ban.admin}`, jugadorAdmin);
            anunciarAdvertencia(`📅 Fecha: ${new Date(ban.fecha).toLocaleString('es-AR')}`, jugadorAdmin);
        } else {
            anunciarExito(`✅ No está baneado`, jugadorAdmin);
        }

        // Mostrar alternativas si las hay
        if (infoJugador.alternativas && infoJugador.alternativas.length > 0) {
            anunciarInfo(`📋 Otros jugadores similares:`, jugadorAdmin);
            infoJugador.alternativas.slice(0, 4).forEach((alt, index) => {
                anunciarInfo(`   ${index + 2}. ${alt.nombre} (${alt.authId.substring(0, 8)}...)`, jugadorAdmin);
            });
        }

    } catch (error) {
        console.error('❌ Error buscando jugador:', error);
        anunciarError(`❌ Error: ${error.message}`, jugadorAdmin);
    }
}

/**
 * Procesar verificación de estado de baneo
 */
async function procesarEstadoBaneo(jugadorAdmin, termBusqueda) {
    try {
        if (!offlineBanSystem) {
            anunciarError("❌ Sistema de baneos offline no disponible", jugadorAdmin);
            return;
        }

        // Buscar jugador
        const jugadorEncontrado = await offlineBanSystem.findPlayerForOfflineBan(termBusqueda);

        if (!jugadorEncontrado) {
            anunciarError(`❌ No se encontró jugador con: "${termBusqueda}"`, jugadorAdmin);
            return;
        }

        // Verificar estado de baneo usando función de base de datos
        let baneoActivo = null;
        if (typeof nodeEstaBaneadoPromise === 'function') {
            baneoActivo = await nodeEstaBaneadoPromise(jugadorEncontrado.authId);
        }

        // Mostrar resultado
        anunciarInfo(`📋 === ESTADO DE BANEO ===`, jugadorAdmin);
        anunciarInfo(`👤 Jugador: ${jugadorEncontrado.nombre}`, jugadorAdmin);
        anunciarInfo(`🆔 Auth ID: ${jugadorEncontrado.authId.substring(0, 16)}...`, jugadorAdmin);

        if (baneoActivo) {
            const tiempoTexto = baneoActivo.duracion > 0 ? `${baneoActivo.duracion} minutos` : 'permanente';
            anunciarError(`🚫 BANEADO (${tiempoTexto})`, jugadorAdmin);
            anunciarError(`📝 Razón: ${baneoActivo.razon}`, jugadorAdmin);
            anunciarError(`👨‍💼 Admin: ${baneoActivo.admin}`, jugadorAdmin);
            anunciarError(`📅 Fecha: ${new Date(baneoActivo.fecha).toLocaleString('es-AR')}`, jugadorAdmin);
            
            // Verificar si está en cache del sistema offline
            const stats = offlineBanSystem.getSystemStats();
            anunciarInfo(`🗄️ En cache de baneos offline: ${stats.baneosEnCache > 0 ? 'SÍ' : 'NO'}`, jugadorAdmin);
        } else {
            anunciarExito(`✅ NO ESTÁ BANEADO`, jugadorAdmin);
        }

    } catch (error) {
        console.error('❌ Error verificando estado de baneo:', error);
        anunciarError(`❌ Error: ${error.message}`, jugadorAdmin);
    }
}

// INICIALIZACIÓN AUTOMÁTICA
// Solo ejecutar si estamos en el contexto correcto (navegador con HBInit disponible)
if (typeof window !== 'undefined' && typeof HBInit !== 'undefined') {
    // Estamos en el navegador con HBInit disponible
    console.log('🌐 Detectado contexto de navegador con HBInit');
    
    // Usar setTimeout para evitar top-level await en page.evaluate()
    setTimeout(function inicializarBotCompleto() {
        try {
            console.log('🧹 Iniciando limpieza de conexiones...');
            limpiarTodasLasConexionesAlInicializar().then(() => {
                console.log('✅ Limpieza inicial completada, iniciando bot...');
                inicializarBot();
            }).catch(error => {
                console.error('❌ Error en limpieza inicial, pero continuando con inicialización:', error);
                inicializarBot();
            });
        } catch (error) {
            console.error('❌ Error en limpieza inicial, pero continuando con inicialización:', error);
            inicializarBot();
        }
    }, 100);
} else {
    console.log('⚠️ Esperando contexto de HaxBall...');
    // Exportar la función para uso externo
    if (typeof window !== 'undefined') {
        window.inicializarBot = inicializarBot;
        window.limpiarTodasLasConexionesAlInicializar = limpiarTodasLasConexionesAlInicializar;
    }
}
