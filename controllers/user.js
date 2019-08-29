const User = require('../models/user-model');


exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err,user) => {

    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      })
    }
    // User is found - add the user info in the request object under name of profile
    req.profile = user;
    next();
  })
}