import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../utils/cn';
import { useUserStore } from '../../../data/userStore';
import { useSettings } from '../../../hooks/useSettings';
import { NAV_CONFIG, ROLES } from '../../../config/navConfig';

function parsePath(pathname, basePath) {
  if (!pathname.startsWith(basePath)) return { segments: [], first: '' };
  const rest = pathname.slice(basePath.length).replace(/^\/+/, '');
  const segments = rest ? rest.split('/').filter(Boolean) : [];
  return { segments, first: segments[0] || '' };
}

export default function Header({
  currentDate,
  onMenuToggle,
  onSidebarToggle,
  sidebarCollapsed,
  showToast,
  role = ROLES.ADMIN
}) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useUserStore();
  const { settings } = useSettings();
  const platform = settings.platform || {};

  const config = NAV_CONFIG[role] || NAV_CONFIG[ROLES.ADMIN];
  const BASE_PATH = config.basePath;
  const TITLES = config.titles;

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Nouveau chauffeur inscrit',
      description: "Kouamé Adou vient de s'inscrire",
      time: 'Il y a 5 min',
      icon: CheckCircle,
      type: 'success',
      read: false,
    },
    {
      id: 2,
      title: 'Trajet annulé',
      description: 'Trajet #TR-001243 a été annulé',
      time: 'Il y a 15 min',
      icon: AlertCircle,
      type: 'error',
      read: false,
    },
    {
      id: 3,
      title: 'Paiement reçu',
      description: 'Paiement de 1,500 GNF confirmé',
      time: 'Il y a 30 min',
      icon: CheckCircle,
      type: 'success',
      read: true,
    },
    {
      id: 4,
      title: 'Maintenance programmée',
      description: 'Maintenance prévue demain à 02:00',
      time: 'Il y a 2h',
      icon: Clock,
      type: 'info',
      read: true,
    },
  ]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const { segments, first } = useMemo(() => parsePath(location.pathname, BASE_PATH), [location.pathname, BASE_PATH]);
  const pageTitle = TITLES[first] || TITLES[''];

  const breadcrumbs = useMemo(() => {
    const crumbs = [{ label: platform.name || config.title, to: BASE_PATH }];
    if (!segments.length) return crumbs;
    let acc = BASE_PATH;
    segments.forEach((seg) => {
      acc += `/${seg}`;
      crumbs.push({ label: TITLES[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1)), to: acc });
    });
    return crumbs;
  }, [segments, BASE_PATH, config.title, TITLES]);

  useEffect(() => {
    const onDocDown = (e) => {
      if (notificationsOpen && !e.target.closest('.notifications-container')) setNotificationsOpen(false);
      if (profileOpen && !e.target.closest('.profile-container')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [notificationsOpen, profileOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setNotificationsOpen(false);
    showToast?.('Toutes les notifications ont été marquées comme lues', 'success');
  };

  const markOne = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    showToast?.('Notification marquée comme lue', 'success');
  };

  const badgeColor = (type) => {
    if (type === 'success') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300';
    if (type === 'error') return 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300';
  };

  const profileLink = role === ROLES.ADMIN ? '/admin/profil' : '/chauffeur/profil';
  const settingsLink = role === ROLES.ADMIN ? '/admin/parametres' : '/chauffeur/settings';
  const supportLink = role === ROLES.ADMIN ? '#' : '/chauffeur/support';
  const evaluationsLink = role === ROLES.ADMIN ? '#' : '/chauffeur/evaluations';

  return (
    <header className="glass-header bg-white/90 dark:bg-gray-800  border-b-2 border-gray-200/30 dark:border-gray-900 shadow-sm animate-fade-in-down sticky top-0 z-30 px-4 md:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onMenuToggle}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl surface hover:bg-gray-50 dark:hover:bg-gray-700 ring-primary"
            aria-label="Ouvrir le menu"
            type="button"
          >
            <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSidebarToggle}
            className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-xl surface dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 ring-primary"
            aria-label="Réduire/étendre la sidebar"
            type="button"
          >
            <ChevronRight className={cn('h-5 w-5 text-slate-700 dark:text-slate-200 transition-transform', !sidebarCollapsed && 'rotate-180')} />
          </motion.button>

          <div className="min-w-0">
            <nav className="hidden md:flex items-center gap-2 text-sm">
              {breadcrumbs.map((b, idx) => (
                <React.Fragment key={b.to}>
                  <Link
                    to={b.to}
                    className={cn(
                      'font-semibold transition-colors',
                      idx === breadcrumbs.length - 1
                        ? 'text-slate-900 dark:text-slate-100'
                        : 'text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400'
                    )}
                  >
                    {b.label}
                  </Link>
                  {idx < breadcrumbs.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-600" />}
                </React.Fragment>
              ))}
            </nav>
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-lg md:text-xl font-semibold  tracking-tight text-slate-900 dark:text-slate-100 truncate">
                {pageTitle}
              </h1>

            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Date */}
          <div className="hidden lg:block w-72">
            <span className="hidden md:inline text-sm text-slate-500 dark:text-slate-400">•</span>
            <span className="hidden md:inline text-sm text-slate-500 dark:text-slate-400 truncate">{currentDate}</span>
          </div>
          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex  h-10 w-10 items-center justify-center rounded-xl surface hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 ring-primary"
            aria-label="Changer le thème"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
          </button>

          {/* Notifications */}
          <div className="relative notifications-container">
            <button
              type="button"
              onClick={() => setNotificationsOpen((v) => !v)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl surface hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 ring-primary"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-xs font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="notification-dropdown absolute right-0 mt-2 w-[22rem] md:w-[26rem] z-50"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-900 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Notifications</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{notifications.length} éléments</p>
                      </div>
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Tout lire
                      </button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => markOne(n.id)}
                        className={cn(
                          'w-full text-left p-4 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors',
                          'hover:bg-gray-50 dark:hover:bg-gray-700',
                          n.read && 'opacity-75'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', badgeColor(n.type))}>
                            <n.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{n.title}</p>
                              {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />}
                            </div>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 truncate">{n.description}</p>
                            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{n.time}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800">
                    <Link
                      to={`${BASE_PATH}/rapports`}
                      className="btn-secondary w-full justify-center"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      Voir rapports
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative profile-container">
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ring-primary"
              aria-label="Menu utilisateur"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden shadow-sm">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[120px]">
                  {profile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{profile.position || profile.role}</p>
              </div>
              <ChevronDown className={cn('hidden md:block h-4 w-4 text-slate-400 transition-transform', profileOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="profile-dropdown absolute right-0 mt-2 w-72 z-50 "
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-900 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white">
                            <User className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[180px]">{profile.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{profile.email}</p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                      {profile.role}
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      to={profileLink}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Mon profil
                    </Link>

                    {role === ROLES.CHAUFFEUR && (
                      <div className="p-1 space-y-1 border-b border-gray-100 dark:border-gray-800/50 mb-1">
                        <Link
                          to={evaluationsLink}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 dark:text-gray-200 dark:hover:bg-emerald-900/20 transition-all font-poppins"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Star className="h-4 w-4 text-emerald-500" />
                          Mes évaluations
                        </Link>
                        <Link
                          to={supportLink}
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 dark:text-gray-200 dark:hover:bg-blue-900/20 transition-all font-poppins"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Bell className="h-4 w-4 text-blue-500" />
                          Centre d'aide
                        </Link>
                      </div>
                    )}
                    <Link
                      to={settingsLink}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      Paramètres
                    </Link>
                  </div>

                  <div className="p-2 border-t border-gray-200 dark:border-gray-900">
                    <Link
                      to="/logout"
                      className="flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/20"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LogOut className="h-4 w-4" />
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
}
