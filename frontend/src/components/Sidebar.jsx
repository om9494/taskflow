import React from 'react';
import { FiList, FiClock, FiCheckCircle, FiCpu, FiPlus } from 'react-icons/fi';

const Sidebar = ({ currentFilter, onSelectFilter, counts, onOpenAddModal }) => {
  const navItems = [
    { id: 'all', label: 'All Tasks', icon: FiList, count: counts.total },
    { id: 'pending', label: 'Pending Tasks', icon: FiClock, count: counts.pending },
    { id: 'completed', label: 'Completed Tasks', icon: FiCheckCircle, count: counts.completed }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <button className="btn btn-primary btn-block mb-4" onClick={onOpenAddModal}>
          <FiPlus />
          <span>Add Task</span>
        </button>

        <p className="sidebar-section-title">Navigation</p>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentFilter === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectFilter(item.id)}
              >
                <div className="nav-item-left">
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </div>
                <span className={`nav-badge ${isActive ? 'badge-active' : ''}`}>
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="devops-info-box">
          <div className="info-header">
            <FiCpu className="info-icon" />
            <span>DevOps Architecture</span>
          </div>
          <ul className="info-list">
            <li><span>Container:</span> <strong>Docker Multi-stage</strong></li>
            <li><span>Proxy:</span> <strong>Nginx Reverse Proxy</strong></li>
            <li><span>Cluster:</span> <strong>Kubernetes (K3s/EKS)</strong></li>
            <li><span>Database:</span> <strong>MongoDB with PVC</strong></li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
