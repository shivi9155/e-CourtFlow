const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1].trim();
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select('-password');
      if (!req.admin) return res.status(401).json({ message: 'Admin not found' });
      next();
    } catch (err) {
      console.error('Auth error:', err.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

// Role-based authorization
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.admin) return res.status(401).json({ message: 'Not authenticated' });
  if (allowedRoles.length && !allowedRoles.includes(req.admin.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  }
  next();
};

module.exports = { protect, authorize };
