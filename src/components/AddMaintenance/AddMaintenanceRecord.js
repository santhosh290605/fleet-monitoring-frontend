import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddMaintenanceRecord.css';

const AddMaintenanceRecord = ({ darkMode }) => {
  const { id } = useParams(); // Vehicle ID from URL
  const navigate = useNavigate();

  const [record, setRecord] = useState({
    type: '',
    description: '',
    cost: '',
    maintenanceInterval: '',
    engineHealth: '',
    oilQuality: '',
    tireWear: '',
    maintenanceQualityScore: ''
  });

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/api/maintenance/${id}/add`, record);
      alert('✅ Record added successfully!');
      navigate(`/vehicles/${id}/maintenance`);
    } catch (error) {
      console.error('❌ Error adding maintenance record:', error);
    }
  };

  return (
    <div className={`add-maintenance-container ${darkMode ? 'dark' : ''} max-w-xl mx-auto p-6 rounded-xl shadow-lg`}>
      <h2 className="maintenance-heading text-2xl font-extrabold mb-6 text-center">Add Maintenance Record</h2>
      <form onSubmit={handleSubmit} className="maintenance-form grid gap-6">
        <div className="input-group">
          <label className="label-text">Type:</label>
          <input type="text" name="type" value={record.type} onChange={handleChange} required className="input-field" />
        </div>

        <div className="input-group">
          <label className="label-text">Description:</label>
          <textarea name="description" value={record.description} onChange={handleChange} required className="input-field" />
        </div>

        <div className="input-group">
          <label className="label-text">Cost:</label>
          <input type="number" name="cost" value={record.cost} onChange={handleChange} required className="input-field" />
        </div>

        {/* Fleet Time Machine Fields */}
        <div className="input-group">
          <label className="label-text">Maintenance Interval (days):</label>
          <input type="number" name="maintenanceInterval" value={record.maintenanceInterval} onChange={handleChange} required className="input-field" />
        </div>

        <div className="input-group">
          <label className="label-text">Engine Health (0–100):</label>
          <input type="number" name="engineHealth" value={record.engineHealth} onChange={handleChange} required className="input-field" />
        </div>

        <div className="input-group">
          <label className="label-text">Oil Quality (0–100):</label>
          <input type="number" name="oilQuality" value={record.oilQuality} onChange={handleChange} required className="input-field" />
        </div>

        <div className="input-group">
          <label className="label-text">Tire Wear (%):</label>
          <input type="number" name="tireWear" value={record.tireWear} onChange={handleChange} required className="input-field" />
        </div>

        <div className="input-group">
          <label className="label-text">Maintenance Quality Score (0–100):</label>
          <input type="number" name="maintenanceQualityScore" value={record.maintenanceQualityScore} onChange={handleChange} required className="input-field" />
        </div>

        <button type="submit" className="submit-btn">
          Add Record
        </button>
      </form>
    </div>
  );
};

export default AddMaintenanceRecord;
