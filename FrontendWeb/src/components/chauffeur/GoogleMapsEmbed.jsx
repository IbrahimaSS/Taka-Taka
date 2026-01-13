import { useState } from 'react';

export default function GoogleMapsEmbed({
  latitude = 4.0511,
  longitude = 9.7679,
  zoom = 14,
  height = '500px',
  width = '100%',
  title = 'Localisation du chauffeur',
  className = '',
  showControls = true,
  address = 'Douala, Cameroun'
}) {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [currentLat, setCurrentLat] = useState(latitude);
  const [currentLng, setCurrentLng] = useState(longitude);

  const mapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!2d${currentLng}!3d${currentLat}!4f13.1!3m3!2s${encodeURIComponent(address)}&z=${currentZoom}`;

  const zoomIn = () => currentZoom < 20 && setCurrentZoom(z => z + 1);
  const zoomOut = () => currentZoom > 1 && setCurrentZoom(z => z - 1);

  const recenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCurrentLat(pos.coords.latitude);
          setCurrentLng(pos.coords.longitude);
        },
        () => alert("Impossible d'obtenir votre position")
      );
    }
  };

  const moveToLocation = (lat, lng) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border shadow-sm ${className}`}>
      <iframe
        title={title}
        src={mapsUrl}
        width={width}
        height={height}
        style={{ border: 0 }}
        loading="lazy"
        className="w-full"
      />

      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button onClick={recenter} className="bg-white p-2 rounded shadow">📍</button>
          <button onClick={zoomIn} className="bg-white p-2 rounded shadow">+</button>
          <button onClick={zoomOut} className="bg-white p-2 rounded shadow">−</button>
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow">
        <button onClick={() => moveToLocation(4.0511, 9.7679)}>Douala</button>
      </div>
    </div>
  );
}

/* ========================= */
/* Version simplifiée JSX */
/* ========================= */

export function SimpleGoogleMapsEmbed({
  latitude = 4.0511,
  longitude = 9.7679,
  height = '400px',
  address = 'Douala, Cameroun'
}) {
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;

  return (
    <div className="rounded-xl overflow-hidden border shadow-sm">
      <iframe
        title="Google Maps"
        src={mapsUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        loading="lazy"
      />
    </div>
  );
}
