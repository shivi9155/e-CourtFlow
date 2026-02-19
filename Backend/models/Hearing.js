const mongoose = require('mongoose');
const HearingSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  judgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Judge', required: true },
  hearingDate: { type: Date, required: true },
  date: { type: Date, required: true },
  hearingTime: { type: String },
  courtroom: { type: String, required: true },
  purpose: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Postponed'], default: 'Scheduled' },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Hearing', HearingSchema);