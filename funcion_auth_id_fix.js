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

            console.log(`📊 [AUTH-ID] Stats preparadas para ${nombreActual}`);
            
            // ESTRATEGIA CORREGIDA: Primero verificar si existe y luego decidir INSERT o UPDATE
            const jugadorExistente = await dbFunctions.obtenerJugadorPorAuth(authId);
            
            let result;
            if (jugadorExistente) {
                console.log(`🔄 [AUTH-ID] Jugador existente encontrado (ID: ${jugadorExistente.id}), actualizando...`);
                
                // UPDATE: Actualizar registro existente (solo nombre y timestamps, mantener stats)
                const updateQuery = `UPDATE jugadores 
                                    SET nombre = ?, nombre_display = ?, updated_at = CURRENT_TIMESTAMP
                                    WHERE auth_id = ?`;
                
                result = await executeQuery(updateQuery, [nombreActual, nombreActual, authId]);
                result.insertId = jugadorExistente.id; // Para mantener compatibilidad
                
                console.log(`✅ [AUTH-ID] Jugador actualizado: ${nombreActual} (ID: ${jugadorExistente.id})`);
            } else {
                console.log(`🆕 [AUTH-ID] Nuevo jugador, insertando...`);
                
                // INSERT: Crear nuevo registro completo
                const insertQuery = `INSERT INTO jugadores 
                                    (auth_id, nombre, nombre_display, partidos, victorias, derrotas, goles, asistencias, autogoles, 
                                     mejorRachaGoles, mejorRachaAsistencias, hatTricks, vallasInvictas, 
                                     tiempoJugado, promedioGoles, promedioAsistencias, fechaPrimerPartido, 
                                     fechaUltimoPartido, xp, nivel, codigoRecuperacion, fechaCodigoCreado, mvps, updated_at)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
                
                const parametros = [
                    authId, nombreActual, nombreActual, 
                    statsSeguras.partidos, statsSeguras.victorias, statsSeguras.derrotas, statsSeguras.goles, 
                    statsSeguras.asistencias, statsSeguras.autogoles, statsSeguras.mejorRachaGoles, statsSeguras.mejorRachaAsistencias, 
                    statsSeguras.hatTricks, statsSeguras.vallasInvictas, statsSeguras.tiempoJugado, statsSeguras.promedioGoles, 
                    statsSeguras.promedioAsistencias, statsSeguras.fechaPrimerPartido, statsSeguras.fechaUltimoPartido, 
                    statsSeguras.xp, statsSeguras.nivel, statsSeguras.codigoRecuperacion, statsSeguras.fechaCodigoCreado,
                    statsSeguras.mvps
                ];
                
                result = await executeQuery(insertQuery, parametros);
                console.log(`✅ [AUTH-ID] Nuevo jugador insertado: ${nombreActual} (ID: ${result.insertId})`);
            }
            
            console.log(`📝 [AUTH-ID] Resultado de operación:`, result);
            
            // Verificación final
            const jugadorFinal = await dbFunctions.obtenerJugadorPorAuth(authId);
            if (!jugadorFinal) {
                console.error(`❌ [AUTH-ID] FALLO CRÍTICO: Jugador no encontrado después de la operación para authId: ${authId}`);
                throw new Error('El jugador no se guardó correctamente en la base de datos');
            }
            
            console.log(`✅ [AUTH-ID] Operación exitosa para: ${nombreActual} (Auth: ${authId})`);
            console.log(`🎯 [AUTH-ID] Datos finales:`, {
                id: jugadorFinal.id,
                nombre: jugadorFinal.nombre,
                auth_id: jugadorFinal.auth_id,
                goles: jugadorFinal.goles,
                partidos: jugadorFinal.partidos
            });
            
            return result.insertId || result.affectedRows;
            
        } catch (error) {
            // Manejar errores de constraint UNIQUE para nombres duplicados
            if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage && error.sqlMessage.includes('nombre')) {
                console.log(`⚠️ [AUTH-ID] Nombre duplicado detectado, pero authId es único. Intentando actualizar por auth_id...`);
                
                try {
                    // Actualizar solo el jugador con este auth_id
                    const updateQuery = `UPDATE jugadores 
                                        SET nombre = ?, nombre_display = ?, updated_at = CURRENT_TIMESTAMP
                                        WHERE auth_id = ?`;
                    
                    const result = await executeQuery(updateQuery, [nombreActual, nombreActual, authId]);
                    console.log(`✅ [AUTH-ID] Actualización exitosa después de error de nombre duplicado`);
                    return result.affectedRows;
                    
                } catch (updateError) {
                    console.error(`❌ [AUTH-ID] Error en actualización de respaldo:`, updateError);
                    throw updateError;
                }
            }
            
            console.error(`❌ [AUTH-ID] Error guardando jugador por auth_id (${authId}):`, error);
            throw error;
        }
    },