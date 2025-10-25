
const fs = require('fs');
const path = require('path');
const dbFunctions = require('./database/db_functions.js');
const { closePool } = require('./config/database.js');

async function exportTopPlayers() {
    try {
        console.log('📊 Exportando estadísticas de los mejores jugadores...');

        // 1. Obtener todos los jugadores
        const todosLosJugadores = await dbFunctions.obtenerTodosJugadores();

        if (!todosLosJugadores || todosLosJugadores.length === 0) {
            console.log('No se encontraron jugadores.');
            return;
        }

        // 2. Ordenar por XP descendente
        todosLosJugadores.sort((a, b) => b.xp - a.xp);

        // 3. Tomar el top 50
        const top50 = todosLosJugadores.slice(0, 50);

        // 4. Mapear a un formato limpio para el frontend
        const statsParaFrontend = top50.map((p, index) => ({
            rank: index + 1,
            name: p.nombre_display || p.nombre,
            level: p.nivel,
            xp: p.xp,
            wins: p.victorias,
            goals: p.goles,
            assists: p.asistencias,
            matches: p.partidos,
            mvps: p.mvps
        }));

        // 5. Guardar el archivo JSON
        const outputPath = path.join(__dirname, 'stats-dashboard', 'public', 'stats.json');
        const jsonData = JSON.stringify({
            lastUpdated: new Date().toISOString(),
            players: statsParaFrontend
        }, null, 2);

        fs.writeFileSync(outputPath, jsonData);

        console.log(`✅ ¡Exportación completada! Top 50 jugadores guardados en ${outputPath}`);

    } catch (error) {
        console.error('❌ Error durante la exportación de estadísticas:', error);
    } finally {
        // 6. Cerrar la conexión a la base de datos
        await closePool();
        console.log('🔌 Conexión a la base de datos cerrada.');
    }
}

exportTopPlayers();
