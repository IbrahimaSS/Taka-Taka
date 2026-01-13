// src/components/profile/components/ProfileInfoCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';

const ProfileInfoCard = ({ 
  profile, 
  isEditing, 
  onProfileChange,
  title = "Informations personnelles",
  description = "Mettez à jour vos informations de contact"
}) => {
  const fields = [
    {
      key: 'name',
      label: 'Nom complet',
      icon: User,
      type: 'text',
      placeholder: 'Votre nom complet',
      required: true
    },
    {
      key: 'email',
      label: 'Adresse email',
      icon: Mail,
      type: 'email',
      placeholder: 'votre@email.com',
      required: true
    },
    {
      key: 'phone',
      label: 'Téléphone',
      icon: Phone,
      type: 'tel',
      placeholder: '+224 XXX XX XX XX'
    },
    {
      key: 'location',
      label: 'Localisation',
      icon: MapPin,
      type: 'text',
      placeholder: 'Votre ville, pays'
    }
  ];

  return (
    <Card hoverable className="border-2 border-gray-100 hover:border-blue-100 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-blue-800">{title}</CardTitle>
        {description && <p className="text-gray-600 text-sm">{description}</p>}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: fields.indexOf(field) * 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              
              {isEditing ? (
                <div className="relative">
                  <field.icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={field.type}
                    value={profile[field.key] || ''}
                    onChange={(e) => onProfileChange(field.key, e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <field.icon className="text-blue-600 w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-800">{profile[field.key] || 'Non renseigné'}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

       
       
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;