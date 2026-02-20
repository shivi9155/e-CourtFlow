const express = require('express');
const router = express.Router();

// Controllers
const { registerAdmin, loginAdmin } = require('../controllers/authController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

//////////////////////
// AUTH ROUTES
//////////////////////
router.post('/register', registerAdmin); // Public
router.post('/login', loginAdmin);       // Public

// Example protected route
router.get('/dashboard', protect, authorize('superadmin', 'clerk'), (req, res) => {
  res.json({ message: `Welcome ${req.admin.name}`, role: req.admin.role });
});

module.exports = router;
