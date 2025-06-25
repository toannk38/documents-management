module.exports = (requiredRoles = []) => (req, res, next) => {
  const userRoles = Array.isArray(req.user?.roles) ? req.user.roles : [req.user?.role];
  if (!req.user || !userRoles.some(role => requiredRoles.includes(role))) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};
