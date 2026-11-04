const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getHealth
} = require('../controllers/taskController');
const { validateObjectId, validateTaskInput } = require('../middleware/validate');

// Health Check route
router.get('/health', getHealth);

// Task collection routes
router.route('/tasks')
  .get(getTasks)
  .post(validateTaskInput, createTask);

// Task document routes
router.route('/tasks/:id')
  .put(validateObjectId('id'), validateTaskInput, updateTask)
  .delete(validateObjectId('id'), deleteTask);

// Task status update route
router.route('/tasks/:id/status')
  .patch(validateObjectId('id'), updateTaskStatus);

module.exports = router;
