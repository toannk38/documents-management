const { DocumentCategory } = require('../models');

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await DocumentCategory.findAll();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// Add CRUD endpoints for categories as needed
