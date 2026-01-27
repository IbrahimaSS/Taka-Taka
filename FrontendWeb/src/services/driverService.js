// services/driverService.js
// Simulation d'un service de recherche de chauffeurs

export class DriverService {
  static drivers = [
    {
      id: 1,
      name: "Mamadou Diallo",
      phone: "+224 623 09 02 24",
      rating: 4.8,
      vehicle: {
        type: "taxi",
        brand: "Toyota",
        model: "Corolla",
        color: "Blanc",
        plate: "AB-123-CD",
        year: 2020
      },
      location: { lat: 9.6412, lng: -13.5784 },
      available: true,
      priceMultiplier: 1.0,
      distance: 0.8
    },
    {
      id: 2,
      name: "Ibrahima Sow",
      phone: "+224 655 44 33 22",
      rating: 4.5,
      vehicle: {
        type: "moto",
        brand: "Yamaha",
        model: "Crypton",
        color: "Rouge",
        plate: "EF-456-GH",
        year: 2019
      },
      location: { lat: 9.6425, lng: -13.5790 },
      available: true,
      priceMultiplier: 0.9,
      distance: 1.2
    },
    {
      id: 3,
      name: "Fatoumata Barry",
      phone: "+224 622 11 22 33",
      rating: 4.9,
      vehicle: {
        type: "voiture",
        brand: "Mercedes",
        model: "Classe C",
        color: "Noir",
        plate: "IJ-789-KL",
        year: 2021
      },
      location: { lat: 9.6398, lng: -13.5772 },
      available: true,
      priceMultiplier: 1.2,
      distance: 0.5
    },
    {
      id: 4,
      name: "Sekou Bah",
      phone: "+224 633 44 55 66",
      rating: 4.3,
      vehicle: {
        type: "taxi",
        brand: "Honda",
        model: "Civic",
        color: "Bleu",
        plate: "MN-012-OP",
        year: 2018
      },
      location: { lat: 9.6430, lng: -13.5800 },
      available: true,
      priceMultiplier: 0.95,
      distance: 1.5
    }
  ];

  static async findNearbyDrivers(userLocation, vehicleType = null, radiusKm = 5) {
    console.log('Searching drivers near:', userLocation);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filtrer les chauffeurs disponibles
        let drivers = this.drivers.filter(driver => 
          driver.available && 
          this.calculateDistance(
            userLocation[0], userLocation[1],
            driver.location.lat, driver.location.lng
          ) <= radiusKm
        );

        // Filtrer par type de véhicule si spécifié
        if (vehicleType) {
          drivers = drivers.filter(driver => driver.vehicle.type === vehicleType);
        }

        // Trier par distance
        drivers.sort((a, b) => a.distance - b.distance);

        resolve({
          success: true,
          count: drivers.length,
          drivers: drivers.map(driver => ({
            ...driver,
            eta: Math.round(driver.distance * 5), // ~5 min par km
            formattedDistance: `${driver.distance.toFixed(1)} km`
          }))
        });
      }, 1500); // Simuler un délai réseau
    });
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static async assignDriver(tripData, driverId = null) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let driver;
        
        if (driverId) {
          driver = this.drivers.find(d => d.id === driverId);
        } else {
          // Trouver le chauffeur le plus proche
          const availableDrivers = this.drivers.filter(d => 
            d.available && 
            d.vehicle.type === tripData.vehicleType
          );
          
          if (availableDrivers.length === 0) {
            reject({ success: false, message: 'Aucun chauffeur disponible' });
            return;
          }
          
          // Trouver le plus proche
          driver = availableDrivers.reduce((closest, current) => {
            const closestDist = this.calculateDistance(
              tripData.pickupCoords[0], tripData.pickupCoords[1],
              closest.location.lat, closest.location.lng
            );
            const currentDist = this.calculateDistance(
              tripData.pickupCoords[0], tripData.pickupCoords[1],
              current.location.lat, current.location.lng
            );
            return currentDist < closestDist ? current : closest;
          });
        }

        // Marquer le chauffeur comme indisponible
        driver.available = false;

        resolve({
          success: true,
          driver: {
            ...driver,
            eta: Math.round(driver.distance * 5),
            tripId: `TRIP-${Date.now()}`,
            assignedAt: new Date().toISOString(),
            status: 'on_the_way'
          },
          message: 'Chauffeur assigné avec succès'
        });
      }, 2000);
    });
  }

  static async cancelAssignment(driverId) {
    const driver = this.drivers.find(d => d.id === driverId);
    if (driver) {
      driver.available = true;
    }
    return { success: true };
  }

  static async updateDriverLocation(driverId, newLocation) {
    const driver = this.drivers.find(d => d.id === driverId);
    if (driver) {
      driver.location = newLocation;
    }
    return { success: true };
  }
}