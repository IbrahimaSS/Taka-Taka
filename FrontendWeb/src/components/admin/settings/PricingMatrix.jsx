// src/components/pricing/components/PricingMatrix.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Filter, Download, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Bttn';
import Badge from '../ui/Badge';

const PricingMatrix = ({ services, zones }) => {
  const [viewMode, setViewMode] = useState('grid'); // grid, list, comparison
  const [showDetails, setShowDetails] = useState(false);
  const [selectedZones, setSelectedZones] = useState(zones.map(z => z.id));

  const getServicePriceInZone = (serviceId, zoneId) => {
    const service = services[serviceId];
    const zone = zones.find(z => z.id === zoneId);
    if (!service || !zone) return 0;
    
    // Exemple: 5km, 15min pour la comparaison
    const base = service.baseFare || 0;
    const distance = 5 * (service.perKm || 0);
    const time = 15 * (service.perMinute || 0);
    return Math.round((base + distance + time) * zone.multiplier);
  };

  const colorScale = (price, minPrice, maxPrice) => {
    if (price <= minPrice) return 'from-green-100 to-green-200';
    if (price <= minPrice + (maxPrice - minPrice) * 0.33) return 'from-teal-100 to-teal-200';
    if (price <= minPrice + (maxPrice - minPrice) * 0.66) return 'from-blue-100 to-blue-200';
    return 'from-indigo-100 to-indigo-200';
  };

  // Calculer les prix min/max
  const allPrices = Object.keys(services)
    .flatMap(serviceId => 
      zones
        .filter(z => selectedZones.includes(z.id))
        .map(zone => getServicePriceInZone(serviceId, zone.id))
    );
  
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <Card className="border-2 border-gray-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Matrice tarifaire</CardTitle>
              <p className="text-gray-600 text-sm">Comparaison visuelle des prix par service et zone</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="border-2 border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                >
                  <option value="grid">Vue grille</option>
                  <option value="list">Vue liste</option>
                  <option value="comparison">Comparaison</option>
                </select>
              </div>
              
              <Button
                variant="outline"
                icon={showDetails ? EyeOff : Eye}
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Détails' : 'Résumé'}
              </Button>
              
              <Button
                variant="primary"
                className="bg-gradient-to-r from-blue-700 to-teal-700"
                icon={Download}
              >
                Exporter CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Légende */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-xl border border-green-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">Bas</span>
            <TrendingDown className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {Math.round(minPrice * 0.33).toLocaleString()}
          </p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-teal-100 to-teal-200 rounded-xl border border-teal-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-teal-800">Moyen-Bas</span>
          </div>
          <p className="text-2xl font-bold text-teal-900 mt-2">
            {Math.round(minPrice * 0.66).toLocaleString()}
          </p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl border border-blue-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Moyen-Haut</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {Math.round(maxPrice * 0.33).toLocaleString()}
          </p>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl border border-indigo-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-indigo-800">Élevé</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-900 mt-2">
            {maxPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Matrice */}
      <Card className="border-2 border-gray-100 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="sticky left-0 bg-gradient-to-r from-gray-50 to-blue-50 z-10 p-4 text-left">
                    <div className="flex items-center">
                      <Grid className="w-5 h-5 mr-2 text-blue-600" />
                      <span className="font-bold text-gray-800">Service / Zone</span>
                    </div>
                  </th>
                  {zones
                    .filter(zone => selectedZones.includes(zone.id))
                    .map(zone => (
                      <th key={zone.id} className="p-4 text-left">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="font-bold text-gray-800">{zone.name}</span>
                          <Badge variant="outline" size="sm">{zone.multiplier}×</Badge>
                        </div>
                      </th>
                    ))
                  }
                  <th className="p-4 text-left font-bold text-gray-800">Moyenne</th>
                </tr>
              </thead>
              
              <tbody>
                {Object.entries(services).map(([serviceId, service], idx) => {
                  if (!service.enabled) return null;
                  
                  const zonePrices = zones
                    .filter(zone => selectedZones.includes(zone.id))
                    .map(zone => getServicePriceInZone(serviceId, zone.id));
                  
                  const average = Math.round(zonePrices.reduce((a, b) => a + b, 0) / zonePrices.length);
                  
                  return (
                    <motion.tr
                      key={serviceId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="sticky left-0 bg-white z-10 p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${service.color}-500 to-${service.color}-600 flex items-center justify-center text-white`}>
                            {service.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{service.name}</p>
                            <p className="text-sm text-gray-500">
                              Base: {service.baseFare?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      {zones
                        .filter(zone => selectedZones.includes(zone.id))
                        .map(zone => {
                          const price = getServicePriceInZone(serviceId, zone.id);
                          return (
                            <td key={`${serviceId}-${zone.id}`} className="p-4">
                              <div className={`p-4 rounded-xl bg-gradient-to-br ${colorScale(price, minPrice, maxPrice)} border-2 border-white shadow-sm`}>
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-gray-800">
                                    {price.toLocaleString()}
                                  </p>
                                  {showDetails && (
                                    <div className="text-xs text-gray-600 mt-2 space-y-1">
                                      <div className="flex justify-between">
                                        <span>Base:</span>
                                        <span>{service.baseFare?.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Multiplicateur:</span>
                                        <span>{zone.multiplier}×</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        })
                      }
                      
                      <td className="p-4">
                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-800">
                              {average.toLocaleString()}
                            </p>
                            <div className="text-xs text-gray-600 mt-2">
                              {zonePrices.length} zones
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Résumé statistique */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-blue-100">
          <div className="p-6">
            <h4 className="font-bold text-gray-800 mb-4">Distribution des prix</h4>
            <div className="space-y-4">
              {Object.entries(services)
                .filter(([_, s]) => s.enabled)
                .map(([id, service]) => {
                  const serviceZones = zones.filter(z => selectedZones.includes(z.id));
                  const prices = serviceZones.map(z => getServicePriceInZone(id, z.id));
                  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
                  
                  return (
                    <div key={id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-teal-500" />
                        <span className="text-sm text-gray-700">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">{avg.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-2">moyenne</span>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </Card>

        <Card className="border-2 border-teal-100 md:col-span-2">
          <div className="p-6">
            <h4 className="font-bold text-gray-800 mb-4">Analyse comparative</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {zones
                .filter(z => selectedZones.includes(z.id))
                .map(zone => {
                  const zoneServices = Object.entries(services)
                    .filter(([_, s]) => s.enabled)
                    .map(([id]) => getServicePriceInZone(id, zone.id));
                  
                  const min = Math.min(...zoneServices);
                  const max = Math.max(...zoneServices);
                  const diff = max - min;
                  
                  return (
                    <div key={zone.id} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }} />
                        <span className="font-bold text-gray-800">{zone.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Min:</span>
                          <span className="font-bold text-green-600">{min.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Max:</span>
                          <span className="font-bold text-red-600">{max.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Écart:</span>
                          <span className="font-bold text-blue-600">{diff.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PricingMatrix;