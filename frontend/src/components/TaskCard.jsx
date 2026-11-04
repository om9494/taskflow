import React from 'react';
import { FiCheck, FiCircle, FiEdit2, FiTrash2, FiClock } from 'react-icons/fi';

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`task-card ${task.completed ? 'task-completed' : 'task-pending'}`}>
      <div className="task-card-header">
        <button
          className={`btn-toggle-status ${task.completed ? 'is-completed' : ''}`}
          onClick={() => onToggleStatus(task)}
          title={task.completed ? 'Mark as Pending' : 'Mark as Completed'}
          aria-label={task.completed ? 'Mark as Pending' : 'Mark as Completed'}
        >
          {task.completed ? <FiCheck /> : <FiCircle />}
        </button>

        <div className="task-title-group">
          <h4 className={`task-title ${task.completed ? 'completed-text' : ''}`}>
            {task.title}
          </h4>
          <span className={`status-badge ${task.completed ? 'badge-success' : 'badge-warning'}`}>
            {task.completed ? 'Completed' : 'Pending'}
          </span>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <div className="task-timestamp">
          <FiClock className="time-icon" />
          <span>{formatDate(task.createdAt)}</span>
        </div>

        <div className="task-actions">
          <button
            className="btn-action btn-edit"
            onClick={() => onEdit(task)}
            title="Edit Task"
            aria-label="Edit Task"
          >
            <FiEdit2 />
            <span>Edit</span>
          </button>
          <button
            className="btn-action btn-delete"
            onClick={() => onDelete(task._id, task.title)}
            title="Delete Task"
            aria-label="Delete Task"
          >
            <FiTrash2 />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
