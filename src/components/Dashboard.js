import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TopCard from "./TopCard";
import "./DashboardStyles.css";
import StrategyInsightsSection from "../components/StrategyInsights/StrategyInsightsSection";
import TopRiskVehicles from "../components/TopRiskVehicles/TopRiskVehicles";
import AlertButton from "./AlertSideBar/AlertButton";
import AlertSidebar from "./AlertSideBar/AlertSideBar";
import RideBookingForm from "./RideBookingForm/RideBookingForm";
import VehicleDistanceChart from "./VehicleDistanceChart/VehicleDistanceChart";

const Dashboard = ({ darkMode }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diagnosticStatus, setDiagnosticStatus] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [isRideFormOpen, setRideFormOpen] = useState(false); // New state for ride booking sidebar

  // Fetch Top Card Data
  useEffect(() => {
    const fetchTopCards = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/dashboard/top-cards");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch top card data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCards();
  }, []);

  // Fetch Alert Count every 15 seconds
  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/diagnostics/active/count");
        setAlertCount(res.data.count || 0);
      } catch (err) {
        console.error("Failed to fetch alert count:", err);
        setAlertCount(0);
      }
    };

    fetchAlertCount();
    const interval = setInterval(fetchAlertCount, 15000);
    return () => clearInterval(interval);
  }, []);

  // Run Diagnostics
  const handleRunDiagnostics = async () => {
    setDiagnosticStatus("Running...");
    try {
      const res = await axios.get("http://localhost:3000/api/diagnostics/run");
      setDiagnosticStatus(`✅ Diagnostics completed: ${res.data.totalAlerts} alerts generated.`);
    } catch (err) {
      console.error("Diagnostics failed:", err);
      setDiagnosticStatus("❌ Diagnostics failed. Check console.");
    }
    setTimeout(() => setDiagnosticStatus(null), 5000);
  };

  // Toggle Ride Booking Form Sidebar visibility
  const handleToggleRideForm = () => {
    setRideFormOpen((prev) => !prev);
  };

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : ""}`}>
      <div className="dashboard-wrapper">
        {/* 🚨 Alert Button & Sidebar */}
        <div className="alert-floating-button">
          <AlertButton onClick={() => setSidebarOpen((prev) => !prev)} alertCount={alertCount} />
        </div>
        <AlertSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 🧠 Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Fleet Monitoring Dashboard</h1>
            <p className="dashboard-subtitle">Real-time metrics on your vehicle fleet</p>
          </div>
          <div className="dashboard-controls">
            <Link to="/vehicles" className="dashboard-link">
              View Vehicles
            </Link>
            <button className="diagnostics-button" onClick={handleRunDiagnostics}>
              🧪 Run Diagnostics
            </button>
            <button
              className="ride-booking-toggle-button"
              onClick={handleToggleRideForm}
            >
              {isRideFormOpen ? "Close Ride Booking" : "Open Ride Booking"}
            </button>
          </div>
        </div>

        {/* 🧪 Diagnostics Status */}
        {diagnosticStatus && (
          <div className="diagnostics-status">{diagnosticStatus}</div>
        )}

        {/* 📊 Top Cards */}
        {loading || !data ? (
          <div className="dashboard-loader">Loading...</div>
        ) : (
          <>
            <div className="top-cards-grid">
              <TopCard label="Total Vehicles" value={data.totalVehicles ?? 0} theme="neutral" icon="🚗" />
              <TopCard label="Active Vehicles" value={data.activeVehicles ?? 0} theme="success" icon="✅" />
              <TopCard label="In Maintenance" value={data.maintenanceVehicles ?? 0} theme="warning" icon="🛠️" />
              <TopCard label="Inactive Vehicles" value={data.inactiveVehicles ?? 0} theme="muted" icon="⛔" />
              <TopCard label="Unexpected Failures" value={data.vehiclesWithFailures ?? 0} theme="danger" icon="⚠️" />
              <TopCard label="Average Engine Health" value={`${data.averageEngineHealth ?? 0}%`} theme="info" icon="🧠" />
              <TopCard label="High Risk Vehicles" value={data.criticalCount ?? 0} theme="danger" icon="🔥" />
            </div>

            {/* 🚗 Vehicle Distance Chart Integration */}
            <div className="vehicle-distance-chart-container">
              <VehicleDistanceChart darkMode={darkMode} />
            </div>
          </>
        )}

        {/* 🔍 Risk Insights & Strategy Section */}
        <TopRiskVehicles darkMode={darkMode} />
        <StrategyInsightsSection darkMode={darkMode} />

        {/* 🚗 Ride Booking Sidebar */}
        <div
          className={`ride-booking-sidebar ${isRideFormOpen ? "open" : ""}`}
        >
          <button
            className="ride-booking-close-button"
            onClick={handleToggleRideForm}
          >
            Close
          </button>
          <RideBookingForm darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
