/* 
* 🎯 SISTEMA DE XP MEJORADO - NIVELES EXPONENCIALES
* Sistema más desafiante donde cada nivel es más difícil de alcanzar
*/

// ===================== CONFIGURACIÓN DE NIVELES EXPONENCIALES =====================

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

// ===================== EJEMPLOS DE NIVELES EXPONENCIALES =====================

console.log("🎯 SISTEMA DE NIVELES EXPONENCIALES");
console.log("=====================================");

const ejemplosNiveles = [1, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100];

ejemplosNiveles.forEach(nivel => {
    const xpRequerida = calcularXPRequerida(nivel);
    const xpTotal = calcularXPTotalParaNivel(nivel);
    
    console.log(`Nivel ${nivel.toString().padStart(3)}: ${xpRequerida.toString().padStart(6)} XP este nivel | ${xpTotal.toString().padStart(8)} XP total`);
});

// ===================== FUNCIÓN MEJORADA PARA EL BOT =====================

function otorgarXPMejorado(nombreJugador, accion, cantidad = null) {
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
    
    const XP_POR_ACCION = {
        gol: 10,
        asistencia: 5,
        victoria: 20,
        partido_completo: 5,
        hat_trick: 25,
        valla_invicta: 15
    };
    
    const xpGanada = cantidad || XP_POR_ACCION[accion] || 0;
    const nivelAnterior = stats.nivel;
    const xpAnterior = stats.xp;
    
    // Aplicar multiplicador VIP si corresponde
    let xpFinal = xpGanada;
    // TODO: Integrar con sistema VIP para multiplicadores
    
    stats.xp += xpFinal;
    
    // Calcular nuevo nivel con sistema exponencial
    const nuevoNivel = calcularNivelPorXP(stats.xp);
    
    if (nuevoNivel > nivelAnterior) {
        stats.nivel = nuevoNivel;
        
        // Obtener progreso para mostrar información detallada
        const progreso = obtenerProgresoNivel(stats.xp);
        
        // Mensaje de subida de nivel mejorado
        anunciarGeneral(
            `🎉 ¡${nombreJugador} subió a NIVEL ${nuevoNivel}! ` +
            `(${progreso.xpEnNivelActual}/${progreso.xpRequeridaParaSiguienteNivel} XP para nivel ${nuevoNivel + 1})`, 
            "FFD700", 
            "bold"
        );
        
        // Recompensas especiales por hitos importantes
        if (nuevoNivel % 10 === 0) {
            anunciarGeneral(`👑 ¡${nombreJugador} alcanzó el NIVEL ${nuevoNivel}! ¡Felicitaciones por este gran logro!`, "FF6B6B", "bold");
        }
        
        // Recompensas por niveles específicos
        const recompensas = obtenerRecompensasPorNivel(nuevoNivel);
        if (recompensas.length > 0) {
            anunciarGeneral(`🎁 ¡${nombreJugador} desbloqueó: ${recompensas.join(', ')}!`, "00FF00", "normal");
        }
        
        setTimeout(() => {
            actualizarTodosLosNombres();
        }, 1000);
    } else {
        // Mensaje sutil de XP ganada (solo ocasionalmente)
        if (Math.random() < 0.1) { // 10% de probabilidad
            const progreso = obtenerProgresoNivel(stats.xp);
            anunciarPrivado(
                `+${xpFinal} XP por ${accion} | Nivel ${stats.nivel} (${progreso.porcentajeProgreso}%)`,
                nombreJugador,
                "87CEEB"
            );
        }
    }
    
    guardarEstadisticasGlobalesCompletas();
}

// ===================== SISTEMA DE RECOMPENSAS POR NIVEL =====================

function obtenerRecompensasPorNivel(nivel) {
    const recompensas = [];
    
    // Recompensas específicas por nivel
    const premiosPorNivel = {
        5: ["Título: 'Principiante'"],
        10: ["Título: 'Jugador Activo'", "Color de chat especial"],
        15: ["Título: 'Veterano'"],
        20: ["Título: 'Experto'", "Comando !myrecord"],
        25: ["Título: 'Maestro'"],
        30: ["Título: 'Profesional'", "Acceso a sala VIP"],
        40: ["Título: 'Élite'"],
        50: ["Título: 'Leyenda'", "Nombre dorado permanente"],
        75: ["Título: 'Mítico'"],
        100: ["Título: 'Dios del Haxball'", "Premio especial único"]
    };
    
    if (premiosPorNivel[nivel]) {
        recompensas.push(...premiosPorNivel[nivel]);
    }
    
    return recompensas;
}

// ===================== COMANDOS INFORMATIVOS MEJORADOS =====================

// Comando para ver progreso de nivel mejorado
function mostrarProgresoNivel(nombreJugador) {
    const stats = estadisticasGlobales.jugadores[nombreJugador];
    if (!stats) {
        return "❌ No tienes estadísticas registradas.";
    }
    
    const progreso = obtenerProgresoNivel(stats.xp);
    const xpParaSiguiente = progreso.xpRequeridaParaSiguienteNivel - progreso.xpEnNivelActual;
    
    return `📊 ${nombreJugador} - Nivel ${progreso.nivelActual}\n` +
           `⚡ XP Total: ${stats.xp}\n` +
           `📈 Progreso: ${progreso.xpEnNivelActual}/${progreso.xpRequeridaParaSiguienteNivel} (${progreso.porcentajeProgreso}%)\n` +
           `🎯 Faltan ${xpParaSiguiente} XP para nivel ${progreso.nivelActual + 1}`;
}

// Tabla de niveles para mostrar
function mostrarTablaNiveles() {
    let tabla = "🎯 TABLA DE NIVELES (Sistema Exponencial)\n";
    tabla += "==========================================\n";
    
    for (let nivel = 1; level <= 25; nivel++) {
        const xpRequerida = nivel === 1 ? 0 : calcularXPRequerida(nivel);
        const xpTotal = calcularXPTotalParaNivel(nivel);
        const emoji = obtenerEmojiNivel(nivel);
        
        tabla += `${emoji} Nivel ${nivel.toString().padStart(2)}: `;
        
        if (nivel === 1) {
            tabla += "0 XP (inicial)\n";
        } else {
            tabla += `${xpRequerida} XP (${xpTotal} total)\n`;
        }
    }
    
    tabla += "\n💡 Cada nivel es más difícil que el anterior!";
    return tabla;
}

// ===================== EXPORTAR FUNCIONES =====================

module.exports = {
    calcularXPRequerida,
    calcularXPTotalParaNivel,
    calcularNivelPorXP,
    obtenerProgresoNivel,
    otorgarXPMejorado,
    obtenerRecompensasPorNivel,
    mostrarProgresoNivel,
    mostrarTablaNiveles
};

// ===================== COMPARACIÓN DE SISTEMAS =====================

console.log("\n🔄 COMPARACIÓN: SISTEMA ACTUAL vs EXPONENCIAL");
console.log("==============================================");
console.log("NIVEL | ACTUAL (Lineal) | EXPONENCIAL | DIFERENCIA");
console.log("------|-----------------|-------------|------------");

[5, 10, 20, 30, 50, 100].forEach(nivel => {
    const actualXP = (nivel - 1) * 100; // Sistema actual
    const exponencialXP = calcularXPTotalParaNivel(nivel); // Sistema exponencial
    const diferencia = exponencialXP - actualXP;
    const porcentaje = Math.round((diferencia / actualXP) * 100);
    
    console.log(`${nivel.toString().padStart(5)} | ${actualXP.toString().padStart(15)} | ${exponencialXP.toString().padStart(11)} | +${diferencia} (+${porcentaje}%)`);
});
