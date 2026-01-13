// src/components/settings/components/GeneralSettings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Globe, Clock, MessageSquare, Shield, Building, FileText } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Bttn';
import Switch from '../ui/Switch';

const GeneralSettings = ({ settings, updateSetting, showToast }) => {
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Erreur', 'L\'image ne doit pas dépasser 2MB', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
        updateSetting('platformLogo', e.target.result);
        showToast('Succès', 'Logo mis à jour', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const currencies = [
    { code: 'GNF', name: 'Franc Guinéen', symbol: 'FG' },
    { code: 'XOF', name: 'Franc CFA', symbol: 'CFA' },
    { code: 'USD', name: 'Dollar US', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' }
  ];

  const timezones = [
    'Africa/Conakry',
    'Africa/Abidjan',
    'Africa/Dakar',
    'Africa/Bamako',
    'Africa/Nouakchott'
  ];

  return (
    <div className="space-y-8">
      {/* Informations de la plateforme */}
      <Card hoverable className="border-2 border-gray-100 hover:border-blue-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Informations de la plateforme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la plateforme
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => updateSetting('platformName', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slogan/Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ''}
                onChange={(e) => updateSetting('tagline', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Votre transport, notre priorité"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Devise principale
              </label>
              <select
                value={settings.currency}
                onChange={(e) => updateSetting('currency', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuseau horaire
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de la plateforme
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {logoPreview || settings.platformLogo ? (
                    <img
                      src={logoPreview || settings.platformLogo}
                      alt="Logo"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center">
                      <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-500">Logo</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-3">
                  Taille recommandée: 512x512 pixels. Formats acceptés: PNG, JPG, SVG (max 2MB)
                </p>
                <div className="flex space-x-3">
                  <label htmlFor="logo-upload">
                    <Button variant="outline" icon={Upload} as="div" className="cursor-pointer">
                      Changer le logo
                    </Button>
                  </label>
                  {(logoPreview || settings.platformLogo) && (
                    <Button
                      variant="danger"
                      onClick={() => {
                        setLogoPreview(null);
                        updateSetting('platformLogo', null);
                      }}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance */}
      <Card hoverable className="border-2 border-gray-100 hover:border-red-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Mode maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <Shield className="text-red-600 w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Activer le mode maintenance</p>
                <p className="text-sm text-gray-500">
                  La plateforme sera inaccessible aux utilisateurs non administrateurs
                </p>
              </div>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onChange={() => updateSetting('maintenanceMode', !settings.maintenanceMode)}
            />
          </div>
          
          {settings.maintenanceMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Message de maintenance
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
                    rows="4"
                    className="w-full border-2 border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="Message à afficher aux utilisateurs..."
                  />
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-700">
                    <strong>Note :</strong> Seuls les administrateurs pourront accéder à la plateforme en mode maintenance.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Localisation */}
      <Card hoverable className="border-2 border-gray-100 hover:border-teal-100 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-teal-800 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Localisation et langue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue par défaut
              </label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays d'opération
              </label>
              <select
                value={settings.country || 'GN'}
                onChange={(e) => updateSetting('country', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
              >
                <option value="GN">Guinée</option>
                <option value="CI">Côte d'Ivoire</option>
                <option value="SN">Sénégal</option>
                <option value="ML">Mali</option>
                <option value="BF">Burkina Faso</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coordonnées de l'entreprise
            </label>
            <textarea
              value={settings.companyAddress || ''}
              onChange={(e) => updateSetting('companyAddress', e.target.value)}
              rows="3"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
              placeholder="Adresse complète de l'entreprise..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;