-- =============================================
-- CONFIGURACIÓN AUTOMÁTICA MYSQL PARA LNB BOT
-- =============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS lnb_estadisticas 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Crear el usuario con contraseña
CREATE USER IF NOT EXISTS 'lnb_user'@'localhost' IDENTIFIED BY 'lnb_password';

-- Otorgar todos los permisos sobre la base de datos
GRANT ALL PRIVILEGES ON lnb_estadisticas.* TO 'lnb_user'@'localhost';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- Verificaciones
SELECT 'Usuario creado correctamente' as Status;
SHOW GRANTS FOR 'lnb_user'@'localhost';
SHOW DATABASES LIKE 'lnb_estadisticas';

SELECT 'Configuración completada - Puedes cerrar esta ventana' as Final;
