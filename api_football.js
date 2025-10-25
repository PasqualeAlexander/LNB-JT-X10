
require('dotenv').config();
const fetch = require('node-fetch');

const apiKey = process.env.API_FOOTBALL_KEY;
const apiHost = 'v3.football.api-sports.io';

// IDs de las ligas permitidas
const ALL_LIGAS_TO_FETCH = [
    39, 140, 135, 78, 94, 253, 128, 13, 11, 1, 129, 4, 9, // Existing LIGAS_PERMITIDAS
    23, // Argentina Primera División
    2,  // England Premier League
    8,  // Portugal Primeira Liga
    362, // World Cup
    301, // France Ligue 1
    271, // Copa America
    350, // UEFA Nations League
    3   // Spain La Liga
];

async function getLiveFixtures() {
    if (!apiKey) {
        console.error("Error: La clave de API de football no está configurada en el archivo .env");
        return null;
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
        }
    };

    try {
        // Crear una promesa de fetch para cada liga en ALL_LIGAS_TO_FETCH
        const fetchPromises = ALL_LIGAS_TO_FETCH.map(leagueId => {
            const url = `https://v3.football.api-sports.io/fixtures?live=all&league=${leagueId}`;
            return fetch(url, options).then(res => res.json());
        });

        // Ejecutar todas las promesas en paralelo
        const results = await Promise.all(fetchPromises);

        // Unificar los resultados en una sola lista
        const allFixtures = results.flatMap(result => result.response || []);

        // Ordenar los partidos por minuto de juego (los más avanzados primero)
        allFixtures.sort((a, b) => (b.fixture.status.elapsed || 0) - (a.fixture.status.elapsed || 0));

        return allFixtures;

    } catch (error) {
        console.error("Error al obtener los datos de la API de football:", error);
        return null;
    }
}

module.exports = { getLiveFixtures };
