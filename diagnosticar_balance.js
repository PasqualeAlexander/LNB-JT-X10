/**
 * SCRIPT DE DIAGNÓSTICO PARA PROBLEMA DE BALANCE AUTOMÁTICO
 * Este script ayuda a identificar por qué el bot dice que va a equilibrar pero no mueve jugadores
 */

console.log('🔍 INICIANDO DIAGNÓSTICO DEL SISTEMA DE BALANCE AUTOMÁTICO');

// Función de diagnóstico que simula el comportamiento del balance
function diagnosticarBalance() {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE BALANCE AUTOMÁTICO');
    console.log('='.repeat(60));
    
    // Verificar si las variables globales están disponibles
    const variablesGlobales = [
        'room',
        'jugadoresAFK',
        'movimientoIniciadorPorBot',
        'esBot',
        'obtenerCantidadJugadoresPorEquipo',
        'balanceInteligentePostSalida',
        'balanceAutomaticoContinuo'
    ];
    
    console.log('\n1. 📋 VERIFICANDO VARIABLES GLOBALES:');
    variablesGlobales.forEach(variable => {
        try {
            const valor = eval(variable);
            const tipo = typeof valor;
            const existe = valor !== undefined;
            console.log(`   ${existe ? '✅' : '❌'} ${variable}: ${tipo} ${!existe ? '(NO DEFINIDA)' : ''}`);
            
            if (variable === 'jugadoresAFK' && existe) {
                console.log(`      🔍 Jugadores AFK actuales: ${valor.size} jugadores`);
                if (valor.size > 0) {
                    console.log(`      📋 Lista AFK: [${Array.from(valor).join(', ')}]`);
                }
            }
            
            if (variable === 'movimientoIniciadorPorBot' && existe) {
                console.log(`      🔍 Movimientos pendientes del bot: ${valor.size}`);
                if (valor.size > 0) {
                    console.log(`      📋 IDs en movimiento: [${Array.from(valor).join(', ')}]`);
                }
            }
        } catch (error) {
            console.log(`   ❌ ${variable}: ERROR - ${error.message}`);
        }
    });
    
    // Verificar estado actual de la sala
    console.log('\n2. 🏟️ VERIFICANDO ESTADO ACTUAL DE LA SALA:');
    try {
        if (typeof room !== 'undefined' && room && room.getPlayerList) {
            const jugadores = room.getPlayerList();
            const rojo = jugadores.filter(j => j.team === 1);
            const azul = jugadores.filter(j => j.team === 2);
            const espectadores = jugadores.filter(j => j.team === 0);
            
            console.log(`   ✅ Jugadores totales: ${jugadores.length}`);
            console.log(`   🔴 Equipo Rojo: ${rojo.length} jugadores`);
            console.log(`   🔵 Equipo Azul: ${azul.length} jugadores`);
            console.log(`   ⚪ Espectadores: ${espectadores.length} jugadores`);
            console.log(`   📊 Diferencia: ${Math.abs(rojo.length - azul.length)} jugadores`);
            
            // Mostrar detalles de cada jugador
            console.log('\n   📋 DETALLES DE JUGADORES:');
            jugadores.forEach(jugador => {
                const esAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
                const esBot = window.esBot && window.esBot(jugador);
                const enMovimiento = movimientoIniciadorPorBot && movimientoIniciadorPorBot.has(jugador.id);
                
                const equipoNombre = jugador.team === 0 ? 'SPEC' : jugador.team === 1 ? 'ROJO' : 'AZUL';
                const flags = [
                    esBot ? 'BOT' : null,
                    esAFK ? 'AFK' : null,
                    enMovimiento ? 'MOVING' : null
                ].filter(f => f).join(', ') || 'NORMAL';
                
                console.log(`      ${jugador.name} (ID:${jugador.id}) - ${equipoNombre} [${flags}]`);
            });
        } else {
            console.log('   ❌ Room no está disponible o no tiene getPlayerList');
        }
    } catch (error) {
        console.log(`   ❌ Error verificando estado de sala: ${error.message}`);
    }
    
    // Simular proceso de balance
    console.log('\n3. 🔄 SIMULANDO PROCESO DE BALANCE:');
    try {
        // Usar la función real si está disponible
        if (typeof obtenerCantidadJugadoresPorEquipo !== 'undefined') {
            const equipos = obtenerCantidadJugadoresPorEquipo();
            console.log(`   📊 Resultado de obtenerCantidadJugadoresPorEquipo:`, equipos);
            
            if (equipos.diferencia > 1) {
                console.log(`   ⚖️ Balance necesario - diferencia: ${equipos.diferencia}`);
                
                // Verificar candidatos válidos
                const equipoMayor = equipos.rojo > equipos.azul ? equipos.jugadoresRojo : equipos.jugadoresAzul;
                const candidatos = equipoMayor.filter(p => {
                    const esBot = window.esBot && window.esBot(p);
                    const esAFK = jugadoresAFK && jugadoresAFK.has(p.id);
                    return !esBot && !esAFK;
                });
                
                console.log(`   👥 Equipo mayor: ${equipoMayor.length} jugadores`);
                console.log(`   ✅ Candidatos válidos: ${candidatos.length} jugadores`);
                
                if (candidatos.length === 0) {
                    console.log('   ❌ PROBLEMA ENCONTRADO: No hay candidatos válidos para mover');
                    console.log('   🔍 Razones posibles:');
                    equipoMayor.forEach(jugador => {
                        const esBot = window.esBot && window.esBot(jugador);
                        const esAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
                        console.log(`      - ${jugador.name}: ${esBot ? 'ES BOT' : ''}${esAFK ? 'ES AFK' : ''}${!esBot && !esAFK ? 'VÁLIDO' : ''}`);
                    });
                } else {
                    console.log('   ✅ Candidatos válidos encontrados:');
                    candidatos.forEach(c => console.log(`      - ${c.name} (ID: ${c.id})`));
                }
            } else {
                console.log(`   ✅ No se requiere balance - diferencia: ${equipos.diferencia} ≤ 1`);
            }
        } else {
            console.log('   ❌ Función obtenerCantidadJugadoresPorEquipo no disponible');
        }
    } catch (error) {
        console.log(`   ❌ Error simulando balance: ${error.message}`);
    }
    
    // Verificar función room.setPlayerTeam
    console.log('\n4. 🔧 VERIFICANDO FUNCIÓN room.setPlayerTeam:');
    try {
        if (typeof room !== 'undefined' && room && room.setPlayerTeam) {
            console.log('   ✅ room.setPlayerTeam está disponible');
            console.log(`   🔍 Tipo: ${typeof room.setPlayerTeam}`);
            
            // Intentar una operación de prueba (sin ejecutar)
            console.log('   🧪 Función parece estar lista para usar');
        } else {
            console.log('   ❌ room.setPlayerTeam NO está disponible');
        }
    } catch (error) {
        console.log(`   ❌ Error verificando setPlayerTeam: ${error.message}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ DIAGNÓSTICO COMPLETADO');
    console.log('='.repeat(60));
}

// Función para ejecutar balance de prueba
function ejecutarBalancePrueba() {
    console.log('\n' + '🧪 EJECUTANDO BALANCE DE PRUEBA...');
    
    try {
        if (typeof balanceAutomaticoContinuo !== 'undefined') {
            console.log('🔄 Llamando a balanceAutomaticoContinuo...');
            balanceAutomaticoContinuo();
        } else if (typeof balanceInteligentePostSalida !== 'undefined') {
            console.log('🔄 Llamando a balanceInteligentePostSalida...');
            balanceInteligentePostSalida('jugador_prueba');
        } else {
            console.log('❌ No hay funciones de balance disponibles');
        }
    } catch (error) {
        console.log(`❌ Error ejecutando balance de prueba: ${error.message}`);
        console.log(`   Stack trace: ${error.stack}`);
    }
}

// Función para forzar balance manual
function forzarBalanceManual() {
    console.log('\n' + '🔧 FORZANDO BALANCE MANUAL...');
    
    try {
        if (typeof room === 'undefined' || !room || !room.getPlayerList) {
            console.log('❌ Room no disponible');
            return;
        }
        
        const jugadores = room.getPlayerList();
        const rojo = jugadores.filter(j => j.team === 1 && !window.esBot(j));
        const azul = jugadores.filter(j => j.team === 2 && !window.esBot(j));
        
        console.log(`🔍 Jugadores reales: Rojo=${rojo.length}, Azul=${azul.length}`);
        
        if (Math.abs(rojo.length - azul.length) > 1) {
            const equipoMayor = rojo.length > azul.length ? rojo : azul;
            const equipoMenorEnum = rojo.length > azul.length ? 2 : 1;
            
            if (equipoMayor.length > 0) {
                const jugadorAMover = equipoMayor[0];
                console.log(`🎯 Intentando mover: ${jugadorAMover.name} al equipo ${equipoMenorEnum}`);
                
                // Marcar movimiento
                if (typeof movimientoIniciadorPorBot !== 'undefined') {
                    movimientoIniciadorPorBot.add(jugadorAMover.id);
                }
                
                // Intentar mover
                room.setPlayerTeam(jugadorAMover.id, equipoMenorEnum);
                console.log('✅ Movimiento ejecutado');
                
                // Verificar resultado
                setTimeout(() => {
                    const jugadoresPost = room.getPlayerList();
                    const rojoPost = jugadoresPost.filter(j => j.team === 1 && !window.esBot(j)).length;
                    const azulPost = jugadoresPost.filter(j => j.team === 2 && !window.esBot(j)).length;
                    console.log(`📊 Resultado: Rojo=${rojoPost}, Azul=${azulPost}`);
                }, 1000);
            }
        } else {
            console.log('✅ Equipos ya están balanceados');
        }
        
    } catch (error) {
        console.log(`❌ Error en balance manual: ${error.message}`);
        console.log(`   Stack trace: ${error.stack}`);
    }
}

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
    window.diagnosticarBalance = diagnosticarBalance;
    window.ejecutarBalancePrueba = ejecutarBalancePrueba;
    window.forzarBalanceManual = forzarBalanceManual;
    
    console.log('✅ Funciones de diagnóstico disponibles:');
    console.log('   - diagnosticarBalance()');
    console.log('   - ejecutarBalancePrueba()');
    console.log('   - forzarBalanceManual()');
} else {
    module.exports = {
        diagnosticarBalance,
        ejecutarBalancePrueba,
        forzarBalanceManual
    };
}

// Ejecutar diagnóstico automáticamente
console.log('🚀 Ejecutando diagnóstico automático...');
setTimeout(() => {
    try {
        diagnosticarBalance();
    } catch (error) {
        console.log(`❌ Error en diagnóstico automático: ${error.message}`);
    }
}, 1000);
