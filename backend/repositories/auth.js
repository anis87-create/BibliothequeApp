const { query } = require('../config/db');

// Hash bcrypt factice (précalculé) utilisé quand l'utilisateur n'existe pas,
// pour que /login prenne le même temps que si le compte existait (anti-enumeration).
const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8i8Z8XV9nGtzKVwq6PnUcYYCPWNqPa';

module.exports = {
    DUMMY_HASH,

    register: async (email, fullName, password) => {
        const INSERT_QUERY = `
            INSERT INTO users (email, fullname, password)
            VALUES ($1, $2, $3)
            RETURNING id, email, fullname AS "fullName", created_at
        `;
        const result = await query(INSERT_QUERY, [email, fullName, password]);
        return result.rows[0];
    },
    getUserByEmail: async (email) => {
        const GET_QUERY = 'SELECT id, email, password FROM users WHERE email = $1';
        const result = await query(GET_QUERY, [email]);
        return result.rows[0];
    },
    getUserById: async (id) => {
        const GET_QUERY = 'SELECT id, email, fullname AS "fullName", created_at FROM users WHERE id = $1';
        const result = await query(GET_QUERY, [id]);
        return result.rows[0];
    }
}
