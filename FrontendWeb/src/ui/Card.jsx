import React from 'react';

const Card = ({ 
  children, 
  className = '',
  hover = true,
  gradient = true,
  padding = true
}) => {
  // Classes de base
  const baseClasses = `
    rounded-2xl 
    transition-all duration-300 
    backdrop-blur-sm 
    border 
    ${padding ? 'p-6' : ''}
  `;
  
  // Classes de couleur
  const colorClasses = gradient 
    ? 'bg-gradient-to-b from-blue-500/10 via-white to-green-500/10 dark:from-gray-800 dark:to-gray-900 border-gray-200/50 dark:border-gray-700/50' 
    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  
  // Classes de hover
  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:-translate-y-1 hover:border-primaryGreen-start/30 dark:hover:border-primaryGreen-start/50' 
    : '';
  
  // Combiner toutes les classes
  const combinedClasses = `
    ${baseClasses}
    ${colorClasses}
    ${hoverClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default Card;