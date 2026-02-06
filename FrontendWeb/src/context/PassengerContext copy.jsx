import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useGeolocation } from '../hooks/useGeolocation';
import { GeolocationService } from '../services/geolocation';

const PassengerContext = createContext();

export const PassengerProvider = ({ children }) => {
  const [passenger, setPassenger] = useState({
    id: 'P001',
    name: 'Baldé Fela',
    email: 'fela.balde@example.com',
    phone: '+224 623 09 07 41',
    rating: 4.8,
    address: 'Mamou, Tambassa',
    avatar: null,
    location: { lat: 10.3676, lng: -12.5883 },
    balance: 100000 // Ajouté pour la gestion du solde
  });

  const [trips, setTrips] = useState([
    {
      id: 1,
      date: "Aujourd'hui, 14:30",
      driver: {
        name: "Mamadou Fela",
        vehicle: "Toyota Corolla",
        rating: 4.2,
        phone: "+224 623 09 02 24"
      },
      departure: "Mamou",
      destination: "Kindia",
      distance: "12.5 km",
      price: "15 000 GNF",
      status: "completed",
      duration: "25 min",
      payment: "Orange Money",
      rating: 4.0,
      notes: "Très bon service, conduite fluide"
    },
    {
      id: 2,
      date: "Hier, 15:30",
      driver: {
        name: "Tarra Mane",
        vehicle: "Toyota Corolla",
        rating: 3.8,
        phone: "+224 655 44 33 22"
      },
      departure: "Labé",
      destination: "Mamou",
      distance: "18.3 km",
      price: "53 000 GNF",
      status: "cancelled",
      duration: "32 min",
      payment: "Espèces",
      cancelReason: "Annulé par le passager",
      rating: 1.0
    },
    {
      id: 3,
      date: "11 mars, 16:20",
      driver: {
        name: "Sekou Bah",
        vehicle: "Honda Civic",
        rating: 4.5,
        phone: "+224 622 11 22 33"
      },
      departure: "Conakry",
      destination: "Matoto",
      distance: "8.7 km",
      price: "12 500 GNF",
      status: "completed",
      duration: "18 min",
      payment: "MTN Money",
      rating: 5.0
    },
    {
      id: 4,
      date: "9 mars, 20:30",
      driver: {
        name: "Boubacar Sow",
        vehicle: "Toyota Yaris",
        rating: 4.0,
        phone: "+224 633 44 55 66"
      },
      departure: "Hamdallaye",
      destination: "Bambeto",
      distance: "9.2 km",
      price: "11 000 GNF",
      status: "cancelled",
      duration: "15 min",
      payment: "Non applicable",
      cancelReason: "Chauffeur non arrivé",
      rating: 2.0
    }
  ]);

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Paiement trajet', amount: -15000, method: 'Mobile Money', status: 'completed', date: '05/12/2025', reference: 'TRX-001' },
    { id: 2, type: 'Recharge', amount: 50000, method: 'Mobile Money', status: 'completed', date: '04/12/2025', reference: 'TRX-002' },
    { id: 3, type: 'Cashback', amount: 500, method: 'Portefeuille', status: 'completed', date: '03/12/2025', reference: 'TRX-003' },
    { id: 4, type: 'Paiement trajet', amount: -53000, method: 'Mobile Money', status: 'completed', date: '02/12/2025', reference: 'TRX-004' },
  ]);

  // États de navigation
  const [currentPage, setCurrentPage] = useState('home');

  // États du trajet en cours
  const [currentTrip, setCurrentTrip] = useState(null);
  const [tripStatus, setTripStatus] = useState(null); // 'idle', 'confirming', 'searching', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [tripProgress, setTripProgress] = useState(0);

  // États de géolocalisation harmonisés
  const {
    location: realLocation,
    permission: geoPermission,
    loading: isGeoLoading,
    refreshLocation: retryLocation
  } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000
  });

  const [userLocation, setUserLocation] = useState({ lat: 10.3676, lng: -12.5883 });
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Synchronisation avec le hook de géolocalisation
  useEffect(() => {
    if (realLocation) {
      setUserLocation(realLocation);
    }
    setHasLocationPermission(geoPermission === 'granted');
    setIsLoadingLocation(isGeoLoading);
  }, [realLocation, geoPermission, isGeoLoading]);

  // Notifications sur le statut de la géolocalisation
  useEffect(() => {
    if (geoPermission === 'denied') {
      toast.error('Veuillez activer la géolocalisation pour une meilleure expérience', { id: 'geo-denied' });
    } else if (geoPermission === 'granted' && realLocation) {
      toast.success('Position actualisée', { id: 'geo-success' });
    }
  }, [geoPermission, realLocation]);

  // États de recherche
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Trajets planifiés
  const [scheduledTrips, setScheduledTrips] = useState([
    {
      id: 1,
      date: '2025-12-15T08:00:00',
      pickup: 'Mamou, Tambassa',
      destination: 'Conakry, Matam',
      vehicleType: 'taxi',
      paymentMethod: 'prepaid',
      price: 15000,
      status: 'scheduled',
      driver: null
    }
  ]);

  // Nettoyage de l'ancienne logique de permission manuelle
  const requestLocationPermission = useCallback(() => {
    retryLocation();
  }, [retryLocation]);

  // ===================== 1.2 DÉFINIR LE TRAJET =====================
  const defineTrip = (tripData) => {
    // TODO API (trips):
    // Remplacer le state local par POST API_ROUTES.trips.create
    // Voir: src/services/tripService.js
    setCurrentTrip({
      id: Date.now(),
      ...tripData,
      status: 'confirming',
      createdAt: new Date().toISOString()
    });
    setTripStatus('confirming');
  };

  // ===================== MODAL DE CONFIRMATION =====================
  const confirmTrip = (confirmedData) => {
    // TODO API (trips):
    // Remplacer la mise a jour locale par PATCH API_ROUTES.trips.details(tripId)
    // Puis declencher la recherche via backend
    const updatedTrip = {
      ...currentTrip,
      ...confirmedData,
      status: confirmedData.immediate ? 'searching' : 'scheduled'
    };

    setCurrentTrip(updatedTrip);

    if (confirmedData.immediate) {
      // Course immédiate : lancer la recherche
      setTripStatus('searching');
      startDriverSearch(updatedTrip);
    } else {
      // Course planifiée
      setTripStatus('scheduled');
      setScheduledTrips(prev => [...prev, updatedTrip]);

      // Déclencher le paiement si anticipé
      if (confirmedData.paymentMethod === 'prepaid') {
        processPayment(updatedTrip.price, updatedTrip.paymentMethod);
      }

      toast.success('✅ Trajet planifié avec succès !');
    }
  };

  // ===================== 5-1 PAIEMENT ANTICIPÉ =====================
  const processPayment = (amount, method) => {
    // TODO API (payments):
    // Remplacer par POST API_ROUTES.payments.create
    // Voir: src/services/paymentService.js
    // Simulation de paiement
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simuler succès
        if (method === 'prepaid') {
          setPassenger(prev => ({
            ...prev,
            balance: prev.balance - amount
          }));
          toast.success(`Paiement de ${amount.toLocaleString()} GNF effectué`);
        }
        resolve({ success: true });
      }, 1500);
    });
  };

  // ===================== 1.3 RECHERCHE DU CHAUFFEUR =====================
  const startDriverSearch = (trip) => {
    // TODO API (matching):
    // Remplacer la simulation locale par GET API_ROUTES.drivers.nearby
    // Puis creer la demande de trajet cote backend et notifier via websocket
    // Voir: src/services/driverService.js et la couche socket
    toast.loading('🔍 Recherche d\'un chauffeur...');

    // Simuler des chauffeurs proches
    const drivers = [
      { id: 1, name: 'Mamadou Fela', rating: 4.7, distance: '2.5 km', eta: '5 min', status: 'available' },
      { id: 2, name: 'Soumah Ibrahima', rating: 4.5, distance: '3.2 km', eta: '7 min', status: 'available' },
      { id: 3, name: 'Baldé Fela', rating: 4.9, distance: '1.8 km', eta: '4 min', status: 'busy' },
    ];

    setAvailableDrivers(drivers.filter(d => d.status === 'available'));

    // Simuler le matching (3-5 secondes)
    const searchDuration = 3000 + Math.random() * 2000;

    const searchTimer = setTimeout(() => {
      // 80% de chance de trouver un chauffeur
      if (Math.random() < 0.8 && drivers.filter(d => d.status === 'available').length > 0) {
        driverFound(trip, drivers[0]);
      } else {
        // ❌ Aucun chauffeur disponible
        toast.error('❌ Aucun chauffeur disponible pour le moment');
        setTripStatus('idle');
        setCurrentTrip(null);
      }
    }, searchDuration);

    setSearchTimeout(searchTimer);

    // ⏳ Timeout global de recherche (60 secondes)
    const globalTimeout = setTimeout(() => {
      if (tripStatus === 'searching') {
        toast.error('⏳ Recherche expirée. Veuillez réessayer');
        setTripStatus('idle');
        setCurrentTrip(null);
        clearTimeout(searchTimer);
      }
    }, 60000);

    return () => {
      clearTimeout(searchTimer);
      clearTimeout(globalTimeout);
    };
  };

  // ===================== CHAUFFEUR TROUVÉ =====================
  const driverFound = (trip, driver) => {
    const fullDriverInfo = {
      ...driver,
      vehicle: {
        type: trip.vehicleType,
        brand: trip.vehicleType === 'taxi' ? 'Toyota' :
          trip.vehicleType === 'moto' ? 'Honda' : 'Mercedes',
        model: trip.vehicleType === 'taxi' ? 'Corolla' :
          trip.vehicleType === 'moto' ? 'CG125' : 'Class C',
        plate: trip.vehicleType === 'taxi' ? 'AB-123-CD' :
          trip.vehicleType === 'moto' ? 'MOTO-456' : 'PRIV-789',
        color: 'Blanc'
      },
      phone: '+224 623 12 76 09',
      position: {
        lat: userLocation.lat + 0.01,
        lng: userLocation.lng + 0.01
      }
    };

    setSelectedDriver(fullDriverInfo);
    setTripStatus('accepted');

    toast.dismiss();
    toast.success(`✅ Chauffeur trouvé ! ${driver.name} arrive dans ${driver.eta}`);

    // Simuler l'arrivée du chauffeur
    simulateDriverArrival(fullDriverInfo);
  };

  // ===================== SIMULATION ARRIVÉE CHAUFFEUR =====================
  const simulateDriverArrival = (driver) => {
    const arrivalTime = parseInt(driver.eta) * 60000; // Convertir en millisecondes

    setTimeout(() => {
      if (tripStatus === 'accepted') {
        setTripStatus('arrived');
        toast.success(`🚗 ${driver.name} est arrivé au point de départ !`);

        // Auto-démarrage du trajet après 30 secondes
        setTimeout(() => {
          if (tripStatus === 'arrived') {
            startTrip();
          }
        }, 30000);
      }
    }, arrivalTime);
  };

  // ===================== 1.6 COURSE EN COURS =====================
  const startTrip = () => {
    setTripStatus('in_progress');
    toast.success('🚀 Trajet démarré ! Suivez votre course en temps réel.');

    // Simuler la progression du trajet
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setTripProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        completeTrip();
      }
    }, 1000);
  };

  // ===================== FIN DE TRAJET =====================
  const completeTrip = () => {
    setTripStatus('completed');

    // Paiement à la fin du trajet si choisi
    if (currentTrip?.paymentMethod === 'postpaid') {
      toast.success('💰 Veuillez effectuer le paiement maintenant');
      // Ici, on ouvrirait le modal de paiement
    } else {
      toast.success('✅ Trajet terminé ! Merci de votre confiance.');
    }

    // Historiser le trajet
    const completedTrip = {
      ...currentTrip,
      status: 'completed',
      completedAt: new Date().toISOString(),
      driver: selectedDriver,
      finalPrice: currentTrip.price
    };

    // Réinitialiser après 5 secondes
    setTimeout(() => {
      setCurrentTrip(null);
      setSelectedDriver(null);
      setTripStatus(null);
      setTripProgress(0);
    }, 5000);
  };

  // ===================== 2.1 ANNULATION PAR LE PASSAGER =====================
  const cancelTripByPassenger = (reason) => {
    if (currentTrip) {
      // Remboursement si paiement anticipé
      if (currentTrip.paymentMethod === 'prepaid') {
        setPassenger(prev => ({
          ...prev,
          balance: prev.balance + currentTrip.price
        }));
        toast.success(`💰 Remboursement de ${currentTrip.price.toLocaleString()} GNF effectué`);
      }

      setTripStatus('cancelled_by_passenger');
      toast.success('❌ Trajet annulé avec succès');

      // Audit : enregistrer l'annulation
      console.log('Annulation par passager:', { trip: currentTrip, reason, timestamp: new Date().toISOString() });

      setTimeout(() => {
        setCurrentTrip(null);
        setSelectedDriver(null);
        setTripStatus(null);
      }, 3000);
    }
  };

  // ===================== 2.2 ANNULATION PAR LE CHAUFFEUR =====================
  const cancelTripByDriver = () => {
    toast.error('⚠️ Le chauffeur a annulé la course. Recherche d\'un nouveau chauffeur...');

    // Retour à la recherche
    setTripStatus('searching');
    setSelectedDriver(null);

    // Relancer la recherche
    setTimeout(() => {
      startDriverSearch(currentTrip);
    }, 2000);
  };

  // ===================== GESTION DES TRAJETS PLANIFIÉS =====================
  const handleScheduledTripDay = (tripId) => {
    const trip = scheduledTrips.find(t => t.id === tripId);
    if (trip) {
      // Déclencher la recherche pour aujourd'hui
      setCurrentTrip(trip);
      setTripStatus('searching');
      startDriverSearch(trip);
    }
  };

  const cancelScheduledTrip = (tripId) => {
    setScheduledTrips(prev => prev.filter(t => t.id !== tripId));

    // Remboursement si paiement anticipé
    const trip = scheduledTrips.find(t => t.id === tripId);
    if (trip?.paymentMethod === 'prepaid') {
      setPassenger(prev => ({
        ...prev,
        balance: prev.balance + trip.price
      }));
      toast.success('Remboursement effectué pour le trajet annulé');
    }

    toast.success('Trajet planifié annulé');
  };

  const updatePassenger = (updatedData) => {
    setPassenger(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <PassengerContext.Provider
      value={{
        // Données
        passenger,
        currentPage,
        setCurrentPage,
        trips,
        transactions,
        updatePassenger,
        // Trajet en cours
        currentTrip,
        tripStatus,
        selectedDriver,
        tripProgress,

        // Localisation
        userLocation,
        hasLocationPermission,
        isLoadingLocation,
        retryLocation,

        // Recherche
        availableDrivers,

        // Trajets planifiés
        scheduledTrips,

        // Fonctions
        defineTrip,
        confirmTrip,
        processPayment,
        cancelTripByPassenger,
        cancelTripByDriver,
        startTrip,
        completeTrip,
        handleScheduledTripDay,
        cancelScheduledTrip
      }}
    >
      {children}
    </PassengerContext.Provider>
  );
};

export const usePassenger = () => useContext(PassengerContext);
