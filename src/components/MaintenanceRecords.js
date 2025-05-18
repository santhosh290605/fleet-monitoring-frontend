import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MaintenanceRecords = () => {
  const { id } = useParams(); // This will get the vehicle ID from the URL
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
    <div>
      <h2>Maintenance Records</h2>
      {records.length > 0 ? (
        <table className="maintenance-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Cost ($)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{record.type}</td>
                <td>{record.description}</td>
                <td>{record.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No records found for this vehicle.</p>
      )}
    </div>
  );
};

export default MaintenanceRecords;
