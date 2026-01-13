// src/components/ui/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';


// Card composant pour afficher du contenu dans une carte stylisée
const Card = ({ 
  children, 
  className = '', 
  hoverable = false, 
  padding = 'p-6',
  onClick 
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${padding} ${className} ${
        hoverable ? 'hover:shadow-md transition-shadow duration-300' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-500 text-sm ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>{children}</div>
);

export default Card;