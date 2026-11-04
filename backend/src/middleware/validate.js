const mongoose = require('mongoose');

// Middleware to validate MongoDB ObjectId in URL params
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}' is not a valid task identifier`
      });
    }
    next();
  };
};

// Middleware to validate task creation payload
const validateTaskInput = (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Task title is required and cannot be empty'
    });
  }
  next();
};

module.exports = {
  validateObjectId,
  validateTaskInput
};
