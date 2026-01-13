// src/components/ui/AvatarUpload.jsx
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, User, Loader2 } from 'lucide-react';
import Button from './Bttn';

const AvatarUpload = ({
  image,
  onImageChange,
  size = 'lg',
  editable = true,
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = async (file) => {
    try {
      setIsUploading(true);
      
      // Validation
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Type de fichier non supporté');
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image trop volumineuse (max 5MB)');
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onImageChange(null);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative ${sizes[size]} rounded-full overflow-hidden border-4 border-white shadow-2xl cursor-pointer group`}
        onClick={() => editable && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Image ou placeholder */}
        {image ? (
          <img
            src={image}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-700 to-blue-700 flex items-center justify-center">
            <User className="text-white text-4xl" />
          </div>
        )}

        {/* Overlay au survol */}
        {editable && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity"
          >
            <div className="text-center text-white">
              {isUploading ? (
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              ) : (
                <>
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">Changer la photo</p>
                  <p className="text-xs opacity-80">PNG, JPG, WebP (max 5MB)</p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Indicateur de drag & drop */}
        <AnimatePresence>
          {isDragging && editable && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-gradient-to-br from-teal-700/80 to-blue-700/80 flex items-center justify-center"
            >
              <Upload className="w-12 h-12 text-white" />
              <p className="absolute bottom-4 text-white text-sm font-medium">
                Déposez l'image ici
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bouton de suppression */}
      {image && editable && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleRemove}
          className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </motion.button>
      )}

      {/* Badge de statut */}
      <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;