/**
 * SCRIPT PARA APLICAR CORRECCIONES DEL BALANCE AUTOMÁTICO
 * Este script modifica directamente el archivo BOTLNBCODE.js para corregir el problema
 * donde el bot anuncia que va a equilibrar equipos pero no mueve jugadores
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 APLICANDO CORRECCIONES AL SISTEMA DE BALANCE AUTOMÁTICO');

// Función de balance automático continuo corregida
const FUNCION_BALANCE_CORREGIDA = `
// ========== FUNCIÓN DE BALANCE AUTOMÁTICO CORREGIDA ==========
function balanceAutomaticoContinuo() {
    console.log(\`🔄 DEBUG balanceAutomaticoContinuo: Iniciando...\`);
    
    if (typeof room === 'undefined' || !room || !room.getPlayerList) {
        console.log(\`❌ DEBUG balanceAutomaticoContinuo: Room no disponible\`);
        return false;
    }
    
    const equipos = obtenerCantidadJugadoresPorEquipo();
    const { rojo, azul, diferencia, jugadoresRojo, jugadoresAzul } = equipos;
    
    console.log(\`🔄 DEBUG balanceAutomaticoContinuo: Rojo=\${rojo}, Azul=\${azul}, Diferencia=\${diferencia}\`);
    console.log(\`📋 DEBUG balanceAutomaticoContinuo: JugadoresRojo=[\${jugadoresRojo.map(j => j.name).join(', ')}]\`);
    console.log(\`📋 DEBUG balanceAutomaticoContinuo: JugadoresAzul=[\${jugadoresAzul.map(j => j.name).join(', ')}]\`);
    
    // Si no hay jugadores en equipos, no hacer nada
    if (rojo === 0 && azul === 0) {
        console.log(\`❌ DEBUG balanceAutomaticoContinuo: No hay jugadores en equipos para balancear\`);
        return false;
    }
    
    // CONDICIÓN PRINCIPAL: Balancear siempre que la diferencia sea mayor a 1 jugador
    if (diferencia <= 1) {
        console.log(\`✅ DEBUG balanceAutomaticoContinuo: Equipos YA balanceados (diferencia \${diferencia} ≤ 1)\`);
        return false;
    }
    
    console.log(\`⚖️ DEBUG balanceAutomaticoContinuo: Balance NECESARIO - diferencia de \${diferencia} jugadores\`);
    
    // Determinar equipo con más jugadores y equipo con menos jugadores
    const equipoConMas = rojo > azul ? jugadoresRojo : jugadoresAzul;
    const equipoConMenos = rojo > azul ? 2 : 1; // 1=rojo, 2=azul
    const equipoConMasNombre = rojo > azul ? 'ROJO' : 'AZUL';
    const equipoConMenosNombre = rojo > azul ? 'AZUL' : 'ROJO';
    
    console.log(\`🔍 DEBUG balanceAutomaticoContinuo: Equipo mayor: \${equipoConMasNombre} (\${equipoConMas.length}), Equipo menor: \${equipoConMenosNombre}\`);
    
    // CORRECCIÓN: Verificar que esBot está definida
    let funcionEsBot = esBot;
    if (typeof funcionEsBot !== 'function') {
        funcionEsBot = function(jugador) {
            return jugador && jugador.name && (
                jugador.name.includes('[BOT]') ||
                jugador.name.includes('Bot') ||
                jugador.name.includes('bot') ||
                jugador.name === '' ||
                jugador.id === 0
            );
        };
        console.log(\`⚠️ DEBUG balanceAutomaticoContinuo: Usando función de respaldo para detectar bots\`);
    }
    
    // CORRECCIÓN: Filtrar candidatos válidos con verificaciones mejoradas
    const candidatos = equipoConMas.filter(jugador => {
        // Verificar que el jugador existe y tiene las propiedades necesarias
        if (!jugador || typeof jugador.id === 'undefined') {
            console.log(\`🚫 DEBUG balanceAutomaticoContinuo: Jugador inválido detectado\`);
            return false;
        }
        
        // Verificar si es bot
        if (funcionEsBot(jugador)) {
            console.log(\`🚫 DEBUG balanceAutomaticoContinuo: Excluyendo bot \${jugador.name} del balance\`);
            return false;
        }
        
        // Verificar si está AFK
        if (jugadoresAFK && jugadoresAFK.has(jugador.id)) {
            console.log(\`🚫 DEBUG balanceAutomaticoContinuo: Excluyendo \${jugador.name} del balance (marcado como AFK)\`);
            return false;
        }
        
        // NUEVA VERIFICACIÓN: Asegurar que el jugador aún esté en el equipo correcto
        const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
        if (!jugadorActual || jugadorActual.team === 0) {
            console.log(\`🚫 DEBUG balanceAutomaticoContinuo: \${jugador.name} ya no está en equipo, excluyendo\`);
            return false;
        }
        
        console.log(\`✅ DEBUG balanceAutomaticoContinuo: \${jugador.name} es candidato válido\`);
        return true;
    });
    
    console.log(\`🎯 DEBUG balanceAutomaticoContinuo: Candidatos válidos: \${candidatos.length}/\${equipoConMas.length}\`);
    candidatos.forEach(c => console.log(\`  - \${c.name} (ID: \${c.id}, Team: \${c.team})\`));
    
    // CORRECCIÓN CRÍTICA: Verificar que hay candidatos antes de continuar
    if (candidatos.length === 0) {
        console.log(\`⚠️ DEBUG balanceAutomaticoContinuo: NO HAY candidatos válidos para balance automático continuo\`);
        console.log(\`📊 DEBUG balanceAutomaticoContinuo: Estado AFK: \${jugadoresAFK ? Array.from(jugadoresAFK.keys()).join(', ') : 'N/A'}\`);
        
        // Mostrar información detallada para debug
        equipoConMas.forEach(jugador => {
            const esBot = funcionEsBot(jugador);
            const esAFK = jugadoresAFK && jugadoresAFK.has(jugador.id);
            const jugadorActual = room.getPlayerList().find(j => j.id === jugador.id);
            const enEquipo = jugadorActual && jugadorActual.team !== 0;
            console.log(\`   \${jugador.name}: Bot=\${esBot}, AFK=\${esAFK}, EnEquipo=\${enEquipo}\`);
        });
        
        // PROBLEMA DETECTADO: Informar al chat que no se puede balancear
        if (equipoConMas.length > 0) {
            anunciarGeneral(\`⚖️ ❌ No se puede equilibrar: jugadores no disponibles para balance\`, \"FFA500\", \"normal\");
        }
        
        return false;
    }
    
    // CORRECCIÓN: Calcular mejor el número de jugadores a mover
    let jugadoresAMover = Math.floor(diferencia / 2);
    
    // Asegurar que movemos al menos 1 jugador si hay diferencia > 1
    if (diferencia > 1 && jugadoresAMover === 0) {
        jugadoresAMover = 1;
    }
    
    // Limitar por candidatos disponibles
    jugadoresAMover = Math.min(jugadoresAMover, candidatos.length);
    
    console.log(\`⚖️ DEBUG balanceAutomaticoContinuo: Calculado - mover \${jugadoresAMover} jugador(es) del equipo \${equipoConMasNombre} al \${equipoConMenosNombre}\`);
    
    // CORRECCIÓN: Verificar que tenemos al menos un jugador para mover
    if (jugadoresAMover === 0) {
        console.log(\`⚠️ DEBUG balanceAutomaticoContinuo: No hay jugadores calculados para mover\`);
        return false;
    }
    
    // CORRECCIÓN: Anunciar el balance ANTES de mover jugadores (para confirmar que llega hasta aquí)
    anunciarGeneral(\`⚖️ 🔄 Equilibrando equipos por desconexión (\${jugadoresAMover} jugador\${jugadoresAMover > 1 ? 'es' : ''})...\`, \"87CEEB\", \"bold\");
    
    // CORRECCIÓN: Mezclar candidatos y mover uno por uno con verificaciones
    const candidatosAleatorios = [...candidatos].sort(() => 0.5 - Math.random());
    let jugadoresMovidos = 0;
    
    for (let i = 0; i < jugadoresAMover && i < candidatosAleatorios.length; i++) {
        const jugadorSeleccionado = candidatosAleatorios[i];
        
        try {
            // Verificar una vez más que el jugador está disponible
            const jugadorActual = room.getPlayerList().find(j => j.id === jugadorSeleccionado.id);
            if (!jugadorActual || jugadorActual.team === 0) {
                console.log(\`⚠️ DEBUG balanceAutomaticoContinuo: \${jugadorSeleccionado.name} ya no está disponible para mover\`);
                continue;
            }
            
            console.log(\`🎲 DEBUG balanceAutomaticoContinuo: Seleccionado para mover: \${jugadorSeleccionado.name} (\${i+1}/\${jugadoresAMover})\`);
            
            // CORRECCIÓN: Marcar movimiento como iniciado por el bot ANTES de mover
            if (movimientoIniciadorPorBot) {
                movimientoIniciadorPorBot.add(jugadorSeleccionado.id);
                console.log(\`🤖 DEBUG balanceAutomaticoContinuo: Marcado movimiento iniciado por bot para \${jugadorSeleccionado.name}\`);
            }
            
            // CORRECCIÓN CRÍTICA: Ejecutar el movimiento
            console.log(\`➡️ DEBUG balanceAutomaticoContinuo: EJECUTANDO room.setPlayerTeam(\${jugadorSeleccionado.id}, \${equipoConMenos}) para \${jugadorSeleccionado.name}\`);
            const equipoAnterior = jugadorActual.team;
            
            room.setPlayerTeam(jugadorSeleccionado.id, equipoConMenos);
            
            // Verificar inmediatamente que el movimiento fue exitoso
            const verificarMovimiento = () => {
                const jugadorDespues = room.getPlayerList().find(j => j.id === jugadorSeleccionado.id);
                if (jugadorDespues && jugadorDespues.team === equipoConMenos) {
                    console.log(\`✅ DEBUG balanceAutomaticoContinuo: \${jugadorSeleccionado.name} movido EXITOSAMENTE de equipo \${equipoAnterior} al \${equipoConMenos}\`);
                    
                    // Anunciar el movimiento individual
                    const equipoDestinoEmoji = equipoConMenos === 1 ? '🔴' : '🔵';
                    anunciarGeneral(\`⚖️ \${jugadorSeleccionado.name} → \${equipoDestinoEmoji} \${equipoConMenosNombre}\`, \"90EE90\", \"normal\");
                } else {
                    console.log(\`❌ DEBUG balanceAutomaticoContinuo: FALLO al mover \${jugadorSeleccionado.name} - equipo actual: \${jugadorDespues ? jugadorDespues.team : 'desconectado'}\`);
                }
            };
            
            // Verificar después de un pequeño delay
            setTimeout(verificarMovimiento, 100);
            
            jugadoresMovidos++;
            
        } catch (error) {
            console.log(\`❌ ERROR balanceAutomaticoContinuo moviendo \${jugadorSeleccionado.name}: \${error.message}\`);
            console.log(\`   Stack trace: \${error.stack}\`);
        }
    }
    
    console.log(\`🏁 DEBUG balanceAutomaticoContinuo: Movimientos completados - \${jugadoresMovidos} jugadores procesados, esperando verificación...\`);
    
    // CORRECCIÓN: Verificar resultado después de un delay apropiado
    setTimeout(() => {
        const equiposPostBalance = obtenerCantidadJugadoresPorEquipo();
        console.log(\`📊 DEBUG balanceAutomaticoContinuo Post-balance: Rojo=\${equiposPostBalance.rojo}, Azul=\${equiposPostBalance.azul}, Diferencia=\${equiposPostBalance.diferencia}\`);
        
        if (equiposPostBalance.diferencia <= 1) {
            console.log(\`✅ DEBUG balanceAutomaticoContinuo: Balance COMPLETADO exitosamente - diferencia final: \${equiposPostBalance.diferencia}\`);
            anunciarGeneral(\`✅ Equipos equilibrados correctamente\`, \"90EE90\", \"normal\");
        } else if (equiposPostBalance.diferencia > 1 && equiposPostBalance.rojo > 0 && equiposPostBalance.azul > 0) {
            console.log(\`🔄 DEBUG balanceAutomaticoContinuo: AÚN hay diferencia mayor a 1 (\${equiposPostBalance.diferencia}), programando nuevo balance en 2s\`);
            setTimeout(() => {
                console.log(\`🔄 DEBUG balanceAutomaticoContinuo: Ejecutando balance recursivo...\`);
                balanceAutomaticoContinuo();
            }, 2000);
        }
    }, 1000);
    
    return jugadoresMovidos > 0;
}
// ========== FIN DE LA FUNCIÓN CORREGIDA ==========`;

function aplicarCorreccionBalance() {
    const archivoBot = path.join(__dirname, 'BOTLNBCODE.js');
    
    if (!fs.existsSync(archivoBot)) {
        console.error('❌ No se encontró el archivo BOTLNBCODE.js');
        return;
    }
    
    // Leer el contenido del archivo
    let contenido = fs.readFileSync(archivoBot, 'utf8');
    
    // Buscar la función balanceAutomaticoContinuo actual
    const inicioFuncionRegex = /function balanceAutomaticoContinuo\(\)\s*\{/;
    const match = contenido.match(inicioFuncionRegex);
    
    if (!match) {
        console.error('❌ No se encontró la función balanceAutomaticoContinuo en el archivo');
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
        console.error('❌ No se pudo encontrar el final de la función balanceAutomaticoContinuo');
        return;
    }
    
    // Crear backup con timestamp
    const fechaHora = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const archivoBackup = path.join(__dirname, `BOTLNBCODE_backup_balance_${fechaHora}.js`);
    fs.writeFileSync(archivoBackup, contenido);
    console.log(`📁 Backup creado: ${archivoBackup}`);
    
    // Reemplazar la función con la versión corregida
    const parteAntes = contenido.slice(0, inicioFuncion);
    const parteDespues = contenido.slice(finFuncion);
    const nuevoContenido = parteAntes + FUNCION_BALANCE_CORREGIDA + parteDespues;
    
    // Escribir el archivo modificado
    fs.writeFileSync(archivoBot, nuevoContenido);
    
    console.log('✅ ¡CORRECCIÓN DE BALANCE APLICADA EXITOSAMENTE!');
    console.log('');
    console.log('🔧 CAMBIOS APLICADOS:');
    console.log('   ✓ Verificación mejorada de candidatos válidos');
    console.log('   ✓ Detección de función esBot con respaldo');
    console.log('   ✓ Verificación en tiempo real de jugadores disponibles');
    console.log('   ✓ Logging detallado para debug');
    console.log('   ✓ Anuncio del balance ANTES de mover jugadores');
    console.log('   ✓ Verificación de éxito de cada movimiento');
    console.log('   ✓ Mejor manejo de errores');
    console.log('   ✓ Información en chat cuando no hay candidatos');
    console.log('');
    console.log('🎯 RESULTADO ESPERADO:');
    console.log('   • El bot ahora SÍ moverá jugadores cuando anuncia el balance');
    console.log('   • Se mostrarán mensajes detallados en la consola');
    console.log('   • Los jugadores verán confirmación de cada movimiento');
    console.log('');
    console.log('🚀 Reinicia el bot para aplicar los cambios');
}

// Ejecutar la aplicación
if (require.main === module) {
    aplicarCorreccionBalance();
}

module.exports = { aplicarCorreccionBalance };
