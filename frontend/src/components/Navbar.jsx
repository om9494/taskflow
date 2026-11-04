import React from 'react';
import { FiCheckCircle, FiPlus, FiActivity, FiServer } from 'react-icons/fi';

const Navbar = ({ backendStatus, onOpenAddModal }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <FiCheckCircle />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">TaskFlow</h1>
            <span className="brand-subtitle">DevOps Production Edition</span>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Backend Health Badge */}
          <div className={`health-badge ${backendStatus.online ? 'healthy' : 'degraded'}`}>
            <FiServer className="health-icon" />
            <span className="health-dot"></span>
            <span className="health-label">
              {backendStatus.online ? 'API Online' : 'API Offline'}
            </span>
          </div>

          {/* Quick Add Task button */}
          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <FiPlus />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
