import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '@dkflbckfd2003',
    port: 5432,
    database: 'crown',
});
export { pool };
