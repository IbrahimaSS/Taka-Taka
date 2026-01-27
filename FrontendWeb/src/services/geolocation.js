// services/geolocation.js
export class GeolocationService {
  static async getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
        ...options
      });
    });
  }

  static async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      return this.formatAddress(data);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  static formatAddress(data) {
    if (!data || !data.address) return null;
    
    const { address } = data;
    const parts = [];
    
    if (address.road) parts.push(address.road);
    if (address.quarter) parts.push(address.quarter);
    if (address.suburb && !address.quarter) parts.push(address.suburb);
    if (address.city) parts.push(address.city);
    
    return parts.length > 0 ? parts.join(', ') : data.display_name;
  }

  static async geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&countrycodes=gn`
      );
      return await response.json();
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  }
}