
const fs = require('fs');
const path = require('path');
const dbFunctions = require('./database/db_functions.js');
const { closePool } = require('./config/database.js');

async function exportTopPlayers() {
    try {
        console.log('📊 Exportando estadísticas de los mejores jugadores...');

        // --- TOP 50 por XP (lógica existente) ---
        const todosLosJugadores = await dbFunctions.obtenerTodosJugadores();

        if (!todosLosJugadores || todosLosJugadores.length === 0) {
            console.log('No se encontraron jugadores.');
            return;
        }

        todosLosJugadores.sort((a, b) => b.xp - a.xp);
        const top50 = todosLosJugadores.slice(0, 50).map((p, index) => ({
            rank: index + 1,
            name: p.nombre_display || p.nombre,
            level: p.nivel,
            xp: p.xp,
            wins: p.victorias,
            goals: p.goles,
            assists: p.asistencias,
            matches: p.partidos,
            mvps: p.mvps,
            cleanSheets: p.vallasInvictas,
            hatTricks: p.hatTricks
        }));

        // --- TOP 10 por diferentes filtros ---
        const top10Lists = {};
        const categories = [
            { key: 'xp', field: 'xp', name: 'Top XP' },
            { key: 'wins', field: 'victorias', name: 'Top Victorias' },
            { key: 'goals', field: 'goles', name: 'Top Goles' },
            { key: 'assists', field: 'asistencias', name: 'Top Asistencias' },
            { key: 'matches', field: 'partidos', name: 'Top Partidos' },
            { key: 'mvps', field: 'mvps', name: 'Top MVPs' },
            { key: 'cleanSheets', field: 'vallasInvictas', name: 'Top Vallas Invictas' },
            { key: 'hatTricks', field: 'hatTricks', name: 'Top Hat-Tricks' }
        ];

        for (const category of categories) {
            console.log(`Fetching Top 10 for: ${category.name}`);
            const topPlayers = await dbFunctions.obtenerTopJugadores(category.field, 10);
            top10Lists[category.key] = topPlayers.map((p, index) => ({
                rank: index + 1,
                name: p.nombre_display || p.nombre,
                value: p[category.field] // Use the dynamic field value
            }));
        }

        // --- Guardar el archivo JSON ---
        const outputPath = path.join(__dirname, 'public', 'stats.json');
        const jsonData = JSON.stringify({
            lastUpdated: new Date().toISOString(),
            top50Players: top50,
            top10Lists: top10Lists
        }, null, 2);

        fs.writeFileSync(outputPath, jsonData);

        console.log(`✅ ¡Exportación completada! Estadísticas guardadas en ${outputPath}`);

    } catch (error) {
        console.error('❌ Error durante la exportación de estadísticas:', error);
    } finally {
        await closePool();
        console.log('🔌 Conexión a la base de datos cerrada.');
    }
}

exportTopPlayers();
