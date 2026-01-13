// src/components/ui/Dropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';


// composant pour les menus déroulants
const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Sélectionner...',
  searchable = false,
  multiSelect = false,
  className = '',
  label = '',
  error = '',
  disabled = false,
  icon: Icon,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(
    multiSelect 
      ? (Array.isArray(value) ? value : [])
      : value
  );
  const dropdownRef = useRef(null);

  const sizes = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4',
    lg: 'py-4 px-4 text-lg'
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = (option) => {
    if (multiSelect) {
      const newSelected = selectedOptions.includes(option.value)
        ? selectedOptions.filter(v => v !== option.value)
        : [...selectedOptions, option.value];
      
      setSelectedOptions(newSelected);
      onChange?.(newSelected);
    } else {
      setSelectedOptions(option.value);
      onChange?.(option.value);
      setIsOpen(false);
    }
  };

  const getSelectedLabel = () => {
    if (multiSelect) {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) {
        const option = options.find(o => o.value === selectedOptions[0]);
        return option?.label || placeholder;
      }
      return `${selectedOptions.length} sélectionnés`;
    } else {
      const option = options.find(o => o.value === selectedOptions);
      return option?.label || placeholder;
    }
  };

  const isSelected = (value) => {
    return multiSelect
      ? selectedOptions.includes(value)
      : selectedOptions === value;
  };

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between border rounded-xl transition-all',
          'focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100',
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300',
          error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : '',
          sizes[size]
        )}
      >
        <div className="flex items-center space-x-2">
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
          <span className={clsx(
            multiSelect && selectedOptions.length > 1 ? 'font-medium' : '',
            disabled ? 'text-gray-400' : 'text-gray-700'
          )}>
            {getSelectedLabel()}
          </span>
        </div>
        <ChevronDown className={clsx(
          'w-5 h-5 transition-transform',
          isOpen ? 'transform rotate-180' : '',
          disabled ? 'text-gray-400' : 'text-gray-500'
        )} />
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 max-h-60 overflow-auto"
          >
            {searchable && (
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-400"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={clsx(
                      'w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition',
                      isSelected(option.value) ? 'bg-green-50 text-green-700' : 'text-gray-700'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      {multiSelect && (
                        <div className={clsx(
                          'w-4 h-4 border rounded flex items-center justify-center',
                          isSelected(option.value)
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        )}>
                          {isSelected(option.value) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      )}
                      {option.icon && (
                        <option.icon className="w-4 h-4 text-gray-400" />
                      )}
                      <span>{option.label}</span>
                      {option.badge && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {!multiSelect && isSelected(option.value) && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-500 text-sm">
                  Aucun résultat trouvé
                </div>
              )}
            </div>

            {multiSelect && filteredOptions.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedOptions([]);
                    onChange?.([]);
                  }}
                  className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Tout désélectionner
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;