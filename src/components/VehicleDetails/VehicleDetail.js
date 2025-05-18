import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VehicleDetail.css';

const VehicleDetail = ({ darkMode }) => { // Receive darkMode as a prop
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [telemetryData, setTelemetryData] = useState(null);

  useEffect(() => {
    fetchVehicleData();
  }, [id]);

  const fetchVehicleData = async () => {
    try {
      setLoading(true);

      const vehicleResponse = await axios.get(`http://localhost:3000/api/vehicle/single/${id}`);
      setVehicle(vehicleResponse.data);

      const maintenanceResponse = await axios.get(`http://localhost:3000/api/maintenance/${id}`);
      setMaintenanceRecords(maintenanceResponse.data);

      try {
        const telemetryResponse = await axios.get(`http://localhost:3000/api/telemetry/${id}`);
        setTelemetryData(telemetryResponse.data);
      } catch {
        console.log('No telemetry data available');
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      setError('Failed to load vehicle data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to remove this vehicle from the fleet?')) {
      try {
        await axios.delete(`/api/vehicles/${id}`);
        alert('Vehicle deleted successfully');
        navigate('/vehicles');
      } catch (err) {
        console.error('Error deleting vehicle:', err);
        alert('Failed to delete vehicle. Please try again.');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/vehicle/${id}/status`, { status: newStatus });
      setVehicle({ ...vehicle, status: newStatus });
      alert(`Vehicle status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating vehicle status:', err);
      alert('Failed to update vehicle status. Please try again.');
    }
  };

  if (loading) return <div className="loading-spinner">Loading vehicle data...</div>;

  if (error) return (
    <div className="error-container">
      <div className="error-message">{error}</div>
      <Link to="/vehicles" className="btn-back">Back to Vehicle List</Link>
    </div>
  );

  if (!vehicle) return (
    <div className="not-found-container">
      <h2>Vehicle Not Found</h2>
      <p>The requested vehicle could not be found.</p>
      <Link to="/vehicles" className="btn-back">Back to Vehicle List</Link>
    </div>
  );

  return (
    <div className={`vehicle-detail-container ${darkMode ? 'dark-mode' : ''}`}> {/* Apply dark mode class */}
      {/* Header Section */}
      <header className="vehicle-detail-header">
        <div className="vehicle-header-content">
          <h2>{vehicle.make} {vehicle.model} ({vehicle.year})</h2>
          <p className="vehicle-id">ID: {vehicle.vehicleId}</p>
        </div>
        <div className="vehicle-header-actions">
          <Link to={`/vehicles/edit/${id}`} className="btn-edit">Edit</Link>
          <button onClick={handleDelete} className="btn-delete">Delete</button>
        </div>
      </header>

      {/* Status Section */}
      <section className="vehicle-status">
        <div className={`vehicle-status-label vehicle-status-${vehicle.status}`}>
          Current Status: {vehicle.status}
        </div>
        <div className="vehicle-status-buttons">
          {['active', 'maintenance', 'inactive'].map(status => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={vehicle.status === status}
              className={`btn-status vehicle-status-${status}`}
            >
              Set {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Vehicle Information Section */}
      <section className="vehicle-info-section">
        <div className="vehicle-info-card">
          <h3>Vehicle Info</h3>
          <div className="vehicle-info-content">
            <div>
              <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
              <p><strong>VIN:</strong> {vehicle.vin}</p>
              <p><strong>Category:</strong> {vehicle.category || 'Not specified'}</p>
              <p><strong>Fuel Type:</strong> {vehicle.fuelType || 'Not specified'}</p>
            </div>
            <div>
              <p><strong>Driver:</strong> {vehicle.assignedDriver || 'None'}</p>
              <p><strong>IoT Device:</strong> {vehicle.deviceId || 'Not installed'}</p>
              <p><strong>Added:</strong> {new Date(vehicle.createdAt).toLocaleDateString()}</p>
              <p><strong>Updated:</strong> {new Date(vehicle.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Telemetry Section */}
        {telemetryData && (
          <div className="telemetry-info-card">
            <h3>Telemetry</h3>
            <div className="telemetry-content">
              <div>
                <p><strong>Updated:</strong> {new Date(telemetryData[0].timestamp).toLocaleString()}</p>
                <p><strong>Location:</strong> {telemetryData[0].location?.latitude}, {telemetryData[0].location?.longitude}</p>
                <p><strong>Speed:</strong> {telemetryData[0].speed} km/h</p>
                <p><strong>Fuel:</strong> {telemetryData[0].fuelLevel}%</p>
              </div>
              <div>
                <p><strong>Engine:</strong> {telemetryData[0].engineStatus}</p>
                <p><strong>Battery:</strong> {telemetryData[0].batteryVoltage}V</p>
                <p><strong>Odometer:</strong> {telemetryData[0].odometer} km</p>
                <p><strong>Temp:</strong> {telemetryData[0].engineTemp}°C</p>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance History Section */}
        <div className="maintenance-history-card">
          <h3 className="maintenance-history-title">Maintenance History</h3>
          {maintenanceRecords.length === 0 ? (
            <p className="no-maintenance-records">No maintenance records found.</p>
          ) : (
            <div className="maintenance-list">
              {maintenanceRecords.slice(0, 3).map(record => (
                <div key={record._id} className="maintenance-item">
                  <div className="maintenance-field">
                    <strong>Date:</strong> <span>{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="maintenance-field">
                    <strong>Type:</strong> <span>{record.type}</span>
                  </div>
                  <div className="maintenance-field">
                    <strong>Description:</strong> <span>{record.description}</span>
                  </div>
                  <div className="maintenance-field">
                    <strong>Cost:</strong> <span>${record.cost.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="maintenance-footer">
            <Link to={`/vehicles/${id}/maintenance`} className="btn-link">View All Records</Link>
            <Link to={`/vehicles/${id}/maintenance/add`} className="btn-link">Add Record</Link>
          </div>
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="vehicle-footer-actions">
        <Link to="/vehicles" className="btn-back">Back to Vehicle List</Link>
      </footer>
    </div>
  );
};

export default VehicleDetail;

