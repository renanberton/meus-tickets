cat > init.sql << 'EOF'
CREATE DATABASE IF NOT EXISTS meus_tickets;
USE meus_tickets;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO users (email, password, created_at, updated_at) 
SELECT 'teste@exemplo.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5E6MlwGqgvGgvGgvGgvGgvG', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'teste@exemplo.com');
EOF