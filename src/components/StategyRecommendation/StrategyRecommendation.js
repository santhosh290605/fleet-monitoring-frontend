import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import './StrategyRecommendation.css';

const strategyNames = ['Delayed', 'Immediate', 'Scheduled'];

const strategyIcons = [
  <AlertCircle className="strategy-icon strategy-icon-delayed" />,
  <CheckCircle className="strategy-icon strategy-icon-immediate" />,
  <Clock className="strategy-icon strategy-icon-scheduled" />

];

const strategyColors = {
  0: 'strategy-delayed',
  1: 'strategy-immediate',
  2: 'strategy-scheduled'
};


const strategyProsCons = [
  {
    pros: ['Allows flexibility in scheduling', 'May reduce immediate maintenance costs'],
    cons: ['Higher risk of failure', 'Can lead to expensive repairs later']
  },
  {
    pros: ['Improves safety and reliability', 'Prevents unexpected breakdowns'],
    cons: ['Immediate cost and downtime', 'May be unnecessary if no symptoms']
  },
  {
    pros: ['Balances cost and safety', 'Planned maintenance avoids surprises'],
    cons: ['Requires careful scheduling', 'May miss urgent issues']
  }
];

const metricUnits = {
  predicted_maintenance_cost: '$',
  predicted_speed: 'km/h',
  predicted_fuel_efficiency: 'km/l',
  risk_level: ''
};

const riskLevelMap = {
  0: 'Low',
  1: 'Medium',
  2: 'High'
};

const formatKey = (key) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const StrategyRecommendation = ({ darkMode }) => {
  const { vehicleId } = useParams();
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/strategy/latest/${vehicleId}`)
      .then((res) => {
        console.log('✅ Strategy fetched:', res.data);
        setStrategy(res.data);
      })
      .catch((err) => {
        console.error('❌ Error fetching strategy:', err);
        setStrategy(null);
      })
      .finally(() => setLoading(false));
  }, [vehicleId]);

  if (loading)
    return <p className={`strategy-loading ${darkMode ? 'strategy-dark' : ''}`}>Loading strategy...</p>;

  if (!strategy)
    return (
      <p className={`strategy-error ${darkMode ? 'strategy-dark' : ''}`}>
        No recommendation available.
      </p>
    );

  const predictionsExist = strategy?.predictions && typeof strategy.predictions === 'object';

  return (
    <div className={`strategy-container ${darkMode ? 'strategy-dark' : ''}`}>
      <h1 className="strategy-title">Strategy Recommendation For Your Next Maintenance</h1>

      <div
        className={`strategy-card strategy-recommendation ${
          strategyColors[strategy.recommendedStrategy]
        }`}
      >
        <div className="strategy-card-header">
          {strategyIcons[strategy.recommendedStrategy]}
          <h2 className="strategy-card-title">
            Recommended Strategy: {strategyNames[strategy.recommendedStrategy]}
          </h2>
        </div>
        <p className="strategy-description">
          Based on the latest vehicle health and maintenance trends, we recommend{' '}
          <strong>{strategyNames[strategy.recommendedStrategy]}</strong> maintenance. This balances cost,
          safety, and efficiency for the current vehicle condition.
        </p>
        <p className="strategy-timestamp">
          Generated on: {new Date(strategy.generatedAt).toLocaleString()}
        </p>
      </div>

      <div className="strategy-grid">
        {predictionsExist &&
          Object.keys(strategy.predictions).map((strategyIndex, i) => {
            const prediction = strategy.predictions[strategyIndex];

            return (
              <div key={strategyIndex} className="strategy-card strategy-metrics">
                <div className="strategy-card-header">
                  {strategyIcons[i]}
                  <h3 className="strategy-card-title">{strategyNames[i]} Strategy</h3>
                </div>

                {prediction ? (
                  <>
                    <p className="strategy-subtitle">Predicted Metrics:</p>
                    <ul className="strategy-metric-list">
                      {Object.entries(prediction).map(([key, value]) => {
                        const displayName = formatKey(key);
                        const unit = metricUnits[key] ?? '';
                        let displayValue = 'N/A';

                        if (Array.isArray(value)) {
                          value = value.length > 0 ? value[0] : null;
                        }

                        if (key === 'risk_level') {
                          displayValue = riskLevelMap[value] ?? 'Unknown';
                        } else if (typeof value === 'number') {
                          displayValue = `${value.toFixed(2)} ${unit}`;
                        } else if (value !== null && value !== undefined) {
                          displayValue = `${value} ${unit}`;
                        }

                        return (
                          <li key={key}>
                            <strong>{displayName}:</strong> {displayValue}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <p className="strategy-no-data">No prediction data available for this strategy.</p>
                )}

                <div className="strategy-pros-cons">
                  <p className="strategy-pros-label">Pros:</p>
                  <ul className="strategy-pros">
                    {strategyProsCons[i].pros.map((pro, idx) => (
                      <li key={idx}>{pro}</li>
                    ))}
                  </ul>
                  <p className="strategy-cons-label">Cons:</p>
                  <ul className="strategy-cons">
                    {strategyProsCons[i].cons.map((con, idx) => (
                      <li key={idx}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
      </div>

      <div className="strategy-decision-box">
        <h4 className="strategy-decision-title">🧠 Decision Insight</h4>
        <p className="strategy-decision-text">
          Our recommendation engine considers a variety of factors including engine health, tire wear, oil
          quality, last maintenance cost, and time since last service. Each strategy is evaluated for
          predicted performance, cost, fuel efficiency, and risk level to ensure informed decision-making
          tailored to your vehicle's condition.
        </p>
      </div>
    </div>
  );
};

export default StrategyRecommendation;
