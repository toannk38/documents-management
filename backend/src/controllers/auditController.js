const { AuditLog, User } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const { Parser } = require('json2csv');

exports.getAuditLogs = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 50, user_id, action, resource_type, resource_id, severity_level, module, date_from, date_to, ip_address, session_id, response_status, search, sort_by = 'created_at', sort_order = 'desc', export_format
    } = req.query;
    const where = {};
    if (user_id) where.user_id = user_id;
    if (action) where.action = action;
    if (resource_type) where.resource_type = resource_type;
    if (resource_id) where.resource_id = resource_id;
    if (severity_level) where.severity_level = severity_level;
    if (module) where.module = module;
    if (ip_address) where.ip_address = ip_address;
    if (session_id) where.session_id = session_id;
    if (response_status) where.response_status = response_status;
    if (date_from || date_to) {
      where.created_at = {};
      if (date_from) where.created_at[Op.gte] = date_from;
      if (date_to) where.created_at[Op.lte] = date_to;
    }
    if (search) {
      where[Op.or] = [
        { action: { [Op.iLike]: `%${search}%` } },
        { error_message: { [Op.iLike]: `%${search}%` } },
        { module: { [Op.iLike]: `%${search}%` } },
        { sub_module: { [Op.iLike]: `%${search}%` } }
      ];
    }
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const logs = await AuditLog.findAndCountAll({
      where,
      limit: export_format ? undefined : parseInt(limit),
      offset: export_format ? undefined : offset,
      order: [[sort_by, sort_order]],
      include: [{ model: User, attributes: ['id', 'username', 'full_name', 'email', 'department', 'position'] }]
    });
    // Export logic
    if (export_format) {
      let data = logs.rows.map(log => log.toJSON());
      if (export_format === 'csv') {
        const parser = new Parser();
        const csv = parser.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment('audit_logs.csv');
        return res.send(csv);
      } else if (export_format === 'json') {
        return res.json({ success: true, message: 'Xuất audit logs thành công', data: { logs: data } });
      } else if (export_format === 'excel') {
        // Excel export can be implemented with a library like exceljs
        return res.status(501).json({ success: false, message: 'Excel export chưa được hỗ trợ' });
      }
    }
    // Filters and statistics (demo, should be optimized for production)
    const actions = await AuditLog.aggregate('action', 'DISTINCT', { plain: false });
    const resource_types = await AuditLog.aggregate('resource_type', 'DISTINCT', { plain: false });
    const severity_levels = await AuditLog.aggregate('severity_level', 'DISTINCT', { plain: false });
    const modules = await AuditLog.aggregate('module', 'DISTINCT', { plain: false });
    const total_logs = await AuditLog.count();
    const today_logs = await AuditLog.count({ where: { created_at: { [Op.gte]: new Date(new Date().setHours(0,0,0,0)) } } });
    const error_logs = await AuditLog.count({ where: { severity_level: 'error' } });
    const warning_logs = await AuditLog.count({ where: { severity_level: 'warning' } });
    const unique_users = await AuditLog.aggregate('user_id', 'DISTINCT', { plain: false });
    const unique_ips = await AuditLog.aggregate('ip_address', 'DISTINCT', { plain: false });
    res.json({
      success: true,
      message: 'Lấy audit logs thành công',
      data: {
        logs: logs.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: logs.count,
          total_pages: Math.ceil(logs.count / limit),
          has_next: offset + parseInt(limit) < logs.count,
          has_prev: offset > 0
        },
        filters: {
          actions: actions.map(a => a.DISTINCT),
          resource_types: resource_types.map(r => r.DISTINCT),
          severity_levels: severity_levels.map(s => s.DISTINCT),
          modules: modules.map(m => m.DISTINCT)
        },
        statistics: {
          total_logs,
          today_logs,
          error_logs,
          warning_logs,
          unique_users: unique_users.length,
          unique_ips: unique_ips.length
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAuditLogDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await AuditLog.findByPk(id, {
      include: [{ model: User, attributes: ['id', 'username', 'full_name', 'email', 'department', 'position'] }]
    });
    if (!log) return res.status(404).json({ success: false, message: 'Không tìm thấy audit log' });
    // Optionally, add resource_details, changes, etc.
    res.json({
      success: true,
      message: 'Lấy chi tiết audit log thành công',
      data: { log }
    });
  } catch (err) {
    next(err);
  }
};

exports.createAuditLog = async (req, res, next) => {
  try {
    const data = req.body;
    // Only allow system calls (check header)
    if (req.headers['x-system-call'] !== 'true') {
      return res.status(403).json({ success: false, message: 'Chỉ hệ thống được phép tạo audit log' });
    }
    const log = await AuditLog.create(data);
    res.status(201).json({ success: true, message: 'Tạo audit log thành công', data: { log } });
  } catch (err) {
    next(err);
  }
};

exports.exportAuditLogs = async (req, res, next) => {
  // Handled in getAuditLogs with export_format param
  res.status(501).json({ success: false, message: 'Sử dụng export_format trong GET /api/audit-logs' });
};

exports.getAuditLogStatistics = async (req, res, next) => {
  try {
    // Example: group by action, user, module, severity, etc.
    const total_logs = await AuditLog.count();
    const logs_by_action = await AuditLog.findAll({ attributes: ['action', [fn('COUNT', col('action')), 'count']], group: ['action'] });
    const logs_by_user = await AuditLog.findAll({ attributes: ['user_id', [fn('COUNT', col('user_id')), 'count']], group: ['user_id'] });
    const logs_by_ip = await AuditLog.findAll({ attributes: ['ip_address', [fn('COUNT', col('ip_address')), 'count']], group: ['ip_address'] });
    const logs_by_severity = await AuditLog.findAll({ attributes: ['severity_level', [fn('COUNT', col('severity_level')), 'count']], group: ['severity_level'] });
    const logs_by_module = await AuditLog.findAll({ attributes: ['module', [fn('COUNT', col('module')), 'count']], group: ['module'] });
    res.json({
      success: true,
      message: 'Lấy thống kê audit logs thành công',
      data: {
        total_logs,
        logs_by_action: Object.fromEntries(logs_by_action.map(l => [l.action, parseInt(l.get('count'))])),
        logs_by_user: Object.fromEntries(logs_by_user.map(l => [l.user_id, parseInt(l.get('count'))])),
        logs_by_ip: Object.fromEntries(logs_by_ip.map(l => [l.ip_address, parseInt(l.get('count'))])),
        logs_by_severity: Object.fromEntries(logs_by_severity.map(l => [l.severity_level, parseInt(l.get('count'))])),
        logs_by_module: Object.fromEntries(logs_by_module.map(l => [l.module, parseInt(l.get('count'))]))
      }
    });
  } catch (err) {
    next(err);
  }
};
