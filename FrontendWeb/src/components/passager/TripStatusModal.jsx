import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Clock,
  Navigation,
  Phone,
  X,
  Check,
  Loader,
  Users,
  Map,
  Calendar,
  AlertCircle,
  ChevronRight,
  MapPin,
  Star,
  Shield,
  BadgePercent,
  MessageCircle,
  HelpCircle,
  Flag
} from 'lucide-react';

// Composants réutilisables
import Modal from '../admin/ui/Modal';
import Button from '../admin/ui/Bttn';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../admin/ui/Card';
import Badge from '../admin/ui/Badge';
import Progress from '../admin/ui/Progress';
import ConfirmModal from '../admin/ui/ConfirmModal';

const TripStatusModal = ({
  isOpen,
  onClose,
  status,
  driver,
  tripDetails,
  onCancel,
  onContact,
  onTrack,
  onStartTrip,
  onViewPlanning,
  onSearchAgain,
  onDriverFound,
  onRateTrip,
  onTripComplete,
  arrivalSecondsRemaining
}) => {
  const [eta, setEta] = useState(3);
  const [searchProgress, setSearchProgress] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const cancelReasons = [
    "Temps d'attente trop long",
    "Changement de plans",
    "Prix trop élevé",
    "Chauffeur en retard",
    "Problème avec le véhicule",
    "Autre raison"
  ];

  const searchTimeoutRef = useRef();

  useEffect(() => {
    let interval;
    if (status === 'searching' && isOpen) {
      setSearchProgress(0);
      interval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
              onDriverFound({
                id: 1,
                name: "Mamadou Diallo",
                phone: "+224 623 09 02 24",
                rating: 4.8,
                tripsCompleted: 1247,
                vehicle: {
                  brand: "Toyota",
                  model: "Corolla",
                  color: "Blanc",
                  plate: "AB-123-CD",
                  type: tripDetails?.vehicleType || 'taxi',
                  year: 2022
                },
                distance: "0.8 km",
                eta: "3 min",
                location: [9.6412, -13.5784],
                languages: ["Français", "Soussou", "Malinké"],
                verified: true,
                onlineSince: "2022"
              });
            }, 2000);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
    return () => {
      clearInterval(interval);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [status, isOpen, tripDetails, onDriverFound]);

  useEffect(() => {
    let interval;
    if (status === 'driver_found' && eta > 0) {
      interval = setInterval(() => {
        setEta(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [status, eta]);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onCancel();
      setCancelReason('');
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleStartTrip = () => {
    if (onStartTrip) {
      onStartTrip(tripDetails, driver);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0 GNF';
    return typeof price === 'number'
      ? `${price.toLocaleString()} GNF`
      : price;
  };

  const calculateArrivalTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + eta);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatSeconds = (s) => {
    if (s == null) return null;
    const sec = Number(s);
    if (isNaN(sec) || sec <= 0) return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const ss = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  const getStatusConfig = () => {
    const configs = {
      searching: {
        title: '🔍 Recherche en cours',
        description: 'Nous cherchons le meilleur chauffeur pour vous...',
        icon: Loader,
        color: 'green',
      },
      driver_found: {
        title: '✅ Chauffeur trouvé',
        description: `Arrivée prévue vers ${calculateArrivalTime()}`,
        icon: Car,
        color: 'green',
      },
      arrived: {
        title: '🚗 Arrivée confirmée',
        description: 'Votre chauffeur vous attend au point de départ',
        icon: Check,
        color: 'green',
      },
      cancelled: {
        title: '❌ Course annulée',
        description: 'La course a été annulée',
        icon: X,
        color: 'red',
      },
      scheduled: {
        title: '📅 Course planifiée',
        description: 'Votre course est programmée pour plus tard',
        icon: Calendar,
        color: 'blue',
      },
      completed: {
        title: '🏁 Trajet terminé',
        description: 'Merci d\'avoir voyagé avec TakaTaka',
        icon: Check,
        color: 'green',
      },
      en_route: {
        title: '🚗 Trajet en cours',
        description: 'Vous êtes en route vers votre destination',
        icon: Navigation,
        color: 'green',
      },
    };
    return configs[status] || configs.searching;
  };

  const statusConfig = getStatusConfig();

  // Rendu de la barre de progression de recherche
  const renderSearchProgress = () => (
    <Card className="mb-6">
      <CardContent>
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center mx-auto mb-4">
            <Loader className="w-12 h-12 text-green-600 dark:text-green-400 animate-spin" />
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Recherche en cours...</span>
              <span>{searchProgress}%</span>
            </div>
            <Progress
              value={searchProgress}
              color="green"
              showLabel={false}
              animated={true}
              striped={true}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="flex items-center justify-center space-x-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-400">4</p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">Disponibles</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">3 min</p>
                  <p className="text-xs text-green-600 dark:text-green-300">Temps moyen</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Vous pouvez annuler gratuitement avant l'arrivée du chauffeur
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="danger"
          fullWidth
          onClick={() => setShowCancelConfirm(true)}
        >
          Annuler la recherche
        </Button>
      </CardContent>
    </Card>
  );

  // Rendu du chauffeur trouvé
  const renderDriverFound = () => {
    if (!driver) return null;

    return (
      <>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mr-4 relative shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {driver.name.charAt(0)}
                  </span>
                  {driver.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{driver.name}</h3>
                    {driver.verified && (
                      <Badge variant="info" size="xs" className="ml-2">
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(driver.rating) ? 'text-amber-400 dark:text-amber-500 fill-amber-400 dark:fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      {driver.rating} ({driver.tripsCompleted} trajets)
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="small"
                icon={Phone}
                onClick={onContact}
                className="!p-2"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Car className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  {driver.vehicle.brand} {driver.vehicle.model} • {driver.vehicle.color} • {driver.vehicle.plate}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div className="text-gray-700 dark:text-gray-300">
                    <div>
                      Arrivée prévue • <span className="font-medium">{calculateArrivalTime()}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {eta} minute{eta > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {arrivalSecondsRemaining != null && (
                  <div className="ml-4 flex items-center space-x-3">
                    <Badge variant="secondary" size="sm">
                      {formatSeconds(arrivalSecondsRemaining)}
                    </Badge>
                    <Progress
                      value={Math.max(0, Math.min(100, (1 - (arrivalSecondsRemaining / Math.max(1, (eta * 60 || 60)))) * 100))}
                      color="green"
                      size="sm"
                      showLabel={false}
                      className="w-20"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <Navigation className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">
                  {driver.distance} • {driver.eta}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle size="sm">Détails du trajet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Départ</span>
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium text-right">
                  {tripDetails?.pickup}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Destination</span>
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium text-right">
                  {tripDetails?.destination}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BadgePercent className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">Prix</span>
                </div>
                <span className="text-green-700 dark:text-green-400 font-bold">
                  {formatPrice(tripDetails?.estimatedPrice)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="primary"
            fullWidth
            icon={Map}
            onClick={onTrack}
          >
            Suivre sur la carte
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowCancelConfirm(true)}
            className="sm:w-auto"
          >
            Annuler
          </Button>
        </div>
      </>
    );
  };

  // Rendu des autres statuts
  const renderStatusContent = () => {
    switch (status) {
      case 'arrived':
        return (
          <Card>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Votre chauffeur est arrivé !
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Montez à bord pour commencer votre trajet
                </p>
              </div>

              {driver && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Chauffeur</p>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{driver.name}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Véhicule</p>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{driver.vehicle?.plate}</p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                fullWidth
                icon={Navigation}
                onClick={handleStartTrip}
              >
                Démarrer le trajet
              </Button>
            </CardContent>
          </Card>
        );

      case 'en_route':
        return (
          <Card>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Navigation className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Trajet en cours
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Vous êtes en route vers votre destination
                </p>
              </div>

              <Button
                variant="primary"
                fullWidth
                icon={Flag}
                onClick={onTripComplete}
              >
                Arriver à destination
              </Button>
            </CardContent>
          </Card>
        );

      case 'scheduled':
        return (
          <Card>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Course planifiée !
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Votre course a été planifiée avec succès.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6 border border-blue-100 dark:border-blue-800/30">
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Date</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {tripDetails?.scheduleDate || '20/12/2024'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Heure</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {tripDetails?.scheduleTime || '14:30'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Départ</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
                      {tripDetails?.pickup || 'Non spécifié'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Destination</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
                      {tripDetails?.destination || 'Non spécifié'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Prix estimé</span>
                    <span className="font-bold text-green-700 dark:text-green-400">
                      {formatPrice(tripDetails?.estimatedPrice)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  icon={ChevronRight}
                  onClick={onViewPlanning}
                >
                  Voir votre planning
                </Button>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Un rappel vous sera envoyé 30 minutes avant le départ.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'cancelled':
        return (
          <Card>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <X className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Course annulée !
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Votre course a été annulée avec succès.
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
                  Nous sommes désolés que vous ayez dû annuler. Vous pouvez planifier un nouveau trajet dès maintenant.
                </p>

                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={onSearchAgain}
                  >
                    Rechercher un nouveau trajet
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={onClose}
                  >
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'completed':
        return (
          <Card>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Trajet terminé !
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Merci d'avoir voyagé avec TakaTaka
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6 border border-green-100 dark:border-green-800/30">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Distance parcourue</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {tripDetails?.estimatedDistance || '12.5 km'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Durée</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {tripDetails?.estimatedDuration || '25 min'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Montant payé</span>
                    <span className="font-bold text-green-700 dark:text-green-400">
                      {formatPrice(tripDetails?.estimatedPrice)}
                    </span>
                  </div>
                  {driver && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Chauffeur</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {driver.name}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  icon={Star}
                  onClick={onRateTrip}
                >
                  Évaluer le trajet
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="info"
                  fullWidth
                  onClick={onSearchAgain}
                >
                  Nouveau trajet
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={onClose}
                >
                  Retour
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        closeOnOverlayClick={status !== 'searching' && status !== 'driver_found'}
      >
        <div className="space-y-6">
          {/* En-tête du statut */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {statusConfig.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {statusConfig.description}
            </p>
          </div>

          {/* Contenu selon le statut */}
          {status === 'searching' && renderSearchProgress()}
          {status === 'driver_found' && renderDriverFound()}
          {status !== 'searching' && status !== 'driver_found' && renderStatusContent()}
        </div>
      </Modal>

      {/* Modal de confirmation d'annulation */}
      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => {
          setShowCancelConfirm(false);
          setCancelReason('');
        }}
        onConfirm={handleCancel}
        title="Confirmer l'annulation"
        message="Êtes-vous sûr de vouloir annuler cette course ? Des frais d'annulation peuvent s'appliquer."
        type="warning"
        confirmText="Confirmer l'annulation"
        cancelText="Retour"
        confirmVariant="danger"
        loading={isCancelling}
        showComment={true}
        commentLabel="Raison de l'annulation (facultatif)"
        commentPlaceholder="Sélectionnez une raison ou écrivez votre propre raison"
        commentValue={cancelReason}
        onCommentChange={setCancelReason}
        destructive={true}
      >
        <div className="space-y-2 mb-4">
          {cancelReasons.map((reason, index) => (
            <button
              key={index}
              onClick={() => setCancelReason(reason)}
              className={`w-full text-left px-4 py-2 rounded-lg border text-sm ${cancelReason === reason
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            ⚠️ Annulation tardive : des frais de 1 000 GNF peuvent s'appliquer si le chauffeur est déjà en route.
          </p>
        </div>
      </ConfirmModal>
    </>
  );
};

export default TripStatusModal;