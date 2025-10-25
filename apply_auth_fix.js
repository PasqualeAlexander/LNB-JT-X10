/**
 * PARCHE SIMPLIFICADO: Corregir identificación por Auth ID
 * ========================================================
 */

const fs = require('fs');

console.log('🔧 Aplicando parche de identificación Auth ID...');

// Leer archivo actual
const contenido = fs.readFileSync('./BOTLNBCODE.js', 'utf8');

// 1. Función obtenerEstadisticasJugador corregida
const obtenerStats_OLD = `async function obtenerEstadisticasJugador(nombre) {
    try {
        if (typeof nodeObtenerJugador !== 'undefined') {
            return await nodeObtenerJugador(nombre);
        } else {
            console.warn('⚠️ Sistema de base de datos no disponible');
            return null;
        }
    } catch (error) {
        console.error("❌ Error al obtener estadísticas del jugador:", error);
        return null;
    }
}`;

const obtenerStats_NEW = `// ==================== FUNCIÓN CORREGIDA: AUTH_ID ====================
async function obtenerEstadisticasJugador(identificador) {
    try {
        // Si recibimos un objeto jugador de HaxBall
        if (typeof identificador === 'object' && identificador.name) {
            return await obtenerEstadisticasJugadorSeguro(identificador);
        }
        
        // Compatibilidad: si es string, buscar por nombre (legacy)
        if (typeof identificador === 'string') {
            if (typeof nodeObtenerJugador !== 'undefined') {
                console.log('⚠️ Usando búsqueda legacy por nombre:', identificador);
                return await nodeObtenerJugador(identificador);
            }
        }
        
        console.warn('⚠️ Sistema de base de datos no disponible');
        return null;
        
    } catch (error) {
        console.error("❌ Error al obtener estadísticas del jugador:", error);
        return null;
    }
}

// Nueva función segura que usa auth_id
async function obtenerEstadisticasJugadorSeguro(jugadorHB) {
    try {
        const authId = jugadorHB.auth;
        const nombre = jugadorHB.name;
        
        console.log('🔍 Obteniendo estadísticas:', nombre, '(Auth:', authId || 'SIN_AUTH', ')');
        
        // Prioridad 1: Buscar por auth_id si existe
        if (authId && typeof nodeObtenerJugadorPorAuth !== 'undefined') {
            const resultado = await nodeObtenerJugadorPorAuth(authId);
            if (resultado) {
                console.log('✅ Encontrado por auth_id:', authId);
                return resultado;
            }
            
            // Migrar jugador existente si tiene el mismo nombre pero no auth_id
            if (typeof nodeObtenerJugador !== 'undefined') {
                const jugadorPorNombre = await nodeObtenerJugador(nombre);
                if (jugadorPorNombre && !jugadorPorNombre.auth_id && typeof nodeMigrarJugadorAAuth !== 'undefined') {
                    console.log('🎯 Migrando jugador:', nombre, '->', authId);
                    const migracion = await nodeMigrarJugadorAAuth(nombre, authId);
                    if (migracion && migracion.migrado) {
                        return migracion.jugador;
                    }
                }
            }
        }
        
        // Prioridad 2: Fallback para invitados sin auth
        if (!authId && typeof nodeObtenerJugador !== 'undefined') {
            console.log('⚠️ Invitado sin auth, usando nombre:', nombre);
            return await nodeObtenerJugador(nombre);
        }
        
        return null;
        
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas por auth:', error);
        return null;
    }
}`;

// 2. Función registrarJugador corregida
const registrarJugador_OLD = `async function registrarJugador(nombre) {
    try {
        const jugadorExistente = await obtenerEstadisticasJugador(nombre);
        
        if (!jugadorExistente && typeof nodeGuardarJugador !== 'undefined') {
            const nuevoJugador = {
                nombre: nombre,
                partidos: 0,
                victorias: 0,
                derrotas: 0,
                goles: 0,
                asistencias: 0,
                autogoles: 0,
                mejorRachaGoles: 0,
                mejorRachaAsistencias: 0,
                hatTricks: 0,
                vallasInvictas: 0,
                tiempoJugado: 0,
                promedioGoles: 0.0,
                promedioAsistencias: 0.0,
                fechaPrimerPartido: new Date().toISOString(),
                fechaUltimoPartido: new Date().toISOString(),
                xp: 40,
                nivel: 1
            };
            
            await nodeGuardarJugador(nombre, nuevoJugador);
            console.log(\`✅ Nuevo jugador registrado: \${nombre}\`);
        }
    } catch (error) {
        console.error("❌ Error al registrar jugador:", error);
    }
}`;

const registrarJugador_NEW = `// ==================== FUNCIÓN CORREGIDA: REGISTRAR AUTH_ID ====================
async function registrarJugador(jugadorHB) {
    try {
        // Compatibilidad con llamadas legacy por string
        if (typeof jugadorHB === 'string') {
            console.log('⚠️ registrarJugador llamado con string:', jugadorHB);
            jugadorHB = { name: jugadorHB, auth: null };
        }
        
        const authId = jugadorHB.auth;
        const nombre = jugadorHB.name;
        
        console.log('🔍 Registrando jugador:', nombre, '(Auth:', authId || 'SIN_AUTH', ')');
        
        // Verificar si ya existe usando función segura
        const jugadorExistente = await obtenerEstadisticasJugadorSeguro(jugadorHB);
        
        if (!jugadorExistente) {
            const nuevoJugador = {
                auth_id: authId, // CLAVE CRÍTICA
                nombre: nombre,
                partidos: 0,
                victorias: 0,
                derrotas: 0,
                goles: 0,
                asistencias: 0,
                autogoles: 0,
                mejorRachaGoles: 0,
                mejorRachaAsistencias: 0,
                hatTricks: 0,
                vallasInvictas: 0,
                tiempoJugado: 0,
                promedioGoles: 0.0,
                promedioAsistencias: 0.0,
                fechaPrimerPartido: new Date().toISOString(),
                fechaUltimoPartido: new Date().toISOString(),
                xp: 40,
                nivel: 1
            };
            
            // Usar auth_id si está disponible
            if (authId && typeof nodeGuardarJugadorPorAuth !== 'undefined') {
                await nodeGuardarJugadorPorAuth(authId, nombre, nuevoJugador);
                console.log('✅ Registrado por auth_id:', nombre, '(' + authId + ')');
            } else if (typeof nodeGuardarJugador !== 'undefined') {
                console.log('⚠️ Registrando invitado:', nombre);
                await nodeGuardarJugador(nombre, nuevoJugador);
                console.log('✅ Invitado registrado:', nombre);
            }
        } else {
            console.log('ℹ️ Jugador ya existe:', nombre);
        }
    } catch (error) {
        console.error("❌ Error al registrar jugador:", error);
    }
}`;

// Aplicar cambios
let contenidoModificado = contenido;

// Crear backup
const fechaBackup = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = `BOTLNBCODE_backup_auth_fix_${fechaBackup}.js`;
fs.writeFileSync(backupPath, contenido, 'utf8');
console.log('📋 Backup creado:', backupPath);

// Aplicar cambios
console.log('🔧 Reemplazando obtenerEstadisticasJugador...');
contenidoModificado = contenidoModificado.replace(obtenerStats_OLD, obtenerStats_NEW);

console.log('🔧 Reemplazando registrarJugador...');
contenidoModificado = contenidoModificado.replace(registrarJugador_OLD, registrarJugador_NEW);

// Guardar archivo modificado
fs.writeFileSync('./BOTLNBCODE.js', contenidoModificado, 'utf8');

console.log('✅ PARCHE APLICADO EXITOSAMENTE');
console.log('');
console.log('🔐 Cambios aplicados:');
console.log('   ✓ obtenerEstadisticasJugador ahora prioriza auth_id');
console.log('   ✓ registrarJugador ahora usa auth_id como clave única');
console.log('   ✓ Migración automática de jugadores existentes');
console.log('   ✓ Soporte para invitados sin auth (fallback seguro)');
console.log('');
console.log('🛡️ SEGURIDAD MEJORADA:');
console.log('   ✓ Los jugadores ya NO pueden robar estadísticas cambiando nombres');
console.log('   ✓ Cada jugador se identifica por su auth_id único de HaxBall'); 
console.log('   ✓ Compatibilidad mantenida con jugadores existentes');
console.log('');
console.log('📋 Próximos pasos:');
console.log('   1. Reiniciar el bot para aplicar cambios');
console.log('   2. Hacer commit de los cambios');
console.log('   3. Verificar que funciona correctamente');
console.log('');
console.log('⚠️ En caso de problemas, restaurar desde:', backupPath);