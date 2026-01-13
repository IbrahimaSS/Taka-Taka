import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Layout Components
import Sidebar from '../components/admin/layout/Sidebar';
import Header from '../components/admin/layout/Header';

// Section Components
import Dashboard from '../components/admin/sections/Dashboard';
import Users from '../components/admin/sections/Users';
import Drivers from '../components/admin/sections/Drivers';
import Trips from '../components/admin/sections/Trips';
import Validations from '../components/admin/sections/Validations';
import Disputes from '../components/admin/sections/Disputes';
import Documents from '../components/admin/sections/Documents';
import Reports from '../components/admin/sections/Reports';
import Commissions from '../components/admin/sections/Commissions';
import Settings from '../components/admin/sections/Settings';
import Payments from '../components/admin/sections/Payments';
import UserProfile from '../components/admin/profile/UserProfile';

// UI Components
import Toast from '../components/admin/ui/Toast';
import Modal from '../components/admin/ui/Modal';

function Placeholder({ title = 'Page' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600 mt-2">À implémenter.</p>
    </div>
  );
}

export default function AdminApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const update = () => setCurrentDate(format(new Date(), 'EEEE d MMMM yyyy', { locale: fr }));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 1000);
  };

  const showModal = (content) => setModal(content);
  const closeModal = () => setModal(null);

  return (
    <div className="flex min-h-screen bg-gray-100 bg-gradient-to-br from-primary-50 to-secondary-100 font-poppins">
      {/* Overlay for mobile */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-400 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-[10%]' : 'lg:ml-72'
        }`}
      >
        <Header
          currentDate={currentDate}
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
          showToast={showToast}
        />

        <main className="p-4 md:p-6">
          <Routes>
            <Route index element={<Dashboard showToast={showToast} />} />
            <Route path="utilisateurs" element={<Users showToast={showToast} />} />
            <Route path="chauffeurs" element={<Drivers showToast={showToast} />} />
            <Route path="trajets" element={<Trips showToast={showToast} />} />
            <Route path="paiements" element={<Payments />} />
            <Route path="validations" element={<Validations showToast={showToast} />} />
            <Route path="litiges" element={<Disputes showToast={showToast} />} />
            <Route path="documents" element={<Documents showToast={showToast} />} />
            <Route path="rapports" element={<Reports showToast={showToast} />} />
            <Route path="commissions" element={<Commissions showToast={showToast} />} />
            <Route path="parametres" element={<Settings showToast={showToast} />} />
            <Route path="profil" element={<UserProfile />} />
            <Route path="notifications" element={<Placeholder title="Notifications" />} />
            <Route path="logout" element={<Placeholder title="Déconnexion" />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-2 md:mb-0">
              © 2025 TakaTaka Admin. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-green-600 transition text-sm">
                Aide
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition text-sm">
                Sécurité
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600 transition text-sm">
                Paramètres
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
