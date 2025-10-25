/* 
* ==================== SISTEMA DE PERSISTENCIA DE ROLES ====================
* Sistema para mantener roles de administradores/owners entre desconexiones
* usando authID como identificador único
* =====================================================
*/

const fs = require('fs');
const path = require('path');

// Helper function para verificar auth válido
const tieneAuth = (auth) => (typeof auth === 'string' && auth.length > 0);

class RolesPersistentSystem {
    constructor() {
        this.isNode = typeof window === 'undefined';
        this.rolesFilePath = this.isNode ? path.join(__dirname, 'persistent_roles.json') : null;
        this.roles = new Map(); // {authID: {role, assignedAt, assignedBy, playerName}}
        
        // Cargar roles existentes
        this.loadRoles();
        
        console.log('✅ Sistema de persistencia de roles inicializado');
    }
    
    /**
     * Cargar roles desde archivo JSON
     */
    loadRoles() {
        try {
            if (this.isNode && fs.existsSync(this.rolesFilePath)) {
                const data = fs.readFileSync(this.rolesFilePath, 'utf8');
                const rolesObject = JSON.parse(data);
                
                // Convertir objeto a Map
                for (const [authID, roleData] of Object.entries(rolesObject)) {
                    this.roles.set(authID, roleData);
                }
                
                console.log(`📁 Cargados ${this.roles.size} roles persistentes desde ${this.rolesFilePath}`);
            } else {
                console.log('📂 No existe archivo de roles previo - empezando con sistema limpio');
            }
        } catch (error) {
            console.error('❌ Error cargando roles persistentes:', error);
            this.roles = new Map(); // Empezar limpio si hay error
        }
    }
    
    /**
     * Guardar roles en archivo JSON
     */
    saveRoles() {
        try {
            if (!this.isNode || !this.rolesFilePath) {
                console.warn('⚠️ Sistema de archivos no disponible en browser');
                return false;
            }
            
            // Convertir Map a objeto para JSON
            const rolesObject = {};
            for (const [authID, roleData] of this.roles.entries()) {
                rolesObject[authID] = roleData;
            }
            
            // Crear directorio si no existe
            const dir = path.dirname(this.rolesFilePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            // ESCRITURA ATÓMICA: escribir a archivo temporal primero
            const tempFilePath = this.rolesFilePath + '.tmp';
            const jsonData = JSON.stringify(rolesObject, null, 2);
            
            // Escribir a archivo temporal
            fs.writeFileSync(tempFilePath, jsonData, 'utf8');
            
            // Renombrar atómicamente (esto previene corrupción)
            fs.renameSync(tempFilePath, this.rolesFilePath);
            
            console.log(`💾 Roles persistentes guardados atómicamente: ${this.roles.size} roles`);
            return true;
        } catch (error) {
            console.error('❌ Error guardando roles persistentes:', error);
            
            // Limpiar archivo temporal si existe
            try {
                const tempFilePath = this.rolesFilePath + '.tmp';
                if (this.rolesFilePath && fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            } catch (cleanupError) {
                console.error('❌ Error limpiando archivo temporal:', cleanupError);
            }
            
            return false;
        }
    }
    
    /**
     * Asignar rol a un jugador
     * @param {string} authID - Auth ID del jugador (puede ser null)
     * @param {string} role - Rol a asignar (SUPER_ADMIN, ADMIN_FULL, ADMIN_BASICO)
     * @param {string} assignedBy - Quién asignó el rol
     * @param {string} playerName - Nombre del jugador
     * @param {Object} alternativeIds - Identificadores alternativos (ip, connID, etc.)
     */
    assignRole(authID, role, assignedBy, playerName, alternativeIds = {}) {
        // Verificar si tenemos auth válido
        if (!tieneAuth(authID)) {
            console.warn(`⚠️ assignRole: AuthID inválido para ${playerName} - authID:`, { type: typeof authID, auth: authID });
            return { ok: false, reason: 'AUTH_REQUIRED' };
        }
        
        const roleData = {
            role: role,
            assignedAt: Date.now(),
            assignedBy: assignedBy,
            playerName: playerName,
            lastSeen: Date.now(),
            alternativeIds: alternativeIds // Almacenar IDs alternativos
        };
        
        // Método preferido: con authID válido
        this.roles.set(authID, roleData);
        console.log(`🔑 Rol asignado persistentemente con authID: ${playerName} (${authID}) -> ${role}`);
        
        // Guardar inmediatamente
        this.saveRoles();
        
        return { ok: true };
    }
    
    /**
     * Obtener rol de un jugador
     * @param {string} authID - Auth ID del jugador (puede ser null)
     * @param {string} playerName - Nombre del jugador (usado como fallback)
     */
    getRole(authID, playerName = null) {
        // Método preferido: buscar por authID
        if (authID && this.roles.has(authID)) {
            return this.roles.get(authID);
        }
        
        // Método alternativo: buscar por nombre cuando no hay authID
        if (playerName) {
            const fallbackKey = `fallback_${playerName}`;
            if (this.roles.has(fallbackKey)) {
                console.log(`🔄 Rol encontrado por nombre fallback: ${playerName}`);
                return this.roles.get(fallbackKey);
            }
            
            // También buscar en roles existentes por nombre de jugador
            for (const [key, roleData] of this.roles.entries()) {
                if (roleData.playerName === playerName && key.startsWith('fallback_')) {
                    console.log(`🔄 Rol encontrado por coincidencia de nombre: ${playerName}`);
                    return roleData;
                }
            }
        }
        
        return null;
    }
    
    /**
     * Verificar si un jugador tiene un rol específico
     * @param {string} authID - Auth ID del jugador (puede ser null)
     * @param {string} role - Rol a verificar
     * @param {string} playerName - Nombre del jugador (usado como fallback)
     */
    hasRole(authID, role, playerName = null) {
        const roleData = this.getRole(authID, playerName);
        return roleData && roleData.role === role;
    }
    
    /**
     * Remover rol de un jugador
     * @param {string} authID - Auth ID del jugador
     */
    removeRole(authID) {
        if (!authID) return false;
        
        const roleData = this.roles.get(authID);
        if (roleData) {
            this.roles.delete(authID);
            this.saveRoles();
            console.log(`🗑️ Rol removido persistentemente: ${roleData.playerName} (${authID})`);
            return true;
        }
        
        return false;
    }
    
    /**
     * Actualizar última conexión del jugador
     * @param {string} authID - Auth ID del jugador
     * @param {string} playerName - Nombre actual del jugador
     */
    updateLastSeen(authID, playerName) {
        const roleData = this.roles.get(authID);
        if (roleData) {
            roleData.lastSeen = Date.now();
            roleData.playerName = playerName; // Actualizar nombre por si cambió
            this.saveRoles();
        }
    }
    
    /**
     * Obtener lista de todos los roles
     */
    getAllRoles() {
        const rolesList = [];
        for (const [authID, roleData] of this.roles.entries()) {
            rolesList.push({
                authID: authID,
                ...roleData
            });
        }
        
        // Ordenar por fecha de asignación (más recientes primero)
        rolesList.sort((a, b) => b.assignedAt - a.assignedAt);
        
        return rolesList;
    }
    
    /**
     * Limpiar roles antiguos (opcional - para mantenimiento)
     * @param {number} daysOld - Días de antigüedad para considerar obsoleto
     */
    cleanOldRoles(daysOld = 180) {
        const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        let cleaned = 0;
        
        for (const [authID, roleData] of this.roles.entries()) {
            if (roleData.lastSeen < cutoffDate) {
                this.roles.delete(authID);
                cleaned++;
                console.log(`🧹 Removido rol obsoleto: ${roleData.playerName} (${daysOld} días sin conexión)`);
            }
        }
        
        if (cleaned > 0) {
            this.saveRoles();
            console.log(`✅ Limpieza completada: ${cleaned} roles obsoletos removidos`);
        }
        
        return cleaned;
    }
    
    /**
     * Obtener estadísticas del sistema
     */
    getStats() {
        const stats = {
            totalRoles: this.roles.size,
            superAdmins: 0,
            adminsFull: 0,
            adminsBasico: 0
        };
        
        for (const roleData of this.roles.values()) {
            switch (roleData.role) {
                case 'SUPER_ADMIN':
                    stats.superAdmins++;
                    break;
                case 'ADMIN_FULL':
                    stats.adminsFull++;
                    break;
                case 'ADMIN_BASICO':
                    stats.adminsBasico++;
                    break;
            }
        }
        
        return stats;
    }
}

// Crear instancia global
const rolesPersistentSystem = new RolesPersistentSystem();

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RolesPersistentSystem,
        rolesPersistentSystem
    };
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.rolesPersistentSystem = rolesPersistentSystem;
} else {
    global.rolesPersistentSystem = rolesPersistentSystem;
}
