import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
export const getAllServices = (req, res) => {
    pool.query('SELECT * FROM services', (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
};
export const updateService = (req, res) => {
    pool.query('UPDATE services SET title = $1, description = $2, price = $3 WHERE id = $4', [req.body.title, req.body.description, req.body.price, req.body.id], (error, results) => {
        if (error)
            throw error;
        res.status(200).json({ message: 'Услуга была обновлена' });
    });
};
export const createService = (req, res) => {
    try {
        pool.query('INSERT INTO services (id, title, description, price) VALUES ($1, $2, $3, $4)', [uuidv4(), req.body.title, req.body.description, req.body.price], (error, results) => {
            if (error)
                throw error;
            res.status(200).json({
                message: 'Услуга была успешно добавлена',
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteServiceById = (req, res) => {
    try {
        pool.query('DELETE FROM services WHERE id = $1', [req.params.id], (error, results) => {
            if (error)
                throw error;
            res.status(200).json({ message: 'Услуга была удалена' });
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteServices = (req, res) => {
    try {
        pool.query('DELETE FROM services', (error, results) => {
            if (error)
                throw error;
            res.status(200).json({ message: 'Услуги были удалены' });
        });
    }
    catch (error) {
        console.log(error);
    }
};
