import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/vehicle";

export const fetchVehicleData = async (vehicleId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${vehicleId}`);
        console.log("Fetched data:", response.data); // ✅ Debugging
        return response.data; // Axios already parses JSON
    } catch (error) {
        console.error("Error fetching vehicle data:", error);
        return []; // Return an empty array to prevent null errors
    }
};
