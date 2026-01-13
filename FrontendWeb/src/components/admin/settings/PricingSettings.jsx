// src/components/settings/components/PricingSettings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Moon, Calendar, Plane, Clock, Package, Percent } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Switch from '../ui/Switch';
import ServiceCard from './ServiceCard';
import Button from '../ui/Bttn';
import Badge from '../ui/Badge';

const PricingSettings = ({ settings, updateNestedSetting, showToast }) => {
  const [activeService, setActiveService] = useState('motoTaxi');

  const services = {
    motoTaxi: {
      label: 'Moto-taxi',
      icon: '🛵',
      color: 'green',
      description: 'Service de moto-taxi économique et rapide'
    },
    sharedTaxi: {
      label: 'Taxi partagé',
      icon: '🚗',
      color: 'blue',
      description: 'Taxi partagé pour plusieurs passagers'
    },
    privateCar: {
      label: 'Voiture privée',
      icon: '🚙',
      color: 'purple',
      description: 'Voiture privée avec chauffeur'
    },
    delivery: {
      label: 'Livraison',
      icon: '📦',
      color: 'orange',
      description: 'Service de livraison de colis'
    }
  };

  const handleToggleService = (serviceName) => {
    const currentValue = settings.services?.[serviceName]?.enabled || false;
    updateNestedSetting('services', serviceName, 'enabled', !currentValue);
  };

  const handleUpdatePrice = (serviceName, field, value) => {
    updateNestedSetting('services', serviceName, field, value);
  };

  const handleUpdateSurcharge = (key, field, value) => {
    updateNestedSetting('specialPricing', key, field, value);
  };

  return (
    <div className="space-y-8">
      {/* Services principaux */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tarification des services</h2>
          <Badge variant="info" size="md">
            {Object.values(settings.services || {}).filter(s => s.enabled).length} services actifs
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(services).map(([key, service]) => (
            <ServiceCard
              key={key}
              name={key}
              service={settings.services?.[key] || {}}
              icon={service.icon}
              color={service.color}
              onToggle={handleToggleService}
              onUpdatePrice={handleUpdatePrice}
              showAdvanced={activeService === key}
            />
          ))}
        </div>
      </div>

      {/* Tarifications spéciales */}
      <Card hoverable className="border-2 border-gray-100 hover:border-yellow-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-yellow-800 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Suppléments et tarifications spéciales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Supplément nuit */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Moon className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-800">Supplément nuit</span>
                  </div>
                  <Switch
                    checked={settings.specialPricing?.nightSurcharge?.enabled || false}
                    onChange={() => handleUpdateSurcharge('nightSurcharge', 'enabled', 
                      !settings.specialPricing?.nightSurcharge?.enabled
                    )}
                  />
                </div>
                
                {settings.specialPricing?.nightSurcharge?.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Taux de supplément</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          step="0.1"
                          value={settings.specialPricing.nightSurcharge.rate || 1.5}
                          onChange={(e) => handleUpdateSurcharge('nightSurcharge', 'rate', parseFloat(e.target.value))}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
                        />
                        <span className="ml-2 text-gray-600">× tarif normal</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Début</label>
                        <input
                          type="time"
                          value={settings.specialPricing.nightSurcharge.startTime || '20:00'}
                          onChange={(e) => handleUpdateSurcharge('nightSurcharge', 'startTime', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Fin</label>
                        <input
                          type="time"
                          value={settings.specialPricing.nightSurcharge.endTime || '06:00'}
                          onChange={(e) => handleUpdateSurcharge('nightSurcharge', 'endTime', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Supplément week-end */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-800">Supplément week-end</span>
                  </div>
                  <Switch
                    checked={settings.specialPricing?.weekendSurcharge?.enabled || false}
                    onChange={() => handleUpdateSurcharge('weekendSurcharge', 'enabled', 
                      !settings.specialPricing?.weekendSurcharge?.enabled
                    )}
                  />
                </div>
                
                {settings.specialPricing?.weekendSurcharge?.enabled && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Taux de supplément</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={settings.specialPricing.weekendSurcharge.rate || 1.2}
                        onChange={(e) => handleUpdateSurcharge('weekendSurcharge', 'rate', parseFloat(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                      />
                      <span className="ml-2 text-gray-600">× tarif normal</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Appliqué samedi et dimanche
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Frais d'aéroport */}
            <Card className="border-2 border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Plane className="w-5 h-5 text-teal-600 mr-2" />
                    <span className="font-medium text-gray-800">Frais d'aéroport</span>
                  </div>
                  <Switch
                    checked={settings.specialPricing?.airportFee?.enabled || false}
                    onChange={() => handleUpdateSurcharge('airportFee', 'enabled', 
                      !settings.specialPricing?.airportFee?.enabled
                    )}
                  />
                </div>
                
                {settings.specialPricing?.airportFee?.enabled && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Montant fixe</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        value={settings.specialPricing.airportFee.amount || 5000}
                        onChange={(e) => handleUpdateSurcharge('airportFee', 'amount', parseInt(e.target.value))}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500"
                      />
                      <span className="ml-2 text-gray-600">GNF</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Ajouté aux courses depuis/vers l'aéroport
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Frais d'attente */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Frais d'attente
                </h4>
                <p className="text-sm text-gray-600">
                  Frais appliqués après le temps d'attente gratuit
                </p>
              </div>
              <Switch
                checked={settings.specialPricing?.waitingFee?.enabled || false}
                onChange={() => handleUpdateSurcharge('waitingFee', 'enabled', 
                  !settings.specialPricing?.waitingFee?.enabled
                )}
              />
            </div>
            
            {settings.specialPricing?.waitingFee?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minutes d'attente gratuites
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={settings.specialPricing.waitingFee.freeMinutes || 5}
                      onChange={(e) => handleUpdateSurcharge('waitingFee', 'freeMinutes', parseInt(e.target.value))}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
                    />
                    <span className="ml-3 text-gray-600">minutes</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarif par minute supplémentaire
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      value={settings.specialPricing.waitingFee.perMinute || 500}
                      onChange={(e) => handleUpdateSurcharge('waitingFee', 'perMinute', parseInt(e.target.value))}
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
                    />
                    <span className="ml-3 text-gray-600">GNF/min</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Résumé des tarifs */}
      <Card className="border-2 border-green-100 bg-gradient-to-r from-green-50 to-teal-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Résumé des tarifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-green-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-green-800">Service</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-green-800">Base</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-green-800">Par km</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-green-800">Par min</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-green-800">Exemple (5km, 15min)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(services).map(([key, service]) => {
                  const s = settings.services?.[key] || {};
                  if (!s.enabled) return null;
                  
                  const examplePrice = (s.basePrice || 0) + (5 * (s.perKm || 0)) + (15 * (s.perMinute || 0));
                  
                  return (
                    <tr key={key} className="border-b border-green-100 hover:bg-green-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{service.icon}</span>
                          <span className="font-medium text-gray-800">{service.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">
                          {(s.basePrice || 0).toLocaleString()} GNF
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">
                          {(s.perKm || 0).toLocaleString()} GNF
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">
                          {(s.perMinute || 0).toLocaleString()} GNF
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-green-700">
                          {examplePrice.toLocaleString()} GNF
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {s.basePrice?.toLocaleString()} + (5 × {s.perKm?.toLocaleString()}) + (15 × {s.perMinute?.toLocaleString()})
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-white rounded-xl border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Les tarifs sont en {settings.currency}. Les suppléments s'appliquent selon les conditions configurées.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => showToast('Info', 'Export des tarifs disponible prochainement', 'info')}
              >
                Exporter les tarifs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingSettings;