exports.userSignupValidator = (req, res, next) => {
  // Check method provided by express-validator
  req.check('name', 'Name is required').notEmpty();
  req.check('email', 'Email must be between 3 to 32 characters')
     .matches(/.+\@.+\..+/)
     .withMessage('Email must contain @')
     .isLength({
       min: 4,
       max: 32
     });
  req.check('password', 'Password is required').notEmpty();
  req.check('password')
     .isLength({ min: 6 })
     .withMessage('Password must contain at least 6 characters')
     .matches(/\d/)
     .withMessage('Password must contain at least 1 number');

  const errors = req.validationErrors() // get all errors

  if (errors) {
    const firstError = errors.map(error => error.msg)[0] // get the first error message
    return res.status(400).json({error: firstError});
  }
  next(); // move on
}