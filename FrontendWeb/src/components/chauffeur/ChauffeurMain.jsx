import { useState, useEffect } from 'react';
import Dashboard from "./Dasboard";
import Trajets from './Trajets';
import HistoriqueTrajet from './HistoriqueTrajet';
import Planning from './Planning';

function ChauffeurMain({ activeTab = 'dashboard' }) {
  // Fonction qui retourne le bon composant selon l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <Dashboard />
            <LocationCard/>
          </>
        );
      case 'trips':
        return <Trajets/>;
      case 'history':
        return <HistoriqueTrajet/>;
      case 'revenues':
        return <div className="p-6">Revenus à venir...</div>;
      case 'planning':
        return <Planning/>;
      case 'scheduled':
        return <div className="p-6">Calendrier des demandes à venir...</div>;
      case 'settings':
        return <div className="p-6">Paramètres à venir...</div>;
      default:
        return (
          <>
            <Dashboard />
            <LocationCard />
            <Trajets />
          </>
        );
    }
  };

  return (
    <div className="pt-16 md:ml-80 min-h-screen dark:bg-gray-800">
      <div className="p-4 md:p-6">
        {renderContent()}
      </div>
    </div>
  );
}

// Composant de localisation en temps réel
function LocationCard() {
  const [userLocation, setUserLocation] = useState({
    lat: 9.6412, // Conakry, Guinée par défaut
    lng: -13.5784,
    address: "Conakry, Guinée"
  });
  const [isLoading, setIsLoading] = useState(true);

  // Obtenir la position de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({
            lat: latitude,
            lng: longitude,
            address: "Votre position actuelle"
          });
          setIsLoading(false);
        },
        (error) => {
          console.log("Erreur de géolocalisation:", error);
          // Garder la position par défaut (Conakry)
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Localisation en cours...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* En-tête */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-500/5 to-green-500/5">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Votre position en Guinée</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {userLocation.address} | {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°
          </p>
        </div>

        {/* Carte Google Maps */}
        <div className="relative h-96">
          {/* Solution 1: Iframe Google Maps (simple) */}
          <iframe
            title="Votre position"
            src={`https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}&hl=fr&z=14&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
          
          {/* Indicateur de position */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-2xl"></div>
              <div className="absolute inset-0 w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChauffeurMain;