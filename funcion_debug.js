    guardarJugadorPorAuth: async (authId, nombreActual, stats) => {
        try {
            // Validaciones iniciales
            if (!authId) {
                console.error('❌ [AUTH-ID] Error: authId es requerido');
                throw new Error('authId es requerido');
            }
            
            if (!nombreActual || nombreActual.trim() === '') {
                console.error('❌ [AUTH-ID] Error: nombreActual es requerido');
                throw new Error('nombreActual es requerido');
            }

            console.log(`🔄 [AUTH-ID] Iniciando guardado para: ${nombreActual} (Auth: ${authId})`);
            console.log(`🔍 [AUTH-ID DEBUG] Tipo de authId:`, typeof authId);
            console.log(`🔍 [AUTH-ID DEBUG] Valor de authId:`, authId);
            console.log(`🔍 [AUTH-ID DEBUG] Longitud de authId:`, authId?.length);
            
            // Registrar historial de nombres
            await dbFunctions.registrarNombreJugador(authId, nombreActual);
            
            // Valores por defecto robustos
            const statsSeguras = {
                partidos: stats?.partidos ?? 0,
                victorias: stats?.victorias ?? 0,
                derrotas: stats?.derrotas ?? 0,
                goles: stats?.goles ?? 0,
                asistencias: stats?.asistencias ?? 0,
                autogoles: stats?.autogoles ?? 0,
                mejorRachaGoles: stats?.mejorRachaGoles ?? 0,
                mejorRachaAsistencias: stats?.mejorRachaAsistencias ?? 0,
                hatTricks: stats?.hatTricks ?? 0,
                vallasInvictas: stats?.vallasInvictas ?? 0,
                tiempoJugado: stats?.tiempoJugado ?? 0,
                promedioGoles: stats?.promedioGoles ?? 0.0,
                promedioAsistencias: stats?.promedioAsistencias ?? 0.0,
                fechaPrimerPartido: stats?.fechaPrimerPartido ?? new Date(),
                fechaUltimoPartido: stats?.fechaUltimoPartido ?? new Date(),
                xp: stats?.xp ?? 40,
                nivel: stats?.nivel ?? 1,
                codigoRecuperacion: stats?.codigoRecuperacion ?? null,
                fechaCodigoCreado: stats?.fechaCodigoCreado ?? null,
                mvps: stats?.mvps ?? 0
            };

            console.log(`📊 [AUTH-ID] Stats preparadas:`, statsSeguras);
            
            const query = `INSERT INTO jugadores 
                          (auth_id, nombre, nombre_display, partidos, victorias, derrotas, goles, asistencias, autogoles, 
                           mejorRachaGoles, mejorRachaAsistencias, hatTricks, vallasInvictas, 
                           tiempoJugado, promedioGoles, promedioAsistencias, fechaPrimerPartido, 
                           fechaUltimoPartido, xp, nivel, codigoRecuperacion, fechaCodigoCreado, mvps, updated_at)
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                          ON DUPLICATE KEY UPDATE
                          nombre = VALUES(nombre), nombre_display = VALUES(nombre_display),
                          partidos = VALUES(partidos), victorias = VALUES(victorias), derrotas = VALUES(derrotas),
                          goles = VALUES(goles), asistencias = VALUES(asistencias), autogoles = VALUES(autogoles),
                          mejorRachaGoles = VALUES(mejorRachaGoles), mejorRachaAsistencias = VALUES(mejorRachaAsistencias),
                          hatTricks = VALUES(hatTricks), vallasInvictas = VALUES(vallasInvictas),
                          tiempoJugado = VALUES(tiempoJugado), promedioGoles = VALUES(promedioGoles),
                          promedioAsistencias = VALUES(promedioAsistencias), fechaPrimerPartido = VALUES(fechaPrimerPartido),
                          fechaUltimoPartido = VALUES(fechaUltimoPartido), xp = VALUES(xp), nivel = VALUES(nivel),
                          codigoRecuperacion = VALUES(codigoRecuperacion), fechaCodigoCreado = VALUES(fechaCodigoCreado),
                          mvps = VALUES(mvps), updated_at = CURRENT_TIMESTAMP`;
            
            const parametros = [
                authId, nombreActual, nombreActual, 
                statsSeguras.partidos, statsSeguras.victorias, statsSeguras.derrotas, statsSeguras.goles, 
                statsSeguras.asistencias, statsSeguras.autogoles, statsSeguras.mejorRachaGoles, statsSeguras.mejorRachaAsistencias, 
                statsSeguras.hatTricks, statsSeguras.vallasInvictas, statsSeguras.tiempoJugado, statsSeguras.promedioGoles, 
                statsSeguras.promedioAsistencias, statsSeguras.fechaPrimerPartido, statsSeguras.fechaUltimoPartido, 
                statsSeguras.xp, statsSeguras.nivel, statsSeguras.codigoRecuperacion, statsSeguras.fechaCodigoCreado,
                statsSeguras.mvps
            ];

            console.log(`🔍 [AUTH-ID DEBUG] Primer parámetro (authId):`, parametros[0]);
            console.log(`🔍 [AUTH-ID DEBUG] Tipo del primer parámetro:`, typeof parametros[0]);
            console.log(`🔍 [AUTH-ID DEBUG] Es null primer parámetro:`, parametros[0] === null);
            console.log(`🔍 [AUTH-ID DEBUG] Es undefined primer parámetro:`, parametros[0] === undefined);
            
            console.log(`🔍 [AUTH-ID] Ejecutando query con parámetros:`, parametros);
            
            // Test directo con MySQL antes del INSERT
            console.log(`🧪 [TEST] Probando query directa antes del INSERT...`);
            const testQuery = `SELECT COUNT(*) as count FROM jugadores WHERE auth_id = ?`;
            const testResult = await executeQuery(testQuery, [authId]);
            console.log(`🧪 [TEST] Resultado de COUNT antes del INSERT:`, testResult);
            
            const result = await executeQuery(query, parametros);
            
            console.log(`📝 [AUTH-ID] Resultado de query:`, result);
            
            // Test directo después del INSERT
            console.log(`🧪 [TEST] Probando query directa después del INSERT...`);
            const testResult2 = await executeQuery(testQuery, [authId]);
            console.log(`🧪 [TEST] Resultado de COUNT después del INSERT:`, testResult2);
            
            // Verificar que realmente se guardó usando el insertId
            console.log(`🔍 [DEBUG] Verificando por insertId: ${result.insertId}`);
            const verificacionPorId = await executeQuery('SELECT * FROM jugadores WHERE id = ?', [result.insertId]);
            console.log(`🔍 [DEBUG] Registro encontrado por ID:`, verificacionPorId[0]);
            
            // Verificar que realmente se guardó usando auth_id
            const jugadorVerificacion = await dbFunctions.obtenerJugadorPorAuth(authId);
            if (!jugadorVerificacion) {
                console.error(`❌ [AUTH-ID] FALLO CRÍTICO: Jugador no se encontró después del INSERT para authId: ${authId}`);
                console.error(`🔍 [DEBUG] Buscando cualquier registro con nombre similar...`);
                const busquedaNombre = await executeQuery('SELECT * FROM jugadores WHERE nombre = ?', [nombreActual]);
                console.error(`🔍 [DEBUG] Registros con mismo nombre:`, busquedaNombre);
                throw new Error('El jugador no se guardó correctamente en la base de datos');
            }
            
            console.log(`✅ [AUTH-ID] Jugador guardado y verificado: ${nombreActual} (Auth: ${authId})`);
            console.log(`🎯 [AUTH-ID] Datos verificados:`, {
                id: jugadorVerificacion.id,
                nombre: jugadorVerificacion.nombre,
                nombre_display: jugadorVerificacion.nombre_display,
                auth_id: jugadorVerificacion.auth_id
            });
            
            return result.insertId || result.affectedRows;
        } catch (error) {
            console.error(`❌ [AUTH-ID] Error guardando jugador por auth_id (${authId}):`, error);
            console.error(`📋 [AUTH-ID] Stack trace:`, error.stack);
            throw error;
        }
    },