const express = require('express');
const router = express.Router();
require('dotenv').config();

const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require ('../controllers/user');
const { createOrder } = require('../controllers/order');


// available for auth users only
router.post('/order/create/:userId', requireSignin, isAuth, createOrder);

router.param('userId', userById); // when there's a userId in route params, findById will run and make info available in request object

module.exports = router;