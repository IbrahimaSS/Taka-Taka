/**
 * TripNotificationToast.jsx
 * Composant de notification visuelle moderne pour les nouvelles demandes de courses
 * Version scrollable avec une hauteur adaptative
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    User,
    Clock,
    DollarSign,
    Star,
    Phone,
    X,
    Check,
    Navigation,
    AlertCircle,
    Car,
    Target,
    Route,
    Sparkles,
    Bell,
    Zap,
    Award,
    Shield,
    Timer,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    Maximize2,
    Minimize2,
    Scroll
} from 'lucide-react';
import { useDriverContext } from '../../context/DriverContext';
import { useNotifications } from '../../hooks/useNotificationsAudio';
import { useNavigate } from 'react-router-dom';
import Button from '../admin/ui/Bttn';
import Badge from '../admin/ui/Badge';
import ConfirmModal from '../admin/ui/ConfirmModal';

// Composant TimerCircle amélioré
const TimerCircle = ({ duration, size = 40, strokeWidth = 4, onTimeEnd }) => {
    const [progress, setProgress] = useState(0);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    useEffect(() => {
        let interval;
        let startTime = Date.now();
        const totalDuration = duration * 1000; // Convert to milliseconds

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(elapsed / totalDuration, 1);
            setProgress(newProgress);

            if (newProgress >= 1) {
                clearInterval(interval);
                onTimeEnd?.();
            }
        };

        interval = setInterval(updateProgress, 100);
        updateProgress(); // Initial call

        return () => clearInterval(interval);
    }, [duration, onTimeEnd]);

    const getColor = () => {
        if (progress < 0.5) return '#10B981'; // emerald
        if (progress < 0.75) return '#F59E0B'; // amber
        return '#EF4444'; // red
    };

    return (
        <div className="relative">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <Timer className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-bold text-white/90">
                {Math.max(0, duration - Math.floor(progress * duration))}s
            </div>
        </div>
    );
};

const TripNotificationToast = () => {
    const { tripRequests, acceptTripRequest, rejectTripRequest } = useDriverContext();
    const { notifyNewTrip, stopNotificationSound } = useNotifications();
    const navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [vibration, setVibration] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    const [isExpandedFull, setIsExpandedFull] = useState(false);

    const contentRef = useRef(null);
    const containerRef = useRef(null);
    const previousRequestsCount = useRef(0);

    // Vérifier si le contenu est scrollable
    const checkScrollable = useCallback(() => {
        if (contentRef.current && containerRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            const containerHeight = containerRef.current.clientHeight;
            const isCurrentlyScrollable = contentHeight > containerHeight;
            setIsScrollable(isCurrentlyScrollable);

            // Vérifier si nous sommes au bas du scroll
            const isAtBottom = contentRef.current.scrollHeight - contentRef.current.scrollTop === contentRef.current.clientHeight;
            setShowScrollIndicator(!isAtBottom && isCurrentlyScrollable);
        }
    }, []);

    // Effets de vibration pour attirer l'attention
    useEffect(() => {
        if (tripRequests.length > 0) {
            setVibration(true);
            const timeout = setTimeout(() => setVibration(false), 500);
            return () => clearTimeout(timeout);
        }
    }, [tripRequests.length]);

    // Jouer le son quand une nouvelle demande arrive
    useEffect(() => {
        if (tripRequests.length > previousRequestsCount.current) {
            const latestRequest = tripRequests[0];
            if (latestRequest) {
                notifyNewTrip(latestRequest);
            }
        }
        previousRequestsCount.current = tripRequests.length;
    }, [tripRequests, notifyNewTrip]);

    // Arrêter le son quand toutes les demandes sont traitées
    useEffect(() => {
        if (tripRequests.length === 0) {
            stopNotificationSound();
        }
    }, [tripRequests.length, stopNotificationSound]);

    // Vérifier le scroll après le rendu et quand expanded change
    useEffect(() => {
        checkScrollable();
        const resizeObserver = new ResizeObserver(checkScrollable);
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [expanded, checkScrollable]);

    // Gérer le scroll
    const handleScroll = () => {
        if (contentRef.current) {
            const isAtBottom =
                contentRef.current.scrollHeight - contentRef.current.scrollTop ===
                contentRef.current.clientHeight;
            setShowScrollIndicator(!isAtBottom && isScrollable);
        }
    };

    const handleAccept = (tripId) => {
        stopNotificationSound();
        acceptTripRequest(tripId);
        navigate('/chauffeur/tracking');
    };

    const handleReject = (tripId) => {
        rejectTripRequest(tripId);
    };

    // après acceptation il faut afficher le modale de confirmaiton et faire disparaître le modale de notification
    const handleAcceptWithConfirm = (request) => {
        stopNotificationSound();
        setSelectedRequest(request);
        setShowConfirm(true);
    };

    const handleConfirmAccept = () => {
        if (selectedRequest) {
            handleAccept(selectedRequest.id);
        }
        setShowConfirm(false);
        setSelectedRequest(null);
    };

    const handleConfirmReject = (request) => {
        setSelectedRequest(request);
        setShowConfirm(false);
        handleReject(request.id);
        setSelectedRequest(null);
    };

    const handleTimeEnd = () => {
        if (tripRequests.length > 0) {
            handleReject(tripRequests[0].id);
        }
    };

    const scrollToBottom = () => {
        if (contentRef.current) {
            contentRef.current.scrollTo({
                top: contentRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const toggleExpandFull = () => {
        setIsExpandedFull(!isExpandedFull);
    };

    // N'afficher que la première demande (la plus récente)
    const currentRequest = tripRequests[0];

    if (!currentRequest) return null;

    return (
        <>
            <AnimatePresence>
                {currentRequest && !showConfirm && (
                    <motion.div
                        key={currentRequest.id}
                        initial={{ opacity: 0, y: -100, scale: 0.9 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            x: vibration ? ['0%', '-1%', '1%', '-1%', '0%'] : '0%'
                        }}
                        exit={{ opacity: 0, y: -100, scale: 0.9 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 25,
                            x: {
                                duration: 0.3,
                                times: [0, 0.2, 0.4, 0.6, 1]
                            }
                        }}
                        className={`fixed ${isExpandedFull ? 'ins-2' : 'top-4 left-1/2'} z-[9999] w-[95%] max-w-xl ${isExpandedFull ? 'h-[95vh]' : ''} transform ${isExpandedFull ? '' : '-translate-x-1/2'} bg-gray-50 dark:bg-gray-800`}
                        style={{ perspective: 1000 }}
                        ref={containerRef}
                    >
                        <motion.div
                            whileHover={{ y: isExpandedFull ? 0 : -4 }}
                            className={`relative group ${isExpandedFull ? 'h-full' : ''}`}
                        >
                            {/* Lueur d'arrière-plan */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-00/20 via-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl -z-10 opacity-50" />

                            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden backdrop-blur-sm ${isExpandedFull ? 'h-full flex flex-col' : ''}`}>
                                {/* Header avec timer et badge d'urgence */}
                                <div className="relative bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 px-6 py-4">

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                                className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
                                            >
                                                <Bell className="w-5 h-5 text-white" />
                                            </motion.div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-white font-bold text-lg">Nouvelle Course Disponible !</h3>
                                                    <Sparkles className="w-4 h-4 text-yellow-300" />
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Timer className="w-3 h-3 text-white/80" />
                                                    <p className="text-white/90 text-sm">
                                                        Expire dans <span className="font-bold">{currentRequest.expiresIn}s</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <TimerCircle
                                                duration={currentRequest.expiresIn}
                                                onTimeEnd={handleTimeEnd}
                                            />

                                            <Button
                                                variant="ghost"
                                                size="small"
                                                icon={isExpandedFull ? Minimize2 : Maximize2}
                                                onClick={toggleExpandFull}
                                                className="text-white hover:bg-white/20"
                                                tooltip={isExpandedFull ? "Réduire" : "Agrandir"}
                                            />
                                        </div>
                                    </div>

                                    {/* Compteur si plusieurs demandes */}
                                    {tripRequests.length > 1 && (
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
                                        >
                                            <Badge
                                                variant="warning"
                                                size="sm"
                                                className="shadow-lg cursor-pointer"
                                                onClick={() => setExpanded(!expanded)}
                                            >
                                                +{tripRequests.length - 1} autres
                                            </Badge>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Contenu principal avec scroll */}
                                <div
                                    ref={contentRef}
                                    onScroll={handleScroll}
                                    className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${isExpandedFull ? 'max-h-[calc(100vh-180px)]' : 'max-h-[60vh]'}`}
                                >
                                    <div className="p-6 space-y-6">
                                        {/* Section Passager Premium */}
                                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg">
                                                        <User className="w-6 h-6 text-white" />
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center"
                                                    >
                                                        <Award className="w-3 h-3 text-white" />
                                                    </motion.div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-bold text-gray-900 dark:text-white text-lg truncate">
                                                            {currentRequest.passengerName}
                                                        </p>
                                                        <Badge variant="primary" size="xs">
                                                            PREMIUM
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            <Star className="w-4 h-4 fill-current" />
                                                            <span className="font-bold">{currentRequest.passengerRating}</span>
                                                            <span className="text-gray-500 text-xs">(500+ voyages)</span>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                            {currentRequest.passengerPhone && (
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    className="text-center p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm"
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="xs"
                                                        icon={Phone}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(`tel:${currentRequest.passengerPhone}`, '_blank');
                                                        }}
                                                        className="text-blue-600 dark:text-blue-400"
                                                    >
                                                        Appeler
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Itinéraire visuel */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                                    <Route className="w-5 h-5 text-blue-500" />
                                                    Itinéraire détaillé
                                                </h4>
                                                <Badge variant="outline" size="xs">
                                                    {currentRequest.distance} km
                                                </Badge>
                                            </div>

                                            <div className="relative pl-10">
                                                {/* Ligne de trajet */}
                                                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-rose-500" />

                                                {/* Point de départ */}
                                                <div className="flex items-start gap-4 mb-8">
                                                    <div className="absolute left-3.5 -translate-x-1/2">
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900/50 flex items-center justify-center">
                                                            <div className="w-2 h-2 rounded-full bg-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 pl-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">DÉPART</p>
                                                        </div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {currentRequest.pickupAddress}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Point d'arrivée */}
                                                <div className="flex items-start gap-4">
                                                    <div className="absolute left-3.5 -translate-x-1/2">
                                                        <div className="w-5 h-5 rounded-full bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-900/50 flex items-center justify-center">
                                                            <Target className="w-2.5 h-2.5 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 pl-4">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Target className="w-4 h-4 text-rose-500" />
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">DESTINATION</p>
                                                        </div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {currentRequest.destinationAddress}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Statistiques de la course */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                                            <motion.div
                                                whileHover={{ y: -4 }}
                                                className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-2xl text-center"
                                            >
                                                <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-green-500 to-blue-600  rounded-xl flex items-center justify-center">
                                                    <Route className="w-5 h-5 text-white" />
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Distance</p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-emerald-400 mt-1">
                                                    {currentRequest.distance} km
                                                </p>
                                            </motion.div>

                                            <motion.div
                                                whileHover={{ y: -4 }}
                                                className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-2xl text-center"
                                            >
                                                <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-green-500 to-blue-600  rounded-xl flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-white" />
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Durée</p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-emerald-400 mt-1">
                                                    {currentRequest.estimatedTime}
                                                </p>
                                            </motion.div>

                                            <motion.div
                                                whileHover={{ y: -4 }}
                                                className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-2xl text-center"
                                            >
                                                <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-green-500 to-blue-600  rounded-xl flex items-center justify-center">
                                                    <DollarSign className="w-5 h-5 text-white" />
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">Gains estimés</p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-emerald-400 mt-1">
                                                    {currentRequest.estimatedFare?.toLocaleString('fr-FR')} FG
                                                </p>
                                            </motion.div>
                                        </div>



                                    </div>
                                </div>

                                {/* Pied de page avec boutons d'action (toujours visible) */}
                                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                                    <div className="flex gap-4">
                                        <Button
                                            variant="danger"
                                            size="large"
                                            icon={X}
                                            onClick={() => handleConfirmReject(currentRequest)}
                                            fullWidth
                                            className="h-12"
                                            tooltip="Refuser cette course"
                                        >
                                            Refuser
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="large"
                                            icon={Check}
                                            onClick={() => handleAcceptWithConfirm(currentRequest)}
                                            fullWidth
                                            className="h-12 shadow-lg shadow-emerald-500/30"
                                            tooltip="Accepter et naviguer vers le passager"
                                        >
                                            <span className="flex items-center gap-2">
                                                Accepter
                                                <Zap className="w-4 h-4 animate-pulse" />
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de confirmation d'acceptation */}
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => {
                    setShowConfirm(false);
                    setSelectedRequest(null);
                }}
                onConfirm={handleConfirmAccept}
                title="Confirmer l'acceptation"
                message={
                    <div className="space-y-3">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            Êtes-vous sûr de vouloir accepter cette course ?
                        </p>
                        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 p-4 rounded-xl">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-bold">Passager:</span> {selectedRequest?.passengerName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <span className="font-bold">Distance:</span> {selectedRequest?.distance} km
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <span className="font-bold">Gains:</span> {selectedRequest?.estimatedFare?.toLocaleString('fr-FR')} FG
                            </p>
                        </div>
                    </div>
                }
                confirmText="Confirmer l'acceptation"
                cancelText="Annuler"
                confirmVariant="success"
                type="success"
                destructive={false}
                loading={false}
            />
        </>
    );
};

export default TripNotificationToast;