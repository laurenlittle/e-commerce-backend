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
      //  deletedProduct,
       message: 'Product deleted successfully.'
     })
  })
};


exports.update = (req, res) => {

  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {

    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded at this time. Please try again.'
      });
    }

    // Validation - check for all fields
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping
    } = fields;

    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({
        error: 'All fields are required.'
      })
    }

    let product = req.product;

    // use extend method from lodash - takes 2 args. product and updated fields
    product = _.extend(product, fields);

    console.log(product)

    // If there's a photo for the product, add it.
    if (files.photo) {

      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: 'Image must be less than 1MB.'
        });
      }

      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
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


exports.list = (req, res) => {

  Product.find().exec((err, products) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    res.json({
      products
    });

  });
};


/**
* Sort products by amount sold / new
* Sorting by most popular = /products?sortBy=sold&order=desc&limit=4
* Sorting by new arrivals = /products?sortBy=createdAt&order=desc&limit=4
* No params? return all products
*/

exports.list = (req, res) => {

  // Query Params
  let order = req.query.order ? req.query.order : 'asc'
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
  let limit = req.query.limit ? parseInt(req.query.limit) : 5

  Product.find()
      .select('-photo') // specifies to exclude the photo (due to large file sizes)
      .populate('category')
      .sort([[sortBy, order]])
      .limit(limit)
      .exec((err, products) => {

        if (err) {
          return res.status(400).json({
            error: 'Products not found'
          });
        }

        res.send(products);

      });
};