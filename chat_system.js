/* 
* 💬 SISTEMA DE CHAT CON PREFIJOS Y COLORES
* Sistema para mostrar diferentes rangos de usuarios en el chat con prefijos visuales
*/

const VIPSystem = require('./vip_system');

class ChatSystem {
    constructor() {
        this.vipSystem = new VIPSystem();
        
        // Configuración de rangos y sus prefijos/colores
        this.userRanks = {
            OWNER: {
                prefix: "👑",
                name: "OWNER",
                color: 0xFF0000, // Rojo brillante
                priority: 10,
                displayColor: "#FF0000"
            },
            ADMIN: {
                prefix: "⭐",
                name: "ADMIN", 
                color: 0xFF8C00, // Naranja
                priority: 9,
                displayColor: "#FF8C00"
            },
            ADMIN_BASICO: {
                prefix: "🔧",
                name: "ADMIN BÁSICO",
                color: 0x1E90FF, // Azul
                priority: 8,
                displayColor: "#1E90FF"
            },
            ULTRA_VIP: {
                prefix: "👑",
                name: "ULTRA VIP",
                color: 0x9932CC, // Púrpura
                priority: 7,
                displayColor: "#9932CC"
            },
            VIP: {
                prefix: "💎",
                name: "VIP",
                color: 0x00CED1, // Turquesa
                priority: 6,
                displayColor: "#00CED1"
            },
            JUGADOR: {
                prefix: "",
                name: "",
                color: 0xFFFFFF, // Blanco
                priority: 1,
                displayColor: "#FFFFFF"
            }
        };

        // Lista de usuarios con rangos específicos
        this.specialUsers = {
            // Owners
            'tu_nombre_owner': 'OWNER',
            'owner': 'OWNER',
            
            // Admins
            'admin1': 'ADMIN',
            'admin2': 'ADMIN',
            'admin_principal': 'ADMIN',
            
            // Admins Básicos
            'admin_basico1': 'ADMIN_BASICO',
            'adminbasico1': 'ADMIN_BASICO',
            'staff1': 'ADMIN_BASICO'
        };
    }

    // Determinar el rango de un usuario
    async getUserRank(playerName, playerAuth = null) {
        // Verificar rangos especiales primero (owners, admins, mods)
        const specialRank = this.specialUsers[playerName.toLowerCase()];
        if (specialRank) {
            return specialRank;
        }

        // Verificar VIP status
        try {
            const vipStatus = await this.vipSystem.checkVIPStatus(playerName);
            if (vipStatus) {
                return vipStatus.vip_type; // 'VIP' o 'ULTRA_VIP'
            }
        } catch (error) {
            console.error('Error verificando VIP status:', error);
        }

        // Usuario normal
        return 'JUGADOR';
    }

    // Formatear mensaje de chat con prefijo y color
    async formatChatMessage(playerName, message, playerAuth = null) {
        const rank = await this.getUserRank(playerName, playerAuth);
        const rankConfig = this.userRanks[rank];

        // Construir el nombre con prefijo
        let displayName = playerName;
        if (rankConfig.prefix) {
            displayName = `${rankConfig.prefix} ${rankConfig.name} ${playerName}`;
        }

        return {
            displayName: displayName,
            message: message,
            color: rankConfig.color,
            htmlColor: rankConfig.displayColor,
            rank: rank,
            priority: rankConfig.priority,
            formattedMessage: `${displayName}: ${message}`
        };
    }

    // Enviar mensaje formateado a la sala
    async sendFormattedMessage(room, playerName, message, playerAuth = null, targetPlayerId = null) {
        const formatted = await this.formatChatMessage(playerName, message, playerAuth);
        
        // Enviar mensaje con color específico
        room.sendAnnouncement(
            formatted.formattedMessage,
            targetPlayerId, // null para todos, o ID específico
            formatted.color,
            "normal", // estilo
            1 // sonido
        );

        return formatted;
    }

    // Mensaje de bienvenida personalizado por rango
    async getWelcomeMessage(playerName, playerAuth = null) {
        const rank = await this.getUserRank(playerName, playerAuth);
        const rankConfig = this.userRanks[rank];

        let welcomeMessage = "";

        switch (rank) {
            case 'OWNER':
                welcomeMessage = `👑 ¡Bienvenido OWNER ${playerName}! Tienes control total del servidor.`;
                break;
            case 'ADMIN':
                welcomeMessage = `⭐ ¡Bienvenido ADMIN ${playerName}! Tienes permisos administrativos.`;
                break;
            case 'ADMIN_BASICO':
                welcomeMessage = `🔧 ¡Bienvenido ADMIN BÁSICO ${playerName}! Ayuda a mantener el orden.`;
                break;
            case 'ULTRA_VIP':
                welcomeMessage = `👑 ¡Bienvenido Ultra VIP ${playerName}! Disfruta de todos los beneficios premium.`;
                break;
            case 'VIP':
                welcomeMessage = `💎 ¡Bienvenido VIP ${playerName}! Disfruta de tus beneficios especiales.`;
                break;
            default:
                welcomeMessage = `⚽ ¡Bienvenido ${playerName}! Disfruta del juego.`;
        }

        return {
            message: welcomeMessage,
            color: rankConfig.color,
            rank: rank
        };
    }

    // Verificar si un usuario puede usar comandos de admin
    async canUseAdminCommands(playerName, playerAuth = null) {
        const rank = await this.getUserRank(playerName, playerAuth);
        return ['OWNER', 'ADMIN'].includes(rank);
    }

    // Verificar si un usuario puede usar comandos de moderador
    async canUseModCommands(playerName, playerAuth = null) {
        const rank = await this.getUserRank(playerName, playerAuth);
        return ['OWNER', 'ADMIN', 'ADMIN_BASICO'].includes(rank);
    }

    // Verificar si un usuario puede usar comandos de unban
    async canUseUnbanCommands(playerName, playerAuth = null) {
        const rank = await this.getUserRank(playerName, playerAuth);
        return ['OWNER', 'ADMIN', 'ADMIN_BASICO'].includes(rank);
    }

    // Obtener lista de usuarios online con sus rangos
    async getOnlineUsersWithRanks(playerList) {
        const usersWithRanks = [];

        for (const player of playerList) {
            const rank = await this.getUserRank(player.name, player.auth);
            const rankConfig = this.userRanks[rank];

            usersWithRanks.push({
                name: player.name,
                id: player.id,
                rank: rank,
                displayName: rankConfig.prefix ? `${rankConfig.prefix} ${rankConfig.name} ${player.name}` : player.name,
                color: rankConfig.color,
                priority: rankConfig.priority
            });
        }

        // Ordenar por prioridad (mayor prioridad primero)
        usersWithRanks.sort((a, b) => b.priority - a.priority);

        return usersWithRanks;
    }

    // Comando para mostrar rangos online
    async showOnlineRanks(room, playerList) {
        const usersWithRanks = await this.getOnlineUsersWithRanks(playerList);
        
        let message = "👥 Usuarios Online:\n";
        
        // Agrupar por rango
        const rankGroups = {};
        usersWithRanks.forEach(user => {
            if (!rankGroups[user.rank]) {
                rankGroups[user.rank] = [];
            }
            rankGroups[user.rank].push(user);
        });

        // Mostrar cada grupo
        Object.keys(rankGroups).forEach(rank => {
            if (rank !== 'JUGADOR') {
                const rankConfig = this.userRanks[rank];
                message += `\n${rankConfig.prefix} ${rankConfig.name}S:\n`;
                rankGroups[rank].forEach(user => {
                    message += `  • ${user.name}\n`;
                });
            }
        });

        // Mostrar jugadores normales al final
        if (rankGroups['JUGADOR']) {
            message += `\n⚽ JUGADORES:\n`;
            rankGroups['JUGADOR'].forEach(user => {
                message += `  • ${user.name}\n`;
            });
        }

        room.sendAnnouncement(message, null, 0x00FF00);
        return usersWithRanks;
    }

    // Agregar usuario a lista de rangos especiales
    addSpecialUser(playerName, rank) {
        if (this.userRanks[rank] && rank !== 'VIP' && rank !== 'ULTRA_VIP') {
            this.specialUsers[playerName.toLowerCase()] = rank;
            return true;
        }
        return false;
    }

    // Remover usuario de lista de rangos especiales
    removeSpecialUser(playerName) {
        delete this.specialUsers[playerName.toLowerCase()];
        return true;
    }

    // Comando para otorgar rango (solo owners)
    async grantRank(playerName, targetPlayer, rank, grantedBy) {
        const granterRank = await this.getUserRank(grantedBy);
        
        if (granterRank !== 'OWNER') {
            return "❌ Solo los OWNERS pueden otorgar rangos.";
        }

        if (!this.userRanks[rank]) {
            return "❌ Rango no válido. Rangos disponibles: OWNER, ADMIN, ADMIN_BASICO";
        }

        if (rank === 'VIP' || rank === 'ULTRA_VIP') {
            return "❌ Usa !givevip o !giveultravip para otorgar VIP.";
        }

        this.addSpecialUser(targetPlayer, rank);
        const rankConfig = this.userRanks[rank];
        
        return `✅ ${rankConfig.prefix} ${targetPlayer} ahora es ${rankConfig.name}`;
    }

    // Comando para remover rango
    async removeRank(playerName, targetPlayer, removedBy) {
        const removerRank = await this.getUserRank(removedBy);
        
        if (removerRank !== 'OWNER') {
            return "❌ Solo los OWNERS pueden remover rangos.";
        }

        this.removeSpecialUser(targetPlayer);
        return `✅ Rango removido de ${targetPlayer}`;
    }
}

module.exports = ChatSystem;
