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