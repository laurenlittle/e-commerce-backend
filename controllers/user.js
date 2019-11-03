const User = require('../models/user-model');
const Order = require('../models/order-model');
const { errorHandler } = require('../helpers/dbErrorHandler');

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
};

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

exports.addOrderToUserHistory =  (req, res, next) => {

  let history = [];

  req.body.order.products.forEach(item => {
    history.push({
      id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount
    })
  });

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history } }, // same key/val
    { new: true }, // retrive updated user and send back as JSON response
    (err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Unable to update user purchase history at this time.'
        });
      }

      next();
    }
  );
};

exports.purchaseHistory = (req, res) => {
  Order.find({user: req.profile._id})
  .populate('user', '_id, name')
  .sort('-created')
  .exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json(orders);
  });
};