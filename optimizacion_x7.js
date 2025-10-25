/**
 * 🎯 PARCHE DE OPTIMIZACIÓN PARA X7 - ANTI-LAG
 * 
 * Este parche optimiza específicamente el rendimiento cuando se juega en biggerx7
 * para reducir los tirones y mejorar la fluidez del juego.
 * 
 * PROBLEMAS IDENTIFICADOS:
 * - Timeouts excesivos encadenados (30ms + 150ms + 500ms + 1000ms + 2000ms)
 * - Verificaciones de mapa muy frecuentes (cada 10s con 12+ jugadores)
 * - Auto-balance constante durante partidos x7
 * 
 * OPTIMIZACIONES APLICADAS:
 * - Intervalos más largos para x7 (menos verificaciones = menos lag)
 * - Timeouts unificados y simplificados
 * - Cache especial para estados de x7
 * - Pausas inteligentes durante partidos x7
 */

console.log('🎯 CARGANDO PARCHE DE OPTIMIZACIÓN X7...');

// Variables de optimización para x7
let ultimaOptimizacionX7 = 0;
let cacheEstadoX7 = null;
let pausarVerificacionesX7 = false;

// OVERRIDE: Función optimizada para calcular intervalos en x7
const calcularIntervaloOptimoOriginal = window.calcularIntervaloOptimo || calcularIntervaloOptimo;

window.calcularIntervaloOptimo = function(numeroJugadores) {
    // Si estamos en x7, usar intervalos más largos para reducir lag
    if (typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
        console.log('🎯 Aplicando intervalos optimizados para x7');
        
        if (numeroJugadores >= 12) return 25000;  // 25s en lugar de 10s (reducción 60%)
        if (numeroJugadores >= 8) return 20000;   // 20s en lugar de 12s
        return 15000;                             // 15s para casos menores
    }
    
    // Para otros mapas, usar la función original
    return calcularIntervaloOptimoOriginal ? calcularIntervaloOptimoOriginal(numeroJugadores) : 15000;
};

// OVERRIDE: Función optimizada para calcular intervalos de mapa en x7
const calcularIntervaloMapaOriginal = window.calcularIntervaloMapa || calcularIntervaloMapa;

window.calcularIntervaloMapa = function(partidoEnCurso, numeroJugadores) {
    // Optimización específica para x7
    if (typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
        console.log('🎯 Aplicando intervalos de mapa optimizados para x7');
        
        if (partidoEnCurso && numeroJugadores >= 12) return 35000;  // 35s durante partido x7 (antes 20s)
        if (partidoEnCurso) return 30000;                          // 30s durante partido normal
        if (numeroJugadores >= 12) return 40000;                   // 40s sin partido, muchos jugadores
        return 35000;                                               // 35s por defecto para x7
    }
    
    // Para otros mapas, usar función original
    return calcularIntervaloMapaOriginal ? calcularIntervaloMapaOriginal(partidoEnCurso, numeroJugadores) : 30000;
};

// OVERRIDE: Mezcla de equipos optimizada para x7
const mezclarEquiposAleatoriamenteOriginal = window.mezclarEquiposAleatoriamente || mezclarEquiposAleatoriamente;

window.mezclarEquiposAleatoriamente = function() {
    // En x7, usar timeouts más espaciados para evitar tirones
    if (typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
        console.log('🎯 Aplicando mezcla optimizada para x7 (timeouts reducidos)');
        
        const todosJugadores = room.getPlayerList().filter(j => !esBot(j));
        const jugadoresEnEquipos = todosJugadores.filter(j => j.team === 1 || j.team === 2);
        
        if (jugadoresEnEquipos.length < 2) {
            anunciarInfo("⚠️ Se necesitan al menos 2 jugadores en equipos para mezclar");
            return;
        }
        
        anunciarGeneral("🔄 ⚡ MEZCLANDO EQUIPOS... ⚡ 🔄", "FFD700", "bold");
        
        // Guardar IDs y mover a espectadores
        const idsJugadoresAMezclar = jugadoresEnEquipos.map(j => j.id);
        jugadoresEnEquipos.forEach(jugador => {
            room.setPlayerTeam(jugador.id, 0);
        });
        
        // OPTIMIZACIÓN X7: Un solo timeout en lugar de múltiples encadenados
        setTimeout(() => {
            const jugadoresParaMezclar = room.getPlayerList().filter(j => 
                !esBot(j) && idsJugadoresAMezclar.includes(j.id)
            );
            
            if (jugadoresParaMezclar.length < 2) {
                anunciarInfo("⚠️ No hay suficientes jugadores para mezclar");
                return;
            }
            
            // Mezclar usando Fisher-Yates
            const jugadoresMezclados = [...jugadoresParaMezclar];
            for (let i = jugadoresMezclados.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [jugadoresMezclados[i], jugadoresMezclados[j]] = [jugadoresMezclados[j], jugadoresMezclados[i]];
            }
            
            // Asignar equipos de manera directa sin verificaciones intermedias
            const mitad = Math.ceil(jugadoresMezclados.length / 2);
            mezclaProcesandose = true;
            
            // Asignar todos al rojo primero
            for (let i = 0; i < mitad && i < jugadoresMezclados.length; i++) {
                room.setPlayerTeam(jugadoresMezclados[i].id, 1);
            }
            
            // Luego asignar todos al azul
            for (let i = mitad; i < jugadoresMezclados.length; i++) {
                room.setPlayerTeam(jugadoresMezclados[i].id, 2);
            }
            
            mezclaProcesandose = false;
            anunciarGeneral("🔒 Equipos formados. Solo puedes usar !afk para salir o !back para volver", "FFA500", "bold");
            
            // OPTIMIZACIÓN X7: Verificación única y simplificada
            setTimeout(() => {
                console.log('🎯 Verificación post-mezcla x7 completada');
                setTimeout(() => {
                    verificarAutoStart();
                }, 500); // Un solo timeout de verificación
            }, 800);
            
        }, 800); // Timeout unificado más largo para x7 (antes eran múltiples timeouts cortos)
        
        return;
    }
    
    // Para otros mapas, usar función original
    if (mezclarEquiposAleatoriamenteOriginal) {
        mezclarEquiposAleatoriamenteOriginal();
    }
};

// OVERRIDE: Verificación de auto start optimizada para x7
const verificarAutoStartOriginal = window.verificarAutoStart || verificarAutoStart;

window.verificarAutoStart = function() {
    // En x7, reducir la frecuencia de verificaciones para evitar lag
    if (typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
        const ahora = Date.now();
        
        // Cache de estado para evitar verificaciones innecesarias
        if (cacheEstadoX7 && (ahora - ultimaOptimizacionX7) < 3000) {
            console.log('🎯 Usando cache de estado x7, saltando verificación');
            return;
        }
        
        ultimaOptimizacionX7 = ahora;
        cacheEstadoX7 = true;
        
        // Limpiar cache después de 5 segundos
        setTimeout(() => {
            cacheEstadoX7 = null;
        }, 5000);
    }
    
    // Llamar función original
    if (verificarAutoStartOriginal) {
        verificarAutoStartOriginal();
    }
};

// FUNCIÓN: Pausar temporalmente verificaciones durante partidos x7 intensos
function pausarVerificacionesX7Temporal(duracion = 10000) {
    if (typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
        console.log('🎯 Pausando verificaciones x7 por lag durante', duracion, 'ms');
        pausarVerificacionesX7 = true;
        
        setTimeout(() => {
            pausarVerificacionesX7 = false;
            console.log('🎯 Reanudando verificaciones x7');
        }, duracion);
    }
}

// OVERRIDE: Detectar cambio de mapa optimizado para x7
const detectarCambioMapaOriginal = window.detectarCambioMapa || detectarCambioMapa;

window.detectarCambioMapa = function() {
    // Si estamos pausados para x7, no ejecutar
    if (pausarVerificacionesX7 && typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
        return;
    }
    
    // Llamar función original
    if (detectarCambioMapaOriginal) {
        detectarCambioMapaOriginal();
    }
};

// EVENTO: Detectar cuando se inicia un partido en x7 para aplicar optimizaciones
const onGameStartOriginal = window.room?.onGameStart || function() {};
if (window.room) {
    window.room.onGameStart = function() {
        if (typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
            console.log('🎯 PARTIDO X7 INICIADO - Aplicando optimizaciones anti-lag');
            
            // Pausar verificaciones durante los primeros 15 segundos del partido
            pausarVerificacionesX7Temporal(15000);
            
            // Anunciar optimización
            setTimeout(() => {
                anunciarInfo("🎯 Modo x7 optimizado activo - Menos verificaciones para mejor rendimiento");
            }, 2000);
        }
        
        // Llamar evento original
        if (onGameStartOriginal) {
            onGameStartOriginal();
        }
    };
}

// FUNCIÓN PÚBLICA: Activar modo turbo para x7 (menos verificaciones)
window.activarModoTurboX7 = function() {
    if (typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
        console.log('🚀 ACTIVANDO MODO TURBO X7');
        
        // Pausar verificaciones por 30 segundos
        pausarVerificacionesX7Temporal(30000);
        
        anunciarGeneral("🚀 MODO TURBO X7 ACTIVADO - Rendimiento optimizado por 30s", "00FF00", "bold");
    } else {
        anunciarInfo("ℹ️ Modo turbo solo disponible en cancha x7");
    }
};

// FUNCIÓN PÚBLICA: Diagnosticar rendimiento en x7
window.diagnosticarRendimientoX7 = function() {
    if (typeof mapaActual === 'undefined') {
        console.log('❌ Variable mapaActual no disponible');
        return;
    }
    
    console.log('🔍 ==================== DIAGNÓSTICO RENDIMIENTO X7 ====================');
    console.log(`   Mapa actual: ${mapaActual}`);
    console.log(`   Es x7: ${mapaActual === 'biggerx7'}`);
    console.log(`   Optimizaciones activas: ${mapaActual === 'biggerx7' ? 'SÍ' : 'NO'}`);
    console.log(`   Verificaciones pausadas: ${pausarVerificacionesX7}`);
    console.log(`   Cache estado activo: ${cacheEstadoX7 !== null}`);
    
    if (typeof room !== 'undefined' && room) {
        const jugadores = room.getPlayerList();
        const activos = jugadores.filter(j => j.team === 1 || j.team === 2);
        console.log(`   Jugadores activos: ${activos.length}`);
        console.log(`   Total en sala: ${jugadores.length}`);
        
        if (mapaActual === 'biggerx7') {
            console.log('🎯 RECOMENDACIONES PARA X7:');
            console.log('   - Intervalos optimizados están activos');
            console.log('   - Usa activarModoTurboX7() si hay mucho lag');
            console.log('   - Cache de estado reduce verificaciones innecesarias');
        }
    }
    
    console.log('🔍 ===============================================================');
};

// AUTO-ACTIVACIÓN: Si ya estamos en x7, aplicar optimizaciones inmediatamente
setTimeout(() => {
    if (typeof mapaActual !== 'undefined' && mapaActual === 'biggerx7') {
        console.log('🎯 Ya estamos en x7 - Aplicando optimizaciones automáticamente');
        anunciarInfo("🎯 Optimizaciones x7 aplicadas automáticamente para mejor rendimiento");
    }
}, 3000);

console.log('✅ PARCHE DE OPTIMIZACIÓN X7 CARGADO');
console.log('📖 Funciones disponibles:');
console.log('   - activarModoTurboX7() - Pausar verificaciones por 30s');
console.log('   - diagnosticarRendimientoX7() - Ver estado de optimizaciones');
console.log('🎯 Las optimizaciones se activan automáticamente en biggerx7');