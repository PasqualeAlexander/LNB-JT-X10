
# 🧪 INSTRUCCIONES PARA PROBAR LA CORRECCIÓN

## 1. Reiniciar el Bot
```bash
# Detener el bot actual y reiniciarlo
node BOTLNBCODE.js
```

## 2. Simular Desconexión
1. Conectar varios jugadores (al menos 4-5)
2. Distribuir manualmente en equipos desiguales (ej: 3v1)
3. Hacer que un jugador se desconecte
4. Observar los logs y el comportamiento

## 3. Qué Buscar en los Logs
- ✅ "DEBUG balanceAutomaticoContinuo: Iniciando..."
- ✅ "Balance NECESARIO - diferencia de X jugadores"
- ✅ "Candidatos válidos: X/Y"
- ✅ "EJECUTANDO room.setPlayerTeam"
- ✅ "movido EXITOSAMENTE"

## 4. Qué Buscar en el Chat
- ✅ "⚖️ 🔄 Equilibrando equipos por desconexión..."
- ✅ "⚖️ NombreJugador → 🔴 ROJO" (o AZUL)
- ✅ "✅ Equipos equilibrados correctamente"

## 5. Verificación Final
- Los equipos deben quedar con diferencia ≤ 1
- Los jugadores deben cambiar de equipo visualmente
- No debe haber errores en la consola

## 6. Si NO Funciona
1. Verificar que el backup se restauró correctamente
2. Revisar que todas las variables globales estén disponibles
3. Ejecutar: diagnosticarBalance() en la consola del navegador
4. Verificar que no hay conflictos con otras funciones

## 7. Rollback (Si es Necesario)
```bash
# Restaurar backup si algo sale mal
cp BOTLNBCODE_backup_balance_*.js BOTLNBCODE.js
```
