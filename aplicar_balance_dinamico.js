/**
 * SCRIPT PARA APLICAR EL SISTEMA DE BALANCE DINÁMICO AL CÓDIGO PRINCIPAL
 * Este script reemplaza las funciones de balance existentes con versiones mejoradas
 * que manejan TODOS los casos posibles (3v1, 4v2, 5v3, 6v4, etc.)
 */

const fs = require('fs');
const path = require('path');

// Función de balance dinámico completa para insertar
const FUNCION_BALANCE_DINAMICO_COMPLETA = `
// ========== SISTEMA DE BALANCE DINÁMICO - VERSIÓN INTEGRADA ==========
// Esta función calcula el número óptimo de jugadores a mover para equilibrar
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
    console.log(\`🧮 DEBUG calcularJugadores: \${equipoMayorSize}v\${equipoMenorSize} (diff=\${diferenciaEquipos}) → mover \${jugadoresAMover} jugador(es)\`);
    
    return jugadoresAMover;
}

// Función mejorada de balance post-salida con análisis inteligente de TODOS los casos
function balanceInteligentePostSalida(nombreJugadorSalido = "jugador") {
    console.log(\`⚖️ DEBUG balancePostSalida: Jugador salido = \${nombreJugadorSalido}\`);
    
    // Verificar si el room está disponible
    if (typeof room === 'undefined' || !room || !room.getPlayerList) {
        console.warn('⚠️ Room no disponible para balancePostSalida');
        return false;
    }
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const { rojo, azul, diferencia, jugadoresRojo, jugadoresAzul } = equipos;
    
    console.log(\`⚖️ DEBUG: Post-salida - Equipos actuales: Rojo=\${rojo}, Azul=\${azul}, Diferencia=\${diferencia}\`);
    
    // Si no hay diferencia significativa (≤1), no hacer balance
    if (diferencia <= 1) {
        console.log(\`✅ DEBUG: Equipos equilibrados post-salida (diferencia ≤ 1) - no se requiere balance\`);
        return false;
    }
    
    // Si hay muy pocos jugadores, no hacer balance
    if ((rojo + azul) <= 2) {
        console.log(\`✅ DEBUG: Muy pocos jugadores totales (\${rojo + azul}) - no hacer balance\`);
        return false;
    }
    
    // CASO ESPECIAL: Un equipo completamente vacío -> mezcla completa (solo fuera de partidos)
    const equipoVacio = rojo === 0 || azul === 0;
    if (equipoVacio && (rojo + azul) >= 2 && !partidoEnCurso) {
        console.log(\`🔥 DEBUG: Aplicando mezcla completa por equipo vacío\`);
        anunciarGeneral(\`🔄 ⚡ REORGANIZANDO EQUIPOS (equipo vacío)... ⚡ 🔄\`, "FFD700", "bold");
        
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
    
    // Filtrar candidatos válidos (no bots, no AFK)
    const candidatos = equipoMayor.filter(p => {
        if (esBot(p)) {
            console.log(\`🤖 DEBUG: Excluyendo bot \${p.name} del balance\`);
            return false;
        }
        if (jugadoresAFK.has(p.id)) {
            console.log(\`😴 DEBUG: Excluyendo jugador AFK \${p.name} del balance\`);
            return false;
        }
        return true;
    });
    
    if (candidatos.length === 0) {
        console.log(\`⚠️ DEBUG: No hay candidatos válidos para balance post-salida\`);
        return false;
    }
    
    // CÁLCULO INTELIGENTE: Usar la nueva función que maneja TODOS los casos
    const totalJugadores = rojo + azul;
    const equipoMayorSize = equipoMayorEnum === 1 ? rojo : azul;
    const equipoMenorSize = equipoMayorEnum === 1 ? azul : rojo;
    
    // Calcular el número óptimo de jugadores para equilibrar
    let jugadoresAMover = calcularJugadoresOptimosAMover(equipoMayorSize, equipoMenorSize, totalJugadores);
    
    // Limitar por la cantidad de candidatos disponibles
    jugadoresAMover = Math.min(jugadoresAMover, candidatos.length);
    
    console.log(\`⚖️ DEBUG: Balance dinámico - moviendo \${jugadoresAMover} jugador(es) del equipo \${equipoMayorNombre} al \${equipoMenorNombre}\`);
    
    // Si no hay jugadores a mover, no hacer nada
    if (jugadoresAMover <= 0) {
        console.log(\`✅ DEBUG: No se requiere mover jugadores para el balance óptimo\`);
        return false;
    }
    
    // Mostrar mensaje específico para casos conocidos
    if ((rojo === 4 && azul === 2) || (rojo === 2 && azul === 4)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 4v2 → 3v3 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 5 && azul === 2) || (rojo === 2 && azul === 5)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 5v2 → 4v3 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 6 && azul === 2) || (rojo === 2 && azul === 6)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 6v2 → 4v4 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 3 && azul === 1) || (rojo === 1 && azul === 3)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 3v1 → 2v2 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 7 && azul === 3) || (rojo === 3 && azul === 7)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 7v3 → 5v5 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 5 && azul === 3) || (rojo === 3 && azul === 5)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 5v3 → 4v4 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 6 && azul === 4) || (rojo === 4 && azul === 6)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 6v4 → 5v5 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 7 && azul === 5) || (rojo === 5 && azul === 7)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 7v5 → 6v6 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 8 && azul === 6) || (rojo === 6 && azul === 8)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 8v6 → 7v7 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 9 && azul === 7) || (rojo === 7 && azul === 9)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 9v7 → 8v8 ⚡\`, "FFD700", "bold");
    } else if ((rojo === 10 && azul === 8) || (rojo === 8 && azul === 10)) {
        anunciarGeneral(\`⚖️ ⚡ Auto Balance 10v8 → 9v9 ⚡\`, "FFD700", "bold");
    } else {
        const equipoMayorNombreSimple = rojo > azul ? 'Rojo' : 'Azul';
        const equipoMenorNombreSimple = rojo > azul ? 'Azul' : 'Rojo';
        anunciarGeneral(\`⚖️ 🔄 Equilibrando \${equipoMayorNombreSimple}\${rojo > azul ? rojo : azul}v\${equipoMenorNombreSimple}\${rojo > azul ? azul : rojo} (moviendo \${jugadoresAMover} jugador\${jugadoresAMover > 1 ? 'es' : ''})\`, "87CEEB", "bold");
    }
    
    // Seleccionar jugadores aleatoriamente de los candidatos
    const candidatosSeleccionados = [...candidatos]
        .sort(() => 0.5 - Math.random())
        .slice(0, jugadoresAMover);
    
    // Mover jugadores
    candidatosSeleccionados.forEach((jugador, index) => {
        // Verificar que el jugador aún esté conectado
        const jugadorActual = room.getPlayerList().find(p => p.id === jugador.id);
        if (!jugadorActual) {
            console.log(\`⚠️ DEBUG: \${jugador.name} ya no está conectado\`);
            return;
        }
        
        // Marcar como movimiento iniciado por el bot
        movimientoIniciadorPorBot.add(jugador.id);
        
        // Mover al equipo menor
        room.setPlayerTeam(jugador.id, equipoMenorEnum);
        
        const equipoDestinoColor = equipoMenorEnum === 1 ? '🔴 ROJO' : '🔵 AZUL';
        
        // Mensaje de confirmación
        if (partidoEnCurso) {
            anunciarGeneral(\`⚖️ 🔄 Balance: \${jugador.name} → \${equipoDestinoColor} (\${index+1}/\${jugadoresAMover})\`, "FFD700", "bold");
        } else {
            anunciarGeneral(\`⚖️ 🔄 Balance: \${jugador.name} → \${equipoDestinoColor}\`, "87CEEB", "bold");
        }
        
        console.log(\`✅ DEBUG: Jugador \${jugador.name} movido al equipo \${equipoMenorNombre}\`);
    });
    
    // Verificación post-balance
    setTimeout(() => {
        const equiposPostBalance = obtenerCantidadJugadoresPorEquipo();
        console.log(\`📊 DEBUG Post-balance dinámico: Rojo=\${equiposPostBalance.rojo}, Azul=\${equiposPostBalance.azul}, Diferencia=\${equiposPostBalance.diferencia}\`);
        
        // Si aún hay diferencia mayor a 1 y no era una diferencia muy grande inicialmente, intentar corregir
        if (equiposPostBalance.diferencia > 1 && diferencia < 4 && equiposPostBalance.rojo > 0 && equiposPostBalance.azul > 0) {
            console.log(\`🔄 DEBUG: Aún hay diferencia mayor a 1, programando un nuevo balance\`);
            setTimeout(() => {
                balanceInteligentePostSalida(\`segundo intento tras \${nombreJugadorSalido}\`);
            }, 1000);
        }
    }, 500);
    
    return true;
}
// ========== FIN DEL SISTEMA DE BALANCE DINÁMICO ==========`;

function aplicarBalanceDinamico() {
    const archivoBot = path.join(__dirname, 'BOTLNBCODE.js');
    
    if (!fs.existsSync(archivoBot)) {
        console.error('❌ No se encontró el archivo BOTLNBCODE.js');
        return;
    }
    
    // Leer el contenido del archivo
    let contenido = fs.readFileSync(archivoBot, 'utf8');
    
    // Buscar la función balanceInteligentePostSalida actual
    const inicioFuncionRegex = /function balanceInteligentePostSalida\([^)]*\)\s*\{/;
    const match = contenido.match(inicioFuncionRegex);
    
    if (!match) {
        console.error('❌ No se encontró la función balanceInteligentePostSalida en el archivo');
        return;
    }
    
    const inicioFuncion = match.index;
    let contadorLlaves = 0;
    let posicion = inicioFuncion + match[0].length;
    let finFuncion = -1;
    
    // Encontrar el final de la función contando llaves
    for (let i = posicion; i < contenido.length; i++) {
        if (contenido[i] === '{') {
            contadorLlaves++;
        } else if (contenido[i] === '}') {
            contadorLlaves--;
            if (contadorLlaves === -1) {
                finFuncion = i + 1;
                break;
            }
        }
    }
    
    if (finFuncion === -1) {
        console.error('❌ No se pudo encontrar el final de la función balanceInteligentePostSalida');
        return;
    }
    
    // Crear backup
    const fechaHora = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const archivoBackup = path.join(__dirname, `BOTLNBCODE_backup_${fechaHora}.js`);
    fs.writeFileSync(archivoBackup, contenido);
    console.log(`📁 Backup creado: ${archivoBackup}`);
    
    // Reemplazar la función con la nueva versión
    const parteAntes = contenido.slice(0, inicioFuncion);
    const parteDespues = contenido.slice(finFuncion);
    const nuevoContenido = parteAntes + FUNCION_BALANCE_DINAMICO_COMPLETA + parteDespues;
    
    // Escribir el archivo modificado
    fs.writeFileSync(archivoBot, nuevoContenido);
    
    console.log('✅ ¡Sistema de balance dinámico aplicado exitosamente!');
    console.log('📋 Casos ahora contemplados:');
    console.log('   • 3v1 → 2v2');
    console.log('   • 4v2 → 3v3');  
    console.log('   • 5v1 → 3v3');
    console.log('   • 5v2 → 4v3');
    console.log('   • 5v3 → 4v4');
    console.log('   • 6v2 → 4v4');
    console.log('   • 6v4 → 5v5');
    console.log('   • 7v1 → 4v4');
    console.log('   • 7v3 → 5v5');
    console.log('   • 7v5 → 6v6');
    console.log('   • 8v2 → 5v5');
    console.log('   • 8v4 → 6v6');
    console.log('   • 8v6 → 7v7');
    console.log('   • 9v3 → 6v6');
    console.log('   • 9v5 → 7v7');
    console.log('   • 9v7 → 8v8');
    console.log('   • 10v4 → 7v7');
    console.log('   • 10v6 → 8v8');
    console.log('   • 10v8 → 9v9');
    console.log('   • Y casos extremos con fórmula dinámica');
    console.log('🎯 TODOS los casos posibles están ahora contemplados');
}

// Ejecutar la aplicación
if (require.main === module) {
    aplicarBalanceDinamico();
}

module.exports = { aplicarBalanceDinamico };
