@echo off
title Sistema de Estadisticas Discord - LNB Bot
color 0A

echo ╔════════════════════════════════════════════════════════════╗
echo ║           🎯 SISTEMA DE ESTADÍSTICAS DISCORD LNB           ║
echo ║                                                            ║
echo ║  Este sistema enviará automáticamente las estadísticas    ║
echo ║  del bot LNB al canal de Discord cada hora.               ║
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

echo 🚀 Iniciando sistema de estadísticas Discord...
echo.

REM Ejecutar el script de Node.js
node iniciar_stats_discord.js

echo.
echo ⏹️ Sistema detenido.
pause
