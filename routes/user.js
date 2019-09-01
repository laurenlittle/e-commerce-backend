const express = require('express');
const router = express.Router();

const { userById, read, update } = require('../controllers/user');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');

// @TODO - Fix This - test Route isn't working in Insomnia - 403 errors always
router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile
  });
});

router.get('/user/:userId', requireSignin, isAuth, read); // view profile
router.put('/user/:userId', requireSignin, isAuth, update); // update profile



router.param('userId', userById); // when there's a userId in route params, findById will run and make info available in request object

module.exports = router;