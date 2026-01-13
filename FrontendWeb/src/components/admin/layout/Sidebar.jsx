// src/components/layout/Sidebar.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Car, Route, Wallet, CheckCircle,
  AlertTriangle, FileText, BarChart3, Percent, Settings,
  LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import MenuItem from './MenuItem';

const Sidebar = ({ collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin', count: null },
    { icon: Users, label: 'Passagers', path: '/admin/utilisateurs', count: 24 },
    { icon: Car, label: 'Chauffeurs', path: '/admin/chauffeurs', count: 156 },
    { icon: FileText, label: 'Documents', path: '/admin/documents', count: null },
    { icon: Route, label: 'Trajets', path: '/admin/trajets', count: '2.4K' },
    { icon: Wallet, label: 'Paiements', path: '/admin/paiements', count: null },
    { icon: CheckCircle, label: 'Validations', path: '/admin/validations', count: 12 },
    { icon: Percent, label: 'Commissions', path: '/admin/commissions', count: null },
    { icon: AlertTriangle, label: 'Litiges', path: '/admin/litiges', count: 8 },
    { icon: BarChart3, label: 'Rapports', path: '/admin/rapports', count: null },
    
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 288,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen glass-sidebar  shadow-xl z-30 ${
          collapsed ? 'sidebar-collapsed ' : 'w-72'
        }`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="text-white text-2xl" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-2xl font-bold text-gray-800">
                  Taka<span className="gradient-text">Taka</span>
                </span>
                <span className="text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-2 py-1 rounded-full ml-2 font-medium">
                  Admin
                </span>
              </motion.div>
            )}
          </div>

          {/* Menu */}
        <nav className=" border-t space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                path={item.path}
                count={item.count}
                collapsed={collapsed}
                onClick={onCloseMobile}
              />
            ))}
          </nav>


          {/* Logout */}
          <div className="mt-8 pt-5 border-t border-gray-100">
            <NavLink
              to="/admin/logout"
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-4'} p-4 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition`
              }
            >
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <LogOut className="text-red-500" />
              </div>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  Déconnexion
                </motion.span>
              )}
            </NavLink>
          </div>
        </div>

       
      </motion.aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: mobileOpen ? 0 : -288,
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="lg:hidden fixed left-0 top-0 h-screen w-72 glass-sidebar shadow-xl z-40"
      >
        <div className="p-6">
          {/* Mobile Logo */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <Car className="text-white text-2xl" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">
                Taka<span className="gradient-text">Taka</span>
              </span>
              <span className="text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-2 py-1 rounded-full ml-2 font-medium">
                Admin
              </span>
            </div>
          </div>

          {/* Mobile Menu */}
          <nav className=" border-t space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                label={item.label}
                path={item.path}
                count={item.count}
                collapsed={false}
                onClick={onCloseMobile}
              />
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;