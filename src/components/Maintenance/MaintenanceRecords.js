import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MaintenanceRecords.css';

const MaintenanceRecords = ({ darkMode }) => {
  const { id } = useParams(); // Get the vehicle ID from the URL
  const [records, setRecords] = useState([]);

  const fetchMaintenanceRecords = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/maintenance/${id}`);
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
  }, [id]);

  return (
    <div className={`maintenance-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="maintenance-header">
        <h1 className="maintenance-title">Maintenance Records</h1>
        <p className="maintenance-subtitle">Here you can view all maintenance details for the vehicle.</p>
      </div>

      {records.length > 0 ? (
        <div className="maintenance-table-container">
          <table className="maintenance-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Cost ($)</th>
                <th>Date</th>
                <th>Engine Health</th>
                <th>Oil Quality</th>
                <th>Tire Wear (%)</th>
                <th>Maintenance Quality Score</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id}>
                  <td>{record.type}</td>
                  <td>{record.description}</td>
                  <td>{record.cost}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.engineHealth}%</td>
                  <td>{record.oilQuality}%</td>
                  <td>{record.tireWear}%</td>
                  <td>{record.maintenanceQualityScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-records-message">No maintenance records found for this vehicle.</p>
      )}
    </div>
  );
};

export default MaintenanceRecords;
