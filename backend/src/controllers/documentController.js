const { Document, DocumentCategory } = require('../models');
const { Op } = require('sequelize');

exports.getAllDocuments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, document_type, status, category_id, issuing_agency, issue_date_from, issue_date_to, effective_date_from, effective_date_to, keywords, is_confidential, sort_by = 'created_at', sort_order = 'desc', created_by } = req.query;
    const where = {};
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    if (document_type) where.document_type = document_type;
    if (status) where.status = status;
    if (category_id) where.category_id = category_id;
    if (issuing_agency) where.issuing_agency = issuing_agency;
    if (issue_date_from || issue_date_to) {
      where.issue_date = {};
      if (issue_date_from) where.issue_date[Op.gte] = issue_date_from;
      if (issue_date_to) where.issue_date[Op.lte] = issue_date_to;
    }
    if (effective_date_from || effective_date_to) {
      where.effective_date = {};
      if (effective_date_from) where.effective_date[Op.gte] = effective_date_from;
      if (effective_date_to) where.effective_date[Op.lte] = effective_date_to;
    }
    if (Array.isArray(keywords)) where.keywords = { [Op.contains]: keywords };
    if (is_confidential !== undefined) where.is_confidential = is_confidential === 'true';
    if (created_by) where.created_by = created_by;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const documents = await Document.findAndCountAll({
      where,
      include: [DocumentCategory],
      limit: parseInt(limit),
      offset,
      order: [[sort_by, sort_order]]
    });
    res.json({ success: true, message: 'Lấy danh sách văn bản thành công', data: { documents: documents.rows, total: documents.count } });
  } catch (err) {
    next(err);
  }
};

// Add document CRUD, versioning, and workflow endpoints as needed
