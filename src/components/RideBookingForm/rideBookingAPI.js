// rideBookingAPI.js

export async function fetchRideDetails(pickup, dropoff, passengers) {
    const res = await fetch('http://localhost:5005/predict_fare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pickup, dropoff, passengers }),
    });
  
    if (!res.ok) throw new Error('API call failed');
    return await res.json();
  }
  