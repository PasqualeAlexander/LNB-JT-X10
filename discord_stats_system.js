/**
 * SISTEMA DE ESTADÍSTICAS PARA DISCORD - LNB BOT
 * ==============================================
 * 
 * Este sistema envía y actualiza automáticamente las estadísticas
 * del bot LNB al canal de Discord usando webhooks cada hora.
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Cargar configuración de base de datos
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

const { executeQuery } = require('./config/database');
const dbFunctions = require('./database/db_functions');

class DiscordStatsSystem {
    constructor() {
        this.webhookUrl = "https://discord.com/api/webhooks/1407879923539902596/EAtF8SNASrcf27_RKRAphYQmqghK_LeuJ13Vm3G6ntKVG0xQb28d5_qWN8iXMgEb4Ad5";
        this.messageId = null;
        this.updateInterval = null;
        this.statsFile = path.join(__dirname, 'discord_stats_message.json');
        
        console.log('🎯 Sistema de estadísticas Discord inicializado');
        this.loadMessageId();
    }

    // Cargar ID del mensaje guardado
    loadMessageId() {
        try {
            if (fs.existsSync(this.statsFile)) {
                const data = JSON.parse(fs.readFileSync(this.statsFile, 'utf8'));
                this.messageId = data.messageId;
                console.log(`📂 ID del mensaje cargado: ${this.messageId}`);
            }
        } catch (error) {
            console.error('⚠️ Error cargando ID del mensaje:', error.message);
        }
    }

    // Guardar ID del mensaje
    saveMessageId() {
        try {
            fs.writeFileSync(this.statsFile, JSON.stringify({
                messageId: this.messageId,
                lastUpdate: new Date().toISOString(),
                webhookUrl: this.webhookUrl
            }), 'utf8');
            console.log(`💾 ID del mensaje guardado: ${this.messageId}`);
        } catch (error) {
            console.error('❌ Error guardando ID del mensaje:', error.message);
        }
    }

    // Obtener estadísticas de la base de datos
    async obtenerEstadisticas() {
        try {
            console.log('📊 Obteniendo estadísticas de la base de datos...');
            
            // Obtener tops de diferentes categorías
            const [
                topGoles,
                topAsistencias, 
                topPartidos,
                topVictorias,
                topHatTricks,
                topVallasInvictas,
                topMVPs,
                topBalonDeOro,
                totalJugadores,
                partidosRecientes
            ] = await Promise.all([
                dbFunctions.obtenerTopJugadores('goles', 10),
                dbFunctions.obtenerTopJugadores('asistencias', 10),
                dbFunctions.obtenerTopJugadores('partidos', 10),
                dbFunctions.obtenerTopJugadores('victorias', 10),
                dbFunctions.obtenerTopJugadores('hatTricks', 10),
                dbFunctions.obtenerTopJugadores('vallasInvictas', 10),
                dbFunctions.obtenerTopJugadores('mvps', 10),
                executeQuery("SELECT nombre, goles, asistencias, partidos, ROUND((goles + asistencias) / partidos, 2) AS ga_por_partido FROM jugadores WHERE partidos > 100 ORDER BY ga_por_partido DESC LIMIT 10"),
                executeQuery('SELECT COUNT(*) as total FROM jugadores WHERE partidos > 0'),
                executeQuery('SELECT * FROM partidos ORDER BY created_at DESC LIMIT 5')
            ]);

            // Calcular estadísticas generales
            const totalPartidosQuery = await executeQuery('SELECT SUM(partidos) as total FROM jugadores');
            const totalGoles = await executeQuery('SELECT SUM(goles) as total FROM jugadores');
            const totalAsistencias = await executeQuery('SELECT SUM(asistencias) as total FROM jugadores');

            return {
                topGoles,
                topAsistencias,
                topPartidos,
                topVictorias,
                topHatTricks,
                topVallasInvictas,
                topMVPs,
                topBalonDeOro,
                stats: {
                    totalJugadores: totalJugadores[0]?.total || 0,
                    totalPartidos: totalPartidosQuery[0]?.total || 0,
                    totalGoles: totalGoles[0]?.total || 0,
                    totalAsistencias: totalAsistencias[0]?.total || 0
                },
                partidosRecientes,
                timestamp: new Date()
            };

        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            throw error;
        }
    }

    // Formatear estadísticas para Discord
    formatearMensajeDiscord(estadisticas) {
        const { topGoles, topAsistencias, topPartidos, topVictorias, topHatTricks, topVallasInvictas, topMVPs, topBalonDeOro, stats, timestamp } = estadisticas;
        
        // Función helper para formatear tops con bloques de código (formato compacto)
        const formatearTop = (jugadores, emoji, campo) => {
            if (!jugadores || jugadores.length === 0) return '`Sin datos disponibles`';
            
            const lista = jugadores.map((jugador, index) => {
                const posicion = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][index] || `${index + 1}️⃣`;
                
                // Formato compacto - solo números para todas las categorías
                const texto = `${posicion} ${jugador.nombre} - ${jugador[campo]} `;
                
                return texto;
            }).join('\n');
            
            return `\`\`\`${lista}\`\`\``;
        };

        const formatearBalonDeOro = (jugadores) => {
            if (!jugadores || jugadores.length === 0) return '`Sin datos disponibles`';
            
            const lista = jugadores.map((jugador, index) => {
                const posicion = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][index] || `${index + 1}️⃣`;
                
                // Calcular gaPorPartido de manera segura
                let gaPorPartido = 0;
                if (jugador.ga_por_partido !== null && jugador.ga_por_partido !== undefined) {
                    gaPorPartido = Number(jugador.ga_por_partido);
                } else if (jugador.partidos > 0) {
                    gaPorPartido = ((jugador.goles || 0) + (jugador.asistencias || 0)) / jugador.partidos;
                }
                
                // Validar que sea un número válido
                if (isNaN(gaPorPartido)) {
                    gaPorPartido = 0;
                }
                
                // Formato compacto para balón de oro - mostrar promedio por partido
                const texto = `${posicion} ${jugador.nombre} - ${gaPorPartido.toFixed(2)} `;
                
                return texto;
            }).join('\n');
            
            return `\`\`\`${lista}\`\`\``;
        };

        const ahora = new Date();
        const horaFormateada = ahora.toLocaleString('es-AR', { 
            timeZone: 'America/Argentina/Buenos_Aires',
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return {
            embeds: [{
                title: '<:LNB:1376301383560728777> **ESTADÍSTICAS LNB - LIGA NACIONAL DE BIGGER** <:LNB:1376301383560728777>',
                color: 0x00FF00, // Verde
                fields: [
                    {
                        name: '🏆 **TOP GOLEADORES**',
                        value: formatearTop(topGoles, '⚽', 'goles'),
                        inline: true
                    },
                    {
                        name: '🎯 **TOP ASISTENCIAS**',
                        value: formatearTop(topAsistencias, '🅰️', 'asistencias'),
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: '📈 **TOP PARTIDOS JUGADOS**',
                        value: formatearTop(topPartidos, '🎮', 'partidos'),
                        inline: true
                    },
                    {
                        name: '🏅 **TOP VICTORIAS**',
                        value: formatearTop(topVictorias, '✅', 'victorias'),
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: '🎩 **TOP HAT-TRICKS**',
                        value: formatearTop(topHatTricks, '🎩', 'hatTricks'),
                        inline: true
                    },
                    {
                        name: '🥅 **TOP VALLAS INVICTAS**',
                        value: formatearTop(topVallasInvictas, '🛡️', 'vallasInvictas'),
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: '🌟 **TOP MVP**',
                        value: formatearTop(topMVPs, '🌟', 'mvps'),
                        inline: true
                    },
                    {
                        name: '<:bdo:1376300142084362300> **BALÓN DE ORO (G+A)/P +100PJ**',
                        value: formatearBalonDeOro(topBalonDeOro),
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: '📋 **ESTADÍSTICAS GENERALES**',
                        value: [
                            `👥 **Jugadores registrados:** \`${stats.totalJugadores}\``,
                            `⚽ **Total de goles:** \`${stats.totalGoles}\``,
                            `🅰️ **Total de asistencias:** \`${stats.totalAsistencias}\``,
                            `🎮 **Total de partidos:** \`${stats.totalPartidos}\``
                        ].join('\n'),
                        inline: false
                    }
                ],
                footer: {
                    text: `🤖 Bot LNB - Actualizado cada hora | ${horaFormateada}`
                },
                timestamp: ahora.toISOString()
            }]
        };
    }

    // Enviar mensaje inicial al webhook
    async enviarMensajeInicial() {
        try {
            console.log('📤 Enviando mensaje inicial de estadísticas...');
            
            const estadisticas = await this.obtenerEstadisticas();
            const mensaje = this.formatearMensajeDiscord(estadisticas);
            
            // Agregar wait=true para obtener el ID del mensaje
            const webhookUrlWithWait = `${this.webhookUrl}?wait=true`;
            
            const response = await fetch(webhookUrlWithWait, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensaje)
            });

            if (response.ok) {
                const data = await response.json();
                this.messageId = data.id;
                this.saveMessageId();
                console.log(`✅ Mensaje inicial enviado exitosamente. ID: ${this.messageId}`);
                return true;
            } else {
                const errorText = await response.text();
                console.error('❌ Error enviando mensaje inicial:', response.status, errorText);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error en enviarMensajeInicial:', error);
            return false;
        }
    }

    // Editar mensaje existente con nuevas estadísticas
    async actualizarMensaje() {
        try {
            if (!this.messageId) {
                console.log('⚠️ No hay mensaje para actualizar, enviando mensaje inicial...');
                return await this.enviarMensajeInicial();
            }

            console.log(`📝 Actualizando mensaje con ID: ${this.messageId}`);
            
            const estadisticas = await this.obtenerEstadisticas();
            const mensaje = this.formatearMensajeDiscord(estadisticas);
            
            const editUrl = `${this.webhookUrl}/messages/${this.messageId}`;
            
            const response = await fetch(editUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mensaje)
            });

            if (response.ok) {
                console.log('✅ Mensaje actualizado exitosamente');
                this.saveMessageId(); // Actualizar timestamp
                return true;
            } else if (response.status === 404) {
                console.log('⚠️ Mensaje no encontrado, enviando nuevo mensaje...');
                this.messageId = null;
                return await this.enviarMensajeInicial();
            } else {
                const errorText = await response.text();
                console.error('❌ Error actualizando mensaje:', response.status, errorText);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error en actualizarMensaje:', error);
            return false;
        }
    }

    // Iniciar sistema de actualización automática
    async iniciar() {
        try {
            console.log('🚀 Iniciando sistema de estadísticas Discord...');
            
            // Enviar o actualizar mensaje inmediatamente
            const exito = this.messageId ? 
                await this.actualizarMensaje() : 
                await this.enviarMensajeInicial();
            
            if (!exito) {
                console.error('❌ Error en el envío inicial, reintentando en 5 minutos...');
            }
            
            // Configurar actualización automática cada hora (3600000 ms)
            this.updateInterval = setInterval(async () => {
                console.log('⏰ Actualizando estadísticas automáticamente...');
                await this.actualizarMensaje();
            }, 60 * 60 * 1000); // 1 hora
            
            console.log('✅ Sistema de estadísticas Discord iniciado correctamente');
            console.log('⏰ Las estadísticas se actualizarán cada hora automáticamente');
            
        } catch (error) {
            console.error('❌ Error iniciando sistema:', error);
        }
    }

    // Detener sistema
    detener() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('🛑 Sistema de estadísticas Discord detenido');
        }
    }

    // Forzar actualización manual
    async forzarActualizacion() {
        console.log('🔄 Forzando actualización manual...');
        return await this.actualizarMensaje();
    }
}

// Si se ejecuta directamente
if (require.main === module) {
    const statsSystem = new DiscordStatsSystem();
    
    // Iniciar el sistema
    statsSystem.iniciar();
    
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
}

module.exports = DiscordStatsSystem;
