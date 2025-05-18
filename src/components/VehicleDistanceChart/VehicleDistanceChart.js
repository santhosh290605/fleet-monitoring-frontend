import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import './VehicleDistanceChart.css';

// Registering chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VehicleDistanceChart = ({ darkMode }) => {
  const [distances, setDistances] = useState([]);
  
  // Fetching the vehicle distance data from the backend
  useEffect(() => {
    const fetchDistances = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/vehicle/vehicles/distance");
        setDistances(response.data);
      } catch (error) {
        console.error("Error fetching distances", error);
      }
    };

    fetchDistances();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: distances.map((d) => `Vehicle ${d.vehicleId}`),  // Labels for the chart
    datasets: [
      {
        label: "Distance Covered (km)",
        data: distances.map((d) => d.distance),  // Distance data
        backgroundColor: darkMode ? "rgba(54, 162, 235, 0.7)" : "rgba(54, 162, 235, 0.5)", // Dark mode support
        borderColor: darkMode ? "rgba(54, 162, 235, 1)" : "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options with conditional styles based on dark mode
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Vehicle Distance Chart",
        font: {
          size: 18,
        },
        color: darkMode ? "#fff" : "#000", // Title text color
      },
      legend: {
        labels: {
          color: darkMode ? "#fff" : "#000", // Legend color
        },
      },
      tooltip: {
        backgroundColor: darkMode ? "#333" : "#fff", // Tooltip background
        titleColor: darkMode ? "#fff" : "#000", // Tooltip title color
        bodyColor: darkMode ? "#fff" : "#000", // Tooltip body color
      },
    },
  };

  if (distances.length === 0) {
    return <p>No data available for vehicle distances.</p>;
  }

  return (
    <div className={`vehicle-distance-container ${darkMode ? "dark-mode" : ""}`}>
      <h3 className="vehicle-distance-title">Distance Covered by Each Vehicle</h3>
      <div className="vehicle-distance-chart">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default VehicleDistanceChart;
