import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './TopRiskVehicles.module.css';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const riskLevelMap = {
  0: { label: 'Low', className: styles.lowRisk },
  1: { label: 'Medium', className: styles.mediumRisk },
  2: { label: 'High', className: styles.highRisk }
};

const TopRiskVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/strategy/top-risk')
      .then(res => {
        const highRiskVehicles = res.data.filter(v => v.riskLevel === 2);
        const topThree = highRiskVehicles.slice(0, 3); // Only top 3
        setVehicles(topThree);
      })
      .catch(err => console.error('Error fetching top-risk vehicles:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = () => setExpanded(prev => !prev);

  return (
    <div className={`${styles.container} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.header} onClick={toggleExpand}>
        <h2 className={styles.title}>🚨 Top Vehicles at Risk</h2>
        {expanded ? <ChevronUp className={styles.chevron} /> : <ChevronDown className={styles.chevron} />}
      </div>

      {expanded && (
        <>
          {loading ? (
            <p className={styles.subtext}>Loading data...</p>
          ) : vehicles.length === 0 ? (
            <p className={styles.subtext}>No high-risk vehicles found.</p>
          ) : (
            <ul className={styles.vehicleList}>
              {vehicles.map((v) => {
                const risk = riskLevelMap[v.riskLevel] || {};
                return (
                  <li
                    key={v.vehicleId}
                    className={`${styles.vehicleItem} ${risk.className}`}
                    onClick={() => navigate(`/vehicles/${v.vehicleId}/strategy`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.vehicleInfo}>
                      <AlertTriangle className={styles.icon} />
                      <div>
                        <p className={styles.vehicleId}>
                          Vehicle ID: <strong>{v.vehicleId}</strong>
                        </p>
                        <p className={styles.details}>
                          Risk: {risk.label} • Strategy: {['Delayed', 'Immediate', 'Scheduled'][v.recommendedStrategy]}
                        </p>
                      </div>
                    </div>
                    <div className={styles.stats}>
                      <p>Cost: ${v.cost?.toFixed(2) ?? 'N/A'}</p>
                      <p>Fuel Efficiency: {v.fuel?.toFixed(2) ?? 'N/A'} km/l</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default TopRiskVehicles;
