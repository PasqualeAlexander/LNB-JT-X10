/**
 * SCRIPT DE INSTALACIÓN Y CONFIGURACIÓN DE BASE DE DATOS PARA LNB BOT
 * ===================================================================
 * 
 * Este script automatiza la configuración de la base de datos para el bot de LNB.
 * Ofrece dos opciones:
 * 1. Configurar MySQL (recomendado para producción)
 * 2. Configurar SQLite (fácil para desarrollo/testing)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Crea una interfaz para leer la entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Colores para los mensajes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

// Ruta del archivo .env
const envPath = path.join(__dirname, '.env');

// Configuración por defecto
const defaultConfig = {
  DB_HOST: 'localhost',
  DB_PORT: '3306',
  DB_USER: 'lnb_user',
  DB_PASSWORD: 'lnb_password',
  DB_NAME: 'lnb_estadisticas',
  USE_SQLITE: 'false',
  SQLITE_PATH: './database/lnb_estadisticas.db'
};

// Función para mostrar un banner
function showBanner() {
  console.log(colors.cyan + "╔═══════════════════════════════════════════════════════════════╗");
  console.log("║                                                               ║");
  console.log("║  " + colors.bright + "INSTALACIÓN DE BASE DE DATOS - BOT LNB" + colors.reset + colors.cyan + "                  ║");
  console.log("║                                                               ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝" + colors.reset);
  console.log("");
}

// Función para preguntar al usuario
function askQuestion(question, defaultValue = '') {
  return new Promise((resolve) => {
    const defaultText = defaultValue ? ` (${defaultValue})` : '';
    rl.question(colors.bright + question + defaultText + colors.reset + ': ', (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

// Función para comprobar si un comando está disponible
function isCommandAvailable(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Función para comprobar la conexión MySQL
async function testMySQLConnection(config) {
  try {
    // Usar la biblioteca de mysql si está disponible
    const mysql = require('mysql2/promise');
    
    console.log(colors.yellow + "Probando conexión a MySQL..." + colors.reset);
    
    const connection = await mysql.createConnection({
      host: config.DB_HOST,
      port: config.DB_PORT,
      user: config.DB_USER,
      password: config.DB_PASSWORD
    });
    
    console.log(colors.green + "✓ Conexión exitosa a MySQL" + colors.reset);
    
    // Comprobar si la base de datos existe
    const [rows] = await connection.execute(`SHOW DATABASES LIKE '${config.DB_NAME}'`);
    
    if (rows.length === 0) {
      console.log(colors.yellow + `La base de datos '${config.DB_NAME}' no existe. Intentando crearla...` + colors.reset);
      await connection.execute(`CREATE DATABASE ${config.DB_NAME}`);
      console.log(colors.green + `✓ Base de datos '${config.DB_NAME}' creada exitosamente` + colors.reset);
    } else {
      console.log(colors.green + `✓ Base de datos '${config.DB_NAME}' ya existe` + colors.reset);
    }
    
    // Cerrar la conexión
    await connection.end();
    return true;
  } catch (error) {
    console.log(colors.red + "✗ Error conectando a MySQL: " + error.message + colors.reset);
    return false;
  }
}

// Función para configurar SQLite
async function setupSQLite(config) {
  try {
    const sqlite3Path = require.resolve('sqlite3');
    console.log(colors.green + "✓ SQLite está instalado correctamente" + colors.reset);
    
    // Asegurarse de que existe el directorio para la base de datos
    const dbDir = path.dirname(config.SQLITE_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(colors.green + `✓ Directorio para SQLite creado: ${dbDir}` + colors.reset);
    }
    
    return true;
  } catch (error) {
    console.log(colors.yellow + "⚠ SQLite no está instalado. Intentando instalarlo..." + colors.reset);
    
    try {
      execSync('npm install sqlite3', { stdio: 'inherit' });
      console.log(colors.green + "✓ SQLite instalado exitosamente" + colors.reset);
      return true;
    } catch (installError) {
      console.log(colors.red + "✗ Error instalando SQLite: " + installError.message + colors.reset);
      return false;
    }
  }
}

// Función para guardar la configuración en .env
function saveConfig(config) {
  let envContent = '# Configuración generada por setup-database.js\n';
  envContent += '# Fecha: ' + new Date().toISOString() + '\n\n';
  
  for (const [key, value] of Object.entries(config)) {
    envContent += `${key}=${value}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log(colors.green + `✓ Configuración guardada en ${envPath}` + colors.reset);
}

// Función principal
async function main() {
  showBanner();
  
  console.log(colors.bright + "Este asistente te ayudará a configurar la base de datos para el bot LNB.\n" + colors.reset);
  
  // Leer configuración existente si existe
  let config = { ...defaultConfig };
  if (fs.existsSync(envPath)) {
    console.log(colors.yellow + "Se encontró un archivo .env existente. Se usará como base para la configuración." + colors.reset);
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && match[1] && match[2] !== undefined) {
        config[match[1].trim()] = match[2].trim();
      }
    });
  }
  
  // Preguntar qué tipo de base de datos usar
  const dbChoice = await askQuestion(
    "¿Qué tipo de base de datos deseas usar? [1] MySQL, [2] SQLite (más fácil)", 
    isCommandAvailable('mysql') ? "1" : "2"
  );
  
  if (dbChoice === "2") {
    // Configurar SQLite
    config.USE_SQLITE = "true";
    console.log(colors.cyan + "\n== Configuración de SQLite ==" + colors.reset);
    
    config.SQLITE_PATH = await askQuestion(
      "Ruta para la base de datos SQLite",
      config.SQLITE_PATH
    );
    
    const sqliteOk = await setupSQLite(config);
    if (!sqliteOk) {
      console.log(colors.yellow + "\n⚠ No se pudo configurar SQLite correctamente, pero se guardará la configuración." + colors.reset);
      console.log(colors.yellow + "  Es posible que necesites instalar SQLite manualmente ejecutando: npm install sqlite3" + colors.reset);
    }
  } else {
    // Configurar MySQL
    config.USE_SQLITE = "false";
    console.log(colors.cyan + "\n== Configuración de MySQL ==" + colors.reset);
    
    config.DB_HOST = await askQuestion("Host de MySQL", config.DB_HOST);
    config.DB_PORT = await askQuestion("Puerto de MySQL", config.DB_PORT);
    config.DB_USER = await askQuestion("Usuario de MySQL", config.DB_USER);
    config.DB_PASSWORD = await askQuestion("Contraseña de MySQL", config.DB_PASSWORD);
    config.DB_NAME = await askQuestion("Nombre de la base de datos", config.DB_NAME);
    
    const mysqlOk = await testMySQLConnection(config);
    if (!mysqlOk) {
      console.log(colors.yellow + "\n⚠ No se pudo conectar a MySQL con la configuración proporcionada." + colors.reset);
      
      const useSqlite = await askQuestion(
        "¿Deseas usar SQLite como alternativa? [y/n]", 
        "y"
      );
      
      if (useSqlite.toLowerCase() === "y") {
        config.USE_SQLITE = "true";
        config.SQLITE_PATH = await askQuestion(
          "Ruta para la base de datos SQLite",
          config.SQLITE_PATH
        );
        
        await setupSQLite(config);
      } else {
        console.log(colors.yellow + "\n⚠ Se guardará la configuración de MySQL, pero deberás resolver los problemas de conexión." + colors.reset);
      }
    }
  }
  
  // Guardar la configuración
  saveConfig(config);
  
  console.log(colors.green + "\n✅ Configuración completada." + colors.reset);
  console.log(colors.bright + "\nAhora puedes ejecutar el bot con:" + colors.reset);
  console.log("  node bot.js");
  
  rl.close();
}

// Función para instalar las dependencias necesarias
async function installDependencies() {
  const dependencies = ['dotenv', 'mysql2'];
  
  console.log(colors.yellow + "Comprobando dependencias necesarias..." + colors.reset);
  
  try {
    // Comprobar si package.json existe
    if (!fs.existsSync(path.join(__dirname, 'package.json'))) {
      console.log(colors.yellow + "No se encontró package.json. Inicializando npm..." + colors.reset);
      execSync('npm init -y', { stdio: 'inherit' });
    }
    
    // Comprobar si las dependencias ya están instaladas
    const missing = [];
    for (const dep of dependencies) {
      try {
        require.resolve(dep);
      } catch (e) {
        missing.push(dep);
      }
    }
    
    if (missing.length > 0) {
      console.log(colors.yellow + `Instalando dependencias faltantes: ${missing.join(', ')}` + colors.reset);
      execSync(`npm install ${missing.join(' ')}`, { stdio: 'inherit' });
    } else {
      console.log(colors.green + "✓ Todas las dependencias necesarias están instaladas" + colors.reset);
    }
  } catch (error) {
    console.log(colors.red + "✗ Error instalando dependencias: " + error.message + colors.reset);
  }
}

// Ejecutar la instalación de dependencias y luego el programa principal
installDependencies().then(main).catch(error => {
  console.error(colors.red + "Error en la ejecución del script: " + error.message + colors.reset);
  rl.close();
});
