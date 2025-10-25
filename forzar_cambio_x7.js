/**
 * 🔧 SCRIPT PARA FORZAR CAMBIO A X7 Y DIAGNOSTICAR
 * 
 * Este script permite:
 * 1. Diagnosticar por qué no funciona el cambio automático
 * 2. Forzar manualmente el cambio a x7
 * 3. Verificar el estado de todas las variables importantes
 */

console.log('🔧 SCRIPT DE FUERZA Y DIAGNÓSTICO CARGADO');

// Función principal de diagnóstico
function diagnosticarEstado() {
    console.log('🔍 ==================== DIAGNÓSTICO COMPLETO ====================');
    
    // 1. Verificar room
    console.log('\n📋 1. VERIFICACIÓN DE ROOM:');
    if (typeof room === 'undefined' || room === null) {
        console.log('❌ PROBLEMA: room no está definido o es null');
        return false;
    } else {
        console.log('✅ room está disponible');
        
        try {
            const playerList = room.getPlayerList();
            console.log(`✅ room.getPlayerList() funciona - ${playerList.length} jugadores totales`);
        } catch (error) {
            console.log('❌ ERROR: room.getPlayerList() falló:', error);
            return false;
        }
    }
    
    // 2. Verificar variables críticas
    console.log('\n🗺️ 2. VERIFICACIÓN DE VARIABLES DE MAPA:');
    console.log(`   mapaActual: ${typeof mapaActual !== 'undefined' ? `"${mapaActual}"` : 'UNDEFINED'}`);
    console.log(`   cambioMapaEnProceso: ${typeof cambioMapaEnProceso !== 'undefined' ? cambioMapaEnProceso : 'UNDEFINED'}`);
    
    // 3. Verificar funciones necesarias
    console.log('\n⚙️ 3. VERIFICACIÓN DE FUNCIONES:');
    console.log(`   cambiarMapa: ${typeof cambiarMapa === 'function' ? 'DISPONIBLE' : 'NO DISPONIBLE'}`);
    console.log(`   verificarCambioMapaPostPartido: ${typeof verificarCambioMapaPostPartido === 'function' ? 'DISPONIBLE' : 'NO DISPONIBLE'}`);
    
    // 4. Verificar jugadores
    console.log('\n👥 4. ANÁLISIS DE JUGADORES:');
    const jugadores = room.getPlayerList();
    const activos = jugadores.filter(j => j.team === 1 || j.team === 2);
    const espectadores = jugadores.filter(j => j.team === 0);
    
    console.log(`   Total en sala: ${jugadores.length}`);
    console.log(`   Jugadores activos: ${activos.length}`);
    console.log(`   Espectadores: ${espectadores.length}`);
    
    // Mostrar detalle
    console.log('\n📊 DETALLE DE JUGADORES:');
    jugadores.forEach(j => {
        const tipo = j.team === 0 ? '⚪ SPEC' : j.team === 1 ? '🔴 ROJO' : '🔵 AZUL';
        console.log(`   ${tipo} ${j.name} (ID: ${j.id})`);
    });
    
    // 5. Verificar condiciones para cambio
    console.log('\n🎯 5. ANÁLISIS DE CONDICIONES PARA CAMBIO:');
    
    const condicion1 = typeof mapaActual !== 'undefined' && mapaActual === 'biggerx5';
    const condicion2 = activos.length >= 12;
    
    console.log(`   Condición 1 - Mapa es biggerx5: ${condicion1} (actual: "${mapaActual}")`);
    console.log(`   Condición 2 - 12+ jugadores activos: ${condicion2} (actual: ${activos.length})`);
    console.log(`   RESULTADO: ${condicion1 && condicion2 ? '✅ DEBERÍA CAMBIAR' : '❌ NO DEBE CAMBIAR'}`);
    
    // 6. Verificar estadísticas de partido
    console.log('\n📈 6. VERIFICACIÓN DE ESTADÍSTICAS:');
    if (typeof estadisticasPartido === 'undefined' || !estadisticasPartido) {
        console.log('❌ PROBLEMA: estadisticasPartido no está inicializado');
        console.log('ℹ️  Esto puede explicar por qué no se ejecuta verificarCambioMapaPostPartido()');
    } else {
        console.log('✅ estadisticasPartido existe');
        console.log(`   iniciado: ${estadisticasPartido.iniciado}`);
        
        if (!estadisticasPartido.iniciado) {
            console.log('⚠️  POSIBLE PROBLEMA: estadisticasPartido.iniciado es false');
            console.log('ℹ️  verificarCambioMapaPostPartido() solo se ejecuta si estadisticasPartido.iniciado es true');
        }
    }
    
    console.log('\n🔍 ==================== FIN DIAGNÓSTICO ====================\n');
    
    return {
        roomOk: true,
        mapaActual: mapaActual,
        jugadoresActivos: activos.length,
        deberiaeCambiar: condicion1 && condicion2,
        estadisticasOk: typeof estadisticasPartido !== 'undefined' && estadisticasPartido && estadisticasPartido.iniciado
    };
}

// Función para forzar cambio manual
function forzarCambioX7() {
    console.log('🚀 ==================== FORZANDO CAMBIO A X7 ====================');
    
    const diagnostico = diagnosticarEstado();
    
    if (!diagnostico.roomOk) {
        console.log('❌ No se puede forzar - room no disponible');
        return false;
    }
    
    console.log(`\n🎯 INTENTANDO CAMBIO FORZADO...`);
    
    // Verificar si la función cambiarMapa existe
    if (typeof cambiarMapa !== 'function') {
        console.log('❌ ERROR: Función cambiarMapa no está disponible');
        console.log('💡 SOLUCIÓN: Asegúrate de que el bot esté completamente cargado');
        return false;
    }
    
    // Intentar cambio
    console.log('🔧 Ejecutando cambiarMapa("biggerx7")...');
    
    try {
        const resultado = cambiarMapa("biggerx7");
        
        if (resultado) {
            console.log('✅ ÉXITO: Cambio forzado a x7 completado');
            
            // Verificar que realmente cambió
            setTimeout(() => {
                console.log(`🔍 Verificación post-cambio: mapaActual = "${mapaActual}"`);
                if (mapaActual === "biggerx7") {
                    console.log('✅ CONFIRMADO: El mapa cambió correctamente a x7');
                } else {
                    console.log('⚠️  ADVERTENCIA: mapaActual no se actualizó a biggerx7');
                }
            }, 1000);
            
            return true;
        } else {
            console.log('❌ FALLO: cambiarMapa() retornó false');
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR al ejecutar cambiarMapa():', error);
        return false;
    }
}

// Función para simular fin de partido y verificar
function simularFinPartido() {
    console.log('🎮 ==================== SIMULANDO FIN DE PARTIDO ====================');
    
    const diagnostico = diagnosticarEstado();
    
    if (!diagnostico.roomOk) {
        console.log('❌ No se puede simular - room no disponible');
        return false;
    }
    
    console.log('\n🏁 Simulando onGameStop...');
    
    // Simular el flujo de onGameStop
    if (typeof estadisticasPartido !== 'undefined' && estadisticasPartido && estadisticasPartido.iniciado) {
        console.log('✅ estadisticasPartido.iniciado es true - Se ejecutaría verificarCambioMapaPostPartido');
        
        if (typeof verificarCambioMapaPostPartido === 'function') {
            console.log('🔧 Ejecutando verificarCambioMapaPostPartido()...');
            setTimeout(() => {
                verificarCambioMapaPostPartido();
            }, 1000); // Simular el timeout de 1000ms del código real
        } else {
            console.log('❌ verificarCambioMapaPostPartido no está disponible');
        }
    } else {
        console.log('❌ estadisticasPartido no inicializado - NO se ejecutaría verificarCambioMapaPostPartido');
        console.log('💡 POSIBLE SOLUCIÓN: Asegúrate de que haya estadísticas de partido iniciadas');
    }
}

// Función para inicializar estadísticas manualmente
function forzarInicializarEstadisticas() {
    console.log('📊 ==================== FORZANDO INICIALIZACIÓN DE ESTADÍSTICAS ====================');
    
    if (typeof inicializarEstadisticas === 'function') {
        console.log('🔧 Ejecutando inicializarEstadisticas()...');
        inicializarEstadisticas();
        console.log('✅ inicializarEstadisticas() ejecutado');
        
        // Verificar resultado
        setTimeout(() => {
            if (typeof estadisticasPartido !== 'undefined' && estadisticasPartido && estadisticasPartido.iniciado) {
                console.log('✅ ÉXITO: estadisticasPartido ahora está iniciado');
            } else {
                console.log('⚠️  estadisticasPartido aún no está iniciado correctamente');
            }
        }, 500);
    } else {
        console.log('❌ Función inicializarEstadisticas no está disponible');
        
        // Crear estadísticas básicas manualmente
        console.log('🔧 Creando estadísticas básicas manualmente...');
        if (typeof estadisticasPartido === 'undefined' || !estadisticasPartido) {
            window.estadisticasPartido = {
                iniciado: true,
                duracion: 0,
                jugadores: {},
                tiempoEsperaSaque: 0
            };
            console.log('✅ estadisticasPartido creado manualmente');
        } else {
            estadisticasPartido.iniciado = true;
            console.log('✅ estadisticasPartido.iniciado establecido a true');
        }
    }
}

// Funciones disponibles globalmente
window.diagnosticar = diagnosticarEstado;
window.forzarX7 = forzarCambioX7;
window.simularFin = simularFinPartido;
window.forzarStats = forzarInicializarEstadisticas;

// Función completa de solución
window.solucionarCambioMapa = function() {
    console.log('🛠️ ==================== SOLUCIÓN COMPLETA ====================');
    
    const diagnostico = diagnosticarEstado();
    
    if (diagnostico.deberiaeCambiar) {
        console.log('✅ Las condiciones están cumplidas para cambio a x7');
        
        if (!diagnostico.estadisticasOk) {
            console.log('🔧 Paso 1: Inicializando estadísticas...');
            forzarInicializarEstadisticas();
            
            setTimeout(() => {
                console.log('🔧 Paso 2: Simulando fin de partido...');
                simularFinPartido();
            }, 1000);
        } else {
            console.log('🔧 Simulando fin de partido directamente...');
            simularFinPartido();
        }
        
        // Como respaldo, forzar cambio directo
        setTimeout(() => {
            if (typeof mapaActual !== 'undefined' && mapaActual !== 'biggerx7') {
                console.log('🚨 Como respaldo, forzando cambio directo...');
                forzarCambioX7();
            }
        }, 3000);
    } else {
        console.log('❌ Las condiciones no están cumplidas para cambio a x7');
        
        if (diagnostico.jugadoresActivos >= 12) {
            console.log('🚨 PERO tienes 12+ jugadores - forzando cambio directo...');
            forzarCambioX7();
        }
    }
};

console.log('\n🛠️ =============== FUNCIONES DISPONIBLES ===============');
console.log('📊 diagnosticar() - Muestra estado completo del sistema');
console.log('🚀 forzarX7() - Fuerza cambio directo a x7');
console.log('🎮 simularFin() - Simula fin de partido para activar cambio');
console.log('📈 forzarStats() - Fuerza inicialización de estadísticas');
console.log('🛠️ solucionarCambioMapa() - Ejecuta solución completa automática');
console.log('==================================================\n');

// Ejecutar diagnóstico inicial
setTimeout(() => {
    console.log('🔍 DIAGNÓSTICO INICIAL:');
    diagnosticarEstado();
}, 2000);
