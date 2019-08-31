const express = require('express');
const router = express.Router();

const { create, read, remove, update, list, categoryById } = require('../controllers/category');
const {requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/category/:categoryId', read);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/categories', list);

router.param('userId', userById); // when there's a userId in route params, findById will run and make info available in request object
router.param('categoryId', categoryById); // when there's a category in route params, findById will run and make info available in request object

module.exports = router;