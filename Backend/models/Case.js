const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseId: { 
    type: String, 
    unique: true,
    required: true   // ✅ prevent null
  },

  caseNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },

  title: { type: String, required: true },

  caseType: { 
    type: String, 
    enum: ['Civil', 'Criminal', 'Family', 'Corporate'], 
    required: true 
  },

  filingDate: { type: Date, default: Date.now },

  status: { 
    type: String, 
    enum: ['Pending', 'Ongoing', 'Closed'], 
    default: 'Pending' 
  },

  plaintiffName: { type: String, required: true },
  defendantName: { type: String, required: true },

  assignedJudge: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Judge' 
  },

  hearingDates: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hearing' 
  }],

  description: String,

  parties: {
    petitioner: { type: String, required: true },
    respondent: { type: String, required: true }
  },

  history: [{
    date: { type: Date, default: Date.now },
    description: String
  }]

}, { timestamps: true });


// ✅ Better Unique Case ID Generator (No Duplicate Risk)
CaseSchema.pre('validate', async function(next) {
  if (!this.caseId) {
    const random = Math.floor(100000 + Math.random() * 900000);
    this.caseId = `ECF-${Date.now()}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Case', CaseSchema);
