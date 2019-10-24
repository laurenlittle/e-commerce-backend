const User = require('../models/user-model');
const braintree = require('braintree');

const gateway = braintree.connect({

  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});


exports.generateToken = (req, res) => {
  gateway.clientToken.generate({}, function(err, response) {
    if(err) {
      return res.status(500).send(err);
    } else {
      res.send(response); // response contains token
    }
  })
};

exports.processPayment = (req, res) => {
  let clientNonce = req.body.paymentMethodNonce;
  let clientPurchaseTotal = req.body.amount;

  // Charge it to the game!
  let newTransaction = gateway.transaction.sale({
    amount: clientPurchaseTotal,
    paymentMethodNonce: clientNonce,
    options: {
      submitForSettlement: true
    }
  }, (err, results) => {
    if(err) {
      return res.status(500).json(error)
    } else {
      res.json(results)
    }
  })
};