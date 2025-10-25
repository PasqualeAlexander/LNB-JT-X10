/**
 * SCRIPT DE CONFIGURACIÓN AUTOMÁTICA DE MYSQL PARA LNB BOT
 * ======================================================
 * 
 * Este script te ayudará a configurar correctamente la conexión MySQL
 * que necesita el bot LNB para funcionar.
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
  DB_NAME: 'lnb_estadisticas'
};

// Banner
function showBanner() {
  console.log(colors.cyan + "╔═══════════════════════════════════════════════════════════════╗");
  console.log("║                                                               ║");
  console.log("║  " + colors.bright + "CONFIGURACIÓN DE MYSQL - BOT LNB" + colors.reset + colors.cyan + "                       ║");
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

// Función para probar la conexión MySQL
async function testMySQLConnection(config) {
  try {
    // Verificar si mysql2 está instalado
    try {
      require.resolve('mysql2');
    } catch (e) {
      console.log(colors.yellow + "Instalando módulo mysql2..." + colors.reset);
      execSync('npm install mysql2', { stdio: 'inherit' });
    }
    
    const mysql = require('mysql2/promise');
    
    console.log(colors.yellow + "Probando conexión a MySQL..." + colors.reset);
    
    // Intentar conectar sin especificar la base de datos primero
    let connection;
    try {
      connection = await mysql.createConnection({
        host: config.DB_HOST,
        port: parseInt(config.DB_PORT),
        user: config.DB_USER,
        password: config.DB_PASSWORD
      });
      
      console.log(colors.green + "✓ Conexión básica a MySQL exitosa" + colors.reset);
      
      // Verificar si la base de datos existe
      const [rows] = await connection.execute(`SHOW DATABASES LIKE '${config.DB_NAME}'`);
      
      if (rows.length === 0) {
        console.log(colors.yellow + `La base de datos '${config.DB_NAME}' no existe. Intentando crearla...` + colors.reset);
        await connection.execute(`CREATE DATABASE ${config.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(colors.green + `✓ Base de datos '${config.DB_NAME}' creada exitosamente` + colors.reset);
      } else {
        console.log(colors.green + `✓ Base de datos '${config.DB_NAME}' ya existe` + colors.reset);
      }
      
      // Cerrar la conexión inicial
      await connection.end();
      
      // Ahora probar conectando directamente con la base de datos
      connection = await mysql.createConnection({
        host: config.DB_HOST,
        port: parseInt(config.DB_PORT),
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME
      });
      
      console.log(colors.green + `✓ Conexión completa a MySQL con base de datos '${config.DB_NAME}' exitosa` + colors.reset);
      await connection.end();
      
      return { success: true };
    } catch (error) {
      if (connection) await connection.end();
      throw error;
    }
  } catch (error) {
    console.log(colors.red + "✗ Error conectando a MySQL: " + error.message + colors.reset);
    
    // Proporcionar información más detallada sobre errores comunes
    let errorTip = "";
    if (error.message.includes("ER_ACCESS_DENIED_ERROR") || error.message.includes("Access denied")) {
      errorTip = colors.yellow + "TIP: Credenciales incorrectas. Verifica usuario y contraseña." + colors.reset;
    } else if (error.message.includes("ECONNREFUSED")) {
      errorTip = colors.yellow + "TIP: No se pudo conectar al servidor MySQL. Verifica que esté en ejecución y el puerto sea correcto." + colors.reset;
    } else if (error.message.includes("ER_DBACCESS_DENIED_ERROR")) {
      errorTip = colors.yellow + "TIP: El usuario no tiene permisos para acceder a la base de datos." + colors.reset;
    } else if (error.message.includes("ER_BAD_DB_ERROR")) {
      errorTip = colors.yellow + "TIP: La base de datos no existe." + colors.reset;
    }
    
    if (errorTip) console.log(errorTip);
    
    return { 
      success: false, 
      error: error.message,
      needsUserCreation: error.message.includes("ER_ACCESS_DENIED_ERROR") || error.message.includes("Access denied")
    };
  }
}

// Función para guardar la configuración en .env
function saveConfig(config) {
  let envContent = '# Configuración de MySQL para LNB Bot\n';
  envContent += '# Generado por configurar-mysql.js\n';
  envContent += '# Fecha: ' + new Date().toISOString() + '\n\n';
  
  for (const [key, value] of Object.entries(config)) {
    envContent += `${key}=${value}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log(colors.green + `✓ Configuración guardada en ${envPath}` + colors.reset);
}

// Función para mostrar comandos SQL para configurar usuario
function showMySQLCommands(config) {
  console.log(colors.yellow + "\n===== COMANDOS SQL PARA CONFIGURAR MYSQL MANUALMENTE =====\n" + colors.reset);
  console.log("A continuación se muestran los comandos SQL que puedes ejecutar");
  console.log("en tu servidor MySQL para configurar manualmente el usuario y la base de datos:\n");
  
  console.log(colors.cyan + "-- Crear la base de datos:" + colors.reset);
  console.log(`CREATE DATABASE IF NOT EXISTS ${config.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  
  console.log(colors.cyan + "\n-- Crear el usuario y otorgar permisos:" + colors.reset);
  console.log(`CREATE USER IF NOT EXISTS '${config.DB_USER}'@'localhost' IDENTIFIED BY '${config.DB_PASSWORD}';`);
  console.log(`GRANT ALL PRIVILEGES ON ${config.DB_NAME}.* TO '${config.DB_USER}'@'localhost';`);
  console.log(`FLUSH PRIVILEGES;`);
  
  console.log(colors.cyan + "\n-- Verificar la conexión:" + colors.reset);
  console.log(`SELECT USER(), CURRENT_USER();`);
  
  console.log(colors.yellow + "\n=============================================================" + colors.reset);
}

// Función principal
async function main() {
  showBanner();
  
  console.log(colors.bright + "Este asistente te ayudará a configurar MySQL para el bot LNB.\n" + colors.reset);
  
  // Comprobar si dotenv está instalado
  try {
    require.resolve('dotenv');
  } catch (e) {
    console.log(colors.yellow + "Instalando módulo dotenv necesario para la configuración..." + colors.reset);
    execSync('npm install dotenv', { stdio: 'inherit' });
  }
  
  // Intentar cargar configuración existente
  let config = { ...defaultConfig };
  if (fs.existsSync(envPath)) {
    console.log(colors.yellow + "Se encontró un archivo .env existente. Se usará como base para la configuración." + colors.reset);
    
    try {
      require('dotenv').config({ path: envPath });
      
      if (process.env.DB_HOST) config.DB_HOST = process.env.DB_HOST;
      if (process.env.DB_PORT) config.DB_PORT = process.env.DB_PORT;
      if (process.env.DB_USER) config.DB_USER = process.env.DB_USER;
      if (process.env.DB_PASSWORD) config.DB_PASSWORD = process.env.DB_PASSWORD;
      if (process.env.DB_NAME) config.DB_NAME = process.env.DB_NAME;
    } catch (error) {
      console.log(colors.yellow + "No se pudo cargar el archivo .env existente. Se usará la configuración por defecto." + colors.reset);
    }
  }
  
  // Configurar MySQL
  console.log(colors.cyan + "\n== Configuración de MySQL ==" + colors.reset);
  
  config.DB_HOST = await askQuestion("Host de MySQL", config.DB_HOST);
  config.DB_PORT = await askQuestion("Puerto de MySQL", config.DB_PORT);
  config.DB_USER = await askQuestion("Usuario de MySQL", config.DB_USER);
  config.DB_PASSWORD = await askQuestion("Contraseña de MySQL", config.DB_PASSWORD);
  config.DB_NAME = await askQuestion("Nombre de la base de datos", config.DB_NAME);
  
  // Guardar la configuración antes de probarla
  saveConfig(config);
  
  // Probar la conexión
  console.log(colors.cyan + "\n== Probando conexión a MySQL ==" + colors.reset);
  const testResult = await testMySQLConnection(config);
  
  if (testResult.success) {
    console.log(colors.green + "\n✅ CONFIGURACIÓN EXITOSA" + colors.reset);
    console.log("La conexión a MySQL se ha configurado correctamente.");
    console.log("Ahora puedes ejecutar el bot LNB con: node bot.js");
  } else {
    console.log(colors.red + "\n❌ CONFIGURACIÓN CON PROBLEMAS" + colors.reset);
    console.log("No se pudo establecer conexión a MySQL con la configuración proporcionada.");
    
    // Mostrar comandos SQL para configuración manual
    const showSql = await askQuestion("¿Quieres ver los comandos SQL para configurar MySQL manualmente? (s/n)", "s");
    if (showSql.toLowerCase() === "s") {
      showMySQLCommands(config);
    }
    
    console.log(colors.yellow + "\nPosibles soluciones:" + colors.reset);
    console.log("1. Asegúrate de que el servidor MySQL esté en ejecución");
    console.log("2. Verifica que las credenciales sean correctas");
    console.log("3. Si el usuario no existe, créalo con los permisos adecuados");
    console.log("4. Si la base de datos no existe, créala manualmente");
    console.log("5. Verifica que el firewall no esté bloqueando la conexión");
  }
  
  rl.close();
}

// Ejecutar el programa principal
main().catch(error => {
  console.error(colors.red + "Error en la ejecución del script: " + error.message + colors.reset);
  rl.close();
});
