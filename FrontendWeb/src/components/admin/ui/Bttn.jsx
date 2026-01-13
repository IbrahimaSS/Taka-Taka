// src/components/ui/Bttn.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  loading = false, 
  disabled = false, 
  icon: Icon, 
  onClick, 
  className = '', 
  fullWidth = false,
  tooltip,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-800 to-teal-800 text-white hover:from-blue-800 hover:to-teal-800 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400 border border-gray-200',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 focus:ring-yellow-500',
    success: 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 focus:ring-teal-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 border border-transparent',
    outline: 'bg-transparent text-blue-700 border-2 border-blue-600 hover:bg-blue-50 focus:ring-blue-400',
  };

  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    disabledClass,
    className
  );

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      title={tooltip}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </motion.button>
  );
};

export default Button;