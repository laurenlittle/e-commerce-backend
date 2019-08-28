const User = require('../models/user-model');
const jwt = require('jsonwebtoken'); // to generate signed token
const expressJWT = require('express-jwt'); // for authorization check
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.signup = (req, res) => {
  console.log('req.body', req.body)

  const user = new User(req.body);

  user.save((err, user) => {
    if(err) {
      return res.status(400).json({
        err: errorHandler(err)
      })
    }

    user.salt = undefined;
    user.hashed_password = undefined;

    res.json({
      user
    });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const {email, password} = req.body;
  User.findOne({email}, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist, please sign up'
      });
    }

    // if user is found make sure the email and password match
    // use authenticate method in user model
    if(!user.authenticate(password)) { // if we can't authenticate user
      return res.status(401).json({
        error: 'Email and password do not match'
      })
    }

    // generate a signed token with user id and secret
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

    // persist the token as 't' in cookie with the expiry date
    res.cookie('t', token, {expire: new Date() + 9999})

    // return response with user and token to frontend client
    const {_id, name, email, role} = user;
    return res.json({token, user: { _id, email, name, role}});
  })
};

exports.signout = (req, res) => {
  // clear the cookie we had in the response token (line 50)
  res.clearCookie('t')
  res.json({message: 'Signout successful'});
}

// Restrict routes for logged in users
exports.requireSignin = expressJWT({ // expressJWT needs cookieParser
  secret: process.env.JWT_SECRET,
  userProperty: 'auth'
})