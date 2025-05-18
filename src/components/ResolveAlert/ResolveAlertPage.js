import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ResolveAlertForm from './ResolveAlertForm';
import styles from './ResolveAlertPage.module.css';

function ResolveAlertPage({ darkMode }) {
  const { alertId } = useParams();
  const [alert, setAlert] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/diagnostics/${alertId}`);
        const data = await res.json();
        setAlert(data);

        if (data.vehicleId) {
          const vehicleRes = await fetch(`http://localhost:3000/api/vehicle/single/${data.vehicleId}`);
          const vehicleData = await vehicleRes.json();
          setVehicle(vehicleData);
        }
      } catch (err) {
        console.error('Error fetching alert:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlert();
  }, [alertId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!alert) return <div className={styles.error}>Alert not found</div>;

  return (
    <div className={`${styles.pageContainer} ${darkMode ? styles.dark : ''}`}>
      <h2 className={styles.title}>Resolve Alert</h2>
      
      <div className={styles.alertDetails}>
        <p><strong>Type:</strong> {alert.alertType}</p>
        <p><strong>Severity:</strong> {alert.severity}</p>
        <p><strong>Message:</strong> {alert.message}</p>
        
        {vehicle && (
          <div className={styles.vehicleInfo}>
            <h3>Vehicle Details</h3>
            <p><strong>Make:</strong> {vehicle.make}</p>
            <p><strong>Model:</strong> {vehicle.model}</p>
            <p><strong>Year:</strong> {vehicle.year}</p>
            <p><strong>VIN:</strong> {vehicle.vin}</p>
            <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
          </div>
        )}
      </div>

      <ResolveAlertForm alertId={alertId} darkMode={darkMode} />
    </div>
  );
}

export default ResolveAlertPage;
