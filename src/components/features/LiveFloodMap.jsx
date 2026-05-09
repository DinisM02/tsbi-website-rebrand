import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Leaflet in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to recenter map when location changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function FitRouteBounds({ routePositions }) {
  const map = useMap();

  useEffect(() => {
    if (!routePositions?.length) return;
    map.fitBounds(routePositions, { padding: [40, 40] });
  }, [routePositions, map]);

  return null;
}

function getRiskColor(riverLevel, rainfall) {
  if (riverLevel > 60 || rainfall > 20) return { color: '#ef4444', fillColor: '#fca5a5', label: 'HIGH' };
  if (riverLevel > 40 || rainfall > 10) return { color: '#f59e0b', fillColor: '#fde68a', label: 'MODERATE' };
  return { color: '#22c55e', fillColor: '#bbf7d0', label: 'LOW' };
}

const LiveFloodMap = ({
  userLocation,
  weatherData,
  floodData,
  shelters = [],
  selectedDestination = null,
  onDestinationSelect,
  className = ''
}) => {
  const center = useMemo(
    () => (userLocation ? [userLocation[0], userLocation[1]] : [51.505, -0.09]),
    [userLocation]
  );
  const riverLevel = floodData?.daily?.river_discharge_mean?.[0] ?? 0;
  const rainfall = weatherData?.rain?.['1h'] ?? 0;
  const risk = getRiskColor(riverLevel, rainfall);
  const [routePositions, setRoutePositions] = useState([]);

  const destinationCoords = useMemo(() => {
    if (!selectedDestination?.lat || !selectedDestination?.lon) return null;
    return [selectedDestination.lat, selectedDestination.lon];
  }, [selectedDestination]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!userLocation || !destinationCoords) {
        setRoutePositions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/foot/${userLocation[1]},${userLocation[0]};${destinationCoords[1]},${destinationCoords[0]}?overview=full&geometries=geojson`
        );

        if (!response.ok) {
          throw new Error('Route request failed');
        }

        const data = await response.json();
        const coordinates = data?.routes?.[0]?.geometry?.coordinates ?? [];
        setRoutePositions(coordinates.map(([lon, lat]) => [lat, lon]));
      } catch (error) {
        console.error('Error fetching route:', error);
        setRoutePositions([center, destinationCoords]);
      }
    };

    fetchRoute();
  }, [userLocation, destinationCoords, center]);

  return (
    <div className={`rounded-xl overflow-hidden border-2 border-blue-200 ${className}`} style={{ height: '400px' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} />
        {routePositions.length > 0 && <FitRouteBounds routePositions={routePositions} />}

        {/* User location marker */}
        {userLocation && (
          <Marker position={center} icon={userIcon}>
            <Popup>
              <strong>Your Location</strong><br />
              {center[0].toFixed(4)}°, {center[1].toFixed(4)}°<br />
              {weatherData && <>Temp: {Math.round(weatherData.main.temp)}°C<br /></>}
              Risk: <span style={{ color: risk.color, fontWeight: 'bold' }}>{risk.label}</span>
            </Popup>
          </Marker>
        )}

        {/* Risk zone circle around user */}
        {userLocation && (
          <Circle
            center={center}
            radius={2000}
            pathOptions={{ color: risk.color, fillColor: risk.fillColor, fillOpacity: 0.2 }}
          />
        )}

        {routePositions.length > 0 && (
          <Polyline positions={routePositions} pathOptions={{ color: '#2563eb', weight: 5, opacity: 0.85 }} />
        )}

        {/* Shelter markers */}
        {shelters.map((s, i) => (
          <Marker key={i} position={[s.lat, s.lon]} icon={s.type === 'hospital' ? hospitalIcon : shelterIcon}>
            <Popup>
              <strong>{s.name || (s.type === 'hospital' ? 'Hospital' : 'Shelter')}</strong><br />
              Distance: {s.distance ? `${s.distance.toFixed(1)} km` : 'N/A'}<br />
              <button
                type="button"
                onClick={() => onDestinationSelect?.(s)}
                style={{ color: '#2563eb', fontWeight: 600 }}
              >
                Route here →
              </button>
            </Popup>
          </Marker>
        ))}

        {destinationCoords && selectedDestination && (
          <Marker position={destinationCoords} icon={selectedDestination.type === 'hospital' ? hospitalIcon : shelterIcon}>
            <Popup>
              <strong>{selectedDestination.name || 'Selected destination'}</strong><br />
              {routePositions.length > 0 ? 'Internal route loaded' : 'Loading route...'}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveFloodMap;
