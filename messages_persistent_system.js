/* 
* ==================== SISTEMA DE PERSISTENCIA DE MENSAJES PERSONALIZADOS ====================
* Sistema para mantener mensajes personalizados de gol y asistencias entre desconexiones
* usando authID como identificador único
* =====================================================
*/

const fs = require('fs');
const path = require('path');

// Helper function para verificar auth válido
const tieneAuth = (auth) => (typeof auth === 'string' && auth.length > 0);

class MessagesPersistentSystem {
    constructor() {
        this.isNode = typeof window === 'undefined';
        this.messagesFilePath = this.isNode ? path.join(__dirname, 'persistent_messages.json') : null;
        this.messages = new Map(); // {authID: {gol: "mensaje", asistencia: "mensaje", createdAt, lastUsed, playerName}}
        
        // Cargar mensajes existentes
        this.loadMessages();
        
        console.log('✅ Sistema de persistencia de mensajes inicializado');
    }
    
    /**
     * Cargar mensajes desde archivo JSON
     */
    loadMessages() {
        try {
            if (this.isNode && fs.existsSync(this.messagesFilePath)) {
                const data = fs.readFileSync(this.messagesFilePath, 'utf8');
                const messagesObject = JSON.parse(data);
                
                // Convertir objeto a Map
                for (const [authID, messageData] of Object.entries(messagesObject)) {
                    this.messages.set(authID, messageData);
                }
                
                console.log(`📁 Cargados ${this.messages.size} conjuntos de mensajes persistentes desde ${this.messagesFilePath}`);
            } else {
                console.log('📂 No existe archivo de mensajes previo - empezando con sistema limpio');
            }
        } catch (error) {
            console.error('❌ Error cargando mensajes persistentes:', error);
            this.messages = new Map(); // Empezar limpio si hay error
        }
    }
    
    /**
     * Guardar mensajes en archivo JSON
     */
    saveMessages() {
        try {
            if (!this.isNode || !this.messagesFilePath) {
                console.warn('⚠️ Sistema de archivos no disponible en browser');
                return false;
            }
            
            // Convertir Map a objeto para JSON
            const messagesObject = {};
            for (const [authID, messageData] of this.messages.entries()) {
                messagesObject[authID] = messageData;
            }
            
            // Crear directorio si no existe
            const dir = path.dirname(this.messagesFilePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            // ESCRITURA ATÓMICA: escribir a archivo temporal primero
            const tempFilePath = this.messagesFilePath + '.tmp';
            const jsonData = JSON.stringify(messagesObject, null, 2);
            
            // Escribir a archivo temporal
            fs.writeFileSync(tempFilePath, jsonData, 'utf8');
            
            // Renombrar atómicamente (esto previene corrupción)
            fs.renameSync(tempFilePath, this.messagesFilePath);
            
            console.log(`💾 Mensajes persistentes guardados atómicamente: ${this.messages.size} conjuntos`);
            return true;
        } catch (error) {
            console.error('❌ Error guardando mensajes persistentes:', error);
            
            // Limpiar archivo temporal si existe
            try {
                const tempFilePath = this.messagesFilePath + '.tmp';
                if (this.messagesFilePath && fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            } catch (cleanupError) {
                console.error('❌ Error limpiando archivo temporal:', cleanupError);
            }
            
            return false;
        }
    }
    
    /**
     * Establecer mensaje personalizado para un jugador
     * @param {string} authID - Auth ID del jugador (puede ser null)
     * @param {string} tipo - Tipo de mensaje ('gol' o 'asistencia')
     * @param {string} mensaje - El mensaje personalizado
     * @param {string} playerName - Nombre del jugador
     * @param {Object} alternativeIds - Identificadores alternativos (playerID, connID, etc.)
     */
    setMessage(authID, tipo, mensaje, playerName, alternativeIds = {}) {
        // Generar clave de identificación - preferir authID válido, sino usar fallback
        let identificadorKey = authID;
        if (!tieneAuth(authID)) {
            // Usar identificador alternativo basado en playerID y nombre
            identificadorKey = `fallback_${alternativeIds.playerID}_${playerName}`;
            console.log(`🔄 setMessage: Usando identificador alternativo para ${playerName}: ${identificadorKey}`);
        }
        
        // Validar tipo de mensaje
        if (tipo !== 'gol' && tipo !== 'asistencia') {
            console.warn(`⚠️ setMessage: Tipo de mensaje inválido: ${tipo}`);
            return { ok: false, reason: 'INVALID_TYPE' };
        }
        
        // Validar longitud del mensaje
        if (!mensaje || mensaje.trim().length === 0) {
            console.warn(`⚠️ setMessage: Mensaje vacío para ${playerName}`);
            return { ok: false, reason: 'EMPTY_MESSAGE' };
        }
        
        if (mensaje.length > 50) {
            console.warn(`⚠️ setMessage: Mensaje muy largo para ${playerName}: ${mensaje.length} caracteres`);
            return { ok: false, reason: 'MESSAGE_TOO_LONG' };
        }
        
        // Obtener mensajes existentes o crear nuevos
        let messageData = this.messages.get(identificadorKey);
        if (!messageData) {
            messageData = {
                createdAt: Date.now(),
                playerName: playerName
            };
        }
        
        // Actualizar mensaje específico
        messageData[tipo] = mensaje.trim();
        messageData.lastUsed = Date.now();
        messageData.playerName = playerName; // Actualizar nombre por si cambió
        
        // Guardar en Map
        this.messages.set(identificadorKey, messageData);
        
        console.log(`💬 Mensaje ${tipo} configurado persistentemente: ${playerName} (${identificadorKey}) -> "${mensaje}"`);
        
        // Guardar inmediatamente
        this.saveMessages();
        
        return { ok: true };
    }
    
    /**
     * Obtener mensajes de un jugador
     * @param {string} authID - Auth ID del jugador
     * @param {string} playerName - Nombre del jugador (usado como fallback)
     * @param {Object} alternativeIds - Identificadores alternativos
     */
    getMessages(authID, playerName = null, alternativeIds = {}) {
        // Método preferido: buscar por authID
        if (tieneAuth(authID) && this.messages.has(authID)) {
            return this.messages.get(authID);
        }
        
        // Método alternativo: buscar por identificador fallback
        if (playerName && alternativeIds.playerID) {
            const fallbackKey = `fallback_${alternativeIds.playerID}_${playerName}`;
            if (this.messages.has(fallbackKey)) {
                console.log(`🔄 Mensajes encontrados por identificador alternativo: ${playerName}`);
                return this.messages.get(fallbackKey);
            }
        }
        
        return null;
    }
    
    /**
     * Obtener mensaje específico de un jugador
     * @param {string} authID - Auth ID del jugador
     * @param {string} tipo - Tipo de mensaje ('gol' o 'asistencia')
     * @param {string} playerName - Nombre del jugador (usado como fallback)
     * @param {Object} alternativeIds - Identificadores alternativos
     */
    getMessage(authID, tipo, playerName = null, alternativeIds = {}) {
        const messageData = this.getMessages(authID, playerName, alternativeIds);
        if (!messageData) {
            return null;
        }
        
        return messageData[tipo] || null;
    }
    
    /**
     * Verificar si un jugador tiene mensajes configurados
     * @param {string} authID - Auth ID del jugador
     * @param {string} playerName - Nombre del jugador (usado como fallback)
     * @param {Object} alternativeIds - Identificadores alternativos
     */
    hasMessages(authID, playerName = null, alternativeIds = {}) {
        const messageData = this.getMessages(authID, playerName, alternativeIds);
        return messageData && (messageData.gol || messageData.asistencia);
    }
    
    /**
     * Eliminar mensaje específico de un jugador
     * @param {string} authID - Auth ID del jugador
     * @param {string} tipo - Tipo de mensaje ('gol' o 'asistencia') o 'all' para todos
     * @param {string} playerName - Nombre del jugador (usado como fallback)
     * @param {Object} alternativeIds - Identificadores alternativos
     */
    removeMessage(authID, tipo, playerName = null, alternativeIds = {}) {
        // Determinar la clave a usar
        let identificadorKey = authID;
        if (!tieneAuth(authID) && playerName && alternativeIds.playerID) {
            identificadorKey = `fallback_${alternativeIds.playerID}_${playerName}`;
        }
        
        const messageData = this.messages.get(identificadorKey);
        if (!messageData) {
            return false;
        }
        
        if (tipo === 'all') {
            // Eliminar todos los mensajes del jugador
            this.messages.delete(identificadorKey);
            console.log(`🗑️ Todos los mensajes eliminados para: ${identificadorKey}`);
        } else if (tipo === 'gol' || tipo === 'asistencia') {
            // Eliminar mensaje específico
            delete messageData[tipo];
            
            // Si no quedan mensajes, eliminar entrada completa
            if (!messageData.gol && !messageData.asistencia) {
                this.messages.delete(identificadorKey);
                console.log(`🗑️ Últimos mensajes eliminados para: ${identificadorKey}`);
            } else {
                messageData.lastUsed = Date.now();
                console.log(`🗑️ Mensaje ${tipo} eliminado para: ${identificadorKey}`);
            }
        } else {
            return false;
        }
        
        this.saveMessages();
        return true;
    }
    
    /**
     * Actualizar última actividad del jugador
     * @param {string} authID - Auth ID del jugador
     * @param {string} playerName - Nombre actual del jugador
     * @param {Object} alternativeIds - Identificadores alternativos
     */
    updateLastUsed(authID, playerName, alternativeIds = {}) {
        // Determinar la clave a usar
        let identificadorKey = authID;
        if (!tieneAuth(authID) && playerName && alternativeIds.playerID) {
            identificadorKey = `fallback_${alternativeIds.playerID}_${playerName}`;
        }
        
        const messageData = this.messages.get(identificadorKey);
        if (messageData) {
            messageData.lastUsed = Date.now();
            messageData.playerName = playerName; // Actualizar nombre por si cambió
            // No guardar inmediatamente para evitar writes excesivos
        }
    }
    
    /**
     * Obtener lista de todos los mensajes (para administración)
     */
    getAllMessages() {
        const messagesList = [];
        for (const [authID, messageData] of this.messages.entries()) {
            messagesList.push({
                authID: authID,
                ...messageData
            });
        }
        
        // Ordenar por fecha de último uso (más recientes primero)
        messagesList.sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0));
        
        return messagesList;
    }
    
    /**
     * Limpiar mensajes antiguos (opcional - para mantenimiento)
     * @param {number} daysOld - Días de antigüedad para considerar obsoleto
     */
    cleanOldMessages(daysOld = 365) {
        const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        let cleaned = 0;
        
        for (const [authID, messageData] of this.messages.entries()) {
            const lastActivity = messageData.lastUsed || messageData.createdAt || 0;
            if (lastActivity < cutoffDate) {
                this.messages.delete(authID);
                cleaned++;
                console.log(`🧹 Removidos mensajes obsoletos: ${messageData.playerName} (${daysOld} días sin uso)`);
            }
        }
        
        if (cleaned > 0) {
            this.saveMessages();
            console.log(`✅ Limpieza de mensajes completada: ${cleaned} conjuntos obsoletos removidos`);
        }
        
        return cleaned;
    }
    
    /**
     * Obtener estadísticas del sistema
     */
    getStats() {
        const stats = {
            totalUsers: this.messages.size,
            usersWithGolMessages: 0,
            usersWithAsistenciaMessages: 0,
            usersWithBothMessages: 0
        };
        
        for (const messageData of this.messages.values()) {
            const hasGol = !!messageData.gol;
            const hasAsistencia = !!messageData.asistencia;
            
            if (hasGol) stats.usersWithGolMessages++;
            if (hasAsistencia) stats.usersWithAsistenciaMessages++;
            if (hasGol && hasAsistencia) stats.usersWithBothMessages++;
        }
        
        return stats;
    }
}

// Crear instancia global
const messagesPersistentSystem = new MessagesPersistentSystem();

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MessagesPersistentSystem,
        messagesPersistentSystem
    };
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.messagesPersistentSystem = messagesPersistentSystem;
} else {
    global.messagesPersistentSystem = messagesPersistentSystem;
}
