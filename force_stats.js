#!/usr/bin/env node
/**
 * Script para forzar la inicialización del sistema de estadísticas Discord
 * Útil cuando el sistema no se inicializa automáticamente desde el bot principal
 */

const fs = require('fs');
const path = require('path');

// Cargar configuración de entorno
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

async function forzarInicializacionStats() {
    try {
        console.log('🔧 Forzando inicialización del sistema de estadísticas Discord...');
        
        // Importar y crear instancia del sistema de estadísticas
        const DiscordStatsSystem = require('./discord_stats_system');
        const discordStatsSystem = new DiscordStatsSystem();
        
        // Inicializar el sistema
        console.log('🚀 Iniciando sistema...');
        await discordStatsSystem.iniciar();
        
        console.log('✅ Sistema de estadísticas inicializado exitosamente');
        console.log('⏰ Las estadísticas se actualizarán cada hora automáticamente');
        
        // Mantener el proceso vivo para que las actualizaciones automáticas funcionen
        console.log('🔄 Manteniendo proceso activo para actualizaciones automáticas...');
        console.log('💡 Presiona Ctrl+C para detener');
        
        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('🛑 Deteniendo sistema de estadísticas...');
            discordStatsSystem.detener();
            process.exit(0);
        });
        
        // Mantener vivo
        setInterval(() => {
            // Verificar cada 5 minutos si el proceso sigue vivo
        }, 5 * 60 * 1000);
        
    } catch (error) {
        console.error('❌ Error forzando inicialización:', error);
        process.exit(1);
    }
}

// Ejecutar
forzarInicializacionStats();