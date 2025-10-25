@echo off
title Sistema de Estadisticas Discord - LNB Bot (PERSISTENTE)
color 0A

echo ╔════════════════════════════════════════════════════════════╗
echo ║       🎯 SISTEMA DE ESTADÍSTICAS DISCORD LNB - PERSISTENTE ║
echo ║                                                            ║
echo ║  ✅ Ejecuta el sistema de forma continua                   ║
echo ║  🔄 Se reinicia automáticamente si se detiene             ║
echo ║  📊 Envía estadísticas cada hora                          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo 🔧 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado o no está en el PATH
    echo    Instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

echo 🚀 Iniciando sistema PERSISTENTE de estadísticas Discord...
echo 💡 Presiona Ctrl+C para detener el sistema completamente
echo.

:RESTART
echo ⏰ %date% %time% - Iniciando sistema de estadísticas...

REM Ejecutar el script de Node.js
node iniciar_stats_discord.js

REM Si el proceso termina, esperar 30 segundos y reiniciar
echo.
echo ⚠️ %date% %time% - Sistema detenido. Reiniciando en 30 segundos...
echo 💡 Presiona Ctrl+C ahora si quieres detener el sistema permanentemente
timeout /t 30 /nobreak >nul

goto RESTART
