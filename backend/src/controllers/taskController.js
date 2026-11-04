const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = Boolean(completed);

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: task._id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or set task completion status
// @route   PATCH /api/tasks/:id/status
// @access  Public
const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`
      });
    }

    // If completed is explicitly provided in body, use it; otherwise toggle
    if (req.body && typeof req.body.completed === 'boolean') {
      task.completed = req.body.completed;
    } else {
      task.completed = !task.completed;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${updatedTask.completed ? 'completed' : 'pending'}`,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get backend health status
// @route   GET /api/health
// @access  Public
const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'TaskFlow Backend is running',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getHealth
};
