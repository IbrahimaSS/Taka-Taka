import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PassengerNavbar from '../components/passager/PassengerNavbar';
import QuickStats from '../components/passager/QuickStats';
import BookingSection from '../components/passager/BookingSection';
import TripsHistory from '../components/passager/TripsHistory';
import Transactions from '../components/passager/Paiement';
import Profile from '../components/passager/Profile';
import Settings from '../components/passager/Settings';
import Support from '../components/passager/Support';
import EmergencyButton from '../components/passager/EmergencyButton';
import TripConfirmationModal from '../components/passager/TripConfirmationModal';
import Evaluations from '../components/passager/Evaluation';
import PaymentModal from '../components/passager/PaymentModal';
import TripStatusModal from '../components/passager/TripStatusModal';
import Planning from '../components/passager/Planning';
import { PassengerProvider } from '../context/PassengerContext';
import toast, { Toaster } from 'react-hot-toast';

import {
  Home,
  History,
  CreditCard,
  User,
  Settings as SettingsIcon,
  Headphones,
  Car,
  Star,
  Calendar,
  Navigation
} from 'lucide-react';
import RealTimeTracking from '../components/suivisTrajet/TrajetEnTempReel';
import TrajetComplete from '../components/suivisTrajet/TrajetComplete';
import TrajetNote from '../components/suivisTrajet/TrajetNote';
import SearchIndicator from '../components/passager/SearchIndicator';

const Passenger = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showTripModal, setShowTripModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTripStatusModal, setShowTripStatusModal] = useState(false);
  const [showTripComplete, setShowTripComplete] = useState(false);
  const [showTripRating, setShowTripRating] = useState(false);

  // États unifiés pour le trajet
  const [currentTrip, setCurrentTrip] = useState(null);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [tripStatus, setTripStatus] = useState('idle'); // idle, searching, driver_found, arrived, en_route, completed

  // NOUVEAU : Deux modes distincts
  const [isOnMapView, setIsOnMapView] = useState(false); // Vue carte avec chauffeur dans BookingSection
  const [isOnTrackingView, setIsOnTrackingView] = useState(false); // Vue RealTimeTracking
  const [showSearchIndicator, setShowSearchIndicator] = useState(false); // Contrôle l'affichage de l'indicateur
  // Timer pour simuler l'arrivée du chauffeur
  const [arrivalSecondsRemaining, setArrivalSecondsRemaining] = useState(null);
  const arrivalTimeoutRef = useRef(null);
  const arrivalIntervalRef = useRef(null);
  const arrivalModalTimeoutRef = useRef(null);
  const searchTimeoutRef = useRef(null); // Timeout de 45 secondes pour la recherche
  const [showArrivalModal, setShowArrivalModal] = useState(false);

  const clearArrivalTimers = () => {
    if (arrivalTimeoutRef.current) {
      clearTimeout(arrivalTimeoutRef.current);
      arrivalTimeoutRef.current = null;
    }
    if (arrivalIntervalRef.current) {
      clearInterval(arrivalIntervalRef.current);
      arrivalIntervalRef.current = null;
    }
    if (arrivalModalTimeoutRef.current) {
      clearTimeout(arrivalModalTimeoutRef.current);
      arrivalModalTimeoutRef.current = null;
    }
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    setArrivalSecondsRemaining(null);
  };

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'planning', label: 'Planning ', icon: Calendar },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'evaluations', label: 'Évaluations', icon: Star },
    { id: 'settings', label: 'Paramètres', icon: SettingsIcon },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  // Gestion de la réservation
  const handleBookTrip = (tripData) => {
    console.log('Booking trip data:', tripData);
    setCurrentTrip(tripData);
    setShowTripModal(true);
  };

  // Confirmation du trajet
  const handleConfirmTrip = async (confirmedTripData) => {
    console.log('Confirmed trip:', confirmedTripData);
    setShowTripModal(false);

    const updatedTrip = {
      ...currentTrip,
      ...confirmedTripData,
      id: `TRIP-${Date.now()}`,
      status: 'searching',
      createdAt: new Date().toISOString()
    };

    setCurrentTrip(updatedTrip);

    if (confirmedTripData.paymentTime === 'advance') {
      setShowPaymentModal(true);
    } else if (confirmedTripData.tripType === 'now') {
      startDriverSearch(updatedTrip);
    } else {
      scheduleTrip(updatedTrip);
    }
  };

  // Recherche de chauffeur
  const startDriverSearch = async (tripData) => {
    setTripStatus('searching');
    setShowSearchIndicator(true); // Afficher l'indicateur flottant
    // Ne plus bloquer avec le modal - l'indicateur flottant sera affiché
    setShowTripStatusModal(false);

    // Timeout de 2 minutes - si aucun chauffeur trouvé, masquer l'indicateur
    searchTimeoutRef.current = setTimeout(() => {
      if (tripStatus === 'searching') {
        setShowSearchIndicator(false);
        setTripStatus('idle');
        setCurrentTrip(null);
        toast.error('Aucun chauffeur disponible. Veuillez réessayer.');
      }
    }, 120000); // 2 minutes

    // Simulation de recherche - trouve un chauffeur après 2 minutes
    setTimeout(() => {
      const mockDriver = {
        id: 1,
        name: "Mamadou Diallo",
        phone: "+224 623 09 02 24",
        rating: 4.8,
        tripsCompleted: 1247,
        vehicle: {
          brand: "Toyota",
          model: "Corolla",
          color: "Blanc",
          plate: "AB-123-CD",
          type: tripData.vehicleType || 'taxi',
          year: 2022
        },
        distance: "0.8 km",
        eta: "3 min",
        location: [9.6412, -13.5784],
        currentLocation: [9.6412, -13.5784],
        destination: tripData.destinationCoords
      };

      setCurrentDriver(mockDriver);
      setTripStatus('driver_found');
      setCurrentTrip(prev => ({
        ...prev,
        driver: mockDriver,
        status: 'driver_found'
      }));

      toast.success('Chauffeur trouvé !');

      // Clear any existing timers
      if (arrivalTimeoutRef.current) clearTimeout(arrivalTimeoutRef.current);
      if (arrivalIntervalRef.current) clearInterval(arrivalIntervalRef.current);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      // Démarrer le compte à rebours pour l'arrivée du chauffeur (1 minute)
      const ARRIVAL_SECONDS = 35; // 1 minute
      setArrivalSecondsRemaining(ARRIVAL_SECONDS);
      arrivalIntervalRef.current = setInterval(() => {
        setArrivalSecondsRemaining((s) => (s && s > 0 ? s - 1 : 0));
      }, 1000);

      // Quand le compte à rebours arrive à 0, afficher un modal informatif
      // pendant quelques secondes avant de démarrer automatiquement le trajet.
      const ARRIVAL_MODAL_MS = 3000; // Durée d'affichage du modal avant démarrage
      arrivalTimeoutRef.current = setTimeout(() => {
        setShowArrivalModal(true);
        arrivalModalTimeoutRef.current = setTimeout(() => {
          setShowArrivalModal(false);
          handleStartTrip();
        }, ARRIVAL_MODAL_MS);
      }, ARRIVAL_SECONDS * 1000);
    }, 30000); // 2 minutes - durée de recherche du chauffeur
  };

  // Planification
  const scheduleTrip = (tripData) => {
    setTripStatus('scheduled');
    setShowTripStatusModal(true);
    toast.success('Course planifiée avec succès !');
  };

  // Paiement réussi
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    toast.success('Paiement effectué avec succès !');

    if (currentTrip?.tripType === 'now') {
      startDriverSearch(currentTrip);
    } else {
      scheduleTrip(currentTrip);
    }
  };

  // Chauffeur trouvé
  const handleDriverFound = (driver) => {
    setCurrentDriver(driver);
    setTripStatus('driver_found');
    setCurrentTrip(prev => ({
      ...prev,
      driver: driver,
      status: 'driver_found'
    }));
  };

  // 1. Quand l'utilisateur clique sur "Suivre sur la carte" dans TripStatusModal
  const handleShowOnMap = () => {
    setIsOnMapView(true);
    setShowTripStatusModal(false);
    setActiveTab('home');
    toast.success('Chauffeur affiché sur la carte');
  };

  // 2. Similation  de l'arrive du chauffeur dans 3 minute et pouur que le trajet ne Démarrer le trajet

  const handleStartTrip = () => {
    // Nettoyer les timers d'arrivée si présents
    clearArrivalTimers();

    // Simuler un court délai de démarrage (laisser l'UI respirer)
    setTimeout(() => {
      setTripStatus('en_route');
      setIsOnTrackingView(true);
      setIsOnMapView(false);
      setActiveTab('home');

      setCurrentTrip(prev => ({
        ...prev,
        status: 'en_route',
        startedAt: new Date().toISOString()
      }));

      setShowTripStatusModal(false);
      toast.success('Trajet démarré ! Suivi en temps réel activé.');
    }, 1000);
  };


  // 3. Navigation depuis la navbar vers le suivi
  const handleNavigateToTracking = () => {
    if (tripStatus === 'en_route') {
      setIsOnTrackingView(true);
      setIsOnMapView(false);
      setActiveTab('home');
      toast.success('Retour au suivi en temps réel');
    }
  };

  const hadalOnViewPlanning = () => {
    setShowTripStatusModal(false);
    setActiveTab('planning');
  }

  // Retour à la vue carte
  const handleBackToMap = () => {
    setIsOnTrackingView(false);
    setIsOnMapView(true);
    setActiveTab('home');
  };

  // Retour à l'accueil
  const handleBackToHome = () => {
    setIsOnTrackingView(false);
    setIsOnMapView(false);
    setActiveTab('home');
  };

  // Annulation
  const handleCancelTrip = () => {
    // Nettoyer timers d'arrivée
    clearArrivalTimers();

    setTripStatus('cancelled');
    setIsOnTrackingView(false);
    setIsOnMapView(false);
    setCurrentDriver(null);
    setCurrentTrip(null);
    toast.info('Course annulée');
    setShowTripStatusModal(false);
  };

  // Nettoyage des timers au démontage du composant
  useEffect(() => {
    return () => {
      clearArrivalTimers();
    };
  }, []);

  // Fin du trajet - Vérifie le mode de paiement
  const handleCompleteTrip = () => {
    setTripStatus('completed');
    setIsOnTrackingView(false);
    setIsOnMapView(false);

    const completedTrip = {
      ...currentTrip,
      status: 'completed',
      completedAt: new Date().toISOString(),
      driver: currentDriver
    };

    setCurrentTrip(completedTrip);

    // Vérifier si le paiement a déjà été fait
    if (currentTrip?.paymentTime === 'advance') {
      // Si payé d'avance, aller directement à l'évaluation
      setShowTripRating(true);
      setShowTripStatusModal(false);
    } else {
      // Sinon, afficher la page de paiement
      setShowTripComplete(true);
      setShowTripStatusModal(false);
    }

    toast.success('Trajet terminé avec succès !');
  };

  // Succès du paiement après trajet
  const handlePostTripPaymentSuccess = (paymentData) => {
    setShowTripComplete(false);

    // Mettre à jour le trajet avec les informations de paiement
    const updatedTrip = {
      ...currentTrip,
      payment: {
        ...paymentData,
        status: 'completed',
        paidAt: new Date().toISOString()
      },
      paid: true
    };

    setCurrentTrip(updatedTrip);

    // Rediriger vers l'évaluation
    setShowTripRating(true);
    toast.success('Paiement effectué avec succès !');
  };

  // Évaluation terminée
  const handleRatingComplete = (ratingData) => {
    setShowTripRating(false);
    setCurrentTrip(null);
    setCurrentDriver(null);
    setTripStatus('idle');

    toast.success('Merci pour votre évaluation !');
  };

  // Évaluation
  const handleRateTrip = (ratingData) => {
    console.log('Trip rated:', ratingData);
    setShowTripStatusModal(false);
    setCurrentTrip(null);
    setCurrentDriver(null);
    setTripStatus('idle');
    toast.success('Merci pour votre évaluation !');
  };

  // Navigation par onglets
  const handleTabChange = (tabId) => {
    if (tabId !== 'home') {
      setIsOnTrackingView(false);
      setIsOnMapView(false);
    }
    setActiveTab(tabId);
  };

  // Rendu conditionnel du contenu principal (sans RealTimeTracking, TrajetComplete, TrajetNote)
  const renderContent = () => {
    // Onglet accueil
    if (activeTab === 'home') {
      return (
        <>
          {/* <QuickStats /> */}

          <BookingSection
            onBookTrip={handleBookTrip}
            currentTrip={currentTrip}
            currentDriver={currentDriver}
            tripStatus={tripStatus}
            isOnMapView={isOnMapView}
            onStartTrip={handleStartTrip}
            onShowTracking={() => {
              if (tripStatus === 'en_route') {
                setIsOnTrackingView(true);
                setIsOnMapView(false);
              }
            }}
          />
        </>
      );
    }

    // Autres onglets
    switch (activeTab) {
      case 'history':
        return <TripsHistory />;
      case 'payments':
        return <Transactions />;
      case 'evaluations':
        return <Evaluations />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      case 'planning':
        return <Planning />;
      case 'support':
        return <Support />;
      default:
        return <BookingSection onBookTrip={handleBookTrip} />;
    }
  };

  // Vérifier si une vue plein écran est active
  const isFullScreenViewActive = isOnTrackingView || showTripComplete || showTripRating;

  // Déterminer si le bouton "Suivi actif" doit être affiché
  const isTripInProgress = tripStatus === 'en_route';

  return (
    <PassengerProvider>
      {/* Vues plein écran (en dehors du layout principal) */}
      <AnimatePresence mode="wait">
        {/* Vue suivi en temps réel - Plein écran */}
        {isOnTrackingView && tripStatus === 'en_route' && (
          <motion.div
            key="realtime-tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-gray-100 overflow-y-auto"
          >
            <RealTimeTracking
              trip={currentTrip}
              driver={currentDriver}
              onBack={handleBackToMap}
              onEmergency={() => {
                toast.error('Signal d\'urgence envoyé !');
              }}
              onContactDriver={() => {
                window.open(`tel:${currentDriver?.phone}`);
              }}
              onCancelTrip={handleCancelTrip}
              onEndTrip={handleCompleteTrip}
              onShareTrip={(data) => {
                console.log('Share trip:', data);
                toast.success('Trajet partagé !');
              }}
            />
          </motion.div>
        )}

        {/* Vue paiement après trajet - Plein écran */}
        {showTripComplete && currentTrip && (
          <motion.div
            key="trip-complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 to-gray-100  overflow-y-auto"
          >
            <TrajetComplete
              trip={currentTrip}
              driver={currentDriver}
              onPaymentSuccess={handlePostTripPaymentSuccess}
              onBack={() => {
                setShowTripComplete(false);
                setActiveTab('home');
              }}
            />
          </motion.div>
        )}

        {/* Vue évaluation - Plein écran */}
        {showTripRating && currentTrip && (
          <motion.div
            key="trip-rating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto"
          >
            <TrajetNote
              trip={currentTrip}
              onRatingComplete={handleRatingComplete}
              onBack={() => {
                setShowTripRating(false);
                setShowTripComplete(true);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toaster global - toujours visible */}
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            // background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            },
          },
        }}
      />

      {/* Modal d'arrivée — affiché quelques secondes avant démarrage automatique */}
      <AnimatePresence>
        {showArrivalModal && (
          <motion.div
            key="arrival-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ zIndex: 99999 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-600 mx-auto flex items-center justify-center mb-4">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Votre chauffeur est arrivé</h3>
              <p className="text-gray-600 mt-2">Le trajet va démarrer automatiquement dans un instant.</p>

              <div className="mt-5">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-green-500 to-blue-600"
                  />
                </div>
                <div className="text-sm text-gray-500 mt-2">Démarrage automatique...</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur flottant de recherche de chauffeur */}
      {showSearchIndicator && (
        <SearchIndicator
          status={tripStatus}
          driver={currentDriver}
          tripDetails={currentTrip}
          onGoToHome={() => {
            setActiveTab('home');
            setIsOnMapView(true);
            setShowSearchIndicator(false); // Masquer l'indicateur
            // Nettoyer le timeout de recherche
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
              searchTimeoutRef.current = null;
            }
          }}
          onCancel={handleCancelTrip}
          onContact={() => window.open(`tel:${currentDriver?.phone}`)}
          onTrack={handleNavigateToTracking}
        />
      )}

      {/* Layout principal (visible uniquement quand pas de vue plein écran) */}
      <div className={`min-h-screen bg-gray-100 bg-gradient-to-br from-primary-50 to-secondary-100  dark:from-gray-800  dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 ${isFullScreenViewActive ? 'hidden' : ''}`}>

        {/* Navigation */}
        <PassengerNavbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabs}
          isTripInProgress={isTripInProgress}
          onNavigateToTracking={handleNavigateToTracking}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${isOnMapView}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>



        {/* Modals */}
        <TripConfirmationModal
          isOpen={showTripModal}
          onClose={() => setShowTripModal(false)}
          onConfirm={handleConfirmTrip}
          tripDetails={currentTrip}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={currentTrip?.price || 15000}
          tripDetails={currentTrip}
        />

        <TripStatusModal
          isOpen={showTripStatusModal}
          onClose={() => setShowTripStatusModal(false)}
          status={tripStatus}
          driver={currentDriver}
          tripDetails={currentTrip}
          arrivalSecondsRemaining={arrivalSecondsRemaining}
          onCancel={handleCancelTrip}
          onContact={() => window.open(`tel:${currentDriver?.phone}`)}
          onTrack={handleShowOnMap}
          onViewPlanning={hadalOnViewPlanning}

          onStartTrip={handleStartTrip}
          onTripComplete={handleCompleteTrip}
          onSearchAgain={() => {
            setShowTripStatusModal(false);
            setCurrentTrip(null);
            setCurrentDriver(null);
            setTripStatus('idle');
            setIsOnMapView(false);
            setIsOnTrackingView(false);
          }}
          onDriverFound={handleDriverFound}
          onRateTrip={handleRateTrip}
        />

        {/* Footer */}
        <footer className="mt-12 py-12 bg-gradient-to-r from-gray-900 to-gray-800 dark:bg-gray-800/40 text-white transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Taka<span className="bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">Taka</span>
                    </h2>
                    <p className="text-gray-400 text-sm dark:text-gray-100">Mobilité intelligente</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 justify-center">
                <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-105">
                  À propos
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-105">
                  Aide
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-105">
                  Confidentialité
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all hover:scale-105">
                  Conditions
                </a>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-800/50 text-center">
              <p className="text-gray-500">
                © {new Date().getFullYear()} Taka Taka. Tous droits réservés.
              </p>
              <p className="text-gray-600 text-xs mt-2 uppercase tracking-widest">
                Service disponible 24h/24, 7j/7
              </p>
            </div>
          </div>
        </footer>
      </div>
    </PassengerProvider>
  );
};

export default Passenger;