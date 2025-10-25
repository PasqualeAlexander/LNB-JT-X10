# =============================================
# CONFIGURAR MYSQL PARA LNB BOT - AUTOMÁTICO
# =============================================

Write-Host "🔧 CONFIGURANDO MYSQL PARA LNB BOT..." -ForegroundColor Green
Write-Host ""

# Obtener la contraseña de root de MySQL
$rootPassword = Read-Host "Ingresa la contraseña de ROOT de MySQL" -AsSecureString
$rootPasswordText = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword))

Write-Host ""
Write-Host "⚙️ Ejecutando configuración de MySQL..." -ForegroundColor Yellow

# Ejecutar el script SQL
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe"
$scriptPath = Join-Path $PSScriptRoot "setup_mysql.sql"

try {
    # Ejecutar el script SQL
    & $mysqlPath -u root -p$rootPasswordText -e "SOURCE $scriptPath"
    
    Write-Host ""
    Write-Host "✅ BASE DE DATOS CONFIGURADA CORRECTAMENTE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 CREDENCIALES CONFIGURADAS:" -ForegroundColor Cyan
    Write-Host "   Host: localhost" -ForegroundColor White
    Write-Host "   Puerto: 3306" -ForegroundColor White
    Write-Host "   Usuario: lnb_user" -ForegroundColor White
    Write-Host "   Contraseña: lnb_password" -ForegroundColor White
    Write-Host "   Base de datos: lnb_estadisticas" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Ahora puedes ejecutar: npm start" -ForegroundColor Green
    
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: No se pudo conectar a MySQL" -ForegroundColor Red
    Write-Host "💡 Verifica que:" -ForegroundColor Yellow
    Write-Host "   - MySQL esté ejecutándose" -ForegroundColor White
    Write-Host "   - La contraseña de root sea correcta" -ForegroundColor White
    Write-Host "   - La ruta de MySQL sea: C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe" -ForegroundColor White
}

Write-Host ""
Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
Read-Host
