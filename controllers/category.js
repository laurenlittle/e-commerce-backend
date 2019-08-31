const Category = require('../models/category-model');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {

  const category = new Category(req.body);

  category.save((err, data)=> {
    if(err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }

    // upon success - send category as json (data)
    res.json({
      data
    })
  });
};


exports.categoryById = (req, res, next, id) => {

  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: 'Category does not exist'
      });
    }

    // Category is found - add the product info in the request object
    req.category = category;
    next();
  });
};


exports.read = (req, res) => {
  return res.json(req.category);
};


exports.update = (req, res) => {

  let category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory)=> {
    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    res.json(updatedCategory);
  });
};


exports.remove = (req, res) => {

  let category = req.category;

  category.remove((err, updatedCategory) => {

    if(err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    // Category deleted successfully
    res.json({
      // updatedCategory,
      message: 'Category deleted successfully.'
    });
  });
};


exports.list = (req, res) => {

  Category.find().exec((err, categories) => {

    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    res.json({
      categories
    });

  });
};