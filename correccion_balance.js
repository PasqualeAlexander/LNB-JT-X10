/**
 * CORRECCIÓN DEL SISTEMA DE BALANCE AUTOMÁTICO
 * Este archivo contiene las correcciones necesarias para que el balance funcione correctamente
 */

console.log('🔧 CARGANDO CORRECCIONES PARA EL SISTEMA DE BALANCE AUTOMÁTICO');

// Función corregida de balance automático continuo
function balanceAutomaticoContinuoCorregido() {
    console.log(`🔄 DEBUG balanceAutomaticoContinuoCorregido: Iniciando...`);
    
    if (typeof room === 'undefined' || !room || !room.getPlayerList) {
        console.log(`❌ DEBUG balanceAutomaticoContinuoCorregido: Room no disponible`);
        return false;
    }
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const { rojo, azul, diferencia, jugadoresRojo, jugadoresAzul } = equipos;
    
    console.log(`🔄 DEBUG balanceAutomaticoContinuoCorregido: Rojo=${rojo}, Azul=${azul}, Diferencia=${diferencia}`);
    
    // Si no hay jugadores en equipos, no hacer nada
    if (rojo === 0 && azul === 0) {
        console.log(`❌ DEBUG: No hay jugadores en equipos para balancear`);
        return false;
    }
    
    // CONDICIÓN PRINCIPAL: Balancear cuando la diferencia sea mayor a 1 jugador
    if (diferencia <= 1) {
        console.log(`✅ DEBUG: Equipos YA balanceados (diferencia ${diferencia} ≤ 1)`);
        return false;
    }
    
    console.log(`⚖️ DEBUG: Balance NECESARIO - diferencia de ${diferencia} jugadores`);
    
    // Determinar equipo con más jugadores y equipo con menos jugadores
    const equipoConMas = rojo > azul ? jugadoresRojo : jugadoresAzul;
    const equipoConMenos = rojo > azul ? 2 : 1; // 1=rojo, 2=azul
    const equipoConMasNombre = rojo > azul ? 'ROJO' : 'AZUL';
    const equipoConMenosNombre = rojo > azul ? 'AZUL' : 'ROJO';
    
    console.log(`🔍 DEBUG: Equipo mayor: ${equipoConMasNombre} (${equipoConMas.length}), Equipo menor: ${equipoConMenosNombre}`);
    
    // CORRECCIÓN 1: Verificar que esBot está definida globalmente
    let funcionEsBot;
    if (typeof esBot === 'function') {
        funcionEsBot = esBot;
    } else if (typeof window !== 'undefined' && typeof window.esBot === 'function') {
        funcionEsBot = window.esBot;
    } else if (typeof global !== 'undefined' && typeof global.esBot === 'function') {
        funcionEsBot = global.esBot;
    } else {
        // Función de respaldo para detectar bots
        funcionEsBot = function(jugador) {
            return jugador && jugador.name && (
                jugador.name.includes('[BOT]') ||
                jugador.name.includes('Bot') ||
                jugador.name.includes('bot') ||
                jugador.name === '' ||
                jugador.id === 0
            );
        };
        console.log(`⚠️ DEBUG: Usando función de respaldo para detectar bots`);
    }
    
    // CORRECCIÓN 2: Filtrar candidatos válidos con verificaciones mejoradas
    const candidatos = equipoConMas.filter(jugador => {
        // Verificar que el jugador existe y tiene las propiedades necesarias
        if (!jugador || typeof jugador.id === 'undefined') {
            console.log(`🚫 DEBUG: Jugador inválido detectado`);
            return false;
        }
        
        // Verificar si es bot
        if (funcionEsBot(jugador)) {
            console.log(`🚫 DEBUG: Excluyendo bot ${jugador.name} del balance`);
            return false;
        }
        
        // Verificar si está AFK
        if (typeof jugadoresAFK !== 'undefined' && jugadoresAFK && jugadoresAFK.has(jugador.id)) {
            console.log(`🚫 DEBUG: Excluyendo ${jugador.name} del balance (marcado como AFK)`);
            return false;
        }
        
        // Verificar que el jugador aún esté en el equipo correcto
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        if (!jugadorActual || jugadorActual.team === 0) {
            console.log(`🚫 DEBUG: ${jugador.name} ya no está en equipo, excluyendo`);
            return false;
        }
        
        console.log(`✅ DEBUG: ${jugador.name} es candidato válido para balance`);
        return true;
    });
    
    console.log(`🎯 DEBUG: Candidatos válidos: ${candidatos.length}/${equipoConMas.length}`);
    
    // CORRECCIÓN 3: Verificar que hay candidatos antes de continuar
    if (candidatos.length === 0) {
        console.log(`⚠️ DEBUG: NO HAY candidatos válidos para balance automático continuo`);
        console.log(`📊 DEBUG: Razones de exclusión verificadas: BOT, AFK, ya movidos`);
        
        // Mostrar información detallada para debug
        equipoConMas.forEach(jugador => {
            const esBot = funcionEsBot(jugador);
            const esAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            const enEquipo = jugadorActual && jugadorActual.team !== 0;
            
            console.log(`   ${jugador.name}: Bot=${esBot}, AFK=${esAFK}, EnEquipo=${enEquipo}`);
        });
        
        return false;
    }
    
    // CORRECCIÓN 4: Calcular mejor el número de jugadores a mover
    let jugadoresAMover = Math.floor(diferencia / 2);
    
    // Asegurar que movemos al menos 1 jugador si hay diferencia > 1
    if (diferencia > 1 && jugadoresAMover === 0) {
        jugadoresAMover = 1;
    }
    
    // Limitar por candidatos disponibles
    jugadoresAMover = Math.min(jugadoresAMover, candidatos.length);
    
    console.log(`⚖️ DEBUG: Moviendo ${jugadoresAMover} jugador(es) del equipo ${equipoConMasNombre} al ${equipoConMenosNombre}`);
    
    // CORRECCIÓN 5: Anunciar el balance ANTES de mover jugadores
    anunciarGeneral(`⚖️ 🔄 Equilibrando equipos por desconexión (${jugadoresAMover} jugador${jugadoresAMover > 1 ? 'es' : ''})...`, \"87CEEB\", \"bold\");
    
    // CORRECCIÓN 6: Mezclar candidatos y mover uno por uno con verificaciones
    const candidatosAleatorios = [...candidatos].sort(() => 0.5 - Math.random());
    let jugadoresMovidos = 0;
    
    for (let i = 0; i < jugadoresAMover && i < candidatosAleatorios.length; i++) {
        const jugadorSeleccionado = candidatosAleatorios[i];
        
        try {
            // Verificar una vez más que el jugador está disponible
            const jugadorActual = room.getPlayerList().find(j => j.id === jugadorSeleccionado.id);
            if (!jugadorActual || jugadorActual.team === 0) {
                console.log(`⚠️ DEBUG: ${jugadorSeleccionado.name} ya no está disponible para mover`);
                continue;
            }
            
            console.log(`🎲 DEBUG: Moviendo ${jugadorSeleccionado.name} (${i+1}/${jugadoresAMover})`);
            
            // CORRECCIÓN 7: Marcar movimiento como iniciado por el bot ANTES de mover
            if (typeof movimientoIniciadorPorBot !== 'undefined' && movimientoIniciadorPorBot) {
                movimientoIniciadorPorBot.add(jugadorSeleccionado.id);
                console.log(`🤖 DEBUG: Marcado movimiento iniciado por bot para ${jugadorSeleccionado.name}`);
            }
            
            // CORRECCIÓN 8: Ejecutar el movimiento con verificación de éxito
            const equipoAnterior = jugadorActual.team;
            room.setPlayerTeam(jugadorSeleccionado.id, equipoConMenos);
            
            // Verificar que el movimiento fue exitoso después de un pequeño delay
            setTimeout(() => {
                const jugadorDespues = room.getPlayerList().find(j => j.id === jugadorSeleccionado.id);
                if (jugadorDespues && jugadorDespues.team === equipoConMenos) {
                    console.log(`✅ DEBUG: ${jugadorSeleccionado.name} movido exitosamente de equipo ${equipoAnterior} al ${equipoConMenos}`);
                    
                    // Anunciar el movimiento individual
                    const equipoDestinoEmoji = equipoConMenos === 1 ? '🔴' : '🔵';
                    anunciarGeneral(`⚖️ ${jugadorSeleccionado.name} → ${equipoDestinoEmoji} ${equipoConMenosNombre}`, \"90EE90\", \"normal\");
                } else {
                    console.log(`❌ DEBUG: FALLO al mover ${jugadorSeleccionado.name} - equipo actual: ${jugadorDespues ? jugadorDespues.team : 'desconectado'}`);
                }
            }, 100);
            
            jugadoresMovidos++;
            
        } catch (error) {
            console.log(`❌ ERROR moviendo ${jugadorSeleccionado.name}: ${error.message}`);
        }
    }
    
    console.log(`🏁 DEBUG: Proceso completado - ${jugadoresMovidos} jugadores movidos`);
    
    // CORRECCIÓN 9: Verificar resultado después de un delay apropiado
    setTimeout(() => {
        const equiposPostBalance = obtenerCantidadJugadoresPorEquipo();
        console.log(`📊 DEBUG Post-balance: Rojo=${equiposPostBalance.rojo}, Azul=${equiposPostBalance.azul}, Diferencia=${equiposPostBalance.diferencia}`);
        
        if (equiposPostBalance.diferencia <= 1) {
            console.log(`✅ DEBUG: Balance COMPLETADO exitosamente`);
            anunciarGeneral(`✅ Equipos equilibrados correctamente`, \"90EE90\", \"normal\");
        } else if (equiposPostBalance.diferencia > 1 && equiposPostBalance.rojo > 0 && equiposPostBalance.azul > 0) {
            console.log(`🔄 DEBUG: Aún hay diferencia (${equiposPostBalance.diferencia}), intentando balance adicional...`);
            setTimeout(() => {
                balanceAutomaticoContinuoCorregido();
            }, 2000);
        }
    }, 1000);
    
    return jugadoresMovidos > 0;
}

// Función corregida de balance post-salida
function balanceInteligentePostSalidaCorregido(nombreJugadorSalido = \"jugador\") {
    console.log(`⚖️ DEBUG balancePostSalidaCorregido: Jugador salido = ${nombreJugadorSalido}`);
    
    if (typeof room === 'undefined' || !room || !room.getPlayerList) {
        console.warn('⚠️ Room no disponible para balancePostSalida');
        return false;
    }
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const { rojo, azul, diferencia, jugadoresRojo, jugadoresAzul } = equipos;
    
    console.log(`⚖️ DEBUG: Post-salida de ${nombreJugadorSalido} - Equipos: Rojo=${rojo}, Azul=${azul}, Diferencia=${diferencia}`);
    
    // Si no hay diferencia significativa (≤1), no hacer balance
    if (diferencia <= 1) {
        console.log(`✅ DEBUG: Equipos equilibrados post-salida (diferencia ≤ 1)`);
        return false;
    }
    
    // Si hay muy pocos jugadores, no hacer balance
    if ((rojo + azul) <= 2) {
        console.log(`✅ DEBUG: Muy pocos jugadores totales (${rojo + azul})`);
        return false;
    }
    
    // USAR LA FUNCIÓN CORREGIDA
    return balanceAutomaticoContinuoCorregido();
}

// CORRECCIÓN 10: Reemplazar las funciones originales de forma segura
function aplicarCorreccionesBalance() {
    console.log('🔧 Aplicando correcciones al sistema de balance...');
    
    try {
        // Guardar referencias originales
        if (typeof balanceAutomaticoContinuo !== 'undefined') {
            window.balanceAutomaticoContinuoOriginal = balanceAutomaticoContinuo;
        }
        if (typeof balanceInteligentePostSalida !== 'undefined') {
            window.balanceInteligentePostSalidaOriginal = balanceInteligentePostSalida;
        }
        
        // Reemplazar con versiones corregidas
        if (typeof window !== 'undefined') {
            window.balanceAutomaticoContinuo = balanceAutomaticoContinuoCorregido;
            window.balanceInteligentePostSalida = balanceInteligentePostSalidaCorregido;
        }
        if (typeof global !== 'undefined') {
            global.balanceAutomaticoContinuo = balanceAutomaticoContinuoCorregido;
            global.balanceInteligentePostSalida = balanceInteligentePostSalidaCorregido;
        }
        
        // Hacer las funciones accesibles globalmente
        balanceAutomaticoContinuo = balanceAutomaticoContinuoCorregido;
        balanceInteligentePostSalida = balanceInteligentePostSalidaCorregido;
        
        console.log('✅ Correcciones aplicadas exitosamente');
        console.log('📋 Funciones corregidas:');
        console.log('   ✓ balanceAutomaticoContinuo (versión corregida)');
        console.log('   ✓ balanceInteligentePostSalida (versión corregida)');
        
    } catch (error) {
        console.error('❌ Error aplicando correcciones:', error);
    }
}

// Función de test para verificar el balance
function testBalanceCorregido() {
    console.log('\n🧪 EJECUTANDO TEST DEL BALANCE CORREGIDO...');
    
    try {
        if (typeof room === 'undefined' || !room) {
            console.log('❌ No se puede ejecutar test - room no disponible');
            return;
        }
        
        const jugadores = room.getPlayerList();
        console.log(`👥 Jugadores actuales: ${jugadores.length}`);
        
        const equipos = obtenerCantidadJugadoresPorEquipo();
        console.log(`📊 Estado actual: Rojo=${equipos.rojo}, Azul=${equipos.azul}, Diferencia=${equipos.diferencia}`);
        
        if (equipos.diferencia > 1) {
            console.log('🎯 Ejecutando balance corregido...');
            const resultado = balanceAutomaticoContinuoCorregido();
            console.log(`📋 Resultado del balance: ${resultado ? 'EXITOSO' : 'NO NECESARIO'}`);
        } else {
            console.log('✅ No es necesario balance - equipos ya equilibrados');
        }
        
    } catch (error) {
        console.error('❌ Error en test de balance:', error);
    }
}

// Exportar funciones
if (typeof window !== 'undefined') {
    window.balanceAutomaticoContinuoCorregido = balanceAutomaticoContinuoCorregido;
    window.balanceInteligentePostSalidaCorregido = balanceInteligentePostSalidaCorregido;
    window.aplicarCorreccionesBalance = aplicarCorreccionesBalance;
    window.testBalanceCorregido = testBalanceCorregido;
    
    console.log('✅ Funciones de corrección disponibles:');
    console.log('   - aplicarCorreccionesBalance() - Aplica las correcciones');
    console.log('   - testBalanceCorregido() - Prueba el balance corregido');
    console.log('   - balanceAutomaticoContinuoCorregido() - Versión corregida del balance');
} else {
    module.exports = {
        balanceAutomaticoContinuoCorregido,
        balanceInteligentePostSalidaCorregido,
        aplicarCorreccionesBalance,
        testBalanceCorregido
    };
}

console.log('🔧 Correcciones cargadas. Ejecuta aplicarCorreccionesBalance() para aplicarlas.');
