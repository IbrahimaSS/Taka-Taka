// src/components/ui/DateRangePicker.jsx
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, 
         eachDayOfInterval, isSameMonth, isToday, isWithinInterval,
         startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import clsx from 'clsx';


// composant pour la sélection d'une plage de dates
const DateRangePicker = ({
  startDate,
  endDate,
  onChange,
  className = '',
  placeholder = 'Sélectionner une période',
  presets = [],
  maxRange = 365,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);
  const [selectingEnd, setSelectingEnd] = useState(false);

  const presetsList = presets.length > 0 ? presets : [
    { label: 'Aujourd\'hui', getRange: () => ({ start: new Date(), end: new Date() }) },
    { label: 'Hier', getRange: () => ({ 
      start: new Date(new Date().setDate(new Date().getDate() - 1)), 
      end: new Date(new Date().setDate(new Date().getDate() - 1)) 
    }) },
    { label: '7 derniers jours', getRange: () => ({ 
      start: new Date(new Date().setDate(new Date().getDate() - 6)), 
      end: new Date() 
    }) },
    { label: '30 derniers jours', getRange: () => ({ 
      start: new Date(new Date().setDate(new Date().getDate() - 29)), 
      end: new Date() 
    }) },
    { label: 'Ce mois', getRange: () => ({ 
      start: startOfMonth(new Date()), 
      end: endOfMonth(new Date()) 
    }) },
    { label: 'Mois dernier', getRange: () => { 
      const lastMonth = addMonths(new Date(), -1);
      return { 
        start: startOfMonth(lastMonth), 
        end: endOfMonth(lastMonth) 
      };
    }},
  ];

  const handleDateClick = (date) => {
    if (!tempStart || (tempStart && tempEnd) || selectingEnd) {
      setTempStart(date);
      setTempEnd(null);
      setSelectingEnd(true);
    } else {
      if (date < tempStart) {
        setTempEnd(tempStart);
        setTempStart(date);
      } else {
        setTempEnd(date);
      }
      setSelectingEnd(false);
    }
  };

  const applySelection = () => {
    if (tempStart && tempEnd) {
      onChange({ start: tempStart, end: tempEnd });
      setIsOpen(false);
    }
  };

  const cancelSelection = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setIsOpen(false);
  };

  const handlePreset = (preset) => {
    const range = preset.getRange();
    onChange(range);
    setTempStart(range.start);
    setTempEnd(range.end);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange({ start: null, end: null });
    setTempStart(null);
    setTempEnd(null);
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'dd MMM yyyy', { locale: fr })} - ${format(endDate, 'dd MMM yyyy', { locale: fr })}`;
    }
    return placeholder;
  };

  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const calendarDays = generateCalendarDays();

  return (
    <div className={clsx('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          'w-full flex items-center justify-between border rounded-xl px-4 py-3 transition-all',
          'focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100',
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
        )}
      >
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className={clsx(
            startDate && endDate ? 'text-gray-700' : 'text-gray-400',
            disabled && 'text-gray-400'
          )}>
            {getDisplayText()}
          </span>
        </div>
        {startDate && endDate && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full md:w-[600px] mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Presets */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Périodes prédéfinies</h4>
                <div className="space-y-2">
                  {presetsList.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handlePreset(preset)}
                      className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition"
                    >
                      <span className="text-gray-700">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <h3 className="font-medium text-gray-800">
                    {format(currentMonth, 'MMMM yyyy', { locale: fr })}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {days.map((day, index) => (
                    <div key={index} className="text-center text-xs font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isTodayDate = isToday(day);
                    const isSelected = (tempStart && isSameDay(day, tempStart)) || 
                                      (tempEnd && isSameDay(day, tempEnd));
                    const isInRange = tempStart && tempEnd && 
                                     isWithinInterval(day, { start: tempStart, end: tempEnd });

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleDateClick(day)}
                        disabled={!isCurrentMonth}
                        className={clsx(
                          'h-10 rounded-lg text-sm transition',
                          !isCurrentMonth && 'text-gray-300 cursor-not-allowed',
                          isSelected && 'bg-green-500 text-white font-medium',
                          isInRange && !isSelected && 'bg-green-100 text-green-700',
                          isTodayDate && !isSelected && 'border border-green-300',
                          isCurrentMonth && !isSelected && !isInRange && 
                            'text-gray-700 hover:bg-gray-100'
                        )}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>

                {/* Selected range display */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Période sélectionnée:</span>
                    <span className="font-medium text-gray-800">
                      {tempStart ? format(tempStart, 'dd/MM/yyyy') : '__/__/____'} - 
                      {tempEnd ? format(tempEnd, 'dd/MM/yyyy') : '__/__/____'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelSelection}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={applySelection}
                    disabled={!tempStart || !tempEnd}
                    className={clsx(
                      'px-4 py-2 rounded-lg transition',
                      tempStart && tempEnd
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangePicker;