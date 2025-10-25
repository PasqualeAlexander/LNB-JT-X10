/**
 * NUEVO SISTEMA DE COMANDOS
 * Sistema usando librariesMap.commands para el comando unban
 */

// Función para verificar si un jugador puede usar el comando unban
// Permite a OWNER, ADMIN y ADMIN_BASICO usar el comando
function checkUnbanPermission(room, playerId) {
    try {
        const player = room.getPlayer(playerId);
        if (!player) {
            console.warn(`⚠️ UNBAN: Jugador con ID ${playerId} no encontrado`);
            return false;
        }

        const playerName = player.name.toLowerCase();
        
        // Lista de usuarios autorizados para usar unban
        const authorizedUsers = {
            // Owners
            'owner': true,
            'tu_nombre_owner': true,
            
            // Admins Full
            'admin1': true,
            'admin2': true,
            'admin_principal': true,
            'yuyb2027': true, // Admin Full agregado
            
            // Admins Básicos
            'admin_basico1': true,
            'adminbasico1': true,
            'staff1': true
        };
        
        const isAuthorized = authorizedUsers[playerName] || false;
        
        if (isAuthorized) {
            console.log(`✅ UNBAN: Jugador ${player.name} (ID: ${playerId}) autorizado para usar unban`);
            return true;
        } else {
            console.log(`❌ UNBAN: Jugador ${player.name} (ID: ${playerId}) NO autorizado para usar unban`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ UNBAN: Error verificando permisos para jugador ID ${playerId}:`, error);
        return false;
    }
}

// Función para verificar permisos de admin dinámicamente
// Permite a cualquier admin (básico, full, owner) usar comandos
function checkAdminPermission(room, playerId) {
    try {
        const player = room.getPlayer(playerId);
        if (!player) {
            console.warn(`⚠️ ADMIN_CHECK: Jugador con ID ${playerId} no encontrado`);
            return false;
        }

        const playerName = player.name.toLowerCase();
        
        // 1. MÉTODO 1: Lista de usuarios específicos conocidos (fallback)
        const knownAdmins = {
            // Owners
            'owner': true,
            'tu_nombre_owner': true,
            
            // Admins Full
            'admin1': true,
            'admin2': true,
            'admin_principal': true,
            'yuyb2027': true,
            
            // Admins Básicos
            'admin_basico1': true,
            'adminbasico1': true,
            'staff1': true
        };
        
        // Verificar si está en la lista conocida
        if (knownAdmins[playerName]) {
            console.log(`✅ ADMIN_CHECK: ${player.name} autorizado por lista conocida`);
            return true;
        }
        
        // 2. MÉTODO 2: Verificar si tiene permisos de admin en la sala
        if (player.admin) {
            console.log(`✅ ADMIN_CHECK: ${player.name} autorizado por permisos de sala`);
            return true;
        }
        
        // 3. MÉTODO 3: Verificar en ChatSystem si está disponible
        try {
            const ChatSystem = require('./chat_system');
            const chatSystem = new ChatSystem();
            
            // Verificar si puede usar comandos de admin o mod
            Promise.resolve(chatSystem.canUseAdminCommands(player.name, player.auth)).then(canUseAdmin => {
                if (canUseAdmin) {
                    console.log(`✅ ADMIN_CHECK: ${player.name} autorizado por ChatSystem (admin)`);
                    return true;
                }
            }).catch(() => {});
            
            Promise.resolve(chatSystem.canUseModCommands(player.name, player.auth)).then(canUseMod => {
                if (canUseMod) {
                    console.log(`✅ ADMIN_CHECK: ${player.name} autorizado por ChatSystem (mod)`);
                    return true;
                }
            }).catch(() => {});
            
        } catch (error) {
            console.log('📝 ADMIN_CHECK: ChatSystem no disponible, usando otros métodos');
        }
        
        // 4. MÉTODO 4: Verificar patrones de nombres de admin
        const adminPatterns = [
            /admin/i,
            /owner/i,
            /staff/i,
            /mod/i,
            /moderador/i
        ];
        
        for (const pattern of adminPatterns) {
            if (pattern.test(player.name)) {
                console.log(`✅ ADMIN_CHECK: ${player.name} autorizado por patrón de nombre`);
                return true;
            }
        }
        
        console.log(`❌ ADMIN_CHECK: ${player.name} NO autorizado`);
        return false;
        
    } catch (error) {
        console.error(`❌ ADMIN_CHECK: Error verificando permisos para jugador ID ${playerId}:`, error);
        return false;
    }
}

function initializeCommandSystem(room, permissionCtx, permissionsIds) {
    // Verificar que el sistema de comandos esté disponible
    if (!room.librariesMap || !room.librariesMap.commands) {
        console.error("❌ COMMANDS: Sistema de comandos no disponible en room.librariesMap");
        return false;
    }

    console.log("✅ COMMANDS: Inicializando nuevo sistema de comandos...");

    // Definir constantes para tipos de variables
    const VariableType = {
        Integer: 'integer',
        String: 'string',
        Boolean: 'boolean',
        Float: 'float'
    };

    try {
        // Comando UNBAN
        room.librariesMap.commands.add({
            name: "unban",
            parameters: [{
                name: "authId",
                type: VariableType.String,
            }],
            minParameterCount: 1,
            helpText: "Unbans a user by their Auth ID. Usage: !unban <AuthID>",
            callback: async ({ authId }, byId) => { // Made callback async
                if (!checkUnbanPermission(room, byId)) {
                    room.librariesMap.commands?.announcePermissionDenied(byId);
                    return;
                }

                const byObj = room.getPlayer(byId);
                const adminName = byObj ? byObj.name : 'Desconocido';

                room.librariesMap.commands.announceAction(`Intentando desbanear a: ${authId}...`, byId);
                console.log(`🔧 UNBAN: Admin ${adminName} (ID: ${byId}) intenta desbanear a: "${authId}"`);

                try {
                    const dbFunctions = require('./database/db_functions');
                    const result = await dbFunctions.desbanearJugadorNuevo(authId);
                    
                    if (result && result.cambios > 0) {
                        room.librariesMap.commands.announceAction(`✅ Jugador con Auth ID "${authId}" fue desbaneado por ${adminName}.`, byId);
                        console.log(`✅ UNBAN: Jugador con Auth ID "${authId}" fue desbaneado por ${adminName}.`);
                    } else {
                        room.librariesMap.commands.announceAction(`❌ No se encontró un baneo activo para el Auth ID: "${authId}".`, byId);
                        console.warn(`⚠️ UNBAN: No se encontró un baneo activo para el Auth ID: "${authId}".`);
                    }
                } catch (e) {
                    room.librariesMap.commands.announceAction(`❌ Error al intentar desbanear a "${authId}": ${e.message}`, byId);
                    console.error(`❌ UNBAN: Error al desbanear a "${authId}":`, e);
                }
            }
        });

        console.log("✅ COMMANDS: Comando 'unban' registrado exitosamente");

        // Comando BANS
        room.librariesMap.commands.add({
            name: "bans",
            parameters: [],
            minParameterCount: 0,
            helpText: "Lists all currently banned players.",
            callback: async (params, byId) => {
                console.log(`🔧 BANS: Admin ID ${byId} solicita ver lista de baneados`);
                
                // Verificar permisos usando el nuevo sistema dinámico
                if (!checkAdminPermission(room, byId)) {
                    // Enviar mensaje de permisos denegados
                    const player = room.getPlayer(byId);
                    const playerName = player ? player.name : 'Desconocido';
                    const mensaje = `❌ ${playerName}, no tienes permisos para usar el comando !bans. Solo admins pueden usarlo.`;
                    room.sendAnnouncement(mensaje, byId, 0xFF6347, "bold", 0);
                    console.log(`🔒 BANS: Acceso denegado para ${playerName} (ID: ${byId})`);
                    return;
                }

                const byObj = room.getPlayer(byId);
                if (!byObj) {
                    console.error(`❌ BANS: Admin con ID ${byId} no encontrado`);
                    return;
                }

                console.log(`🔧 BANS: Obteniendo lista de baneos para admin ${byObj.name}`);

                try {
                    // Obtener baneos activos desde la base de datos
                    const { executeQuery } = require('./config/database');
                    const dbFunctions = require('./database/db_functions');
                    
                    // Obtener baneos desde la tabla jugadores (formato original)
                    const baneosJugadores = await executeQuery(
                        `SELECT id, nombre, fecha_ban, razon_ban, admin_ban 
                         FROM jugadores 
                         WHERE baneado = 1 
                         ORDER BY fecha_ban DESC`
                    );
                    
                    // También obtener baneos de la nueva tabla baneos si existe
                    let baneosNuevos = [];
                    try {
                        baneosNuevos = await dbFunctions.obtenerBaneosActivos();
                    } catch (error) {
                        console.log('📝 BANS: Tabla baneos no disponible, usando solo tabla jugadores');
                    }
                    
                    // Combinar baneos
                    const todosLosBaneos = [];
                    
                    // Agregar baneos de la tabla jugadores
                    baneosJugadores.forEach(ban => {
                        const fechaBan = ban.fecha_ban ? new Date(ban.fecha_ban) : null;
                        const tiempoTranscurrido = fechaBan ? Math.floor((new Date() - fechaBan) / (1000 * 60 * 60 * 24)) : 0;
                        
                        todosLosBaneos.push({
                            id: ban.id,
                            nombre: ban.nombre,
                            razon: ban.razon_ban || 'Sin razón especificada',
                            admin: ban.admin_ban || 'Sistema',
                            fecha: fechaBan,
                            diasBaneado: tiempoTranscurrido,
                            tipo: 'Permanente',
                            fuente: 'tabla_jugadores'
                        });
                    });
                    
                    // Agregar baneos de la nueva tabla
                    baneosNuevos.forEach(ban => {
                        todosLosBaneos.push({
                            nombre: ban.nombre,
                            razon: ban.razon || 'Sin razón especificada', 
                            admin: ban.admin || 'Sistema',
                            fecha: new Date(ban.fecha),
                            diasBaneado: ban.diasBaneado || 0,
                            tipo: ban.duracion > 0 ? `Temporal (${ban.duracion} min)` : 'Permanente',
                            fuente: 'tabla_baneos'
                        });
                    });
                    
                    if (todosLosBaneos.length === 0) {
                        const mensaje = "ℹ️ 📋 No hay jugadores baneados actualmente.";
                        room.sendAnnouncement(mensaje, byId, 0x00FF00, "normal", 1);
                        console.log(`📋 BANS: No hay baneos activos`);
                        return;
                    }
                    
                    // Formatear mensaje de respuesta
                    let mensaje = `🚫 Lista de Jugadores Baneados (${todosLosBaneos.length}):\n`;
                    
                    todosLosBaneos.slice(0, 10).forEach((ban, index) => {
                        const fechaStr = ban.fecha ? ban.fecha.toLocaleDateString() : 'Desconocida';
                        // Formatear nombre con ID si está disponible
                        const nombreConId = ban.id ? `${ban.nombre} (ID: ${ban.id})` : ban.nombre;
                        mensaje += `${nombreConId}\n`;
                        mensaje += `   📝 Razón: ${ban.razon}\n`;
                        mensaje += `   👮 Admin: ${ban.admin}\n`;
                        mensaje += `   📅 Fecha: ${fechaStr} (${ban.diasBaneado}d)\n`;
                        mensaje += `   ⏰ Tipo: ${ban.tipo}\n\n`;
                    });
                    
                    if (todosLosBaneos.length > 10) {
                        mensaje += `... y ${todosLosBaneos.length - 10} más. Usa comandos específicos para más detalles.`;
                    }
                    
                    // Enviar mensaje
                    room.sendAnnouncement(mensaje, byId, 0xFFA500, "normal", 1);
                    console.log(`✅ BANS: Lista de baneos enviada a ${byObj.name}`);
                    
                } catch (error) {
                    console.error(`❌ BANS: Error obteniendo lista de baneos:`, error);
                    
                    const mensajeError = `❌ Error obteniendo lista de baneos: ${error.message}`;
                    room.sendAnnouncement(mensajeError, byId, 0xFF6347, "bold", 0);
                }
            }
        });

        console.log("✅ COMMANDS: Comando 'bans' registrado exitosamente");

        // Agregar más comandos aquí en el futuro si es necesario
        // room.librariesMap.commands.add({ ... });

        return true;

    } catch (error) {
        console.error("❌ COMMANDS: Error inicializando sistema de comandos:", error);
        return false;
    }
}

// Función para verificar si el sistema está disponible
function checkCommandSystemAvailability(room) {
    const checks = {
        room: !!room,
        librariesMap: !!room?.librariesMap,
        commands: !!room?.librariesMap?.commands,
        add: typeof room?.librariesMap?.commands?.add === 'function',
        announceAction: typeof room?.librariesMap?.commands?.announceAction === 'function',
        announcePermissionDenied: typeof room?.librariesMap?.commands?.announcePermissionDenied === 'function'
    };

    console.log("🔍 COMMANDS: Verificación del sistema de comandos:", checks);

    const allAvailable = Object.values(checks).every(check => check === true);
    
    if (allAvailable) {
        console.log("✅ COMMANDS: Sistema de comandos completamente disponible");
    } else {
        console.warn("⚠️ COMMANDS: Sistema de comandos no completamente disponible");
    }

    return allAvailable;
}

// Función para limpiar comandos anteriores (opcional)
function cleanupOldCommands(room) {
    try {
        if (room.librariesMap?.commands?.clear) {
            room.librariesMap.commands.clear();
            console.log("🧹 COMMANDS: Comandos anteriores limpiados");
        }
    } catch (error) {
        console.warn("⚠️ COMMANDS: No se pudieron limpiar comandos anteriores:", error);
    }
}

module.exports = {
    initializeCommandSystem,
    checkCommandSystemAvailability,
    cleanupOldCommands
};
