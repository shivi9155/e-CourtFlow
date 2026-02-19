const express = require('express');
const router = express.Router();

// Controllers
const { registerAdmin, loginAdmin } = require('../controllers/authController');
const caseController = require('../controllers/caseController');
const judgeController = require('../controllers/judgeController');
const hearingController = require('../controllers/hearingController');

// Middleware
const { validateCase } = require('../middleware/validationMiddleware');
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

//////////////////////
// CASE ROUTES
//////////////////////
router.get('/cases', caseController.getPublicAllCases);        // Public
router.get('/cases/:id', caseController.getPublicCaseById);    // Public
router.post('/cases', protect, authorize('superadmin', 'clerk'), validateCase, caseController.createCase);
router.put('/cases/:id', protect, authorize('superadmin', 'clerk'), caseController.updateCase);
router.delete('/cases/:id', protect, authorize('superadmin', 'clerk'), caseController.deleteCase);
router.get('/cases-stats', protect, authorize('superadmin', 'clerk'), caseController.getCaseStats);

//////////////////////
// JUDGE ROUTES
//////////////////////
router.get('/judges', judgeController.getAllJudgesPublic);     // Public
router.get('/judges/:id', judgeController.getJudgeById);       // Public
router.post('/judges', protect, authorize('superadmin'), judgeController.createJudge);
router.put('/judges/:id', protect, authorize('superadmin'), judgeController.updateJudge);
router.delete('/judges/:id', protect, authorize('superadmin'), judgeController.deleteJudge);
router.get('/judges-stats', protect, authorize('superadmin', 'clerk'), judgeController.getJudgeStats);

//////////////////////
// HEARING ROUTES
//////////////////////
router.get('/hearings', hearingController.getAllHearings);     // Public
router.get('/hearings/:id', hearingController.getHearingById); // Public
router.post('/hearings', protect, authorize('superadmin', 'clerk'), hearingController.createHearing);
router.put('/hearings/:id', protect, authorize('superadmin', 'clerk'), hearingController.updateHearing);
router.delete('/hearings/:id', protect, authorize('superadmin', 'clerk'), hearingController.deleteHearing);

module.exports = router;
