import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    jwt.verify(token, 'secret123', (err, decoded) => {
        if (err) {
            res.json({ error: 'Неверный токен' });
        }
        else {
            pool.query('SELECT FROM users WHERE id = $1 AND access = true', [decoded.id], (error, results) => {
                if (!results.rows.length) {
                    res.json({
                        error: 'нет доступа',
                    });
                }
                else {
                    next();
                }
            });
        }
    });
};
