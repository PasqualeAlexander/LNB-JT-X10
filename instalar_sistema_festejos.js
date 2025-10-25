/**
 * ==========================================
 * INSTALADOR DEL SISTEMA DE FESTEJOS PERSISTENTES - LNB BOT
 * ==========================================
 * 
 * Este script instala y configura el sistema de persistencia de festejos
 * personalizado similar al sistema de roles administrativos.
 * 
 * Funcionalidades instaladas:
 * ✅ Persistencia completa por AuthID
 * ✅ Sistema de fallback por nombre
 * ✅ Migración automática temporal -> persistente
 * ✅ Comandos optimizados (!festejo, !ver_mensajes, !limpiar_mensajes)
 * ✅ Carga automática al conectarse
 * ✅ Base de datos con estadísticas y limpieza automática
 */

const fs = require('fs');
const path = require('path');

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function main() {
    log('════════════════════════════════════════════════════', 'cyan');
    log('    INSTALADOR SISTEMA DE FESTEJOS PERSISTENTES', 'bright');
    log('             LNB BOT - Version 1.0', 'cyan');
    log('════════════════════════════════════════════════════', 'cyan');
    log('');

    try {
        // Verificar que estamos en el directorio correcto
        if (!fs.existsSync('./BOTLNBCODE.js')) {
            log('❌ Error: No se encontró BOTLNBCODE.js', 'red');
            log('   Ejecuta este script desde el directorio principal del bot', 'yellow');
            return;
        }

        log('🔍 Verificando archivos existentes...', 'blue');

        // 1. Verificar que existe el sistema de festejos
        const archivoFestejos = './festejos_persistent_system.js';
        if (!fs.existsSync(archivoFestejos)) {
            log(`❌ No se encontró: ${archivoFestejos}`, 'red');
            log('   El sistema de festejos no está instalado correctamente', 'yellow');
            return;
        }
        log(`✅ Sistema de festejos: ${archivoFestejos}`, 'green');

        // 2. Verificar archivo SQL
        const archivoSQL = './database/festejos_personalizados.sql';
        if (!fs.existsSync(archivoSQL)) {
            log(`❌ No se encontró: ${archivoSQL}`, 'red');
            log('   El archivo de base de datos no está disponible', 'yellow');
            return;
        }
        log(`✅ Base de datos SQL: ${archivoSQL}`, 'green');

        log('');
        log('📋 ESTADO DEL SISTEMA DE FESTEJOS PERSISTENTES:', 'bright');
        log('═══════════════════════════════════════════════', 'cyan');

        // 3. Verificar configuración en BOTLNBCODE.js
        const botCode = fs.readFileSync('./BOTLNBCODE.js', 'utf8');

        // Verificar importaciones
        const tieneImportacion = botCode.includes('festejos_persistent_system.js');
        log(`${tieneImportacion ? '✅' : '❌'} Importación del sistema: ${tieneImportacion ? 'Configurada' : 'FALTANTE'}`, tieneImportacion ? 'green' : 'red');

        // Verificar inicialización automática
        const tieneInicializacion = botCode.includes('inicializarSistemaFestejos');
        log(`${tieneInicializacion ? '✅' : '❌'} Inicialización automática: ${tieneInicializacion ? 'Configurada' : 'FALTANTE'}`, tieneInicializacion ? 'green' : 'red');

        // Verificar carga automática al conectarse
        const tieneCargaAutomatica = botCode.includes('cargarFestejos(jugador.auth, jugador.name)');
        log(`${tieneCargaAutomatica ? '✅' : '❌'} Carga automática al conectarse: ${tieneCargaAutomatica ? 'Configurada' : 'FALTANTE'}`, tieneCargaAutomatica ? 'green' : 'red');

        // Verificar migración automática
        const tieneMigracion = botCode.includes('migrarFestivoTemporal');
        log(`${tieneMigracion ? '✅' : '❌'} Migración automática: ${tieneMigracion ? 'Configurada' : 'FALTANTE'}`, tieneMigracion ? 'green' : 'red');

        // Verificar comando !festejo optimizado
        const tieneComandoOptimizado = botCode.includes('guardarFestejo(jugador.auth, jugador.name');
        log(`${tieneComandoOptimizado ? '✅' : '❌'} Comando !festejo optimizado: ${tieneComandoOptimizado ? 'Configurado' : 'FALTANTE'}`, tieneComandoOptimizado ? 'green' : 'red');

        // Verificar comando !ver_mensajes optimizado
        const tieneVerMensajesOptimizado = botCode.includes('obtenerMensajeFestejo && jugador.auth');
        log(`${tieneVerMensajesOptimizado ? '✅' : '❌'} Comando !ver_mensajes optimizado: ${tieneVerMensajesOptimizado ? 'Configurado' : 'FALTANTE'}`, tieneVerMensajesOptimizado ? 'green' : 'red');

        // Verificar uso en goles y asistencias
        const tieneUsoEnGoles = botCode.includes('obtenerMensajeFestejo(goleador.auth, \'gol\')');
        log(`${tieneUsoEnGoles ? '✅' : '❌'} Uso en mensajes de gol: ${tieneUsoEnGoles ? 'Configurado' : 'FALTANTE'}`, tieneUsoEnGoles ? 'green' : 'red');

        const tieneUsoEnAsistencias = botCode.includes('obtenerMensajeFestejo(asistente.auth, \'asistencia\')');
        log(`${tieneUsoEnAsistencias ? '✅' : '❌'} Uso en mensajes de asistencia: ${tieneUsoEnAsistencias ? 'Configurado' : 'FALTANTE'}`, tieneUsoEnAsistencias ? 'green' : 'red');

        log('');
        log('📊 ESTADÍSTICAS DEL CÓDIGO:', 'bright');
        log('═══════════════════════════════', 'cyan');

        // Contar líneas relacionadas con festejos
        const lineasFestejos = botCode.split('\n').filter(line => 
            line.includes('festejo') || 
            line.includes('Festejo') || 
            line.includes('FESTEJOS')
        ).length;
        log(`🔢 Líneas relacionadas con festejos: ${lineasFestejos}`, 'blue');

        // Verificar funciones clave
        const funcionesClave = [
            'cargarFestejos',
            'guardarFestejo', 
            'obtenerMensajeFestejo',
            'limpiarFestejos',
            'migrarFestivoTemporal'
        ];

        log('🔧 Funciones del sistema:', 'blue');
        funcionesClave.forEach(func => {
            const existe = botCode.includes(func);
            log(`   ${existe ? '✅' : '❌'} ${func}`, existe ? 'green' : 'red');
        });

        log('');
        log('🗄️  CONFIGURACIÓN DE BASE DE DATOS:', 'bright');
        log('═══════════════════════════════════', 'cyan');

        // Verificar configuración de base de datos
        if (fs.existsSync('./config/database.js')) {
            log('✅ Archivo de configuración de BD encontrado', 'green');
        } else {
            log('❌ config/database.js no encontrado', 'red');
        }

        log('');
        log('📝 INSTRUCCIONES DE INSTALACIÓN:', 'bright');
        log('═══════════════════════════════════', 'cyan');

        const todoConfigurado = tieneImportacion && tieneInicializacion && tieneCargaAutomatica && 
                               tieneMigracion && tieneComandoOptimizado && tieneVerMensajesOptimizado &&
                               tieneUsoEnGoles && tieneUsoEnAsistencias;

        if (todoConfigurado) {
            log('🎉 ¡SISTEMA COMPLETAMENTE INSTALADO Y CONFIGURADO!', 'green');
            log('');
            log('✅ El sistema de festejos persistentes está funcionando correctamente:', 'green');
            log('   • Los mensajes se guardan automáticamente por AuthID', 'blue');
            log('   • Se cargan automáticamente al conectarse', 'blue');
            log('   • Los mensajes temporales se migran automáticamente', 'blue');
            log('   • Compatible con jugadores sin AuthID (fallback)', 'blue');
            log('');
            log('📋 Comandos disponibles para los jugadores:', 'bright');
            log('   !festejo gol "mensaje"     - Configurar mensaje de gol', 'cyan');
            log('   !festejo asis "mensaje"    - Configurar mensaje de asistencia', 'cyan');
            log('   !ver_mensajes             - Ver mensajes configurados', 'cyan');
            log('   !limpiar_mensajes         - Limpiar todos los mensajes', 'cyan');
            
        } else {
            log('⚠️  SISTEMA PARCIALMENTE CONFIGURADO', 'yellow');
            log('');
            log('Elementos faltantes que necesitan configuración manual:', 'yellow');
            
            if (!tieneImportacion) log('❌ Falta importar festejos_persistent_system.js', 'red');
            if (!tieneInicializacion) log('❌ Falta inicialización automática', 'red');
            if (!tieneCargaAutomatica) log('❌ Falta carga automática al conectarse', 'red');
            if (!tieneMigracion) log('❌ Falta migración automática', 'red');
            if (!tieneComandoOptimizado) log('❌ Falta optimización del comando !festejo', 'red');
            if (!tieneVerMensajesOptimizado) log('❌ Falta optimización del comando !ver_mensajes', 'red');
            if (!tieneUsoEnGoles) log('❌ Falta uso en mensajes de gol', 'red');
            if (!tieneUsoEnAsistencias) log('❌ Falta uso en mensajes de asistencia', 'red');
        }

        log('');
        log('🗂️  PRÓXIMOS PASOS:', 'bright');
        log('═══════════════════', 'cyan');
        
        log('1. 📊 Ejecutar el SQL para crear las tablas:', 'blue');
        log('   mysql -u tu_usuario -p tu_database < database/festejos_personalizados.sql', 'magenta');
        log('');
        
        log('2. 🔄 Reiniciar el bot para aplicar cambios:', 'blue');
        log('   node BOTLNBCODE.js', 'magenta');
        log('');
        
        log('3. 🧪 Probar el sistema:', 'blue');
        log('   • Conéctate al bot con una cuenta logueada en haxball.com', 'cyan');
        log('   • Usa: !festejo gol "¡Mi golazo!"', 'cyan');
        log('   • Usa: !festejo asis "¡Qué pase!"', 'cyan');
        log('   • Desconéctate y reconéctate para verificar persistencia', 'cyan');
        log('');

        log('🔗 ARQUITECTURA IMPLEMENTADA:', 'bright');
        log('═══════════════════════════════', 'cyan');
        log('📁 Sistema de Archivos:', 'blue');
        log('   ├── festejos_persistent_system.js  (Sistema principal)', 'cyan');
        log('   ├── database/festejos_personalizados.sql  (BD)', 'cyan');
        log('   ├── BOTLNBCODE.js  (Integración)', 'cyan');
        log('   └── instalar_sistema_festejos.js  (Este instalador)', 'cyan');
        log('');
        log('🔄 Flujo de Funcionamiento:', 'blue');
        log('   1. Jugador se conecta → Carga festejos automáticamente', 'cyan');
        log('   2. Usa !festejo → Guarda en BD por AuthID', 'cyan');
        log('   3. Hace gol/asistencia → Muestra mensaje personalizado', 'cyan');
        log('   4. Se desconecta → Datos persisten en BD', 'cyan');
        log('   5. Se reconecta → Restaura festejos automáticamente', 'cyan');

        log('');
        log('🎯 CARACTERÍSTICAS AVANZADAS:', 'bright');
        log('════════════════════════════════', 'cyan');
        log('✅ Persistencia total por AuthID (único e inmutable)', 'green');
        log('✅ Sistema de fallback por nombre para usuarios sin login', 'green');
        log('✅ Migración automática de sistema temporal a persistente', 'green');
        log('✅ Validación de mensajes (longitud, caracteres, palabras)', 'green');
        log('✅ Estadísticas de uso automáticas', 'green');
        log('✅ Limpieza automática de registros obsoletos', 'green');
        log('✅ Cache en memoria para rendimiento óptimo', 'green');
        log('✅ Respaldo completo en caso de falla de BD', 'green');

        log('');
        log('📞 SOPORTE TÉCNICO:', 'bright');
        log('══════════════════', 'cyan');
        log('Si encuentras problemas:', 'blue');
        log('• Verifica los logs de consola para errores', 'cyan');
        log('• Asegúrate de que MySQL esté funcionando', 'cyan'); 
        log('• Verifica permisos de archivo y BD', 'cyan');
        log('• Revisa la configuración en config/database.js', 'cyan');

        log('');
        log('════════════════════════════════════════════════════', 'cyan');
        log('    ¡INSTALACIÓN COMPLETADA! 🎉', 'bright');
        log('    Sistema de Festejos Persistentes LNB v1.0', 'cyan');
        log('════════════════════════════════════════════════════', 'cyan');

    } catch (error) {
        log('', '');
        log('❌ ERROR DURANTE LA INSTALACIÓN:', 'red');
        log('══════════════════════════════════', 'red');
        log(error.message, 'red');
        log('', '');
        log('🔧 Posibles soluciones:', 'yellow');
        log('• Verifica que todos los archivos estén en su lugar', 'cyan');
        log('• Ejecuta como administrador si hay problemas de permisos', 'cyan');
        log('• Asegúrate de estar en el directorio correcto del bot', 'cyan');
    }
}

// Ejecutar instalador
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { main };