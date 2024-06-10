import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: process.env.DB_PASS,
    port: 5432,
    database: 'crown',
});
export { pool };
