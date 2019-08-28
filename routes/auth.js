const express = require('express');
const router = express.Router();

const { signup, signin, signout, requireSignin } = require('../controllers/auth');
const { userSignupValidator } = require('../validator/index');

router.post('/signup', userSignupValidator, signup); // request to /signup will validate and then run signup controller
router.post('/signin', signin); // request to /signin will run signin controller
router.get('/signout', signout); // request to /signout will run signout controller

module.exports = router;