// src/components/layout/MenuItem.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
// import { LucideIcon } from 'lucide-react';


// MenuItem component pour la navigation latérale
const MenuItem = ({ icon: Icon, label, path, count, collapsed, onClick }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `menu-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
      }
      onClick={onClick}
    >
      {({ isActive }) => (
        <>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive 
              ? 'bg-gradient-to-br from-green-500 to-green-600 ' 
              : 'bg-gradient-to-br from-gray-100 to-gray-50'
          }`}>
            <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
          </div>
          
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex items-center justify-between"
            >
              <span className="font-medium">{label}</span>
              {count !== null && (
                <span className="ml-auto bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                  {count}
                </span>
              )}
            </motion.div>
          )}
        </>
      )}
    </NavLink>
  );
};

export default MenuItem;