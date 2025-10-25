/* 
* 🔧 COMANDOS VIP PARA ADMINISTRADORES
* Comandos para gestionar VIPs y Ultra VIPs desde el chat del juego
*/

const VIPSystem = require('./vip_system');
const { executeQuery } = require('./config/database');

// Función auxiliar para obtener jugador SOLO por ID desde el room
function obtenerJugadorPorID(room, input) {
    if (!input || typeof input !== 'string' || !room) {
        return null;
    }
    
    // SOLO aceptar IDs que empiecen con #
    if (!input.startsWith('#')) {
        return null; // Rechazar cualquier entrada que no sea un ID
    }
    
    const jugadores = room.getPlayerList().filter(j => j.id !== 0); // Sin host
    
    const id = input.substring(1);
    const idNum = parseInt(id);
    
    if (isNaN(idNum) || idNum < 0) {
        return null;
    }
    
    // Buscar jugador por ID real
    return jugadores.find(j => j.id === idNum);
}

class VIPCommands {
    constructor(room = null) {
        this.vipSystem = new VIPSystem();
        this.room = room; // Referencia al room para usar #ID
        
        // Lista de administradores autorizados (puedes modificar esto)
        this.adminAuthorities = [
            'owner', 'admin', 'admin_basico' // Agrega aquí los nombres o roles de administradores
        ];
    }

    // Verificar si un jugador es administrador
    isAdmin(playerName, playerAuth = null) {
        // Aquí puedes implementar tu lógica de verificación de admin
        // Por ejemplo, verificar por nombre, auth, o rol en la base de datos
        return this.adminAuthorities.includes(playerName.toLowerCase()) || 
               (playerAuth && this.adminAuthorities.includes(playerAuth));
    }

    // Verificar si un jugador es OWNER (solo ellos pueden gestionar VIPs)
    isOwner(playerName, playerAuth = null) {
        const ownerAuthorities = ['owner', 'tu_nombre_owner'];
        return ownerAuthorities.includes(playerName.toLowerCase()) || 
               (playerAuth && ownerAuthorities.includes(playerAuth));
    }

    // Procesar comandos VIP
    async processVIPCommand(message, playerName, playerAuth = null) {
        // Verificar si es un comando VIP
        if (!message.startsWith('!')) return null;

        const args = message.slice(1).split(' ');
        const command = args[0].toLowerCase();
        
        // Log de entrada del comando VIP
        try {
            console.log(`🔧 [VIP CMD] ${playerName}${playerAuth ? ' (' + playerAuth + ')' : ''} -> ${message}`);
            switch (command) {
                // === COMANDOS DE ADMINISTRACIÓN ===
                case 'givevip':
                case 'addvip':
                    return await this.handleGiveVIP(args, playerName, playerAuth);
                
                case 'giveultravip':
                case 'addultravip':
                    return await this.handleGiveUltraVIP(args, playerName, playerAuth);
                
                case 'removevip':
                case 'delvip':
                    return await this.handleRemoveVIP(args, playerName, playerAuth);
                
                case 'viplist':
                case 'listvips':
                    return await this.handleListVIPs(args, playerName, playerAuth);
                
                case 'vipinfo':
                case 'checklivvip':
                    return await this.handleVIPInfo(args, playerName, playerAuth);
                
                case 'vipstats':
                case 'vipport':
                    return await this.handleVIPStats(args, playerName, playerAuth);

                case 'vipcleanup':
                    return await this.handleVIPCleanup(args, playerName, playerAuth);

                // === COMANDOS PARA USUARIOS VIP ===
                case 'viphelp':
                    return await this.handleVIPHelp(args, playerName);
                
                case 'myivip':
                case 'vipstatus':
                    return await this.handleMyVIPStatus(args, playerName);
                
                case 'vipbenefits':
                    return await this.handleVIPBenefits(args, playerName);

                // === COMANDOS VIP EXCLUSIVOS ===
                case 'mystats':
                    return await this.handleMyStats(args, playerName);
                
                case 'myrecord':
                    return await this.handleMyRecord(args, playerName);

                case 'playtime':
                    return await this.handlePlaytime(args, playerName);

                // === COMANDOS ULTRA VIP EXCLUSIVOS ===
                case 'customcolor':
                    return await this.handleCustomColor(args, playerName);

                case 'effect':
                    return await this.handleEffect(args, playerName);

                default:
                    return null; // Comando no reconocido
            }
        } catch (error) {
            console.error('Error procesando comando VIP:', error);
            return `❌ Error: ${error.message}`;
        }
    }

    // === COMANDOS DE ADMINISTRACIÓN ===

    async handleGiveVIP(args, playerName, playerAuth) {
        console.log(`🔧 [VIP] handleGiveVIP invocado por ${playerName}${playerAuth ? ' (' + playerAuth + ')' : ''} con args:`, args);
        if (!this.isOwner(playerName, playerAuth)) {
            const msg = "❌ Solo los OWNERS pueden usar este comando.";
            console.warn(`[VIP] Permiso denegado para ${playerName} en !givevip`);
            if (this.room) this.room.sendAnnouncement(msg, null, 0xFF6347, "bold", 1);
            return msg;
        }

        if (args.length < 2) {
            const msg = "❌ Uso: !givevip #ID [días] [razón]\n💡 Ejemplo: !givevip #5\n⚠️ Solo se permiten IDs de jugadores (#1, #2, #3, etc.)";
            if (this.room) this.room.sendAnnouncement(msg, null, 0xFF6347, "normal", 1);
            return msg;
        }

        const targetInput = args[1];
        
        // SOLO permitir IDs - rechazar nombres
        if (!targetInput.startsWith('#')) {
            const msg = "❌ Solo se permiten IDs de jugadores. Usa: !givevip #ID\n💡 Ejemplo: !givevip #5 para dar VIP al jugador con ID 5";
            if (this.room) this.room.sendAnnouncement(msg, null, 0xFF6347, "normal", 1);
            return msg;
        }
        
        if (!this.room) {
            const msg = "❌ Error: No hay referencia de sala disponible";
            console.error(`[VIP] ${msg}`);
            return msg;
        }
        
        const jugador = obtenerJugadorPorID(this.room, targetInput);
        if (!jugador) {
            const msg = `❌ No se encontró jugador con ID ${targetInput}\n💡 Usa el comando !list para ver los IDs de jugadores disponibles`;
            if (this.room) this.room.sendAnnouncement(msg, null, 0xFF6347, "normal", 1);
            return msg;
        }
        
        const targetPlayerName = jugador.name;
        
        const durationDays = args[2] ? parseInt(args[2]) : null;
        const reason = args.slice(3).join(' ') || "Otorgado por administrador";

        try {
            console.log(`🔧 [VIP] Otorgando VIP a ${targetPlayerName} (auth: ${jugador.auth || 'N/A'}) por ${durationDays || 'permanente'} días. Razón: ${reason}`);
            const result = await this.vipSystem.grantVIP(targetPlayerName, 'VIP', playerName, durationDays, reason, jugador.auth);
            
            let response = `✅ ${result.message}`;
            if (durationDays) {
                response += ` por ${durationDays} días`;
            } else {
                response += ` permanentemente`;
            }
            
            if (this.room) this.room.sendAnnouncement(response, null, 0x00FF00, "normal", 1);
            return response;
        } catch (error) {
            const errMsg = `❌ Error: ${error.message}`;
            console.error(`[VIP] Error en !givevip:`, error);
            if (this.room) this.room.sendAnnouncement(errMsg, null, 0xFF6347, "bold", 1);
            return errMsg;
        }
    }

    async handleGiveUltraVIP(args, playerName, playerAuth) {
        console.log(`🔧 [VIP] handleGiveUltraVIP invocado por ${playerName}${playerAuth ? ' (' + playerAuth + ')' : ''} con args:`, args);
        if (!this.isOwner(playerName, playerAuth)) {
            const msg = "❌ Solo los OWNERS pueden usar este comando.";
            if (this.room) this.room.sendAnnouncement(msg, null, 0xFF6347, "bold", 1);
            return msg;
        }

        if (args.length < 2) {
            const msg = "❌ Uso: !giveultravip #ID [días] [razón]\n💡 Ejemplo: !giveultravip #5\n⚠️ Solo se permiten IDs de jugadores (#1, #2, #3, etc.)";
            if (this.room) this.room.sendAnnouncement(msg, null, 0xFF6347, "normal", 1);
            return msg;
        }

        const targetInput = args[1];
        
        // SOLO permitir IDs - rechazar nombres
        if (!targetInput.startsWith('#')) {
            return "❌ Solo se permiten IDs de jugadores. Usa: !giveultravip #ID\n💡 Ejemplo: !giveultravip #5 para dar Ultra VIP al jugador con ID 5";
        }
        
        if (!this.room) {
            return "❌ Error: No hay referencia de sala disponible";
        }
        
        const jugador = obtenerJugadorPorID(this.room, targetInput);
        if (!jugador) {
            return `❌ No se encontró jugador con ID ${targetInput}\n💡 Usa el comando !list para ver los IDs de jugadores disponibles`;
        }
        
        const targetPlayerName = jugador.name;
        
        const durationDays = args[2] ? parseInt(args[2]) : null;
        const reason = args.slice(3).join(' ') || "Otorgado por administrador";

        try {
            console.log(`🔧 [VIP] Otorgando ULTRA_VIP a ${targetPlayerName} (auth: ${jugador.auth || 'N/A'}) por ${durationDays || 'permanente'} días. Razón: ${reason}`);
            const result = await this.vipSystem.grantVIP(targetPlayerName, 'ULTRA_VIP', playerName, durationDays, reason, jugador.auth);
            
            let response = `✅ ${result.message}`;
            if (durationDays) {
                response += ` por ${durationDays} días`;
            } else {
                response += ` permanentemente`;
            }
            
            if (this.room) this.room.sendAnnouncement(response, null, 0x00FF00, "normal", 1);
            return response;
        } catch (error) {
            const errMsg = `❌ Error: ${error.message}`;
            console.error(`[VIP] Error en !giveultravip:`, error);
            if (this.room) this.room.sendAnnouncement(errMsg, null, 0xFF6347, "bold", 1);
            return errMsg;
        }
    }

    async handleRemoveVIP(args, playerName, playerAuth) {
        console.log(`🔧 [VIP] handleRemoveVIP invocado por ${playerName}${playerAuth ? ' (' + playerAuth + ')' : ''} con args:`, args);
        if (!this.isOwner(playerName, playerAuth)) {
            const msg = "❌ Solo los OWNERS pueden usar este comando.";
            if (this.room) this.room.sendAnnouncement(msg, null, 0xFF6347, "bold", 1);
            return msg;
        }

        if (args.length < 2) {
            return "❌ Uso: !removevip #ID [razón]\n💡 Ejemplo: !removevip #5\n⚠️ Solo se permiten IDs de jugadores (#1, #2, #3, etc.)";
        }

        const targetInput = args[1];
        
        // SOLO permitir IDs - rechazar nombres
        if (!targetInput.startsWith('#')) {
            return "❌ Solo se permiten IDs de jugadores. Usa: !removevip #ID\n💡 Ejemplo: !removevip #5 para remover VIP al jugador con ID 5";
        }
        
        if (!this.room) {
            return "❌ Error: No hay referencia de sala disponible";
        }
        
        const jugador = obtenerJugadorPorID(this.room, targetInput);
        if (!jugador) {
            return `❌ No se encontró jugador con ID ${targetInput}\n💡 Usa el comando !list para ver los IDs de jugadores disponibles`;
        }
        
        const targetPlayerName = jugador.name;
        
        const reason = args.slice(2).join(' ') || "Removido por administrador";

        try {
            console.log(`🔧 [VIP] Removiendo VIP a ${targetPlayerName} (auth: ${jugador.auth || 'N/A'}) Razón: ${reason}`);
            const result = await this.vipSystem.removeVIP(targetPlayerName, playerName, reason, jugador.auth);
            const msg = `✅ ${result.message}`;
            if (this.room) this.room.sendAnnouncement(msg, null, 0xFFA500, "normal", 1);
            return msg;
        } catch (error) {
            const errMsg = `❌ Error: ${error.message}`;
            console.error(`[VIP] Error en !removevip:`, error);
            if (this.room) this.room.sendAnnouncement(errMsg, null, 0xFF6347, "bold", 1);
            return errMsg;
        }
    }

    async handleListVIPs(args, playerName, playerAuth) {
        if (!this.isOwner(playerName, playerAuth)) {
            return "❌ Solo los OWNERS pueden usar este comando.";
        }

        try {
            const vips = await this.vipSystem.listActiveVIPs();
            
            if (vips.length === 0) {
                return "📋 No hay VIPs activos en este momento.";
            }

            let response = "📋 VIPs Activos:\n";
            vips.forEach((vip, index) => {
                const grantedDate = new Date(vip.granted_date).toLocaleDateString();
                const expiryInfo = vip.expiry_date ? 
                    `(Expira: ${new Date(vip.expiry_date).toLocaleDateString()})` : 
                    '(Permanente)';
                
                response += `${index + 1}. ${vip.color} ${vip.player_name} - ${vip.vip_type} ${expiryInfo}\n`;
            });

            return response;
        } catch (error) {
            return `❌ Error: ${error.message}`;
        }
    }

    async handleVIPInfo(args, playerName, playerAuth) {
        if (!this.isOwner(playerName, playerAuth)) {
            return "❌ Solo los OWNERS pueden usar este comando.";
        }

        if (args.length < 2) {
            return "❌ Uso: !vipinfo #ID\n💡 Ejemplo: !vipinfo #5\n⚠️ Solo se permiten IDs de jugadores (#1, #2, #3, etc.)";
        }

        const targetInput = args[1];
        
        // SOLO permitir IDs - rechazar nombres
        if (!targetInput.startsWith('#')) {
            return "❌ Solo se permiten IDs de jugadores. Usa: !vipinfo #ID\n💡 Ejemplo: !vipinfo #5 para ver info VIP del jugador con ID 5";
        }
        
        if (!this.room) {
            return "❌ Error: No hay referencia de sala disponible";
        }
        
        const jugador = obtenerJugadorPorID(this.room, targetInput);
        if (!jugador) {
            return `❌ No se encontró jugador con ID ${targetInput}\n💡 Usa el comando !list para ver los IDs de jugadores disponibles`;
        }
        
        const targetPlayerName = jugador.name;

        try {
            const vipStatus = await this.vipSystem.checkVIPStatus(targetPlayerName, jugador.auth);
            
            if (!vipStatus) {
                return `📋 ${targetPlayerName} no tiene VIP activo.`;
            }

            const grantedDate = new Date(vipStatus.granted_date).toLocaleDateString();
            const expiryInfo = vipStatus.expiry_date ? 
                `Expira: ${new Date(vipStatus.expiry_date).toLocaleDateString()}` : 
                'Permanente';

            return `📋 Info VIP de ${targetPlayerName}:
${vipStatus.color} Tipo: ${vipStatus.vip_type}
📅 Otorgado: ${grantedDate}
⏰ ${expiryInfo}
👤 Por: ${vipStatus.granted_by}
📝 Razón: ${vipStatus.reason}`;
        } catch (error) {
            return `❌ Error: ${error.message}`;
        }
    }

    async handleVIPStats(args, playerName, playerAuth) {
        if (!this.isOwner(playerName, playerAuth)) {
            return "❌ Solo los OWNERS pueden usar este comando.";
        }

        try {
            const report = await this.vipSystem.generateVIPReport();
            
            let response = `📊 Estadísticas VIP:
🔹 Total VIPs activos: ${report.totalActiveVIPs}

📋 Por tipo:`;

            report.vipsByType.forEach(type => {
                response += `\n${type.color} ${type.vip_type}: ${type.count}`;
            });

            if (report.recentGrants.length > 0) {
                response += "\n\n🆕 Últimos otorgados:";
                report.recentGrants.slice(0, 5).forEach(grant => {
                    const date = new Date(grant.granted_date).toLocaleDateString();
                    response += `\n${grant.color} ${grant.player_name} (${date})`;
                });
            }

            return response;
        } catch (error) {
            return `❌ Error: ${error.message}`;
        }
    }

    async handleVIPCleanup(args, playerName, playerAuth) {
        if (!this.isOwner(playerName, playerAuth)) {
            return "❌ Solo los OWNERS pueden usar este comando.";
        }

        try {
            const result = await this.vipSystem.cleanupExpiredVIPs();
            return `🧹 ${result.message}`;
        } catch (error) {
            return `❌ Error: ${error.message}`;
        }
    }

    // === COMANDOS PARA USUARIOS ===

    async handleVIPHelp(args, playerName) {
        const vipStatus = await this.vipSystem.checkVIPStatus(playerName);
        
        if (!vipStatus) {
            return `❌ No tienes VIP activo. Los VIPs tienen acceso a comandos especiales y beneficios únicos.`;
        }

        const benefits = this.vipSystem.getVIPBenefits(vipStatus.vip_type);
        const commands = this.vipSystem.vipCommands[vipStatus.vip_type] || [];

        let response = `${benefits.color} Ayuda ${benefits.name}:

🎯 Comandos disponibles:
${commands.map(cmd => `• ${cmd}`).join('\n')}

✨ Beneficios:
${benefits.benefits.slice(0, 5).map(benefit => `• ${benefit}`).join('\n')}`;

        if (benefits.benefits.length > 5) {
            response += `\n... y ${benefits.benefits.length - 5} más`;
        }

        return response;
    }

    async handleMyVIPStatus(args, playerName) {
        try {
            const vipStatus = await this.vipSystem.checkVIPStatus(playerName);
            
            if (!vipStatus) {
                return `📋 No tienes VIP activo. ¡Contacta a un administrador para obtener VIP!`;
            }

            const grantedDate = new Date(vipStatus.granted_date).toLocaleDateString();
            const expiryInfo = vipStatus.expiry_date ? 
                `Expira: ${new Date(vipStatus.expiry_date).toLocaleDateString()}` : 
                'Permanente';

            return `${vipStatus.color} Tu estado VIP:
🔹 Tipo: ${vipStatus.vip_type}
📅 Desde: ${grantedDate}
⏰ ${expiryInfo}
🎮 Usa !viphelp para ver comandos`;
        } catch (error) {
            return `❌ Error: ${error.message}`;
        }
    }

    async handleVIPBenefits(args, playerName) {
        const vipType = args[1] || 'VIP';
        const benefits = this.vipSystem.getVIPBenefits(vipType);
        
        if (!benefits) {
            return "❌ Tipo VIP no válido. Usa: VIP o ULTRA_VIP";
        }

        let response = `${benefits.color} Beneficios ${benefits.name}:

${benefits.benefits.map(benefit => `• ${benefit}`).join('\n')}`;

        return response;
    }

    // === COMANDOS VIP EXCLUSIVOS ===

    async handleMyStats(args, playerName) {
        const canUse = await this.vipSystem.canUseVIPCommand(playerName, '!mystats');
        if (!canUse) {
            return "❌ Este comando es exclusivo para VIPs.";
        }

        // Integrado con sistema de estadísticas MySQL
        try {
            const results = await executeQuery('SELECT * FROM jugadores WHERE nombre = ?', [playerName]);
            const player = results[0];
            
            if (!player) {
                return "❌ No se encontraron estadísticas.";
            }

            const winRate = player.partidos > 0 ? 
                ((player.victorias / player.partidos) * 100).toFixed(1) : 0;

            return `📊 Tus estadísticas VIP:
🎮 Partidos: ${player.partidos}
🏆 Victorias: ${player.victorias} (${winRate}%)
⚽ Goles: ${player.goles}
🅰️ Asistencias: ${player.asistencias}
⭐ XP: ${player.xp} (Nivel ${player.nivel})
🎯 Promedio goles: ${player.promedioGoles.toFixed(2)}
🔥 Mejor racha: ${player.mejorRachaGoles} goles`;
        } catch (error) {
            return "❌ Error obteniendo estadísticas.";
        }
    }

    async handleMyRecord(args, playerName) {
        const canUse = await this.vipSystem.canUseVIPCommand(playerName, '!myrecord');
        if (!canUse) {
            return "❌ Este comando es exclusivo para VIPs.";
        }

        // Integrar con sistema de records
        return "🏆 Tus records personales: (Función en desarrollo)";
    }

    async handlePlaytime(args, playerName) {
        const canUse = await this.vipSystem.canUseVIPCommand(playerName, '!playtime');
        if (!canUse) {
            return "❌ Este comando es exclusivo para VIPs.";
        }

        try {
            const results = await executeQuery('SELECT tiempoJugado FROM jugadores WHERE nombre = ?', [playerName]);
            const player = results[0];
            
            if (!player) {
                return "❌ No se encontró información de tiempo.";
            }

            const hours = Math.floor(player.tiempoJugado / 60);
            const minutes = player.tiempoJugado % 60;
            
            return `⏰ Tu tiempo de juego: ${hours}h ${minutes}m`;
        } catch (error) {
            return "❌ Error obteniendo tiempo de juego.";
        }
    }

    // === COMANDOS ULTRA VIP EXCLUSIVOS ===

    async handleCustomColor(args, playerName) {
        const canUse = await this.vipSystem.canUseVIPCommand(playerName, '!customcolor');
        if (!canUse) {
            return "❌ Este comando es exclusivo para Ultra VIPs.";
        }

        if (args.length < 2) {
            return "❌ Uso: !customcolor <color>. Ejemplo: !customcolor #FF0000";
        }

        // Aquí implementarías la lógica de cambio de color
        return `🎨 Color personalizado aplicado: ${args[1]}`;
    }

    async handleEffect(args, playerName) {
        const canUse = await this.vipSystem.canUseVIPCommand(playerName, '!effect');
        if (!canUse) {
            return "❌ Este comando es exclusivo para Ultra VIPs.";
        }

        const effects = ['sparkle', 'glow', 'rainbow', 'shadow'];
        const effect = args[1];

        if (!effect || !effects.includes(effect)) {
            return `❌ Efectos disponibles: ${effects.join(', ')}`;
        }

        // Aquí implementarías la lógica de efectos
        return `✨ Efecto '${effect}' aplicado a tu nombre!`;
    }
}

module.exports = VIPCommands;
