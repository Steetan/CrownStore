import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js';
import fs from 'fs';
export const getProducts = (req, res) => {
    let sortBy = req.query.sortBy || 'id';
    let order = req.query.order || 'ASC';
    let category = req.query.categoryid !== undefined ? parseInt(req.query.categoryid) : 3;
    let search = req.query.search || '';
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 8;
    let fromRange = parseInt(req.query.fromRange) || 0;
    let toRange = parseInt(req.query.toRange);
    let selectedRating = req.query.selectedRatingFilter;
    let parseSelectedRating = '';
    switch (selectedRating) {
        case '0':
            parseSelectedRating = 'rating >= 4';
            break;
        case '1':
            parseSelectedRating = 'rating <= 3 AND rating > 0';
            break;
        case '2':
            parseSelectedRating = 'rating = 0';
            break;
        default:
            parseSelectedRating = '';
            break;
    }
    let queryString = `SELECT * FROM product ${!search && category ? `WHERE count > 0 AND category=${category}` : ''} ${search ? `WHERE count > 0 AND title ILIKE ${"'%" + search + "%'"} ` : ''}`;
    if (!category && !search) {
        queryString += toRange
            ? `WHERE count > 0 AND price >= ${fromRange} AND price <= ${toRange} `
            : `WHERE count > 0 AND price >= ${fromRange} `;
        queryString += parseSelectedRating !== '' ? `AND ${parseSelectedRating} ` : '';
    }
    if (category || search) {
        queryString += toRange
            ? `AND price >= ${fromRange} AND price <= ${toRange} `
            : `AND price >= ${fromRange} `;
        queryString += Boolean(parseSelectedRating) ? `AND ${parseSelectedRating} ` : '';
    }
    queryString += `ORDER BY ${sortBy} ${order}`;
    pool.query(queryString, (error, results) => {
        if (error)
            throw error;
        let startIndex = (page - 1) * limit;
        let endIndex = page * limit;
        let paginatedResults = results.rows.slice(startIndex, endIndex);
        let totalProducts = results.rows.length;
        let totalPages = Math.ceil(totalProducts / limit);
        res.json({
            products: paginatedResults,
            totalPages: totalPages,
        });
    });
};
export const getProductsPerip = (req, res) => {
    pool.query('SELECT * FROM product WHERE category >= 8 AND category <= 10', (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
};
export const getProductById = (req, res) => {
    pool.query('SELECT * FROM product WHERE id = $1', [req.params.id], (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
};
export const updateProduct = (req, res) => {
    pool.query('UPDATE product SET title = $1, description = $2, price = $3, category = $4, imgurl = $5, count = $6, discount = $7 WHERE id = $8', [
        req.body.title,
        req.body.description,
        req.body.price,
        req.body.category,
        req.body.fileimg,
        req.body.count,
        Number(req.body.discount),
        req.body.id,
    ], (error, results) => {
        if (error)
            throw error;
        pool.query('UPDATE carts SET totalcount = p.count FROM product p WHERE carts.product_id = p.id AND (carts.totalcount > p.count OR (carts.totalcount = 0 AND p.count <> 0))', (error, results) => {
            if (error)
                throw error;
            res.status(200).json({ message: 'Продукт был обновлен' });
        });
    });
};
export const createProduct = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        pool.query('INSERT INTO product (id, title, description, price, category, imgurl, rating, count, discount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [
            uuidv4(),
            req.body.title,
            req.body.description,
            req.body.price,
            req.body.category,
            req.body.fileimg,
            0,
            req.body.count,
            req.body.discount,
        ], (error, results) => {
            if (error)
                throw error;
            res.status(200).json({
                message: 'Продукт был успешно добавлен',
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteFileController = (req, res) => {
    const filePath = `uploads/productImg/${req.params.filename}`;
    pool.query(`SELECT imgurl FROM product WHERE imgurl ILIKE ${"'%" + filePath + "%'"}`, (error, results) => {
        if (error)
            throw error;
        if (!results.rows.length) {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        return res.status(404).json({ message: 'File not found' });
                    }
                    else {
                        console.error(err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                }
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Error deleting file' });
                    }
                    return res.json({ message: 'File deleted successfully' });
                });
            });
        }
        else {
            return res.status(400).json({ message: 'Не удалось удалить файл' });
        }
    });
};
export const getAllProducts = (req, res) => {
    pool.query('SELECT * FROM product', (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
};
export const deleteProductById = (req, res) => {
    try {
        pool.query('DELETE FROM product WHERE id = $1', [req.query.product], (error, results) => {
            if (error)
                throw error;
            pool.query('DELETE FROM carts WHERE product_id = $1', [req.query.product], (error, results) => {
                if (error)
                    throw error;
                pool.query('DELETE FROM reviews WHERE product_id = $1', [req.query.product], (error, results) => {
                    if (error)
                        throw error;
                    res.status(200).json({ message: 'product has been deleted' });
                });
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteProducts = (req, res) => {
    try {
        pool.query('DELETE FROM product', (error, results) => {
            if (error)
                throw error;
            pool.query('DELETE FROM carts', (error, results) => {
                if (error)
                    throw error;
                pool.query('DELETE FROM reviews', (error, results) => {
                    if (error)
                        throw error;
                    res.status(200).json({ message: 'products has been deleted' });
                });
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
