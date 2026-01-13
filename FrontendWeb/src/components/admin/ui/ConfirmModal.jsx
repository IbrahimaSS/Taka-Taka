// src/components/ui/ConfirmModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle, XCircle, Info, HelpCircle,
  AlertCircle, UserCheck, UserX, Trash2, LogOut,
  ShieldAlert, ShieldCheck
} from 'lucide-react';
import Button from './Bttn';
import Modal from './Modal';

/**
 * Composant de modal de confirmation réutilisable
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture de la modal
 * @param {Function} props.onClose - Fonction pour fermer la modal
 * @param {Function} props.onConfirm - Fonction appelée lors de la confirmation
 * @param {string} props.title - Titre de la modal
 * @param {string} props.message - Message principal
 * @param {string} props.type - Type de modal (success, error, warning, info, delete, validate, reject)
 * @param {string} props.confirmText - Texte du bouton de confirmation
 * @param {string} props.cancelText - Texte du bouton d'annulation
 * @param {string} props.confirmVariant - Variant du bouton de confirmation
 * @param {string} props.cancelVariant - Variant du bouton d'annulation
 * @param {boolean} props.showComment - Afficher un champ de commentaire
 * @param {string} props.commentLabel - Label du champ commentaire
 * @param {string} props.commentPlaceholder - Placeholder du champ commentaire
 * @param {boolean} props.requireComment - Rendre le commentaire obligatoire
 * @param {number} props.maxCommentLength - Longueur maximale du commentaire
 * @param {boolean} props.loading - État de chargement
 * @param {boolean} props.destructive - Action destructrice (met en évidence le danger)
 * @param {string} props.size - Taille de la modal (sm, md, lg)
 * @param {React.ReactNode} props.children - Contenu additionnel
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmation',
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  type = 'info',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'primary',
  cancelVariant = 'secondary',
  showComment = false,
  commentLabel = 'Commentaire',
  commentPlaceholder = 'Ajouter un commentaire...',
  requireComment = false,
  maxCommentLength = 500,
  loading = false,
  destructive = false,
  size = 'md',
  children
}) => {
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');

  // Configuration basée sur le type
  const typeConfig = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100',
      defaultConfirmVariant: 'primary',
      defaultTitle: 'Succès',
      iconComponent: ShieldCheck
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100',
      defaultConfirmVariant: 'danger',
      defaultTitle: 'Erreur',
      iconComponent: AlertCircle
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      defaultConfirmVariant: 'warning',
      defaultTitle: 'Attention',
      iconComponent: ShieldAlert
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-100',
      defaultConfirmVariant: 'primary',
      defaultTitle: 'Information',
      iconComponent: Info
    },
    delete: {
      icon: Trash2,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100',
      defaultConfirmVariant: 'danger',
      defaultTitle: 'Supprimer',
      iconComponent: Trash2
    },
    validate: {
      icon: UserCheck,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-100',
      defaultConfirmVariant: 'primary',
      defaultTitle: 'Validation',
      iconComponent: UserCheck
    },
    reject: {
      icon: UserX,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-100',
      defaultConfirmVariant: 'danger',
      defaultTitle: 'Rejet',
      iconComponent: UserX
    },
    logout: {
      icon: LogOut,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-100',
      defaultConfirmVariant: 'warning',
      defaultTitle: 'Déconnexion',
      iconComponent: LogOut
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const IconComponent = config.iconComponent || config.icon;
  
  // Utiliser les valeurs par défaut si non spécifiées
  const finalConfirmVariant = confirmVariant === 'primary' && config.defaultConfirmVariant 
    ? config.defaultConfirmVariant 
    : confirmVariant;
  
  const finalTitle = title === 'Confirmation' && config.defaultTitle 
    ? config.defaultTitle 
    : title;

  // Validation du commentaire
  const validateComment = () => {
    if (requireComment && !comment.trim()) {
      setCommentError('Un commentaire est requis');
      return false;
    }
    if (comment.length > maxCommentLength) {
      setCommentError(`Le commentaire ne doit pas dépasser ${maxCommentLength} caractères`);
      return false;
    }
    setCommentError('');
    return true;
  };

  // Gestion de la confirmation
  const handleConfirm = () => {
    if (showComment && !validateComment()) {
      return;
    }
    
    onConfirm(comment);
    if (!loading) {
      setComment('');
      setCommentError('');
    }
  };

  // Gestion de la fermeture
  const handleClose = () => {
    setComment('');
    setCommentError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={null} // Nous gérons notre propre header
      size={size}
    >
      <div className="space-y-6">
        {/* Header avec icône */}
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">
              {finalTitle}
            </h3>
            <p className="text-gray-600 mt-1">
              {message}
            </p>
          </div>
        </div>

        {/* Contenu additionnel */}
        {children && (
          <div className="bg-gray-50 rounded-xl p-4">
            {children}
          </div>
        )}

        {/* Champ de commentaire */}
        {showComment && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {commentLabel}
              {requireComment && <span className="text-red-500 ml-1">*</span>}
              <span className="text-gray-500 text-xs font-normal ml-2">
                {comment.length}/{maxCommentLength} caractères
              </span>
            </label>
            
            <textarea
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-2 transition ${
                commentError 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-100'
              }`}
              rows="3"
              placeholder={commentPlaceholder}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (commentError) validateComment();
              }}
              maxLength={maxCommentLength}
            />
            
            {commentError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500"
              >
                {commentError}
              </motion.p>
            )}
          </div>
        )}

        {/* Indicateur d'action destructrice */}
        {destructive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700 font-medium">
                Cette action est irréversible. Veuillez confirmer avec précaution.
              </p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant={cancelVariant}
            onClick={handleClose}
            disabled={loading}
            className="mt-3 sm:mt-0"
            fullWidth={window.innerWidth < 640}
          >
            {cancelText}
          </Button>
          
          <Button
            variant={finalConfirmVariant}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading || (showComment && requireComment && !comment.trim())}
            fullWidth={window.innerWidth < 640}
            className={destructive ? 'shadow-lg shadow-red-500/20' : ''}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;