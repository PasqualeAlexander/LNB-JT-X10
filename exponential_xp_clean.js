/* 
* 🎯 SISTEMA DE XP EXPONENCIAL LIMPIO
* Solo cambia la progresión de niveles, sin recompensas adicionales
*/

// ===================== FUNCIONES DE NIVELES EXPONENCIALES =====================

// Función para calcular XP requerida para un nivel específico
function calcularXPRequerida(nivel) {
    if (nivel <= 1) return 0;
    
    // Fórmula exponencial: XP = base * (multiplicador ^ (nivel-1))
    const base = 100;
    const multiplicador = 1.15; // 15% más difícil cada nivel
    
    return Math.floor(base * Math.pow(multiplicador, nivel - 2));
}

// Función para calcular XP total acumulada hasta un nivel
function calcularXPTotalParaNivel(nivel) {
    let total = 0;
    for (let i = 2; i <= nivel; i++) {
        total += calcularXPRequerida(i);
    }
    return total;
}

// Función para calcular nivel basado en XP total
function calcularNivelPorXP(xpTotal) {
    if (xpTotal < 100) return 1;
    
    let nivel = 1;
    let xpAcumulada = 0;
    
    while (xpAcumulada <= xpTotal) {
        nivel++;
        const xpParaSiguienteNivel = calcularXPRequerida(nivel);
        if (xpAcumulada + xpParaSiguienteNivel > xpTotal) {
            break;
        }
        xpAcumulada += xpParaSiguienteNivel;
    }
    
    return nivel - 1;
}

// Función para obtener progreso hacia el siguiente nivel
function obtenerProgresoNivel(xpTotal) {
    const nivelActual = calcularNivelPorXP(xpTotal);
    const xpParaNivelActual = calcularXPTotalParaNivel(nivelActual);
    const xpParaSiguienteNivel = calcularXPRequerida(nivelActual + 1);
    const xpProgreso = xpTotal - xpParaNivelActual;
    
    return {
        nivelActual: nivelActual,
        xpEnNivelActual: xpProgreso,
        xpRequeridaParaSiguienteNivel: xpParaSiguienteNivel,
        porcentajeProgreso: Math.round((xpProgreso / xpParaSiguienteNivel) * 100)
    };
}

// ===================== FUNCIÓN MEJORADA PARA REEMPLAZAR EN TU BOT =====================

// Esta función reemplaza la función otorgarXP existente en BOTLNBCODE.js
function otorgarXP(nombreJugador, accion, cantidad = null) {
    // Verificar que estadisticasGlobales y jugadores existan
    if (!estadisticasGlobales || !estadisticasGlobales.jugadores) {
        console.error('❌ Error: estadisticasGlobales no inicializado en otorgarXP');
        return;
    }
    
    if (!estadisticasGlobales.jugadores[nombreJugador]) {
        registrarJugadorGlobal(nombreJugador);
    }
    
    const stats = estadisticasGlobales.jugadores[nombreJugador];
    if (!stats) {
        console.error(`❌ Error: No se pudo crear/obtener estadísticas para ${nombreJugador}`);
        return;
    }
    
    if (!stats.xp) stats.xp = 0;
    if (!stats.nivel) stats.nivel = 1;
    
    const xpGanada = cantidad || XP_POR_ACCION[accion] || 0;
    const xpAnterior = stats.xp;
    const nivelAnterior = stats.nivel;
    
    stats.xp += xpGanada;
    
    // ========== CAMBIO PRINCIPAL: Usar sistema exponencial en lugar de lineal ==========
    const nuevoNivel = calcularNivelPorXP(stats.xp);
    // Antes era: Math.floor(stats.xp / 100) + 1;
    
    if (nuevoNivel > nivelAnterior) {
        stats.nivel = nuevoNivel;
        
        // Mantener los mismos mensajes que ya tienes
        anunciarGeneral(`🎉 ¡${nombreJugador} subió a NIVEL ${nuevoNivel}!`, "FFD700", "bold");
        
        // Mantener las recompensas que ya tenías por niveles múltiplos de 5
        if (nuevoNivel % 5 === 0) {
            anunciarGeneral(`👑 ¡${nombreJugador} alcanzó el NIVEL ${nuevoNivel}! ¡Felicitaciones!`, "FF6B6B", "bold");
        }
        
        // Mantener la actualización de nombres
        setTimeout(() => {
            actualizarTodosLosNombres();
        }, 1000);
    }
    
    // XP se actualiza silenciosamente - solo se notifica cuando sube de nivel
    guardarEstadisticasGlobalesCompletas();
}

// ===================== FUNCIONES AUXILIARES PARA COMANDOS =====================

// Función para mostrar progreso mejorado (opcional - para comando !stats)
function obtenerInfoNivelMejorada(nombreJugador) {
    const stats = estadisticasGlobales.jugadores[nombreJugador];
    if (!stats || !stats.xp) {
        return {
            nivel: 1,
            xpTotal: 0,
            xpParaSiguienteNivel: 100,
            porcentajeProgreso: 0
        };
    }
    
    const progreso = obtenerProgresoNivel(stats.xp);
    return {
        nivel: progreso.nivelActual,
        xpTotal: stats.xp,
        xpEnNivelActual: progreso.xpEnNivelActual,
        xpParaSiguienteNivel: progreso.xpRequeridaParaSiguienteNivel,
        porcentajeProgreso: progreso.porcentajeProgreso,
        xpFaltante: progreso.xpRequeridaParaSiguienteNivel - progreso.xpEnNivelActual
    };
}

// ===================== EXPORTAR FUNCIONES =====================

// Para usar en tu bot principal
module.exports = {
    calcularXPRequerida,
    calcularXPTotalParaNivel,
    calcularNivelPorXP,
    obtenerProgresoNivel,
    otorgarXP,
    obtenerInfoNivelMejorada
};

// ===================== CÓDIGO PARA COPIAR Y PEGAR =====================

console.log(`
📝 CÓDIGO PARA REEMPLAZAR EN TU BOTLNBCODE.js:

1. Agrega estas funciones al inicio del archivo (después de las variables globales):

// ========== SISTEMA EXPONENCIAL DE NIVELES ==========
function calcularXPRequerida(nivel) {
    if (nivel <= 1) return 0;
    const base = 100;
    const multiplicador = 1.15;
    return Math.floor(base * Math.pow(multiplicador, nivel - 2));
}

function calcularXPTotalParaNivel(nivel) {
    let total = 0;
    for (let i = 2; i <= nivel; i++) {
        total += calcularXPRequerida(i);
    }
    return total;
}

function calcularNivelPorXP(xpTotal) {
    if (xpTotal < 100) return 1;
    let nivel = 1;
    let xpAcumulada = 0;
    while (xpAcumulada <= xpTotal) {
        nivel++;
        const xpParaSiguienteNivel = calcularXPRequerida(nivel);
        if (xpAcumulada + xpParaSiguienteNivel > xpTotal) break;
        xpAcumulada += xpParaSiguienteNivel;
    }
    return nivel - 1;
}
// ====================================================

2. Reemplaza la línea 1117 en la función otorgarXP():

CAMBIAR ESTO:
    const nuevoNivel = Math.floor(stats.xp / 100) + 1;

POR ESTO:
    const nuevoNivel = calcularNivelPorXP(stats.xp);

3. ¡Listo! El sistema exponencial estará funcionando.
`);
