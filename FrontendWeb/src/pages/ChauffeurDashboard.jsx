// pages/ChauffeurDashboard.tsx
import { useState } from 'react';
import ChauffeurMain from "../components/chauffeur/ChauffeurMain";
import { HeaderSidebar, NavigationSidebar } from "../components/chauffeur/ChauffeurSidebar";

export default function ChauffeurDashboard() {
  // 1. État pour gérer quel onglet est actif
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 2. État pour le statut du chauffeur
  const [currentStatus, setCurrentStatus] = useState('offline');
  
  // 3. État pour le nombre de notifications
  const [notificationsCount, setNotificationsCount] = useState(3);
  
  // 4. État pour la sidebar ouverte/fermée (sur mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Sidebar (en haut) */}
      <HeaderSidebar
        userName="Mariama"
        currentStatus={currentStatus}
        onStatusChange={setCurrentStatus}
        notificationsCount={notificationsCount}
        onNotificationsClick={() => {
          console.log('Notifications cliqué');
          setNotificationsCount(0); // Réinitialiser les notifications quand on clique
        }}
        onProfileClick={() => console.log('Profil cliqué')}
      />

      {/* Navigation Sidebar (à gauche) */}
      <NavigationSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}        // Passe l'onglet actif
        onTabChange={setActiveTab}   // Passe la fonction pour changer
      />

      {/* Contenu principal */}
      <ChauffeurMain activeTab={activeTab} />
    </div>
  );
}