/**
 * SISTEMA DE ESTADÍSTICAS ROBUSTO PARA DISCORD - LNB BOT
 * ======================================================
 * 
 * Versión mejorada con manejo robusto de errores y reconexión automática
 */

const DiscordStatsSystem = require('./discord_stats_system');

class DiscordStatsRobusto {
    constructor() {
        this.statsSystem = null;
        this.reconexionesIntentadas = 0;
        this.maxReconexiones = 5;
        this.tiempoEspera = 60000; // 1 minuto
        this.isRunning = false;
    }

    async iniciar() {
        try {
            console.log('╔════════════════════════════════════════════════════════════╗');
            console.log('║       🎯 SISTEMA DE ESTADÍSTICAS DISCORD LNB - ROBUSTO    ║');
            console.log('║                     Iniciando...                          ║');
            console.log('╚════════════════════════════════════════════════════════════╝');
            console.log('');

            this.isRunning = true;
            this.reconexionesIntentadas = 0;

            // Crear instancia del sistema
            this.statsSystem = new DiscordStatsSystem();

            // Configurar manejo de errores
            this.configurarManejoErrores();

            console.log('🔧 Configurando sistema robusto...');
            console.log('📋 Configuración:');
            console.log('   └── Webhook: ' + this.statsSystem.webhookUrl.substring(0, 50) + '...');
            console.log('   └── Actualización: Cada 1 hora');
            console.log('   └── Max reconexiones: ' + this.maxReconexiones);
            console.log('   └── Tiempo entre reconexiones: ' + (this.tiempoEspera / 1000) + 's');
            console.log('');

            // Iniciar sistema con reintentos
            await this.iniciarConReintentos();

        } catch (error) {
            console.error('❌ Error crítico al iniciar sistema robusto:', error);
            await this.manejarError(error);
        }
    }

    async iniciarConReintentos() {
        while (this.isRunning && this.reconexionesIntentadas < this.maxReconexiones) {
            try {
                console.log(`🚀 Intento ${this.reconexionesIntentadas + 1} de inicialización...`);
                
                await this.statsSystem.iniciar();
                
                console.log('');
                console.log('╔════════════════════════════════════════════════════════════╗');
                console.log('║                    ✅ SISTEMA ACTIVO                       ║');
                console.log('║                                                            ║');
                console.log('║  📊 Las estadísticas se envían/actualizan cada hora       ║');
                console.log('║  🎯 Webhook configurado correctamente                     ║');
                console.log('║  🔄 Sistema robusto con reconexión automática             ║');
                console.log('║                                                            ║');
                console.log('║  💡 Comandos disponibles:                                 ║');
                console.log('║     • Ctrl+C : Detener sistema                            ║');
                console.log('║     • u      : Forzar actualización manual                ║');
                console.log('║     • s      : Ver estado del sistema                     ║');
                console.log('║     • r      : Reiniciar sistema                          ║');
                console.log('╚════════════════════════════════════════════════════════════╝');
                console.log('');

                // Resetear contador de reconexiones si fue exitoso
                this.reconexionesIntentadas = 0;
                
                // Configurar watchdog para verificar el sistema cada 5 minutos
                this.configurarWatchdog();

                return; // Salir del bucle si fue exitoso

            } catch (error) {
                this.reconexionesIntentadas++;
                console.error(`❌ Error en intento ${this.reconexionesIntentadas}:`, error.message);
                
                if (this.reconexionesIntentadas < this.maxReconexiones) {
                    console.log(`⏳ Esperando ${this.tiempoEspera / 1000}s antes del siguiente intento...`);
                    await this.esperar(this.tiempoEspera);
                }
            }
        }

        if (this.reconexionesIntentadas >= this.maxReconexiones) {
            console.error('💥 Se agotaron todos los intentos de reconexión');
            throw new Error('Sistema no pudo iniciarse después de múltiples intentos');
        }
    }

    configurarWatchdog() {
        // Verificar el sistema cada 5 minutos
        setInterval(async () => {
            try {
                if (!this.statsSystem || !this.statsSystem.updateInterval) {
                    console.warn('⚠️ Watchdog: Sistema parece estar inactivo, reiniciando...');
                    await this.reiniciarSistema();
                }
            } catch (error) {
                console.error('❌ Error en watchdog:', error.message);
            }
        }, 5 * 60 * 1000); // 5 minutos
    }

    async reiniciarSistema() {
        try {
            console.log('🔄 Reiniciando sistema...');
            
            if (this.statsSystem) {
                this.statsSystem.detener();
            }
            
            // Esperar un momento antes de reiniciar
            await this.esperar(5000);
            
            this.reconexionesIntentadas = 0;
            this.statsSystem = new DiscordStatsSystem();
            await this.iniciarConReintentos();
            
        } catch (error) {
            console.error('❌ Error reiniciando sistema:', error.message);
        }
    }

    configurarManejoErrores() {
        // Manejar errores no capturados
        process.on('uncaughtException', async (error) => {
            console.error('❌ Error no capturado:', error);
            await this.manejarError(error);
        });

        process.on('unhandledRejection', async (reason, promise) => {
            console.error('❌ Promesa rechazada no manejada:', reason);
            await this.manejarError(new Error(String(reason)));
        });

        // Manejar señales de cierre
        process.on('SIGINT', () => {
            console.log('\\n👋 Cerrando sistema robusto...');
            this.detener();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            console.log('\\n👋 Cerrando sistema robusto...');
            this.detener();
            process.exit(0);
        });
    }

    async manejarError(error) {
        console.error('🚨 Manejando error crítico:', error.message);
        
        try {
            // Intentar reiniciar el sistema si no se agotaron los intentos
            if (this.isRunning && this.reconexionesIntentadas < this.maxReconexiones) {
                console.log('🔄 Intentando recuperación automática...');
                await this.esperar(this.tiempoEspera);
                await this.reiniciarSistema();
            } else {
                console.error('💥 No se puede recuperar automáticamente');
                this.detener();
                process.exit(1);
            }
        } catch (recoveryError) {
            console.error('❌ Error en recuperación automática:', recoveryError.message);
            this.detener();
            process.exit(1);
        }
    }

    detener() {
        console.log('🛑 Deteniendo sistema robusto...');
        this.isRunning = false;
        
        if (this.statsSystem) {
            this.statsSystem.detener();
        }
    }

    async esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Manejar entrada de teclado para comandos
    configurarComandos() {
        if (process.stdin.setRawMode) {
            process.stdin.setRawMode(true);
        }
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', async (key) => {
            const keyStr = key.toString().toLowerCase();
            
            if (keyStr === '\\u0003') { // Ctrl+C
                console.log('\\n👋 Cerrando sistema...');
                this.detener();
                process.exit(0);
            } else if (keyStr === 'u') {
                console.log('🔄 Forzando actualización manual...');
                if (this.statsSystem) {
                    const exito = await this.statsSystem.forzarActualizacion();
                    console.log(exito ? '✅ Actualización completada' : '❌ Error en actualización');
                }
            } else if (keyStr === 's') {
                console.log('📊 Estado del sistema:');
                console.log(`   └── Sistema activo: ${this.isRunning ? 'Sí' : 'No'}`);
                console.log(`   └── Reconexiones intentadas: ${this.reconexionesIntentadas}/${this.maxReconexiones}`);
                if (this.statsSystem) {
                    console.log(`   └── ID del mensaje: ${this.statsSystem.messageId || 'No disponible'}`);
                    console.log(`   └── Webhook activo: ${this.statsSystem.webhookUrl ? 'Sí' : 'No'}`);
                    console.log(`   └── Timer activo: ${this.statsSystem.updateInterval ? 'Sí' : 'No'}`);
                }
                console.log(`   └── Hora actual: ${new Date().toLocaleString('es-AR')}`);
            } else if (keyStr === 'r') {
                console.log('🔄 Reiniciando sistema manualmente...');
                await this.reiniciarSistema();
                console.log('✅ Sistema reiniciado');
            }
        });
    }
}

// Si se ejecuta directamente
if (require.main === module) {
    const sistemaRobusto = new DiscordStatsRobusto();
    sistemaRobusto.configurarComandos();
    sistemaRobusto.iniciar();
}

module.exports = DiscordStatsRobusto;
