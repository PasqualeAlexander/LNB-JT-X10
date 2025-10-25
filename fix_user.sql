DROP USER IF EXISTS 'lnb_user'@'localhost';
CREATE USER 'lnb_user'@'localhost' IDENTIFIED BY 'lnb_password';
CREATE DATABASE IF NOT EXISTS lnb_estadisticas;
GRANT ALL PRIVILEGES ON lnb_estadisticas.* TO 'lnb_user'@'localhost';
FLUSH PRIVILEGES;
