import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import styles from "./strategyInsights.module.css";

const COLORS = {
  delayed: "#eab308",   // Yellow
  immediate: "#10b981", // Green
  scheduled: "#3b82f6"  // Blue
};

const StrategyPieChart = ({ data, darkMode }) => {
  const pieData = Object.entries(data).map(([strategy, value]) => ({
    name: strategy.charAt(0).toUpperCase() + strategy.slice(1),
    value,
    color: COLORS[strategy]
  }));

  return (
    <div className={styles.pieChart}>
      <h3
        style={{
          marginBottom: "1rem",
          color: darkMode ? "#f1f5f9" : "#1e293b"
        }}
      >
        Strategy Distribution
      </h3>
      {data ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                color: darkMode ? "#f8fafc" : "#111827",
                border: "none",
                borderRadius: "0.5rem"
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                color: darkMode ? "#f8fafc" : "#1f2937"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className={styles.loading}>Loading Pie Chart...</div>
      )}
    </div>
  );
};

export default StrategyPieChart;
