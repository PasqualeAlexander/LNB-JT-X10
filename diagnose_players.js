
const { executeQuery } = require('./config/database');

async function diagnose() {
  try {
    console.log('Iniciando diagnóstico de la tabla de jugadores...');

    // 1. Contar total de jugadores
    const totalResult = await executeQuery('SELECT COUNT(*) as total FROM jugadores');
    const totalPlayers = totalResult[0].total;
    console.log(`- Total de jugadores en la tabla: ${totalPlayers}`);

    // 2. Contar jugadores con partidos > 0
    const activeResult = await executeQuery('SELECT COUNT(*) as total FROM jugadores WHERE partidos > 0');
    const activePlayers = activeResult[0].total;
    console.log(`- Jugadores con al menos 1 partido jugado: ${activePlayers}`);
    
    // 3. Top 5 jugadores por partidos jugados
    const topPartidos = await executeQuery('SELECT nombre, partidos, goles FROM jugadores ORDER BY partidos DESC LIMIT 5');
    if (topPartidos && topPartidos.length > 0) {
      console.log('\n--- Top 5 por Partidos Jugados ---');
      topPartidos.forEach(p => {
        console.log(`  - ${p.nombre}: ${p.partidos} partidos, ${p.goles} goles`);
      });
    } else {
      console.log('\n- No se encontraron jugadores para mostrar por partidos.');
    }

    // 4. Top 5 jugadores por goles (sin filtro de partidos)
    const topGoles = await executeQuery('SELECT nombre, partidos, goles FROM jugadores ORDER BY goles DESC LIMIT 5');
    if (topGoles && topGoles.length > 0) {
      console.log('\n--- Top 5 por Goles (sin filtro) ---');
      topGoles.forEach(p => {
        console.log(`  - ${p.nombre}: ${p.goles} goles, ${p.partidos} partidos`);
      });
    } else {
      console.log('\n- No se encontraron jugadores para mostrar por goles.');
    }

  } catch (error) {
    console.error('Error durante el diagnóstico:', error);
  } finally {
    // Forzamos la salida para evitar que el proceso se quede colgado por la conexión de DB
    process.exit(0);
  }
}

diagnose();
