
CREATE DATABASE IF NOT EXISTS practica04;
USE practica04;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL,
    password VARCHAR(512) NOT NULL,
    nombre VARCHAR(64) NOT NULL,
    apellidos VARCHAR(128) NULL,
    tipo_usuairo VARCHAR(32) NOT NULL DEFAULT 'user',
    activo TINYINT NOT NULL DEFAULT 1,
    UNIQUE INDEX idx_username (username)
);
