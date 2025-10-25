# 🏆 RESET DE TEMPORADA LNB BOT

Sistema completo para resetear estadísticas de temporada con backup automático.

## 📋 ¿Qué hace el reset?

### ✅ **CAMPOS QUE SE RESETEAN A 0:**
- `partidos`, `victorias`, `derrotas`
- `goles`, `asistencias`, `autogoles`
- `hatTricks`, `mvps`, `vallasInvictas`
- `tiempoJugado`, `mejorRachaGoles`, `mejorRachaAsistencias`
- `promedioGoles`, `promedioAsistencias`

### 💾 **CAMPOS QUE SE MANTIENEN:**
- `auth_id`, `nombre`, `nombre_display`
- `fechaPrimerPartido`, `codigoRecuperacion`
- `xp`, `nivel` (sistema de experiencia)
- `created_at`, `updated_at`

## 🚀 Cómo ejecutar el reset

### 1. **Ejecutar reset completo:**
```bash
node reset_temporada.js
```

**El script hace automáticamente:**
1. 📦 Crear backup de todas las estadísticas actuales
2. 🔄 Resetear estadísticas de juego a 0
3. ✅ Verificar que todo se haya reseteado correctamente
4. 📊 Mostrar resumen de lo que se respaldó

### 2. **Ver backups disponibles:**
```bash
node gestionar_backups.js listar
```

### 3. **Consultar un backup específico:**
```bash
node gestionar_backups.js consultar temporada_backup_2025-09-20
```

### 4. **Eliminar backup antiguo:**
```bash
node gestionar_backups.js eliminar temporada_backup_2025-08-15
```

## 🛡️ Seguridad

- ⏰ **Delay de 3 segundos** para cancelar con Ctrl+C
- 📦 **Backup automático** antes de cualquier modificación
- ✅ **Verificación completa** de los cambios
- 🔒 **Preservación de identidades** (auth_id, nombres)
- 💾 **Sistema XP/Nivel intacto**

## 📊 Ejemplo de salida

```
🏁 INICIANDO RESET DE TEMPORADA LNB...

🔍 Verificando conexión a la base de datos...
✅ Conexión establecida correctamente

📦 Creando backup en tabla: temporada_backup_2025-09-20
✅ Backup creado exitosamente: 45 jugadores respaldados

🔄 Reseteando estadísticas de temporada...
✅ Estadísticas reseteadas: 45 jugadores actualizados

📊 RESUMEN DEL BACKUP CREADO:
=================================
1. TheGamer: 156 PJ, 89 G, 45 A, 67.3% WR
2. ProPlayer: 142 PJ, 76 G, 52 A, 71.1% WR
3. TopScorer: 134 PJ, 95 G, 38 A, 63.4% WR
...

🔍 VERIFICANDO RESET...
✅ Verificación exitosa:
   - Jugadores en base: 65
   - Total partidos: 0 (debe ser 0)
   - Total goles: 0 (debe ser 0)
   - Total asistencias: 0 (debe ser 0)

🎉 ¡RESET COMPLETADO EXITOSAMENTE!

🏆 ¡NUEVA TEMPORADA LNB INICIADA!
   - Todas las estadísticas reseteadas a 0
   - Auth_IDs y nombres preservados
   - Sistema XP/Nivel mantenido
   - Backup seguro creado
```

## 📋 Gestión de backups

### **Comando: listar**
```bash
node gestionar_backups.js listar
```
Muestra todos los backups disponibles con información básica.

### **Comando: consultar**
```bash
node gestionar_backups.js consultar temporada_backup_2025-09-20
```
Muestra:
- 🏆 Top 15 jugadores de esa temporada
- 📈 Estadísticas generales de la temporada
- 📊 Resumen completo de datos

### **Comando: eliminar**
```bash
node gestionar_backups.js eliminar temporada_backup_2025-08-15
```
Por seguridad, solo muestra el comando SQL manual para eliminar.

## 🗄️ Estructura de backup

Cada backup se guarda en una tabla con el formato:
```
temporada_backup_YYYY-MM-DD
```

**Contenido del backup:**
- Todas las estadísticas originales
- `fecha_backup` - Cuándo se hizo el backup
- `motivo_backup` - Por qué se hizo (ej: "Reset Temporada LNB")

## ⚠️ Importantes

1. **SIEMPRE verificar** que la conexión a la base de datos esté funcionando antes del reset
2. **Los backups ocupan espacio** - eliminar los muy antiguos ocasionalmente
3. **El reset NO se puede deshacer** sin restaurar desde backup
4. **Los auth_ids y nombres se mantienen** para preservar identidades
5. **El sistema XP/Nivel NO se resetea** para mantener progresión de jugadores

## 🔧 Troubleshooting

### Error de conexión a base de datos:
```bash
# Verificar configuración en config/database.js
# Asegurarse de que MySQL esté corriendo
# Verificar credenciales de acceso
```

### Backup no creado correctamente:
```bash
# Verificar permisos de escritura en la base de datos
# Verificar espacio disponible en disco
# Revisar logs de MySQL para errores
```

### Jugadores no aparecen reseteados:
```bash
# Ejecutar verificación manual:
node gestionar_backups.js listar
# Verificar que los campos estén efectivamente en 0
```

---

🎯 **¡Listo para una nueva temporada épica en LNB!** 🎯