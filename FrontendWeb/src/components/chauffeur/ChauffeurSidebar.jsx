import React, { useState } from 'react';
import {
  Bell,
  User,
  LogOut,
  Home,
  Car,
  Calendar,
  DollarSign,
  Clock,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { StatusToggle } from '../../ui/StatusToggle';
import { ThemeToggle } from '../../ui/ThemeToggle';
import { Modal } from '../../ui/Modal';

export function HeaderSidebar({
  userName = "Mariama",
  userAvatar,
  notificationsCount = 0,
  currentStatus = 'online',
  onStatusChange,
  onNotificationsClick,
  onProfileClick
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'trajet',
      title: 'Nouvelle demande',
      message: 'Trajet Paris-Lyon demandé',
      time: '5 min',
      isRead: false
    },
    {
      id: '2',
      type: 'trajet',
      title: 'Nouvelle demande',
      message: 'Trajet Paris-Lyon demandé',
      time: '5 min',
      isRead: false
    },
    {
      id: '3',
      type: 'paiement',
      title: 'Paiement reçu',
      message: '120€ confirmés',
      time: '1h',
      isRead: false
    },
    {
      id: '4',
      type: 'trajet',
      title: 'Trajet annulé',
      message: 'Trajet Marseille annulé',
      time: 'Hier',
      isRead: true
    }
  ]);

  // Gestionnaire simple pour ouvrir les notifications
  const handleNotificationsClick = () => {
    setShowNotifications(true);
    if (onNotificationsClick) {
      onNotificationsClick();
    }
  };

  // Fonction pour marquer comme lu
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Fonction pour tout marquer comme lu
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  // Calculer le nombre de notifications non lues
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
  const finalNotificationsCount = notificationsCount || unreadNotificationsCount;

  return (
    <div className="fixed top-0 right-0 h-16 w-full bg-white dark:bg-gray-800 shadow-lg z-50 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-700 ">
      {/* Logo ou titre à gauche */}
      <div className="flex items-center gap-3">
        <Car className="w-8 h-8 text-blue-500" />
        <div className="hidden md:block">
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
            ESPACE CHAUFFEUR
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Conduisez avec confiance</p>
        </div>
      </div>

      {/* Menu desktop */}
      <div className="flex items-center gap-4">
        {/* badge Dark Mode */}
        <ThemeToggle />

        {/* Badge de statut */}
        <div className="flex items-center gap-2">
          <StatusToggle
            status={currentStatus}
            onChange={onStatusChange}
            size="md"
          />
        </div>

        {/* Notifications*/}
        <button
          onClick={handleNotificationsClick}
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={`${finalNotificationsCount} notifications`}
        >
          <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          {finalNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {finalNotificationsCount}
            </span>
          )}
        </button>

        {/* Profil */}
        <button
          onClick={onProfileClick}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/20"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="hidden md:block text-left">
            <p className="font-semibold text-gray-800 dark:text-white">{userName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Chauffeur professionnel</p>
          </div>
        </button>

        {/* Menu mobile */}
        <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Modal de notifications */}
      {showNotifications && (
        <Modal
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        >
          <div className="bg-white dark:bg-gray-800 w-full max-w-md h-[80vh] rounded-xl shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Notifications ({notifications.filter(n => !n.isRead).length} non lues)
              </h3>

              <div className="flex gap-2">
                {notifications.some(n => !n.isRead) && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Tout marquer lu
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>

            {/* Liste */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`
                      p-4 border-b dark:border-gray-700 cursor-pointer
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      ${!notif.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800 dark:text-white">
                        {notif.title}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {notif.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {notif.message}
                    </p>

                    {!notif.isRead && (
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// 2. NAVIGATION SIDEBAR (Gradient) - À gauche de la page
export function NavigationSidebar({
  isOpen = true,
  onToggle,
  activeTab = 'trips',
  onTabChange
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: <Home className="w-5 h-5" />,
      isActive: activeTab === 'dashboard'
    },
    {
      id: 'trips',
      label: 'Mes Trajets',
      icon: <Car className="w-5 h-5" />,
      badge: '3',
      isActive: activeTab === 'trips'
    },
    {
      id: 'history',
      label: 'Historique des trajets',
      icon: <Clock className="w-5 h-5" />,
      isActive: activeTab === 'history'
    },
    {
      id: 'revenues',
      label: 'Revenus',
      icon: <DollarSign className="w-5 h-5" />,
      badge: 'GNF',
      isActive: activeTab === 'revenues'
    },
    {
      id: 'planning',
      label: 'Planning',
      icon: <Calendar className="w-5 h-5" />,
      isActive: activeTab === 'planning'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: <Settings className="w-5 h-5" />,
      isActive: activeTab === 'settings'
    }
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {!isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 h-[calc(100%-4rem)] 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out
        z-40
      `}>
        {/* Bouton toggle pour mobile */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-4 bg-gradient-to-r from-blue-500 to-green-500 text-white p-2 rounded-full shadow-lg z-50 md:hidden"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div className="h-full w-80 bg-gradient-to-b from-blue-500/10 via-white to-green-500/10 dark:from-gray-800 dark:to-gray-900 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col">
          {/* Titre de la section */}
          <div className="px-6 py-6">
            {/* Vous pouvez ajouter un titre ici si besoin */}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (onTabChange) onTabChange(item.id);
                      if (window.innerWidth < 768 && onToggle) onToggle();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200
                      ${item.isActive
                        ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-blue-500/20 shadow-sm dark:from-green-500/10 dark:to-blue-500/10'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-green-500/5 hover:text-blue-500 dark:hover:text-blue-400'
                      }
                    `}
                  >
                    <div className={`
                      p-1.5 rounded-md
                      ${item.isActive
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {item.icon}
                    </div>
                    <span className="font-medium flex-1 text-left text-sm dark:text-gray-200">{item.label}</span>
                    {item.badge && (
                      <span className={`
                        px-2 py-0.5 text-xs font-semibold rounded-full min-w-[1.5rem] text-center
                        ${item.isActive
                          ? 'bg-white dark:bg-gray-800 text-blue-500'
                          : 'bg-gradient-to-r from-blue-500/10 to-green-500/10 text-gray-700 dark:text-gray-300'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Section déconnexion et stats */}
          <div className="p-6 border-t border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 mt-auto">
            <button
              onClick={() => console.log('Déconnexion')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 dark:hover:from-red-900/20 dark:hover:to-red-800/20 dark:hover:text-red-400 transition-all duration-200 group mb-4"
            >
              <div className="p-1.5 rounded-md bg-gray-100 dark:bg-gray-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 group-hover:text-red-600 dark:group-hover:text-red-400">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">Déconnexion</span>
            </button>

            {/* Stats rapides */}
            <div className="p-4 bg-gradient-to-r from-blue-500/5 to-green-500/5 dark:from-blue-500/10 dark:to-green-500/10 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Trajets aujourd'hui</span>
                <span className="text-sm font-bold text-blue-500 dark:text-blue-400">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 3. Exemple d'utilisation
export function ExampleSidebarUsage() {
  return (
    <div>
      {/* Cette fonction est vide, vous pouvez l'utiliser pour montrer un exemple d'usage */}
    </div>
  );
}

export default { HeaderSidebar, NavigationSidebar, ExampleSidebarUsage };