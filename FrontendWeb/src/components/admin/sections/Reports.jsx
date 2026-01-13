// src/components/sections/Reports.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, Printer, Calendar, ChevronDown,
  ChartPie, ChartLine, ChartBar, Users, TrendingUp, TrendingDown,
  DollarSign, MapPin, Star, BarChart3, Activity, FileText,
  FileSpreadsheet, FileDown, RefreshCw, Plus, Eye, MoreVertical,
  AlertCircle, CheckCircle, XCircle, Clock, Target, BarChart,
  PieChart, LineChart, File, MessageSquare, Shield, ChevronRight,
  Archive, ArchiveRestore, FileType, FileJson, EyeOff, CalendarDays,
  HardDrive, Layers, Database, Cpu, Network, ShieldCheck, ShieldOff,
  ChevronLeft, ExternalLink, Copy, Share2, Bell, BellOff,
  Lock, Unlock, Star as StarIcon, Trash2, Edit2, Save,
  Upload, Folder, FolderOpen, Grid, List, Maximize2,
  Minimize2, ZoomIn, ZoomOut, RotateCw, Hash, Percent,
  PieChart as PieChartIcon, BarChart2, LineChart as LineChartIcon,
  Settings, HelpCircle, Info, DownloadCloud, Cloud,
  Wifi, WifiOff, Battery, BatteryCharging, Signal,
  Volume2, VolumeX, Sun, Moon, CloudRain
} from 'lucide-react';
import StatCard from '../layout/StatCard';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Table, { TableRow, TableCell } from '../ui/Table';
import Button from '../ui/Bttn';
import Badge from '../ui/Badge';
import Tabs from '../ui/Tabs';
import ChartCard from '../ui/ChartCard';
import ConfirmModal from '../ui/ConfirmModal';
import Pagination from '../ui/Pagination';
import Toast from '../ui/Toast';
import Modal from '../ui/Modal';
import ExportDropdown from '../ui/ExportDropdown';

// Données de démonstration
const generateReports = (count = 50) => {
  const types = ['financial', 'users', 'geographic', 'performance', 'security'];
  const statuses = ['generated', 'pending', 'failed', 'processing'];
  const formats = ['pdf', 'csv', 'excel', 'word'];
  const authors = ['Admin', 'System', 'Manager', 'Analyst'];

  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const status = statuses[i % statuses.length];
    const format = formats[i % formats.length];
    const size = Math.floor(Math.random() * 5000) + 1000;
    const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    const getTitle = () => {
      const prefixes = {
        financial: ['Rapport Financier', 'Analyse Revenus', 'Commissions'],
        users: ['Activité Utilisateurs', 'Nouveaux Inscrits', 'Engagement'],
        geographic: ['Distribution Géographique', 'Zones Actives', 'Couverture'],
        performance: ['Performance Plateforme', 'Métriques Clés', 'KPI'],
        security: ['Audit Sécurité', 'Conformité', 'Vulnérabilités']
      };
      return `${prefixes[type][i % 3]} ${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const getDescription = () => {
      const descriptions = {
        financial: 'Analyse détaillée des revenus, dépenses et commissions',
        users: 'Statistiques d\'utilisation et comportement des utilisateurs',
        geographic: 'Répartition géographique des trajets et demandes',
        performance: 'Indicateurs de performance et métriques clés',
        security: 'Rapport d\'audit de sécurité et conformité'
      };
      return descriptions[type];
    };

    return {
      id: `RPT-${String(i + 1000).padStart(6, '0')}`,
      title: getTitle(),
      description: getDescription(),
      type,
      status,
      format,
      size,
      author: authors[Math.floor(Math.random() * authors.length)],
      createdAt: date.toLocaleDateString('fr-FR'),
      period: `${date.getDate()}/${date.getMonth() + 1} - ${new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).getDate()}/${new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).getMonth() + 1}`,
      lastAccessed: Math.random() > 0.5 ? new Date(date.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR') : null,
      downloadCount: Math.floor(Math.random() * 100),
      tags: [type, format, status === 'generated' ? 'disponible' : 'en attente']
    };
  });
};

// Composant pour les actions rapides
const ReportActions = ({ report, onView, onGenerate, onDelete, onExport }) => {
  const [showActions, setShowActions] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-2 hover:bg-gray-100 rounded-lg transition"
        onClick={() => setShowActions(!showActions)}
      >
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

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
                  onView(report);
                  setShowActions(false);
                }}
              >
                <Eye className="w-4 h-4 mr-2 text-blue-500" />
                Voir détails
              </button>
              {report.status === 'generated' ? (
                <>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-gray-700"
                    onClick={() => {
                      onGenerate(report);
                      setShowActions(false);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2 text-green-500" />
                    Télécharger
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-gray-700"
                    onClick={() => {
                      onExport(report);
                      setShowActions(false);
                    }}
                  >
                    <FileDown className="w-4 h-4 mr-2 text-blue-500" />
                    Exporter...
                  </button>
                </>
              ) : (
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-gray-700"
                  onClick={() => {
                    onGenerate(report);
                    setShowActions(false);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2 text-yellow-500" />
                  Regénérer
                </button>
              )}
              <div className="border-t border-gray-200 my-1"></div>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-sm text-red-600"
                onClick={() => {
                  onDelete(report);
                  setShowActions(false);
                }}
              >
                <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                Supprimer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Reports = () => {
  // États
  const [reports, setReports] = useState(() => generateReports(50));
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [activeReportType, setActiveReportType] = useState('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [selectedReports, setSelectedReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });
  const [isMobile, setIsMobile] = useState(false);
  const [newReport, setNewReport] = useState({
    type: 'financial',
    format: 'pdf',
    period: 'month',
    customStart: '',
    customEnd: '',
    includeCharts: true,
    includeDetails: true,
    emailNotification: false
  });

  // États pour les modales
  const [modalState, setModalState] = useState({
    showGenerate: false,
    showDelete: false,
    showDetails: false,
    showExport: false,
    selectedReport: null,
    selectedFormat: 'pdf',
    loading: false
  });

  // Détection de la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Stats calculées
  const stats = useMemo(() => {
    const generated = reports.filter(r => r.status === 'generated').length;
    const pending = reports.filter(r => r.status === 'pending').length;
    const failed = reports.filter(r => r.status === 'failed').length;
    const totalSize = reports.reduce((acc, r) => acc + r.size, 0);
    const avgSize = reports.length > 0 ? Math.round(totalSize / reports.length) : 0;
    const totalDownloads = reports.reduce((acc, r) => acc + r.downloadCount, 0);

    return [
      {
        title: 'Rapports générés',
        value: generated.toString(),
        icon: CheckCircle,
        color: 'green',
        trend: 'up',
        percentage: Math.round((generated / reports.length) * 100),
        progress: (generated / reports.length) * 100,
        subtitle: 'Rapports disponibles'
      },
      {
        title: 'Téléchargements',
        value: totalDownloads.toString(),
        icon: Download,
        color: 'purple',
        trend: 'up',
        percentage: Math.round((totalDownloads / 500) * 100),
        progress: Math.min((totalDownloads / 1000) * 100, 100),
        subtitle: 'Téléchargements totaux'
      }
    ];
  }, [reports]);

  // Filtrage des rapports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch =
        search === '' ||
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
      const matchesFormat = formatFilter === 'all' || report.format === formatFilter;
      const matchesType = activeReportType === 'all' || report.type === activeReportType;

      return matchesSearch && matchesStatus && matchesFormat && matchesType;
    });
  }, [reports, search, statusFilter, formatFilter, activeReportType]);

  // Pagination
  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredReports.slice(startIndex, endIndex);
  }, [filteredReports, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredReports.length / pageSize);

  // Handlers
  const handleGenerateReport = (reportData = null) => {
    setModalState(prev => ({ ...prev, loading: true }));

    const reportId = reportData?.id || `RPT-${String(reports.length + 1000).padStart(6, '0')}`;
    const title = reportData?.title || `Rapport ${new Date().toLocaleDateString('fr-FR')}`;

    setTimeout(() => {
      if (reportData) {
        // Regénérer un rapport existant
        setReports(prev => prev.map(report =>
          report.id === reportId
            ? { ...report, status: 'generated', lastAccessed: new Date().toLocaleDateString('fr-FR') }
            : report
        ));
      } else {
        // Générer un nouveau rapport
        const newReportObj = {
          id: reportId,
          title,
          description: newReport.type === 'financial' ? 'Analyse financière complète' :
            newReport.type === 'users' ? 'Statistiques utilisateurs' :
              newReport.type === 'geographic' ? 'Répartition géographique' :
                newReport.type === 'performance' ? 'Indicateurs performance' : 'Audit sécurité',
          type: newReport.type,
          status: 'generated',
          format: newReport.format,
          size: Math.floor(Math.random() * 5000) + 1000,
          author: 'Admin',
          createdAt: new Date().toLocaleDateString('fr-FR'),
          period: `${new Date().getDate()}/${new Date().getMonth() + 1} - ${new Date(new Date().setDate(new Date().getDate() + 30)).getDate()}/${new Date().getMonth() + 1}`,
          lastAccessed: null,
          downloadCount: 0,
          tags: [newReport.type, newReport.format, 'nouveau']
        };

        setReports(prev => [newReportObj, ...prev]);
      }

      setModalState(prev => ({ ...prev, loading: false, showGenerate: false }));
      showToast(
        'Rapport généré',
        reportData ? 'Le rapport a été regénéré avec succès' : 'Nouveau rapport généré avec succès',
        'success'
      );
    }, 1500);
  };

  const handleDeleteReport = (reportId) => {
    setModalState(prev => ({ ...prev, loading: true }));

    setTimeout(() => {
      setReports(prev => prev.filter(report => report.id !== reportId));
      setModalState(prev => ({ ...prev, loading: false, showDelete: false }));
      showToast('Rapport supprimé', 'Le rapport a été supprimé avec succès', 'warning');
    }, 1000);
  };

  const handleDownloadReport = (report, format = 'pdf') => {
    showToast('Téléchargement', `Téléchargement du rapport ${report.id}...`, 'info');

    // Simulation de téléchargement
    setTimeout(() => {
      const updatedReports = reports.map(r =>
        r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1, lastAccessed: new Date().toLocaleDateString('fr-FR') } : r
      );
      setReports(updatedReports);

      showToast('Téléchargement terminé', `Le rapport ${report.id} a été téléchargé en format ${format}`, 'success');
    }, 1000);
  };

  const handleSelectReport = (reportId, checked) => {
    setSelectedReports(prev =>
      checked
        ? [...prev, reportId]
        : prev.filter(id => id !== reportId)
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReports(paginatedReports.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleViewDetails = (report) => {
    setModalState(prev => ({
      ...prev,
      showDetails: true,
      selectedReport: report
    }));
  };

  const handleExportReport = (report) => {
    setModalState(prev => ({
      ...prev,
      showExport: true,
      selectedReport: report,
      selectedFormat: 'pdf'
    }));
  };

  // Configuration des colonnes pour l'exportation
  const exportColumns = useMemo(() => [
    { header: 'ID', accessor: 'id' },
    { header: 'Titre', accessor: 'title' },
    { header: 'Description', accessor: 'description' },
    { header: 'Type', accessor: 'type' },
    { header: 'Format', accessor: 'format' },
    { header: 'Statut', accessor: 'status' },
    { header: 'Auteur', accessor: 'author' },
    { header: 'Date de création', accessor: 'createdAt' },
    { header: 'Période', accessor: 'period' },
    { header: 'Dernier accès', accessor: 'lastAccessed', formatter: (val) => val || 'Jamais' },
    { header: 'Téléchargements', accessor: 'downloadCount' },
    { header: 'Taille (KB)', accessor: 'size' }
  ], []);

  // Configuration des tabs
  const reportTypes = [
    { id: 'all', label: 'Tous', icon: FileText },
    { id: 'financial', label: 'Financier', icon: DollarSign },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'geographic', label: 'Géographique', icon: MapPin },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ];

  // Helper pour afficher le statut
  const renderStatus = (status) => {
    const config = {
      generated: { label: 'Généré', variant: 'success', icon: CheckCircle , color: 'green'},
      pending: { label: 'En attente', variant: 'warning', icon: Clock , color: 'yellow'},
      failed: { label: 'Échoué', variant: 'danger', icon: XCircle , color: 'red'},
      processing: { label: 'En cours', variant: 'secondary', icon: RefreshCw , color: 'blue'}
    };

    const { label,  icon: Icon, color } = config[status] || config.pending;
    return (
      <Badge  className={`text-md text-${color}-800 bg-${color}-100`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  // Helper pour afficher le format
  const renderFormat = (format) => {
    const config = {
      pdf: { label: 'PDF',  },
      csv: { label: 'CSV',  },
      word: { label: 'Word', }
    };

    const { label,  } = config[format] || config.pdf;
    return <Badge  className={``}>{label}</Badge>;
  };

  // Helper pour afficher le type
  const renderType = (type) => {
    const config = {
      financial: { label: 'Financier', icon: DollarSign, color: 'green' },
      users: { label: 'Utilisateurs', icon: Users, color: 'blue' },
      geographic: { label: 'Géographique', icon: MapPin, color: 'purple' },
      performance: { label: 'Performance', icon: Activity, color: 'yellow' },
      security: { label: 'Sécurité', icon: Shield, color: 'red' }
    };

    const { label, icon: Icon, color } = config[type] || config.financial;
    return (
      <Badge variant="" className='text-md text-center'>
        <Icon className={`w-3 h-3 mr-1 text-${color}-500`} />
        {label}
      </Badge>
    );
  };


  // Modal de détails du rapport
  const ReportDetailsModal = () => {
    const report = modalState.selectedReport;
    if (!report) return null;

    return (
      <Modal
        isOpen={modalState.showDetails}
        onClose={() => setModalState(prev => ({ ...prev, showDetails: false }))}
        title="Détails du rapport"
        size="lg"
      >
        <div className="space-y-6 scroll-m-t-2 overflow-auto h-[70vh]">
          {/* En-tête */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{report.title}</h2>
              <p className="text-gray-600 mt-1">{report.description}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-gray-500">ID: {report.id}</span>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">Format: {report.format}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              {renderStatus(report.status)}
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Informations générales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{renderType(report.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">{renderFormat(report.format)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statut:</span>
                    <span className="font-medium">{renderStatus(report.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auteur:</span>
                    <span className="font-medium">{report.author}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Métriques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taille:</span>
                    <span className="font-medium">{report.size} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Téléchargements:</span>
                    <span className="font-medium">{report.downloadCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date création:</span>
                    <span className="font-medium">{report.createdAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dernier accès:</span>
                    <span className="font-medium">{report.lastAccessed || 'Jamais'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Création</h4>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                <span className="font-medium">{report.createdAt}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Période</h4>
              <div className="flex items-center">
                <CalendarDays className="w-4 h-4 text-gray-400 mr-2" />
                <span className="font-medium">{report.period}</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Dernier accès</h4>
              <div className="flex items-center">
                <Eye className="w-4 h-4 text-gray-400 mr-2" />
                <span className="font-medium">{report.lastAccessed || 'Jamais'}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {report.tags && report.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={() => setModalState(prev => ({ ...prev, showDetails: false }))}
            >
              Fermer
            </Button>
            {report.status === 'generated' ? (
              <>
                <Button
                  className='bg-gradient-to-br from-green-500 to-blue-800'
                  icon={Download}
                  onClick={() => {
                    handleDownloadReport(report);
                    setModalState(prev => ({ ...prev, showDetails: false }));
                  }}
                >
                  Télécharger
                </Button>
                <Button
                  variant="secondary"
                  icon={Share2}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Lien copié', 'Le lien vers le rapport a été copié', 'success');
                  }}
                >
                  Partager
                </Button>
              </>
            ) : (
              <Button
                variant="warning"
                icon={RefreshCw}
                onClick={() => {
                  handleGenerateReport(report);
                  setModalState(prev => ({ ...prev, showDetails: false }));
                }}
              >
                Regénérer
              </Button>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  // Modal pour l'export avec confirmation
  const ExportModal = () => {
    const report = modalState.selectedReport;
    if (!report) return null;

    const formats = [
      { value: 'pdf', label: 'PDF', icon: FileText, description: 'Format standard pour impression et partage' },
      { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Format texte pour les données tabulaires' },
      { value: 'excel', label: 'Excel', icon: FileDown, description: 'Fichier Excel avec mise en forme' },
      { value: 'word', label: 'Word', icon: FileText, description: 'Document Word éditable' }
    ];

    const selectedFormat = formats.find(f => f.value === (modalState.selectedFormat || 'pdf'));

    return (
      <ConfirmModal
        isOpen={modalState.showExport}
        onClose={() => setModalState(prev => ({ ...prev, showExport: false }))}
        onConfirm={() => {
          handleDownloadReport(report, modalState.selectedFormat || 'pdf');
          setModalState(prev => ({ ...prev, showExport: false }));
        }}
        title="Exporter le rapport"
        message={`Choisissez le format d'export pour "${report.title}"`}
        type="info"
        confirmText={`Exporter en ${selectedFormat?.label || 'PDF'}`}
        cancelText="Annuler"
        loading={modalState.loading}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formats.map((format) => (
              <div
                key={format.value}
                className={`p-4 border rounded-lg cursor-pointer transition ${modalState.selectedFormat === format.value ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setModalState(prev => ({ ...prev, selectedFormat: format.value }))}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${modalState.selectedFormat === format.value ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <format.icon className={`w-5 h-5 ${modalState.selectedFormat === format.value ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{format.label}</h4>
                    <p className="text-sm text-gray-500">{format.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Informations sur l'export</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rapport:</span>
                <span className="font-medium">{report.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format sélectionné:</span>
                <span className="font-medium">{selectedFormat?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taille estimée:</span>
                <span className="font-medium">~{Math.round(report.size * 1.2)} KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Temps d'export:</span>
                <span className="font-medium">5-10 secondes</span>
              </div>
            </div>
          </div>
        </div>
      </ConfirmModal>
    );
  };

  // Données pour les graphiques
  const chartData = useMemo(() => ({
    activityChart: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Rapports générés',
        data: [12, 19, 8, 15, 22, 18, 25],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }]
    },
    typeDistribution: {
      labels: ['Financier', 'Utilisateurs', 'Géographique', 'Performance', 'Sécurité'],
      datasets: [{
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#8B5CF6',
          '#F59E0B',
          '#EF4444'
        ]
      }]
    },
    formatDistribution: {
      labels: ['PDF', 'CSV', 'Excel', 'Word'],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: ['#EF4444', '#10B981', '#10B981', '#3B82F6']
      }]
    }
  }), []);

  // Modal pour générer un nouveau rapport
  const GenerateReportModal = () => (
    <Modal
      isOpen={modalState.showGenerate}
      onClose={() => setModalState(prev => ({ ...prev, showGenerate: false }))}
      title="Générer un nouveau rapport"
      size="lg"
    >
      <div className="space-y-6 scroll-m-t-2 overflow-y-auto h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de rapport
            </label>
            <select
              value={newReport.type}
              onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              <option value="financial">Financier</option>
              <option value="users">Utilisateurs</option>
              <option value="geographic">Géographique</option>
              <option value="performance">Performance</option>
              <option value="security">Sécurité</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format de sortie
            </label>
            <select
              value={newReport.format}
              onChange={(e) => setNewReport(prev => ({ ...prev, format: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
              <option value="excel">Excel</option>
              <option value="word">Word</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={newReport.period}
              onChange={(e) => setNewReport(prev => ({ ...prev, period: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
              <option value="custom">Personnalisée</option>
            </select>
          </div>

          {newReport.period === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début
                </label>
                <input
                  type="date"
                  value={newReport.customStart}
                  onChange={(e) => setNewReport(prev => ({ ...prev, customStart: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={newReport.customEnd}
                  onChange={(e) => setNewReport(prev => ({ ...prev, customEnd: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Options supplémentaires</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newReport.includeCharts}
                onChange={(e) => setNewReport(prev => ({ ...prev, includeCharts: e.target.checked }))}
                className="rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Inclure les graphiques</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newReport.includeDetails}
                onChange={(e) => setNewReport(prev => ({ ...prev, includeDetails: e.target.checked }))}
                className="rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Inclure les détails complets</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newReport.emailNotification}
                onChange={(e) => setNewReport(prev => ({ ...prev, emailNotification: e.target.checked }))}
                className="rounded border-gray-300 text-green-500 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Notification par email</span>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Récapitulatif</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{renderType(newReport.type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Format:</span>
              <span className="font-medium">{renderFormat(newReport.format)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimation de taille:</span>
              <span className="font-medium">~2-5 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Temps de génération:</span>
              <span className="font-medium">15-30 secondes</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={() => setModalState(prev => ({ ...prev, showGenerate: false }))}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            className='bg-gradient-to-br from-green-500 to-blue-800'
            icon={FileText}
            onClick={() => handleGenerateReport()}
            loading={modalState.loading}
          >
            Générer le rapport
          </Button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-4 md:px-6">
      <ReportDetailsModal />
      <ExportModal />
      <GenerateReportModal />

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

      {/* Modales de confirmation */}
      <ConfirmModal
        isOpen={modalState.showDelete}
        onClose={() => setModalState(prev => ({ ...prev, showDelete: false }))}
        onConfirm={() => handleDeleteReport(modalState.selectedReport?.id)}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le rapport ${modalState.selectedReport?.id} ?`}
        type="delete"
        confirmText="Supprimer définitivement"
        cancelText="Annuler"
        destructive={true}
        loading={modalState.loading}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Rapports et analyses</h1>
          <p className="text-gray-500 text-sm md:text-base">Analyses détaillées et rapports de performance</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            icon={Plus}
            onClick={() => setModalState(prev => ({ ...prev, showGenerate: true }))}
            className="flex-1 md:flex-none"
          >
            <span className="hidden md:inline">Nouveau rapport</span>
            <span className="md:hidden">Nouveau</span>
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
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

      {/* Filtres */}
      <Card hoverable={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition text-sm md:text-base"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="generated">Généré</option>
            <option value="pending">En attente</option>
            <option value="processing">En cours</option>
            <option value="failed">Échoué</option>
          </select>

          <select
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition text-sm md:text-base"
            value={formatFilter}
            onChange={(e) => {
              setFormatFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Tous les formats</option>
            <option value="pdf">PDF</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="word">Word</option>
          </select>

          {/* Utilisation du composant ExportDropdown */}
          <div className="relative flex items-end">
            <ExportDropdown
              data={filteredReports}
              columns={exportColumns}
              fileName="rapports"
              title="Export des rapports"
              orientation="landscape"
              showToast={showToast}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <div className="min-w-max md:min-w-0">
          <Tabs
            tabs={reportTypes}
            activeTab={activeReportType}
            onChange={(tab) => {
              setActiveReportType(tab);
              setCurrentPage(1);
            }}
            className="px-2 md:px-4"
          />
        </div>
      </div>

      {/* Tableau des rapports */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Rapports ({filteredReports.length})</CardTitle>
              <p className="text-gray-500 text-sm">
                {selectedReports.length > 0 && `${selectedReports.length} sélectionné(s) • `}
                {paginatedReports.length} affiché(s) sur {filteredReports.length}
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
          <Table
            headers={[
              'Rapport',
              'Type',
              'Format',
              'Statut',
              'Créé le',
              'Actions'
            ]}
          >
            {paginatedReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-800">{report.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs text-gray-500">ID: {report.id}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{report.size} KB</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {renderType(report.type)}
                </TableCell>
                <TableCell>
                  {renderFormat(report.format)}
                </TableCell>
                <TableCell>
                  {renderStatus(report.status)}
                </TableCell>

                <TableCell>
                  <div className="text-sm text-gray-800">{report.createdAt}</div>
                  <div className="text-xs text-gray-500">{report.period}</div>
                </TableCell>
                <TableCell>
                  <ReportActions
                    report={report}
                    onView={handleViewDetails}
                    onGenerate={(r) => {
                      if (r.status === 'generated') {
                        handleDownloadReport(r);
                      } else {
                        handleGenerateReport(r);
                      }
                    }}
                    onDelete={(r) => setModalState(prev => ({ ...prev, showDelete: true, selectedReport: r }))}
                    onExport={handleExportReport}
                  />
                </TableCell>
              </TableRow>
            ))}
          </Table>

          {/* Pagination */}
          {filteredReports.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                totalItems={filteredReports.length}
                showInfo={true}
              />
            </div>
          )}

          {paginatedReports.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun rapport trouvé</p>
              <p className="text-gray-400 text-sm mt-1">
                Essayez de modifier vos filtres ou générez un nouveau rapport
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;