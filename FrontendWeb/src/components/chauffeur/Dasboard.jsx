import { useState, useEffect } from 'react';
import { 
  Clock, 
  Bell, 
  Car, 
  DollarSign,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  // État pour les statistiques
  const [stats, setStats] = useState({
    onlineSince: "2h 15min",
    requestsReceived: 12,
    tripsCompleted: 4,
    dailyRevenue: 51000
  });

  // Simuler la mise à jour du temps en ligne
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        onlineSince: incrementTime(prev.onlineSince)
      }));
    }, 60000); // Mise à jour toutes les minutes

    return () => clearInterval(interval);
  }, []);

  // Fonction pour incrémenter le temps
  const incrementTime = (currentTime) => {
    const match = currentTime.match(/(\d+)h\s+(\d+)min/);
    if (match) {
      let hours = parseInt(match[1]);
      let minutes = parseInt(match[2]) + 1;
      
      if (minutes >= 60) {
        hours += 1;
        minutes = 0;
      }
      
      return `${hours}h ${minutes}min`;
    }
    return currentTime;
  };

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Tableau de bord</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Les 4 cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte 1: En ligne depuis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <Clock className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <div className="text-xs bg-blue-500/10 dark:bg-blue-500/20 text-blue-500 dark:text-blue-400 rounded-full px-2 py-1">
              <Activity className="w-3 h-3 inline-block mr-1" />
              En ligne
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 dark:text-white">{stats.onlineSince}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">En ligne depuis</p>
        </div>

        {/* Carte 2: Demandes reçues */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-green-50">
              <Bell className="w-6 h-6 text-green-500 dark:text-green-400" />
            </div>
            <div className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
              Aujourd'hui
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 dark:text-white">{stats.requestsReceived}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Demandes reçues</p>
        </div>

        {/* Carte 3: Courses effectuées */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-amber-50">
              <Car className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full">
              Aujourd'hui
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 dark:text-white">{stats.tripsCompleted}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Courses effectuées</p>
        </div>

        {/* Carte 4: Revenus journaliers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300"> 
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 rounded-lg bg-emerald-50">
              <DollarSign className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-full">
              Aujourd'hui
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1 dark:text-white">
            {stats.dailyRevenue.toLocaleString('fr-FR')} FC
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Revenus journaliers</p>
        </div>
      </div>

      {/* Section actions rapides */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Bell className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-800 dark:text-white">Voir les demandes</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Car className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-800 dark:text-white">Mes trajets</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <DollarSign className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-gray-800 dark:text-white">Consulter les revenus</span>
          </button>
        </div>
      </div>
    </div>
  );
}