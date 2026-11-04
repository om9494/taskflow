import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StatsCards from './components/StatsCards';
import TaskCard from './components/TaskCard';
import TaskFormModal from './components/TaskFormModal';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import { taskService } from './services/api';
import { FiSearch, FiRefreshCw, FiPlus } from 'react-icons/fi';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Backend Health state
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    message: 'Checking backend...'
  });

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Check health and fetch tasks
  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // 1. Check health
      try {
        const health = await taskService.checkHealth();
        setBackendStatus({ online: true, message: health.message || 'Healthy' });
      } catch (err) {
        setBackendStatus({ online: false, message: 'Backend unreachable' });
      }

      // 2. Fetch tasks
      const result = await taskService.getTasks();
      if (result && Array.isArray(result.data)) {
        setTasks(result.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      showToast(err.message || 'Failed to connect to backend', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll backend health every 30 seconds
    const interval = setInterval(() => {
      taskService.checkHealth()
        .then(() => setBackendStatus({ online: true, message: 'Healthy' }))
        .catch(() => setBackendStatus({ online: false, message: 'Offline' }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Compute counts
  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by status
      if (filter === 'completed' && !task.completed) return false;
      if (filter === 'pending' && task.completed) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }
      return true;
    });
  }, [tasks, filter, searchQuery]);

  // Open modal for Create
  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Submit task (Create or Update)
  const handleSubmitTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        // Update existing task
        const response = await taskService.updateTask(editingTask._id, taskData);
        setTasks((prev) =>
          prev.map((t) => (t._id === editingTask._id ? response.data : t))
        );
        showToast('Task updated successfully!', 'success');
      } else {
        // Create new task
        const response = await taskService.createTask(taskData);
        setTasks((prev) => [response.data, ...prev]);
        showToast('Task created successfully!', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete task: "${title}"?`)) {
      try {
        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t._id !== id));
        showToast('Task deleted successfully', 'success');
      } catch (err) {
        showToast(err.message || 'Failed to delete task', 'error');
      }
    }
  };

  // Toggle completion status
  const handleToggleStatus = async (task) => {
    try {
      const response = await taskService.updateTaskStatus(task._id, !task.completed);
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? response.data : t))
      );
      showToast(
        `Task marked as ${response.data.completed ? 'completed' : 'pending'}`,
        'success'
      );
    } catch (err) {
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        backendStatus={backendStatus}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Container */}
      <div className="main-wrapper">
        {/* Left Sidebar */}
        <Sidebar
          currentFilter={filter}
          onSelectFilter={setFilter}
          counts={counts}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Content Area */}
        <main className="main-content">
          {/* Dashboard Summary Statistics */}
          <section className="section-stats">
            <h2 className="section-title">Dashboard Overview</h2>
            <StatsCards
              total={counts.total}
              completed={counts.completed}
              pending={counts.pending}
            />
          </section>

          {/* Action and Search Toolbar */}
          <div className="toolbar">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                >
                  &times;
                </button>
              )}
            </div>

            <div className="toolbar-actions">
              <button
                className={`btn btn-secondary ${refreshing ? 'btn-spinning' : ''}`}
                onClick={() => loadData(true)}
                title="Refresh task list"
              >
                <FiRefreshCw />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <button
                className="btn btn-primary"
                onClick={handleOpenAddModal}
              >
                <FiPlus />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Task List Section */}
          <section className="section-tasks">
            <div className="section-header">
              <h3 className="section-subtitle">
                {filter === 'all'
                  ? 'All Tasks'
                  : filter === 'completed'
                  ? 'Completed Tasks'
                  : 'Pending Tasks'}
                <span className="task-count-tag">{filteredTasks.length}</span>
              </h3>
            </div>

            {loading ? (
              <LoadingSpinner message="Loading tasks from backend..." />
            ) : filteredTasks.length === 0 ? (
              <EmptyState filter={filter} onOpenAddModal={handleOpenAddModal} />
            ) : (
              <div className="task-grid">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Task Form Modal (Add / Edit) */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        initialTask={editingTask}
        isSubmitting={isSubmitting}
      />

      {/* Toast Notification Banner */}
      <Toast
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}

export default App;
