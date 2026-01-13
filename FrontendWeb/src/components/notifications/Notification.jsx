import React from 'react';
import { Clock, AlertCircle, DollarSign, Car, Package } from 'lucide-react';



export 



const typeIcons = {
  trajet,
  paiement,
  system,
  message,
  other
};

const typeColors = {
  trajet: 'bg-blue-100 text-blue-600',
  paiement: 'bg-green-100 text-green-600',
  system: 'bg-yellow-100 text-yellow-600',
  message: 'bg-purple-100 text-purple-600',
  other: 'bg-gray-100 text-gray-600'
};

export const NotificationItem = ({
  notification,
  onMarkAsRead
}) => {
  const Icon = typeIcons[notification.type];

  return (
    <div 
      className={`flex items-start p-3 hover-gray-50 cursor-pointer ${
        !notification.isRead ? 'bg-blue-50' : ''
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      {/* Icon */}
      <div className={`p-2 rounded-full ${typeColors[notification.type]}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Content */}
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900">
            {notification.title}
          </h4>
          <span className="text-xs text-gray-500">
            {notification.time}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {notification.message}
        </p>
        
        {/* Metadata si nécessaire */}
        {notification.metadata && (
          <div className="mt-2 flex flex-wrap gap-2">
            {notification.metadata.prix && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                <DollarSign className="w-3 h-3 mr-1" />
                {notification.metadata.prix}
              </span>
            )}
            {notification.metadata.destination && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                <Car className="w-3 h-3 mr-1" />
                {notification.metadata.destination}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Status indicator */}
      {!notification.isRead && (
        <div className="ml-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      )}
    </div>
  );
};