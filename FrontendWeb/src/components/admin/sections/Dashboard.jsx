// src/components/sections/Dashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Car, Route, Wallet } from 'lucide-react';
import StatCard from '../layout/StatCard';
import ChartCard from '../ui/ChartCard';
import { chartConfigs } from '../../../hooks/useCharts';
import { Link } from 'react-router-dom';
import Button from '../ui/Bttn';

const Dashboard = ({ showToast }) => {
  const stats = [
    {
      title: 'Utilisateurs totaux',
      value: '2,450',
      icon: Users,
      color: 'green',
      trend: 'up',
      percentage: 12,
      progress: 12,
    },
    {
      title: 'Chauffeurs actifs',
      value: '156',
      icon: Car,
      color: 'blue',
      trend: 'up',
      percentage: 8,
      progress: 65,
    },
    {
      title: 'Tous les trajets',
      value: '342',
      icon: Route,
      color: 'purple',
      trend: 'down',
      percentage: 5,
      progress: 45,
    },
    {
      title: 'Budgets',
      value: '4.2M GNF',
      icon: Wallet,
      color: 'yellow',
      trend: 'up',
      percentage: 18,
      progress: 85,
    },
  ];

  const recentTrips = [
    { id: 'TR-001245', passenger: 'Jean Dupont', amount: '1 500 GNF', status: 'completed', time: '10:30 AM' },
    { id: 'TR-001244', passenger: 'Marie Koné', amount: '2 000 GNF', status: 'in-progress', time: '09:45 AM' },
    { id: 'TR-001243', passenger: 'Pierre Gbédé', amount: '800 GNF', status: 'pending', time: '08:15 AM' },
    { id: 'TR-001242', passenger: 'Alice Traoré', amount: '1 200 GNF', status: 'cancelled', time: 'Hier, 17:20' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bonjour Mr Mamadou Fela</h2>
            <p className="opacity-90">Surveillez et gérez votre plateforme Taka Taka en temps réel</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm opacity-80">Bienvenue</p>
              <p className="text-2xl font-bold">A vous</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenus mensuels"
          subtitle="Vue d'ensemble des revenus 2025"
          chartConfig={chartConfigs.monthlyRevenue}
          height="300px"
        />
        <ChartCard
          title="Répartition des revenus"
          subtitle="Par type de service"
          chartConfig={chartConfigs.revenueDistribution}
          height="300px"
        />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Trajets récents */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Trajets récents</h3>
                <p className="text-gray-500 text-sm">Les derniers trajets effectués</p>
              </div>
             <div className="">
                 <button
                variant="primary"
                 className="flex-1 md:flex-none bg-gradient-to-br from-green-500 to-blue-700"
              >
                <Link to='/trajets'>Voir tous</Link>
              </button>
             </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {recentTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 5, x: 5 }}
                  transition={{ delay: index * 0.5 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-green-300 transition group"
                >
                  <div>
                    <div className="font-medium text-gray-800">{trip.id}</div>
                    <div className="text-sm text-gray-500">{trip.time}</div>
                  </div>
                  <div className="font-medium text-gray-800">{trip.passenger}</div>
                  <div className="font-bold text-gray-800">{trip.amount}</div>
                  <div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                      trip.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      trip.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {trip.status === 'completed' && 'Terminé'}
                      {trip.status === 'in-progress' && 'En cours'}
                      {trip.status === 'pending' && 'En attente'}
                      {trip.status === 'cancelled' && 'Annulé'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

       
      </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;