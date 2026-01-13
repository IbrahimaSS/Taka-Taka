import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatCard from '../layout/StatCard';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Table, { TableRow, TableCell } from '../ui/Table';
import Button from '../ui/Bttn';
import Badge from '../ui/Badge';
import Tabs from '../ui/Tabs';
import Pagination from '../ui/Pagination';
import Modal from '../ui/Modal';
import Toast from '../ui/Toast';
import ConfirmModal from '../ui/ConfirmModal';
import {
  Route, PlayCircle, XCircle, DollarSign,
  RefreshCw, Filter, MapPin, User, Car,
  CheckCircle, Clock, AlertCircle,
  Eye, ChevronLeft, ChevronRight, List,
  ArrowRight, Settings as SettingsIcon,
  Search, MoreVertical, Download, Printer,
  Calendar, ChevronDown, ChartLine, ChartBar,
  TrendingUp, TrendingDown, BarChart3, Activity,
  FileText, ExternalLink, Copy, Share2, Bell,
  Lock, Unlock, Trash2, Edit2, Save, Upload,
  Folder, Grid, Maximize2, ZoomIn, ZoomOut,
  RotateCw, Hash, Percent, LineChart as LineChartIcon,
  BarChart2, HelpCircle, Info, DownloadCloud,
  Wifi, Battery, Signal, Volume2, Sun, Cloud,
  Archive, ArchiveRestore, FileSpreadsheet, FileDown,
  FilePieChart, Navigation, Phone, Mail,
  Star as StarIcon, MessageSquare, Shield, BellRing,
  BatteryCharging, WifiOff, VolumeX, Moon, CloudRain,
  FileCode,
  Maximize, Minimize, Map, Compass, Target,
  Users, Flag, Home, Building, Coffee,
  Plus, X, Save as SaveIcon, Camera,
  Music, Video, Headphones, Mic, PhoneCall,
  PhoneIncoming, PhoneOutgoing, PhoneMissed,
  PhoneOff, Voicemail, PhoneForwarded,
  FileChartColumn,
  FileXCorner,
  FileDiff,
  FileDownIcon,
  Smartphone
} from 'lucide-react';
import { color } from 'chart.js/helpers';

const Trips = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [timeFilter, setTimeFilter] = useState('today');
  const [filters, setFilters] = useState({
    departure: '',
    destination: '',
    date: '',
    status: 'all',
    vehicleType: 'all'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedTrips, setSelectedTrips] = useState([]);
  const [showToast, setShowToast] = useState({ show: false, title: '', message: '', type: 'success' });
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followTrip, setFollowTrip] = useState(null);
  const [followProgress, setFollowProgress] = useState(0);
  const [archivedTrips, setArchivedTrips] = useState([]);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [tripToArchive, setTripToArchive] = useState(null);
  const [showArchivedTrips, setShowArchivedTrips] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const exportMenuRef = useRef(null);
  const followIntervalRef = useRef(null);

  const tabs = [
    { id: 'all', label: 'Tous', icon: List, count: 0 },
    { id: 'in-progress', label: 'En cours', icon: PlayCircle, count: 0 },
    { id: 'completed', label: 'Terminés', icon: CheckCircle, count: 0 },
    { id: 'cancelled', label: 'Annulés', icon: XCircle, count: 0 },
    { id: 'pending', label: 'En attente', icon: Clock, count: 0 },
    { id: 'archived', label: 'Archivés', icon: Archive, count: archivedTrips.length }
  ];

  // Données initiales des trajets
  const initialTripsData = useMemo(() => [
    {
      id: 'TR-001245',
      time: '10:30 AM',
      route: 'Plateau → Marcory',
      distance: '8.2 km',
      duration: '18 min',
      passenger: {
        name: 'Jean Dupont',
        phone: '+225 01 23 45 67 89',
        email: 'jean.dupont@email.com',
        rating: 4.8,
        tripsCount: 24,
        memberSince: '2023-03-15'
      },
      driver: {
        name: 'Kouamé Adou',
        phone: '+225 07 89 12 34 56',
        rating: 4.9,
        vehicleType: 'Toyota Corolla',
        yearsExperience: 3,
        completedTrips: 456
      },
      vehicle: {
        type: 'Toyota Corolla',
        plate: 'AB-123-CD',
        color: 'Blanc',
        year: 2022,
        capacity: 4,
        fuelType: 'Essence'
      },
      amount: '1 500 GNF',
      paymentMethod: 'Espèces',
      status: 'completed',
      date: '2024-07-01',
      startTime: '10:30:00',
      endTime: '10:48:00',
      startLocation: {
        lat: 5.3546,
        lng: -4.0083,
        address: 'Plateau, Abidjan',
        city: 'Abidjan',
        district: 'Plateau'
      },
      endLocation: {
        lat: 5.2971,
        lng: -4.0916,
        address: 'Marcory, Abidjan',
        city: 'Abidjan',
        district: 'Marcory'
      },
      fareBreakdown: {
        base: 1000,
        distance: 300,
        time: 200,
        total: 1500,
        commission: 225,
        platformFee: 75,
        driverEarnings: 1200
      },
      rating: {
        passenger: 5,
        driver: 5,
        comments: 'Excellent service, chauffeur très ponctuel',
        date: '2024-07-01 11:00:00'
      },
      notes: 'Trajet direct sans détour',
      archived: false,
      starred: true,
      createdAt: '2024-07-01 10:25:00',
      updatedAt: '2024-07-01 11:00:00'
    },
    {
      id: 'TR-001244',
      time: '09:45 AM',
      route: 'Cocody → Yopougon',
      distance: '12.5 km',
      duration: '25 min',
      passenger: {
        name: 'Marie Koné',
        phone: '+225 05 67 89 01 23',
        email: 'marie.kone@email.com',
        rating: 4.5,
        tripsCount: 12,
        memberSince: '2023-08-22'
      },
      driver: {
        name: 'Aïcha Diarra',
        phone: '+225 01 34 56 78 90',
        rating: 4.7,
        vehicleType: 'Peugeot 208',
        yearsExperience: 2,
        completedTrips: 234
      },
      vehicle: {
        type: 'Peugeot 208',
        plate: 'EF-456-GH',
        color: 'Rouge',
        year: 2021,
        capacity: 4,
        fuelType: 'Diesel'
      },
      amount: '2 000 GNF',
      paymentMethod: 'Mobile Money',
      status: 'in-progress',
      date: '2024-07-01',
      startTime: '09:45:00',
      endTime: null,
      startLocation: {
        lat: 5.3598,
        lng: -3.9876,
        address: 'Cocody, Abidjan',
        city: 'Abidjan',
        district: 'Cocody'
      },
      endLocation: {
        lat: 5.3345,
        lng: -4.0567,
        address: 'Yopougon, Abidjan',
        city: 'Abidjan',
        district: 'Yopougon'
      },
      fareBreakdown: {
        base: 1200,
        distance: 500,
        time: 300,
        total: 2000,
        commission: 300,
        platformFee: 100,
        driverEarnings: 1600
      },
      rating: null,
      notes: 'Trajet avec arrêt intermédiaire',
      archived: false,
      starred: false,
      createdAt: '2024-07-01 09:40:00',
      updatedAt: '2024-07-01 09:45:00',
      currentLocation: { lat: 5.3456, lng: -4.0123 },
      estimatedArrival: '10:10 AM'
    },
    {
      id: 'TR-001243',
      time: '08:15 AM',
      route: 'Treichville → Koumassi',
      distance: '6.5 km',
      duration: '15 min',
      passenger: {
        name: 'Pierre Gbédé',
        phone: '+225 07 12 34 56 78',
        email: 'pierre.gbede@email.com',
        rating: 4.9,
        tripsCount: 48,
        memberSince: '2022-11-05'
      },
      driver: {
        name: 'Mohamed Sylla',
        phone: '+225 01 45 67 89 01',
        rating: 4.6,
        vehicleType: 'Honda Accord',
        yearsExperience: 4,
        completedTrips: 567
      },
      vehicle: {
        type: 'Honda Accord',
        plate: 'IJ-789-KL',
        color: 'Noir',
        year: 2020,
        capacity: 4,
        fuelType: 'Essence'
      },
      amount: '800 GNF',
      paymentMethod: 'Espèces',
      status: 'pending',
      date: '2024-07-01',
      startTime: null,
      endTime: null,
      startLocation: {
        lat: 5.2973,
        lng: -4.0084,
        address: 'Treichville, Abidjan',
        city: 'Abidjan',
        district: 'Treichville'
      },
      endLocation: {
        lat: 5.2845,
        lng: -3.9567,
        address: 'Koumassi, Abidjan',
        city: 'Abidjan',
        district: 'Koumassi'
      },
      fareBreakdown: {
        base: 500,
        distance: 200,
        time: 100,
        total: 800,
        commission: 120,
        platformFee: 40,
        driverEarnings: 640
      },
      rating: null,
      notes: 'Attente du chauffeur',
      archived: false,
      starred: false,
      createdAt: '2024-07-01 08:10:00',
      updatedAt: '2024-07-01 08:15:00',
      waitingTime: '5 minutes'
    },
    {
      id: 'TR-001242',
      time: 'Hier, 17:20',
      route: 'Abobo → Cocody',
      distance: '14.3 km',
      duration: '30 min',
      passenger: {
        name: 'Alice Traoré',
        phone: '+225 05 89 01 23 45',
        email: 'alice.traore@email.com',
        rating: 4.7,
        tripsCount: 31,
        memberSince: '2023-05-18'
      },
      driver: {
        name: 'Yves Traoré',
        phone: '+225 07 34 56 78 90',
        rating: 4.8,
        vehicleType: 'Kia Rio',
        yearsExperience: 1,
        completedTrips: 123
      },
      vehicle: {
        type: 'Kia Rio',
        plate: 'MN-012-OP',
        color: 'Bleu',
        year: 2023,
        capacity: 4,
        fuelType: 'Essence'
      },
      amount: '1 200 GNF',
      paymentMethod: 'Orange Money',
      status: 'cancelled',
      date: '2024-06-30',
      startTime: '17:20:00',
      endTime: null,
      startLocation: {
        lat: 5.4123,
        lng: -4.0345,
        address: 'Abobo, Abidjan',
        city: 'Abidjan',
        district: 'Abobo'
      },
      endLocation: {
        lat: 5.3598,
        lng: -3.9876,
        address: 'Cocody, Abidjan',
        city: 'Abidjan',
        district: 'Cocody'
      },
      fareBreakdown: {
        base: 800,
        distance: 300,
        time: 100,
        total: 1200,
        commission: 180,
        platformFee: 60,
        driverEarnings: 960
      },
      rating: null,
      notes: 'Annulé par le passager',
      archived: true,
      starred: false,
      createdAt: '2024-06-30 17:15:00',
      updatedAt: '2024-06-30 17:25:00',
      cancellationReason: 'Chauffeur non disponible',
      cancelledBy: 'passenger'
    },
    {
      id: 'TR-001241',
      time: 'Hier, 14:10',
      route: 'Marcory → Plateau',
      distance: '9.1 km',
      duration: '20 min',
      passenger: {
        name: 'David Koffi',
        phone: '+225 01 56 78 90 12',
        email: 'david.koffi@email.com',
        rating: 4.6,
        tripsCount: 19,
        memberSince: '2023-09-30'
      },
      driver: {
        name: 'Fatou Diop',
        phone: '+225 05 67 89 01 23',
        rating: 4.9,
        vehicleType: 'Hyundai Elantra',
        yearsExperience: 5,
        completedTrips: 678
      },
      vehicle: {
        type: 'Hyundai Elantra',
        plate: 'QR-345-ST',
        color: 'Gris',
        year: 2021,
        capacity: 4,
        fuelType: 'Diesel'
      },
      amount: '1 800 GNF',
      paymentMethod: 'Wave',
      status: 'completed',
      date: '2024-06-30',
      startTime: '14:10:00',
      endTime: '14:30:00',
      startLocation: {
        lat: 5.2971,
        lng: -4.0916,
        address: 'Marcory, Abidjan',
        city: 'Abidjan',
        district: 'Marcory'
      },
      endLocation: {
        lat: 5.3546,
        lng: -4.0083,
        address: 'Plateau, Abidjan',
        city: 'Abidjan',
        district: 'Plateau'
      },
      fareBreakdown: {
        base: 1100,
        distance: 400,
        time: 300,
        total: 1800,
        commission: 270,
        platformFee: 90,
        driverEarnings: 1440
      },
      rating: {
        passenger: 4,
        driver: 5,
        comments: 'Conduite très agréable et véhicule propre',
        date: '2024-06-30 14:35:00'
      },
      notes: 'Trajet fluide',
      archived: false,
      starred: true,
      createdAt: '2024-06-30 14:05:00',
      updatedAt: '2024-06-30 14:35:00'
    }
  ], []);

  const [tripsData, setTripsData] = useState(initialTripsData);

  // Filtrer les données
  const filteredTrips = useMemo(() => {
    let trips = tripsData.filter(trip => !trip.archived);

    if (showArchivedTrips || activeTab === 'archived') {
      trips = tripsData.filter(trip => trip.archived);
    }

    return trips.filter(trip => {
      // Filtre par onglet (sauf archived qui est géré au-dessus)
      if (activeTab !== 'all' && activeTab !== 'archived' && trip.status !== activeTab) return false;

      // Filtre par recherche
      if (search && !trip.id.toLowerCase().includes(search.toLowerCase()) &&
        !trip.route.toLowerCase().includes(search.toLowerCase()) &&
        !trip.passenger.name.toLowerCase().includes(search.toLowerCase()) &&
        !trip.driver.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Filtres supplémentaires
      if (filters.status !== 'all' && trip.status !== filters.status) return false;
      if (filters.vehicleType !== 'all' && trip.vehicle.type.toLowerCase().includes(filters.vehicleType.toLowerCase())) return false;
      if (filters.date && trip.date !== filters.date) return false;
      if (filters.departure && !trip.startLocation.district.toLowerCase().includes(filters.departure.toLowerCase())) return false;
      if (filters.destination && !trip.endLocation.district.toLowerCase().includes(filters.destination.toLowerCase())) return false;

      return true;
    });
  }, [tripsData, activeTab, showArchivedTrips, search, filters]);

  // Pagination
  const paginatedTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTrips.slice(startIndex, endIndex);
  }, [filteredTrips, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredTrips.length / pageSize);

  // Mettre à jour les comptes des onglets
  useEffect(() => {
    const updatedTabs = tabs.map(tab => {
      if (tab.id === 'archived') {
        return { ...tab, count: archivedTrips.length };
      }
      const count = tripsData.filter(trip =>
        !trip.archived &&
        (tab.id === 'all' || trip.status === tab.id)
      ).length;
      return { ...tab, count };
    });
    
  }, [tripsData, archivedTrips.length]);

  const stats = useMemo(() => [
    {
      title: "Trajets aujourd'hui",
      value: tripsData.filter(t => !t.archived && t.date === new Date().toISOString().split('T')[0]).length.toString(),
      icon: Route,
      color: "green",
      trend: "up",
      percentage: 65,
      progress: 65,
      subtitle: "Trajets terminés"
    },
    {
      title: "En cours",
      value: tripsData.filter(t => !t.archived && t.status === 'in-progress').length.toString(),
      icon: PlayCircle,
      color: "blue",
      trend: "up",
      percentage: 85,
      progress: 85,
      subtitle: "Trajets actifs"
    },
    {
      title: "Annulés",
      value: tripsData.filter(t => !t.archived && t.status === 'cancelled').length.toString(),
      icon: XCircle,
      color: "yellow",
      trend: "down",
      percentage: 12,
      progress: 12,
      subtitle: "4% du total"
    },
    {
      title: "Revenus journaliers",
      value: `${tripsData
        .filter(t => !t.archived && t.status === 'completed' && t.date === new Date().toISOString().split('T')[0])
        .reduce((sum, t) => sum + parseInt(t.amount.replace(/[^0-9]/g, '')), 0)
        .toLocaleString('fr-FR')} GNF`,
      icon: DollarSign,
      color: "purple",
      trend: "up",
      percentage: 92,
      progress: 92,
      subtitle: "+18% vs hier"
    }
  ], [tripsData]);

  const getStatusBadge = (status) => {
     const config = {
      completed: { label: 'Terminé', colo: 'blue', icon: CheckCircle },
      'in-progress': { label: 'En cours', color: 'yellow', icon: PlayCircle },
      pending: { label: 'En attente', color: 'gray', icon: Clock },
      cancelled: { label: 'Annulé', color: 'red', icon: XCircle }
    };

    const { label, color, icon: Icon } = config[status] || config.pending;
    return (
      <Badge className={`text-${color}-500 `}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getPaymentBadge = (method) => {
    const config = {
      'Espèces': { label: 'Espèces', colo: 'blue', icon: DollarSign },
      'Mobile Money': { label: 'Mobile Money', color: 'yellow', icon: Smartphone },
      'Orange Money': { label: 'Orange Money', color: 'red', icon: Phone },
    };

    const { label, color, icon: Icon } = config[method] || { label: method, color: 'gray', icon: DollarSign };
    return (
      <Badge className={`text-${color}-500 `} size="sm">
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    showToastMessage('Filtres appliqués', 'Les filtres ont été appliqués avec succès', 'success');
  };

  const handleClearFilters = () => {
    setFilters({
      departure: '',
      destination: '',
      date: '',
      status: 'all',
      vehicleType: 'all'
    });
    setSearch('');
    setCurrentPage(1);
    showToastMessage('Filtres réinitialisés', 'Tous les filtres ont été réinitialisés', 'info');
  };

  const showToastMessage = (title, message, type = 'success') => {
    setShowToast({ show: true, title, message, type });
    setTimeout(() => {
      setShowToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleViewTripDetails = (trip) => {
    setSelectedTrip(trip);
    setShowTripDetails(true);
  };

  const handleStartFollow = (trip) => {
    setFollowTrip(trip);
    setShowFollowModal(true);
    setFollowProgress(0);

    // Simuler le suivi en temps réel
    if (followIntervalRef.current) {
      clearInterval(followIntervalRef.current);
    }

    followIntervalRef.current = setInterval(() => {
      setFollowProgress(prev => {
        if (prev >= 100) {
          clearInterval(followIntervalRef.current);
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const handleStopFollow = () => {
    setShowFollowModal(false);
    setFollowTrip(null);
    if (followIntervalRef.current) {
      clearInterval(followIntervalRef.current);
    }
    setFollowProgress(0);
  };

  const handleArchiveTrip = (trip) => {
    setTripToArchive(trip);
    setShowArchiveConfirm(true);
  };

  const confirmArchiveTrip = () => {
    setTripsData(prev => prev.map(t =>
      t.id === tripToArchive.id ? { ...t, archived: true } : t
    ));
    setArchivedTrips(prev => [...prev, { ...tripToArchive, archived: true }]);
    setShowArchiveConfirm(false);
    setTripToArchive(null);
    showToastMessage('Trajet archivé', `Le trajet ${tripToArchive.id} a été archivé avec succès`, 'success');
  };

  const handleUnarchiveTrip = (trip) => {
    setTripsData(prev => prev.map(t =>
      t.id === trip.id ? { ...t, archived: false } : t
    ));
    setArchivedTrips(prev => prev.filter(t => t.id !== trip.id));
    showToastMessage('Trajet désarchivé', `Le trajet ${trip.id} a été restauré avec succès`, 'success');
  };

  const handleSelectTrip = (tripId, checked) => {
    setSelectedTrips(prev =>
      checked
        ? [...prev, tripId]
        : prev.filter(id => id !== tripId)
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTrips(paginatedTrips.map(t => t.id));
    } else {
      setSelectedTrips([]);
    }
  };

  const handleBulkArchive = () => {
    if (selectedTrips.length === 0) {
      showToastMessage('Aucun trajet sélectionné', 'Veuillez sélectionner au moins un trajet', 'warning');
      return;
    }

    setTripsData(prev => prev.map(t =>
      selectedTrips.includes(t.id) ? { ...t, archived: true } : t
    ));
    setArchivedTrips(prev => [...prev, ...tripsData.filter(t => selectedTrips.includes(t.id))]);
    setSelectedTrips([]);
    showToastMessage('Trajets archivés', `${selectedTrips.length} trajets ont été archivés avec succès`, 'success');
  };

  const handleExport = (format) => {
    let data = paginatedTrips;
    let blob;
    let filename = `trajets_export_${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'csv':
        const csv = [
          ['ID', 'Itinéraire', 'Passager', 'Chauffeur', 'Montant', 'Méthode', 'Statut', 'Date'],
          ...data.map(t => [
            t.id,
            t.route,
            t.passenger.name,
            t.driver.name,
            t.amount,
            t.paymentMethod,
            t.status,
            t.date
          ])
        ].map(row => row.join(';')).join('\n');

        blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        filename += '.csv';
        break;

      case 'pdf':
        showToastMessage('Export PDF', 'Génération du PDF en cours...', 'info');
        // Simuler la génération PDF
        setTimeout(() => {
          showToastMessage('Export réussi', 'Le PDF a été généré avec succès', 'success');
        }, 2000);
        setShowExportMenu(false);
        return;

      case 'doc':
        showToastMessage('Export Word', 'Génération du document Word en cours...', 'info');
        // Simuler la génération Word
        setTimeout(() => {
          showToastMessage('Export réussi', 'Le document Word a été généré avec succès', 'success');
        }, 2000);
        setShowExportMenu(false);
        return;
    }

    if (blob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      showToastMessage('Export réussi', `Fichier ${filename} téléchargé`, 'success');
    }

    setShowExportMenu(false);
  };

  const handlePrint = () => {
    window.print();
    showToastMessage('Impression', 'Impression lancée...', 'info');
  };

  const handleRefresh = () => {
    // Simuler le rafraîchissement des données
    setCurrentPage(1);
    showToastMessage('Données actualisées', 'La liste des trajets a été actualisée', 'info');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'table' ? 'grid' : 'table');
  };

  // Fermer le menu d'export en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const TripActions = ({ trip }) => {
    const [showActions, setShowActions] = useState(false);
    const actionsRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (actionsRef.current && !actionsRef.current.contains(event.target)) {
          setShowActions(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={actionsRef}>
        <Button
          variant="ghost"
          size="small"
          icon={MoreVertical}
          onClick={() => setShowActions(!showActions)}
        />

        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
            >
              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-gray-700"
                  onClick={() => {
                    handleViewTripDetails(trip);
                    setShowActions(false);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2 text-blue-500" />
                  Voir détails
                </button>

                {trip.status === 'in-progress' && (
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-gray-700"
                    onClick={() => {
                      handleStartFollow(trip);
                      setShowActions(false);
                    }}
                  >
                    <PlayCircle className="w-4 h-4 mr-2 text-green-500" />
                    Suivre en direct
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const TripDetailsModal = () => {
    if (!selectedTrip) return null;

    return (
      <Modal
        isOpen={showTripDetails}
        onClose={() => setShowTripDetails(false)}
        title="Détails du trajet"
        size="lg"
      >
        <div className="space-y-6 overflow-auto h-[70vh] px-1">
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{selectedTrip.route}</h2>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <Badge variant="secondary">{selectedTrip.id}</Badge>
                {getStatusBadge(selectedTrip.status)}
                {getPaymentBadge(selectedTrip.paymentMethod)}
                {selectedTrip.starred && (
                  <Badge variant="warning" size="sm">
                    <StarIcon className="w-3 h-3 mr-1" />
                    Favori
                  </Badge>
                )}
                {selectedTrip.archived && (
                  <Badge variant="secondary" size="sm">
                    <Archive className="w-3 h-3 mr-1" />
                    Archivé
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-2">
                {selectedTrip.date} à {selectedTrip.time} • {selectedTrip.distance} • {selectedTrip.duration}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">{selectedTrip.amount}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>

          {/* Itinéraire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-blue-500" />
                Itinéraire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="w-0.5 h-12 bg-green-300 mx-auto my-1"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="mb-4">
                      <p className="font-medium text-gray-800">Départ</p>
                      <p className="text-sm text-gray-600">{selectedTrip.startLocation.address}</p>
                      <p className="text-xs text-gray-500">Heure: {selectedTrip.startTime || 'Non défini'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Arrivée</p>
                      <p className="text-sm text-gray-600">{selectedTrip.endLocation.address}</p>
                      <p className="text-xs text-gray-500">Heure: {selectedTrip.endTime || 'Non défini'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passager et Chauffeur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-500" />
                  Passager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <User className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{selectedTrip.passenger.name}</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-medium">{selectedTrip.passenger.rating}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedTrip.passenger.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedTrip.passenger.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Route className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedTrip.passenger.tripsCount} trajets</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-blue-500" />
                  Chauffeur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Car className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{selectedTrip.driver.name}</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        {/* <span className="text-sm font-medium">{selectedTrip.driver.rating}/5</span> */}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedTrip.driver.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedTrip.driver.vehicleType}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{selectedTrip.driver.completedTrips} trajets</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Véhicule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="w-5 h-5 mr-2 text-purple-500" />
                Véhicule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Modèle</p>
                  <p className="font-medium">{selectedTrip.vehicle.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plaque</p>
                  <p className="font-medium">{selectedTrip.vehicle.plate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Couleur</p>
                  <p className="font-medium">{selectedTrip.vehicle.color}</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500">Année</p>
                  <p className="font-medium">{selectedTrip.vehicle.year}</p>
                </div> */}
                <div>
                  <p className="text-sm text-gray-500">Capacité</p>
                  <p className="font-medium">{selectedTrip.vehicle.capacity} places</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500">Carburant</p>
                  <p className="font-medium">{selectedTrip.vehicle.fuelType}</p>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Détails financiers */}
          {selectedTrip.fareBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Détails financiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarif de base:</span>
                    <span className="font-medium">{selectedTrip.fareBreakdown.base} GNF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium">{selectedTrip.fareBreakdown.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-medium">{selectedTrip.fareBreakdown.time} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission (15%):</span>
                    <span className="font-medium text-red-600">-{selectedTrip.fareBreakdown.commission} GNF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de plateforme:</span>
                    <span className="font-medium">-{selectedTrip.fareBreakdown.platformFee} GNF</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Frais passager:</span>
                      <span className="text-green-600">{selectedTrip.fareBreakdown.total} GNF</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2">
                      <span className="">Gains chauffeur:</span>
                      <span className="font-medium">{selectedTrip.fareBreakdown.driverEarnings} GNF</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Évaluation */}
          {selectedTrip.rating && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-6">
                  <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  <h6>Évaluation</h6>
                  <div className="flex items-start justify-start mt-1">
                    <p className="text-sm me-4 ">Passager</p>
                    <span className="text-xl font-bold ml-1">{selectedTrip.rating.passenger}/5</span>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTrip.rating.comments && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-2">Commentaire:</p>
                        <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">{selectedTrip.rating.comments}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {selectedTrip.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-500" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{selectedTrip.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setShowTripDetails(false)}
            >
              Fermer
            </Button>
            <Button
              variant="primary"
              icon={Share2}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToastMessage('Lien copié', 'Le lien a été copié dans le presse-papier', 'success');
              }}
            >
              Partager
            </Button>
            <Button
              variant="warning"
              icon={Printer}
              onClick={handlePrint}
            >
              Imprimer
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const FollowModal = () => {
    if (!followTrip) return null;

    return (
      <Modal
        isOpen={showFollowModal}
        onClose={handleStopFollow}
        title="Suivi en direct"
        size="md"
      >
        <div className="space-y-6">
          {/* En-tête */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800">{followTrip.route}</h3>
            <p className="text-gray-500">ID: {followTrip.id}</p>
            <div className="flex items-center justify-center mt-2">
              {getStatusBadge(followTrip.status)}
            </div>
          </div>

          {/* Carte de suivi */}
          <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Points sur la carte */}
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white shadow-lg"></div>
            <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>

            {/* Véhicule en mouvement */}
            <motion.div
              animate={{
                x: [0, 100, 200, 300],
                y: [0, 50, 0, -50]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="absolute top-1/3 left-1/4"
            >
              <Car className="w-6 h-6 text-blue-600" />
            </motion.div>

            <div className="text-center relative z-10">
              <Navigation className="text-blue-500 text-4xl mb-3 mx-auto animate-pulse" />
              <p className="text-gray-700 font-medium">Suivi en temps réel</p>
              <p className="text-sm text-gray-500 mt-1">Position actuelle du véhicule</p>
            </div>
          </div>

          {/* Informations de suivi */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-500">Distance parcourue</p>
              <p className="text-lg font-bold text-gray-800">
                {Math.round(followProgress / 100 * parseFloat(followTrip.distance))} km
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">Temps écoulé</p>
              <p className="text-lg font-bold text-gray-800">
                {Math.round(followProgress / 100 * parseInt(followTrip.duration))} min
              </p>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progression du trajet</span>
              <span className="font-medium">{followProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                initial={{ width: '0%' }}
                animate={{ width: `${followProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Départ: {followTrip.startTime || 'En attente'}</span>
              <span>Arrivée estimée: {followTrip.estimatedArrival || 'Calcul en cours...'}</span>
            </div>
          </div>

          {/* Informations du trajet */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Passager:</span>
              <span className="font-medium">{followTrip.passenger.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chauffeur:</span>
              <span className="font-medium">{followTrip.driver.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Véhicule:</span>
              <span className="font-medium">{followTrip.vehicle.type} ({followTrip.vehicle.plate})</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={handleStopFollow}
            >
              Arrêter le suivi
            </Button>
            <Button
              variant="primary"
              icon={Phone}
              onClick={() => {
                showToastMessage('Appel', `Appel vers ${followTrip.driver.phone}...`, 'info');
              }}
            >
              Appeler le chauffeur
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const Star = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className={`space-y-4 md:space-y-6 px-2 md:px-0 ${isFullscreen ? 'fixed inset-0 bg-white z-50 overflow-auto p-4' : ''}`}>
      {/* Toast Notification */}
      {showToast.show && (
        <Toast
          title={showToast.title}
          message={showToast.message}
          type={showToast.type}
          onClose={() => setShowToast(prev => ({ ...prev, show: false }))}
        />
      )}

      {/* Modal de détails */}
      <TripDetailsModal />

      {/* Modal de suivi */}
      <FollowModal />

      {/* En-tête avec actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Gestion des Trajets</h1>
          <p className="text-gray-500 text-sm md:text-base">Surveillez et gérez tous les trajets en temps réel</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            variant="ghost"
            icon={isFullscreen ? Minimize : Maximize}
            onClick={toggleFullscreen}
            className="flex-1 md:flex-none"
          >
            {isFullscreen ? 'Réduire' : 'Plein écran'}
          </Button>

          <Button
            variant="ghost"
            icon={RefreshCw}
            onClick={handleRefresh}
            className="flex-1 md:flex-none"
          >
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

      {/* Carte interactive et filtres */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte interactive */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Carte des trajets en temps réel</CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" icon={SettingsIcon} size="small">
                    Options
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    icon={Map}
                    onClick={() => showToastMessage('Carte', 'Fonctionnalité carte à implémenter', 'info')}
                    className='bg-gradient-to-br from-green-500 to-blue-700'
                  >
                    détaillée
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                <div className="text-center relative z-10">
                  <MapPin className="text-green-500 text-4xl mb-3 mx-auto" />
                  <p className="text-gray-700 font-medium">24 trajets actuellement en cours</p>
                  <p className="text-sm text-gray-500 mt-1">Cliquez sur un point pour plus de détails</p>
                  <Button
                    variant="primary"
                    size="small"
                    className="mt-4"
                    onClick={() => showToastMessage('Carte interactive', 'Fonctionnalité à implémenter', 'info')}

                  >
                    Ouvrir la carte complète
                  </Button>
                </div>

                {/* Points sur la carte */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Trajets actifs</div>
                  <div className="font-bold text-gray-800">24</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Distance moyenne</div>
                  <div className="font-bold text-gray-800">8.7 km</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Temps moyen</div>
                  <div className="font-bold text-gray-800">22 min</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Zone active</div>
                  <div className="font-bold text-gray-800">Plateau</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres rapides */}
        <div className="space-y-6">
          {/* Filtres par lieu */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Filtres par lieu</CardTitle>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={handleClearFilters}
                >
                  Réinitialiser
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-3">Départ</label>
                  <input
                    type="text"
                    placeholder="Lieu de départ"
                    value={filters.departure}
                    onChange={(e) => handleFilterChange('departure', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-3">Destination</label>
                  <input
                    type="text"
                    placeholder="Lieu de destination"
                    value={filters.destination}
                    onChange={(e) => handleFilterChange('destination', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-400 transition"
                  />
                </div>
                <Button
                  variant="primary"
                  icon={Filter}
                  onClick={handleApplyFilters}
                  fullWidth
                  className='bg-gradient-to-br from-green-500 to-blue-700'
                >
                  Appliquer les filtres
                </Button>
              </div>
            </CardContent>
          </Card>


        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 w-full md:w-auto ">
        

        <div className="relative" ref={exportMenuRef}>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex-1 md:flex-none"
          >
            <span className="hidden md:inline">Exporter</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>

          <AnimatePresence>
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
              >
                <div className="py-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FileDiff className="w-4 h-4 mr-3 text-red-500" />
                    Export PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FileXCorner className="w-4 h-4 mr-3 text-green-500" />
                    Export Excel
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FileChartColumn className="w-4 h-4 mr-3 text-blue-500" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExport('doc')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FileDownIcon className="w-4 h-4 mr-3 text-blue-500" />
                    Export Word
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          icon={viewMode === 'table' ? Grid : List}
          onClick={toggleViewMode}
          className="flex-1 md:flex-none"
        >
          {viewMode === 'table' ? 'Grille' : 'Tableau'}
        </Button>
      </div>
      {/* Recherche et filtres */}
      <Card hoverable={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un trajet par ID, passager, chauffeur ou itinéraire..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition text-sm md:text-base"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div>

            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-400 transition"
            />
          </div>

          <select
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base"
            value={filters.status}
            onChange={(e) => {
              handleFilterChange('status', e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>

          <select
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base"
            value={filters.vehicleType}
            onChange={(e) => {
              handleFilterChange('vehicleType', e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tous les types de véhicule</option>
            <option value="Toyota">Toyota</option>
            <option value="Peugeot">Peugeot</option>
            <option value="Honda">Honda</option>
            <option value="Kia">Kia</option>
            <option value="moto">Moto-taxi</option>
          </select>
        </div>
      </Card>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="min-w-max md:min-w-0">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
              if (tab === 'archived') {
                setShowArchivedTrips(true);
              } else {
                setShowArchivedTrips(false);
              }
            }}
            className="px-2 md:px-4"
          />
        </div>
      </div>

      {/* Affichage en grille ou tableau */}
      {viewMode === 'grid' ? (
        // Vue en grille
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedTrips.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
            >
              <Card hoverable={true} onClick={() => handleViewTripDetails(trip)}>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{trip.route}</h3>
                        <p className="text-sm text-gray-500">{trip.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{trip.amount}</p>
                        <div className="mt-1">{getStatusBadge(trip.status)}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{trip.passenger.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Car className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{trip.driver.name}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{trip.distance} • {trip.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{trip.date}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="small"
                          icon={Eye}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTripDetails(trip);
                          }}
                        />
                        {trip.status === 'in-progress' && (
                          <Button
                            variant="ghost"
                            size="small"
                            icon={PlayCircle}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartFollow(trip);
                            }}
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="small"
                          icon={Archive}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveTrip(trip);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        // Vue en tableau
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle>
                  {showArchivedTrips ? 'Trajets archivés' : 'Historique des trajets'} ({filteredTrips.length})
                </CardTitle>
                <p className="text-gray-500 text-sm">
                  {selectedTrips.length > 0 && `${selectedTrips.length} sélectionné(s) • `}
                  {paginatedTrips.length} affiché(s) sur {filteredTrips.length}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap">Afficher :</span>
                <select
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-green-400 transition w-full md:w-auto"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table
                headers={[

                  'Itinéraire',
                  'Passager',
                  'Chauffeur',
                  'Montant',
                  'Statut',
                  'Actions'
                ]}
              >
                {paginatedTrips.map((trip) => (
                  <TableRow key={trip.id}>

                    <TableCell>
                      <div className="flex flex-col">
                        <p className="font-medium text-gray-800">{trip.route}</p>
                        <p className="text-sm text-gray-500">
                          {trip.distance} • {trip.duration}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-gray-500">Direct</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <User className="text-green-500" size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{trip.passenger.name}</p>
                          <p className="text-xs text-gray-500">Passager</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          <Car className="text-blue-500" size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{trip.driver.name}</p>
                          <p className="text-xs text-gray-500">Chauffeur</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{trip.amount}</span>
                        <div className="mt-1">
                          {getPaymentBadge(trip.paymentMethod)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(trip.status)}
                      {trip.starred && (
                        <div className="mt-1 flex items-center">
                          <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs text-gray-500">Favori</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <TripActions trip={trip} />
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>

            {/* Pagination */}
            {filteredTrips.length > 0 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  totalItems={filteredTrips.length}
                  showInfo={true}
                />
              </div>
            )}

            {paginatedTrips.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun trajet trouvé</p>
                <p className="text-gray-400 text-sm mt-1">
                  Essayez de modifier vos filtres ou de rafraîchir la liste
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      
    </div>
  );
};

export default Trips;