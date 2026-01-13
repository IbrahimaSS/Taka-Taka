// src/components/pricing/PricingDashboard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, TrendingUp, Map, Calculator, History,
    Copy, Download, Upload, Settings, BarChart3,
    ChevronRight, Filter, Search, Plus, Save
} from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Bttn';
import Tabs from '../ui/Tabs';
import Toast from '../ui/Toast';

// Composants
import ServicePricingCard from './ServicePricingCard';
import PricingCalculator from './PricingCalculator';

// Hooks
import { usePricing } from '../../../hooks/usePricing';

const PricingDashboard = () => {
    const [activeTab, setActiveTab] = useState('services');
    const [toast, setToast] = useState(null);
    const [showCalculator, setShowCalculator] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        pricing,
        selectedService,
        setSelectedService,
        updateService,
        updateZone,
        updateSurcharge,
        duplicateService,
        applyToAllServices,
        exportPricing,
        importPricing
    } = usePricing();

    const tabs = [
        { id: 'services', label: 'Services', icon: DollarSign },

    ];

    const showToast = (title, message, type = 'success') => {
        setToast({ title, message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleSave = () => {
        showToast('Tarifs sauvegardés', 'Toutes les modifications ont été enregistrées', 'success');
    };

    const handleExport = () => {
        exportPricing();
        showToast('Export réussi', 'Les tarifs ont été exportés en JSON', 'success');
    };

    const handleImport = async (file) => {
        try {
            await importPricing(file);
            showToast('Import réussi', 'Les tarifs ont été importés', 'success');
        } catch (error) {
            showToast('Erreur', error.message, 'error');
        }
    };

    const handleDuplicate = () => {
        const newId = `${selectedService}_copy`;
        const newName = `${pricing.services[selectedService].name} (Copie)`;
        duplicateService(selectedService, newId, newName);
        showToast('Service dupliqué', `${newName} a été créé`, 'info');
    };

    const renderTabContent = () => {

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Liste des services */}
                    <div className="lg:col-span-1">
                        <Card className="border-2 border-gray-100 sticky top-6">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-bold text-blue-800">Services</h3>
                                <p className="text-sm text-gray-500">Sélectionnez un service à configurer</p>
                            </div>
                            <div className="space-y-2 p-4">
                                {Object.entries(pricing.services).map(([id, service]) => (
                                    <motion.button
                                        key={id}
                                        whileHover={{ x: 4 }}
                                        onClick={() => setSelectedService(id)}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedService === id
                                                ? 'bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200'
                                                : 'hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${service.color}-500 to-${service.color}-600 flex items-center justify-center text-white text-lg`}>
                                                {service.icon}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-gray-800">{service.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    Base: {service.baseFare?.toLocaleString()} {pricing.settings.currency}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedService === id && <ChevronRight className="text-blue-600 w-5 h-5" />}
                                    </motion.button>
                                ))}
                            </div>
                            <div className="p-4 border-t border-gray-200">
                                <Button
                                    variant="outline"
                                    icon={Plus}
                                    fullWidth
                                    onClick={() => showToast('Info', 'Nouveau service bientôt disponible', 'info')}
                                >
                                    Nouveau service
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Configuration du service sélectionné */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedService && pricing.services[selectedService] && (
                            <ServicePricingCard
                                service={pricing.services[selectedService]}
                                serviceId={selectedService}
                                onUpdate={updateService}
                                onDuplicate={handleDuplicate}
                                currency={pricing.settings.currency}
                            />
                        )}

                        {/* Actions globales */}
                        <Card className="border-2 border-gray-100">
                            <div className="p-6">
                                <h3 className="font-bold text-gray-800 mb-4">Actions globales</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <Button
                                        variant="outline"
                                        icon={Copy}
                                      
                                        onClick={() => {
                                            const increase = window.prompt('Pourcentage d\'augmentation (%)', '5');
                                            if (increase) {
                                                applyToAllServices({
                                                    baseFare: Math.round(pricing.services[selectedService].baseFare * (1 + parseFloat(increase) / 100)),
                                                    perKm: Math.round(pricing.services[selectedService].perKm * (1 + parseFloat(increase) / 100))
                                                });
                                                showToast('Mis à jour', `Tous les services augmentés de ${increase}%`, 'success');
                                            }
                                        }}
                                    >
                                        Augmenter tous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        icon={Calculator}
                                        onClick={() => setShowCalculator(true)}
                                    >
                                        Simulateur
                                    </Button>
                                    <Button
                                        variant="outline"
                                        icon={Download}
                                        onClick={handleExport}
                                    >
                                        Exporter
                                    </Button>
                                    <label className="contents">
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={(e) => e.target.files[0] && handleImport(e.target.files[0])}
                                            className="hidden"
                                            id="import-pricing"
                                        />
                                        <Button
                                            variant="outline"
                                            icon={Upload}
                                            as="div"
                                            className="cursor-pointer"
                                        >
                                            Importer
                                        </Button>
                                    </label>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-teal-50/30 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Gestion des tarifs</h1>
                        <p className="text-gray-600 mt-1">Configurez les prix des services et zones tarifaires</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>

                        <Button
                            variant="primary"
                            className="bg-gradient-to-r from-blue-700 to-teal-700 hover:from-blue-800 hover:to-teal-800"
                            icon={Save}
                            onClick={handleSave}
                        >
                            Sauvegarder
                        </Button>


                    </div>
                </motion.div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                </div>

                {/* Onglets et contenu */}
                <Card className="border-2 border-gray-100 shadow-sm">

                    <div className="p-6">
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
                    </div>
                </Card>
            </div>

            {/* Calculateur de prix */}
            <AnimatePresence>
                {showCalculator && (
                    <PricingCalculator
                        services={pricing.services}
                        zones={pricing.zones}
                        surcharges={pricing.surcharges}
                        currency={pricing.settings.currency}
                        onClose={() => setShowCalculator(false)}
                    />
                )}
            </AnimatePresence>

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

export default PricingDashboard;