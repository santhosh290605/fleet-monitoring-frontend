import React from "react";
import styles from "./strategyInsights.module.css";

const StrategySummaryCard = ({ title, data, strategy }) => {
  return (
    <div className={`${styles.card} ${styles[strategy]}`}>
      <h3 className={styles.cardTitle}>{title} Strategy</h3>
      <p>Avg Cost: ₹{data.avgCost}</p>
      <p>Avg Speed: {data.avgSpeed} km/h</p>
      <p>Avg Fuel Efficiency: {data.avgFuel} km/l</p>
    </div>
  );
};

export default StrategySummaryCard;
