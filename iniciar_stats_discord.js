/**
 * SCRIPT DE INICIO - SISTEMA DE ESTADÍSTICAS DISCORD LNB
 * =====================================================
 * 
 * Este script inicia el sistema de estadísticas que enviará
 * y actualizará automáticamente los tops del bot LNB cada hora
 */

const DiscordStatsSystem = require('./discord_stats_system');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║           🎯 SISTEMA DE ESTADÍSTICAS DISCORD LNB           ║');
console.log('║                     Iniciando...                          ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');

// Crear instancia del sistema
const statsSystem = new DiscordStatsSystem();

// Iniciar el sistema
async function iniciar() {
    try {
        console.log('🔧 Configurando sistema...');
        
        // Verificar configuración
        console.log('📋 Configuración:');
        console.log('   └── Webhook:', statsSystem.webhookUrl.substring(0, 50) + '...');
        console.log('   └── Actualización: Cada 1 hora');
        console.log('   └── Archivo de estado: discord_stats_message.json');
        console.log('');
        
        // Iniciar sistema
        await statsSystem.iniciar();
        
        console.log('');
        console.log('╔════════════════════════════════════════════════════════════╗');
        console.log('║                    ✅ SISTEMA ACTIVO                       ║');
        console.log('║                                                            ║');
        console.log('║  📊 Las estadísticas se envían/actualizan cada hora       ║');
        console.log('║  🎯 Webhook configurado correctamente                     ║');
        console.log('║  📝 Estado persistente guardado en archivo JSON           ║');
        console.log('║                                                            ║');
        console.log('║  💡 Comandos disponibles:                                 ║');
        console.log('║     • Ctrl+C : Detener sistema                            ║');
        console.log('║     • u      : Forzar actualización manual                ║');
        console.log('║     • s      : Ver estado del sistema                     ║');
        console.log('╚════════════════════════════════════════════════════════════╝');
        console.log('');
        
    } catch (error) {
        console.error('❌ Error iniciando sistema:', error);
        process.exit(1);
    }
}

// Manejar entrada de teclado para comandos
if (process.stdin.setRawMode) {
    process.stdin.setRawMode(true);
}
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', async (key) => {
    const keyStr = key.toString().toLowerCase();
    
    if (keyStr === '\u0003') { // Ctrl+C
        console.log('\n👋 Cerrando sistema...');
        statsSystem.detener();
        process.exit(0);
    } else if (keyStr === 'u') {
        console.log('🔄 Forzando actualización manual...');
        const exito = await statsSystem.forzarActualizacion();
        console.log(exito ? '✅ Actualización completada' : '❌ Error en actualización');
    } else if (keyStr === 's') {
        console.log('📊 Estado del sistema:');
        console.log(`   └── ID del mensaje: ${statsSystem.messageId || 'No disponible'}`);
        console.log(`   └── Webhook activo: ${statsSystem.webhookUrl ? 'Sí' : 'No'}`);
        console.log(`   └── Timer activo: ${statsSystem.updateInterval ? 'Sí' : 'No'}`);
        console.log(`   └── Hora actual: ${new Date().toLocaleString('es-AR')}`);
    }
});

// Manejar señales de cierre
process.on('SIGINT', () => {
    console.log('\n👋 Cerrando sistema de estadísticas...');
    statsSystem.detener();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Cerrando sistema de estadísticas...');
    statsSystem.detener();
    process.exit(0);
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    statsSystem.detener();
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});

// Iniciar el sistema
iniciar();
