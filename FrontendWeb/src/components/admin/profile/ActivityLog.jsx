// src/components/profile/components/ActivityLog.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Smartphone, MapPin, Clock, ExternalLink } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Bttn';
import Badge from '../ui/Badge';

const ActivityLog = ({ activities = [], onViewAll }) => {
  const defaultActivities = [
    { 
      id: 1, 
      action: 'Connexion réussie', 
      device: 'Chrome sur Windows', 
      time: 'Aujourd\'hui, 10:30', 
      location: 'Conakry, GN',
      status: 'success',
      icon: Shield 
    },
    { 
      id: 2, 
      action: 'Modification du profil', 
      device: 'Safari sur iPhone', 
      time: 'Hier, 16:45', 
      location: 'Conakry, GN',
      status: 'info',
      icon: Shield 
    },
    { 
      id: 3, 
      action: 'Validation de chauffeur', 
      device: 'Chrome sur Windows', 
      time: '28/06/2024, 14:20', 
      location: 'Conakry, GN',
      status: 'success',
      icon: Shield 
    },
    { 
      id: 4, 
      action: 'Ajout d\'utilisateur', 
      device: 'Firefox sur Mac', 
      time: '27/06/2024, 11:15', 
      location: 'Conakry, GN',
      status: 'info',
      icon: Shield 
    }
  ];

  const activityList = activities.length > 0 ? activities : defaultActivities;

  const getStatusColor = (status) => {
    const colors = {
      success: 'success',
      warning: 'warning',
      danger: 'danger',
      info: 'info'
    };
    return colors[status] || 'default';
  };

  return (
    <Card hoverable className="border-2 border-gray-100 hover:border-teal-100 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Journal d'activité</CardTitle>
            <p className="text-gray-600 text-sm">Vos dernières actions sur la plateforme</p>
          </div>
          <Badge variant="outline" size="sm">
            {activityList.length} activités
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activityList.map((activity) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: activity.id * 0.05 }}
              className="flex items-start space-x-4 p-4 hover:bg-gradient-to-r from-blue-50/50 to-white rounded-xl transition-all duration-300 group"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                  <activity.icon className="text-blue-600 w-6 h-6" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{activity.action}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Smartphone className="w-3 h-3 mr-1" />
                        {activity.device}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {activity.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </span>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(activity.status)} size="xs">
                    {activity.status === 'success' ? 'Succès' : 'Info'}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full group"
          icon={ExternalLink}
          onClick={onViewAll}
        >
          <span className="group-hover:text-blue-700 transition-colors">
            Voir tout le journal d'activité
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityLog;