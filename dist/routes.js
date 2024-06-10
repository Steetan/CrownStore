import { Router } from 'express';
import { createUser, deleteAuthImg, deleteMe, deleteUserImg, getMe, getMeInfo, deleteUserById, deleteUsers, getAllUsers, loginUser, updatePasswordUser, updateUser, updateUserImg, updateTheme, } from './controllers/UserController.js';
import { createProduct, deleteFileController, deleteProductById, deleteProducts, getAllProducts, getProductById, getProducts, getProductsPerip, updateProduct, } from './controllers/ProductController.js';
import { pushReviewValidator, registerProductValidator, registerValidator, updatePasswordValidator, updateValidator, } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import multer from 'multer';
import checkAdmin from './utils/checkAdmin.js';
import { deleteAllCartById, deleteCart, deleteCartById, getProductCart, getProductCartById, pushCart, updateCart, } from './controllers/CartController.js';
import { postEmail, postEmailComplaint, postEmailIdea } from './controllers/EmailController.js';
import { createLike, createReview, deleteLike, deleteReviewById, deleteReviews, getLikeById, getLikeByIdMe, getReviewById, } from './controllers/ReviewController.js';
import { createService, deleteServiceById, deleteServices, getAllServices, updateService, } from './controllers/ServiceController.js';
import { createOrder, deleteAllOrders, deleteOrderById, getAllOrders, getOrderInfoById, getOrdersById, updateOrderStatus, } from './controllers/OrderController.js';
import { createFavoritesArrItems, createFavoritesItem, deleteFavorites, deleteFavoritesById, getFavoritesByArr, getFavoritesById, } from './controllers/FavoriteController.js';
const router = Router();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/productImg');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const userIconsStorage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/userIcons');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });
const uploadUserIcons = multer({ storage: userIconsStorage });
router.post('/upload', upload.single('image'), (req, res) => {
    var _a;
    res.json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`,
    });
});
router.post('/upload/user', uploadUserIcons.single('image'), (req, res) => {
    var _a;
    res.json({
        url: `${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`,
    });
});
router.delete('/upload/delete/:filename', deleteFileController);
router.delete('/upload/user/delete/:filename', deleteUserImg);
router.delete('/upload/auth/delete/:filename', deleteAuthImg);
router.get('/', getProducts);
router.get('/perip', getProductsPerip);
router.put('/', updateProduct);
router.get('/adminpanel/products', checkAdmin, getAllProducts);
router.get('/products', getAllProducts);
router.get('/adminpanel/users', checkAdmin, getAllUsers);
router.get('/:id', getProductById);
router.post('/', registerProductValidator, createProduct);
router.delete('/adminpanel/products', checkAdmin, deleteProducts);
router.delete('/adminpanel/users', checkAdmin, deleteUsers);
router.delete('/adminpanel/deleteproductbyid', checkAdmin, deleteProductById);
router.delete('/adminpanel/deleteuserbyid', checkAdmin, deleteUserById);
router.get('/adminpanel/info/:id', checkAdmin, getOrderInfoById);
router.post('/cart', checkAuth, pushCart);
router.get('/cart/get', checkAuth, getProductCart);
router.get('/cart/getbyid', checkAuth, getProductCartById);
router.patch('/cart/update', checkAuth, updateCart);
router.delete('/cart/deletebyid', checkAuth, deleteCartById);
router.delete('/cart/deleteallbyid', checkAuth, deleteAllCartById);
router.delete('/cart/delete', checkAuth, deleteCart);
router.get('/auth/adminme', checkAdmin, getMe);
router.patch('/auth/update', checkAuth, updateValidator, updateUser);
router.patch('/auth/updimg', checkAuth, updateUserImg);
router.patch('/auth/updpass', checkAuth, updatePasswordValidator, updatePasswordUser);
router.get('/auth/me', checkAuth, getMe);
router.get('/auth/meinfo', checkAuth, getMeInfo);
router.post('/auth/reg', registerValidator, createUser);
router.post('/auth/login', registerValidator, loginUser);
router.patch('/user/theme', updateTheme);
router.delete('/auth/delete', checkAuth, deleteMe);
router.post('/reviews/:id', checkAuth, pushReviewValidator, createReview);
router.get('/reviews/:id', getReviewById);
router.delete('/reviews/:id', checkAuth, deleteReviewById);
router.get('/reviews/all', checkAdmin, deleteReviews);
router.get('/reviews/likes/:id', checkAuth, getLikeById);
router.get('/reviews/likes/me/:id', checkAuth, getLikeByIdMe);
router.delete('/reviews/likes/:id', checkAuth, deleteLike);
router.post('/reviews/likes/:id', checkAuth, createLike);
router.get('/services/all', checkAuth, getAllServices);
router.delete('/services/id/:id', checkAdmin, deleteServiceById);
router.post('/services/push', checkAdmin, createService);
router.delete('/services/all', checkAdmin, deleteServices);
router.patch('/services/upd', checkAdmin, updateService);
router.post('/orders', checkAuth, createOrder);
router.get('/orders/all', checkAdmin, getAllOrders);
router.delete('/orders/all', checkAuth, deleteAllOrders);
router.get('/orders/byid', checkAuth, getOrdersById);
router.delete('/orders/byid/:id', checkAuth, deleteOrderById);
router.get('/orders/info/:id', checkAuth, getOrderInfoById);
router.patch('/orders/status/:id', checkAuth, updateOrderStatus);
router.delete('/favorites/:id', checkAuth, deleteFavoritesById);
router.get('/favorites/get', checkAuth, getFavoritesById);
router.get('/favorites/get/arrbyid', getFavoritesByArr);
router.post('/favorites/:id', checkAuth, createFavoritesItem);
router.post('/favorites/post/arr', checkAuth, createFavoritesArrItems);
router.delete('/favorites/delete/all', checkAuth, deleteFavorites);
router.post('/email', checkAuth, postEmail);
router.post('/email/complaint/:id', postEmailComplaint);
router.post('/email/idea', checkAuth, postEmailIdea);
export default router;
