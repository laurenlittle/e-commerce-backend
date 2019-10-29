const { Order, CartItem } = require('../models/order-model');
const { errorHandler } = require('../helpers/dbErrorHandler');


exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  // Review
  // console.log('create order', req.body);
  // console.log(req.body.order.user)

  const order = new Order(req.body.order);
  order.save((err, result) => {
     if (err) {
       return res.status(400).json({
         err: errorHandler(err)
       });
     }

     res.json(result);

  });
};