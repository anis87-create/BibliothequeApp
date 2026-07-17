const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  ssl: process.env.DB_SSL === 'true'
    ? {
        rejectUnauthorized: true,
        ca: process.env.DB_SSL_CA, // certificat CA fourni par le provider (Supabase/RDS/etc.)
      }
    : false,
  max: Number(process.env.DB_POOL_MAX) || 10,
})

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database successfully!')
});

pool.on('error', (error: string) => {
   console.error('PostgreSQL pool error:', error);
})

module.exports = {
    query: (text: string, values: [string]) => pool.query(text, values),
    pool,
}
