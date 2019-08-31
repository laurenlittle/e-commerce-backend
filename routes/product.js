const express = require('express');
const router = express.Router();

const { create, read, remove, update, list, productById, listRelated, listCategories } = require('../controllers/product');
const {requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/products', list);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);

// Route Middlewares
router.param('userId', userById); // when there's a userId in route params, findById will run and make info available in request object
router.param('productId', productById); // when there's a productId in route params, findById will make info available in request object

module.exports = router;