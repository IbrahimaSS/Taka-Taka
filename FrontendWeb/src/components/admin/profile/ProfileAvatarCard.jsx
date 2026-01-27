// src/components/profile/components/ProfileAvatarCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Calendar, MapPin, Shield, Camera } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Bttn';
import Badge from '../ui/Badge';

const ProfileAvatarCard = ({
  profile,
  isEditing,
  onAvatarChange
}) => {
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onAvatarChange(file);
    }
  };

  const renderUserAvatar = (user) => {
    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full rounded-full object-cover border-4 border-white"
        />
      );
    }
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-700 to-teal-700 flex items-center justify-center text-white text-3xl font-bold">
        {user.name.split(' ').map(n => n[0]).join('')}
      </div>
    );
  };

  const getRoleColor = (role) => {
    const colors = {
      'Administrateur': 'admin',
      'Superviseur': 'supervisor',
      'Agent': 'agent',
      'Analyste': 'info'
    };
    return colors[role] || 'primary';
  };

  return (
    <Card hoverable className="border-2 border-gray-100 dark:border-gray-800 hover:border-blue-100 transition-all duration-300">
      <CardContent className="text-center p-6">
        {/* Avatar */}
        <div className="relative inline-block mb-6">
          <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white">
            {renderUserAvatar(profile)}
          </div>

          {isEditing && (
            <>
              <input
                type="file"
                accept="/*"
                onChange={handleFileSelect}
                className="hidden"
                id="avatar-upload"
              />
              <motion.label
                htmlFor="avatar-upload"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-200 shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <Camera className="w-5 h-5 text-blue-600" />
              </motion.label>
            </>
          )}
        </div>

        {/* Nom et rôle */}
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{profile.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{profile.position || profile.role}</p>

        <div className="mb-6">
          <Badge
            variant={getRoleColor(profile.role)}
            size="md"
            className="inline-flex items-center gap-2"
          >
            <Shield className="w-3 h-3" />
            {profile.role}
          </Badge>
        </div>

        {/* Informations */}
        <div className="space-y-3 mt-8">
          {[
            { icon: Mail, label: 'Email', value: profile.email },
            { icon: Phone, label: 'Téléphone', value: profile.phone },
            { icon: Calendar, label: 'Membre depuis', value: profile.joinDate },
            { icon: MapPin, label: 'Localisation', value: profile.location }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ x: 5 }}
              className="flex items-center flex-wrap gap-3 justify-between text-sm p-3 hover:bg-blue-50 dark:hover:bg-gray-900/40  rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <item.icon className="text-blue-600 w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>
              <div className="font-semibold text-gray-800 dark:text-gray-100">{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Actions rapides */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button
              variant="outline"
              size="small"
              fullWidth
              onClick={() => document.getElementById('avatar-upload').click()}
            >
              Changer la photo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileAvatarCard;