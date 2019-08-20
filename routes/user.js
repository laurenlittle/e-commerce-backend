const express = require('express');
const router = express.Router();

const { signup } = require('../controllers/user');

router.post('/signup', signup); // request to /signup will run signup controller

module.exports = router;