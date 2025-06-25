module.exports = (requiredPermission) => (req, res, next) => {
  if (!req.user || !req.user.permissions || !req.user.permissions.includes(requiredPermission)) {
    return res.status(403).json({ success: false, message: 'Permission denied' });
  }
  next();
};
