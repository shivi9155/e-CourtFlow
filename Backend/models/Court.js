const mongoose = require('mongoose');
const CourtSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: String,
  address: String,
  phone: String,
  email: String,
  courtrooms: [String],
  judges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Judge' }],
  activeCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Case' }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Court', CourtSchema);
