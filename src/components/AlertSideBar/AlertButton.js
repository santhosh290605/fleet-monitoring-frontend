import React from 'react';
import './AlertStyles.css';

function AlertButton({ onClick, alertCount }) {
  return (
    <div className="alert-floating-button">
      <button className="alert-button" onClick={onClick}>
        🚨
        {alertCount > 0 && <span className="alert-count">{alertCount}</span>}
      </button>
    </div>
  );
}

export default AlertButton;
