const express = require('express');
const router = express.Router();

// Controllers
const { registerAdmin, loginAdmin } = require('../controllers/authController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

//////////////////////
// AUTH ROUTES
//////////////////////

/**
 * POST /api/auth/register
 * Register a new admin user
 * Body: { name, email, password, role }
 * Only allow 'superadmin' or 'clerk' roles
 */
router.post('/register', registerAdmin);

/**
 * POST /api/auth/login
 * Login admin user and return JWT token
 * Body: { email, password }
 * Only users with 'superadmin' or 'clerk' roles can login
 */
router.post('/login', loginAdmin);

/**
 * GET /api/auth/dashboard
 * Protected route - requires authentication
 * Returns welcome message with admin info
 */
router.get('/dashboard', protect, authorize('superadmin', 'clerk'), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome ${req.admin.name}`,
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

/**
 * GET /api/auth/verify
 * Verify if a token is valid
 */
router.get('/verify', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    admin: {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

module.exports = router;
