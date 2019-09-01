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


exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;

  return res.json(req.profile);
};


exports.update = (req, res)  => {
  // find user by Id - use set method with updated fields/info in request body
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: 'Not authorized to perform this action.'
        });
      }

      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );

};