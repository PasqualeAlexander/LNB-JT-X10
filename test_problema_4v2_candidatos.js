// ========================================
// TEST CASE: PROBLEMA BALANCE 4v2 - NO ENCUENTRA CANDIDATOS
// ========================================

console.log('🔧 INICIANDO TEST: Problema balance 4v2 - candidatos válidos');

// ========== MOCK DE ROOM Y FUNCIONES NECESARIAS ==========
let jugadoresAFK = new Map();
let movimientoIniciadorPorBot = new Set();

// Función esBot original (problemática)
function esBotOriginal(jugador) {
    if (!jugador) return false;
    return jugador.name === "HOST LNB" || jugador.id === 0;
}

// Función esBot mejorada (como respaldo en el código actual)
function esBotMejorado(jugador) {
    return jugador && jugador.name && (
        jugador.name.includes('[BOT]') ||
        jugador.name.includes('Bot') ||
        jugador.name.includes('bot') ||
        jugador.name === '' ||
        jugador.id === 0
    );
}

// Mock de room con escenario problemático
const room = {
    getPlayerList: () => [
        // Equipo ROJO (4 jugadores) - tiene más jugadores
        { id: 1, name: "Jugador1", team: 1 },
        { id: 2, name: "Jugador2", team: 1 },
        { id: 3, name: "Jugador3", team: 1 },
        { id: 4, name: "Jugador4", team: 1 },
        // Equipo AZUL (2 jugadores) - tiene menos jugadores
        { id: 5, name: "Jugador5", team: 2 },
        { id: 6, name: "Jugador6", team: 2 }
    ],
    setPlayerTeam: (id, team) => {
        console.log(`🎯 SIMULANDO: room.setPlayerTeam(${id}, ${team})`);
        // Simular que el movimiento fue exitoso
        const jugadores = room.getPlayerList();
        const jugador = jugadores.find(j => j.id === id);
        if (jugador) {
            jugador.team = team;
            console.log(`✅ Jugador ${jugador.name} movido al equipo ${team}`);
        }
    }
};

// Función para obtener cantidad de jugadores por equipo (copiada del código original)
function obtenerCantidadJugadoresPorEquipo() {
    const jugadores = room.getPlayerList();
    const jugadoresRojo = jugadores.filter(j => j.team === 1);
    const jugadoresAzul = jugadores.filter(j => j.team === 2);
    
    return {
        rojo: jugadoresRojo.length,
        azul: jugadoresAzul.length,
        diferencia: Math.abs(jugadoresRojo.length - jugadoresAzul.length),
        jugadoresRojo: jugadoresRojo,
        jugadoresAzul: jugadoresAzul
    };
}

// Función de anuncio mock
function anunciarGeneral(mensaje, color, estilo) {
    console.log(`📢 ANUNCIO: ${mensaje} [${color}, ${estilo}]`);
}

// ========== TEST SCENARIOS ==========

console.log('\\n==================== ESCENARIO 1: FUNCIÓN ESBOT ORIGINAL ====================');

function testBalanceConEsBotOriginal() {
    console.log('\\n🔍 TESTING: Usando función esBot ORIGINAL (restrictiva)');
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    console.log(`📊 Estado inicial: Rojo=${equipos.rojo}, Azul=${equipos.azul}, Diferencia=${equipos.diferencia}`);
    
    // Determinar equipo con más jugadores
    const equipoConMas = equipos.rojo > equipos.azul ? equipos.jugadoresRojo : equipos.jugadoresAzul;
    const equipoConMasNombre = equipos.rojo > equipos.azul ? 'ROJO' : 'AZUL';
    
    console.log(`\\n🎯 Equipo con más jugadores: ${equipoConMasNombre} (${equipoConMas.length} jugadores)`);
    equipoConMas.forEach(j => console.log(`  - ${j.name} (ID: ${j.id})`));
    
    // Filtrar candidatos usando función ORIGINAL
    console.log('\\n🔍 Filtrando candidatos con función esBot ORIGINAL...');
    
    const candidatos = equipoConMas.filter(jugador => {
        console.log(`\\n  Evaluando: ${jugador.name} (ID: ${jugador.id})`);
        
        // Verificar que el jugador existe
        if (!jugador || typeof jugador.id === 'undefined') {
            console.log(`    ❌ Jugador inválido`);
            return false;
        }
        
        // Verificar si es bot (usando función ORIGINAL)
        if (esBotOriginal(jugador)) {
            console.log(`    ❌ Es bot (función original)`);
            return false;
        }
        
        // Verificar si está AFK
        if (jugadoresAFK.has(jugador.id)) {
            console.log(`    ❌ Está marcado como AFK`);
            return false;
        }
        
        // Verificar que aún esté en equipo
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        if (!jugadorActual || jugadorActual.team === 0) {
            console.log(`    ❌ Ya no está en equipo`);
            return false;
        }
        
        console.log(`    ✅ Candidato VÁLIDO`);
        return true;
    });
    
    console.log(`\\n📊 RESULTADO: ${candidatos.length}/${equipoConMas.length} candidatos válidos`);
    candidatos.forEach(c => console.log(`  ✅ ${c.name}`));
    
    if (candidatos.length === 0) {
        console.log(`\\n⚠️ PROBLEMA DETECTADO: No hay candidatos válidos con función esBot original`);
        anunciarGeneral('⚖️ ❌ No se puede equilibrar: jugadores no disponibles para balance', "FFA500", "normal");
        return false;
    }
    
    return true;
}

console.log('\\n==================== ESCENARIO 2: FUNCIÓN ESBOT MEJORADA ====================');

function testBalanceConEsBotMejorado() {
    console.log('\\n🔍 TESTING: Usando función esBot MEJORADA (más flexible)');
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const equipoConMas = equipos.rojo > equipos.azul ? equipos.jugadoresRojo : equipos.jugadoresAzul;
    const equipoConMasNombre = equipos.rojo > equipos.azul ? 'ROJO' : 'AZUL';
    
    console.log(`\\n🎯 Equipo con más jugadores: ${equipoConMasNombre} (${equipoConMas.length} jugadores)`);
    
    // Filtrar candidatos usando función MEJORADA
    console.log('\\n🔍 Filtrando candidatos con función esBot MEJORADA...');
    
    const candidatos = equipoConMas.filter(jugador => {
        console.log(`\\n  Evaluando: ${jugador.name} (ID: ${jugador.id})`);
        
        if (!jugador || typeof jugador.id === 'undefined') {
            console.log(`    ❌ Jugador inválido`);
            return false;
        }
        
        // Verificar si es bot (usando función MEJORADA)
        if (esBotMejorado(jugador)) {
            console.log(`    ❌ Es bot (función mejorada)`);
            return false;
        }
        
        if (jugadoresAFK.has(jugador.id)) {
            console.log(`    ❌ Está marcado como AFK`);
            return false;
        }
        
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        if (!jugadorActual || jugadorActual.team === 0) {
            console.log(`    ❌ Ya no está en equipo`);
            return false;
        }
        
        console.log(`    ✅ Candidato VÁLIDO`);
        return true;
    });
    
    console.log(`\\n📊 RESULTADO: ${candidatos.length}/${equipoConMas.length} candidatos válidos`);
    candidatos.forEach(c => console.log(`  ✅ ${c.name}`));
    
    if (candidatos.length === 0) {
        console.log(`\\n⚠️ PROBLEMA DETECTADO: No hay candidatos válidos con función esBot mejorada`);
        anunciarGeneral('⚖️ ❌ No se puede equilibrar: jugadores no disponibles para balance', "FFA500", "normal");
        return false;
    }
    
    return true;
}

console.log('\\n==================== ESCENARIO 3: JUGADORES AFK MARCADOS ====================');

function testBalanceConJugadoresAFK() {
    console.log('\\n🔍 TESTING: Escenario con algunos jugadores marcados como AFK');
    
    // Marcar algunos jugadores como AFK
    jugadoresAFK.set(1, { ultimaActividad: Date.now() - 20000 }); // Jugador1 AFK
    jugadoresAFK.set(2, { ultimaActividad: Date.now() - 20000 }); // Jugador2 AFK
    
    console.log(`\\n💤 Jugadores marcados como AFK:`);
    for (const [playerId, data] of jugadoresAFK.entries()) {
        const jugador = room.getPlayerList().find(j => j.id === playerId);
        console.log(`  💤 ${jugador ? jugador.name : 'ID:' + playerId}`);
    }
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const equipoConMas = equipos.rojo > equipos.azul ? equipos.jugadoresRojo : equipos.jugadoresAzul;
    
    // Filtrar candidatos
    console.log('\\n🔍 Filtrando candidatos considerando jugadores AFK...');
    
    const candidatos = equipoConMas.filter(jugador => {
        console.log(`\\n  Evaluando: ${jugador.name} (ID: ${jugador.id})`);
        
        if (!jugador || typeof jugador.id === 'undefined') {
            console.log(`    ❌ Jugador inválido`);
            return false;
        }
        
        if (esBotMejorado(jugador)) {
            console.log(`    ❌ Es bot`);
            return false;
        }
        
        if (jugadoresAFK.has(jugador.id)) {
            console.log(`    ❌ Está marcado como AFK`);
            return false;
        }
        
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        if (!jugadorActual || jugadorActual.team === 0) {
            console.log(`    ❌ Ya no está en equipo`);
            return false;
        }
        
        console.log(`    ✅ Candidato VÁLIDO`);
        return true;
    });
    
    console.log(`\\n📊 RESULTADO: ${candidatos.length}/${equipoConMas.length} candidatos válidos`);
    candidatos.forEach(c => console.log(`  ✅ ${c.name}`));
    
    if (candidatos.length === 0) {
        console.log(`\\n⚠️ PROBLEMA DETECTADO: No hay candidatos válidos (muchos jugadores AFK)`);
        anunciarGeneral('⚖️ ❌ No se puede equilibrar: todos los jugadores están AFK o son bots', "FFA500", "normal");
        return false;
    }
    
    return true;
}

console.log('\\n==================== ESCENARIO 4: SIMULACIÓN DE BALANCE EXITOSO ====================');

function testBalanceExitoso() {
    console.log('\\n🔍 TESTING: Simulación de balance exitoso con candidatos válidos');
    
    // Limpiar jugadores AFK para este test
    jugadoresAFK.clear();
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const equipoConMas = equipos.rojo > equipos.azul ? equipos.jugadoresRojo : equipos.jugadoresAzul;
    const equipoConMenos = equipos.rojo > equipos.azul ? 2 : 1;
    const equipoConMenosNombre = equipos.rojo > equipos.azul ? 'AZUL' : 'ROJO';
    
    console.log(`\\n⚖️ Iniciando balance: ${equipos.rojo}v${equipos.azul} (diferencia: ${equipos.diferencia})`);
    
    const candidatos = equipoConMas.filter(jugador => {
        return jugador && !esBotMejorado(jugador) && !jugadoresAFK.has(jugador.id);
    });
    
    console.log(`\\n🎯 Candidatos disponibles: ${candidatos.length}`);
    candidatos.forEach(c => console.log(`  - ${c.name}`));
    
    if (candidatos.length > 0) {
        // Calcular cuántos jugadores mover
        const jugadoresAMover = Math.floor(equipos.diferencia / 2);
        const jugadorAMover = candidatos[0]; // Seleccionar el primero
        
        console.log(`\\n🔄 Moviendo ${jugadorAMover.name} al equipo ${equipoConMenosNombre}...`);
        
        // Marcar movimiento como iniciado por bot
        movimientoIniciadorPorBot.add(jugadorAMover.id);
        
        // Ejecutar movimiento
        room.setPlayerTeam(jugadorAMover.id, equipoConMenos);
        
        // Verificar resultado
        const equiposPostBalance = obtenerCantidadJugadoresPorEquipo();
        console.log(`\\n📊 Post-balance: Rojo=${equiposPostBalance.rojo}, Azul=${equiposPostBalance.azul}, Diferencia=${equiposPostBalance.diferencia}`);
        
        if (equiposPostBalance.diferencia <= 1) {
            console.log(`\\n✅ BALANCE EXITOSO: Diferencia reducida de ${equipos.diferencia} a ${equiposPostBalance.diferencia}`);
            anunciarGeneral('✅ Equipos equilibrados correctamente', "90EE90", "normal");
            return true;
        }
    }
    
    return false;
}

// ========== EJECUTAR TESTS ==========
console.log('\\n🎮 EJECUTANDO TESTS...');

console.log('\\n' + '='.repeat(60));
const test1 = testBalanceConEsBotOriginal();

console.log('\\n' + '='.repeat(60));
const test2 = testBalanceConEsBotMejorado();

console.log('\\n' + '='.repeat(60));
const test3 = testBalanceConJugadoresAFK();

console.log('\\n' + '='.repeat(60));
const test4 = testBalanceExitoso();

// ========== RESUMEN DE RESULTADOS ==========
console.log('\\n' + '🎯'.repeat(30));
console.log('📊 RESUMEN DE TESTS:');
console.log('🎯'.repeat(30));
console.log(`Test 1 - esBot original: ${test1 ? '✅ PASÓ' : '❌ FALLÓ'}`);
console.log(`Test 2 - esBot mejorado: ${test2 ? '✅ PASÓ' : '❌ FALLÓ'}`);
console.log(`Test 3 - Jugadores AFK: ${test3 ? '✅ PASÓ' : '❌ FALLÓ'}`);
console.log(`Test 4 - Balance exitoso: ${test4 ? '✅ PASÓ' : '❌ FALLÓ'}`);

// ========== DIAGNÓSTICO Y RECOMENDACIONES ==========
console.log('\\n' + '💡'.repeat(30));
console.log('💡 DIAGNÓSTICO Y RECOMENDACIONES:');
console.log('💡'.repeat(30));

if (!test1 && test2) {
    console.log('🔧 PROBLEMA IDENTIFICADO: La función esBot original es demasiado restrictiva');
    console.log('   - Solo detecta bots con nombre "HOST LNB" o ID 0');
    console.log('   - Recomendación: Usar la función esBot mejorada por defecto');
}

if (!test3) {
    console.log('🔧 PROBLEMA IDENTIFICADO: Demasiados jugadores marcados como AFK');
    console.log('   - El sistema AFK puede estar siendo muy agresivo');
    console.log('   - Recomendación: Revisar lógica de detección AFK o ajustar tiempos');
}

if (test4) {
    console.log('✅ CONFIRMADO: El balance funciona correctamente cuando hay candidatos válidos');
    console.log('   - El problema está en la fase de filtrado de candidatos');
}

console.log('\\n🎯 PRÓXIMOS PASOS:');
console.log('1. Implementar función esBot mejorada por defecto');
console.log('2. Agregar logs más detallados para debugging');
console.log('3. Considerar lógica de fallback cuando no hay candidatos');
console.log('4. Revisar configuración del sistema AFK');

console.log('\\n✅ TEST COMPLETADO');
