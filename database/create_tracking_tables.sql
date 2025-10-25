-- =============================================
-- TABLAS PARA SISTEMA DE TRACKING DE JUGADORES
-- =============================================
-- Script para crear las tablas necesarias para el sistema de tracking persistente
-- que reemplaza los Maps de JavaScript para evitar pérdida de datos

-- Tabla para historial de nombres de jugadores
CREATE TABLE IF NOT EXISTS historial_nombres_jugadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    auth_jugador VARCHAR(255) NOT NULL COMMENT 'Auth del jugador de HaxBall',
    nombre VARCHAR(100) NOT NULL COMMENT 'Nombre usado por el jugador',
    primera_vez_usado DATETIME NOT NULL COMMENT 'Primera vez que usó este nombre',
    ultima_vez_usado DATETIME NOT NULL COMMENT 'Última vez que usó este nombre',
    veces_usado INT DEFAULT 1 COMMENT 'Cuántas veces ha usado este nombre',
    sala_id VARCHAR(50) COMMENT 'ID de la sala donde se registró',
    ip_simulada VARCHAR(45) COMMENT 'IP simulada asignada al jugador',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para optimizar consultas
    INDEX idx_auth_jugador (auth_jugador),
    INDEX idx_nombre (nombre),
    INDEX idx_fecha_uso (ultima_vez_usado),
    INDEX idx_sala (sala_id),
    
    -- Restricción única para auth + nombre
    UNIQUE KEY unique_auth_nombre (auth_jugador, nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historial de nombres usados por cada jugador identificado por su auth';

-- Tabla para tracking detallado de jugadores
CREATE TABLE IF NOT EXISTS jugadores_tracking (
    id INT PRIMARY KEY AUTO_INCREMENT,
    auth_jugador VARCHAR(255) NOT NULL UNIQUE COMMENT 'Auth del jugador de HaxBall',
    primer_nombre VARCHAR(100) NOT NULL COMMENT 'Primer nombre registrado',
    nombre_actual VARCHAR(100) COMMENT 'Último nombre usado',
    primera_conexion DATETIME NOT NULL COMMENT 'Primera vez que se conectó',
    ultima_conexion DATETIME NOT NULL COMMENT 'Última vez que se conectó',
    total_conexiones INT DEFAULT 1 COMMENT 'Total de veces que se conectó',
    conexiones_hoy INT DEFAULT 1 COMMENT 'Conexiones del día actual',
    fecha_contador_diario DATE NOT NULL COMMENT 'Fecha del contador diario actual',
    ip_simulada VARCHAR(45) NOT NULL COMMENT 'IP simulada asignada',
    tiempo_total_sesion BIGINT DEFAULT 0 COMMENT 'Tiempo total jugado en milisegundos',
    es_jugador_nuevo BOOLEAN DEFAULT TRUE COMMENT 'Si es la primera vez que se conecta',
    ultima_sala VARCHAR(50) COMMENT 'Última sala visitada',
    veces_kickeado INT DEFAULT 0 COMMENT 'Veces que fue expulsado',
    veces_baneado INT DEFAULT 0 COMMENT 'Veces que fue baneado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices para optimizar consultas
    INDEX idx_auth_jugador (auth_jugador),
    INDEX idx_ultima_conexion (ultima_conexion),
    INDEX idx_primera_conexion (primera_conexion),
    INDEX idx_total_conexiones (total_conexiones),
    INDEX idx_fecha_contador (fecha_contador_diario),
    INDEX idx_ip_simulada (ip_simulada),
    INDEX idx_es_nuevo (es_jugador_nuevo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Tracking detallado de cada jugador por su auth';

-- Tabla para sesiones activas de jugadores
CREATE TABLE IF NOT EXISTS sesiones_jugadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    auth_jugador VARCHAR(255) NOT NULL COMMENT 'Auth del jugador',
    nombre_sesion VARCHAR(100) NOT NULL COMMENT 'Nombre usado en esta sesión',
    inicio_sesion DATETIME NOT NULL COMMENT 'Inicio de la sesión',
    fin_sesion DATETIME NULL COMMENT 'Fin de la sesión (NULL si está activa)',
    duracion_sesion BIGINT NULL COMMENT 'Duración en milisegundos',
    sala_id VARCHAR(50) NOT NULL COMMENT 'Sala donde ocurrió la sesión',
    ip_simulada VARCHAR(45) NOT NULL COMMENT 'IP simulada de la sesión',
    motivo_desconexion ENUM('normal', 'kick', 'ban', 'error', 'timeout') DEFAULT 'normal',
    razon_adicional VARCHAR(255) NULL COMMENT 'Razón adicional para kick/ban',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Si la sesión está activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_auth_jugador (auth_jugador),
    INDEX idx_inicio_sesion (inicio_sesion),
    INDEX idx_fin_sesion (fin_sesion),
    INDEX idx_is_active (is_active),
    INDEX idx_sala (sala_id),
    INDEX idx_motivo (motivo_desconexion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Registro de sesiones individuales de jugadores';

-- Tabla para reportes enviados a Discord
CREATE TABLE IF NOT EXISTS reportes_discord (
    id INT PRIMARY KEY AUTO_INCREMENT,
    auth_jugador VARCHAR(255) NULL COMMENT 'Auth del jugador (si aplica)',
    nombre_jugador VARCHAR(100) NULL COMMENT 'Nombre del jugador reportado',
    tipo_evento ENUM('conexion', 'desconexion', 'kick', 'ban', 'sistema') NOT NULL,
    titulo VARCHAR(200) NOT NULL COMMENT 'Título del embed',
    descripcion TEXT NOT NULL COMMENT 'Descripción del evento',
    color VARCHAR(10) COMMENT 'Color del embed en hexadecimal',
    webhook_url VARCHAR(500) NOT NULL COMMENT 'URL del webhook usado',
    enviado_exitosamente BOOLEAN DEFAULT FALSE COMMENT 'Si se envió correctamente',
    respuesta_webhook TEXT NULL COMMENT 'Respuesta del webhook',
    fecha_evento DATETIME NOT NULL COMMENT 'Fecha del evento reportado',
    fecha_envio DATETIME NOT NULL COMMENT 'Fecha de envío del reporte',
    sala_id VARCHAR(50) COMMENT 'Sala donde ocurrió el evento',
    metadata JSON NULL COMMENT 'Datos adicionales en formato JSON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_auth_jugador (auth_jugador),
    INDEX idx_tipo_evento (tipo_evento),
    INDEX idx_fecha_evento (fecha_evento),
    INDEX idx_fecha_envio (fecha_envio),
    INDEX idx_enviado_exitosamente (enviado_exitosamente),
    INDEX idx_sala (sala_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Log de reportes enviados a Discord para auditoría';

-- Tabla para estadísticas diarias del sistema
CREATE TABLE IF NOT EXISTS estadisticas_tracking_diarias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fecha DATE NOT NULL UNIQUE COMMENT 'Fecha de las estadísticas',
    jugadores_unicos INT DEFAULT 0 COMMENT 'Jugadores únicos del día',
    total_conexiones INT DEFAULT 0 COMMENT 'Total de conexiones del día',
    nuevos_jugadores INT DEFAULT 0 COMMENT 'Nuevos jugadores registrados',
    nombres_nuevos_registrados INT DEFAULT 0 COMMENT 'Nuevos nombres registrados',
    reportes_enviados INT DEFAULT 0 COMMENT 'Reportes enviados a Discord',
    tiempo_total_sesiones BIGINT DEFAULT 0 COMMENT 'Tiempo total de todas las sesiones',
    kicks_realizados INT DEFAULT 0 COMMENT 'Expulsiones realizadas',
    bans_realizados INT DEFAULT 0 COMMENT 'Baneos realizados',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Índices
    INDEX idx_fecha (fecha),
    INDEX idx_jugadores_unicos (jugadores_unicos),
    INDEX idx_total_conexiones (total_conexiones)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Estadísticas diarias del sistema de tracking';

-- Insertar estadística para hoy si no existe
INSERT IGNORE INTO estadisticas_tracking_diarias (fecha) 
VALUES (CURDATE());

-- Crear vista para obtener estadísticas rápidas
CREATE OR REPLACE VIEW vista_estadisticas_tracking AS
SELECT 
    t.auth_jugador,
    t.primer_nombre,
    t.nombre_actual,
    t.primera_conexion,
    t.ultima_conexion,
    t.total_conexiones,
    t.tiempo_total_sesion,
    t.es_jugador_nuevo,
    COUNT(DISTINCT h.nombre) as total_nombres_usados,
    COUNT(s.id) as total_sesiones,
    SUM(CASE WHEN s.is_active = TRUE THEN 1 ELSE 0 END) as sesiones_activas
FROM jugadores_tracking t
LEFT JOIN historial_nombres_jugadores h ON t.auth_jugador = h.auth_jugador
LEFT JOIN sesiones_jugadores s ON t.auth_jugador = s.auth_jugador
GROUP BY t.auth_jugador, t.primer_nombre, t.nombre_actual, t.primera_conexion, 
         t.ultima_conexion, t.total_conexiones, t.tiempo_total_sesion, t.es_jugador_nuevo;

COMMIT;

-- Mensaje de confirmación
SELECT 'Tablas de tracking creadas exitosamente' as mensaje,
       COUNT(*) as total_tablas_tracking
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
AND table_name IN (
    'historial_nombres_jugadores', 
    'jugadores_tracking', 
    'sesiones_jugadores', 
    'reportes_discord', 
    'estadisticas_tracking_diarias'
);
