CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        fullname VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW()
);