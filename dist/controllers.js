var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from './db.js';
import { validationResult } from '../node_modules/express-validator/src/validation-result.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
const getProducts = (req, res) => {
    let sortBy = req.query.sortBy || 'id';
    let order = req.query.order || 'ASC';
    let category = parseInt(req.query.category) || 0;
    let search = req.query.search || '';
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 8;
    let fromRange = parseInt(req.query.fromRange) || 0;
    let toRange = parseInt(req.query.toRange);
    let selectedRating = Number(req.query.selectedRatingFilter);
    let parseSelectedRating = '';
    switch (selectedRating) {
        case 0:
            parseSelectedRating = 'rating >= 4';
            break;
        case 1:
            parseSelectedRating = 'rating <= 3';
            break;
        default:
            parseSelectedRating = '';
            break;
    }
    let queryString = `SELECT * FROM product ${!search && category ? `WHERE category=${category}` : ''} ${search ? `WHERE title ILIKE ${"'%" + search + "%'"} ` : ''}`;
    if (!category && !search) {
        queryString += toRange
            ? `WHERE price >= ${fromRange} AND price <= ${toRange} `
            : `WHERE price >= ${fromRange} `;
        queryString += parseSelectedRating ? `AND ${parseSelectedRating} ` : '';
    }
    if (category || search) {
        queryString += toRange
            ? `AND price >= ${fromRange} AND price <= ${toRange} `
            : `AND price >= ${fromRange} `;
        queryString += parseSelectedRating ? `AND ${parseSelectedRating} ` : '';
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
        res.status(200).json({
            products: paginatedResults,
            totalPages: totalPages,
        });
    });
};
const getProductById = (req, res) => {
    pool.query('SELECT * FROM product WHERE id = $1', [req.params.id], (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
};
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordByEmail = yield pool.query('SELECT id, password FROM users WHERE email = $1', [
            req.body.email,
        ]);
        const isValidPass = yield bcrypt.compare(req.body.password, passwordByEmail.rows.length > 0 ? passwordByEmail.rows[0].password : '');
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль',
            });
        }
        const token = jwt.sign({
            id: passwordByEmail.rows[0].id,
        }, 'secret123', {
            expiresIn: '30d',
        });
        res.json({
            success: true,
            token,
        });
    }
    catch (error) {
        if (error)
            throw error;
    }
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const existingUser = yield pool.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
        if (existingUser.rows.length > 0) {
            return res
                .status(400)
                .json({ success: false, message: 'Пользователь с таким именем уже существует' });
        }
        const password = req.body.password;
        const salt = yield bcrypt.genSalt(10);
        const passwordHash = yield bcrypt.hash(password, salt);
        const id = uuidv4();
        pool.query('INSERT INTO users (id, name_user, fname_user, oname_user, password, phone_number, email) VALUES ($1, $2, $3, $4, $5, $6, $7);', [
            id,
            req.body.name,
            req.body.fname,
            req.body.oname,
            passwordHash,
            req.body.phone,
            req.body.email,
        ], (error, results) => {
            if (error)
                throw error;
        });
        const token = jwt.sign({
            id,
        }, 'secret123', {
            expiresIn: '30d',
        });
        res.status(200).json({
            success: true,
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Не удалось зарегистрироваться',
        });
    }
});
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        res.status(403).json({
            message: 'Нет доступа',
        });
    }
});
const deleteMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = String(req.query.token);
        jwt.verify(token, 'secret123', (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Неверный токен' });
            }
            else {
                res.json(decoded);
                pool.query('DELETE FROM users WHERE id=$1', [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                });
            }
        });
    }
    catch (error) {
        res.status(403).json({
            message: 'Нет доступа',
        });
    }
});
export { getProducts, getProductById, createUser, loginUser, getMe, deleteMe };
