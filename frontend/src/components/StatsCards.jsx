import React from 'react';
import { FiLayers, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';

const StatsCards = ({ total, completed, pending }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      {/* Total Tasks */}
      <div className="stat-card">
        <div className="stat-icon-wrapper total">
          <FiLayers className="stat-icon" />
        </div>
        <div className="stat-info">
          <p className="stat-title">Total Tasks</p>
          <h3 className="stat-value">{total}</h3>
          <span className="stat-helper">All managed tasks</span>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="stat-card">
        <div className="stat-icon-wrapper completed">
          <FiCheckCircle className="stat-icon" />
        </div>
        <div className="stat-info">
          <p className="stat-title">Completed</p>
          <h3 className="stat-value">{completed}</h3>
          <span className="stat-helper">{completionRate}% finished</span>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="stat-card">
        <div className="stat-icon-wrapper pending">
          <FiClock className="stat-icon" />
        </div>
        <div className="stat-info">
          <p className="stat-title">Pending</p>
          <h3 className="stat-value">{pending}</h3>
          <span className="stat-helper">Needs attention</span>
        </div>
      </div>

      {/* Progress Card */}
      <div className="stat-card progress-card">
        <div className="stat-icon-wrapper progress">
          <FiTrendingUp className="stat-icon" />
        </div>
        <div className="stat-info" style={{ width: '100%' }}>
          <p className="stat-title">Overall Progress</p>
          <h3 className="stat-value">{completionRate}%</h3>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
