const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product-model');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {

  // Need to handle form data and the files (uploads) - formidable package

  let form = new formidable.IncomingForm(); // makes form data available

  form.keepExtensions = true; // keep whatever image extension type

  form.parse(req, (err, fields, files) => { // parse the form so we can have access to fields/files or err

    if(err) { // if there's an error we can't go any further
      return res.status(400).json({
        error: 'Image could not be uploaded at this time. Please try again.'
      });
    }

    // Validation - check for all fields
     const { name, description, price, category, quantity, shipping } = fields;

     if( !name || !description || !price || !category || !quantity || !shipping ) {
       return res.status(400).json({
         error: 'All fields are required.'
       })
     }

    const product = new Product(fields); // create new product with the field received

    // If there's a photo for the product, add it.
    if(files.photo) { // 'photo' name depends on how you send data from the client side (ex: could be image instead)

      if(files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image must be less than 1MB.'
        });
      }

       product.photo.data = fs.readFileSync(files.photo.path); // fs = file system - Node.js core module
       product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if(err) { // delete me if needed - could be error here
        return res.status(400).json({
          err: errorHandler(err)
        });
      }

      // upon success - send product as json (result)
      res.json({
        result
      });

    });

  });

};

exports.productById = (req, res, next, id) => {

  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: 'Product not found'
      });
    }

    // Product is found - add the product info in the request object
    req.product = product;
    next();
  })
}

exports.read = (req, res) => {

  req.product.photo = undefined; // handled later

  return res.json(req.product);
};

exports.remove = (req, res) => {

  let product = req.product;

  product.remove((err, deletedProduct) => {

    if (err) {
       return res.status(400).json({
         error: errorHandler(err)
       });
     }

     // Product deleted successfully
     res.json({
       deletedProduct,
       message: 'Producted deleted successfully.'
     })
  })
};