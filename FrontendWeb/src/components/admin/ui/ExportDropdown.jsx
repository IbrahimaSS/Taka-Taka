// src/components/shared/ExportDropdown.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ChevronDown, FileSpreadsheet, FileText, FilePen, Printer, Share2 } from "lucide-react";
import Button from "../ui/Bttn";
import { exportToCSV, exportToPDF, exportToWord } from "../../../utils/exporters";

/**
 * Dropdown export réutilisable (CSV, Word, PDF)
 * Props:
 * - data: tableau d'objets
 * - columns: [{ header, accessor, formatter? }]
 * - fileName, title, orientation
 * - showToast: (title, msg, type) => void
 * - onPrint/onShare: callbacks optionnels (affiche des lignes supplémentaires)
 */
export default function ExportDropdown({
  data = [],
  columns = [],
  fileName = "export",
  title = "Export",
  orientation = "landscape",
  showToast,
  onPrint,
  onShare,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const disabled = useMemo(
    () => !Array.isArray(data) || data.length === 0 || !Array.isArray(columns) || columns.length === 0,
    [data, columns]
  );

  const payload = useMemo(
    () => ({ data, columns, fileName, title, orientation, onToast: showToast }),
    [data, columns, fileName, title, orientation, showToast]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <Button
        variant="secondary"
        icon={Download}
        onClick={() => setOpen((v) => !v)}
        className="relative"
        disabled={disabled}
      >
        Exporter
        <ChevronDown className="ml-2 w-4 h-4" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  exportToCSV(payload);
                  setOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FileSpreadsheet className="w-4 h-4 mr-3 text-green-500" />
                Exporter en CSV
              </button>

              <button
                onClick={() => {
                  exportToWord(payload);
                  setOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FileText className="w-4 h-4 mr-3 text-blue-500" />
                Exporter en Word
              </button>

              <button
                onClick={async () => {
                  await exportToPDF(payload);
                  setOpen(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FilePen className="w-4 h-4 mr-3 text-red-500" />
                Exporter en PDF
              </button>

              {(onPrint || onShare) && <div className="my-1 border-t border-gray-200" />}

              {onPrint && (
                <button
                  onClick={() => {
                    onPrint();
                    setOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4 mr-3 text-gray-500" />
                  Imprimer la liste
                </button>
              )}

              {onShare && (
                <button
                  onClick={() => {
                    onShare();
                    setOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4 mr-3 text-gray-500" />
                  Partager
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
