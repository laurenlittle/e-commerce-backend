const express = require('express');
const router = express.Router();
require('dotenv').config();

const { requireSignin, isAuth } = require('../controllers/auth');
const { userById } = require ('../controllers/user');
const { generateToken, processPayment } = require('../controllers/braintree');


// available for auth users only
router.get('/braintree/getToken/:userId', requireSignin, isAuth, generateToken);
router.post('/braintree/payment/:userId', requireSignin, isAuth, processPayment);

router.param('userId', userById); // when there's a userId in route params, findById will run and make info available in request object

module.exports = router;