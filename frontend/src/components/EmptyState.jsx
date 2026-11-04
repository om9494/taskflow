import React from 'react';
import { FiInbox, FiPlus } from 'react-icons/fi';

const EmptyState = ({ filter, onOpenAddModal }) => {
  const getMessage = () => {
    switch (filter) {
      case 'completed':
        return {
          title: 'No completed tasks yet',
          subtitle: 'Mark tasks as completed from your active list to see them here.'
        };
      case 'pending':
        return {
          title: 'No pending tasks!',
          subtitle: 'All caught up! Great job finishing all your tasks.'
        };
      default:
        return {
          title: 'No tasks found',
          subtitle: 'Get started by creating your first task in TaskFlow.'
        };
    }
  };

  const { title, subtitle } = getMessage();

  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        <FiInbox />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-subtitle">{subtitle}</p>
      {filter !== 'completed' && (
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <FiPlus />
          <span>Create First Task</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
