const Hearing = require('../models/Hearing');

// Public: Get hearings by case ID
const getHearingsByCase = async (req, res) => {
  try {
    const hearings = await Hearing.find({ caseId: req.params.caseId })
      .populate('caseId')
      .populate('judgeId', 'name');

    res.json(hearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single hearing by ID
const getHearingById = async (req, res) => {
  try {
    const hearing = await Hearing.findById(req.params.id)
      .populate('caseId')
      .populate('judgeId');

    if (!hearing)
      return res.status(404).json({ message: "Hearing not found" });

    res.json(hearing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all hearings
const getAllHearings = async (req, res) => {
  try {
    const hearings = await Hearing.find()
      .populate('caseId')
      .populate('judgeId');

    res.json(hearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Create hearing
const createHearing = async (req, res) => {
  try {
    const newHearing = await Hearing.create(req.body);
    res.status(201).json(newHearing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Update hearing
const updateHearing = async (req, res) => {
  try {
    const updated = await Hearing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Hearing not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Delete hearing
const deleteHearing = async (req, res) => {
  try {
    const deleted = await Hearing.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Hearing not found" });

    res.json({ message: "Hearing deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Public: Get all hearings
const getPublicHearings = async (req, res) => {
  try {
    const hearings = await Hearing.find()
      .populate('caseId')
      .populate('judgeId', 'name');
    res.json(hearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: Get hearings by judge
const getHearingsByJudge = async (req, res) => {
  try {
    const hearings = await Hearing.find({ judgeId: req.params.judgeId })
      .populate('caseId')
      .populate('judgeId');
    res.json(hearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getHearingsByCase,
  getHearingById,
  getAllHearings,
  createHearing,
  updateHearing,
  deleteHearing,
  getPublicHearings,
  getHearingsByJudge
};
