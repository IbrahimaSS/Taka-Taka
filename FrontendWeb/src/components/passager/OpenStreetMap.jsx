// src/components/passager/OpenStreetMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, isUser = false }) => {
  const icon = L.divIcon({
    html: `<div class="w-12 h-12 rounded-full ${isUser ? 'bg-green-500' : 'bg-red-500'} border-4 border-white shadow-xl flex items-center justify-center">
             ${isUser ? '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>' : '<svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/></svg>'}
           </div>`,
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
  });

  return <Marker position={position} icon={icon}>
    <Popup>{isUser ? 'Votre position' : 'Destination'}</Popup>
  </Marker>;
};

const DriverMarker = ({ position, driver }) => {
  const icon = L.divIcon({
    html: `<div class="w-10 h-10 rounded-full bg-blue-500 border-3 border-white shadow-lg flex items-center justify-center animate-pulse">
             <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
           </div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return <Marker position={position} icon={icon}>
    <Popup>
      <div className="p-2">
        <p className="font-bold">{driver?.name || 'Chauffeur'}</p>
        <p className="text-sm text-gray-600">{driver?.vehicle || 'En route'}</p>
      </div>
    </Popup>
  </Marker>;
};

const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const OpenStreetMap = ({
  pickup,
  destination,
  pickupPosition,
  destinationPosition,
  driverPosition,
  driver,
  onLocationSelect,
  showRoute = true,
  interactive = true
}) => {
  const [mapCenter, setMapCenter] = useState(pickupPosition || [10.3676, -12.5883]);
  const [zoom, setZoom] = useState(13);

  const route = pickupPosition && destinationPosition
    ? [pickupPosition, destinationPosition]
    : [];

  const handleMapClick = (e) => {
    if (onLocationSelect && interactive) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
      setMapCenter([lat, lng]);
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden h-full">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full rounded-2xl"
        whenCreated={(map) => {
          map.on('click', handleMapClick);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={mapCenter} zoom={zoom} />

        {pickupPosition && (
          <LocationMarker position={pickupPosition} isUser={true} />
        )}

        {destinationPosition && (
          <LocationMarker position={destinationPosition} isUser={false} />
        )}

        {driverPosition && (
          <DriverMarker position={driverPosition} driver={driver} />
        )}

        {showRoute && route.length === 2 && (
          <Polyline
            pathOptions={{ color: '#22c55e', weight: 4, opacity: 0.7 }}
            positions={route}
          />
        )}
      </MapContainer>

      <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/20 dark:border-white/5">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Votre position</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Destination</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Chauffeur</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenStreetMap;