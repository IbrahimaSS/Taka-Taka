// src/hooks/useSidebar.js

import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Custom hook to manage sidebar state
export const useSidebar = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useSidebar must be used within AppProvider');
  }
  
  return {
    isCollapsed: context.sidebarCollapsed, // Renamed for clarity
    isMobileOpen: context.mobileMenuOpen,
    toggle: context.toggleSidebar,
    toggleMobile: context.toggleMobileMenu,
  };
};