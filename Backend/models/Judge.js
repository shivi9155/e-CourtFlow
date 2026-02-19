const mongoose = require('mongoose');
const JudgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  court: { type: String, required: true },
  specialization: { type: String },
  experience: { type: Number, default: 0 },
  assignedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Case' }],
  availabilityStatus: { type: String, enum: ['available', 'busy', 'on-leave'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Judge', JudgeSchema);