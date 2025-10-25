# 💬 Sistema de Chat Visual - Prefijos y Colores

## 🎨 Cómo se ve en el chat

### 📋 Jerarquía de Rangos

| Rango | Prefijo | Nombre Mostrado | Color | Prioridad |
|-------|---------|-----------------|-------|-----------|
| **OWNER** | 👑 | `👑 OWNER NombreUsuario` | Rojo `#FF0000` | 10 |
| **ADMIN** | ⭐ | `⭐ ADMIN NombreUsuario` | Naranja `#FF8C00` | 9 |
| **MODERADOR** | 🛡️ | `🛡️ MOD NombreUsuario` | Azul `#1E90FF` | 8 |
| **ULTRA VIP** | 👑 | `👑 ULTRA VIP NombreUsuario` | Púrpura `#9932CC` | 7 |
| **VIP** | 💎 | `💎 VIP NombreUsuario` | Turquesa `#00CED1` | 6 |
| **JUGADOR** | - | `NombreUsuario` | Blanco `#FFFFFF` | 1 |

---

## 💬 Ejemplos de Mensajes en Chat

```
👑 OWNER AlexaOwner: ¡Hola a todos! Servidor funcionando perfectamente.
⭐ ADMIN AdminPrincipal: ¿Todo bien por aquí?
🛡️ MOD Moderador1: Vigilando que todo esté en orden.
👑 ULTRA VIP Premium_Player: ¡Genial partida!
💎 VIP Donador123: Buenos días a todos.
JugadorNormal: Hola mundo, ¿alguien quiere jugar?
NuevoJugador: ¿Cómo se usa este bot?
```

---

## 🎉 Mensajes de Bienvenida

### Owner
```
👑 ¡Bienvenido OWNER AlexaOwner! Tienes control total del servidor.
```

### Admin
```
⭐ ¡Bienvenido ADMIN AdminPrincipal! Tienes permisos administrativos.
```

### Moderador
```
🛡️ ¡Bienvenido MOD Moderador1! Ayuda a mantener el orden.
```

### Ultra VIP
```
👑 ¡Bienvenido Ultra VIP Premium_Player! Disfruta de todos los beneficios premium.
```

### VIP
```
💎 ¡Bienvenido VIP Donador123! Disfruta de tus beneficios especiales.
```

### Jugador Normal
```
⚽ ¡Bienvenido NuevoJugador! Disfruta del juego.
```

---

## 🔧 Comandos Disponibles

### Para Todos los Usuarios

#### `!online` o `!users`
Muestra lista de usuarios online con sus rangos:

```
👥 Usuarios Online:

👑 OWNERS:
  • AlexaOwner

⭐ ADMINS:
  • AdminPrincipal
  • OtroAdmin

🛡️ MODS:
  • Moderador1
  • StaffActivo

👑 ULTRA VIPS:
  • Premium_Player

💎 VIPS:
  • Donador123
  • VipActivo

⚽ JUGADORES:
  • JugadorNormal
  • NuevoJugador
  • Invitado
```

#### `!myrank`
Muestra tu rango actual:

```
👑 Tu rango: 👑 OWNER                    (para owner)
⭐ Tu rango: ⭐ ADMIN                     (para admin)
🛡️ Tu rango: 🛡️ MOD                      (para moderador)
👑 Tu rango: 👑 ULTRA VIP                (para ultra vip)
💎 Tu rango: 💎 VIP                      (para vip)
Tu rango: Jugador                        (para jugador normal)
```

### Para Admins/Owners

#### `!giverank <jugador> <rango>`
Otorga un rango a un jugador:

```
Uso: !giverank JugadorNuevo ADMIN
Resultado: ✅ ⭐ JugadorNuevo ahora es ADMIN

Rangos disponibles: OWNER, ADMIN, MODERADOR
```

#### `!removerank <jugador>`
Remueve el rango de un jugador:

```
Uso: !removerank ExAdmin
Resultado: ✅ Rango removido de ExAdmin
```

---

## ⚙️ Configuración

### Modificar Usuarios Especiales

En `chat_system.js`, edita la sección `specialUsers`:

```javascript
this.specialUsers = {
    // Owners
    'tu_nombre_aqui': 'OWNER',
    'owner_principal': 'OWNER',
    
    // Admins
    'admin1': 'ADMIN',
    'admin_activo': 'ADMIN',
    
    // Moderadores
    'moderador1': 'MODERADOR',
    'staff_helper': 'MODERADOR'
};
```

### Personalizar Colores y Prefijos

```javascript
this.userRanks = {
    OWNER: {
        prefix: "👑",
        name: "OWNER",
        color: 0xFF0000, // Rojo
        priority: 10
    },
    // ... otros rangos
};
```

---

## 🎯 Colores en Hexadecimal

- **👑 OWNER**: `#FF0000` (Rojo brillante)
- **⭐ ADMIN**: `#FF8C00` (Naranja)
- **🛡️ MOD**: `#1E90FF` (Azul)
- **👑 ULTRA VIP**: `#9932CC` (Púrpura)
- **💎 VIP**: `#00CED1` (Turquesa)
- **⚽ JUGADOR**: `#FFFFFF` (Blanco)

---

## 📱 Funcionalidades Integradas

### Sistema VIP Automático
- Los VIPs otorgados con `!givevip` aparecen automáticamente con prefijo 💎
- Los Ultra VIPs otorgados con `!giveultravip` aparecen con prefijo 👑

### Prioridad en Listas
Los usuarios se muestran siempre ordenados por prioridad:
1. Owners (👑)
2. Admins (⭐)
3. Moderadores (🛡️)
4. Ultra VIPs (👑)
5. VIPs (💎)
6. Jugadores normales

### Detección Automática
- El sistema detecta automáticamente el rango más alto del usuario
- Si alguien es ADMIN y VIP, se muestra como ADMIN
- Los rangos especiales (OWNER/ADMIN/MOD) tienen prioridad sobre VIP

---

## 🔄 Integración Completa

### En tu bot principal:

```javascript
const BotWithChatSystem = require('./chat_integration_example');
const bot = new BotWithChatSystem(db);

// Eventos básicos
room.onPlayerChat = (player, message) => {
    bot.handlePlayerChat(room, player, message);
};

room.onPlayerJoin = (player) => {
    bot.handlePlayerJoin(room, player);
};

// Configurar admins dinámicamente
bot.chatSystem.addSpecialUser('nuevo_admin', 'ADMIN');
```

---

## 🎮 Ejemplos de Conversaciones

### Conversación Típica:
```
👑 OWNER ServerOwner: ¡Bienvenidos al servidor LNB!
⭐ ADMIN Helper: Todo funcionando perfecto.
🛡️ MOD Vigilante: Reportando actividad normal.
👑 ULTRA VIP Premium: ¡Excelente bot!
💎 VIP Supporter: Gracias por los beneficios.
PlayerOne: ¿Cómo consigo VIP?
PlayerTwo: !vipbenefits para ver las ventajas

👑 OWNER ServerOwner: Puedes donar o participar en eventos.
⭐ ADMIN Helper: !givevip PlayerOne 7 Nuevo participante
Bot: ✅ 💎 PlayerOne ahora es VIP por 7 días

💎 VIP PlayerOne: ¡Genial! ¡Gracias!
```

### Uso de Comandos:
```
JugadorCurioso: !online

Bot: 👥 Usuarios Online:

👑 OWNERS:
  • ServerOwner

⭐ ADMINS:
  • Helper

🛡️ MODS:
  • Vigilante

👑 ULTRA VIPS:
  • Premium

💎 VIPS:
  • Supporter
  • PlayerOne

⚽ JUGADORES:
  • JugadorCurioso
  • PlayerTwo
```

---

## ✨ Resultado Visual Final

Con este sistema, tu chat se verá **profesional y organizado**, donde cada usuario tiene su lugar claramente identificado, creando una **jerarquía visual clara** que mejora la experiencia de todos los jugadores.

¡Los colores y prefijos hacen que sea fácil identificar quién puede ayudar, quién tiene beneficios especiales, y quién administra el servidor! 🎉
