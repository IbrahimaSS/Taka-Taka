// src/components/profile/UserProfile.jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Users, Shield, Bell, Settings,
  Activity, BarChart3, TrendingUp, Calendar,
  Mail, Phone, MapPin
} from 'lucide-react';

// Composants UI
import Tabs from '../ui/Tabs';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Toast from '../ui/Toast';

// Composants Profile
import ProfileHeader from './ProfileHeader';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileAvatarCard from './ProfileAvatarCard';
import SecuritySettings from './SecuritySettings';
import NotificationSettings from './NotificationSettings';
import UserManagement from './UserManagement';
import UserFormModal from './UserFormModal';
import ProfileDocumentsCard from './ProfileDocumentsCard';


// Hooks
import { useImageUpload } from '../../../hooks/useImageUpload';
import { useUserStore } from '../../../data/userStore';

const UserProfile = () => {
  // États principaux
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Gestion de l'avatar
  const { uploadImage } = useImageUpload(null);

  // Données du profil (globales)
  const { profile, updateProfile } = useUserStore();

  // Données des utilisateurs
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Mariam Diallo',
      email: 'mariam@takataka.ci',
      phone: '+224 611 22 33 44',
      role: 'Superviseur',
      status: 'active',
      joinDate: '20/03/2023'
    },
    {
      id: 2,
      name: 'Amadou Bah',
      email: 'amadou@takataka.ci',
      phone: '+224 622 33 44 55',
      role: 'Agent',
      status: 'active',
      joinDate: '15/05/2023'
    },
    {
      id: 3,
      name: 'Fatoumata Kourouma',
      email: 'fatou@takataka.ci',
      phone: '+224 633 44 55 66',
      role: 'Agent',
      status: 'inactive',
      joinDate: '10/07/2023'
    },
    {
      id: 4,
      name: 'Sékou Camara',
      email: 'sekou@takataka.ci',
      phone: '+224 644 55 66 77',
      role: 'Analyste',
      status: 'active',
      joinDate: '01/09/2023'
    },
    {
      id: 5,
      name: 'Aïcha Sow',
      email: 'aicha@takataka.ci',
      phone: '+224 655 66 77 88',
      role: 'Superviseur',
      status: 'active',
      joinDate: '25/11/2023'
    }
  ]);

  // Tabs
  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'users', label: 'Personnels', icon: Users },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  // Handlers
  const handleProfileChange = useCallback((key, value) => {
    updateProfile({ [key]: value });
  }, [updateProfile]);

  const handleAvatarChange = useCallback(async (file) => {
    try {
      const imageUrl = await uploadImage(file);
      updateProfile({ avatar: imageUrl });
      showToast('Succès', 'Photo de profil mise à jour', 'success');
    } catch (error) {
      showToast('Erreur', error.message, 'error');
    }
  }, [uploadImage, updateProfile]);

  const handleSaveProfile = useCallback(() => {
    setIsEditing(false);
    showToast('Succès', 'Profil mis à jour avec succès', 'success');
  }, []);

  const handleEditUser = useCallback((userData) => {
    if (!editingUser || !editingUser.id) return;

    setUsers(prev => prev.map(user =>
      user.id === editingUser.id ? {
        ...user,
        ...userData,
        permissions: {
          // S'assurer que permissions existe
          ...(user.permissions || {}),
          ...(userData.permissions || {})
        }
      } : user
    ));
    setShowUserForm(false);
    setEditingUser(null);
    showToast('Succès', 'Personnel modifié avec succès', 'success');
  }, [editingUser]);

  const handleAddUser = useCallback((userData) => {
    const newUser = {
      ...userData,
      id: users.length + 1,
      status: 'active',
      joinDate: new Date().toLocaleDateString('fr-FR'),
      permissions: userData.permissions || defaultPermissions
    };

    setUsers(prev => [newUser, ...prev]);
    setShowUserForm(false);
    showToast('Succès', 'Personnel ajouté avec succès', 'success');
  }, [users.length]);



  const handleToggleUserStatus = useCallback((userId) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  }, []);

  const showToast = useCallback((title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Rendu du contenu des onglets
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ProfileInfoCard
                  profile={profile}
                  isEditing={isEditing}
                  onProfileChange={handleProfileChange}
                />

                <ProfileDocumentsCard showToast={showToast} />
              </div>

              <div className="space-y-6 w-full">
                <ProfileAvatarCard
                  profile={profile}
                  isEditing={isEditing}
                  onAvatarChange={handleAvatarChange}
                />

                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { label: 'Actions aujourd\'hui', value: '24', icon: User, color: 'green' },
                          { label: 'Validations en attente', value: '12', icon: Shield, color: 'blue' },
                          { label: 'Notifications', value: '8', icon: Bell, color: 'purple' },

                        ].map((stat, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                                <stat.icon className={`text-${stat.color}-500`} />
                              </div>
                              <span className="text-gray-700 dark:text-gray-200">{stat.label}</span>
                            </div>
                            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{stat.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'users':
        return (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UserManagement
              users={users}
              onAddUser={() => {
                setEditingUser(null);
                setShowUserForm(true);
              }}
              onEditUser={(user) => {
                setEditingUser(user);
                setShowUserForm(true);
              }}

              onToggleStatus={handleToggleUserStatus}
              showToast={showToast}
            />
          </motion.div>
        );

      case 'security':
        return (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SecuritySettings />
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NotificationSettings />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <ProfileHeader
          title="Gestion des personnels"
          description="Gérez les profils, permissions et paramètres système"
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditing(false)}
        />

        {/* Onglets */}
        <Card hoverable={false} className="border-2 border-gray-100 dark:border-gray-900">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </Card>

        {/* Contenu */}
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>

      {/* Modal d'ajout/modification d'utilisateur */}
      <UserFormModal
        isOpen={showUserForm}
        onClose={() => {
          setShowUserForm(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        initialData={editingUser ? {
          ...editingUser,
          permissions: editingUser.permissions || {
            view: true,
            edit: false,
            create: false,
            delete: false,
            manageUsers: false
          }
        } : null}
        title={editingUser ? "Modifier l'personnels" : "Ajouter un personnels"}
      />

      {/* Toast */}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default UserProfile;