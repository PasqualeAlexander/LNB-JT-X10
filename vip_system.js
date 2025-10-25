/* 
* ██╗   ██╗██╗██████╗     ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
* ██║   ██║██║██╔══██╗    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
* ██║   ██║██║██████╔╝    ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
* ╚██╗ ██╔╝██║██╔═══╝     ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
*  ╚████╔╝ ██║██║         ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
*   ╚═══╝  ╚═╝╚═╝         ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
*
* SISTEMA VIP Y ULTRA VIP PARA BOT LNB - VERSION MYSQL
* Incluye ventajas diferenciadas, comandos de administración y gestión completa
*/

const { executeQuery, executeTransaction } = require('./config/database');

class VIPSystem {
    constructor() {
        this.initializeVIPTables();
        
        // Configuración de ventajas VIP
        this.vipBenefits = {
            VIP: {
                name: "VIP",
                color: "💎",
                level: 1,
                benefits: [
                    "🎨 Colores especiales en chat",
                    "⚡ XP multiplicado x1.5",
                    "📊 Estadísticas detalladas",
                    "🎯 Comando !record personal",
                    "🔄 Prioridad en auto-balance"
                ]
            },
            ULTRA_VIP: {
                name: "Ultra VIP",
                color: "👑",
                level: 2,
                benefits: [
                    "🌈 Todos los beneficios VIP",
                    "🔥 XP multiplicado x2.0",
                    "🎮 Comandos de jugador especiales",
                    "🏆 Acceso a salas VIP exclusivas",
                    "🎨 Nombres con efectos especiales",
                    "🔧 Comandos de configuración personal",
                    "📈 Estadísticas avanzadas",
                    "🎪 Comandos de diversión exclusivos"
                ]
            }
        };
        
        // Comandos disponibles por nivel
        this.vipCommands = {
            VIP: [
                "!myrecord", "!mystats", "!playtime", "!viphelp"
            ],
            ULTRA_VIP: [
                "!myrecord", "!mystats", "!playtime", "!viphelp",
                "!customcolor", "!effect", "!premium", "!ultravip",
                "!exclusive", "!special"
            ]
        };
    }

    // Inicializar tablas del sistema VIP en MySQL
    async initializeVIPTables() {
        try {
            // Crear tabla de tipos VIP
            await executeQuery(`CREATE TABLE IF NOT EXISTS vip_types (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type_name VARCHAR(50) UNIQUE NOT NULL,
                level INT NOT NULL,
                color VARCHAR(10) NOT NULL,
                benefits TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            // Crear tabla de membresías VIP
            await executeQuery(`CREATE TABLE IF NOT EXISTS vip_memberships (
                id INT AUTO_INCREMENT PRIMARY KEY,
                player_name VARCHAR(100) NOT NULL,
                vip_type VARCHAR(50) NOT NULL,
                granted_by VARCHAR(100) NOT NULL,
                granted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expiry_date TIMESTAMP NULL,
                is_active BOOLEAN DEFAULT TRUE,
                reason TEXT,
                INDEX idx_player_active (player_name, is_active),
                INDEX idx_expiry (expiry_date)
            )`);

            // Crear tabla de beneficios utilizados
            await executeQuery(`CREATE TABLE IF NOT EXISTS vip_benefits_used (
                id INT AUTO_INCREMENT PRIMARY KEY,
                player_name VARCHAR(100) NOT NULL,
                benefit_type VARCHAR(50) NOT NULL,
                used_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                details TEXT,
                INDEX idx_player_date (player_name, used_date)
            )`);

            // Insertar tipos VIP por defecto
            await this.insertDefaultVIPTypes();
            console.log('✅ Tablas VIP MySQL inicializadas correctamente');
        } catch (error) {
            console.error('❌ Error inicializando tablas VIP:', error);
            throw error;
        }
    }

    // Insertar tipos VIP por defecto
    async insertDefaultVIPTypes() {
        try {
            const defaultTypes = [
                {
                    type_name: 'VIP',
                    level: 1,
                    color: '💎',
                    benefits: JSON.stringify(this.vipBenefits.VIP.benefits)
                },
                {
                    type_name: 'ULTRA_VIP',
                    level: 2,
                    color: '👑',
                    benefits: JSON.stringify(this.vipBenefits.ULTRA_VIP.benefits)
                }
            ];

            for (const type of defaultTypes) {
                await executeQuery(
                    `INSERT IGNORE INTO vip_types (type_name, level, color, benefits) 
                     VALUES (?, ?, ?, ?)`,
                    [type.type_name, type.level, type.color, type.benefits]
                );
            }
        } catch (error) {
            console.error('❌ Error insertando tipos VIP por defecto:', error);
        }
    }

    // Otorgar VIP a un jugador
  async grantVIP(playerName, vipType, grantedBy, durationDays = null, reason = "Otorgado por admin", playerAuth = null) {
    try {
      console.log(`🔧 [VIP SYSTEM] grantVIP → jugador='${playerName}', tipo='${vipType}', por='${grantedBy}', dias='${durationDays ?? 'permanente'}', razon='${reason}'`);
      // Resolver auth_id preferentemente por auth, si no por nombre
      let authId = playerAuth;
      if (!authId) {
        const player = await executeQuery('SELECT auth_id FROM jugadores WHERE nombre = ? LIMIT 1', [playerName]);
        if (player.length === 0 || !player[0].auth_id) {
          throw new Error(`No se pudo resolver auth_id de ${playerName}`);
        }
        authId = player[0].auth_id;
      }
      console.log(`🔑 [VIP SYSTEM] grantVIP → auth_id resuelto='${authId}'`);

      // Verificar tipo VIP existe
      const vipTypeData = await executeQuery('SELECT * FROM vip_types WHERE type_name = ?', [vipType]);
      if (vipTypeData.length === 0) {
        throw new Error(`Tipo VIP ${vipType} no válido`);
      }

      // Calcular expiración
      let expiryDate = null;
      if (durationDays) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + durationDays);
        expiryDate = expiry.toISOString().slice(0, 19).replace('T', ' ');
      }
      console.log(`⏰ [VIP SYSTEM] grantVIP → expiry='${expiryDate || 'NULL'}'`);

      // Transacción: desactivar membresías previas por auth_id, insertar nueva, actualizar flag en jugadores por auth_id
      const queries = [
        {
          query: 'UPDATE vip_memberships SET is_active = FALSE WHERE auth_id = ? AND is_active = TRUE',
          params: [authId]
        },
        {
          query: `INSERT INTO vip_memberships 
                 (auth_id, player_name, vip_type, granted_by, expiry_date, reason) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
          params: [authId, playerName, vipType, grantedBy, expiryDate, reason]
        },
        {
          query: 'UPDATE jugadores SET esVIP = ?, fechaVIP = CURRENT_TIMESTAMP WHERE auth_id = ?',
          params: [vipType === 'ULTRA_VIP' ? 2 : 1, authId]
        }
      ];

      console.log(`🧾 [VIP SYSTEM] grantVIP → ejecutando transacción (3 pasos) para auth_id='${authId}'`);
      await executeTransaction(queries);
      console.log(`✅ [VIP SYSTEM] grantVIP → COMPLETADO jugador='${playerName}' auth_id='${authId}' tipo='${vipType}' expiry='${expiryDate || 'NULL'}'`);

      return {
        success: true,
        message: `${vipTypeData[0].color} ${playerName} ahora es ${vipType}`,
        vipLevel: vipType === 'ULTRA_VIP' ? 2 : 1,
        expiryDate: expiryDate
      };
    } catch (error) {
      console.error('❌ Error otorgando VIP:', error);
      throw error;
    }
  }

    // Remover VIP de un jugador
  async removeVIP(playerName, removedBy, reason = "Removido por admin", playerAuth = null) {
    try {
      console.log(`🔧 [VIP SYSTEM] removeVIP → jugador='${playerName}', por='${removedBy}', razon='${reason}'`);
      // Resolver auth_id
      let authId = playerAuth;
      if (!authId) {
        const player = await executeQuery('SELECT auth_id FROM jugadores WHERE nombre = ? LIMIT 1', [playerName]);
        if (player.length === 0 || !player[0].auth_id) {
          throw new Error(`No se pudo resolver auth_id de ${playerName}`);
        }
        authId = player[0].auth_id;
      }
      console.log(`🔑 [VIP SYSTEM] removeVIP → auth_id resuelto='${authId}'`);

      // Verificar VIP activo por auth_id
      const activeMembership = await executeQuery(
          'SELECT * FROM vip_memberships WHERE auth_id = ? AND is_active = TRUE',
          [authId]
      );
      console.log(`📋 [VIP SYSTEM] removeVIP → membresias_activas=${activeMembership.length}`);

      if (activeMembership.length === 0) {
        throw new Error(`${playerName} no tiene VIP activo`);
      }

      // Transacción para desactivar por auth_id
      const queries = [
        {
          query: 'UPDATE vip_memberships SET is_active = FALSE WHERE auth_id = ? AND is_active = TRUE',
          params: [authId]
        },
        {
          query: 'UPDATE jugadores SET esVIP = 0, fechaVIP = NULL WHERE auth_id = ?',
          params: [authId]
        }
      ];

      console.log(`🧾 [VIP SYSTEM] removeVIP → ejecutando transacción (2 pasos) para auth_id='${authId}'`);
      await executeTransaction(queries);
      console.log(`✅ [VIP SYSTEM] removeVIP → COMPLETADO jugador='${playerName}' auth_id='${authId}'`);

      return {
        success: true,
        message: `VIP removido de ${playerName}`,
        removedBy: removedBy,
        reason: reason
      };
    } catch (error) {
      console.error('❌ Error removiendo VIP:', error);
      throw error;
    }
  }

    // Verificar estado VIP de un jugador
  async checkVIPStatus(playerName, playerAuth = null) {
    try {
      console.log(`🔎 [VIP SYSTEM] checkVIPStatus → jugador='${playerName}', auth_provisto='${playerAuth ? 'sí' : 'no'}'`);
      // Preferir auth_id si está disponible
      let authId = playerAuth;
      if (!authId) {
        const row = await executeQuery('SELECT auth_id FROM jugadores WHERE nombre = ? LIMIT 1', [playerName]);
        authId = row && row[0] ? row[0].auth_id : null;
      }

      if (!authId) {
        console.log(`ℹ️ [VIP SYSTEM] checkVIPStatus → sin auth_id, retornando null`);
        return null;
      }

      const query = `
          SELECT vm.*, vt.level, vt.color, vt.benefits 
          FROM vip_memberships vm
          JOIN vip_types vt ON vm.vip_type = vt.type_name
          WHERE vm.auth_id = ? AND vm.is_active = TRUE
          AND (vm.expiry_date IS NULL OR vm.expiry_date > NOW())
          ORDER BY vt.level DESC
          LIMIT 1
      `;

      const result = await executeQuery(query, [authId]);
      console.log(`📊 [VIP SYSTEM] checkVIPStatus → encontrado=${result.length > 0 ? 'sí' : 'no'}`);
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      console.error('❌ Error verificando estado VIP:', error);
      throw error;
    }
  }

    // Listar todos los VIPs activos
    async listActiveVIPs() {
        try {
            const query = `
                SELECT vm.player_name, vm.vip_type, vm.granted_date, vm.expiry_date, 
                       vm.granted_by, vt.color, vt.level
                FROM vip_memberships vm
                JOIN vip_types vt ON vm.vip_type = vt.type_name
                WHERE vm.is_active = TRUE
                AND (vm.expiry_date IS NULL OR vm.expiry_date > NOW())
                ORDER BY vt.level DESC, vm.granted_date ASC
            `;

            return await executeQuery(query);
        } catch (error) {
            console.error('❌ Error listando VIPs activos:', error);
            throw error;
        }
    }

    // Aplicar multiplicador de XP basado en VIP
    async applyVIPXPMultiplier(playerName, baseXP) {
        try {
            const vipStatus = await this.checkVIPStatus(playerName);
            
            if (!vipStatus) {
                return baseXP; // Sin VIP, XP normal
            }

            let multiplier = 1.0;
            switch (vipStatus.vip_type) {
                case 'VIP':
                    multiplier = 1.5;
                    break;
                case 'ULTRA_VIP':
                    multiplier = 2.0;
                    break;
                default:
                    multiplier = 1.0;
            }

            const bonusXP = Math.floor(baseXP * multiplier);
            
            // Registrar uso del beneficio
            await executeQuery(
                `INSERT INTO vip_benefits_used (player_name, benefit_type, details) 
                 VALUES (?, ?, ?)`,
                [playerName, 'XP_MULTIPLIER', `XP: ${baseXP} → ${bonusXP} (x${multiplier})`]
            );

            return bonusXP;
        } catch (error) {
            console.error('❌ Error aplicando multiplicador XP:', error);
            return baseXP; // Fallback a XP normal en caso de error
        }
    }

    // Verificar si un jugador puede usar un comando VIP
    async canUseVIPCommand(playerName, command) {
        try {
            const vipStatus = await this.checkVIPStatus(playerName);
            
            if (!vipStatus) {
                return false;
            }

            const availableCommands = this.vipCommands[vipStatus.vip_type] || [];
            return availableCommands.includes(command);
        } catch (error) {
            console.error('❌ Error verificando comando VIP:', error);
            return false;
        }
    }

    // Obtener información de beneficios VIP
    getVIPBenefits(vipType) {
        return this.vipBenefits[vipType] || null;
    }

    // Limpiar VIPs expirados
  async cleanupExpiredVIPs() {
    try {
      // Obtener VIPs expirados antes de limpiar
      const expiredVIPs = await executeQuery(
          `SELECT auth_id, player_name, vip_type FROM vip_memberships 
           WHERE expiry_date IS NOT NULL 
           AND expiry_date <= NOW() 
           AND is_active = TRUE`
      );

      if (expiredVIPs.length === 0) {
        return { expiredCount: 0, message: 'No hay VIPs expirados para limpiar' };
      }

      // Usar transacción para limpiar VIPs expirados
      const queries = [
        {
          query: `UPDATE vip_memberships 
                 SET is_active = FALSE 
                 WHERE expiry_date IS NOT NULL 
                 AND expiry_date <= NOW() 
                 AND is_active = TRUE`,
          params: []
        },
        {
          query: `UPDATE jugadores 
                 SET esVIP = 0, fechaVIP = NULL 
                 WHERE auth_id IN (
                     SELECT auth_id FROM vip_memberships 
                     WHERE expiry_date IS NOT NULL 
                     AND expiry_date <= NOW() 
                     AND is_active = FALSE
                 )`,
          params: []
        }
      ];

      await executeTransaction(queries);

            console.log(`🧹 ${expiredVIPs.length} VIPs expirados limpiados automáticamente`);
            return {
                expiredCount: expiredVIPs.length,
                expiredVIPs: expiredVIPs,
                message: `${expiredVIPs.length} VIPs expirados limpiados`
            };
        } catch (error) {
            console.error('❌ Error limpiando VIPs expirados:', error);
            throw error;
        }
    }

    // Generar reporte de actividad VIP
    async generateVIPReport() {
        try {
            const queries = [
                // Total VIPs activos
                `SELECT COUNT(*) as count FROM vip_memberships 
                 WHERE is_active = TRUE 
                 AND (expiry_date IS NULL OR expiry_date > NOW())`,
                
                // VIPs por tipo
                `SELECT vm.vip_type, COUNT(*) as count, vt.color
                 FROM vip_memberships vm
                 JOIN vip_types vt ON vm.vip_type = vt.type_name
                 WHERE vm.is_active = TRUE 
                 AND (vm.expiry_date IS NULL OR vm.expiry_date > NOW())
                 GROUP BY vm.vip_type`,
                
                // Concesiones recientes (últimos 7 días)
                `SELECT player_name, vip_type, granted_by, granted_date, vt.color
                 FROM vip_memberships vm
                 JOIN vip_types vt ON vm.vip_type = vt.type_name
                 WHERE vm.granted_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                 ORDER BY vm.granted_date DESC
                 LIMIT 10`
            ];

            const [activeCount, vipsByType, recentGrants] = await Promise.all([
                executeQuery(queries[0]),
                executeQuery(queries[1]),
                executeQuery(queries[2])
            ]);

            return {
                totalActiveVIPs: activeCount[0].count,
                vipsByType: vipsByType,
                recentGrants: recentGrants,
                generatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Error generando reporte VIP:', error);
            throw error;
        }
    }
}

module.exports = VIPSystem;
