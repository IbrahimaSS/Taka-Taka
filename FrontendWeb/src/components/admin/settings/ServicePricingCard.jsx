// src/components/pricing/components/ServicePricingCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, MapPin, Clock, Users, Percent, Copy, Eye, EyeOff, Zap, Target } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Bttn';
import Switch from '../ui/Switch';
import Badge from '../ui/Badge';

const ServicePricingCard = ({ service, serviceId, onUpdate,  currency }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewDistance, setPreviewDistance] = useState(5);
  const [previewTime, setPreviewTime] = useState(15);

  const calculatePreview = () => {
    const base = service.baseFare || 0;
    const distance = previewDistance * (service.perKm || 0);
    const time = previewTime * (service.perMinute || 0);
    return base + distance + time;
  };

  const colorMap = {
    teal: { bg: 'from-teal-500 to-teal-600', text: 'text-teal-600', light: 'teal-100' },
    blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600', light: 'blue-100' },
    indigo: { bg: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600', light: 'indigo-100' },
    green: { bg: 'from-green-500 to-green-600', text: 'text-green-600', light: 'green-100' }
  };

  const color = colorMap[service.color] || colorMap.teal;

  return (
    <Card className="border-2 border-gray-100 hover:border-blue-100 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color.bg} flex items-center justify-center text-white text-2xl shadow-lg`}>
              {service.icon}
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">{service.name}</CardTitle>
              <div className="flex items-center space-x-3 mt-2">
                <Badge variant={service.enabled ? 'success' : 'danger'}>
                  {service.enabled ? '● Actif' : '○ Inactif'}
                </Badge>
                <span className="text-sm text-gray-500">Commission: {service.commission}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Switch
              checked={service.enabled}
              onChange={() => onUpdate(serviceId, { enabled: !service.enabled })}
              size="lg"
            />
            <Button
              variant="ghost"
              icon={showAdvanced ? EyeOff : Eye}
              onClick={() => setShowAdvanced(!showAdvanced)}
              tooltip={showAdvanced ? 'Vue simple' : 'Vue détaillée'}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tarifs de base */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <label className="block">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-${color.light} flex items-center justify-center`}>
                  <DollarSign className={`${color.text} w-4 h-4`} />
                </div>
                <span className="font-medium text-gray-700">Tarif de base</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={service.baseFare}
                  onChange={(e) => onUpdate(serviceId, { baseFare: parseInt(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-lg font-bold text-gray-800 outline-none focus:border-blue-500 transition-all"
                />
                <span className="absolute left-4 top-3.5 text-gray-500 font-medium">{currency}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Prix minimum pour une course</p>
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-${color.light} flex items-center justify-center`}>
                  <MapPin className={`${color.text} w-4 h-4`} />
                </div>
                <span className="font-medium text-gray-700">Par kilomètre</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={service.perKm}
                  onChange={(e) => onUpdate(serviceId, { perKm: parseInt(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-lg font-bold text-gray-800 outline-none focus:border-blue-500 transition-all"
                />
                <span className="absolute left-4 top-3.5 text-gray-500 font-medium">{currency}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Coût par km parcouru</p>
            </label>
          </div>

          <div className="space-y-4">
            <label className="block">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-8 h-8 rounded-lg bg-${color.light} flex items-center justify-center`}>
                  <Clock className={`${color.text} w-4 h-4`} />
                </div>
                <span className="font-medium text-gray-700">Par minute</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={service.perMinute}
                  onChange={(e) => onUpdate(serviceId, { perMinute: parseInt(e.target.value) || 0 })}
                  className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 text-lg font-bold text-gray-800 outline-none focus:border-blue-500 transition-all"
                />
                <span className="absolute left-4 top-3.5 text-gray-500 font-medium">{currency}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Coût par minute d'attente/trafic</p>
            </label>
          </div>
        </div>

        {/* Simulation de prix */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl border-2 border-blue-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            Simulateur de prix
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={previewDistance}
                  onChange={(e) => setPreviewDistance(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>1 km</span>
                  <span className="font-bold text-blue-600">{previewDistance} km</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (minutes)
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={previewTime}
                  onChange={(e) => setPreviewTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5 min</span>
                  <span className="font-bold text-blue-600">{previewTime} min</span>
                  <span>120 min</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-blue-200 p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Prix estimé</p>
                <p className="text-3xl font-bold text-blue-800">
                  {calculatePreview().toLocaleString()} {currency}
                </p>
                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Base:</span>
                    <span>{service.baseFare?.toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance ({previewDistance}km):</span>
                    <span>{(previewDistance * service.perKm).toLocaleString()} {currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temps ({previewTime}min):</span>
                    <span>{(previewTime * service.perMinute).toLocaleString()} {currency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paramètres avancés */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span>Tarif minimum</span>
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={service.minimumFare || 0}
                    onChange={(e) => onUpdate(serviceId, { minimumFare: parseInt(e.target.value) || 0 })}
                    className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 transition-all"
                  />
                  <span className="absolute left-4 top-3.5 text-gray-500">{currency}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Percent className="w-4 h-4 text-teal-600" />
                    <span>Commission plateforme</span>
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={service.commission || 0}
                    onChange={(e) => onUpdate(serviceId, { commission: parseFloat(e.target.value) || 0 })}
                    className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-teal-500 transition-all"
                  />
                  <span className="absolute left-4 top-3.5 text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Capacité maximale (passagers)</span>
                </div>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={service.maxPassengers || 1}
                onChange={(e) => onUpdate(serviceId, { maxPassengers: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>1 passager</span>
                <span className="font-bold text-indigo-600">{service.maxPassengers || 1} passagers</span>
                <span>10 passagers</span>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex flex-wrap gap-3 w-full">
         
          <Button
            variant="primary"
            className="flex-1 bg-gradient-to-r from-blue-700 to-teal-700"
            onClick={() => onUpdate(serviceId, { ...service })}
          >
            Appliquer les changements
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ServicePricingCard;