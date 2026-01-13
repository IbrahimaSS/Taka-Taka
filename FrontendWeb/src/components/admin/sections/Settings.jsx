// src/components/sections/Settings.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, RefreshCw, Database, History, Cog, DollarSign,
  Bell, Shield, Code, Car, Smartphone, MessageCircle,
  Mail, MonitorCheck, CarTaxiFront, Motorbike,
  Upload, Download, Settings as SettingsIcon, Globe,

} from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Bttn';
import Tabs from '../ui/Tabs';
import Toast from '../ui/Toast';

// Composants
import GeneralSettings from '../settings/GeneralSettings';
// import ApiSettings from '../settings/ApiSettings';

// Hooks
import { useSettings } from '../../../hooks/useSettings';
import PricingDashboard from '../settings/PricingDashboard';
import Switch from '../ui/Switch';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    settings,
    hasChanges,
    updateSetting,
    updateNestedSetting,
    resetToDefaults,
    exportSettings,
    importSettings
  } = useSettings();

  const tabs = [
    { id: 'general', label: 'Général', icon: Cog },
    { id: 'pricing', label: 'Tarification', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'api', label: 'API & Intégrations', icon: Code },
    { id: 'backup', label: 'Sauvegarde', icon: Database },
  ];

  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simuler une sauvegarde API
      await new Promise(resolve => setTimeout(resolve, 1000));

      showToast('Succès', 'Paramètres sauvegardés avec succès', 'success');

      // En production, ajouter ici l'appel API
      // await api.saveSettings(settings);

    } catch (error) {
      showToast('Erreur', 'Échec de la sauvegarde des paramètres', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    exportSettings();
    showToast('Export réussi', 'Les paramètres ont été exportés', 'success');
  };

  const handleImport = async (file) => {
    try {
      await importSettings(file);
      showToast('Import réussi', 'Les paramètres ont été importés', 'success');
    } catch (error) {
      showToast('Erreur', error.message || 'Échec de l\'import', 'error');
    }
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action est irréversible.')) {
      resetToDefaults();
      showToast('Réinitialisation', 'Tous les paramètres ont été réinitialisés', 'info');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettings
            settings={settings}
            updateSetting={updateSetting}
            showToast={showToast}
          />
        );
      case 'pricing':
        return (
          <PricingDashboard


          />
        );
      case 'notifications':
        // noyification
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Configuration des notifications</h3>
              <div className="space-y-4">
                {[

                  { label: 'Promotions et offres', description: 'Envoyer des notifications promotionnelles' },

                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Canaux de notification</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { key: 'whatsappNotifications', label: 'WhatsApp', icon: MessageCircle, color: 'green' },
                  { key: 'smsNotifications', label: 'SMS', icon: Smartphone, color: 'blue' },
                  { key: 'emailNotifications', label: 'Email', icon: Mail, color: 'purple' },
                ].map((channel) => (
                  <Card key={channel.key} padding="p-5">
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-${channel.color}-100 flex items-center justify-center mr-3`}>
                        <channel.icon className={`text-${channel.color}-500`} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{channel.label}</p>
                        <p className="text-sm text-gray-500">Notifications {channel.label}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Activé</span>
                        <Switch
                          checked={settings[channel.key]}
                          onChange={() => handleSettingChange(channel.key)}
                        />
                      </div>

                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      // case 'api':
      //   return (
      //     <ApiSettings
      //       settings={settings}
      //       updateSetting={updateSetting}
      //       updateNestedSetting={updateNestedSetting}
      //       showToast={showToast}
      //     />
      //   );
      case 'backup':
        return (
          <BackupSettings
            settings={settings}
            onExport={handleExport}
            onImport={handleImport}
            onReset={handleReset}
            showToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Configuration du système</h1>
            <p className="text-gray-600 mt-1">Gérez les paramètres de la plateforme Taka Taka</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                />
              )}
              <span className="text-sm text-gray-500">
                {hasChanges ? 'Modifications non sauvegardées' : 'Tout est à jour'}
              </span>
            </div>

            <Button
              variant="secondary"
              icon={RefreshCw}
              onClick={handleReset}
              disabled={isSaving}
            >
              Réinitialiser
            </Button>

            <Button
              variant="primary"
              className="bg-gradient-to-r from-blue-700 to-teal-700 hover:from-blue-800 hover:to-teal-800"
              icon={Save}
              onClick={handleSave}
              loading={isSaving}
              disabled={!hasChanges || isSaving}
            >
              {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
            </Button>
          </div>
        </motion.div>

        {/* Onglets */}
        <Card hoverable={false} className="border-2 border-gray-100 shadow-sm">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </Card>

        {/* Contenu */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* Statut du système */}

      </div>

      {/* Toast */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Settings;