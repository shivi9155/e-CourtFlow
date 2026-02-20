const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Protect route - verify JWT token is valid and user exists
 * Attaches admin user to req.admin if successful
 */
const protect = async (req, res, next) => {
  let token;
  
  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1].trim();
  }

  // If no token found
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized to access this route. Please provide a token.' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get admin from database
    req.admin = await Admin.findById(decoded.id).select('-password');
    
    // Check if admin exists
    if (!req.admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Admin user not found. Token may be expired.' 
      });
    }

    // Check if user has valid admin role
    const validRoles = ['superadmin', 'clerk'];
    if (!validRoles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'User does not have admin privileges to access this resource.' 
      });
    }

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token. Please log in again.' 
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired. Please log in again.' 
      });
    }

    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, token failed' 
    });
  }
};

/**
 * Role-based authorization middleware
 * Ensures the authenticated user has one of the allowed roles
 * @param {...string} allowedRoles - Roles permitted to access the route (e.g., 'superadmin', 'clerk')
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  // Check if user is authenticated
  if (!req.admin) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authenticated. Please log in first.' 
    });
  }

  // Check if user has required role
  if (allowedRoles.length && !allowedRoles.includes(req.admin.role)) {
    console.warn(`Access denied for user ${req.admin.email} with role ${req.admin.role} to resource requiring ${allowedRoles.join(', ')}`);
    return res.status(403).json({ 
      success: false,
      message: `Access denied. This action requires one of the following roles: ${allowedRoles.join(', ')}` 
    });
  }

  next();
};

module.exports = { protect, authorize };
