import React, { useEffect, useState } from "react";
import axios from "axios";
import StrategySummaryCard from "./StrategySummaryCard";
import StrategyPieChart from "./StrategyPieChart";
import styles from "./strategyInsights.module.css";

const StrategyInsightsSection = ({ darkMode }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/strategy-overview");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch strategy insights:", err);
      }
    };

    fetchInsights();
  }, []);

  if (!data) {
    return <div className={styles.loading}>Loading Strategy Insights...</div>;
  }

  const { strategyDistribution, strategyAverages } = data;

  return (
    <div
      className={styles.section}
      style={{
        backgroundColor: darkMode ? "#1e293b" : "#f8f9fa",
        color: darkMode ? "#f8fafc" : "#1e293b",
      }}
    >
      <h2 className={styles.heading}>📈 Strategy Recommendations Overview</h2>
      <div className={styles.cardsContainer}>
        <StrategySummaryCard
          title="Delayed"
          data={strategyAverages.delayed}
          strategy="delayed"
        />
        <StrategySummaryCard
          title="Immediate"
          data={strategyAverages.immediate}
          strategy="immediate"
        />
        <StrategySummaryCard
          title="Scheduled"
          data={strategyAverages.scheduled}
          strategy="scheduled"
        />
      </div>
      <div className={styles.pieChartWrapper}>
        <div
          className={styles.pieChart}
          style={{
            backgroundColor: darkMode ? "#0f172a" : "#e5e7eb",
            color: darkMode ? "#f8fafc" : "#1e293b",
          }}
        >
          <StrategyPieChart data={strategyDistribution} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default StrategyInsightsSection;
