import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const Toast = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification || !notification.message) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div className={`toast-container ${isSuccess ? 'toast-success' : 'toast-error'}`}>
      <div className="toast-icon">
        {isSuccess ? <FiCheckCircle /> : <FiAlertCircle />}
      </div>
      <div className="toast-message">{notification.message}</div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
