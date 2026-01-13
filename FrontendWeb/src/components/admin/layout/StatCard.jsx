// src/components/layout/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'green', 
  trend = 'up',
  percentage = 0,
  progress = 0 
}) => {
  const colorClasses = {
    green: 'from-green-100 to-green-50 text-green-500',
    blue: 'from-blue-100 to-blue-50 text-blue-500',
    purple: 'from-purple-100 to-purple-50 text-purple-500',
    yellow: 'from-yellow-100 to-yellow-50 text-yellow-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="stat-card p-6"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-gray-500 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-3">{value}</p>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={`text-sm font-medium flex items-center ${
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend === 'up' ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {percentage}%
            </span>
          </div>
        </div>
        <div className={`w-20 h-10 rounded-3xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;