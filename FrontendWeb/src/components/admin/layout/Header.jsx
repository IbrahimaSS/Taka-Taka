// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Bell, Calendar, Search, Filter, 
  ChevronDown, User, Settings as SettingsIcon,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ currentDate, onMenuToggle, onSidebarToggle, sidebarCollapsed, showToast }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Nouveau chauffeur inscrgcdit', description: 'Kouamé Adou vient de s\'inscrire', time: 'Il y a 5 min', icon: 'user-check' },
    { id: 2, title: 'Trajet annulé', description: 'Trajet #TR-001243 a été annulé', time: 'Il y a 15 min', icon: 'x-circle' },
    { id: 3, title: 'Paiement reçu', description: 'Paiement de 1,500 GNF confirmé', time: 'Il y a 30 min', icon: 'dollar-sign' },
  ];

  return (
    <header className="glass-header shadow-sm sticky top-0 z-20 px-6 py-4 ">
      <div className="flex justify-between items-center ">
        <div className="flex items-center space-x-4">
           {/*  */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-3 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 shadow-sm"
          >
            <Menu className="text-gray-900" />
          </button>

          <button
            onClick={onSidebarToggle}
            className="hidden lg:flex p-3 rounded-xl  shadow-sm hover:shadow transition"
          >
            {sidebarCollapsed ? (
              <Menu className="text-gray-600 rotate-90" />
            ) : (
              <Menu className="text-gray-600 -rotate-90" />
            )}
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
            <p className="text-sm text-gray-500">Bienvenue dans votre espace d'administration</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Date */}
          <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-xl">
            <Calendar className="text-green-500 w-5 h-5" />
            <span className="text-gray-700 font-medium">{currentDate}</span>
          </div>


          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 shadow-sm hover:shadow transition relative"
            >
              <Bell className="text-gray-600 w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
                >
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {notifications.length} nouvelles
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <Bell className="text-green-600 w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{notification.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{notification.description}</p>
                            <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t text-center">
                    <Link to="/admin/notifications" className="text-green-600 text-sm font-medium">
                      Voir toutes les notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-3 focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center ring-2 ring-green-500 ring-offset-2">
                <User className="text-blue-700 w-5 h-5" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">Administrateur</p>
                <p className="text-xs text-gray-500">Gestionnaire</p>
              </div>
              <ChevronDown className="text-gray-400 w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">Fela Baldé</p>
                    <p className="text-sm text-gray-500">admin@takataka.ci</p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/admin/profil"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Mon profil
                    </Link>
                    <Link
                      to="/admin/parametres"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                    >
                      <SettingsIcon className="w-4 h-4 mr-3" />
                      Paramètres
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 pt-2">
                    <Link
                      to="/admin/logout"
                      className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Déconnexion
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;