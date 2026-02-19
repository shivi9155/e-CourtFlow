const express = require('express');
const { searchCases, getPublicCaseById, getPublicAllCases, getCaseStats } = require('../controllers/caseController');
const { getAllJudgesPublic, getJudgeById, getJudgeStats, searchJudgeByName } = require('../controllers/judgeController');
const { getPublicHearings, getHearingsByJudge } = require('../controllers/hearingController');
const router = express.Router();

// Cases
router.get('/cases', getPublicAllCases);
router.get('/cases/search', searchCases);
router.get('/cases/:id', getPublicCaseById);
router.get('/stats/cases', getCaseStats);

// Judges
router.get('/judges', getAllJudgesPublic);
router.get('/judges/:id', getJudgeById);
router.get('/judges/search/:name', searchJudgeByName);
router.get('/stats/judges', getJudgeStats);

// Hearings
router.get('/hearings', getPublicHearings);
router.get('/hearings/judge/:judgeId', getHearingsByJudge);
router.get('/stats/hearings', async (req, res) => {
  try {
    const Hearing = require('../models/Hearing');
    const total = await Hearing.countDocuments();
    const upcoming = await Hearing.countDocuments({ hearingDate: { $gt: new Date() } });
    res.json({ totalHearings: total, upcomingHearings: upcoming });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;