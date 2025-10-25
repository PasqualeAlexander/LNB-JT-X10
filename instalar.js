/**
 * SCRIPT DE INSTALACIÓN AUTOMÁTICA PARA BOT LNB
 * =============================================
 * 
 * Este script hace todo lo necesario para que el bot funcione después de hacer git pull
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para los mensajes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

function showBanner() {
  console.log(colors.cyan + "╔═══════════════════════════════════════════════════════════════╗");
  console.log("║                                                               ║");
  console.log("║  " + colors.bright + "INSTALACIÓN AUTOMÁTICA - BOT LNB" + colors.reset + colors.cyan + "                      ║");
  console.log("║                                                               ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝" + colors.reset);
  console.log("");
}

function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✓ ${description} encontrado`, colors.green);
    return true;
  } else {
    log(`✗ ${description} no encontrado`, colors.red);
    return false;
  }
}

function createEnvFile() {
  const envExamplePath = path.join(__dirname, '.env.example');
  const envPath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envExamplePath)) {
    log("✗ Archivo .env.example no encontrado", colors.red);
    return false;
  }
  
  if (fs.existsSync(envPath)) {
    log("ℹ Archivo .env ya existe, no se sobrescribirá", colors.yellow);
    return true;
  }
  
  try {
    fs.copyFileSync(envExamplePath, envPath);
    log("✓ Archivo .env creado desde .env.example", colors.green);
    return true;
  } catch (error) {
    log(`✗ Error creando archivo .env: ${error.message}`, colors.red);
    return false;
  }
}

function installDependencies() {
  log("Instalando dependencias de Node.js...", colors.yellow);
  
  try {
    // Verificar si package.json existe
    if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
      log("Inicializando npm...", colors.yellow);
      execSync('npm init -y', { stdio: 'inherit' });
    }
    
    // Instalar dependencias básicas
    const dependencies = [
      'dotenv',
      'mysql2', 
      'puppeteer',
      'node-fetch',
      'form-data'
    ];
    
    log(`Instalando: ${dependencies.join(', ')}`, colors.yellow);
    execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });
    
    log("✓ Dependencias instaladas correctamente", colors.green);
    return true;
  } catch (error) {
    log(`✗ Error instalando dependencias: ${error.message}`, colors.red);
    return false;
  }
}

function checkNodeVersion() {
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 14) {
      log(`✓ Node.js ${nodeVersion} (compatible)`, colors.green);
      return true;
    } else {
      log(`✗ Node.js ${nodeVersion} (se requiere versión 14 o superior)`, colors.red);
      return false;
    }
  } catch (error) {
    log("✗ Error verificando versión de Node.js", colors.red);
    return false;
  }
}

function showNextSteps() {
  log("\n" + "=".repeat(60), colors.cyan);
  log("🎉 INSTALACIÓN COMPLETADA", colors.bright + colors.green);
  log("=".repeat(60), colors.cyan);
  
  log("\n📋 Próximos pasos:", colors.bright);
  log("1. Configura MySQL ejecutando: " + colors.yellow + "node configurar-mysql.js" + colors.reset);
  log("2. Una vez configurado MySQL, ejecuta: " + colors.yellow + "node bot.js" + colors.reset);
  
  log("\n💡 Comandos útiles:", colors.bright);
  log("• Configurar MySQL: " + colors.cyan + "node configurar-mysql.js" + colors.reset);
  log("• Ejecutar el bot: " + colors.cyan + "node bot.js" + colors.reset);
  log("• Ver este mensaje de nuevo: " + colors.cyan + "node instalar.js" + colors.reset);
  
  log("\n🆘 Si tienes problemas:", colors.bright);
  log("• Verifica que MySQL esté instalado y ejecutándose");
  log("• Ejecuta el configurador: node configurar-mysql.js");
  log("• Lee los mensajes de error del bot para más información");
}

async function main() {
  showBanner();
  
  log("Verificando sistema...\n", colors.bright);
  
  // Verificar Node.js
  const nodeOk = checkNodeVersion();
  
  // Verificar archivos importantes
  const botJsOk = checkFile(path.join(__dirname, 'bot.js'), 'Archivo principal del bot (bot.js)');
  const configOk = checkFile(path.join(__dirname, 'config', 'database.js'), 'Configuración de base de datos');
  const dbFunctionsOk = checkFile(path.join(__dirname, 'database', 'db_functions.js'), 'Funciones de base de datos');
  
  if (!nodeOk || !botJsOk || !configOk || !dbFunctionsOk) {
    log("\n❌ Faltan archivos importantes o hay problemas con el sistema.", colors.red);
    log("Asegúrate de haber clonado correctamente el repositorio.", colors.yellow);
    return;
  }
  
  log("\n" + "=".repeat(60), colors.cyan);
  log("Configurando proyecto...\n", colors.bright);
  
  // Crear archivo .env
  const envOk = createEnvFile();
  
  // Instalar dependencias
  const depsOk = installDependencies();
  
  if (envOk && depsOk) {
    showNextSteps();
  } else {
    log("\n❌ La instalación no se completó correctamente.", colors.red);
    log("Revisa los errores anteriores y vuelve a intentar.", colors.yellow);
  }
}

// Ejecutar solo si este archivo se ejecuta directamente
if (require.main === module) {
  main().catch(error => {
    console.error(colors.red + "Error en la instalación: " + error.message + colors.reset);
  });
}

module.exports = { main };
