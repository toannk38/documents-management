const { Document, DocumentCategory, DocumentVersion, DocumentFile, DigitalSignature, DocumentWorkflow, DocumentComment, User } = require('../models');
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

exports.getDocumentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { include_content = false, include_versions = false, include_files = true, include_comments = false, include_workflow = false } = req.query;
    const include = [
      { model: DocumentCategory, as: 'category' },
      include_files ? { model: DocumentFile, as: 'files' } : null,
      include_versions ? { model: DocumentVersion, as: 'versions' } : null,
      include_comments ? { model: DocumentComment, as: 'comments' } : null,
      include_workflow ? { model: DocumentWorkflow, as: 'workflow' } : null,
      { model: User, as: 'creator', attributes: ['id', 'full_name'] }
    ].filter(Boolean);
    const document = await Document.findByPk(id, { include });
    if (!document) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy văn bản', error_code: 'DOCUMENT_NOT_FOUND', data: null });
    }
    // Optionally filter out content if not requested
    if (!include_content && document.current_version && document.current_version.content) {
      delete document.current_version.content;
    }
    res.json({ success: true, message: 'Lấy thông tin văn bản thành công', data: { document } });
  } catch (err) {
    next(err);
  }
};

exports.createDocument = async (req, res, next) => {
  try {
    const {
      document_number, title, document_type, issuing_agency, signer, signer_position, issue_date, effective_date, expiry_date, content_summary, keywords, category_id, parent_document_id, replaces_document_id, legal_basis, is_confidential, confidentiality_level, retention_period, content, save_as_draft
    } = req.body;
    // Validation
    if (!document_number || !title || !document_type) {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', error_code: 'VALIDATION_ERROR', data: { errors: [{ field: 'required', message: 'Thiếu trường bắt buộc' }] } });
    }
    if (title.length < 10 || title.length > 500) {
      return res.status(400).json({ success: false, message: 'Tiêu đề không hợp lệ', error_code: 'VALIDATION_ERROR', data: { errors: [{ field: 'title', message: 'Tiêu đề phải từ 10-500 ký tự' }] } });
    }
    // Check unique document_number
    const exists = await Document.findOne({ where: { document_number } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Số văn bản đã tồn tại', error_code: 'VALIDATION_ERROR', data: { errors: [{ field: 'document_number', message: 'Số văn bản đã tồn tại' }] } });
    }
    // Date validation
    const now = new Date();
    if (issue_date && new Date(issue_date) > now) {
      return res.status(400).json({ success: false, message: 'Ngày ban hành không hợp lệ', error_code: 'VALIDATION_ERROR', data: { errors: [{ field: 'issue_date', message: 'Ngày ban hành không được lớn hơn hiện tại' }] } });
    }
    if (effective_date && issue_date && new Date(effective_date) < new Date(issue_date)) {
      return res.status(400).json({ success: false, message: 'Ngày hiệu lực không hợp lệ', error_code: 'VALIDATION_ERROR', data: { errors: [{ field: 'effective_date', message: 'Ngày hiệu lực không được nhỏ hơn ngày ban hành' }] } });
    }
    if (expiry_date && effective_date && new Date(expiry_date) < new Date(effective_date)) {
      return res.status(400).json({ success: false, message: 'Ngày hết hiệu lực không hợp lệ', error_code: 'VALIDATION_ERROR', data: { errors: [{ field: 'expiry_date', message: 'Ngày hết hiệu lực không được nhỏ hơn ngày hiệu lực' }] } });
    }
    // Create document
    const document = await Document.create({
      document_number, title, document_type, issuing_agency, signer, signer_position, issue_date, effective_date, expiry_date, content_summary, keywords, category_id, parent_document_id, replaces_document_id, legal_basis, is_confidential, confidentiality_level, retention_period, status: save_as_draft ? 'draft' : 'created', created_by: req.user?.id
    });
    // Create initial version
    const version = await DocumentVersion.create({
      document_id: document.id,
      version_number: '1.0.0',
      content,
      is_current: true,
      created_by: req.user?.id
    });
    res.status(201).json({
      success: true,
      message: 'Tạo văn bản thành công',
      data: {
        document: {
          id: document.id,
          document_number: document.document_number,
          title: document.title,
          document_type: document.document_type,
          status: document.status,
          workflow_state: document.status,
          current_version: { id: version.id, version_number: version.version_number, is_current: true },
          created_at: document.createdAt,
          created_by: { id: req.user?.id, full_name: req.user?.full_name }
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title, issuing_agency, signer, signer_position, issue_date, effective_date, expiry_date, content_summary, keywords, category_id, legal_basis, content, change_description, create_new_version
    } = req.body;
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy văn bản', error_code: 'DOCUMENT_NOT_FOUND', data: null });
    }
    if (!['draft', 'review'].includes(document.status)) {
      return res.status(400).json({ success: false, message: 'Chỉ cho phép cập nhật khi trạng thái là draft hoặc review', error_code: 'CANNOT_UPDATE_DOCUMENT', data: null });
    }
    // Update fields
    if (title) document.title = title;
    if (issuing_agency) document.issuing_agency = issuing_agency;
    if (signer) document.signer = signer;
    if (signer_position) document.signer_position = signer_position;
    if (issue_date) document.issue_date = issue_date;
    if (effective_date) document.effective_date = effective_date;
    if (expiry_date) document.expiry_date = expiry_date;
    if (content_summary) document.content_summary = content_summary;
    if (keywords) document.keywords = keywords;
    if (category_id) document.category_id = category_id;
    if (legal_basis) document.legal_basis = legal_basis;
    await document.save();
    let version;
    if (content && create_new_version) {
      // Get latest version number and increment
      const lastVersion = await DocumentVersion.findOne({ where: { document_id: id }, order: [['createdAt', 'DESC']] });
      let [major, minor, patch] = lastVersion?.version_number?.split('.').map(Number) || [1, 0, 0];
      minor += 1;
      const newVersionNumber = `${major}.${minor}.${patch}`;
      version = await DocumentVersion.create({
        document_id: id,
        version_number: newVersionNumber,
        content,
        change_description,
        is_current: true,
        created_by: req.user?.id
      });
      // Mark previous version as not current
      if (lastVersion) {
        lastVersion.is_current = false;
        await lastVersion.save();
      }
    }
    res.json({
      success: true,
      message: 'Cập nhật văn bản thành công',
      data: {
        document: {
          id: document.id,
          title: document.title,
          updated_at: document.updatedAt,
          updated_by: { id: req.user?.id, full_name: req.user?.full_name },
          current_version: version ? { id: version.id, version_number: version.version_number, change_description } : undefined
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { force = false } = req.query;
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy văn bản', error_code: 'DOCUMENT_NOT_FOUND', data: null });
    }
    if (document.status !== 'draft' && !force) {
      return res.status(400).json({ success: false, message: 'Không thể xóa văn bản đã được phê duyệt', error_code: 'CANNOT_DELETE_APPROVED_DOCUMENT', data: null });
    }
    if (force) {
      await document.destroy();
    } else {
      document.status = 'archived';
      await document.save();
    }
    res.json({ success: true, message: 'Xóa văn bản thành công', data: null });
  } catch (err) {
    next(err);
  }
};

exports.getDocumentVersions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, include_content = false } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await DocumentVersion.findAndCountAll({
      where: { document_id: id },
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });
    const versions = rows.map(v => {
      const version = v.toJSON();
      if (!include_content) delete version.content;
      return version;
    });
    res.json({
      success: true,
      message: 'Lấy danh sách phiên bản thành công',
      data: {
        versions,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: count,
          total_pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadPdfFile = async (req, res, next) => {
  try {
    // Placeholder implementation
    res.status(200).json({ success: true, message: 'PDF uploaded successfully (placeholder)', data: null });
  } catch (err) {
    next(err);
  }
};

exports.downloadDocumentFile = async (req, res, next) => {
  try {
    // Placeholder: skip actual S3 logic
    res.status(200).json({ success: true, message: 'Download skipped (placeholder)', data: null });
  } catch (err) {
    next(err);
  }
};

exports.advancedSearchDocuments = async (req, res, next) => {
  try {
    // Placeholder: skip actual S3 or search logic
    res.status(200).json({ success: true, message: 'Advanced search skipped (placeholder)', data: [] });
  } catch (err) {
    next(err);
  }
};

exports.changeDocumentStatus = async (req, res, next) => {
  try {
    // Placeholder: skip actual S3 or status logic
    res.status(200).json({ success: true, message: 'Change status skipped (placeholder)', data: null });
  } catch (err) {
    next(err);
  }
};
