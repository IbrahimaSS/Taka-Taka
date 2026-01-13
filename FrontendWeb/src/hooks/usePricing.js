// src/components/pricing/hooks/usePricing.js
import { useState, useEffect, useCallback } from 'react';

export const usePricing = () => {
  const [pricing, setPricing] = useState(() => {
    const saved = localStorage.getItem('takataka_pricing_v2');
    return saved ? JSON.parse(saved) : {
      // Services de base
      services: {
        motoTaxi: {
          name: 'Moto-taxi',
          icon: '🛵',
          color: 'teal',
          enabled: true,
          baseFare: 5000,
          perKm: 1500,
          perMinute: 300,
          minimumFare: 3000,
          commission: 20,
          zones: {}
        },
        sharedTaxi: {
          name: 'Taxi partagé',
          icon: '🚗',
          color: 'blue',
          enabled: true,
          baseFare: 10000,
          perKm: 2000,
          perMinute: 400,
          minimumFare: 7000,
          commission: 25,
          zones: {}
        },
        privateCar: {
          name: 'Voiture privée',
          icon: '🚙',
          color: 'indigo',
          enabled: true,
          baseFare: 15000,
          perKm: 2500,
          perMinute: 500,
          minimumFare: 12000,
          commission: 30,
          zones: {}
        }
      },
      
      // Zones tarifaires
      zones: [
        { 
          id: 'zone1', 
          name: 'Centre-ville', 
          color: '#3b82f6',
          multiplier: 1.0,
          coordinates: []
        },
        { 
          id: 'zone2', 
          name: 'Périphérie', 
          color: '#10b981',
          multiplier: 1.2,
          coordinates: []
        },
        { 
          id: 'zone3', 
          name: 'Banlieue', 
          color: '#8b5cf6',
          multiplier: 1.5,
          coordinates: []
        }
      ],
      
      // Suppléments dynamiques
      surcharges: {
        night: {
          enabled: true,
          name: 'Supplément nuit',
          icon: '🌙',
          multiplier: 1.5,
          startTime: '20:00',
          endTime: '06:00',
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        weekend: {
          enabled: true,
          name: 'Supplément week-end',
          icon: '🎉',
          multiplier: 1.2,
          days: ['Sat', 'Sun']
        },
        peak: {
          enabled: true,
          name: 'Heures de pointe',
          icon: '📈',
          multiplier: 1.3,
          times: ['07:00-09:00', '17:00-19:00'],
          days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
        },
        airport: {
          enabled: true,
          name: 'Frais aéroport',
          icon: '✈️',
          fixedFee: 5000,
          appliesTo: ['privateCar', 'sharedTaxi']
        },
        rain: {
          enabled: false,
          name: 'Supplément pluie',
          icon: '🌧️',
          multiplier: 1.4,
          weatherBased: true
        }
      },
      
      // Tarifs spéciaux
      specialRates: [
        {
          id: 'student',
          name: 'Tarif étudiant',
          discount: 15,
          code: 'ETUDIANT15',
          conditions: { minAge: 18, maxAge: 28 }
        },
        {
          id: 'senior',
          name: 'Tarif sénior',
          discount: 10,
          code: 'SENIOR10',
          conditions: { minAge: 60 }
        },
        {
          id: 'frequent',
          name: 'Abonné fréquent',
          discount: 20,
          code: 'FREQUENT20',
          conditions: { minRides: 10 }
        }
      ],
      
      // Historique des changements
      history: [],
      
      // Paramètres généraux
      settings: {
        currency: 'GNF',
        rounding: 'nearest',
        displayFormat: 'full',
        autoUpdate: true,
        version: '2.0'
      }
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('motoTaxi');
  const [selectedZone, setSelectedZone] = useState(null);

  // Sauvegarder automatiquement
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('takataka_pricing_v2', JSON.stringify(pricing));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [pricing]);

  // Mettre à jour un service
  const updateService = useCallback((serviceId, updates) => {
    setPricing(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceId]: {
          ...prev.services[serviceId],
          ...updates
        }
      }
    }));
  }, []);

  // Mettre à jour une zone
  const updateZone = useCallback((zoneId, updates) => {
    setPricing(prev => ({
      ...prev,
      zones: prev.zones.map(zone =>
        zone.id === zoneId ? { ...zone, ...updates } : zone
      )
    }));
  }, []);

  // Mettre à jour un supplément
  const updateSurcharge = useCallback((surchargeId, updates) => {
    setPricing(prev => ({
      ...prev,
      surcharges: {
        ...prev.surcharges,
        [surchargeId]: {
          ...prev.surcharges[surchargeId],
          ...updates
        }
      }
    }));
  }, []);

  // Ajouter un tarif spécial
  const addSpecialRate = useCallback((rate) => {
    setPricing(prev => ({
      ...prev,
      specialRates: [...prev.specialRates, { ...rate, id: Date.now().toString() }]
    }));
  }, []);

  // Dupliquer un service
  const duplicateService = useCallback((serviceId, newId, newName) => {
    const original = pricing.services[serviceId];
    setPricing(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [newId]: {
          ...original,
          name: newName,
          zones: { ...original.zones }
        }
      }
    }));
  }, [pricing.services]);

  // Appliquer un changement à tous les services
  const applyToAllServices = useCallback((updates) => {
    setPricing(prev => ({
      ...prev,
      services: Object.keys(prev.services).reduce((acc, key) => ({
        ...acc,
        [key]: { ...prev.services[key], ...updates }
      }), {})
    }));
  }, []);

  // Exporter les tarifs
  const exportPricing = useCallback(() => {
    const dataStr = JSON.stringify(pricing, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `tarifs_${new Date().toISOString().split('T')[0]}.json`);
    link.click();
  }, [pricing]);

  // Importer les tarifs
  const importPricing = useCallback(async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setPricing(imported);
          resolve();
        } catch (error) {
          reject(new Error('Fichier JSON invalide'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture'));
      reader.readAsText(file);
    });
  }, []);

  return {
    pricing,
    isLoading,
    selectedService,
    selectedZone,
    setSelectedService,
    setSelectedZone,
    updateService,
    updateZone,
    updateSurcharge,
    addSpecialRate,
    duplicateService,
    applyToAllServices,
    exportPricing,
    importPricing
  };
};