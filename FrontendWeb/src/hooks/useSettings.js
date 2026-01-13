// src/components/settings/hooks/useSettings.js
import { useState, useEffect, useCallback } from 'react';

export const useSettings = (initialSettings = {}) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('takataka_settings');
    return savedSettings 
      ? JSON.parse(savedSettings)
      : {
          // Général
          platformName: 'Taka Taka',
          currency: 'GNF',
          timezone: 'Africa/Conakry',
          language: 'fr',
          maintenanceMode: false,
          maintenanceMessage: 'Plateforme en maintenance. Veuillez réessayer plus tard.',
          
          // Services
          services: {
            motoTaxi: { enabled: true, basePrice: 5000, perKm: 1500, perMinute: 300 },
            sharedTaxi: { enabled: true, basePrice: 10000, perKm: 2000, perMinute: 400 },
            privateCar: { enabled: true, basePrice: 15000, perKm: 2500, perMinute: 500 },
            delivery: { enabled: false, basePrice: 3000, perKm: 1000, perKmThreshold: 5 }
          },
          
          // Paiements
          payments: {
            cash: { enabled: true, minAmount: 1000 },
            orangeMoney: { enabled: true, commission: 2.5, apiKey: '' },
            mtnMoney: { enabled: true, commission: 2.5, apiKey: '' },
            visaMastercard: { enabled: false, commission: 3.5 }
          },
          
          // Notifications
          notifications: {
            whatsapp: { enabled: true, template: 'Bonjour {name}, votre course est confirmée!' },
            sms: { enabled: false, provider: 'africastalking', apiKey: '' },
            email: { enabled: true, provider: 'smtp', smtpConfig: {} },
            push: { enabled: true }
          },
          
          // API
          api: {
            googleMaps: { enabled: true, apiKey: '' },
            openStreetMap: { enabled: false },
            paymentProviders: [],
            webhookUrl: '',
            rateLimit: 100,
            corsDomains: []
          },
          
          // Sécurité
          security: {
            twoFactorAuth: true,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            ipWhitelist: []
          },
          
          // Tarifications spéciales
          specialPricing: {
            nightSurcharge: { enabled: true, rate: 1.5, startTime: '20:00', endTime: '06:00' },
            weekendSurcharge: { enabled: true, rate: 1.2 },
            holidaySurcharge: { enabled: true, rate: 1.3 },
            airportFee: { enabled: true, amount: 5000 },
            waitingFee: { enabled: true, perMinute: 500, freeMinutes: 5 }
          },
          ...initialSettings
        };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Sauvegarder automatiquement les changements
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('takataka_settings', JSON.stringify(settings));
        setHasChanges(false);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [settings, hasChanges]);

  const updateSetting = useCallback((path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      setHasChanges(true);
      return newSettings;
    });
  }, []);

  const updateNestedSetting = useCallback((category, key, subKey, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: {
          ...prev[category][key],
          [subKey]: value
        }
      }
    }));
    setHasChanges(true);
  }, []);

  const resetToDefaults = useCallback(() => {
    localStorage.removeItem('takataka_settings');
    setSettings({
      platformName: 'Taka Taka',
      currency: 'GNF',
      timezone: 'Africa/Conakry',
      language: 'fr',
      maintenanceMode: false,
      maintenanceMessage: 'Plateforme en maintenance. Veuillez réessayer plus tard.',
      services: {
        motoTaxi: { enabled: true, basePrice: 5000, perKm: 1500, perMinute: 300 },
        sharedTaxi: { enabled: true, basePrice: 10000, perKm: 2000, perMinute: 400 },
        privateCar: { enabled: true, basePrice: 15000, perKm: 2500, perMinute: 500 }
      },
      payments: {
        cash: { enabled: true, minAmount: 1000 },
        orangeMoney: { enabled: true, commission: 2.5, apiKey: '' },
        mtnMoney: { enabled: true, commission: 2.5, apiKey: '' }
      },
      notifications: {
        whatsapp: { enabled: true, template: 'Bonjour {name}, votre course est confirmée!' },
        sms: { enabled: false, provider: 'africastalking', apiKey: '' },
        email: { enabled: true, provider: 'smtp' }
      },
      api: {
        googleMaps: { enabled: true, apiKey: '' },
        webhookUrl: '',
        rateLimit: 100
      }
    });
  }, []);

  const exportSettings = useCallback(() => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `takataka_settings_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [settings]);

  const importSettings = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          localStorage.setItem('takataka_settings', JSON.stringify(importedSettings));
          resolve();
        } catch (error) {
          reject(new Error('Fichier JSON invalide'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
      reader.readAsText(file);
    });
  }, []);

  return {
    settings,
    isLoading,
    hasChanges,
    updateSetting,
    updateNestedSetting,
    resetToDefaults,
    exportSettings,
    importSettings
  };
};