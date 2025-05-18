import React, { useEffect, useState } from "react";
import axios from "axios";

const ScenarioComparison = ({ vehicleId }) => {
    const [predictions, setPredictions] = useState([]);

    const fetchPredictions = async (option) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/vehicle/${vehicleId}/scenario/${option}`);
            return response.data.predictions;
        } catch (error) {
            console.error("Error fetching scenario data:", error);
            return [];
        }
    };

    useEffect(() => {
        const fetchAllScenarios = async () => {
            const immediate = await fetchPredictions("immediate");
            const scheduled = await fetchPredictions("scheduled");
            const delayed = await fetchPredictions("delayed");

            setPredictions([
                { option: "Immediate Maintenance", data: immediate },
                { option: "Scheduled Maintenance", data: scheduled },
                { option: "Delayed Maintenance", data: delayed },
            ]);
        };

        fetchAllScenarios();
    }, [vehicleId]);

    return (
        <div>
            <h3>🔄 Scenario Comparison</h3>
            {predictions.map((scenario, index) => (
                <div key={index} style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
                    <h4>{scenario.option}</h4>
                    {scenario.data.length > 0 ? (
                        <ul>
                            <li><strong>Predicted Speed:</strong> {scenario.data[0].predicted_speed} km/h</li>
                            <li><strong>Fuel Efficiency:</strong> {scenario.data[0].predicted_fuel_efficiency}%</li>
                            <li><strong>Maintenance Cost:</strong> ${scenario.data[0].estimated_maintenance_cost}</li>
                            <li><strong>Risk Level:</strong> {scenario.data[0].risk_level}</li>
                        </ul>
                    ) : (
                        <p>Loading predictions...</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ScenarioComparison;
