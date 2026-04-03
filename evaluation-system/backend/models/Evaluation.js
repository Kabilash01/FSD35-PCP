const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evaluatorName: { type: String, required: true },
  submissionTitle: { type: String, required: true },
  candidateName: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  remarks: { type: String, required: true },
  isFinalized: { type: Boolean, default: true }
}, { timestamps: true });

// NOTE: Immutability is now enforced at the route/middleware level
// Only admins can access update/delete routes
// Regular evaluators only have access to submit route

module.exports = mongoose.model('Evaluation', EvaluationSchema);
