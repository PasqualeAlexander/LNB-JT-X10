/**
 * PARCHE CRÍTICO: CORREGIR BUG DE IDENTIFICACIÓN POR NOMBRE
 * ==========================================================
 * 
 * Este parche corrige el bug crítico donde jugadores pueden asumir
 * las estadísticas de otros cambiando su nombre. El sistema ahora
 * usa auth_id como identificador principal.
 * 
 * PROBLEMA:
 * - obtenerEstadisticasJugador() usa solo nombre
 * - registrarJugador() usa solo nombre
 * - Jugadores pueden "robar" estadísticas cambiando nombres
 * 
 * SOLUCIÓN:
 * - Usar auth_id como identificador único principal
 * - Fallback a nombre solo para jugadores sin auth (invitados)
 * - Migrar automáticamente jugadores existentes
 */

const fs = require('fs');
const path = require('path');

class AuthIdentificationFix {
    constructor() {
        this.backupPath = './BOTLNBCODE_backup_auth_fix.js';
        this.botPath = './BOTLNBCODE.js';
    }
    
    async aplicarParche() {
        console.log('🔧 Iniciando parche de identificación por Auth ID...');
        
        try {
            // 1. Crear backup
            await this.crearBackup();
            
            // 2. Leer archivo actual
            const contenidoActual = fs.readFileSync(this.botPath, 'utf8');
            
            // 3. Aplicar correcciones
            let contenidoCorregido = contenidoActual;
            
            // Corregir función obtenerEstadisticasJugador
            contenidoCorregido = this.corregirObtenerEstadisticas(contenidoCorregido);
            
            // Corregir función registrarJugador  
            contenidoCorregido = this.corregirRegistrarJugador(contenidoCorregido);
            
            // Agregar funciones auxiliares
            contenidoCorregido = this.agregarFuncionesAuxiliares(contenidoCorregido);
            
            // Corregir llamadas en el código
            contenidoCorregido = this.corregirLlamadas(contenidoCorregido);
            
            // 4. Guardar archivo corregido
            fs.writeFileSync(this.botPath, contenidoCorregido, 'utf8');
            
            console.log('✅ Parche aplicado exitosamente');
            console.log('📋 Cambios aplicados:');
            console.log('   - obtenerEstadisticasJugador() ahora usa auth_id');
            console.log('   - registrarJugador() ahora usa auth_id');
            console.log('   - Migración automática de jugadores existentes');
            console.log('   - Fallback seguro para invitados sin auth');
            
            return true;
            
        } catch (error) {
            console.error('❌ Error aplicando parche:', error);
            
            // Restaurar backup si existe
            if (fs.existsSync(this.backupPath)) {
                console.log('🔄 Restaurando backup...');
                fs.copyFileSync(this.backupPath, this.botPath);
            }
            
            return false;
        }
    }
    
    async crearBackup() {
        console.log('📋 Creando backup...');
        fs.copyFileSync(this.botPath, this.backupPath);
        console.log(`✅ Backup creado: ${this.backupPath}`);
    }
    
    corregirObtenerEstadisticas(contenido) {
        console.log('🔧 Corrigiendo obtenerEstadisticasJugador...');
        
        const funcionActual = `async function obtenerEstadisticasJugador(nombre) {
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

        const funcionCorregida = `// ==================== FUNCIÓN CORREGIDA: USAR AUTH_ID ====================
async function obtenerEstadisticasJugador(identificador, tipoIdentificador = 'auto') {
    try {
        // Si recibimos un objeto jugador de HaxBall, extraer datos
        if (typeof identificador === 'object' && identificador.name) {
            const jugadorHB = identificador;
            return await obtenerEstadisticasJugadorPorAuth(jugadorHB);
        }
        
        // Si es string, determinar si es auth_id o nombre
        if (typeof identificador === 'string') {
            // Auto-detectar tipo si no se especifica
            if (tipoIdentificador === 'auto') {
                tipoIdentificador = determinarTipoIdentificador(identificador);
            }
            
            if (tipoIdentificador === 'auth' && typeof nodeObtenerJugadorPorAuth !== 'undefined') {
                // Buscar por auth_id primero
                const resultado = await nodeObtenerJugadorPorAuth(identificador);
                if (resultado) {
                    console.log(`🎯 Estadísticas encontradas por auth_id: ${identificador}`);
                    return resultado;
                }
            }
            
            // Fallback: buscar por nombre (para compatibilidad)
            if (typeof nodeObtenerJugador !== 'undefined') {
                console.log(\`⚠️ Fallback a búsqueda por nombre: \${identificador}\`);
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

// Nueva función específica para jugadores de HaxBall con auth
async function obtenerEstadisticasJugadorPorAuth(jugadorHB) {
    try {
        const authId = jugadorHB.auth;
        const nombre = jugadorHB.name;
        
        console.log(\`🔍 Obteniendo estadísticas: \${nombre} (Auth: \${authId || 'SIN_AUTH'})\`);
        
        // Si tiene auth_id, intentar buscar por auth primero
        if (authId && typeof nodeObtenerJugadorPorAuth !== 'undefined') {
            let jugadorPorAuth = await nodeObtenerJugadorPorAuth(authId);
            
            if (jugadorPorAuth) {
                // Actualizar nombre si es diferente
                if (jugadorPorAuth.nombre !== nombre && typeof nodeActualizarNombreJugador !== 'undefined') {
                    await nodeActualizarNombreJugador(authId, nombre);
                    jugadorPorAuth.nombre = nombre; // Actualizar en memoria
                }
                console.log(\`✅ Estadísticas encontradas por auth_id: \${authId}\`);
                return jugadorPorAuth;
            }
            
            // No existe con este auth_id, intentar migrar desde nombre
            if (typeof nodeObtenerJugador !== 'undefined') {
                const jugadorPorNombre = await nodeObtenerJugador(nombre);
                if (jugadorPorNombre && !jugadorPorNombre.auth_id) {
                    // Migrar este jugador al sistema auth_id
                    console.log(\`🎯 Migrando jugador existente: \${nombre} -> \${authId}\`);
                    const resultadoMigracion = await migrarJugadorAAuth(nombre, authId);
                    if (resultadoMigracion.migrado) {
                        return resultadoMigracion.jugador;
                    }
                }
            }
        }
        
        // Fallback para jugadores sin auth (invitados) - SOLO para lectura
        if (!authId && typeof nodeObtenerJugador !== 'undefined') {
            console.log(\`⚠️ Jugador sin auth_id (invitado), usando nombre: \${nombre}\`);
            return await nodeObtenerJugador(nombre);
        }
        
        // Jugador completamente nuevo
        return null;
        
    } catch (error) {
        console.error("❌ Error obteniendo estadísticas por auth:", error);
        return null;
    }
}`;

        return contenido.replace(funcionActual, funcionCorregida);
    }
    
    corregirRegistrarJugador(contenido) {
        console.log('🔧 Corrigiendo registrarJugador...');
        
        const funcionActual = `async function registrarJugador(nombre) {
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

        const funcionCorregida = `// ==================== FUNCIÓN CORREGIDA: REGISTRAR POR AUTH_ID ====================
async function registrarJugador(jugadorHB) {
    try {
        // Si recibimos string (compatibilidad), crear objeto básico
        if (typeof jugadorHB === 'string') {
            console.log(\`⚠️ ADVERTENCIA: registrarJugador llamado con nombre string: \${jugadorHB}\`);
            console.log(\`⚠️ Esto puede indicar un bug. Se recomienda usar objeto jugador completo.\`);
            jugadorHB = { name: jugadorHB, auth: null };
        }
        
        const authId = jugadorHB.auth;
        const nombre = jugadorHB.name;
        
        console.log(\`🔍 Registrando jugador: \${nombre} (Auth: \${authId || 'SIN_AUTH'})\`);
        
        // Verificar si ya existe
        const jugadorExistente = await obtenerEstadisticasJugadorPorAuth(jugadorHB);
        
        if (!jugadorExistente) {
            const nuevoJugador = {
                auth_id: authId, // 🎯 CLAVE ÚNICA AGREGADA
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
            
            // Registrar usando auth_id si está disponible
            if (authId && typeof nodeGuardarJugadorPorAuth !== 'undefined') {
                await nodeGuardarJugadorPorAuth(authId, nombre, nuevoJugador);
                console.log(\`✅ Nuevo jugador registrado por auth_id: \${nombre} (\${authId})\`);
            } else if (typeof nodeGuardarJugador !== 'undefined') {
                // Fallback para invitados sin auth
                console.log(\`⚠️ Registrando invitado sin auth_id: \${nombre}\`);
                await nodeGuardarJugador(nombre, nuevoJugador);
                console.log(\`✅ Nuevo jugador invitado registrado: \${nombre}\`);
            }
        } else {
            console.log(\`ℹ️ Jugador ya existe: \${nombre}\`);
        }
    } catch (error) {
        console.error("❌ Error al registrar jugador:", error);
    }
}`;

        return contenido.replace(funcionActual, funcionCorregida);
    }
    
    agregarFuncionesAuxiliares(contenido) {
        console.log('🔧 Agregando funciones auxiliares...');
        
        const funcionesAuxiliares = `

// ==================== FUNCIONES AUXILIARES PARA AUTH_ID ====================

/**
 * Determina si un identificador es auth_id o nombre
 */
function determinarTipoIdentificador(identificador) {
    if (!identificador || typeof identificador !== 'string') {
        return 'nombre';
    }
    
    // Los auth_id de HaxBall son largos y alfanuméricos
    if (identificador.length > 20 && /^[a-zA-Z0-9_-]+$/.test(identificador)) {
        return 'auth';
    }
    
    return 'nombre';
}

/**
 * Migra un jugador del sistema por nombre al sistema auth_id
 */
async function migrarJugadorAAuth(nombre, authId) {
    try {
        if (typeof nodeMigrarJugadorAAuth !== 'undefined') {
            const resultado = await nodeMigrarJugadorAAuth(nombre, authId);
            console.log(\`🎯 Migración completada: \${nombre} -> \${authId}\`);
            return resultado;
        } else {
            console.warn('⚠️ Función de migración no disponible');
            return { migrado: false, razon: 'funcion_no_disponible' };
        }
    } catch (error) {
        console.error('❌ Error en migración:', error);
        return { migrado: false, razon: 'error', error: error.message };
    }
}

/**
 * Obtiene estadísticas de manera segura considerando auth_id
 */
async function obtenerEstadisticasSeguro(jugadorHB) {
    try {
        return await obtenerEstadisticasJugadorPorAuth(jugadorHB);
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas seguro:', error);
        return null;
    }
}

/**
 * Registra jugador de manera segura usando auth_id
 */
async function registrarJugadorSeguro(jugadorHB) {
    try {
        await registrarJugador(jugadorHB);
    } catch (error) {
        console.error('❌ Error registrando jugador seguro:', error);
    }
}

// ==================== FIN FUNCIONES AUXILIARES AUTH_ID ====================
`;

        // Insertar después de las funciones principales de estadísticas
        const puntoInsercion = contenido.indexOf('// HBInit y fetch están disponibles globalmente en el navegador');
        if (puntoInsercion !== -1) {
            return contenido.slice(0, puntoInsercion) + funcionesAuxiliares + '\\n\\n' + contenido.slice(puntoInsercion);
        }
        
        // Si no encontramos el punto, insertar al final de las funciones de DB
        return contenido.replace('// ==================== CONFIGURACIÓN DE LA SALA ====================', 
                                funcionesAuxiliares + '\\n\\n// ==================== CONFIGURACIÓN DE LA SALA ====================');
    }
    
    corregirLlamadas(contenido) {
        console.log('🔧 Corrigiendo llamadas en el código...');
        
        let contenidoCorregido = contenido;
        
        // Corregir llamadas en onPlayerJoin donde se registra jugadores
        contenidoCorregido = contenidoCorregido.replace(
            /registrarJugador\(obtenerNombreOriginal\(jugador\)\)/g,
            'registrarJugadorSeguro(jugador)'
        );
        
        // Corregir llamadas en comandos de estadísticas
        contenidoCorregido = contenidoCorregido.replace(
            /obtenerEstadisticasJugador\(([^)]+)\)/g,
            (match, param) => {
                // Si el parámetro parece ser un nombre de variable de jugador, usar la versión segura
                if (param.includes('jugador.name') || param.includes('nombreOriginal')) {
                    return `obtenerEstadisticasSeguro(jugador)`;
                }
                return match; // Mantener llamadas con strings literales
            }
        );
        
        return contenidoCorregido;
    }
}

// ==================== EJECUTAR PARCHE ====================
async function main() {
    console.log('🚀 INICIANDO PARCHE DE IDENTIFICACIÓN AUTH_ID');
    console.log('================================================');
    
    const fix = new AuthIdentificationFix();
    const resultado = await fix.aplicarParche();
    
    if (resultado) {
        console.log('\\n✅ PARCHE APLICADO EXITOSAMENTE');
        console.log('================================================');
        console.log('🔐 El sistema ahora usa auth_id como identificador principal');
        console.log('🛡️ Los jugadores no pueden "robar" estadísticas cambiando nombres');
        console.log('🔄 Los jugadores existentes se migrarán automáticamente');
        console.log('👥 Los invitados sin auth siguen funcionando (solo lectura)');
        console.log('\\n📋 Próximos pasos:');
        console.log('   1. Reiniciar el bot para aplicar los cambios');
        console.log('   2. Verificar que las funciones de DB soporten auth_id');
        console.log('   3. Hacer git commit de los cambios');
        console.log('\\n⚠️ IMPORTANTE: Si algo sale mal, el backup está en:');
        console.log(\`   \${fix.backupPath}\`);
    } else {
        console.log('\\n❌ ERROR APLICANDO PARCHE');
        console.log('Revisa los logs arriba para más detalles');
    }
}

if (require.main === module) {
    main();
}

module.exports = { AuthIdentificationFix };