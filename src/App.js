import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import VehicleForm from "./components/VehicleForm/VehicleForm";
import VehicleList from "./components/VehicleList/VehicleList";
import VehicleDetail from "./components/VehicleDetails/VehicleDetail";
import MaintenanceRecords from "./components/Maintenance/MaintenanceRecords";
import AddMaintenanceRecord from "./components/AddMaintenance/AddMaintenanceRecord";
import StrategyRecommendation from "./components/StategyRecommendation/StrategyRecommendation";
import ResolveAlertPage from "./components/ResolveAlert/ResolveAlertPage";
import Layout from "./components/Layout/Layout";
import VehicleMap from "./components/VehicleMap/VehicleMap";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={darkMode ? "dark" : ""}>
        <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
          <Routes>
            <Route path="/" element={<Dashboard darkMode={darkMode} />} />
            <Route path="/vehicles" element={<VehicleList darkMode={darkMode} />} />
            <Route path="/vehicles/add" element={<VehicleForm darkMode={darkMode} />} />
            <Route path="/vehicles/:id" element={<VehicleDetail darkMode={darkMode} />} />
            <Route path="/vehicles/:id/maintenance" element={<MaintenanceRecords darkMode={darkMode} />} />
            <Route path="/vehicles/:id/maintenance/add" element={<AddMaintenanceRecord darkMode={darkMode} />} />
            <Route path="/vehicles/:vehicleId/strategy" element={<StrategyRecommendation darkMode={darkMode} />} />
            <Route path="/resolve-alert/:alertId" element={<ResolveAlertPage darkMode={darkMode} />} />
            <Route path="/vehicle-map" element={<VehicleMap darkMode={darkMode} />} /> {/* ✅ New Map Page Route */}
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
