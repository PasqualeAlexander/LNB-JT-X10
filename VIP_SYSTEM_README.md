# 💎👑 Sistema VIP y Ultra VIP para Bot LNB

## 📋 Descripción

Sistema completo de membresías VIP y Ultra VIP para tu bot de Haxball, que incluye beneficios diferenciados, comandos de administración, y gestión automática de privilegios.

## 🏗️ Características del Sistema

### 🆔 Tipos de VIP

| Tipo | Icono | Nivel | Multiplicador XP | Beneficios |
|------|-------|-------|------------------|------------|
| **VIP** | 💎 | 1 | x1.5 | Comandos especiales, estadísticas detalladas |
| **Ultra VIP** | 👑 | 2 | x2.0 | Comandos exclusivos, funciones premium avanzadas |

### ✨ Beneficios VIP (💎)

- 🎨 Colores especiales en chat
- ⚡ XP multiplicado x1.5
- 📊 Estadísticas detalladas
- 🎯 Comando !record personal
- 🔄 Prioridad en auto-balance

### 🌟 Beneficios Ultra VIP (👑)

- 🌈 **Todos los beneficios VIP**
- 🔥 XP multiplicado x2.0
- 🎮 Comandos de jugador especiales
- 🏆 Acceso a salas VIP exclusivas
- 🎨 Nombres con efectos especiales
- 🔧 Comandos de configuración personal
- 📈 Estadísticas avanzadas
- 🎪 Comandos de diversión exclusivos

## 🔧 Comandos para Administradores/Owners

### Otorgar VIPs

```
!givevip <jugador> [días] [razón]
!addvip <jugador> [días] [razón]
```
**Ejemplos:**
- `!givevip juan` - VIP permanente
- `!givevip maria 30 Donación` - VIP por 30 días
- `!addvip carlos 7 Premio evento` - VIP por 7 días

### Otorgar Ultra VIP

```
!giveultravip <jugador> [días] [razón]
!addultravip <jugador> [días] [razón]
```
**Ejemplos:**
- `!giveultravip ana` - Ultra VIP permanente
- `!giveultravip pedro 15 Staff temporal` - Ultra VIP por 15 días

### Remover VIP

```
!removevip <jugador> [razón]
!delvip <jugador> [razón]
```
**Ejemplos:**
- `!removevip luis Violó reglas`
- `!delvip sofia Solicitud propia`

### Gestión y Consultas

```
!viplist          # Lista todos los VIPs activos
!listvips         # Alias de !viplist

!vipinfo <jugador>    # Info detallada de VIP específico
!checkvip <jugador>   # Alias de !vipinfo

!vipstats         # Estadísticas generales del sistema VIP
!vipreport        # Alias de !vipstats

!vipcleanup       # Limpiar VIPs expirados manualmente
```

## 🎮 Comandos para Usuarios VIP

### Comandos Básicos (Todos los VIPs)

```
!viphelp          # Ayuda y comandos disponibles
!mystatus         # Tu estado VIP actual
!vipstatus        # Alias de !mystatus
!vipbenefits [tipo]  # Ver beneficios de VIP o Ultra VIP
```

### Comandos VIP Exclusivos (💎)

```
!mystats          # Estadísticas personales detalladas
!myrecord         # Records personales
!playtime         # Tiempo de juego total
```

### Comandos Ultra VIP Exclusivos (👑)

```
!customcolor <color>  # Cambiar color personalizado
!effect <efecto>      # Aplicar efectos al nombre
!premium              # Comandos premium
!exclusive            # Funciones exclusivas
```

**Efectos disponibles:** `sparkle`, `glow`, `rainbow`, `shadow`

## 🔨 Instalación y Configuración

### 1. Archivos del Sistema

Copia estos archivos a tu proyecto:
- `vip_system.js` - Sistema principal VIP
- `vip_commands.js` - Comandos y procesamiento
- `bot_vip_integration.js` - Integración con tu bot

### 2. Integración en tu Bot

En tu archivo `bot.js`:

```javascript
// Importar el sistema VIP
const BotVIPIntegration = require('./bot_vip_integration');

// Después de inicializar la base de datos
const vipBot = new BotVIPIntegration(db);

// En el evento de chat
room.onPlayerChat = async (player, message) => {
    // Procesar comandos VIP
    const vipResponse = await vipBot.handlePlayerMessage(
        player.name, 
        message, 
        player.auth
    );
    
    if (vipResponse) {
        room.sendAnnouncement(vipResponse, player.id);
        return;
    }
    
    // Tu lógica normal del bot...
};

// En el evento de unirse
room.onPlayerJoin = async (player) => {
    const joinResult = await vipBot.onPlayerJoin(player.name, player.auth);
    
    if (joinResult.welcomeMessage) {
        room.sendAnnouncement(joinResult.welcomeMessage, player.id, 0x00FF00);
    }
    
    // Tu lógica normal...
};

// En eventos de gol (XP con bonus VIP)
room.onPlayerGoal = async (player) => {
    const goalResult = await vipBot.onPlayerGoal(player.name, {});
    
    if (goalResult?.xpMessage) {
        room.sendAnnouncement(goalResult.xpMessage, null, 0xFFD700);
    }
    
    // Tu lógica normal...
};
```

### 3. Configurar Administradores

En `vip_commands.js`, modifica la lista de administradores:

```javascript
this.adminAuthorities = [
    'tu_nombre_owner',
    'admin1', 
    'admin2',
    'moderador1'
];
```

### 4. Comandos de Setup (Solo Owners)

```
!vipsetup         # Configurar sistema VIP
!vipmigrate       # Migrar VIPs existentes
!vipbackup        # Crear backup de datos VIP
```

## 🗃️ Estructura de Base de Datos

El sistema crea automáticamente estas tablas:

### `vip_types`
- Tipos de VIP disponibles (VIP, Ultra VIP)
- Niveles, colores, beneficios

### `vip_memberships`
- Membresías VIP activas
- Fechas de otorgamiento y expiración
- Historial de cambios

### `vip_benefits_used`
- Registro de uso de beneficios
- Tracking de multiplicadores XP
- Auditoría de actividad VIP

## 📊 Funcionalidades Avanzadas

### 🔄 Multiplicadores de XP Automáticos

```javascript
// XP normal: 10 puntos por gol
// VIP: 15 puntos por gol (x1.5)
// Ultra VIP: 20 puntos por gol (x2.0)

await vipBot.giveXP(playerName, 10, "Gol anotado");
```


### ⏰ Limpieza Automática

- VIPs expirados se limpian automáticamente cada hora
- Comando manual: `!vipcleanup`

### 📈 Reportes y Estadísticas

```javascript
const report = await vipSystem.generateVIPReport();
// Incluye: total VIPs, por tipo, otorgamientos recientes
```

## 🔍 Ejemplos de Uso

### Scenario 1: Otorgar VIP por Donación

```
Admin: !givevip donador123 30 Donación $10
Bot: ✅ 💎 donador123 ahora es VIP por 30 días

donador123: !viphelp
Bot: 💎 Ayuda VIP:
🎯 Comandos disponibles:
• !myrecord
• !mystats  
• !playtime
• !viphelp
✨ Beneficios:
• 🎨 Colores especiales en chat
• ⚡ XP multiplicado x1.5
• 📊 Estadísticas detalladas
...
```

### Scenario 2: Promoción a Ultra VIP

```
Owner: !giveultravip moderador_activo Promoción a staff
Bot: ✅ 👑 moderador_activo ahora es ULTRA_VIP permanentemente

moderador_activo: !mystatus
Bot: 👑 Tu estado VIP:
🔹 Tipo: ULTRA_VIP
📅 Desde: 18/8/2025
⏰ Permanente
🎮 Usa !viphelp para ver comandos
```

### Scenario 3: Verificar Estado VIP

```
Admin: !vipinfo juan_vip
Bot: 📋 Info VIP de juan_vip:
💎 Tipo: VIP
📅 Otorgado: 10/8/2025
⏰ Expira: 10/9/2025
👤 Por: admin_principal
📝 Razón: Premio evento
```

## 🚀 Beneficios del Sistema

### Para Administradores:
- ✅ Gestión fácil desde el chat
- ✅ Control de permisos granular
- ✅ Historial completo de cambios
- ✅ Reportes y estadísticas automáticas
- ✅ Backup y migración de datos

### Para Jugadores VIP:
- ✅ Beneficios tangibles (XP, comandos exclusivos)
- ✅ Comandos especiales útiles
- ✅ Reconocimiento visual en el juego
- ✅ Experiencia de juego mejorada

### Para el Servidor:
- ✅ Incentivo para donaciones/participación
- ✅ Sistema de recompensas escalable
- ✅ Retención de jugadores VIP
- ✅ Base de datos organizada y eficiente

## 🛠️ Personalización

### Agregar Nuevos Beneficios VIP

En `vip_system.js`:

```javascript
this.vipBenefits = {
    VIP: {
        benefits: [
            "🎨 Colores especiales en chat",
            "🆕 Tu nuevo beneficio aquí"
        ]
    }
};
```

### Crear Comandos VIP Personalizados

En `vip_commands.js`:

```javascript
case 'micomando':
    return await this.handleMiComando(args, playerName);

async handleMiComando(args, playerName) {
    const canUse = await this.vipSystem.canUseVIPCommand(playerName, '!micomando');
    if (!canUse) {
        return "❌ Este comando es exclusivo para VIPs.";
    }
    
    return "✅ ¡Comando VIP ejecutado!";
}
```

### Modificar Multiplicadores XP

En `vip_system.js`:

```javascript
switch (vipStatus.vip_type) {
    case 'VIP':
        multiplier = 1.8; // Cambiar de 1.5 a 1.8
        break;
    case 'ULTRA_VIP':
        multiplier = 2.5; // Cambiar de 2.0 a 2.5
        break;
}
```

## 📞 Soporte y Troubleshooting

### Problemas Comunes:

**Error: "Jugador no encontrado"**
- El jugador debe estar registrado en la tabla `jugadores`
- Usar el nombre exacto (case-sensitive)

**VIPs no reciben bonus XP**
- Verificar integración en eventos de gol/asistencia
- Comprobar que se llama a `vipBot.giveXP()`

**Comandos de admin no funcionan**
- Verificar nombre en `adminAuthorities`
- Usar nombre exacto del jugador admin

### Debug:

```javascript
// Verificar estado VIP de un jugador
const status = await vipBot.checkVIPStatus("nombre_jugador");
console.log("Estado VIP:", status);

// Ver todos los VIPs
const vips = await vipBot.getVIPPlayersList();
console.log("VIPs activos:", vips);
```

---

## 🎉 ¡Tu sistema VIP está listo!

Con este sistema tendrás un control completo sobre los privilegios VIP en tu servidor de Haxball, incentivando la participación y creando una experiencia diferenciada para tus jugadores más comprometidos.

**¿Preguntas o necesitas ayuda?** ¡Consulta este README o revisa los comentarios en el código!
