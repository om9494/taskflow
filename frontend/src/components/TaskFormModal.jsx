import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiPlus } from 'react-icons/fi';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialTask = null, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(initialTask);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setCompleted(Boolean(initialTask.completed));
    } else {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
    setError('');
  }, [initialTask, isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      ...(isEditing ? { completed } : {})
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-banner">{error}</div>}

          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className="form-input"
              placeholder="e.g. Set up Kubernetes deployment manifests"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              maxLength={120}
              disabled={isSubmitting}
            />
            <span className="form-hint">{title.length}/120 characters</span>
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Description <span className="optional-tag">(Optional)</span>
            </label>
            <textarea
              id="task-description"
              className="form-textarea"
              placeholder="Provide more context, acceptance criteria or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              disabled={isSubmitting}
            />
            <span className="form-hint">{description.length}/1000 characters</span>
          </div>

          {isEditing && (
            <div className="form-checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  disabled={isSubmitting}
                />
                <span className="checkbox-label">Mark as completed</span>
              </label>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !title.trim()}
            >
              {isSubmitting ? (
                'Saving...'
              ) : isEditing ? (
                <>
                  <FiCheck /> Update Task
                </>
              ) : (
                <>
                  <FiPlus /> Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
