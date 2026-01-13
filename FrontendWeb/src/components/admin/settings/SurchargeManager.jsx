// src/components/pricing/components/SurchargeManager.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Calendar, CloudRain, Plane, Clock, Zap, TrendingUp, Plus } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../../ui/Card';
import Button from '../../ui/Bttn';
import Switch from '../../ui/Switch';
import Badge from '../../ui/Badge';

const SurchargeManager = ({ surcharges, onUpdate }) => {
  const [newSurcharge, setNewSurcharge] = useState({
    name: '',
    icon: '📊',
    multiplier: 1.2,
    enabled: true
  });

  const surchargeIcons = {
    '🌙': Moon,
    '🎉': Calendar,
    '🌧️': CloudRain,
    '✈️': Plane,
    '📈': TrendingUp,
    '⚡': Zap,
    '⏰': Clock
  };

  const handleAddSurcharge = () => {
    if (!newSurcharge.name.trim()) return;
    
    const id = newSurcharge.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    onUpdate(id, { ...newSurcharge, id });
    
    setNewSurcharge({
      name: '',
      icon: '📊',
      multiplier: 1.2,
      enabled: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Liste des suppléments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(surcharges).map(([id, surcharge]) => {
          const Icon = surchargeIcons[surcharge.icon] || TrendingUp;
          
          return (
            <motion.div
              key={id}
              whileHover={{ y: -4 }}
            >
              <Card className={`border-2 ${surcharge.enabled ? 'border-blue-200' : 'border-gray-200'} transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                        <Icon className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{surcharge.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={surcharge.enabled ? 'success' : 'default'} size="sm">
                            {surcharge.enabled ? 'Actif' : 'Inactif'}
                          </Badge>
                          {surcharge.multiplier && (
                            <Badge variant="outline" size="sm">
                              {surcharge.multiplier}×
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Switch
                      checked={surcharge.enabled}
                      onChange={() => onUpdate(id, { enabled: !surcharge.enabled })}
                    />
                  </div>
                  
                  {surcharge.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      {/* Multiplicateur */}
                      {surcharge.multiplier && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Multiplicateur</label>
                          <div className="flex items-center">
                            <input
                              type="range"
                              min="1"
                              max="3"
                              step="0.1"
                              value={surcharge.multiplier}
                              onChange={(e) => onUpdate(id, { multiplier: parseFloat(e.target.value) })}
                              className="flex-1 h-2 bg-gradient-to-r from-blue-200 to-teal-200 rounded-lg appearance-none"
                            />
                            <span className="ml-3 font-bold text-blue-700">
                              {surcharge.multiplier}×
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Heures spécifiques */}
                      {surcharge.startTime && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Début</label>
                            <input
                              type="time"
                              value={surcharge.startTime}
                              onChange={(e) => onUpdate(id, { startTime: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Fin</label>
                            <input
                              type="time"
                              value={surcharge.endTime}
                              onChange={(e) => onUpdate(id, { endTime: e.target.value })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Jours applicables */}
                      {surcharge.days && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-2">Jours applicables</label>
                          <div className="flex flex-wrap gap-1">
                            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                              <button
                                key={day}
                                onClick={() => {
                                  const days = surcharge.days || [];
                                  const newDays = days.includes(day)
                                    ? days.filter(d => d !== day)
                                    : [...days, day];
                                  onUpdate(id, { days: newDays });
                                }}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  (surcharge.days || []).includes(day)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Ajouter un supplément */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Ajouter un supplément
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du supplément
              </label>
              <input
                type="text"
                value={newSurcharge.name}
                onChange={(e) => setNewSurcharge({ ...newSurcharge, name: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
                placeholder="Ex: Heures de pointe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icône
              </label>
              <div className="flex items-center space-x-2">
                {Object.keys(surchargeIcons).map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewSurcharge({ ...newSurcharge, icon })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      newSurcharge.icon === icon
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Multiplicateur
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={newSurcharge.multiplier}
                  onChange={(e) => setNewSurcharge({ ...newSurcharge, multiplier: parseFloat(e.target.value) })}
                  className="flex-1 h-2 bg-gradient-to-r from-blue-200 to-teal-200 rounded-lg appearance-none"
                />
                <span className="ml-3 font-bold text-blue-700">
                  {newSurcharge.multiplier}×
                </span>
              </div>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-blue-700 to-teal-700"
                icon={Plus}
                onClick={handleAddSurcharge}
                fullWidth
              >
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurchargeManager;