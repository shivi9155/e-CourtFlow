const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateCase } = require('../middleware/validationMiddleware');
const caseController = require('../controllers/caseController');
const judgeController = require('../controllers/judgeController');
const hearingController = require('../controllers/hearingController');
const router = express.Router();

// All admin routes are protected
router.use(protect);

// Cases
router.route('/cases')
  .get(caseController.getAllCases)
  .post(validateCase, authorize('superadmin'), caseController.createCase);
router.route('/cases/:id')
  .put(authorize('superadmin'), caseController.updateCase)
  .delete(authorize('superadmin'), caseController.deleteCase);
router.get('/cases-stats', caseController.getCaseStats);

// Judges
router.route('/judges')
  .get(judgeController.getAllJudges)
  .post(authorize('superadmin'), judgeController.createJudge);
router.route('/judges/:id')
  .put(authorize('superadmin'), judgeController.updateJudge)
  .delete(authorize('superadmin'), judgeController.deleteJudge);
router.get('/judges-stats', judgeController.getJudgeStats);

// Hearings
router.route('/hearings')
  .get(hearingController.getAllHearings)
  .post(authorize('superadmin'), hearingController.createHearing);
router.route('/hearings/:id')
  .put(authorize('superadmin'), hearingController.updateHearing)
  .delete(authorize('superadmin'), hearingController.deleteHearing);

module.exports = router;