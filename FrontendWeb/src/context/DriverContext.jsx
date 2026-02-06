/**
 * DriverContext.jsx
 * Contexte React pour gérer l'état global du chauffeur
 * - Statut de disponibilité (en ligne/hors ligne)
 * - Nouvelles demandes de courses
 * - Course active en cours
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '../services/socketService';
import { useTripStore } from '../data/tripStore';
import { useGeolocation } from '../hooks/useGeolocation';
import { GeolocationService } from '../services/geolocation';

const DriverContext = createContext();

export const useDriverContext = () => {
    const context = useContext(DriverContext);
    if (!context) {
        throw new Error('useDriverContext must be used within DriverProvider');
    }
    return context;
};

export const DriverProvider = ({ children }) => {
    // État de disponibilité
    const [isOnline, setIsOnline] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [status, setStatus] = useState('offline'); // 'offline', 'available', 'busy'

    // Localisation du chauffeur via le hook harmonisé
    const { location: realLocation, error: geoError } = useGeolocation({
        enableHighAccuracy: true,
        maximumAge: 2000 // Plus fréquent pour le chauffeur
    });

    const [driverLocation, setDriverLocation] = useState({ lat: 9.6412, lng: -13.5784 });

    // Synchroniser la position réelle si disponible
    useEffect(() => {
        if (realLocation) {
            setDriverLocation(realLocation);
        }
    }, [realLocation]);

    // Nouvelles demandes de courses
    const [tripRequests, setTripRequests] = useState([]);

    // Courses acceptées (plusieurs possibles)
    const [acceptedTrips, setAcceptedTrips] = useState([]);
    // Trip actuellement suivi pour la récupération
    const [currentPickupTripId, setCurrentPickupTripId] = useState(null);
    // Étape globale du chauffeur
    const [tripStep, setTripStep] = useState('idle'); // 'idle', 'to_pickup', 'picking_up', 'ready_to_start', 'in_progress'

    // Statistiques temps réel
    const [stats, setStats] = useState({
        requestsToday: 0,
        acceptedToday: 0,
        rejectedToday: 0,
    });

    // Référence pour éviter les doublons
    const processedRequestIds = useRef(new Set());

    // Store Zustand pour les trajets
    const addTrip = useTripStore((state) => state.addTrip);

    // Utilitaire de calcul de distance (centralisé dans GeolocationService)
    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        return GeolocationService.calculateDistance(lat1, lon1, lat2, lon2);
    }, []);

    // Gestionnaire de nouvelles demandes de courses
    const handleNewTripRequest = useCallback((tripData) => {
        // Règle 1: Ne plus recevoir de demandes si un trajet est en cours
        if (tripStep === 'in_progress') {
            return;
        }

        // Éviter les doublons
        if (processedRequestIds.current.has(tripData.id)) {
            return;
        }

        // Filtrer par distance (5km)
        const distance = calculateDistance(
            driverLocation.lat,
            driverLocation.lng,
            tripData.pickupCoords[0],
            tripData.pickupCoords[1]
        );

        if (distance > 5) {
            console.log(`[DriverContext] Course ${tripData.id} trop loin: ${distance.toFixed(2)}km`);
            return;
        }

        processedRequestIds.current.add(tripData.id);

        // Ajouter la demande avec un timestamp d'expiration
        const requestWithExpiry = {
            ...tripData,
            distanceToDriver: distance.toFixed(2),
            receivedAt: new Date().toISOString(),
            expiresIn: 60, // secondes
        };

        setTripRequests(prev => [requestWithExpiry, ...prev]);
        setStats(prev => ({
            ...prev,
            requestsToday: prev.requestsToday + 1
        }));
    }, [driverLocation, tripStep]);

    // Connexion/Deconnexion Socket
    // TODO API (realtime):
    // Remplacer socketService (simulation) par un vrai socket.io-client
    // Le backend doit emettre: new_trip_request, trip_cancelled, etc.
    useEffect(() => {
        if (isOnline) {
            setIsConnecting(true);
            setStatus('available');

            const driverData = {
                id: 'driver-001',
                name: 'Chauffeur Test',
                location: driverLocation,
                status: tripStep === 'in_progress' ? 'busy' : 'available'
            };

            socketService.connect(driverData);

            // Écouter les nouvelles demandes (seulement si pas en cours)
            socketService.on('new_trip_request', handleNewTripRequest);

            // Écouter les annulations
            socketService.on('trip_cancelled', (data) => {
                setTripRequests(prev => prev.filter(req => req.id !== data.tripId));
                setAcceptedTrips(prev => prev.filter(req => req.id !== data.tripId));
                processedRequestIds.current.delete(data.tripId);
            });

            setIsConnecting(false);
        } else {
            socketService.disconnect();
            setStatus('offline');
            // Nettoyer les demandes en attente quand hors ligne
            setTripRequests([]);
            processedRequestIds.current.clear();
        }

        return () => {
            socketService.off('new_trip_request', handleNewTripRequest);
            socketService.off('trip_cancelled');
        };
    }, [isOnline, handleNewTripRequest, driverLocation, tripStep]);

    // Emission de la position via Socket quand en ligne
    // TODO API (realtime):
    // Remplacer par un endpoint backend ou un event socket
    useEffect(() => {
        if (isOnline && driverLocation) {
            socketService.emit('update_location', {
                location: driverLocation,
                status: tripStep === 'in_progress' ? 'busy' : 'available'
            });
        }
    }, [isOnline, driverLocation, tripStep]);

    // Timer pour l'expiration des demandes
    useEffect(() => {
        const interval = setInterval(() => {
            setTripRequests(prev =>
                prev.map(req => ({
                    ...req,
                    expiresIn: Math.max(0, req.expiresIn - 1)
                })).filter(req => req.expiresIn > 0)
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Toggle disponibilité
    const toggleOnline = useCallback(() => {
        setIsOnline(prev => !prev);
    }, []);

    // Accepter une course
    // TODO API (trips):
    // Remplacer la maj locale par POST API_ROUTES.trips.accept(tripId)
    const acceptTripRequest = useCallback((tripId) => {
        const trip = tripRequests.find(req => req.id === tripId);
        if (!trip) return;

        // Notifier le serveur
        socketService.emit('accept_trip', { tripId });

        // Créer la course dans le store
        const newTrip = {
            ...trip,
            requestedTime: new Date(trip.requestedTime),
            status: 'accepted',
            pickupStatus: 'pending', // 'pending', 'arrived', 'picked_up'
        };

        addTrip?.(newTrip);
        setAcceptedTrips(prev => [...prev, newTrip]);

        // Si c'est la première course, on la définit comme cible de récupération
        // if (acceptedTrips.length === 0) {
        //     setCurrentPickupTripId(newTrip.id);
        //     setTripStep('to_pickup');
        // }

        // Retirer de la liste des demandes
        setTripRequests(prev => prev.filter(req => req.id !== tripId));

        // Mettre à jour les stats
        setStats(prev => ({
            ...prev,
            acceptedToday: prev.acceptedToday + 1
        }));

        return newTrip;
    }, [tripRequests, addTrip, acceptedTrips]);

    // Sélectionner un passager à aller chercher (parmi les acceptés)
    const selectPickupTrip = useCallback((tripId) => {
        setCurrentPickupTripId(tripId);
        setTripStep('to_pickup');
    }, []);

    // Signaler l'arrivée au point de départ du passager actuel
    const signalArrival = useCallback(() => {
        if (!currentPickupTripId) return;

        socketService.emit('driver_arrived', { tripId: currentPickupTripId });

        setAcceptedTrips(prev => prev.map(trip =>
            trip.id === currentPickupTripId
                ? { ...trip, pickupStatus: 'arrived' }
                : trip
        ));
        setTripStep('at_pickup');
    }, [currentPickupTripId]);

    // Confirmer l'embarquement d'un passager
    const confirmPassengerPickup = useCallback((tripId) => {
        socketService.emit('passenger_picked_up', { tripId });

        setAcceptedTrips(prev => {
            const updatedTrips = prev.map(trip =>
                trip.id === tripId
                    ? { ...trip, pickupStatus: 'picked_up' }
                    : trip
            );

            // Vérifier si tous les passagers ont été récupérés
            const allPickedUp = updatedTrips.every(t => t.pickupStatus === 'picked_up');
            if (allPickedUp) {
                setTripStep('ready_to_start');
            } else {
                // S'il en reste, on remet en idle ou on suggère le suivant
                setTripStep('idle');
                setCurrentPickupTripId(null);
            }

            return updatedTrips;
        });
    }, []);

    // Démarrer la course globale (une fois tous les passagers à bord)
    const startCourse = useCallback(() => {
        if (tripStep !== 'ready_to_start') return;

        acceptedTrips.forEach(trip => {
            socketService.emit('start_trip', { tripId: trip.id });
        });

        setTripStep('in_progress');
        setStatus('busy');
        // Règle 1: On arrête de recevoir des demandes
        setTripRequests([]);
    }, [tripStep, acceptedTrips]);

    // Refuser une course
    // TODO API (trips):
    // Remplacer la maj locale par POST API_ROUTES.trips.reject(tripId)
    const rejectTripRequest = useCallback((tripId, reason = 'driver_rejected') => {
        socketService.emit('reject_trip', { tripId, reason });

        setTripRequests(prev => prev.filter(req => req.id !== tripId));
        processedRequestIds.current.delete(tripId);

        setStats(prev => ({
            ...prev,
            rejectedToday: prev.rejectedToday + 1
        }));
    }, []);

    // Terminer la course (tous les passagers arrives)
    // TODO API (trips):
    // Remplacer la maj locale par POST API_ROUTES.trips.complete(tripId)
    const completeCourse = useCallback(() => {
        acceptedTrips.forEach(trip => {
            socketService.emit('complete_trip', { tripId: trip.id });
        });
        setAcceptedTrips([]);
        setCurrentPickupTripId(null);
        setStatus('available');
        setTripStep('idle');
    }, [acceptedTrips]);

    // Signaler un litige
    const reportDispute = useCallback((reason, details) => {
        if (currentPickupTripId) {
            socketService.emit('report_dispute', { tripId: currentPickupTripId, reason, details });
        }
    }, [currentPickupTripId]);

    // Effacer toutes les demandes
    const clearAllRequests = useCallback(() => {
        tripRequests.forEach(req => {
            socketService.emit('reject_trip', { tripId: req.id, reason: 'driver_cleared' });
        });
        setTripRequests([]);
        processedRequestIds.current.clear();
    }, [tripRequests]);

    const value = {
        // États
        isOnline,
        isConnecting,
        status,
        driverLocation,
        tripRequests,
        acceptedTrips,
        currentPickupTripId,
        activeTrip: acceptedTrips.find(t => t.id === currentPickupTripId), // pour compatibilité descendante
        tripStep,
        stats,

        // Actions
        toggleOnline,
        acceptTripRequest,
        rejectTripRequest,
        selectPickupTrip,
        signalArrival,
        confirmPassengerPickup,
        startCourse,
        completeCourse,
        reportDispute,
        clearAllRequests,
        calculateDistance,

        // Computed
        hasNewRequests: tripRequests.length > 0 && tripStep !== 'in_progress',
        pendingRequestsCount: tripStep === 'in_progress' ? 0 : tripRequests.length,
    };


    return (
        <DriverContext.Provider value={value}>
            {children}
        </DriverContext.Provider>
    );
};

export default DriverContext;
