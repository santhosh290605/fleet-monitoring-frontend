import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './AlertStyles.css';

function AlertSidebar({ isOpen, onClose }) {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();  // Initialize navigate

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3000/api/diagnostics/alerts/active')
        .then((res) => res.json())
        .then((data) => setAlerts(data));
    }
  }, [isOpen]);

  // Navigate to the resolve alert page for the selected alert
  const handleCardClick = (alertId) => {
    navigate(`/resolve-alert/${alertId}`);
  };

  return (
    <div className={`alert-sidebar-wrapper ${isOpen ? 'open' : ''}`}>
      <div className="alert-sidebar">
        <div className="alert-sidebar-header">
          <h2>Active Alerts</h2>
          <button onClick={onClose} className="close-button">✕</button>
        </div>
        <div className="alert-list">
          {alerts.length === 0 ? (
            <p className="no-alerts">No active alerts 🎉</p>
          ) : (
            alerts.map((alert) => (
              <div
                className="alert-item"
                key={alert._id}
                onClick={() => handleCardClick(alert._id)}  // Add onClick to navigate on card click
              >
                <div className="alert-title">{alert.alertType}</div>
                <div className="alert-message">{alert.message}</div>
                <div className="alert-meta">Severity: {alert.severity}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertSidebar;
