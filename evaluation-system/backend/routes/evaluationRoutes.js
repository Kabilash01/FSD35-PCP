const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const {
  submitEvaluation,
  getMyEvaluations,
  getAllEvaluations,
  getAllEvaluators,
  getEvaluationById,
  createEvaluation,
  updateEvaluation,
  deleteEvaluation
} = require('../controllers/evaluationController');

// EVALUATOR routes
router.post('/submit', protect, authorizeRole('evaluator'), submitEvaluation);
router.get('/my', protect, authorizeRole('evaluator'), getMyEvaluations);

// ADMIN routes - Read
router.get('/all', protect, authorizeRole('admin'), getAllEvaluations);
router.get('/evaluators', protect, authorizeRole('admin'), getAllEvaluators);
router.get('/admin/:id', protect, authorizeRole('admin'), getEvaluationById);

// ADMIN routes - Create, Update, Delete
router.post('/admin/create', protect, authorizeRole('admin'), createEvaluation);
router.put('/admin/:id', protect, authorizeRole('admin'), updateEvaluation);
router.delete('/admin/:id', protect, authorizeRole('admin'), deleteEvaluation);

module.exports = router;
