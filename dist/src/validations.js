import { body } from '../node_modules/express-validator/src/index.js';
export const registerValidator = [
    body('name', 'Укажите имя').isLength({ min: 3 }),
    body('oname', 'Укажите отчество').isLength({ min: 3 }),
    body('fname', 'Укажите фамилию').isLength({ min: 3 }),
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
    body('phone', 'Неверный формат телефона').isLength({ min: 11 }),
];
export const registerProductValidator = [
    body('title', 'Укажите название').isLength({ min: 3 }),
    body('description', 'Укажите описание').isLength({ min: 3 }),
    body('price', 'Укажите цену').isLength({ min: 1 }),
    body('category', 'Укажите категорию').isLength({ min: 1 }),
    body('rating', 'Укажите рейтинг от 1 до 5').isLength({ min: 1, max: 1 }),
    body('totalcount', 'Укажите количество').isLength({ min: 1 }),
];
