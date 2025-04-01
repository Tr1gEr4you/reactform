import React, { useEffect } from 'react';
import '../styles/Notification.css';

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      <div className="notification-content">
        <span className="notification-message">{message}</span>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default Notification;