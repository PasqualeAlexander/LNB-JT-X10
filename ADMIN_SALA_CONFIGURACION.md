# 🔐 Configuración de Admin de Sala - Solo SUPER_ADMIN

## 📋 Resumen de Cambios

Se ha configurado el sistema para que **solo los usuarios con rol SUPER_ADMIN (owners)** puedan tener administrador de sala real de Haxball, mientras que los ADMIN_FULL y ADMIN_BASICO solo tienen acceso a los comandos del bot.

---

## 🎯 Configuración Actual

### 👑 **SUPER_ADMIN (Owner)**
- ✅ **Admin de sala de Haxball**: Pueden pausar, mover jugadores, etc.
- ✅ **Comandos del bot**: Acceso completo a todos los comandos
- ✅ **Reclamar admin**: Pueden usar el botón de "Claim Admin" de Haxball
- ✅ **Color de admin**: Nombre aparece en rojo (admin nativo de Haxball)

### 🛡️ **ADMIN_FULL** 
- ❌ **Admin de sala de Haxball**: NO pueden usar funciones nativas de Haxball
- ✅ **Comandos del bot**: Acceso completo a comandos del bot (!kick, !mute, !pw, etc.)
- ❌ **Reclamar admin**: No pueden usar "Claim Admin" - se les quita automáticamente
- ⚪ **Color normal**: Nombre aparece en blanco (jugador normal)

### ⚖️ **ADMIN_BASICO**
- ❌ **Admin de sala de Haxball**: NO pueden usar funciones nativas de Haxball
- ✅ **Comandos del bot**: Acceso a comandos básicos de moderación
- ❌ **Reclamar admin**: No pueden usar "Claim Admin" - se les quita automáticamente
- ⚪ **Color normal**: Nombre aparece en blanco (jugador normal)

---

## 🛠️ Funciones Implementadas

### 1. **Restricción en !claim**
```javascript
// Solo SUPER_ADMIN obtiene admin de sala
if (rolAsignado === "SUPER_ADMIN") {
    room.setPlayerAdmin(jugador.id, true); // Admin real
} else {
    // ADMIN_FULL y ADMIN_BASICO solo funciones internas
    adminActual = jugador; // Solo para comandos del bot
}
```

### 2. **Control de "Claim Admin" de Haxball**
```javascript
room.onPlayerAdminChange = function(jugador, esByJugador) {
    if (esByJugador) {
        const esSuperAdmin = rolJugador && rolJugador.role === "SUPER_ADMIN";
        
        if (!esSuperAdmin) {
            // Remover admin si no es SUPER_ADMIN
            room.setPlayerAdmin(jugador.id, false);
            // Mostrar mensaje explicativo
        }
    }
};
```

### 3. **Verificación Periódica de Seguridad**
- **Frecuencia**: Cada 30 segundos
- **Función**: Detecta si alguien que no es SUPER_ADMIN tiene admin de sala
- **Acción**: Remueve el admin automáticamente

---

## 📊 Diferencias Clave

| Característica | SUPER_ADMIN | ADMIN_FULL | ADMIN_BASICO |
|---------------|-------------|------------|--------------|
| **Admin de Sala** | ✅ Sí | ❌ No | ❌ No |
| **Pausar Partido** | ✅ Nativo | ❌ No | ❌ No |
| **Mover Jugadores** | ✅ Nativo | ❌ No | ❌ No |
| **Cambiar Equipos** | ✅ Nativo | ❌ No | ❌ No |
| **Comandos !kick** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Comandos !mute** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Comandos !pw** | ✅ Sí | ✅ Sí | ❌ No |
| **Color de Nombre** | 🔴 Rojo | ⚪ Blanco | ⚪ Blanco |

---

## 🔒 Funciones de Seguridad

### **Anti-Bypass**
- Verificación cada 30 segundos
- Detección automática de admin no autorizado
- Remoción inmediata de admin
- Logs de seguridad detallados

### **Mensajes Explicativos**
- Los ADMIN_FULL/BASICO reciben mensajes claros explicando por qué no pueden tener admin de sala
- Se les informa que solo tienen funciones del bot

---

## 🚨 Logs de Seguridad

### **Admin Otorgado (SUPER_ADMIN)**
```
👑 Admin de sala otorgado a SUPER_ADMIN: NombreJugador
```

### **Admin Denegado (ADMIN_FULL/BASICO)**
```
🚨 Jugador sin rol SUPER_ADMIN intentó reclamar admin de sala: NombreJugador
🛡️ Funciones de admin otorgadas (sin admin de sala) a ADMIN_FULL: NombreJugador
```

### **Detección de Seguridad**
```
🚨 SEGURIDAD: Detectado admin no autorizado NombreJugador, removiendo...
```

---

## ✅ Beneficios

1. **Mayor Control**: Solo los owners reales pueden usar funciones nativas de Haxball
2. **Seguridad Mejorada**: Previene que otros admins abusen de funciones de sala
3. **Claridad de Roles**: Diferencia clara entre admin de sala vs admin de bot
4. **Funcionalidad Mantenida**: ADMIN_FULL y ADMIN_BASICO siguen pudiendo hacer su trabajo
5. **Anti-Bypass**: Sistema automático que previene intentos de saltarse las restricciones

---

## 🎮 Experiencia del Usuario

- **Owners**: Experiencia completa, pueden usar todo
- **ADMIN_FULL**: Pueden hacer todo su trabajo de moderación via comandos
- **ADMIN_BASICO**: Funciones básicas de moderación via comandos  
- **Jugadores**: No notan diferencia, siguen siendo moderados efectivamente

El sistema mantiene toda la funcionalidad de moderación pero restringe las funciones más críticas a los verdaderos owners de la sala.