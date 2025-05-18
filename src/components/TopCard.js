import React from "react";
import "./DashboardStyles.css";

const TopCard = ({ label, value, theme, icon }) => {
  return (
    <div className={`top-card ${theme}`}>
      <div className="top-card-icon">{icon}</div>
      <div className="top-card-content">
        <p className="top-card-label">{label}</p>
        <h3 className="top-card-value">{value}</h3>
      </div>
    </div>
  );
};

export default TopCard;
