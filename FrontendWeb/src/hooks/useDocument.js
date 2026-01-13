// src/hooks/useDocument.js
import { useState, useEffect, useMemo, useCallback } from 'react';
import * as documentData from '../data/documentData';
import { exportToCSV, exportToPDF, exportToWord } from '../utils/exporters';

export const useDocument = (showToast) => {
  // États principaux
  const [documents, setDocuments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // États pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Initialiser les données
  useEffect(() => {
    loadData();
  }, []);

  // Charger les données
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simuler des appels API - À remplacer par vos appels backend
      const [documentsResponse, driversResponse] = await Promise.all([
        documentData.fetchDocuments(),
        documentData.fetchDrivers()
      ]);

      if (documentsResponse.success && driversResponse.success) {
        setDocuments(documentsResponse.data);
        const driversWithDocuments = documentData.groupDocumentsByDriver(
          documentsResponse.data,
          driversResponse.data
        );
        setDrivers(driversWithDocuments);
        setFilteredDrivers(driversWithDocuments);
      } else {
        throw new Error('Erreur lors du chargement des données');
      }
    } catch (err) {
      setError(err.message);
      if (showToast) {
        showToast('Erreur', 'Impossible de charger les données', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les chauffeurs
  useEffect(() => {
    let result = [...drivers];

    // Recherche textuelle
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(driver =>
        driver.name.toLowerCase().includes(term) ||
        driver.documents.some(doc =>
          doc.type.toLowerCase().includes(term) ||
          doc.number?.toLowerCase().includes(term) ||
          doc.fileName.toLowerCase().includes(term)
        )
      );
    }

    // Filtres par statut
    if (selectedFilters.status && selectedFilters.status !== 'all') {
      result = result.filter(driver =>
        driver.documents.some(doc => doc.status === selectedFilters.status)
      );
    }

    // Filtre par complétude
    if (selectedFilters.completeness && selectedFilters.completeness !== 'all') {
      result = result.filter(driver => {
        if (selectedFilters.completeness === 'complete') return driver.completeness === 100;
        if (selectedFilters.completeness === 'incomplete') return driver.completeness < 100;
        return true;
      });
    }

    // Filtre par type de document
    if (selectedFilters.documentType && selectedFilters.documentType !== 'all') {
      result = result.filter(driver =>
        driver.documents.some(doc => doc.type === selectedFilters.documentType)
      );
    }

    setFilteredDrivers(result);
    setCurrentPage(1);
  }, [searchTerm, selectedFilters, drivers]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    return documentData.calculateStats(drivers);
  }, [drivers]);

  // Gestion de la pagination
  const paginatedDrivers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredDrivers.slice(startIndex, endIndex);
  }, [filteredDrivers, currentPage, pageSize]);

  // Gestionnaires d'événements
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleViewDriver = useCallback((driver) => {
    setSelectedDriver(driver);
  }, []);

  const handleSelectDocument = useCallback((documentId) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  }, []);

  const handleSelectAllDocuments = useCallback(() => {
    if (selectedDriver) {
      const allIds = selectedDriver.documents.map(d => d.id);
      if (selectedDocuments.length === allIds.length) {
        setSelectedDocuments([]);
      } else {
        setSelectedDocuments(allIds);
      }
    }
  }, [selectedDriver, selectedDocuments]);

  // Valider un document
  const validateDocument = useCallback(async (documentId, reviewBy = 'Admin System') => {
    try {
      const response = await documentData.updateDocument(documentId, {
        status: 'valid',
        reviewDate: new Date().toISOString().split('T')[0],
        reviewedBy: reviewBy
      });

      if (response.success) {
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId ? { ...doc, ...response.data } : doc
        ));
        
        // Recalculer les chauffeurs
        const updatedDrivers = documentData.groupDocumentsByDriver(
          documents.map(doc => doc.id === documentId ? { ...doc, ...response.data } : doc),
          drivers.map(d => ({ ...d, documents: [] }))
        );
        setDrivers(updatedDrivers);
        
        if (showToast) {
          showToast('Document validé', 'Le document a été validé avec succès', 'success');
        }
        
        return true;
      }
    } catch (err) {
      console.error('Erreur validation document:', err);
      if (showToast) {
        showToast('Erreur', 'Impossible de valider le document', 'error');
      }
    }
    return false;
  }, [documents, drivers, showToast]);

  // Rejeter un document
  const rejectDocument = useCallback(async (documentId, reason = '', reviewBy = 'Admin System') => {
    try {
      const response = await documentData.updateDocument(documentId, {
        status: 'rejected',
        reviewDate: new Date().toISOString().split('T')[0],
        reviewedBy: reviewBy,
        notes: reason ? `Rejeté: ${reason}` : 'Document rejeté'
      });

      if (response.success) {
        setDocuments(prev => prev.map(doc => 
          doc.id === documentId ? { ...doc, ...response.data } : doc
        ));
        
        // Recalculer les chauffeurs
        const updatedDrivers = documentData.groupDocumentsByDriver(
          documents.map(doc => doc.id === documentId ? { ...doc, ...response.data } : doc),
          drivers.map(d => ({ ...d, documents: [] }))
        );
        setDrivers(updatedDrivers);
        
        if (showToast) {
          showToast('Document rejeté', 'Le document a été rejeté', 'warning');
        }
        
        return true;
      }
    } catch (err) {
      console.error('Erreur rejet document:', err);
      if (showToast) {
        showToast('Erreur', 'Impossible de rejeter le document', 'error');
      }
    }
    return false;
  }, [documents, drivers, showToast]);

  // Actions batch
  const handleBatchValidate = useCallback(async () => {
    try {
      const promises = selectedDocuments.map(id => validateDocument(id));
      await Promise.all(promises);
      setSelectedDocuments([]);
      
      if (showToast) {
        showToast(
          'Documents validés',
          `${selectedDocuments.length} document(s) validé(s) avec succès`,
          'success'
        );
      }
    } catch (err) {
      console.error('Erreur validation batch:', err);
    }
  }, [selectedDocuments, validateDocument, showToast]);

  const handleBatchReject = useCallback(async () => {
    try {
      const promises = selectedDocuments.map(id => rejectDocument(id, 'Rejet batch'));
      await Promise.all(promises);
      setSelectedDocuments([]);
      
      if (showToast) {
        showToast(
          'Documents rejetés',
          `${selectedDocuments.length} document(s) rejeté(s)`,
          'warning'
        );
      }
    } catch (err) {
      console.error('Erreur rejet batch:', err);
    }
  }, [selectedDocuments, rejectDocument, showToast]);

  // Uploader un document
  const uploadDocument = useCallback(async (fileData, driverId) => {
    setUploading(true);
    try {
      const response = await documentData.uploadDocument(fileData, driverId);
      
      if (response.success) {
        // Ajouter le nouveau document
        setDocuments(prev => [...prev, response.data]);
        
        // Recharger les données
        await loadData();
        
        if (showToast) {
          showToast(
            'Upload réussi',
            'Document uploadé avec succès',
            'success'
          );
        }
        
        return response.data;
      }
    } catch (err) {
      console.error('Erreur upload:', err);
      if (showToast) {
        showToast('Erreur', 'Impossible d\'uploader le document', 'error');
      }
      throw err;
    } finally {
      setUploading(false);
    }
  }, [loadData, showToast]);

  // Exporter des données
  const handleExport = useCallback((format, driver = null) => {
    const exportData = driver ? driver.documents : documents;
    const payload = {
      data: exportData,
      columns: documentData.exportConfig.columns,
      fileName: driver 
        ? `documents_${driver.name.toLowerCase().replace(/\s+/g, '_')}`
        : documentData.exportConfig.fileName,
      title: driver 
        ? `Documents de ${driver.name}`
        : documentData.exportConfig.title,
      orientation: documentData.exportConfig.orientation,
      onToast: showToast
    };

    switch (format) {
      case 'csv':
        exportToCSV(payload);
        break;
      case 'pdf':
        exportToPDF(payload);
        break;
      case 'word':
        exportToWord(payload);
        break;
      default:
        break;
    }
  }, [documents, showToast]);

  // Effacer les filtres
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedFilters({});
  }, []);

  // Formatage des dates
  const formatDate = useCallback((dateString) => {
    return documentData.formatDate(dateString);
  }, []);

  // Obtenir les jours avant expiration
  const getDaysUntilExpiry = useCallback((expiryDate) => {
    return documentData.getDaysUntilExpiry(expiryDate);
  }, []);

  // Obtenir le badge de statut
  const getStatusBadge = useCallback((status) => {
    const statusType = documentData.statusTypes.find(s => s.id === status);
    if (!statusType) return null;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusType.bgColor} ${statusType.textColor}`}>
        {/* L'icône sera gérée dans le composant */}
        {statusType.label}
      </span>
    );
  }, []);

  // Obtenir la couleur du type
  const getTypeColor = useCallback((typeId) => {
    const type = documentData.documentTypes.find(t => t.id === typeId);
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      teal: 'bg-teal-100 text-teal-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      pink: 'bg-pink-100 text-pink-600',
    };
    return colorMap[type?.color] || 'bg-gray-100 text-gray-600';
  }, []);

  return {
    // États
    documents,
    drivers: filteredDrivers,
    paginatedDrivers,
    loading,
    error,
    searchTerm,
    selectedFilters,
    showFilters,
    selectedDriver,
    selectedDocuments,
    viewingDocument,
    uploading,
    currentPage,
    pageSize,
    totalPages: Math.ceil(filteredDrivers.length / pageSize),
    totalItems: filteredDrivers.length,
    
    // Données statiques
    documentTypes: documentData.documentTypes,
    statusTypes: documentData.statusTypes,
    filterOptions: documentData.filterOptions,
    stats,
    
    // Actions
    setSearchTerm,
    setSelectedFilters,
    setShowFilters,
    setSelectedDriver,
    setSelectedDocuments,
    setViewingDocument,
    setCurrentPage,
    setPageSize,
    
    // Handlers
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleViewDriver,
    handleSelectDocument,
    handleSelectAllDocuments,
    handleBatchValidate,
    handleBatchReject,
    handleExport,
    
    // Fonctions utilitaires
    validateDocument,
    rejectDocument,
    uploadDocument,
    clearFilters,
    formatDate,
    getDaysUntilExpiry,
    getStatusBadge,
    getTypeColor,
    reloadData: loadData
  };
};

export default useDocument;