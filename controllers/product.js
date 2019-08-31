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

    const product = new Product(fields); // create new product with the field received

    // If there's a photo for the product, add it.
    if(files.photo) { // 'photo' name depends on how you send data from the client side (ex: could be image instead)
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