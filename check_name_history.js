
require('dotenv').config();
const { executeQuery, closePool } = require('./config/database');

async function getNameHistory(authId) {
    try {
        const query = `SELECT nombre, ultima_vez_usado FROM jugador_nombres_historial WHERE auth_id = ? ORDER BY ultima_vez_usado DESC`;
        const results = await executeQuery(query, [authId]);
        if (results && results.length > 0) {
            console.log(`Historial de nombres para ${authId}:`);
            results.forEach(record => {
                console.log(`- ${record.nombre} (usado por última vez: ${new Date(record.ultima_vez_usado).toLocaleString()})`);
            });
        } else {
            console.log("No se encontró historial de nombres para este auth_id.");
        }
    } catch (error) {
        console.error("Error al obtener el historial de nombres:", error);
    } finally {
        closePool();
    }
}

const authId = 'euA5wUkXVefKLcmvU7M3jUrBDqBdFuZDMhkV_kYfWsc';
getNameHistory(authId);
