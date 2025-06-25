const { DocumentVersion } = require('../models');

exports.getDocumentVersions = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const versions = await DocumentVersion.findAll({ where: { documentId } });
    res.json({ success: true, data: versions });
  } catch (err) {
    next(err);
  }
};

// Add endpoints for version CRUD and restore as per API spec
