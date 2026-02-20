const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateCase } = require('../middleware/validationMiddleware');
const caseController = require('../controllers/caseController');
const judgeController = require('../controllers/judgeController');
const hearingController = require('../controllers/hearingController');
const router = express.Router();

// ================================
// MIDDLEWARE: Protect all admin routes
// Ensure only authenticated admins can access
// ================================
router.use(protect);

// ================================
// CASES ENDPOINTS
// ================================
// GET all cases (superadmin only)
router.get('/cases', authorize('superadmin'), caseController.getAllCases);

// CREATE new case (superadmin only)
router.post('/cases', 
  validateCase, 
  authorize('superadmin'), 
  caseController.createCase
);

// UPDATE case (superadmin only)
router.put('/cases/:id', 
  authorize('superadmin'), 
  caseController.updateCase
);

// DELETE case (superadmin only)
router.delete('/cases/:id', 
  authorize('superadmin'), 
  caseController.deleteCase
);

// GET case statistics (superadmin only)
router.get('/cases-stats', 
  authorize('superadmin'), 
  caseController.getCaseStats
);

// ================================
// JUDGES ENDPOINTS
// ================================
// GET all judges (superadmin only)
router.get('/judges', 
  authorize('superadmin'), 
  judgeController.getAllJudges
);

// CREATE new judge (superadmin only)
router.post('/judges', 
  authorize('superadmin'), 
  judgeController.createJudge
);

// UPDATE judge (superadmin only)
router.put('/judges/:id', 
  authorize('superadmin'), 
  judgeController.updateJudge
);

// DELETE judge (superadmin only)
router.delete('/judges/:id', 
  authorize('superadmin'), 
  judgeController.deleteJudge
);

// GET judge statistics (superadmin only)
router.get('/judges-stats', 
  authorize('superadmin'), 
  judgeController.getJudgeStats
);

// ================================
// HEARINGS ENDPOINTS
// ================================
// GET all hearings (superadmin only)
router.get('/hearings', 
  authorize('superadmin'), 
  hearingController.getAllHearings
);

// CREATE new hearing (superadmin only)
router.post('/hearings', 
  authorize('superadmin'), 
  hearingController.createHearing
);

// UPDATE hearing (superadmin only)
router.put('/hearings/:id', 
  authorize('superadmin'), 
  hearingController.updateHearing
);

// DELETE hearing (superadmin only)
router.delete('/hearings/:id', 
  authorize('superadmin'), 
  hearingController.deleteHearing
);

module.exports = router;