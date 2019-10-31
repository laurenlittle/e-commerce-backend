const express = require('express');
const router = express.Router();
require('dotenv').config();

const { requireSignin, isAuth } = require('../controllers/auth');
const { userById, addOrderToUserHistory } = require ('../controllers/user');
const { createOrder } = require('../controllers/order');
const { decreaseProductQuantity } = require('../controllers/product');


// available for auth users only
router.post('/order/create/:userId', requireSignin, isAuth, addOrderToUserHistory, decreaseProductQuantity, createOrder);

router.param('userId', userById); // when there's a userId in route params, findById will run and make info available in request object

module.exports = router;