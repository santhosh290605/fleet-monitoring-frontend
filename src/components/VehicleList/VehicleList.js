import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './VehicleList.css';

const VehicleList = ({ darkMode }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/vehicle');
      setVehicles(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    if (filters.status && vehicle.status !== filters.status) return false;
    if (filters.category && vehicle.category !== filters.category) return false;
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      return (
        vehicle.vehicleId.toLowerCase().includes(term) ||
        vehicle.make.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term) ||
        vehicle.licensePlate.toLowerCase().includes(term) ||
        (vehicle.assignedDriver && vehicle.assignedDriver.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`http://localhost:3000/api/vehicle/${id}`);
        setVehicles((prevVehicles) =>
          prevVehicles.filter(vehicle => vehicle.vehicleId !== id)
        );
        alert('Vehicle deleted successfully');
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        alert('Failed to delete vehicle. Please try again.');
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'vehicle-status-active';
      case 'maintenance':
        return 'vehicle-status-maintenance';
      case 'inactive':
        return 'vehicle-status-inactive';
      default:
        return '';
    }
  };

  return (
    <div className={`vehicle-list-container ${darkMode ? 'dark' : ''}`}>
      <div className="vehicle-list-header">
        <h2>Fleet Vehicles</h2>
        <div className="vehicle-list-header-actions">
          <Link to="/vehicles/add" className="vehicle-btn-add">Add New Vehicle</Link>
        </div>
      </div>

      <div className="vehicle-filters">
        <input
          type="text"
          name="searchTerm"
          placeholder="Search vehicles..."
          value={filters.searchTerm}
          onChange={handleFilterChange}
        />

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="maintenance">In Maintenance</option>
          <option value="inactive">Inactive</option>
        </select>

        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="sedan">Sedan</option>
          <option value="suv">SUV</option>
          <option value="truck">Truck</option>
          <option value="van">Van</option>
          <option value="bus">Bus</option>
        </select>

        <button onClick={() => setFilters({ status: '', category: '', searchTerm: '' })}>
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="vehicle-loading">Loading vehicles...</div>
      ) : error ? (
        <div className="vehicle-error-message">{error}</div>
      ) : filteredVehicles.length === 0 ? (
        <div className="vehicle-no-results">
          No vehicles found. Please adjust your filters or add new vehicles.
        </div>
      ) : (
        <div className="vehicle-list-grid">
          {filteredVehicles.map(vehicle => (
            <div key={vehicle._id} className="vehicle-list-card">
              <div className="vehicle-list-card-header">
                <h3>{vehicle.make} {vehicle.model} ({vehicle.year})</h3>
                <span className={`vehicle-status-badge ${getStatusClass(vehicle.status)}`}>
                  {vehicle.status === 'active' ? 'Active' :
                    vehicle.status === 'maintenance' ? 'In Maintenance' :
                      vehicle.status === 'inactive' ? 'Inactive' : vehicle.status}
                </span>
              </div>
              <div className="vehicle-list-card-details">
                <p><strong>ID:</strong> {vehicle.vehicleId}</p>
                <p><strong>License:</strong> {vehicle.licensePlate}</p>
                <p><strong>VIN:</strong> {vehicle.vin}</p>
                {vehicle.assignedDriver && <p><strong>Driver:</strong> {vehicle.assignedDriver}</p>}
                {vehicle.fuelType && <p><strong>Fuel:</strong> {vehicle.fuelType}</p>}
                {vehicle.deviceId && <p><strong>Device ID:</strong> {vehicle.deviceId}</p>}
              </div>
              <div className="vehicle-list-card-actions">
                <Link to={`/vehicles/${vehicle._id}`} className="vehicle-btn-view">View Details</Link>
                <Link to={`/vehicles/${vehicle._id}/strategy`} className="vehicle-btn-strategy">View Strategy</Link>
                <button onClick={() => handleDelete(vehicle._id)} className="vehicle-btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
