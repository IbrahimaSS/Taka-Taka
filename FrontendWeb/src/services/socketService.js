/**
 * socketService.js
 * Service de simulation Socket.io pour le développement
 * Simule la réception de nouvelles courses en temps réel
 * 
 * NOTE: Ce service simule un serveur Socket.io. Pour la production,
 * remplacer par une vraie connexion socket.io-client.
 */
// TODO API (realtime):
// Remplacer cette simulation par socket.io-client:
// - connexion au serveur Node/Express
// - ecoute des events: new_trip_request, trip_cancelled, trip_updated
// - emission des events: accept_trip, reject_trip, update_location, start_trip, complete_trip
// Voir: src/context/DriverContext.jsx pour les points d'integration.

class SocketServiceClass {
    constructor() {
        this.isConnected = false;
        this.listeners = new Map();
        this.simulationInterval = null;
        this.driverData = null;
    }

    /**
     * Se connecter au service (simulation)
     * @param {Object} driverData - Données du chauffeur
     */
    connect(driverData) {
        if (this.isConnected) return;

        this.driverData = driverData;
        this.isConnected = true;

        console.log('[SocketService] Chauffeur connecté:', driverData.name);

        // Démarrer la simulation de nouvelles courses
        this.startSimulation();
    }

    /**
     * Se déconnecter du service
     */
    disconnect() {
        if (!this.isConnected) return;

        this.isConnected = false;
        this.driverData = null;

        // Arrêter la simulation
        this.stopSimulation();

        console.log('[SocketService] Chauffeur déconnecté');
    }

    /**
     * Écouter un événement
     * @param {string} event - Nom de l'événement
     * @param {Function} callback - Fonction à appeler
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * Supprimer un listener
     * @param {string} event - Nom de l'événement
     * @param {Function} callback - Fonction à supprimer
     */
    off(event, callback) {
        if (!this.listeners.has(event)) return;

        if (callback) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        } else {
            this.listeners.delete(event);
        }
    }

    /**
     * Émettre un événement vers le serveur (simulation)
     * @param {string} event - Nom de l'événement
     * @param {Object} data - Données à envoyer
     */
    emit(event, data) {
        console.log(`[SocketService] Émission: ${event}`, data);

        // Simuler les réponses du serveur
        switch (event) {
            case 'accept_trip':
                console.log('[SocketService] Course acceptée:', data.tripId);
                break;
            case 'reject_trip':
                console.log('[SocketService] Course refusée:', data.tripId, 'Raison:', data.reason);
                break;
            case 'complete_trip':
                console.log('[SocketService] Course terminée:', data.tripId);
                break;
            case 'update_location':
                this.driverData.location = data.location;
                break;
            case 'driver_arrived':
                console.log('[SocketService] Chauffeur arrivé au point de départ:', data.tripId);
                break;
            case 'start_trip':
                console.log('[SocketService] Course démarrée:', data.tripId);
                break;
            case 'report_dispute':
                console.log('[SocketService] Litige signalé:', data.tripId, data.reason);
                break;
            default:
                break;
        }
    }

    /**
     * Déclencher un événement localement
     * @param {string} event - Nom de l'événement
     * @param {Object} data - Données de l'événement
     */
    trigger(event, data) {
        if (!this.listeners.has(event)) return;

        this.listeners.get(event).forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[SocketService] Erreur lors du traitement de ${event}:`, error);
            }
        });
    }

    /**
     * Démarrer la simulation de nouvelles courses
     */
    startSimulation() {
        // Première course après 5-10 secondes
        const firstDelay = Math.random() * 5000 + 5000;

        setTimeout(() => {
            if (this.isConnected) {
                this.simulateNewTrip();

                // Ensuite, nouvelles courses toutes les 25-45 secondes
                this.simulationInterval = setInterval(() => {
                    if (this.isConnected) {
                        this.simulateNewTrip();
                    }
                }, Math.random() * 20000 + 25000);
            }
        }, firstDelay);
    }

    /**
     * Arrêter la simulation
     */
    stopSimulation() {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }

    /**
     * Simuler une nouvelle demande de course
     */
    simulateNewTrip() {
        if (!this.driverData) return;

        // Règle 2: La demande n'est envoyée qu'au chauffeur disponible
        if (this.driverData.status !== 'available') {
            console.log(`[SocketService] Le chauffeur est ${this.driverData.status}, simulation annulée.`);
            return;
        }

        const passengers = [
            { name: 'Mamadou Diallo', rating: 4.8, phone: '+224 623 09 02 24' },
            { name: 'Fatoumata Sylla', rating: 4.5, phone: '+224 655 44 33 22' },
            { name: 'Ibrahim Traoré', rating: 4.2, phone: '+224 622 11 22 33' },
            { name: 'Aïssata Koné', rating: 4.9, phone: '+224 633 44 55 66' },
            { name: 'Sekou Bah', rating: 4.6, phone: '+224 644 55 66 77' },
            { name: 'Mariama Camara', rating: 4.7, phone: '+224 655 66 77 88' },
            { name: 'Oumar Barry', rating: 4.4, phone: '+224 666 77 88 99' },
        ];

        // Générer des coordonnées proches (moins de 5km)
        // 1 degré de latitude est d'environ 111 km
        // 0.01 degré est d'environ 1.1 km
        const latOffset = (Math.random() - 0.5) * 0.06; // +/- ~3.3km
        const lngOffset = (Math.random() - 0.5) * 0.06; // +/- ~3.3km

        const pickupCoords = [
            this.driverData.location.lat + latOffset,
            this.driverData.location.lng + lngOffset
        ];

        // Destination un peu plus loin (5-15km)
        const destLatOffset = (Math.random() - 0.5) * 0.15;
        const destLngOffset = (Math.random() - 0.5) * 0.15;

        const destinationCoords = [
            pickupCoords[0] + destLatOffset,
            pickupCoords[1] + destLngOffset
        ];

        const passenger = passengers[Math.floor(Math.random() * passengers.length)];
        const priorities = ['low', 'medium', 'high'];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];

        // Simulation de noms de lieux (pour l'affichage)
        const conakryArea = ["Kaloum", "Dixinn", "Matam", "Ratoma", "Matoto", "Cosa", "Lambanyi", "Simbaya", "Kipe", "Nongo"];
        const pickupArea = conakryArea[Math.floor(Math.random() * conakryArea.length)];
        const destArea = conakryArea[Math.floor(Math.random() * conakryArea.length)];

        const tripRequest = {
            id: `TRP-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
            passengerName: passenger.name,
            passengerRating: passenger.rating,
            passengerPhone: passenger.phone,
            pickupAddress: `${pickupArea}, Secteur ${Math.floor(Math.random() * 5) + 1}`,
            destinationAddress: `${destArea}, Rue ${Math.floor(Math.random() * 20) + 1}`,
            pickupCoords: pickupCoords,
            destinationCoords: destinationCoords,
            distance: (Math.random() * 10 + 2).toFixed(1) + ' km',
            estimatedTime: Math.floor(Math.random() * 40 + 10) + ' min',
            estimatedFare: Math.floor(Math.random() * 15000 + 10000),
            requestedTime: new Date().toISOString(),
            priority: priority,
            vehicleType: 'taxi',
        };

        console.log('[SocketService] Nouvelle demande de course simulée à proximité:', tripRequest.id);

        this.trigger('new_trip_request', tripRequest);
    }
}

// Instance singleton
export const socketService = new SocketServiceClass();

export default socketService;
