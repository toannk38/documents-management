const { Permission } = require('../models');

exports.getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.findAll();
    res.json({ success: true, data: permissions });
  } catch (err) {
    next(err);
  }
};

// Add endpoints for permission CRUD and assignment as needed
