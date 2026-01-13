import { useState, useMemo, useEffect } from 'react';

const useDataTable = (initialData = [], options = {}) => {
  const {
    itemsPerPage = 10,
    initialPage = 1,
    initialFilters = {},
    initialSort = {}
  } = options;

  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrage et recherche
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Recherche globale
      if (searchTerm) {
        const searchable = Object.values(item).join(' ').toLowerCase();
        if (!searchable.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Filtres spécifiques
      for (const [key, value] of Object.entries(filters)) {
        if (value && value !== 'all') {
          if (item[key] !== value) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, filters, searchTerm]);

  // Tri
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Fonctions
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Retour à la première page lors du filtrage
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const updateData = (newData) => {
    setData(newData);
    setCurrentPage(1);
  };

  const addItem = (item) => {
    setData(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const updateItem = (id, updates) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
    // Ajuster la page si nécessaire
    if (paginatedData.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    data: paginatedData,
    totalItems: sortedData.length,
    currentPage,
    totalPages,
    itemsPerPage,
    filters,
    searchTerm,
    sortConfig,
    
    // Actions
    setCurrentPage: handlePageChange,
    nextPage: () => handlePageChange(currentPage + 1),
    prevPage: () => handlePageChange(currentPage - 1),
    handleFilterChange,
    handleSearch,
    handleSort,
    updateData,
    addItem,
    updateItem,
    deleteItem,
    
    // État complet pour l'affichage
    allData: sortedData
  };
};

export default useDataTable;