-- ==========================================
-- TABLA FESTEJOS PERSONALIZADOS - LNB BOT
-- ==========================================
-- Sistema de persistencia de mensajes de gol y asistencia
-- Compatible con authID y fallback por nombre

CREATE TABLE IF NOT EXISTS `festejos_personalizados` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    
    -- Identificadores del jugador
    `player_name` VARCHAR(100) NOT NULL COMMENT 'Nombre del jugador',
    `auth_id` VARCHAR(255) DEFAULT NULL COMMENT 'Auth ID de HaxBall (único y persistente)',
    
    -- Mensajes personalizados
    `mensaje_gol` TEXT DEFAULT NULL COMMENT 'Mensaje personalizado para goles',
    `mensaje_asistencia` TEXT DEFAULT NULL COMMENT 'Mensaje personalizado para asistencias',
    
    -- Metadatos de uso
    `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Cuándo se creó el registro',
    `ultima_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última vez que se modificó',
    `total_usos` INT(11) DEFAULT 0 COMMENT 'Número de veces que se han mostrado estos festejos',
    `ultimo_uso` TIMESTAMP NULL DEFAULT NULL COMMENT 'Última vez que se usó un festejo',
    
    -- Estadísticas de uso
    `usos_gol` INT(11) DEFAULT 0 COMMENT 'Veces que se usó el festejo de gol',
    `usos_asistencia` INT(11) DEFAULT 0 COMMENT 'Veces que se usó el festejo de asistencia',
    
    PRIMARY KEY (`id`),
    
    -- Índices únicos
    UNIQUE KEY `uk_player_name` (`player_name`),
    UNIQUE KEY `uk_auth_id` (`auth_id`),
    
    -- Índices para consultas rápidas
    KEY `idx_auth_id` (`auth_id`),
    KEY `idx_player_name` (`player_name`),
    KEY `idx_ultima_actualizacion` (`ultima_actualizacion`),
    KEY `idx_ultimo_uso` (`ultimo_uso`),
    
    -- Índice compuesto para limpieza automática
    KEY `idx_limpieza` (`ultima_actualizacion`, `mensaje_gol`, `mensaje_asistencia`)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabla de festejos personalizados persistentes para LNB Bot';

-- ==========================================
-- TRIGGERS PARA ESTADÍSTICAS AUTOMÁTICAS
-- ==========================================

-- Trigger para incrementar contador de usos cuando se actualiza ultimo_uso
DELIMITER //

CREATE TRIGGER IF NOT EXISTS `tr_festejos_actualizar_usos`
    BEFORE UPDATE ON `festejos_personalizados`
    FOR EACH ROW
BEGIN
    -- Si se actualiza ultimo_uso, significa que se usó un festejo
    IF NEW.ultimo_uso IS NOT NULL AND (OLD.ultimo_uso IS NULL OR NEW.ultimo_uso > OLD.ultimo_uso) THEN
        SET NEW.total_usos = OLD.total_usos + 1;
    END IF;
END//

DELIMITER ;

-- ==========================================
-- DATOS INICIALES Y CONFIGURACIÓN
-- ==========================================

-- Insertar configuración del sistema en una tabla de configuración (opcional)
CREATE TABLE IF NOT EXISTS `festejos_config` (
    `clave` VARCHAR(100) PRIMARY KEY,
    `valor` TEXT NOT NULL,
    `descripcion` TEXT DEFAULT NULL,
    `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Configuraciones por defecto
INSERT INTO `festejos_config` (`clave`, `valor`, `descripcion`) VALUES
('max_longitud_mensaje', '50', 'Longitud máxima permitida para mensajes de festejo'),
('min_longitud_mensaje', '3', 'Longitud mínima permitida para mensajes de festejo'),
('dias_limpieza_automatica', '180', 'Días de inactividad antes de limpiar festejos automáticamente'),
('sistema_activo', 'true', 'Indica si el sistema de festejos está activo'),
('version_esquema', '1.0', 'Versión actual del esquema de base de datos')
ON DUPLICATE KEY UPDATE 
    `valor` = VALUES(`valor`),
    `descripcion` = VALUES(`descripcion`);

-- ==========================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- ==========================================

-- Procedimiento para obtener estadísticas del sistema
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS `sp_estadisticas_festejos`()
BEGIN
    SELECT 
        COUNT(*) as total_jugadores,
        COUNT(CASE WHEN mensaje_gol IS NOT NULL THEN 1 END) as con_mensaje_gol,
        COUNT(CASE WHEN mensaje_asistencia IS NOT NULL THEN 1 END) as con_mensaje_asistencia,
        COUNT(CASE WHEN mensaje_gol IS NOT NULL AND mensaje_asistencia IS NOT NULL THEN 1 END) as con_ambos_mensajes,
        COUNT(CASE WHEN auth_id IS NOT NULL AND LENGTH(auth_id) > 8 THEN 1 END) as con_auth_id,
        SUM(total_usos) as total_usos_global,
        AVG(total_usos) as promedio_usos_por_jugador,
        MAX(ultima_actualizacion) as ultima_actividad
    FROM festejos_personalizados;
END//

-- Procedimiento para limpieza automática de festejos obsoletos
CREATE PROCEDURE IF NOT EXISTS `sp_limpiar_festejos_obsoletos`()
BEGIN
    DECLARE registros_eliminados INT DEFAULT 0;
    
    -- Eliminar registros sin mensajes y antiguos
    DELETE FROM festejos_personalizados 
    WHERE ultima_actualizacion < DATE_SUB(NOW(), INTERVAL 180 DAY)
    AND (mensaje_gol IS NULL OR mensaje_gol = '')
    AND (mensaje_asistencia IS NULL OR mensaje_asistencia = '');
    
    SET registros_eliminados = ROW_COUNT();
    
    SELECT registros_eliminados as eliminados, NOW() as fecha_limpieza;
END//

-- Procedimiento para migrar desde sistema temporal
CREATE PROCEDURE IF NOT EXISTS `sp_migrar_festejo_temporal`(
    IN p_auth_id VARCHAR(255),
    IN p_player_name VARCHAR(100),
    IN p_mensaje_gol TEXT,
    IN p_mensaje_asistencia TEXT
)
BEGIN
    INSERT INTO festejos_personalizados (
        player_name, 
        auth_id, 
        mensaje_gol, 
        mensaje_asistencia
    ) VALUES (
        p_player_name,
        p_auth_id,
        p_mensaje_gol,
        p_mensaje_asistencia
    ) ON DUPLICATE KEY UPDATE
        auth_id = COALESCE(p_auth_id, auth_id),
        mensaje_gol = COALESCE(p_mensaje_gol, mensaje_gol),
        mensaje_asistencia = COALESCE(p_mensaje_asistencia, mensaje_asistencia),
        ultima_actualizacion = CURRENT_TIMESTAMP;
END//

DELIMITER ;

-- ==========================================
-- EVENTOS PARA MANTENIMIENTO AUTOMÁTICO
-- ==========================================

-- Habilitar el scheduler de eventos (requiere permisos)
SET GLOBAL event_scheduler = ON;

-- Evento para limpieza automática cada 24 horas
CREATE EVENT IF NOT EXISTS `ev_limpiar_festejos_automatico`
ON SCHEDULE EVERY 24 HOUR
STARTS CURRENT_TIMESTAMP
DO
    CALL sp_limpiar_festejos_obsoletos();

-- ==========================================
-- VISTAS ÚTILES PARA CONSULTAS
-- ==========================================

-- Vista de festejos activos (con al menos un mensaje configurado)
CREATE VIEW IF NOT EXISTS `v_festejos_activos` AS
SELECT 
    id,
    player_name,
    auth_id,
    mensaje_gol,
    mensaje_asistencia,
    fecha_creacion,
    ultima_actualizacion,
    total_usos,
    ultimo_uso,
    CASE 
        WHEN mensaje_gol IS NOT NULL AND mensaje_asistencia IS NOT NULL THEN 'AMBOS'
        WHEN mensaje_gol IS NOT NULL THEN 'SOLO_GOL'
        WHEN mensaje_asistencia IS NOT NULL THEN 'SOLO_ASISTENCIA'
        ELSE 'NINGUNO'
    END as tipo_festejos
FROM festejos_personalizados
WHERE (mensaje_gol IS NOT NULL AND mensaje_gol != '') 
   OR (mensaje_asistencia IS NOT NULL AND mensaje_asistencia != '');

-- Vista de estadísticas por jugador
CREATE VIEW IF NOT EXISTS `v_estadisticas_jugador_festejos` AS
SELECT 
    player_name,
    auth_id,
    total_usos,
    usos_gol,
    usos_asistencia,
    DATEDIFF(NOW(), ultima_actualizacion) as dias_sin_actualizar,
    DATEDIFF(NOW(), ultimo_uso) as dias_sin_usar,
    CASE 
        WHEN ultimo_uso IS NULL THEN 'NUNCA_USADO'
        WHEN DATEDIFF(NOW(), ultimo_uso) <= 7 THEN 'ACTIVO'
        WHEN DATEDIFF(NOW(), ultimo_uso) <= 30 THEN 'MODERADO'
        ELSE 'INACTIVO'
    END as estado_uso
FROM festejos_personalizados;

-- ==========================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ==========================================

-- Índice para búsquedas por authID con filtro de mensajes no nulos
CREATE INDEX IF NOT EXISTS `idx_auth_mensajes` ON `festejos_personalizados` (`auth_id`, `mensaje_gol`, `mensaje_asistencia`);

-- Índice para el sistema de limpieza automática
CREATE INDEX IF NOT EXISTS `idx_limpieza_automatica` ON `festejos_personalizados` (`ultima_actualizacion`, `mensaje_gol`, `mensaje_asistencia`);

-- ==========================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ==========================================

/*
NOTAS IMPORTANTES:

1. UNICIDAD: La tabla usa tanto player_name como auth_id como claves únicas.
   - Esto permite que jugadores sin auth_id usen el sistema (fallback por nombre)
   - Cuando un jugador obtiene auth_id, se puede migrar automáticamente

2. MIGRACIÓN: El sistema puede migrar desde identificación por nombre a auth_id
   - Usar el procedimiento sp_migrar_festejo_temporal()
   - El auth_id siempre tiene prioridad sobre player_name

3. LIMPIEZA: El sistema tiene limpieza automática cada 24 horas
   - Elimina registros sin mensajes y con más de 180 días de antigüedad
   - Mantiene estadísticas de uso para análisis

4. ESTADÍSTICAS: Se rastrean automáticamente los usos de cada festejo
   - total_usos: Contador general de usos
   - usos_gol/usos_asistencia: Contadores específicos
   - ultimo_uso: Timestamp del último uso

5. RENDIMIENTO: Índices optimizados para:
   - Búsquedas por auth_id (más común)
   - Búsquedas por player_name (fallback)
   - Limpieza automática
   - Consultas de estadísticas

EJEMPLO DE USO:

-- Buscar festejos de un jugador por auth_id:
SELECT mensaje_gol, mensaje_asistencia FROM festejos_personalizados WHERE auth_id = 'auth123';

-- Buscar festejos de un jugador por nombre (fallback):
SELECT mensaje_gol, mensaje_asistencia FROM festejos_personalizados WHERE player_name = 'NombreJugador';

-- Actualizar contador de uso de gol:
UPDATE festejos_personalizados SET usos_gol = usos_gol + 1, ultimo_uso = NOW() WHERE auth_id = 'auth123';

-- Ver estadísticas generales:
CALL sp_estadisticas_festejos();

-- Migrar desde sistema temporal:
CALL sp_migrar_festejo_temporal('auth123', 'JugadorX', '¡Mi gol!', '¡Mi pase!');
*/