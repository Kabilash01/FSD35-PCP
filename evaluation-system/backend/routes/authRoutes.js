const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/roleMiddleware');
const {
  register,
  login,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// ADMIN routes - User Management
router.get('/admin/users/:id', protect, authorizeRole('admin'), getUserById);
router.post('/admin/users/create', protect, authorizeRole('admin'), createUser);
router.put('/admin/users/:id', protect, authorizeRole('admin'), updateUser);
router.delete('/admin/users/:id', protect, authorizeRole('admin'), deleteUser);

module.exports = router;
