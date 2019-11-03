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

exports.listOrders = (req, res) => {
  Order.find()
  .populate('user', '_id name address')
  .sort('-created')
  .exec((err, orders) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }

    res.json(orders);
  })
};

exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path('status').enumValues);
};

exports.orderById = (req, res, next, id) => {
  Order.findById(id)
  .populate('products.product', 'name price') // Get on product from the products array
  .exec((err, order) => {
    if (err || !order) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }

    req.order = order; // make order available in request object

    next();
  })
};

exports.updateOrderStatus = (req, res) => {
  Order.update(
    {_id: req.body.orderId},
    {$set: {status: req.body.status}},
    (err, order) => {
       if (err) {
         return res.status(400).json({
           err: errorHandler(err)
         });
       }

       res.json(order);
    }
  );
};



