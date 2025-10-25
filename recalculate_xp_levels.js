const { executeQuery } = require('./config/database');
const dbFunctions = require('./database/db_functions');

// ===================== XP_POR_ACCION (Extraído de BOTLNBCODE.js) =====================
const XP_POR_ACCION = {
    gol: 10,
    asistencia: 5,
    victoria: 20,
    partido_completo: 5,
    hat_trick: 25,
    valla_invicta: 15
};

// ===================== FUNCIONES DE NIVELES EXPONENCIALES (Extraídas de exponential_xp_clean.js) =====================
function calcularXPRequerida(nivel) {
    if (nivel <= 1) return 0;
    const base = 100;
    const multiplicador = 1.15; // 15% más difícil cada nivel
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
        if (xpAcumulada + xpParaSiguienteNivel > xpTotal) {
            break;
        }
        xpAcumulada += xpParaSiguienteNivel;
    }
    
    return nivel - 1;
}

// =====================================================================================

async function recalculateAndSavePlayerStats() {
    console.log('Iniciando recalculación y actualización de XP y niveles para todos los jugadores...');

    try {
        const allPlayers = await dbFunctions.obtenerTodosJugadores();
        console.log(`Se encontraron ${allPlayers.length} jugadores para procesar.`);

        for (const player of allPlayers) {
            let calculatedXP = 0;

            // Calcular XP basada en las acciones
            calculatedXP += (player.goles || 0) * (XP_POR_ACCION.gol || 0);
            calculatedXP += (player.asistencias || 0) * (XP_POR_ACCION.asistencia || 0);
            calculatedXP += (player.victorias || 0) * (XP_POR_ACCION.victoria || 0);
            calculatedXP += (player.partidos || 0) * (XP_POR_ACCION.partido_completo || 0);
            calculatedXP += (player.hatTricks || 0) * (XP_POR_ACCION.hat_trick || 0);
            calculatedXP += (player.vallasInvictas || 0) * (XP_POR_ACCION.valla_invicta || 0);

            const calculatedLevel = calcularNivelPorXP(calculatedXP);

            // Solo actualizar si hay cambios
            if (player.xp !== calculatedXP || player.nivel !== calculatedLevel) {
                console.log(`Actualizando a ${player.nombre} (AuthID: ${player.auth_id}):`);
                console.log(`  XP Anterior: ${player.xp}, Nueva XP: ${calculatedXP}`);
                console.log(`  Nivel Anterior: ${player.nivel}, Nuevo Nivel: ${calculatedLevel}`);

                // Crear un objeto stats para pasar a guardarJugadorPorAuth
                const updatedStats = {
                    ...player, // Copiar todas las stats existentes
                    xp: calculatedXP,
                    nivel: calculatedLevel,
                    // Asegurarse de que los campos de fecha sean objetos Date si es necesario,
                    // o strings en el formato esperado por la DB.
                    // dbFunctions.guardarJugadorPorAuth espera strings para fechas.
                    fechaPrimerPartido: player.fechaPrimerPartido,
                    fechaUltimoPartido: player.fechaUltimoPartido,
                    fechaCodigoCreado: player.fechaCodigoCreado,
                    fechaVIP: player.fechaVIP
                };

                await dbFunctions.guardarJugadorPorAuth(player.auth_id, player.nombre, updatedStats);
                console.log(`✅ ${player.nombre} actualizado correctamente.`);
            } else {
                console.log(`ℹ️ ${player.nombre} (AuthID: ${player.auth_id}): XP y Nivel ya están actualizados. No se requiere acción.`);
            }
        }

        console.log('Proceso de recalculación y actualización completado.');
    } catch (error) {
        console.error('❌ Error durante la recalculación y actualización de estadísticas:', error);
    } finally {
        // Es importante cerrar la conexión a la base de datos si se abrió un pool
        // o si se usaron conexiones individuales que necesitan ser liberadas.
        // Asumiendo que executeQuery maneja la liberación de conexiones del pool,
        // no necesitamos cerrar el pool aquí a menos que sea el final de la aplicación.
        // Si el script es de ejecución única, podríamos querer cerrar el pool.
        // const { closePool } = require('./config/database');
        // await closePool();
    }
}

recalculateAndSavePlayerStats();