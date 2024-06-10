var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from '../db.js';
import { validationResult } from '../../node_modules/express-validator/src/validation-result.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
export const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
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
        pool.query('INSERT INTO users (id, name_user, fname_user, oname_user, password, phone_number, email, access) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);', [
            id,
            req.body.name,
            req.body.fname,
            req.body.oname,
            passwordHash,
            req.body.phone,
            req.body.email,
            false,
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
export const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
export const getMeAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        res.status(300).json({
            message: 'Нет доступа',
        });
    }
});
export const deleteMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, 'secret123', (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Неверный токен' });
            }
            else {
                pool.query('DELETE FROM users WHERE id=$1', [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                });
            }
            res.json({
                access: true,
            });
        });
    }
    catch (error) {
        res.status(403).json({
            message: 'Нет доступа',
        });
    }
});
export const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordByEmail = yield pool.query('SELECT id, password FROM users WHERE email = $1 AND access = true', [req.body.email]);
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
