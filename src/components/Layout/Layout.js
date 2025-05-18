// components/Layout.js
import React from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children, darkMode, setDarkMode }) => {
  return (
    <div className="app-layout">
      <header className="layout-header">
        <h1 className="logo">Fleet Monitor</h1>
        <nav className="nav-links">
          <Link to="/"><strong>Dashboard</strong></Link>
          <Link to="/vehicles"><strong>Vehicles</strong></Link>
          <Link to="/vehicle-map"><strong>Live Map</strong></Link> {/* ✅ Added link */}
        </nav>
        <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </header>

      <main className="layout-content">{children}</main>
    </div>
  );
};

export default Layout;
