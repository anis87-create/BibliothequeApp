// config/env.js — configuration et validation centralisées (fail-fast)
const path = require('path');

// Load environment variables from the project's root .env once
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Required vars for DB connectivity
const required = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
const missing = required.filter((key) => !process.env[key] && !process.env.DATABASE_URL);

// Accept either `JWT_SECRET` or `SECRET_TOKEN` (code currently uses SECRET_TOKEN)
if (!process.env.JWT_SECRET && !process.env.SECRET_TOKEN && !process.env.DATABASE_URL) {
  missing.push('JWT_SECRET or SECRET_TOKEN');
}

if (missing.length) {
  console.error(`Variables d'environnement manquantes: ${missing.join(', ')}`);
  process.exit(1);
}