const Evaluation = require('../models/Evaluation');

// EVALUATOR: Submit a new evaluation (NO updates allowed)
exports.submitEvaluation = async (req, res) => {
  const { submissionTitle, candidateName, score, remarks } = req.body;
  try {
    const evaluation = await Evaluation.create({
      evaluatorId: req.user.id,
      evaluatorName: req.user.name,
      submissionTitle,
      candidateName,
      score,
      remarks,
      isFinalized: true
    });
    res.status(201).json({ message: 'Evaluation submitted successfully', evaluation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// EVALUATOR: Get own evaluations
exports.getMyEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ evaluatorId: req.user.id }).sort({ createdAt: -1 });
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: Get all evaluations
exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate('evaluatorId', 'name email').sort({ createdAt: -1 });
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: Get all evaluators (users with role evaluator)
exports.getAllEvaluators = async (req, res) => {
  const User = require('../models/User');
  try {
    const evaluators = await User.find({ role: 'evaluator' }).select('-password');
    res.json(evaluators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: Get single evaluation by ID
exports.getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id).populate('evaluatorId', 'name email');
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: Create new evaluation
exports.createEvaluation = async (req, res) => {
  const { evaluatorId, evaluatorName, submissionTitle, candidateName, score, remarks } = req.body;
  try {
    // Validate required fields
    if (!evaluatorId || !submissionTitle || !candidateName || score === undefined || !remarks) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate score range
    if (score < 0 || score > 100) {
      return res.status(400).json({ message: 'Score must be between 0 and 100' });
    }

    const evaluation = await Evaluation.create({
      evaluatorId,
      evaluatorName,
      submissionTitle,
      candidateName,
      score,
      remarks,
      isFinalized: true
    });
    res.status(201).json({ message: 'Evaluation created successfully', evaluation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: Update evaluation (bypass immutability)
exports.updateEvaluation = async (req, res) => {
  const { submissionTitle, candidateName, score, remarks } = req.body;
  try {
    // Validate score range
    if (score !== undefined && (score < 0 || score > 100)) {
      return res.status(400).json({ message: 'Score must be between 0 and 100' });
    }

    const evaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      {
        ...(submissionTitle && { submissionTitle }),
        ...(candidateName && { candidateName }),
        ...(score !== undefined && { score }),
        ...(remarks && { remarks })
      },
      { new: true, runValidators: true }
    );

    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ message: 'Evaluation updated successfully', evaluation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: Delete evaluation
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByIdAndDelete(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ message: 'Evaluation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
