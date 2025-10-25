# 📋 ARCHIVOS NECESARIOS PARA EJECUTAR EL BOT

## 🚨 ARCHIVOS ESENCIALES (OBLIGATORIOS)

### 📁 **Archivos de Configuración del Proyecto**
```
package.json                    # ✅ Dependencias y scripts
package-lock.json              # ✅ Lockfile de dependencias (opcional pero recomendado)
.gitignore                     # ✅ Archivos a ignorar por git
README.md                      # ✅ Documentación del proyecto
```

### 🤖 **Archivos Principales del Bot**
```
bot.js                         # ✅ ARCHIVO PRINCIPAL - OBLIGATORIO
BOTLNBCODE.js                 # ✅ Sistema de comandos y mensajes - OBLIGATORIO
```

### 🏗️ **Sistema de Configuración y Base de Datos**
```
config/database.js             # ✅ Configuración MySQL - OBLIGATORIO
database/db_functions.js       # ✅ Funciones de base de datos - OBLIGATORIO
.env.example                   # ✅ Ejemplo de configuración - OBLIGATORIO
```

### 🛠️ **Sistemas Adicionales**
```
new_commands_system.js         # ✅ Sistema moderno de comandos (desbaneo)
chat_system.js                 # ✅ Sistema de chat visual
uid_system_mejorado.js         # ✅ Sistema de UIDs mejorado
vip_system.js                  # ✅ Sistema VIP
vip_commands.js               # ✅ Comandos VIP
bot_vip_integration.js        # ✅ Integración VIP con el bot
```

---

## 📄 **ARCHIVOS QUE DEBE CREAR EL USUARIO**

### 🔐 **Archivo de Configuración Personal**
```
.env                          # ❌ NO INCLUIR EN GIT - Debe crearlo el usuario
```

**Contenido del archivo `.env`:**
```env
# Configuración de Base de Datos MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=lnb_user
DB_PASSWORD=tu_contraseña_aquí
DB_NAME=lnb_estadisticas

# Configuración adicional
NODE_ENV=development
BOT_PORT=3000
API_TOKEN=your_api_token_here
```

---

## 📚 **ARCHIVOS OPCIONALES/INFORMATIVOS**

### 📖 **Documentación**
```
NUEVO_SISTEMA_UNBAN.md        # 📖 Documentación del sistema de desbaneo
VIP_SYSTEM_README.md          # 📖 Documentación del sistema VIP
CHAT_SYSTEM_VISUAL.md         # 📖 Documentación del sistema de chat
admin_limitations.md          # 📖 Limitaciones de admins
```

### 🧪 **Archivos de Testing/Utilidades**
```
test-env.js                   # 🧪 Testing de variables de entorno
test-mysql.js                 # 🧪 Testing de MySQL
verificar_database.js         # 🧪 Verificar estado de BD
verificar_uid_sistema.js      # 🧪 Verificar sistema UID
migrar_uids_sistema.js        # 🧪 Migración de UIDs
scripts/migrate_to_mysql.js   # 🧪 Script de migración a MySQL
```

---

## 🚀 **INSTRUCCIONES DE INSTALACIÓN PARA EL USUARIO**

### 1. **Después de hacer `git pull`:**
```bash
# Instalar dependencias
npm install
```

### 2. **Configurar base de datos:**
```bash
# Crear archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales reales
nano .env  # o usar tu editor preferido
```

### 3. **Configurar MySQL:**
```sql
-- Conectarse a MySQL como root
mysql -u root -p

-- Crear base de datos y usuario
CREATE DATABASE lnb_estadisticas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lnb_user'@'localhost' IDENTIFIED BY 'tu_contraseña_aquí';
GRANT ALL PRIVILEGES ON lnb_estadisticas.* TO 'lnb_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. **Ejecutar el bot:**
```bash
# Producción
npm start

# Desarrollo (con recarga automática)
npm run dev
```

---

## 📂 **ESTRUCTURA DE CARPETAS MÍNIMA**

```
lnb-bot-puppeteer/
├── 📄 package.json
├── 🤖 bot.js
├── 💬 BOTLNBCODE.js
├── 🔧 new_commands_system.js
├── 💻 chat_system.js
├── 🆔 uid_system_mejorado.js
├── 👑 vip_system.js
├── 👑 vip_commands.js
├── 🔌 bot_vip_integration.js
├── 📋 .env.example
├── 🚫 .gitignore
├── 📖 README.md
├── config/
│   └── 🗄️ database.js
├── database/
│   └── 🔧 db_functions.js
└── scripts/
    └── 📊 migrate_to_mysql.js
```

---

## ⚠️ **ARCHIVOS QUE NO DEBEN INCLUIRSE EN GIT**

- `.env` (contiene credenciales)
- `node_modules/` (se genera con npm install)
- `*.log` (archivos de log)

---

## 🔥 **DEPENDENCIAS PRINCIPALES**

Las siguientes dependencias se instalan automáticamente con `npm install`:

```json
{
  "puppeteer": "^22.8.2",    // Control del navegador
  "mysql2": "^3.14.3",       // Base de datos MySQL
  "node-fetch": "^2.6.7",    // Peticiones HTTP
  "form-data": "^4.0.0",     // Manejo de formularios
  "dotenv": "^17.2.1",       // Variables de entorno
  "sqlite3": "^5.1.7"        // SQLite (fallback)
}
```

---

## 💡 **NOTAS IMPORTANTES**

1. **El archivo `.env` NUNCA debe incluirse en el repositorio git**
2. **Usar `.env.example` como plantilla para crear `.env`**
3. **Asegurarse de tener MySQL configurado antes de ejecutar**
4. **Las tablas de BD se crean automáticamente al ejecutar el bot**
5. **Si falla la conexión MySQL, verificar credenciales en `.env`**

---

## 📞 **Soporte**

Si hay problemas después de seguir estas instrucciones:

1. Verificar que MySQL esté ejecutándose
2. Verificar credenciales en `.env`
3. Ejecutar `npm install` nuevamente
4. Revisar logs en consola para errores específicos
