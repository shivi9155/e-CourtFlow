const Judge = require('../models/Judge');

// Public: Get all judges
const getAllJudgesPublic = async (req, res) => {
  try {
    const judges = await Judge.find()
      .populate('assignedCases');
    res.json(judges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public: Get single judge by ID with profile
const getJudgeById = async (req, res) => {
  try {
    const judge = await Judge.findById(req.params.id)
      .populate('assignedCases');
    if (!judge) return res.status(404).json({ message: "Judge not found" });
    res.json(judge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all judges
const getAllJudges = async (req, res) => {
  try {
    const judges = await Judge.find()
      .populate('assignedCases')
      .sort({ createdAt: -1 });
    res.json(judges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Create judge
const createJudge = async (req, res) => {
  try {
    const newJudge = await Judge.create(req.body);
    res.status(201).json(newJudge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Update judge
const updateJudge = async (req, res) => {
  try {
    const updated = await Judge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedCases');
    if (!updated) return res.status(404).json({ message: "Judge not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Admin: Delete judge
const deleteJudge = async (req, res) => {
  try {
    const deleted = await Judge.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Judge not found" });
    res.json({ message: "Judge deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get judge statistics
const getJudgeStats = async (req, res) => {
  try {
    const totalJudges = await Judge.countDocuments();
    const availableJudges = await Judge.countDocuments({ availabilityStatus: 'available' });
    const busyJudges = await Judge.countDocuments({ availabilityStatus: 'busy' });
    
    res.json({
      totalJudges,
      availableJudges,
      busyJudges
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search judge by name with assigned cases and case hearings
const searchJudgeByName = async (req, res) => {
  try {
    const { name } = req.params;
    const judge = await Judge.findOne({ name: { $regex: name, $options: 'i' } })
      .populate('assignedCases')
      .exec();
    
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found' });
    }
    
    res.json(judge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllJudgesPublic,
  getJudgeById,
  getAllJudges,
  createJudge,
  updateJudge,
  deleteJudge,
  getJudgeStats,
  searchJudgeByName
};
