-- =============================================
-- MIGRACIÓN PARA IDENTIFICACIÓN POR AUTH ID
-- =============================================
-- Este script migra el sistema de identificación de jugadores
-- de nombre a auth_id para evitar conflictos con nombres duplicados

-- Paso 1: Añadir campo auth_id a la tabla jugadores
ALTER TABLE jugadores 
ADD COLUMN auth_id VARCHAR(255) NULL COMMENT 'Auth ID único de HaxBall para identificar jugadores' 
AFTER nombre;

-- Paso 2: Crear índice para auth_id
CREATE INDEX idx_auth_id ON jugadores(auth_id);

-- Paso 3: Añadir campo para vincular nombre actual con auth_id
ALTER TABLE jugadores 
ADD COLUMN nombre_display VARCHAR(100) NULL COMMENT 'Nombre para mostrar (puede cambiar)' 
AFTER auth_id;

-- Paso 4: Crear tabla de vinculación nombre-auth para historial
CREATE TABLE IF NOT EXISTS jugador_nombres_historial (
    id INT PRIMARY KEY AUTO_INCREMENT,
    auth_id VARCHAR(255) NOT NULL COMMENT 'Auth ID del jugador',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre usado',
    primera_vez_usado DATETIME NOT NULL COMMENT 'Primera vez que usó este nombre',
    ultima_vez_usado DATETIME NOT NULL COMMENT 'Última vez que usó este nombre',
    veces_usado INT DEFAULT 1 COMMENT 'Cuántas veces usó este nombre',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_auth_id (auth_id),
    INDEX idx_nombre (nombre),
    INDEX idx_ultima_vez_usado (ultima_vez_usado),
    UNIQUE KEY unique_auth_nombre (auth_id, nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historial de nombres usados por cada jugador identificado por auth_id';

-- Paso 5: Poblar nombre_display con el nombre actual para jugadores existentes
UPDATE jugadores 
SET nombre_display = nombre 
WHERE nombre_display IS NULL;

-- Paso 6: Crear función para buscar jugador por auth_id o nombre
DELIMITER //
CREATE FUNCTION buscar_jugador_por_auth_o_nombre(
    p_auth_id VARCHAR(255),
    p_nombre VARCHAR(100)
) RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE jugador_id INT DEFAULT NULL;
    
    -- Primero buscar por auth_id si está disponible
    IF p_auth_id IS NOT NULL AND p_auth_id != '' THEN
        SELECT id INTO jugador_id 
        FROM jugadores 
        WHERE auth_id = p_auth_id 
        LIMIT 1;
    END IF;
    
    -- Si no se encontró por auth_id, buscar por nombre
    IF jugador_id IS NULL AND p_nombre IS NOT NULL AND p_nombre != '' THEN
        SELECT id INTO jugador_id 
        FROM jugadores 
        WHERE nombre = p_nombre 
        LIMIT 1;
    END IF;
    
    RETURN jugador_id;
END//
DELIMITER ;

-- Paso 7: Crear vista para consultas optimizadas
CREATE OR REPLACE VIEW vista_jugadores_completa AS
SELECT 
    j.*,
    COALESCE(j.nombre_display, j.nombre) as nombre_mostrar,
    CASE 
        WHEN j.auth_id IS NOT NULL THEN 'auth'
        ELSE 'nombre'
    END as tipo_identificacion
FROM jugadores j;

COMMIT;

-- Mensaje de confirmación
SELECT 'Migración auth_id completada exitosamente' as resultado,
       COUNT(*) as total_jugadores_migrados
FROM jugadores;
