// Simulation WebSocket pour la communication entre chauffeur et passager
class TripService {
  constructor() {
    this.subscribers = new Set();
    this.connected = false;
    this.tripId = null;
    this.driverConnected = false;
  }

  // Simuler la connexion au serveur
  connect(tripId) {
    this.tripId = tripId;
    this.connected = true;
    console.log(`Connecté au trajet ${tripId}`);
    
    // Simuler les événements WebSocket
    this.simulateDriverEvents(tripId);
  }

  // S'abonner aux événements
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  // Émettre un événement
  emit(event, data) {
    console.log(`Événement émis: ${event}`, data);
    this.subscribers.forEach(callback => {
      callback({ event, data });
    });
  }

  // Simuler la connexion du chauffeur
  simulateDriverConnection(driverId) {
    this.driverConnected = true;
    console.log(`Chauffeur ${driverId} connecté`);
    
    this.emit('driver_connected', {
      driverId,
      timestamp: new Date().toISOString(),
      message: 'Le chauffeur est connecté'
    });
  }

  // Simuler les événements du chauffeur
  simulateDriverEvents(tripId) {
    // Simuler l'arrivée du chauffeur après 5 secondes
    setTimeout(() => {
      this.emit('driver_arrived', {
        tripId,
        timestamp: new Date().toISOString(),
        message: 'Le chauffeur est arrivé au point de départ',
        driverLocation: [9.6412, -13.5784]
      });
    }, 5000);

    // Simuler le démarrage du trajet par le chauffeur après 10 secondes
    setTimeout(() => {
      this.emit('trip_started', {
        tripId,
        timestamp: new Date().toISOString(),
        startedBy: 'driver',
        message: 'Le chauffeur a démarré le trajet',
        status: 'en_route'
      });
    }, 10000);

    // Simuler des mises à jour de position pendant le trajet
    setInterval(() => {
      if (this.connected && this.driverConnected) {
        this.emit('driver_location_update', {
          tripId,
          timestamp: new Date().toISOString(),
          location: [
            9.6412 + Math.random() * 0.01,
            -13.5784 + Math.random() * 0.01
          ],
          speed: Math.floor(Math.random() * 20) + 30,
          heading: Math.floor(Math.random() * 360)
        });
      }
    }, 3000);
  }

  // Simulation d'envoi d'événement au chauffeur
  sendDriverEvent(event, data) {
    console.log(`Événement envoyé au chauffeur: ${event}`, data);
    
    // Simuler la réponse du chauffeur
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          event,
          timestamp: new Date().toISOString(),
          driverAcknowledged: true
        });
      }, 500);
    });
  }

  // Simuler l'annulation du trajet
  cancelTrip(reason) {
    this.emit('trip_cancelled', {
      tripId: this.tripId,
      timestamp: new Date().toISOString(),
      reason,
      cancelledBy: 'passenger'
    });
    
    return Promise.resolve({ success: true });
  }

  // Simuler la fin du trajet
  completeTrip() {
    this.emit('trip_completed', {
      tripId: this.tripId,
      timestamp: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      status: 'completed'
    });
    
    return Promise.resolve({ success: true });
  }

  disconnect() {
    this.connected = false;
    this.driverConnected = false;
    this.tripId = null;
    this.subscribers.clear();
    console.log('Déconnecté du service de trajet');
  }
}

export const tripService = new TripService();