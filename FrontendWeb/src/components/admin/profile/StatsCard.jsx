// src/components/profile/components/StatsCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Card, { CardContent } from '../ui/Card';

const StatsCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  trendLabel,
  color = 'from-blue-600 to-teal-600',
  loading = false,
  className = ''
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={className}
    >
      <Card hoverable className="border-2 border-gray-100 hover:border-blue-100 transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">{label}</p>
              {loading ? (
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-800">{value}</p>
              )}
              
              {trend && (
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                  </span>
                  <span className="text-xs text-gray-500">{trendLabel || 'vs mois dernier'}</span>
                </div>
              )}
            </div>
            
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
              <Icon className="text-white w-7 h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;