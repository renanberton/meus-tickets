CREATE DATABASE IF NOT EXISTS meus_tickets;
USE meus_tickets;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    two_fa_secret VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

-- Senha: senha123 (BCrypt)
INSERT IGNORE INTO users (email, password, created_at, updated_at)
VALUES (
    'teste@exemplo.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    NOW(),
    NOW()
);