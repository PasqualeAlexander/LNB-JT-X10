// ===============================================
// FIX: BALANCE 4v2 - PROBLEMA CANDIDATOS VÁLIDOS  
// ===============================================

/*
ANÁLISIS DEL PROBLEMA:
- El sistema detecta correctamente el desbalance (4v2)
- Pero al filtrar candidatos válidos, excluye a todos los jugadores
- Esto ocurre por una lógica muy restrictiva en la detección de bots/AFK

UBICACIÓN DEL PROBLEMA: 
Líneas 4619-4647 en BOTLNBCODE.js (función balanceAutomaticoContinuo)

SÍNTOMAS OBSERVADOS:
- Mensaje: "No se puede equilibrar: jugadores no disponibles para balance" (línea 4668)
- Mensaje: "No se puede equilibrar: todos los jugadores están AFK o son bots" (línea 11734)
*/

console.log('🔧 APLICANDO FIX: Balance candidatos válidos 4v2');

// ========== SOLUCIÓN 1: FUNCIÓN ESBOT MEJORADA POR DEFECTO ==========
function esBotMejoradoDefinitivo(jugador) {
    if (!jugador || !jugador.name) return false;
    
    // Lista de patrones para detectar bots (más comprensiva)
    const patronesBots = [
        'HOST LNB',           // Bot principal
        '[BOT]',              // Bots marcados explícitamente
        'Bot',                // Bots con "Bot" en mayúsculas  
        'bot',                // Bots con "bot" en minúsculas
        ''                    // Nombres vacíos
    ];
    
    // Verificar ID especiales (0 = host)
    if (jugador.id === 0) return true;
    
    // Verificar patrones en el nombre
    return patronesBots.some(patron => 
        patron === '' ? jugador.name === '' : jugador.name.includes(patron)
    );
}

// ========== SOLUCIÓN 2: LÓGICA DE FALLBACK CUANDO NO HAY CANDIDATOS ==========
function obtenerCandidatosFallback(equipoConMas, jugadoresAFK, funcionEsBot) {
    console.log('🔄 FALLBACK: Buscando candidatos con criterios relajados...');
    
    // PASO 1: Candidatos normales (criterios estrictos)
    let candidatos = equipoConMas.filter(jugador => {
        if (!jugador || typeof jugador.id === 'undefined') return false;
        if (funcionEsBot(jugador)) return false;
        if (jugadoresAFK && jugadoresAFK.has(jugador.id)) return false;
        
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        if (!jugadorActual || jugadorActual.team === 0) return false;
        
        return true;
    });
    
    console.log(`   Candidatos con criterios estrictos: ${candidatos.length}`);
    
    // PASO 2: Si no hay candidatos, relajar criterio AFK
    if (candidatos.length === 0) {
        console.log('   🔄 Relajando criterio AFK...');
        candidatos = equipoConMas.filter(jugador => {
            if (!jugador || typeof jugador.id === 'undefined') return false;
            if (funcionEsBot(jugador)) return false;
            
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            if (!jugadorActual || jugadorActual.team === 0) return false;
            
            return true;
        });
        console.log(`   Candidatos sin restricción AFK: ${candidatos.length}`);
    }
    
    // PASO 3: Si aún no hay candidatos, solo verificar que no sean bots
    if (candidatos.length === 0) {
        console.log('   🔄 Solo excluyendo bots obvios...');
        candidatos = equipoConMas.filter(jugador => {
            if (!jugador || typeof jugador.id === 'undefined') return false;
            
            // Solo excluir bots muy obvios (ID 0 o HOST LNB)
            if (jugador.id === 0 || jugador.name === 'HOST LNB') return false;
            
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            if (!jugadorActual || jugadorActual.team === 0) return false;
            
            return true;
        });
        console.log(`   Candidatos con criterios mínimos: ${candidatos.length}`);
    }
    
    return candidatos;
}

// ========== SOLUCIÓN 3: LOGGING DETALLADO PARA DEBUG ==========
function debugearCandidatos(equipoConMas, jugadoresAFK, funcionEsBot) {
    console.log('\\n🔍 DEBUGGING DETALLADO DE CANDIDATOS:');
    console.log('=====================================');
    
    equipoConMas.forEach((jugador, index) => {
        console.log(`\\n${index + 1}. JUGADOR: ${jugador.name} (ID: ${jugador.id})`);
        
        // Verificación 1: Jugador válido
        const esValido = jugador && typeof jugador.id !== 'undefined';
        console.log(`   ✓ Es válido: ${esValido ? '✅' : '❌'}`);
        
        // Verificación 2: No es bot
        const esBot = funcionEsBot(jugador);
        console.log(`   ✓ No es bot: ${!esBot ? '✅' : '❌'} (detectado como: ${esBot})`);
        
        // Verificación 3: No está AFK
        const estaAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
        console.log(`   ✓ No está AFK: ${!estaAFK ? '✅' : '❌'}`);
        if (estaAFK) {
            const datosAFK = jugadoresAFK.get(jugador.id);
            console.log(`     Datos AFK: ${JSON.stringify(datosAFK)}`);
        }
        
        // Verificación 4: Aún en equipo
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        const enEquipo = jugadorActual && jugadorActual.team !== 0;
        console.log(`   ✓ En equipo: ${enEquipo ? '✅' : '❌'} (team: ${jugadorActual?.team || 'N/A'})`);
        
        // Resultado final
        const candidatoValido = esValido && !esBot && !estaAFK && enEquipo;
        console.log(`   🎯 CANDIDATO VÁLIDO: ${candidatoValido ? '✅ SÍ' : '❌ NO'}`);
    });
    
    console.log('\\n=====================================');
}

// ========== FUNCIÓN PRINCIPAL DE FIX ==========
function aplicarFixBalanceCandidatos() {
    console.log('\\n🛠️ INICIANDO FIX PARA BALANCE DE CANDIDATOS...');
    
    return `
// ===============================================
// CÓDIGO MEJORADO PARA BOTLNBCODE.js
// Reemplazar desde línea ~4604 hasta ~4672
// ===============================================

// CORRECCIÓN: Verificar que esBot está definida y usar versión mejorada
let funcionEsBot = esBot;
if (typeof funcionEsBot !== 'function') {
    funcionEsBot = function(jugador) {
        if (!jugador || !jugador.name) return false;
        
        // Lista comprensiva de patrones para bots
        const patronesBots = [
            'HOST LNB',           // Bot principal
            '[BOT]',              // Bots marcados explícitamente
            'Bot',                // Bots con "Bot" en mayúsculas  
            'bot'                 // Bots con "bot" en minúsculas
        ];
        
        // Verificar ID especiales (0 = host)
        if (jugador.id === 0) return true;
        
        // Verificar nombres vacíos
        if (jugador.name === '') return true;
        
        // Verificar patrones en el nombre
        return patronesBots.some(patron => jugador.name.includes(patron));
    };
    console.log('⚠️ DEBUG balanceAutomaticoContinuo: Usando función esBot mejorada');
}

// CORRECCIÓN: Filtrar candidatos válidos con lógica de fallback mejorada
console.log('🔍 DEBUG balanceAutomaticoContinuo: Iniciando filtrado de candidatos...');

// Función auxiliar para debugging detallado
function debugearCandidatos(equipoConMas, jugadoresAFK, funcionEsBot) {
    console.log('🔍 DEBUG DETALLADO DE CANDIDATOS:');
    equipoConMas.forEach((jugador, index) => {
        const esValido = jugador && typeof jugador.id !== 'undefined';
        const esBot = funcionEsBot(jugador);
        const estaAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        const enEquipo = jugadorActual && jugadorActual.team !== 0;
        
        console.log('  ' + (index + 1) + '. ' + jugador.name + ': Válido=' + esValido + ', Bot=' + esBot + ', AFK=' + estaAFK + ', EnEquipo=' + enEquipo);
    });
}

// Debug inicial
debugearCandidatos(equipoConMas, jugadoresAFK, funcionEsBot);

// PASO 1: Filtrado normal con criterios estrictos
let candidatos = equipoConMas.filter(jugador => {
    // Verificar que el jugador existe y tiene las propiedades necesarias
    if (!jugador || typeof jugador.id === 'undefined') {
        console.log('🚫 DEBUG balanceAutomaticoContinuo: Jugador inválido detectado');
        return false;
    }
    
    // Verificar si es bot
    if (funcionEsBot(jugador)) {
        console.log('🚫 DEBUG balanceAutomaticoContinuo: Excluyendo bot ' + jugador.name + ' del balance');
        return false;
    }
    
    // Verificar si está AFK
    if (jugadoresAFK && jugadoresAFK.has(jugador.id)) {
        console.log('🚫 DEBUG balanceAutomaticoContinuo: Excluyendo ' + jugador.name + ' del balance (marcado como AFK)');
        return false;
    }
    
    // NUEVA VERIFICACIÓN: Asegurar que el jugador aún esté en el equipo correcto
    const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
    if (!jugadorActual || jugadorActual.team === 0) {
        console.log('🚫 DEBUG balanceAutomaticoContinuo: ' + jugador.name + ' ya no está en equipo, excluyendo');
        return false;
    }
    
    console.log('✅ DEBUG balanceAutomaticoContinuo: ' + jugador.name + ' es candidato válido');
    return true;
});

console.log('🎯 DEBUG balanceAutomaticoContinuo: Candidatos válidos (criterios estrictos): ' + candidatos.length + '/' + equipoConMas.length);

// PASO 2: Si no hay candidatos, aplicar lógica de fallback
if (candidatos.length === 0) {
    console.log('⚠️ DEBUG balanceAutomaticoContinuo: No hay candidatos con criterios estrictos, aplicando fallback...');
    
    // Fallback 1: Relajar criterio AFK
    candidatos = equipoConMas.filter(jugador => {
        if (!jugador || typeof jugador.id === 'undefined') return false;
        if (funcionEsBot(jugador)) return false;
        
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        if (!jugadorActual || jugadorActual.team === 0) return false;
        
        return true;
    });
    
    console.log('🔄 DEBUG balanceAutomaticoContinuo: Candidatos sin restricción AFK: ' + candidatos.length);
    
    // Fallback 2: Solo excluir bots muy obvios
    if (candidatos.length === 0) {
        console.log('⚠️ DEBUG balanceAutomaticoContinuo: Aplicando fallback final (solo bots obvios)...');
        
        candidatos = equipoConMas.filter(jugador => {
            if (!jugador || typeof jugador.id === 'undefined') return false;
            
            // Solo excluir HOST LNB e ID 0
            if (jugador.id === 0 || jugador.name === 'HOST LNB') return false;
            
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            if (!jugadorActual || jugadorActual.team === 0) return false;
            
            return true;
        });
        
        console.log('🔄 DEBUG balanceAutomaticoContinuo: Candidatos con criterios mínimos: ' + candidatos.length);
    }
}

console.log('🎯 DEBUG balanceAutomaticoContinuo: Candidatos FINALES válidos: ' + candidatos.length + '/' + equipoConMas.length);
candidatos.forEach(c => console.log('  - ' + c.name + ' (ID: ' + c.id + ', Team: ' + c.team + ')'));

// CORRECCIÓN CRÍTICA: Verificar que hay candidatos antes de continuar
if (candidatos.length === 0) {
    console.log('⚠️ DEBUG balanceAutomaticoContinuo: NO HAY candidatos válidos después de todos los fallbacks');
    console.log('📊 DEBUG balanceAutomaticoContinuo: Estado AFK: ' + (jugadoresAFK ? Array.from(jugadoresAFK.keys()).join(', ') : 'N/A'));
    
    // Mostrar información detallada para debug
    equipoConMas.forEach(jugador => {
        const esBot = funcionEsBot(jugador);
        const esAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        const enEquipo = jugadorActual && jugadorActual.team !== 0;
        console.log('   ' + jugador.name + ': Bot=' + esBot + ', AFK=' + esAFK + ', EnEquipo=' + enEquipo);
    });
    
    // PROBLEMA DETECTADO: Informar según la causa más probable
    const todosBots = equipoConMas.every(j => funcionEsBot(j));
    const todosAFK = equipoConMas.every(j => jugadoresAFK && jugadoresAFK.has(j.id));
    
    if (todosBots) {
        anunciarGeneral('⚖️ ❌ No se puede equilibrar: todos los jugadores del equipo mayor son bots', "FFA500", "normal");
    } else if (todosAFK) {
        anunciarGeneral('⚖️ ❌ No se puede equilibrar: todos los jugadores del equipo mayor están AFK', "FFA500", "normal");
    } else {
        anunciarGeneral('⚖️ ❌ No se puede equilibrar: jugadores no disponibles para balance', "FFA500", "normal");
    }
    
    return false;
}

// Continuar con el resto del código de balance normal...
`;
}

// ========== EJECUTAR FIX ==========
const codigoCorregido = aplicarFixBalanceCandidatos();
console.log(codigoCorregido);

console.log('\\n✅ FIX GENERADO CORRECTAMENTE');
console.log('\\n📋 INSTRUCCIONES:');
console.log('1. Reemplazar el código en BOTLNBCODE.js (líneas ~4604-4672)');
console.log('2. Reiniciar el bot para aplicar los cambios');
console.log('3. Probar con un escenario 4v2 para verificar la corrección');

module.exports = {
    esBotMejoradoDefinitivo,
    obtenerCandidatosFallback,
    debugearCandidatos,
    aplicarFixBalanceCandidatos
};
