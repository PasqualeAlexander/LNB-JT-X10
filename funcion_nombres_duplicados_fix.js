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
            
            // ESTRATEGIA CORREGIDA: Primero verificar si YA EXISTE este auth_id
            const jugadorExistente = await dbFunctions.obtenerJugadorPorAuth(authId);
            
            let result;
            if (jugadorExistente) {
                console.log(`🔄 [AUTH-ID] Jugador existente encontrado (ID: ${jugadorExistente.id}), actualizando registro existente...`);
                
                // UPDATE: Actualizar SOLO el registro con este auth_id específico
                const updateQuery = `UPDATE jugadores 
                                    SET nombre = ?, nombre_display = ?, updated_at = CURRENT_TIMESTAMP
                                    WHERE auth_id = ?`;
                
                result = await executeQuery(updateQuery, [nombreActual, nombreActual, authId]);
                result.insertId = jugadorExistente.id; // Para mantener compatibilidad
                
                console.log(`✅ [AUTH-ID] Registro existente actualizado: ${nombreActual} (ID: ${jugadorExistente.id})`);
            } else {
                console.log(`🆕 [AUTH-ID] Nuevo jugador, verificando disponibilidad de nombre...`);
                
                // Verificar si el nombre ya existe (por otro jugador)
                const nombreExiste = await executeQuery('SELECT id, auth_id FROM jugadores WHERE nombre = ?', [nombreActual]);
                
                let nombreFinal = nombreActual;
                if (nombreExiste.length > 0) {
                    console.log(`⚠️ [AUTH-ID] Nombre "${nombreActual}" ya existe (usado por auth_id: ${nombreExiste[0].auth_id})`);
                    
                    // Generar nombre único agregando sufijo
                    let contador = 2;
                    while (true) {
                        const nombreTentativo = `${nombreActual} (${contador})`;
                        const nombreDisponible = await executeQuery('SELECT id FROM jugadores WHERE nombre = ?', [nombreTentativo]);
                        
                        if (nombreDisponible.length === 0) {
                            nombreFinal = nombreTentativo;
                            console.log(`✅ [AUTH-ID] Nombre único generado: "${nombreFinal}"`);
                            break;
                        }
                        contador++;
                        
                        // Prevenir bucle infinito
                        if (contador > 100) {
                            nombreFinal = `${nombreActual} (${Date.now()})`;
                            console.log(`⚠️ [AUTH-ID] Generando nombre con timestamp: "${nombreFinal}"`);
                            break;
                        }
                    }
                }
                
                // INSERT: Crear nuevo registro con nombre único
                const insertQuery = `INSERT INTO jugadores 
                                    (auth_id, nombre, nombre_display, partidos, victorias, derrotas, goles, asistencias, autogoles, 
                                     mejorRachaGoles, mejorRachaAsistencias, hatTricks, vallasInvictas, 
                                     tiempoJugado, promedioGoles, promedioAsistencias, fechaPrimerPartido, 
                                     fechaUltimoPartido, xp, nivel, codigoRecuperacion, fechaCodigoCreado, mvps, updated_at)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
                
                const parametros = [
                    authId, nombreFinal, nombreFinal, 
                    statsSeguras.partidos, statsSeguras.victorias, statsSeguras.derrotas, statsSeguras.goles, 
                    statsSeguras.asistencias, statsSeguras.autogoles, statsSeguras.mejorRachaGoles, statsSeguras.mejorRachaAsistencias, 
                    statsSeguras.hatTricks, statsSeguras.vallasInvictas, statsSeguras.tiempoJugado, statsSeguras.promedioGoles, 
                    statsSeguras.promedioAsistencias, statsSeguras.fechaPrimerPartido, statsSeguras.fechaUltimoPartido, 
                    statsSeguras.xp, statsSeguras.nivel, statsSeguras.codigoRecuperacion, statsSeguras.fechaCodigoCreado,
                    statsSeguras.mvps
                ];
                
                result = await executeQuery(insertQuery, parametros);
                console.log(`✅ [AUTH-ID] Nuevo jugador insertado: "${nombreFinal}" (ID: ${result.insertId})`);
                
                // Informar al usuario si se cambió el nombre
                if (nombreFinal !== nombreActual) {
                    console.log(`📝 [AUTH-ID] NOTA: Nombre modificado de "${nombreActual}" a "${nombreFinal}" para evitar duplicados`);
                }
            }
            
            console.log(`📝 [AUTH-ID] Resultado de operación:`, result);
            
            // Verificación final usando auth_id (la clave real)
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
            console.error(`❌ [AUTH-ID] Error guardando jugador por auth_id (${authId}):`, error);
            console.error(`📋 [AUTH-ID] Stack trace:`, error.stack);
            throw error;
        }
    },