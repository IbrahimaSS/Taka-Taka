// src/components/settings/components/ServiceCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, Clock, Zap, CheckCircle, XCircle } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Bttn';
import Switch from '../ui/Switch';
import Badge from '../ui/Badge';

const ServiceCard = ({
  service,
  name,
  icon: Icon,
  color = 'blue',
  onToggle,
  onUpdatePrice,
  showAdvanced = false
}) => {
  const colors = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700',
    teal: 'from-teal-600 to-teal-700'
  };

  const getServiceIcon = (serviceName) => {
    const icons = {
      motoTaxi: '🛵',
      sharedTaxi: '🚗',
      privateCar: '🚙',
      delivery: '📦'
    };
    return icons[serviceName] || '🚕';
  };

  return (
    <Card hoverable className={`border-2 ${service.enabled ? 'border-green-200' : 'border-gray-200'} transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white text-xl`}>
              {getServiceIcon(name)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{service.label || name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={service.enabled ? 'success' : 'danger'} size="sm">
                  {service.enabled ? 'Actif' : 'Inactif'}
                </Badge>
                <span className="text-sm text-gray-500">
                  {service.basePrice ? `${service.basePrice.toLocaleString()} GNF` : 'Non configuré'}
                </span>
              </div>
            </div>
          </div>
          
          <Switch
            checked={service.enabled}
            onChange={() => onToggle(name)}
            size="lg"
          />
        </div>

        {service.enabled && (
          <>
            {/* Tarifs de base */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Tarif de base</span>
                </div>
                <input
                  type="number"
                  value={service.basePrice || 0}
                  onChange={(e) => onUpdatePrice(name, 'basePrice', parseInt(e.target.value))}
                  className="w-full text-center border-2 border-gray-200 rounded-lg px-3 py-2 text-lg font-bold text-gray-800 outline-none focus:border-green-500 transition-all"
                />
                <span className="text-xs text-gray-500 mt-1">GNF</span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Par km</span>
                </div>
                <input
                  type="number"
                  value={service.perKm || 0}
                  onChange={(e) => onUpdatePrice(name, 'perKm', parseInt(e.target.value))}
                  className="w-full text-center border-2 border-gray-200 rounded-lg px-3 py-2 text-lg font-bold text-gray-800 outline-none focus:border-green-500 transition-all"
                />
                <span className="text-xs text-gray-500 mt-1">GNF/km</span>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Par minute</span>
                </div>
                <input
                  type="number"
                  value={service.perMinute || 0}
                  onChange={(e) => onUpdatePrice(name, 'perMinute', parseInt(e.target.value))}
                  className="w-full text-center border-2 border-gray-200 rounded-lg px-3 py-2 text-lg font-bold text-gray-800 outline-none focus:border-green-500 transition-all"
                />
                <span className="text-xs text-gray-500 mt-1">GNF/min</span>
              </div>
            </div>

            {/* Calculatrice de prix */}
            {showAdvanced && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Simulateur de prix
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Distance (km)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      defaultValue="5"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Durée (min)</label>
                    <input
                      type="number"
                      min="0"
                      defaultValue="15"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prix estimé:</span>
                    <span className="text-xl font-bold text-green-600">
                      {((service.basePrice || 0) + (5 * (service.perKm || 0)) + (15 * (service.perMinute || 0))).toLocaleString()} GNF
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;