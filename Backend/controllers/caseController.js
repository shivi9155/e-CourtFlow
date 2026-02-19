const Case = require('../models/Case');

// Public: search cases by caseNumber, plaintiff, or defendant
const searchCases = async (req, res) => {
  const { q } = req.query;
  try {
    const cases = await Case.find({
      $or: [
        { caseNumber: { $regex: q, $options: 'i' } },
        { caseId: { $regex: q, $options: 'i' } },
        { plaintiffName: { $regex: q, $options: 'i' } },
        { defendantName: { $regex: q, $options: 'i' } },
        { 'parties.petitioner': { $regex: q, $options: 'i' } },
        { 'parties.respondent': { $regex: q, $options: 'i' } }
      ]
    }).populate('assignedJudge', 'name email').populate('hearingDates');
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: Get case by ID
const getPublicCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id)
      .populate('assignedJudge')
      .populate('hearingDates');
    if (!caseItem) return res.status(404).json({ message: 'Case not found' });
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: Get all cases (for public view)
const getPublicAllCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('assignedJudge', 'name email')
      .populate('hearingDates')
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all cases
const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate('assignedJudge')
      .populate('hearingDates')
      .sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Create case
const createCase = async (req, res) => {
  try {
    const newCase = await Case.create(req.body);
    res.status(201).json(newCase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Update case
const updateCase = async (req, res) => {
  try {
    const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedJudge')
      .populate('hearingDates');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Delete case
const deleteCase = async (req, res) => {
  try {
    await Case.findByIdAndDelete(req.params.id);
    res.json({ message: 'Case deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Get case statistics
const getCaseStats = async (req, res) => {
  try {
    const totalCases = await Case.countDocuments();
    const pendingCases = await Case.countDocuments({ status: 'Pending' });
    const ongoingCases = await Case.countDocuments({ status: 'Ongoing' });
    const closedCases = await Case.countDocuments({ status: 'Closed' });
    
    const casesByType = await Case.aggregate([
      { $group: { _id: '$caseType', count: { $sum: 1 } } }
    ]);

    res.json({
      totalCases,
      pendingCases,
      ongoingCases,
      closedCases,
      casesByType
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  searchCases,
  getPublicCaseById,
  getPublicAllCases,
  getAllCases,
  createCase,
  updateCase,
  deleteCase,
  getCaseStats
};