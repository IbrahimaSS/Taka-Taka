/// src/components/sections/Users.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Eye, Ban, Star, MoreVertical,
  UserCheck, Mail, Calendar, Activity, ChevronDown, Printer, Share2
} from 'lucide-react';
import StatCard from '../layout/StatCard';
import Card, { CardHeader, CardTitle, CardContent } from '../ui/Card';
import Table, { TableRow, TableCell } from '../ui/Table';
import Button from '../ui/Bttn';
import Modal from '../ui/Modal';
import ConfirmModal from '../ui/ConfirmModal';
import Pagination from '../ui/Pagination';

import ExportDropdown from '../ui/ExportDropdown';

import useUsers from '../../../hooks/usePassager';

const Users = ({ showToast }) => {
  // États principaux
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // États pour les modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // États pour les confirmations
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: null,
    confirmText: 'Confirmer',
    destructive: false,
    showComment: false,
    commentLabel: '',
    requireComment: false
  });

  // États pour les filtres
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    dateRange: 'all'
  });

  // États pour les menus déroulants
  const [openMenuId, setOpenMenuId] = useState(null);

  // Réf pour fermer les menus au clic externe
  const menuRefs = useRef({});

  // Données des utilisateurs complètes
  const usersData = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78',
      role: 'passenger',
      city: 'Paris',
      rating: 4.8,
      joinDate: '15/03/2024',
      lastActive: '2024-05-15',
      trips: 42,
      status: 'active',
      initials: 'JD',
      color: 'from-green-500 to-blue-700',
      address: '12 Rue de la Paix, Paris',
      subscription: 'Premium',
      totalSpent: 1245.50,
      documents: ['ID_Card.pdf', 'Selfie.jpg']
    },
    {
      id: 2,
      name: 'Marie Koné',
      email: 'marie.kone@email.com',
      phone: '+33 6 23 45 67 89',
      role: 'driver',
      city: 'Lyon',
      rating: 4.5,
      joinDate: '22/04/2024',
      lastActive: '2024-05-10',
      trips: 18,
      status: 'inactive',
      initials: 'MK',
      color: 'from-green-500 to-blue-700',
      address: '45 Rue Bellecour, Lyon',
      subscription: 'Standard',
      totalSpent: 856.30,
      documents: ['License.pdf', 'Insurance.pdf']
    },
    {
      id: 3,
      name: 'Alice Traoré',
      email: 'alice.traore@email.com',
      phone: '+33 6 34 56 78 90',
      role: 'passenger',
      city: 'Marseille',
      rating: 4.9,
      joinDate: '28/02/2024',
      lastActive: '2024-05-18',
      trips: 63,
      status: 'active',
      initials: 'AT',
      color: 'from-green-500 to-blue-700',
      address: '78 Rue Canebière, Marseille',
      subscription: 'Premium',
      totalSpent: 2345.75,
      documents: ['ID_Card.pdf']
    },
    {
      id: 4,
      name: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      phone: '+33 6 45 67 89 01',
      role: 'driver',
      city: 'Paris',
      rating: 4.2,
      joinDate: '10/01/2024',
      lastActive: '2024-05-20',
      trips: 25,
      status: 'active',
      initials: 'PM',
      color: 'from-green-500 to-blue-700',
      address: '3 Avenue des Champs-Élysées, Paris',
      subscription: 'Pro',
      totalSpent: 1890.20,
      documents: ['License.pdf', 'Registration.pdf', 'Insurance.pdf']
    },
    {
      id: 5,
      name: 'Sophie Bernard',
      email: 'sophie.bernard@email.com',
      phone: '+33 6 56 78 90 12',
      role: 'passenger',
      city: 'Toulouse',
      rating: 4.7,
      joinDate: '05/05/2024',
      lastActive: '2024-05-19',
      trips: 8,
      status: 'active',
      initials: 'SB',
      color: 'from-green-500 to-blue-700',
      address: '22 Place du Capitole, Toulouse',
      subscription: 'Standard',
      totalSpent: 345.90,
      documents: []
    },
    {
      id: 6,
      name: 'Thomas Dubois',
      email: 'thomas.dubois@email.com',
      phone: '+33 6 67 89 01 23',
      role: 'driver',
      city: 'Bordeaux',
      rating: 4.6,
      joinDate: '18/04/2024',
      lastActive: '2024-05-16',
      trips: 32,
      status: 'active',
      initials: 'TD',
      color: 'from-green-500 to-blue-700',
      address: '15 Cours de l\'Intendance, Bordeaux',
      subscription: 'Pro',
      totalSpent: 1678.40,
      documents: ['License.pdf', 'Insurance.pdf']
    },
    {
      id: 7,
      name: 'Camille Petit',
      email: 'camille.petit@email.com',
      phone: '+33 6 78 90 12 34',
      role: 'passenger',
      city: 'Lille',
      rating: 4.4,
      joinDate: '30/03/2024',
      lastActive: '2024-05-14',
      trips: 15,
      status: 'inactive',
      initials: 'CP',
      color: 'from-green-500 to-blue-700',
      address: '8 Rue de la Monnaie, Lille',
      subscription: 'Premium',
      totalSpent: 567.30,
      documents: ['ID_Card.pdf']
    },
    {
      id: 8,
      name: 'Mohamed Ali',
      email: 'mohamed.ali@email.com',
      phone: '+33 6 89 01 23 45',
      role: 'driver',
      city: 'Nice',
      rating: 4.9,
      joinDate: '12/02/2024',
      lastActive: '2024-05-21',
      trips: 47,
      status: 'active',
      initials: 'MA',
      color: 'from-green-500 to-blue-700',
      address: '5 Promenade des Anglais, Nice',
      subscription: 'Premium',
      totalSpent: 2456.80,
      documents: ['License.pdf', 'Registration.pdf', 'Insurance.pdf', 'Technical.pdf']
    }
  ];
  const {
    users,
    toggleStatus,
  } = useUsers(usersData);

  const exportColumns = useMemo(() => [
    { header: 'Nom', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Téléphone', accessor: 'phone' },
    {
      header: 'Rôle',
      accessor: 'role',
      formatter: (v) => (v === 'driver' ? 'Conducteur' : 'Passager'),
    },
    { header: 'Ville', accessor: 'city' },
    { header: 'Statut', accessor: 'status' },
    { header: 'Trajets', accessor: (u) => u.trips ?? 0 },
    { header: 'Note', accessor: (u) => u.rating ?? '-' },
    { header: 'Inscription', accessor: 'joinDate' },
  ], []);


  // Statistiques
  const stats = [
    {
      title: 'Utilisateurs actifs',
      value: '1,842',
      icon: UserCheck,
      color: 'green',
      trend: 'up',
      percentage: 12,
      progress: 75,
      description: '+12% ce mois'
    },
    {
      title: 'Nouveaux ce mois',
      value: '127',
      icon: Activity,
      color: 'blue',
      trend: 'up',
      percentage: 8,
      progress: 65,
      description: '+8% vs dernier mois'
    },
    {
      title: 'Note moyenne',
      value: '4.7/5',
      icon: Star,
      color: 'purple',
      trend: 'stable',
      percentage: 0,
      progress: 94,
      description: 'Basé sur 12.4k avis'
    }
  ];

  
useEffect(() => {
    let result = [...users];

    // Recherche textuelle
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term) ||
        user.city.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (selectedFilters.status && selectedFilters.status !== 'all') {
      result = result.filter(user => user.status === selectedFilters.status);
    }

    // Filtre par date (simplifié)
    if (selectedFilters.dateRange && selectedFilters.dateRange !== 'all') {
      const now = new Date();
      result = result.filter(user => {
        const joinDate = new Date(user.joinDate.split('/').reverse().join('-'));
        const diffDays = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));

        switch (selectedFilters.dateRange) {
          case 'today': return diffDays === 0;
          case 'week': return diffDays <= 7;
          case 'month': return diffDays <= 30;
          default: return true;
        }
      });
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, selectedFilters, users]);

  // Permet de changer la taille de page
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };



  // Pagination des données
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  // Fermer les menus au clic externe
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fermer les menus utilisateur
      Object.values(menuRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setOpenMenuId(null);
        }
      });

    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestion des filtres
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Gestion du menu déroulant
  const toggleMenu = (userId, event) => {
    event.stopPropagation();
    setOpenMenuId(openMenuId === userId ? null : userId);
  };

  // Actions utilisateur
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
    setOpenMenuId(null);
  };


 
  //  fonction pour changer le statut utilisateur avec confirmation (utilise le hook)
  const handleToggleStatus = (user) => {
    setConfirmModal({
      isOpen: true,
      title: user.status === 'active' ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur',
      message: `Êtes-vous sûr de vouloir ${user.status === 'active' ? 'désactiver' : 'activer'} ${user.name} ?`,
      type: user.status === 'active' ? 'warning' : 'validate',
      confirmText: user.status === 'active' ? 'Désactiver' : 'Activer',
      destructive: user.status === 'active',
      onConfirm: () => {
        const updated = toggleStatus(user.id);
        // Mettre à jour selectedUser si ouvert
        setSelectedUser(prev => (prev && prev.id === user.id ? updated : prev));
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
    setOpenMenuId(null);
  };



  // Fonction pour Ouvrir l'mail natif du client
  const openMailClient = (user) => {
    if (!user || !user.email) return;
    const subject = encodeURIComponent('Contact Taka Taka');
    const body = encodeURIComponent(`Bonjour ${user.name},\n\n`);
    const mailto = `mailto:${user.email}?subject=${subject}&body=${body}`;
    // Ouvre le client mail natif
    window.location.href = mailto;
    setOpenMenuId(null);
  };

  // Redirection directe au client mail
  const handleSendEmail = (user) => {
    openMailClient(user);
  };


  
  const handlePrint = () => {
    window.print();
    showToast('Impression', 'Préparation de l\'impression...', 'info');
    setIsExportMenuOpen(false);
  };


  // Fonction de partage
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Liste des utilisateurs Taka Taka',
        text: `Liste de ${filteredUsers.length} utilisateurs`,
        url: window.location.href
      });
    } else {
      showToast('Partage', 'URL copiée dans le presse-papier', 'info');
      navigator.clipboard.writeText(window.location.href);
    }
    setIsExportMenuOpen(false);
  };

  // Fonctions utilitaires
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Actif 
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Inactif
          </span>
        );

      default:
        return null;
    }
  };

  

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${day}/${month}/${year}`;
  };

  const getTimeAgo = (dateString) => {
    const [day, month, year] = dateString.split('/');
    const date = new Date(year, month - 1, day);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  // Options pour les filtres
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actif' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'suspended', label: 'Suspendu' }
  ];



  const dateOptions = [
    { value: 'all', label: 'Les dates' },
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestion des passagers</h1>
          <p className="text-gray-500">Gérez les utilisateurs de la plateforme Taka Taka</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            icon={Printer}
            onClick={handlePrint}
            size="small"
          >
            Imprimer
          </Button>

          <Button
            variant="secondary"
            icon={Share2}
            onClick={handleShare}
            size="small"
          >
            Partager
          </Button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Filtres et recherche */}
      <Card hoverable={false}>

        <div className="grid grid-cols-2 md:grid-cols-5  gap-4">
          {/* Recherche */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, téléphone ou ville..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtre Statut */}
          <div className="relative">
            <select
              className="w-full border border-gray-200 rounded-xl px-2 py-3 pr-10 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition appearance-none bg-white"
              value={selectedFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Filtre hebdomadaire */}

          <div className="relative">
            <select
              className="w-full border border-gray-200 rounded-xl px-10 py-3 pr-10 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition appearance-none bg-white"
              value={selectedFilters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          </div>

          {/* Export (réutilisable) */}
          <ExportDropdown
            data={filteredUsers}
            columns={exportColumns}
            fileName="utilisateurs_taka_taka"
            title="Liste des utilisateurs - Taka Taka"
            showToast={showToast}
            onPrint={handlePrint}
            onShare={handleShare}
          />

        </div>


      </Card>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Liste des utilisateurs</CardTitle>
              <p className="text-gray-500 text-sm">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Affichier:</span>
              <select
                className="border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-green-400"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                <option value={5}>5 par page</option>
                <option value={10}>10 par page</option>
                <option value={25}>25 par page</option>
                <option value={50}>50 par page</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Tableau */}
          <div className="overflow-x-auto">
            <Table
              headers={['Utilisateur', 'Trajets', 'Inscription', 'Statut', 'Actions']}
            >
              {paginatedUsers.map((user) => (
                <TableRow key={user.id} hoverable>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center mr-3`}>
                        <span className="text-white font-bold text-sm">{user.initials}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-gray-800">{user.trips}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-800">{user.joinDate}</div>
                    <div className="text-xs text-gray-500">
                      {getTimeAgo(user.joinDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end">
                      <div className="relative" ref={el => menuRefs.current[user.id] = el}>
                        <Button
                          variant="ghost"
                          size="small"
                          icon={MoreVertical}
                          onClick={(e) => toggleMenu(user.id, e)}
                          className="hover:bg-gray-100"
                        />

                        {/* Menu déroulant des actions */}
                        <AnimatePresence>
                          {openMenuId === user.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-40"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => handleViewDetails(user)}
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye className="w-4 h-4 mr-3 text-blue-500" />
                                  Voir les détails
                                </button>

                                <button
                                  onClick={() => handleToggleStatus(user)}
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  {user.status === 'active' ? (
                                    <Ban className="w-4 h-4 mr-3 text-yellow-500" />
                                  ) : (
                                    <UserCheck className="w-4 h-4 mr-3 text-green-500" />
                                  )}
                                  {user.status === 'active' ? 'Désactiver' : 'Activer'}
                                </button>

                                <button
                                  onClick={() => handleSendEmail(user)}
                                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Mail className="w-4 h-4 mr-3 text-purple-500" />
                                  Envoyer un email
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredUsers.length / pageSize)}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalItems={filteredUsers.length}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}

          {/* Aucun résultat */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-500">Aucun utilisateur ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de détail utilisateur */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedUser ? `Détails de ${selectedUser.name}` : ''}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6 scroll-m-t-2 overflow-auto h-[70vh]">
            {/* En-tête avec avatar et info basique */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${selectedUser.color} flex items-center justify-center`}>
                <span className="text-white text-3xl font-bold">{selectedUser.initials}</span>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h3>
                  {getStatusBadge(selectedUser.status)}
                </div>

                <p className="text-gray-600 mb-1">{selectedUser.email}</p>
                <p className="text-gray-600">{selectedUser.phone}</p>
              </div>

              <div className="flex justify-start ">
                <Button
                  variant="ghost"
                  size="small"
                  icon={Mail}
                  onClick={() => handleSendEmail(selectedUser)}
                >
                  Contacter
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{selectedUser.trips}</div>
                <div className="text-sm text-gray-500">Trajets effectués</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-2xl font-bold text-gray-800">{selectedUser.rating}</span>
                </div>
                <div className="text-sm text-gray-500">Note moyenne</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {selectedUser.totalSpent ? `${selectedUser.totalSpent.toFixed(2)}€` : '0€'}
                </div>
                <div className="text-sm text-gray-500">Total dépensé</div>
              </div>

              
            </div>

            {/* Informations détaillées */}
            <div className="grid grid-cols-1  gap-6 ms-10">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-700">Informations personnelles</h4>
                <div className="space-y-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="grid justify-between grid-cols-1 gap-4">
                    <div className="text-gray-500">Date d'inscription:</div>
                    <div className="font-medium">{selectedUser.joinDate}</div>
                  </div>
                  <div className="grid justify-between grid-cols-1 gap-4">
                    <div className="text-gray-500">Dernière activité:</div>
                    <div className="font-medium">{getTimeAgo(selectedUser.lastActive)}</div>
                  </div>
                  <div className="grid justify-between grid-cols-1 gap-4">
                    <div className="text-gray-500">Ville:</div>
                    <div className="font-medium">{selectedUser.city}</div>
                  </div>
                </div>
              </div>

             
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end me-10 gap-2 pt-4 border-t border-gray-200">
              
              <Button
                variant={selectedUser.status === 'active' ? 'warning' : 'success'}
                icon={selectedUser.status === 'active' ? Ban : UserCheck}
                onClick={() => handleToggleStatus(selectedUser)}
              >
                {selectedUser.status === 'active' ? 'Désactiver' : 'Activer'}
              </Button>
             
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de confirmation */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.confirmText}
        cancelText="Annuler"
        destructive={confirmModal.destructive}
        showComment={confirmModal.showComment}
        commentLabel={confirmModal.commentLabel}
        requireComment={confirmModal.requireComment}
      />
    </div>
  );
};

export default Users;