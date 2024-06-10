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
import fs from 'fs';
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let passwordByEmail = {
            command: 'SELECT',
            rowCount: 0,
            oid: 0,
            fields: [],
            rows: [],
        };
        if (req.path == '/auth/login') {
            passwordByEmail = yield pool.query('SELECT id, password, dark_theme, access FROM users WHERE email = $1', [req.body.email]);
        }
        else {
            res.status(400);
        }
        if (req.path == '/auth/admin') {
            passwordByEmail = yield pool.query('SELECT id, password, dark_theme FROM users WHERE email = $1 AND access = true', [req.body.email]);
        }
        else {
            res.status(400);
        }
        const isValidPass = yield bcrypt.compare(req.body.password, passwordByEmail.rows.length > 0 ? passwordByEmail.rows[0].password : '');
        if (!isValidPass) {
            return res.json({
                message: 'Неверный логин или пароль',
            });
        }
        const token = jwt.sign({
            id: passwordByEmail.rows[0].id,
            email: req.body.email,
        }, `${process.env.JWT_SECRET}`, {
            expiresIn: '30d',
        });
        res.status(200).json({
            success: true,
            token,
            email: req.body.email,
            dark_theme: passwordByEmail.rows[0].dark_theme,
            access: passwordByEmail.rows[0].access,
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
            return res.status(403).json({ error: errors.array() });
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
        pool.query('INSERT INTO users (id, name_user, fname_user, oname_user, password, phone_number, email, access, user_imgurl, address, dark_theme) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', [
            id,
            req.body.name,
            req.body.fname,
            req.body.oname,
            passwordHash,
            req.body.phone,
            req.body.email,
            false,
            req.body.url,
            req.body.address,
            req.body.dark_theme,
        ], (error, results) => {
            if (error)
                throw error;
        });
        const token = jwt.sign({
            id,
            email: req.body.email,
        }, `${process.env.JWT_SECRET}`, {
            expiresIn: '30d',
        });
        res.status(200).json({
            success: true,
            token,
            email: req.body.email,
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
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                return res.status(200).json({
                    decoded,
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
export const getMeInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('SELECT name_user, fname_user, oname_user, user_imgurl, email, phone_number, access, address, dark_theme FROM users WHERE id = $1', [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    res.json(results.rows[0]);
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
export const updateTheme = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.json({ error: 'Неверный токен' });
            }
            else {
                pool.query('UPDATE users SET dark_theme = $1 WHERE id = $2', [req.body.theme, decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    res.json('Тема успешно обновлена');
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
export const deleteMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Неверный токен' });
            }
            else {
                pool.query('DELETE FROM carts WHERE user_id=$1', [decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    pool.query('DELETE FROM users WHERE id=$1', [decoded.id], (error, results) => {
                        if (error)
                            throw error;
                        res.status(200).json({ message: 'Пользователь был удален' });
                    });
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
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ error: errors.array() });
        }
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Неверный токен' });
            }
            else {
                pool.query('UPDATE users SET name_user = $1, fname_user = $2, oname_user = $3, email = $4, phone_number = $5, address = $6 WHERE id = $7', [
                    req.body.name,
                    req.body.fname,
                    req.body.oname,
                    req.body.email,
                    req.body.phone,
                    req.body.address,
                    decoded.id,
                ], (error, results) => {
                    if (error)
                        throw error;
                    const token = jwt.sign({
                        id: decoded.id,
                        email: req.body.email,
                    }, `${process.env.JWT_SECRET}`, {
                        expiresIn: '30d',
                    });
                    res.status(200).json({ message: 'Данные были обновлены успешно!', token });
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
export const updateUserImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Неверный токен' });
            }
            else {
                pool.query('UPDATE users SET user_imgurl = $1 WHERE id=$2', [req.body.img, decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    res.status(200).json({ message: 'Аватарка обновилась!' });
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
export const updatePasswordUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(403).json({ error: errors.array() });
        }
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        const password = req.body.password;
        const salt = yield bcrypt.genSalt(10);
        const passwordHash = yield bcrypt.hash(password, salt);
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Неверный токен' });
            }
            else {
                pool.query('UPDATE users SET password = $1 WHERE id=$2', [passwordHash, decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    res.status(200).json({ message: 'Пароль был обновлен успешно!' });
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
export const deleteUserImg = (req, res) => {
    try {
        const filePath = `uploads/userIcons/${req.params.filename}`;
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Неверный токен' });
            }
            else {
                pool.query(`SELECT user_imgurl FROM users WHERE user_imgurl = $1 AND id <> $2`, [req.params.filename, decoded.id], (error, results) => {
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
                        return res.json({ message: 'Не удалось удалить файл' });
                    }
                });
            }
        });
    }
    catch (error) {
        res.status(403).json({
            message: 'Нет доступа',
        });
    }
};
export const deleteAuthImg = (req, res) => {
    try {
        const filePath = `uploads/userIcons/${req.params.filename}`;
        pool.query(`SELECT user_imgurl FROM users WHERE user_imgurl ILIKE ${"'%" + filePath + "%'"}`, (error, results) => {
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
    }
    catch (error) {
        res.status(403).json({
            message: 'Нет доступа',
        });
    }
};
export const getAllUsers = (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error)
            throw error;
        res.status(200).json(results.rows);
    });
};
export const deleteUsers = (req, res) => {
    try {
        pool.query('DELETE FROM users WHERE id <> $1', [req.query.id], (error, results) => {
            if (error)
                throw error;
            pool.query('DELETE FROM carts WHERE user_id = $1', [req.query.product], (error, results) => {
                if (error)
                    throw error;
                res.status(200).json({ message: 'user has been deleted' });
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
export const deleteUserById = (req, res) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    try {
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Неверный токен' });
            }
            else {
                pool.query('DELETE FROM users WHERE id = $1 AND id <> $2', [req.query.user, decoded.id], (error, results) => {
                    if (error)
                        throw error;
                    pool.query('DELETE FROM carts WHERE user_id = $1', [req.query.product], (error, results) => {
                        if (error)
                            throw error;
                        res.status(200).json({ message: 'user has been deleted' });
                    });
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
};
