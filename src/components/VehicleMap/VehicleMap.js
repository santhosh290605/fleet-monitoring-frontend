import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './VehicleMap.module.css';
import Legend from './Legend';

// Set default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Status-specific custom icons
const statusIcons = {
  active: new L.Icon({
    iconUrl: require('./green-car.png'),
    iconSize: [40, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    shadowSize: [41, 41],
  }),
  maintenance: new L.Icon({
    iconUrl: require('./yellow-car.png'),
    iconSize: [34, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    shadowSize: [41, 41],
  }),
  inactive: new L.Icon({
    iconUrl: require('./red-car.png'),
    iconSize: [35, 30],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    shadowSize: [41, 41],
  }),
};

// Unique color based on vehicle ID
const getColorForVehicle = (vehicleId) => {
  const hash = vehicleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `hsl(${hash % 360}, 70%, 50%)`;
};

// Popup handler component
const PathPopupHandler = ({ vehicleId, start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end || !map) return;

    // Start Popup
    const startPopup = L.popup({
      autoClose: false,
      closeOnClick: false,
      className: styles.pathPopup,
    })
      .setLatLng(start)
      .setContent(`
        <div class="${styles.pathPopup}">
          <h4>Start Location</h4>
          <strong>Vehicle:</strong> ${vehicleId}<br/>
          <strong>Coords:</strong> ${start[0].toFixed(4)}, ${start[1].toFixed(4)}
        </div>
      `)
      .addTo(map);

    // End Popup
    const endPopup = L.popup({
      autoClose: false,
      closeOnClick: false,
      className: styles.pathPopup,
    })
      .setLatLng(end)
      .setContent(`
        <div class="${styles.pathPopup}">
          <h4>End Location</h4>
          <strong>Vehicle:</strong> ${vehicleId}<br/>
          <strong>Coords:</strong> ${end[0].toFixed(4)}, ${end[1].toFixed(4)}
        </div>
      `)
      .addTo(map);

    return () => {
      map.removeLayer(startPopup);
      map.removeLayer(endPopup);
    };
  }, [vehicleId, start, end, map]);

  return null;
};

function VehicleMap({ darkMode }) {
  const [vehicles, setVehicles] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [vehiclePaths, setVehiclePaths] = useState({});
  const [clickedPath, setClickedPath] = useState(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/telemetry/latest');
        const data = await res.json();
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Error fetching telemetry:', err);
        setVehicles([]);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPaths = async () => {
      const activeIds = vehicles
        .filter((v) => v?.vehicle?.status?.toLowerCase() === 'active')
        .map((v) => v.vehicleId);

      const paths = {};

      await Promise.all(
        activeIds.map(async (id) => {
          try {
            const res = await fetch(`http://localhost:3000/api/vehicle-path/${id}`);
            const data = await res.json();
            if (Array.isArray(data?.path)) {
              paths[id] = data.path.map(p => [p.latitude, p.longitude]);
            }
          } catch {
            console.warn(`⚠️ Could not fetch path for ${id}`);
          }
        })
      );

      setVehiclePaths(paths);
    };

    if (vehicles.length > 0) fetchPaths();
  }, [vehicles]);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const filteredVehicles = vehicles.filter((v) =>
    selectedStatuses.length === 0 ||
    selectedStatuses.includes(v?.vehicle?.status?.toLowerCase())
  );

  return (
    <div className={`${styles.mapPage} ${darkMode ? styles.darkMode : ''}`}>
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={12}
        scrollWheelZoom={true}
        className={styles.mapContainer}
        style={{ height: '100vh' }}
      >
        <Legend
          onStatusClick={toggleStatus}
          selectedStatuses={selectedStatuses}
        />

        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={
            darkMode
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        {filteredVehicles.map((v) => {
          const pos = [
            v?.location?.latitude ?? 0,
            v?.location?.longitude ?? 0,
          ];
          const status = v?.vehicle?.status?.toLowerCase() ?? 'inactive';
          const icon = statusIcons[status] || statusIcons.inactive;

          return (
            <Marker
              key={`${v.vehicleId}-${v.timestamp}`}
              position={pos}
              icon={icon}
              riseOnHover
            >
              <Popup className={styles.popupContent}>
                <div>
                  <strong>{v?.vehicle?.make ?? 'Unknown'} {v?.vehicle?.model ?? ''}</strong><br />
                  Speed: {v?.speed?.toFixed(1) ?? 'N/A'} km/h<br />
                  Fuel: {v?.fuelLevel?.toFixed(1) ?? 'N/A'}%<br />
                  Odometer: {v?.odometer?.toFixed(1) ?? 'N/A'} km<br />
                  Engine: {v?.engineStatus ?? 'N/A'}<br />
                  Status: {v?.vehicle?.status ?? 'Unknown'}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {Object.entries(vehiclePaths).map(([vehicleId, pathCoords]) => (
          <React.Fragment key={`path-${vehicleId}`}>
            <Polyline
              positions={pathCoords}
              color={getColorForVehicle(vehicleId)}
              dashArray="6, 10"
              weight={3}
              opacity={0.7}
              eventHandlers={{
                click: () =>
                  setClickedPath({ vehicleId, start: pathCoords[0], end: pathCoords[pathCoords.length - 1] }),
              }}
            />
          </React.Fragment>
        ))}

        {clickedPath && (
          <PathPopupHandler
            vehicleId={clickedPath.vehicleId}
            start={clickedPath.start}
            end={clickedPath.end}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default VehicleMap;
