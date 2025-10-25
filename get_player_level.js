require('dotenv').config({ path: '/root/apps/lnb-bot-puppeteer/.env' });
const { executeQuery, closePool } = require('/root/apps/lnb-bot-puppeteer/config/database.js');

// XP Calculation Functions (copied from BOTLNBCODE.js)
function calcularXPRequerida(nivel) {
    if (nivel <= 1) return 0;
    const base = 100;
    const multiplicador = 1.15; // 15% más difícil cada nivel
    return Math.floor(base * Math.pow(multiplicador, nivel - 2));
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

async function getPlayerLevelByAuthID(authID) {
    try {
        // Get player stats from the database using auth_id
        const query = 'SELECT nombre, xp FROM jugadores WHERE auth_id = ?';
        const results = await executeQuery(query, [authID]);

        if (results.length === 0) {
            console.log(`Player with AuthID "${authID}" not found.`);
            return;
        }

        const playerName = results[0].nombre;
        const playerXP = results[0].xp;
        const playerLevel = calcularNivelPorXP(playerXP);

        console.log(`Player: ${playerName}`);
        console.log(`AuthID: ${authID}`);
        console.log(`XP: ${playerXP}`);
        console.log(`Level: ${playerLevel}`);

    } catch (error) {
        console.error('Error getting player level:', error);
    } finally {
        await closePool();
    }
}

// Get AuthID from command line arguments
const authID = process.argv[2];

if (!authID) {
    console.log('Usage: node get_player_level.js <AuthID>');
    process.exit(1);
}

getPlayerLevelByAuthID(authID);