// src/components/pricing/components/PricingCalculator.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calculator, MapPin, Clock, Droplets, CloudRain, Moon, Calendar } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Bttn';

const PricingCalculator = ({ services, zones, surcharges, currency, onClose }) => {
  const [inputs, setInputs] = useState({
    service: Object.keys(services)[0],
    distance: 5,
    time: 15,
    zone: zones[0]?.id,
    timeOfDay: '12:00',
    day: 'Mon',
    weather: 'clear'
  });

  const calculatePrice = () => {
    const service = services[inputs.service];
    const zone = zones.find(z => z.id === inputs.zone);
    
    if (!service || !zone) return 0;
    
    // Prix de base
    let price = service.baseFare;
    price += inputs.distance * service.perKm;
    price += inputs.time * service.perMinute;
    
    // Application zone
    price *= zone.multiplier;
    
    // Application suppléments
    Object.values(surcharges).forEach(surcharge => {
      if (!surcharge.enabled) return;
      
      // Supplément nuit
      if (surcharge.id === 'night') {
        const startHour = parseInt(surcharge.startTime.split(':')[0]);
        const endHour = parseInt(surcharge.endTime.split(':')[0]);
        const currentHour = parseInt(inputs.timeOfDay.split(':')[0]);
        
        if (currentHour >= startHour || currentHour < endHour) {
          price *= surcharge.multiplier;
        }
      }
      
      // Supplément week-end
      if (surcharge.id === 'weekend' && surcharge.days.includes(inputs.day)) {
        price *= surcharge.multiplier;
      }
      
      // Supplément pluie
      if (surcharge.id === 'rain' && inputs.weather === 'rain') {
        price *= surcharge.multiplier;
      }
    });
    
    // Minimum garanti
    price = Math.max(price, service.minimumFare || 0);
    
    return Math.round(price);
  };

  const price = calculatePrice();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-700 to-teal-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-6 h-6" />
              <h3 className="text-xl font-bold">Calculateur de prix</h3>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/80 text-sm mt-1">Simulez le prix d'une course avec tous les paramètres</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Paramètres */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service et zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de service
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(services).map(([id, service]) => (
                      <button
                        key={id}
                        onClick={() => setInputs({ ...inputs, service: id })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          inputs.service === id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{service.icon}</div>
                          <span className="text-sm font-medium text-gray-700">{service.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone tarifaire
                  </label>
                  <div className="space-y-2">
                    {zones.map(zone => (
                      <label key={zone.id} className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl hover:border-gray-300 cursor-pointer">
                        <input
                          type="radio"
                          name="zone"
                          value={zone.id}
                          checked={inputs.zone === zone.id}
                          onChange={(e) => setInputs({ ...inputs, zone: e.target.value })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="font-medium text-gray-700">{zone.name}</span>
                          <span className="text-sm text-gray-500">({zone.multiplier}×)</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Distance et durée */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance ({inputs.distance} km)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-blue-500 w-5 h-5" />
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="0.5"
                      value={inputs.distance}
                      onChange={(e) => setInputs({ ...inputs, distance: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-gradient-to-r from-blue-200 to-teal-200 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée ({inputs.time} min)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 text-teal-500 w-5 h-5" />
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={inputs.time}
                      onChange={(e) => setInputs({ ...inputs, time: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gradient-to-r from-teal-200 to-green-200 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>5 min</span>
                      <span>120 min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      Heure de la journée
                    </div>
                  </label>
                  <input
                    type="time"
                    value={inputs.timeOfDay}
                    onChange={(e) => setInputs({ ...inputs, timeOfDay: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Moon className="w-4 h-4 mr-2 text-indigo-600" />
                      Jour de la semaine
                    </div>
                  </label>
                  <select
                    value={inputs.day}
                    onChange={(e) => setInputs({ ...inputs, day: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    <option value="Mon">Lundi</option>
                    <option value="Tue">Mardi</option>
                    <option value="Wed">Mercredi</option>
                    <option value="Thu">Jeudi</option>
                    <option value="Fri">Vendredi</option>
                    <option value="Sat">Samedi</option>
                    <option value="Sun">Dimanche</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 mr-2 text-teal-600" />
                      Conditions météo
                    </div>
                  </label>
                  <select
                    value={inputs.weather}
                    onChange={(e) => setInputs({ ...inputs, weather: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                  >
                    <option value="clear">☀️ Clair</option>
                    <option value="cloudy">☁️ Nuageux</option>
                    <option value="rain">🌧️ Pluie</option>
                    <option value="storm">⛈️ Orage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Résultat */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-teal-50 h-full">
                <CardContent className="p-6">
                  <div className="text-center space-y-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Prix estimé</p>
                      <p className="text-5xl font-bold text-blue-800">
                        {price.toLocaleString()}
                        <span className="text-2xl ml-2 text-gray-600">{currency}</span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium text-gray-800">
                          {services[inputs.service]?.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium text-gray-800">
                          {inputs.distance} km
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Durée:</span>
                        <span className="font-medium text-gray-800">
                          {inputs.time} min
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Zone:</span>
                        <span className="font-medium text-gray-800">
                          {zones.find(z => z.id === inputs.zone)?.name}
                        </span>
                      </div>
                    </div>

                    {/* Suppléments appliqués */}
                    <AnimatePresence>
                      {Object.values(surcharges).filter(s => s.enabled).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-blue-200"
                        >
                          <p className="text-sm font-medium text-gray-700 mb-3">Suppléments appliqués</p>
                          <div className="space-y-2">
                            {Object.values(surcharges).map(surcharge => {
                              if (!surcharge.enabled) return null;
                              
                              let applies = false;
                              if (surcharge.id === 'night') {
                                const startHour = parseInt(surcharge.startTime.split(':')[0]);
                                const endHour = parseInt(surcharge.endTime.split(':')[0]);
                                const currentHour = parseInt(inputs.timeOfDay.split(':')[0]);
                                applies = currentHour >= startHour || currentHour < endHour;
                              } else if (surcharge.id === 'weekend') {
                                applies = surcharge.days.includes(inputs.day);
                              } else if (surcharge.id === 'rain') {
                                applies = inputs.weather === 'rain';
                              }
                              
                              if (applies) {
                                return (
                                  <div key={surcharge.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">{surcharge.name}</span>
                                    <span className="font-bold text-blue-600">
                                      {surcharge.multiplier}×
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Fermer
            </Button>
            <Button
              variant="primary"
              className="bg-gradient-to-r from-blue-700 to-teal-700"
              onClick={() => {
                navigator.clipboard.writeText(`${price.toLocaleString()} ${currency}`);
                alert('Prix copié dans le presse-papier !');
              }}
            >
              Copier le prix
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PricingCalculator;