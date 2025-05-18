import React, { useState } from 'react';
import { fetchRideDetails } from './rideBookingAPI';
import styles from './RideBookingForm.module.css';

const predefinedLocations = {
  'Chennai Central': [13.0878, 80.2785],
  'Tidel Park': [13.0046, 80.2437],
  'Vandalur Zoo': [12.9171, 80.0385],
  'Anna Nagar Tower': [13.0833, 80.2264],
  'Mount Road': [13.0376, 80.2512],
};

const RideBookingForm = ({ darkMode }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callDiagnosticsAPI = async (pickupCoords, dropoffCoords, pickupName, dropoffName) => {
    try {
      console.log("here", pickupCoords, dropoffCoords, pickupName, dropoffName);
  
      // Adjust the request body to match backend expectations
      const response = await fetch('http://localhost:3000/api/ride-booking/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          start: pickupCoords, // sending pickupCoords as "start"
          end: dropoffCoords,  // sending dropoffCoords as "end"
          fromPlace: {
            name: pickupName,
            city: 'Chennai',
            latitude: pickupCoords[0],
            longitude: pickupCoords[1]
          },
          toPlace: {
            name: dropoffName,
            city: 'Chennai',
            latitude: dropoffCoords[0],
            longitude: dropoffCoords[1]
          }
        })
      });
  
      if (!response.ok) throw new Error(`Diagnostics API call failed with status: ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error("Error during Diagnostics API call:", err);
      throw err; // Rethrow the error to be caught in the parent function
    }
  };
  
  

  const handleSubmit = async () => {
    const pickupCoords = predefinedLocations[pickup];
    const dropoffCoords = predefinedLocations[dropoff];

    if (!pickupCoords || !dropoffCoords) {
      setError('Please select valid pickup and dropoff locations.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [firebaseResult, diagnosticsResult] = await Promise.all([
        fetchRideDetails(pickupCoords, dropoffCoords, passengers),
        callDiagnosticsAPI(pickupCoords, dropoffCoords, pickup, dropoff)
      ]);

      setResult({
        predicted_fare: firebaseResult.predicted_fare,
        firebase_vehicle: firebaseResult.assigned_vehicle,
        mongo_vehicle: diagnosticsResult.vehicle,
        mongo_path_distance: diagnosticsResult.path?.totalDistance
      });
    } catch (err) {
      console.error(err);
      setError('Error processing ride booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.rideFormContainer} ${darkMode ? styles.darkMode : ''}`}>
      <h2 className={styles.title}>Book a Ride</h2>

      <label htmlFor="pickup" className={styles.label}>Pickup Location:</label>
      <select
        id="pickup"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        className={`${styles.input} ${darkMode ? styles.darkModeInput : ''}`}
      >
        <option value="">Select Pickup Location</option>
        {Object.keys(predefinedLocations).map((location) => (
          <option key={location} value={location}>{location}</option>
        ))}
      </select>

      <label htmlFor="dropoff" className={styles.label}>Dropoff Location:</label>
      <select
        id="dropoff"
        value={dropoff}
        onChange={(e) => setDropoff(e.target.value)}
        className={`${styles.input} ${darkMode ? styles.darkModeInput : ''}`}
      >
        <option value="">Select Dropoff Location</option>
        {Object.keys(predefinedLocations).map((location) => (
          <option key={location} value={location}>{location}</option>
        ))}
      </select>

      <label htmlFor="passengers" className={styles.label}>Passengers:</label>
      <input
        type="number"
        id="passengers"
        min="1"
        value={passengers}
        onChange={(e) => setPassengers(Number(e.target.value))}
        className={`${styles.input} ${darkMode ? styles.darkModeInput : ''}`}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={styles.button}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      <div className={styles.resultContainer}>
        {loading && <p>Loading...</p>}
        {error && <p className={styles.errorText}>{error}</p>}
        {result && !loading && (
          <>
            <p><strong>Predicted Fare:</strong> ₹{result.predicted_fare}</p>
            <p><strong>Firebase Vehicle:</strong> {result.firebase_vehicle?.vehicle_id || 'N/A'}</p>
            <p><strong>Mongo Vehicle:</strong> {result.mongo_vehicle?.vehicleId || result.mongo_vehicle?._id || 'N/A'}</p>
            <p><strong>Path Distance:</strong> {result.mongo_path_distance?.toFixed(2)} km</p>
          </>
        )}
      </div>
    </div>
  );
};

export default RideBookingForm;
