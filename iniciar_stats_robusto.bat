@echo off
title Sistema de Estadisticas Discord - LNB Bot (ROBUSTO)
color 0A

echo ╔════════════════════════════════════════════════════════════╗
echo ║       🎯 SISTEMA DE ESTADÍSTICAS DISCORD LNB - ROBUSTO    ║
echo ║                                                            ║
echo ║  💪 Sistema robusto con manejo avanzado de errores        ║
echo ║  🔄 Reconexión automática en caso de fallos               ║
echo ║  📊 Envía estadísticas cada hora                          ║
echo ║  🛡️ Watchdog para monitoreo continuo                      ║
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

echo 🚀 Iniciando sistema ROBUSTO de estadísticas Discord...
echo.

REM Ejecutar el script robusto de Node.js
node discord_stats_robusto.js

echo.
echo ⏹️ Sistema robusto detenido.
pause
