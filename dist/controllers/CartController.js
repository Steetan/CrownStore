import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
export const pushCart = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(400).json({ error: 'Неверный токен' });
            }
            else {
                if (req.body.act === 'push') {
                    pool.query('INSERT INTO carts (id, user_id, product_id, totalcount, res_price) VALUES ($1, $2, $3, 1, $4)', [uuidv4(), decoded.id, req.body.product, req.body.price], (error, results) => {
                        if (error)
                            throw error;
                        res.status(200).json({
                            message: 'product has been create',
                        });
                    });
                }
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const updateCart = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(400).json({ error: 'Неверный токен' });
            }
            else {
                if (req.body.act === 'plus') {
                    pool.query(`UPDATE carts SET totalcount = totalcount + 1 WHERE user_id = $1 AND product_id = $2`, [decoded.id, req.body.productid], (error, results) => {
                        if (error)
                            throw error;
                        pool.query('SELECT c.*, p.title, p.price, p.count, p.discount, p.imgurl FROM carts c JOIN product p ON c.product_id = p.id WHERE c.user_id = $1', [decoded.id], (error, results) => {
                            return res.status(200).json({ results: results.rows });
                        });
                    });
                }
                if (req.body.act === 'minus') {
                    pool.query('UPDATE carts SET totalcount = totalcount - 1 WHERE user_id=$1 AND product_id=$2', [decoded.id, req.body.productid], (error, results) => {
                        if (error)
                            throw error;
                        pool.query('SELECT c.*, p.title, p.price, p.count, p.imgurl FROM carts c JOIN product p ON c.product_id = p.id WHERE c.user_id = $1', [decoded.id], (error, results) => {
                            return res.status(200).json({ results: results.rows });
                        });
                    });
                }
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const getProductCart = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(400).json({ error: 'Неверный токен' });
            }
            else {
                let totalPrice = 0;
                pool.query('SELECT c.*, p.title, p.price, p.count, p.imgurl FROM carts c JOIN product p ON c.product_id = p.id WHERE c.user_id = $1', [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    if (results.rows.length) {
                        return res.status(200).json({
                            value: true,
                            results: results.rows,
                            totalPrice,
                        });
                    }
                    if (!results.rows.length) {
                        return res.json({
                            value: false,
                            results: results.rows,
                        });
                    }
                });
            }
        });
    }
    catch (error) {
        if (error)
            throw error;
    }
};
export const getProductCartById = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(400).json({ error: 'Неверный токен' });
            }
            else {
                let totalPrice = 0;
                pool.query('SELECT * FROM carts WHERE product_id = $1 AND user_id = $2', [req.query.product, decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    if (results.rows.length) {
                        return res.status(200).json({
                            value: true,
                            results: results.rows,
                            totalPrice,
                        });
                    }
                    if (!results.rows.length) {
                        return res.json({
                            value: false,
                            results: results.rows,
                        });
                    }
                });
            }
        });
    }
    catch (error) {
        if (error)
            throw error;
    }
};
export const deleteCartById = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(400).json({ error: 'Неверный токен' });
            }
            else {
                pool.query(`DELETE FROM carts WHERE user_id = $1 AND product_id = $2`, [decoded.id, req.query.product], (error, results) => {
                    if (error)
                        throw error;
                    return res.status(200).json({ message: 'product from cart has been deleted' });
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteCart = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(400).json({ error: 'Неверный токен' });
            }
            else {
                pool.query(`DELETE FROM carts WHERE user_id = $1`, [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    return res.status(200).json({ message: 'cart has been cleaned' });
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteAllCartById = (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(400).json({ error: 'Неверный токен' });
            }
            else {
                pool.query(`DELETE FROM carts WHERE user_id = $1`, [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    return res.status(200).json({ message: 'all products from cart has been deleted' });
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
