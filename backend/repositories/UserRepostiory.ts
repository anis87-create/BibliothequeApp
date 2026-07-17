import type { User } from "../models/User";
import type { IUserRepository } from "./interfaces/IUserRepository";
import type {Pool} from 'pg';
const { query } = require('../config/db');

class UserRepository implements IUserRepository {
    constructor(private pool: Pool){}
    async findAll(): Promise<User[]> {
        const GET_QUERY = `SELECT id, email, fullname, role, created_at FROM users`;
        const res = await query(GET_QUERY);
        return res.rows;
    }
    async register(user: User): Promise<User> {
       const INSERT_QUERY = `
            INSERT INTO users (email, fullname, password)
            VALUES ($1, $2, $3)
            RETURNING id, email, fullname AS "fullName", created_at
        `;
        const res = await query(INSERT_QUERY,[user.email, user.fullname, user.password]);
        return res.rows[0];
    }
    async findById(id: string): Promise<User | null> {
        const GET_QUERY = `SELECT id, email, fullname, role, created_at FROM users WHERE id=$1`;
        const res = await query(GET_QUERY, [id]);
        return res.rows.length > 0 ? res.rows[0] : null;
    }
    async findByEmail(email: string): Promise<User | null> {
         const GET_QUERY = `SELECT id, email, fullname, role, created_at FROM users WHERE email=$1`;
        const res = await query(GET_QUERY, [email]);
        return res.rows.length > 0 ? res.rows[0] : null;
    }
}

export = UserRepository;