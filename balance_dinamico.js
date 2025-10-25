/**
 * SISTEMA DE BALANCE DINÁMICO PARA LNB
 * Este módulo implementa un sistema de balance automático más robusto y flexible
 * que puede manejar cualquier configuración de jugadores y determinar
 * la mejor distribución posible.
 */

// FUNCIONES DE BALANCE DINÁMICO

/**
 * Función principal de balance dinámico que maneja cualquier configuración de equipos
 * @param {string} motivo - Razón para el balance (salida, desconexión, manual, etc.)
 * @param {boolean} forzar - Si se debe forzar el balance incluso con diferencia <= 1
 * @returns {boolean} - true si se realizó algún balance, false si no
 */
function balanceDinamico(motivo = "balance automático", forzar = false) {
    if (typeof room === 'undefined' || !room || !room.getPlayerList) {
        console.warn('⚠️ Room no disponible para balanceDinamico');
        return false;
    }
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const { rojo, azul, diferencia, jugadoresRojo, jugadoresAzul } = equipos;
    
    console.log(`⚖️ DEBUG balanceDinamico (${motivo}): Rojo=${rojo}, Azul=${azul}, Diferencia=${diferencia}, Forzar=${forzar}`);
    
    // Si no hay jugadores en equipos o solo hay uno, no hacer nada
    if ((rojo + azul) <= 1) {
        console.log(`✅ DEBUG: Muy pocos jugadores (${rojo + azul}) - sin balance necesario`);
        return false;
    }
    
    // Si la diferencia es 0 o 1, y no se fuerza el balance, mantener equilibrio actual
    if (diferencia <= 1 && !forzar) {
        console.log(`✅ DEBUG: Equipos ya equilibrados (diferencia ${diferencia} ≤ 1) - no se requiere balance`);
        return false;
    }
    
    // CASO ESPECIAL: Un equipo completamente vacío -> mezcla completa (solo fuera de partidos)
    const equipoVacio = rojo === 0 || azul === 0;
    if (equipoVacio && (rojo + azul) >= 2 && !partidoEnCurso) {
        console.log(`🔥 DEBUG: Aplicando mezcla completa por equipo vacío`);
        anunciarGeneral(`🔄 ⚡ REORGANIZANDO EQUIPOS (equipo vacío)... ⚡ 🔄`, "FFD700", "bold");
        
        setTimeout(() => {
            mezclarEquiposAleatoriamente();
        }, 300);
        
        return true;
    }
    
    // Determinar equipo mayor y menor
    const equipoMayor = rojo > azul ? jugadoresRojo : jugadoresAzul;
    const equipoMayorEnum = rojo > azul ? 1 : 2;
    const equipoMenorEnum = rojo > azul ? 2 : 1;
    const equipoMayorNombre = equipoMayorEnum === 1 ? 'ROJO' : 'AZUL';
    const equipoMenorNombre = equipoMenorEnum === 1 ? 'ROJO' : 'AZUL';
    
    // Filtrar candidatos válidos para mover (excluir bots y AFK)
    const candidatos = equipoMayor.filter(p => {
        if (esBot(p)) return false;
        if (jugadoresAFK.has(p.id)) {
            console.log(`🚫 DEBUG: Excluyendo del balance a ${p.name} (marcado como AFK)`);
            return false;
        }
        return true;
    });
    
    if (candidatos.length === 0) {
        console.log(`⚠️ DEBUG: No hay candidatos válidos para balance dinámico`);
        return false;
    }
    
    // CÁLCULO INTELIGENTE: Determinar cuántos jugadores mover
    // Objetivo: minimizar la diferencia final entre equipos
    const totalJugadores = rojo + azul;
    const equipoMayorSize = equipoMayorEnum === 1 ? rojo : azul;
    const equipoMenorSize = equipoMayorEnum === 1 ? azul : rojo;
    
    // Calcular el número óptimo de jugadores para equilibrar
    let jugadoresAMover = calcularJugadoresOptimosAMover(equipoMayorSize, equipoMenorSize, totalJugadores);
    
    // Limitar por la cantidad de candidatos disponibles
    jugadoresAMover = Math.min(jugadoresAMover, candidatos.length);
    
    console.log(`⚖️ DEBUG: Balance dinámico - moviendo ${jugadoresAMover} jugador(es) del equipo ${equipoMayorNombre} al ${equipoMenorNombre}`);
    
    // Si no hay jugadores a mover, no hacer nada
    if (jugadoresAMover <= 0) {
        console.log(`✅ DEBUG: No se requiere mover jugadores para el balance óptimo`);
        return false;
    }
    
    // Casos especiales para configuraciones comunes
    mostrarMensajeBalanceEspecial(rojo, azul, jugadoresAMover);
    
    // Mover los jugadores necesarios para equilibrar
    const jugadoresMovidos = [];
    
    // Mezclar aleatoriamente la lista de candidatos para hacer selección imparcial
    const candidatosAleatorizados = [...candidatos].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < jugadoresAMover; i++) {
        const candidatoElegido = candidatosAleatorizados[i];
        
        // Verificar que el jugador sigue conectado
        const jugadorActual = room.getPlayerList().find(j => j.id === candidatoElegido.id);
        if (!jugadorActual) {
            console.log(`⚠️ DEBUG: ${candidatoElegido.name} ya no está conectado, omitiendo`);
            continue;
        }
        
        // Marcar movimiento como iniciado por el bot
        movimientoIniciadorPorBot.add(candidatoElegido.id);
        
        // Mover jugador
        room.setPlayerTeam(candidatoElegido.id, equipoMenorEnum);
        jugadoresMovidos.push(candidatoElegido.name);
        
        const equipoDestinoNombre = equipoMenorEnum === 1 ? '🔴 ROJO' : '🔵 AZUL';
        
        // Mensaje indicando el balance automático
        if (partidoEnCurso) {
            anunciarGeneral(`⚖️ 🔄 Auto Balance: ${candidatoElegido.name} → ${equipoDestinoNombre} (${i+1}/${jugadoresAMover})`, "FFD700", "bold");
        } else {
            anunciarGeneral(`⚖️ 🔄 Balance: ${candidatoElegido.name} → ${equipoDestinoNombre}`, "87CEEB", "bold");
        }
        
        // Pequeño delay entre movimientos para evitar conflictos
        if (i < jugadoresAMover - 1) {
            console.log(`💫 DEBUG: Delay aplicado entre movimientos de balance`);
        }
    }
    
    // Programar verificación post-balance
    setTimeout(() => {
        const equiposPostBalance = obtenerCantidadJugadoresPorEquipo();
        console.log(`📊 DEBUG Post-balance dinámico: Rojo=${equiposPostBalance.rojo}, Azul=${equiposPostBalance.azul}, Diferencia=${equiposPostBalance.diferencia}`);
        
        // Si aún hay diferencia mayor a 1 y no era una diferencia muy grande inicialmente, intentar corregir
        if (equiposPostBalance.diferencia > 1 && diferencia < 4 && equiposPostBalance.rojo > 0 && equiposPostBalance.azul > 0) {
            console.log(`🔄 DEBUG: Aún hay diferencia mayor a 1, programando un nuevo balance`);
            setTimeout(() => {
                balanceDinamico(`segundo intento tras ${motivo}`, true);
            }, 1000);
        }
    }, 500);
    
    return jugadoresMovidos.length > 0;
}

/**
 * Calcula el número óptimo de jugadores a mover para equilibrar los equipos
 * VERSIÓN MEJORADA que cubre TODOS los casos posibles dinámicamente
 * @param {number} equipoMayorSize - Cantidad de jugadores en el equipo con más jugadores
 * @param {number} equipoMenorSize - Cantidad de jugadores en el equipo con menos jugadores
 * @param {number} totalJugadores - Total de jugadores en ambos equipos
 * @returns {number} - Número óptimo de jugadores a mover
 */
function calcularJugadoresOptimosAMover(equipoMayorSize, equipoMenorSize, totalJugadores) {
    const diferenciaEquipos = equipoMayorSize - equipoMenorSize;
    
    // Si no hay diferencia significativa, no mover nada
    if (diferenciaEquipos <= 1) {
        return 0;
    }
    
    // FÓRMULA BASE: Mover la mitad de la diferencia (redondeado hacia abajo)
    let jugadoresAMover = Math.floor(diferenciaEquipos / 2);
    
    // CASOS ESPECIALES OPTIMIZADOS para obtener el mejor equilibrio posible
    
    // Casos básicos pequeños
    if (equipoMayorSize === 3 && equipoMenorSize === 1) {
        jugadoresAMover = 1; // 3v1 → 2v2 (perfecto)
    } else if (equipoMayorSize === 4 && equipoMenorSize === 2) {
        jugadoresAMover = 1; // 4v2 → 3v3 (perfecto)
    } 
    
    // Casos con 5 jugadores en equipo mayor
    else if (equipoMayorSize === 5 && equipoMenorSize === 1) {
        jugadoresAMover = 2; // 5v1 → 3v3 (perfecto)
    } else if (equipoMayorSize === 5 && equipoMenorSize === 2) {
        jugadoresAMover = 1; // 5v2 → 4v3 (diferencia mínima)
    } else if (equipoMayorSize === 5 && equipoMenorSize === 3) {
        jugadoresAMover = 1; // 5v3 → 4v4 (perfecto)
    }
    
    // Casos con 6 jugadores en equipo mayor
    else if (equipoMayorSize === 6 && equipoMenorSize === 2) {
        jugadoresAMover = 2; // 6v2 → 4v4 (perfecto)
    } else if (equipoMayorSize === 6 && equipoMenorSize === 4) {
        jugadoresAMover = 1; // 6v4 → 5v5 (perfecto)
    }
    
    // Casos con 7 jugadores en equipo mayor
    else if (equipoMayorSize === 7 && equipoMenorSize === 1) {
        jugadoresAMover = 3; // 7v1 → 4v4 (perfecto)
    } else if (equipoMayorSize === 7 && equipoMenorSize === 3) {
        jugadoresAMover = 2; // 7v3 → 5v5 (perfecto)
    } else if (equipoMayorSize === 7 && equipoMenorSize === 5) {
        jugadoresAMover = 1; // 7v5 → 6v6 (perfecto)
    }
    
    // Casos con 8 jugadores en equipo mayor
    else if (equipoMayorSize === 8 && equipoMenorSize === 2) {
        jugadoresAMover = 3; // 8v2 → 5v5 (perfecto)
    } else if (equipoMayorSize === 8 && equipoMenorSize === 4) {
        jugadoresAMover = 2; // 8v4 → 6v6 (perfecto)
    } else if (equipoMayorSize === 8 && equipoMenorSize === 6) {
        jugadoresAMover = 1; // 8v6 → 7v7 (perfecto)
    }
    
    // Casos con 9 jugadores en equipo mayor
    else if (equipoMayorSize === 9 && equipoMenorSize === 1) {
        jugadoresAMover = 4; // 9v1 → 5v5 (perfecto)
    } else if (equipoMayorSize === 9 && equipoMenorSize === 3) {
        jugadoresAMover = 3; // 9v3 → 6v6 (perfecto)
    } else if (equipoMayorSize === 9 && equipoMenorSize === 5) {
        jugadoresAMover = 2; // 9v5 → 7v7 (perfecto)
    } else if (equipoMayorSize === 9 && equipoMenorSize === 7) {
        jugadoresAMover = 1; // 9v7 → 8v8 (perfecto)
    }
    
    // Casos con 10 jugadores en equipo mayor
    else if (equipoMayorSize === 10 && equipoMenorSize === 2) {
        jugadoresAMover = 4; // 10v2 → 6v6 (perfecto)
    } else if (equipoMayorSize === 10 && equipoMenorSize === 4) {
        jugadoresAMover = 3; // 10v4 → 7v7 (perfecto)
    } else if (equipoMayorSize === 10 && equipoMenorSize === 6) {
        jugadoresAMover = 2; // 10v6 → 8v8 (perfecto)
    } else if (equipoMayorSize === 10 && equipoMenorSize === 8) {
        jugadoresAMover = 1; // 10v8 → 9v9 (perfecto)
    }
    
    // CASOS EXTREMOS: Para diferencias muy grandes, usar fórmula dinámica
    else if (diferenciaEquipos > 8) {
        // Para casos extremos, mover suficientes jugadores para lograr equilibrio cerca del ideal
        const ideal = Math.round(totalJugadores / 2);
        jugadoresAMover = equipoMayorSize - ideal;
        
        // Limitar para evitar movimientos extremos
        if (jugadoresAMover > Math.floor(equipoMayorSize * 0.7)) {
            jugadoresAMover = Math.floor(equipoMayorSize * 0.7);
        }
        
        // Asegurar al menos 1 movimiento
        if (jugadoresAMover < 1) {
            jugadoresAMover = 1;
        }
    }
    
    // VALIDACIÓN FINAL: Asegurar que siempre se mueva al menos 1 jugador si hay diferencia > 1
    if (diferenciaEquipos > 1 && jugadoresAMover === 0) {
        jugadoresAMover = 1;
    }
    
    // Debug logging
    console.log(`🧮 DEBUG calcularJugadores: ${equipoMayorSize}v${equipoMenorSize} (diff=${diferenciaEquipos}) → mover ${jugadoresAMover} jugador(es)`);
    
    return jugadoresAMover;
}

/**
 * Muestra un mensaje específico para ciertos casos de balance comunes
 * @param {number} rojo - Número de jugadores en equipo rojo
 * @param {number} azul - Número de jugadores en equipo azul 
 * @param {number} jugadoresAMover - Número de jugadores que se moverán
 */
function mostrarMensajeBalanceEspecial(rojo, azul, jugadoresAMover) {
    // Determinar si es un caso especial para mostrar mensaje descriptivo
    if ((rojo === 4 && azul === 2) || (rojo === 2 && azul === 4)) {
        anunciarGeneral(`⚖️ ⚡ Auto Balance 4v2 → 3v3 ⚡`, "FFD700", "bold");
    } else if ((rojo === 5 && azul === 2) || (rojo === 2 && azul === 5)) {
        anunciarGeneral(`⚖️ ⚡ Auto Balance 5v2 → 4v3 ⚡`, "FFD700", "bold");
    } else if ((rojo === 6 && azul === 2) || (rojo === 2 && azul === 6)) {
        anunciarGeneral(`⚖️ ⚡ Auto Balance 6v2 → 4v4 ⚡`, "FFD700", "bold");
    } else if ((rojo === 3 && azul === 1) || (rojo === 1 && azul === 3)) {
        anunciarGeneral(`⚖️ ⚡ Auto Balance 3v1 → 2v2 ⚡`, "FFD700", "bold");
    } else if ((rojo === 7 && azul === 3) || (rojo === 3 && azul === 7)) {
        anunciarGeneral(`⚖️ ⚡ Auto Balance 7v3 → 5v5 ⚡`, "FFD700", "bold");
    } else if (jugadoresAMover > 0) {
        const equipoMayor = rojo > azul ? 'Rojo' : 'Azul';
        const equipoMenor = rojo > azul ? 'Azul' : 'Rojo';
        anunciarGeneral(`⚖️ 🔄 Equilibrando ${equipoMayor}${rojo > azul ? rojo : azul}v${equipoMenor}${rojo > azul ? azul : rojo} (moviendo ${jugadoresAMover} jugador${jugadoresAMover > 1 ? 'es' : ''})`, "87CEEB", "bold");
    }
}

/**
 * Versión mejorada de balance post-salida que usa el sistema de balance dinámico
 * @param {string} nombreJugadorSalido - Nombre del jugador que salió
 * @returns {boolean} - true si se realizó balance, false si no
 */
function balanceInteligentePostSalidaMejorado(nombreJugadorSalido = "jugador") {
    console.log(`⚖️ DEBUG balancePostSalidaMejorado: Jugador salido = ${nombreJugadorSalido}`);
    
    return balanceDinamico(`salida de ${nombreJugadorSalido}`);
}

/**
 * Versión mejorada del balance automático continuo usando el sistema dinámico
 * @returns {boolean} - true si se realizó balance, false si no
 */
function balanceAutomaticoContinuoMejorado() {
    console.log(`🔄 DEBUG balanceAutomaticoContinuoMejorado: Iniciando...`);
    
    return balanceDinamico("balance automático continuo");
}

/**
 * Reemplazar versiones antiguas de balance con versiones mejoradas
 * Esta función se ejecuta cuando se carga este módulo
 */
function actualizarFuncionesDeBalance() {
    // Guardar referencia a las funciones originales por si acaso
    const balanceInteligentePostSalidaOriginal = typeof balanceInteligentePostSalida === 'function' 
        ? balanceInteligentePostSalida 
        : null;
        
    const balanceAutomaticoContinuoOriginal = typeof balanceAutomaticoContinuo === 'function'
        ? balanceAutomaticoContinuo
        : null;
    
    // Reemplazar con versiones mejoradas
    if (typeof window !== 'undefined') {
        window.balanceInteligentePostSalida = balanceInteligentePostSalidaMejorado;
        window.balanceAutomaticoContinuo = balanceAutomaticoContinuoMejorado;
        window.balanceDinamico = balanceDinamico;
        console.log('✅ Funciones de balance reemplazadas con versiones mejoradas en window');
    } else if (typeof global !== 'undefined') {
        global.balanceInteligentePostSalida = balanceInteligentePostSalidaMejorado;
        global.balanceAutomaticoContinuo = balanceAutomaticoContinuoMejorado;
        global.balanceDinamico = balanceDinamico;
        console.log('✅ Funciones de balance reemplazadas con versiones mejoradas en global');
    }
    
    console.log('⚖️ Sistema de balance dinámico instalado correctamente');
}

// Información de depuración
console.log('🔄 Sistema de balance dinámico cargado');

// Exportar funciones para que sean accesibles
module.exports = {
    balanceDinamico,
    balanceInteligentePostSalidaMejorado,
    balanceAutomaticoContinuoMejorado,
    actualizarFuncionesDeBalance
};
