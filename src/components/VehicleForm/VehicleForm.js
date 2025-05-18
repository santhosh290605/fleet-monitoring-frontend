import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import styles from './VehicleForm.module.css';

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

const VehicleForm = ({ onVehicleAdded, darkMode }) => {
  const [formData, setFormData] = useState({
    vehicleId: '',
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
    status: 'active',
    fuelType: '',
    category: '',
    assignedDriver: '',
    deviceId: '',
    unexpectedFailures: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle ID is required';
    if (!formData.make) newErrors.make = 'Make is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    else if (!/^\d{4}$/.test(formData.year)) newErrors.year = 'Year must be 4 digits';
    if (!formData.licensePlate) newErrors.licensePlate = 'License plate is required';
    if (!formData.vin) newErrors.vin = 'VIN is required';
    else if (formData.vin.length !== 17) newErrors.vin = 'VIN must be 17 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Request Data:', formData);

      const response = await axios.post('http://localhost:3000/api/vehicle/add', formData);
      const vehicle = response.data;

      console.log("vehicle data",vehicle.vehicle,vehicle.telemetry,vehicle.maintenance);
  

      // Step 2: Generate vehicle path from random key locations in Chennai
      const pathRes = await axios.post(`http://localhost:3000/api/vehicle-path/generate/${vehicle.vehicle._id}`);
      console.log('Path Generation Response:', pathRes.data);

      // Step 3: Notify user + reset form
      if (onVehicleAdded) onVehicleAdded(vehicle);
      alert('✅ Vehicle added and path generated!');
      setFormData({
        vehicleId: '',
        make: '',
        model: '',
        year: '',
        licensePlate: '',
        vin: '',
        status: 'active',
        fuelType: '',
        category: '',
        assignedDriver: '',
        deviceId: '',
        unexpectedFailures: 0,
      });
      setErrors({});
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('❌ Failed to add vehicle or generate path.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    { id: 'vehicleId', label: 'Vehicle ID*' },
    { id: 'make', label: 'Make*' },
    { id: 'model', label: 'Model*' },
    { id: 'year', label: 'Year*' },
    { id: 'licensePlate', label: 'License Plate*' },
    { id: 'vin', label: 'VIN*' },
    { id: 'assignedDriver', label: 'Assigned Driver' },
    { id: 'deviceId', label: 'IoT Device ID' },
  ];

  return (
    <div className={`${styles.formContainer} ${darkMode ? styles.dark : styles.light}`}>
      <h2 className={styles.formTitle}>🚗 Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {inputFields.map((field, index) => (
          <motion.div key={field.id} custom={index} variants={inputVariants} initial="hidden" animate="visible">
            <label htmlFor={field.id} className={styles.inputLabel}>{field.label}</label>
            <input
              id={field.id}
              name={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              className={`${styles.inputField} ${errors[field.id] ? styles.inputError : ''} ${darkMode ? styles.inputDark : styles.inputLight}`}
              placeholder={field.label.replace('*', '')}
            />
            {errors[field.id] && <p className={styles.errorText}>{errors[field.id]}</p>}
          </motion.div>
        ))}

        <div className={styles.dropdownGroup}>
          <div>
            <label htmlFor="status" className={styles.inputLabel}>Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className={darkMode ? styles.selectDark : styles.selectLight}
            >
              <option value="active">Active</option>
              <option value="maintenance">In Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label htmlFor="fuelType" className={styles.inputLabel}>Fuel Type</label>
            <select
              name="fuelType"
              id="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className={darkMode ? styles.selectDark : styles.selectLight}
            >
              <option value="">Select</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="cng">CNG</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className={styles.inputLabel}>Category</label>
            <select
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              className={darkMode ? styles.selectDark : styles.selectLight}
            >
              <option value="">Select</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="bus">Bus</option>
            </select>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
            {isSubmitting && <Loader2 className={styles.spinner} />}
            {isSubmitting ? 'Adding...' : 'Add Vehicle'}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                vehicleId: '',
                make: '',
                model: '',
                year: '',
                licensePlate: '',
                vin: '',
                status: 'active',
                fuelType: '',
                category: '',
                assignedDriver: '',
                deviceId: '',
                unexpectedFailures: 0,
              });
              setErrors({});
            }}
            className={styles.clearButton}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
