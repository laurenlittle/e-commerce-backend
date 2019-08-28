const express = require('express');
const router = express.Router();

const { signup, signin } = require('../controllers/user');
const { userSignupValidator } = require('../validator/index');

router.post('/signup', userSignupValidator, signup); // request to /signup will validate and then run signup controller
router.post('/signin', signin); // request to /signup will validate and then run signup controller

module.exports = router;