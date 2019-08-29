const express = require('express');
const router = express.Router();

const { userById } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');


router.get('/secret/:userId', requireSignin, (req, res) => {
  res.json({
    user: req.profile
  })
})
router.param('userId', userById); // when there's a userId in route params, findById will run and make info available in request object

module.exports = router;