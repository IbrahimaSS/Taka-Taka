import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Layout Components
import Sidebar from '../components/admin/layout/Sidebar';
import Header from '../components/admin/layout/Header';

// Section Components (Reusing existing components where possible or creating placeholders)
import Dashboard from '../components/chauffeur/Dasboard';
import Trajets from '../components/chauffeur/Trajets';
import HistoriqueTrajet from '../components/chauffeur/HistoriqueTrajet';
import Planning from '../components/chauffeur/Planning';
import Revenues from '../components/chauffeur/Revenues'

// Shared Components
import ChauffeurProfile from '../components/chauffeur/shared/ChauffeurProfile';
import ChauffeurSettings from '../components/chauffeur/shared/ChauffeurSettings';
import ChauffeurSupport from '../components/chauffeur/shared/ChauffeurSupport';
import ChauffeurEvaluations from '../components/chauffeur/shared/ChauffeurEvaluations';

// UI Components
import Toast from '../components/admin/ui/Toaste';
import Modal from '../components/admin/ui/Modale';

import { ROLES } from '../config/navConfig';

function ChauffeurApp() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [modal, setModal] = useState(null);
    const [currentDate, setCurrentDate] = useState('');
    const location = useLocation();

    useEffect(() => {
        setCurrentDate(format(new Date(), 'EEEE d MMMM yyyy', { locale: fr }));

        const interval = setInterval(() => {
            setCurrentDate(format(new Date(), 'EEEE d MMMM yyyy', { locale: fr }));
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const showToast = (message, type = 'success', duration = 3000) => {
        setToast({ message, type, duration });
    };

    const closeModal = () => {
        setModal(null);
    };

    return (
        <div className="flex min-h-screen inset-0 bg-gray-100 bg-gradient-to-br from-primary-50 to-secondary-100  dark:from-gray-800  dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <Sidebar
                role={ROLES.CHAUFFEUR}
                collapsed={sidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                onCloseMobile={() => setMobileSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
                }`}>
                {/* Header */}
                <Header
                    role={ROLES.CHAUFFEUR}
                    currentDate={currentDate}
                    onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    sidebarCollapsed={sidebarCollapsed}
                    showToast={showToast}
                />
                <main className="content-padding">
                    <div className="content-container">
                        <AnimatePresence mode="wait">
                            <Routes location={location} key={location.pathname}>
                                <Route index element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Dashboard />
                                    </motion.div>
                                } />

                                <Route path="trips" element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <Trajets />
                                    </motion.div>
                                } />

                                <Route path="history" element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <HistoriqueTrajet />
                                    </motion.div>
                                } />

                                <Route path="revenues" element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <Revenues />
                                    </motion.div>
                                } />

                                <Route path="planning" element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <Planning />
                                    </motion.div>
                                } />

                                <Route path="settings" element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <ChauffeurSettings />
                                    </motion.div>
                                } />

                                <Route path="evaluations" element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <ChauffeurEvaluations />
                                    </motion.div>
                                } />

                                <Route path="support" element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <ChauffeurSupport />
                                    </motion.div>
                                } />

                                <Route path="profil" element={
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <ChauffeurProfile />
                                    </motion.div>
                                } />
                            </Routes>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-slate-200/70 dark:border-slate-800/70 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm px-6 py-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-2 md:mb-0">
                            © {new Date().getFullYear()} TakaTaka Driver. Tous droits réservés.
                        </p>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-all duration-200 text-sm hover:underline">
                                Aide Chauffeur
                            </a>
                            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-all duration-200 text-sm hover:underline">
                                Sécurité
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Toast Notification */}
            <Toast {...toast} onClose={() => setToast(null)} />

            {/* Modal */}
            <Modal isOpen={!!modal} onClose={closeModal}>
                {modal}
            </Modal>
        </div>
    );
}

export default ChauffeurApp;
