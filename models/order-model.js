const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const Schema = mongoose.Schema;

const CartItemSchema = new Schema(
  {
    product: { type: ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    count: Number
  }, {
    timestamps: true
  }
);

const CartItem = mongoose.model('CartItem', CartItemSchema);

const OrderSchema = new Schema(
  {
    products: [CartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: 'Not processed',
      enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    },
    updated: Date,
    user: { type: ObjectId, ref: 'User' } // refer to user model for User that has created order
  }, {
    timestamps: true
  }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order, CartItem };