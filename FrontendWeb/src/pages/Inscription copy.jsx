import React, { useState, useEffect } from 'react';
import {
    Car,
    User,
    Shield,
    ArrowLeft,
    ArrowRight,
    Check,
    Star,
    ChartLine,
    Eye,
    EyeOff,
    RefreshCw,
    CheckCircle,
    XCircle,
    Loader2,
    Smartphone,
    Mail,
    Lock,
    Clock,
    Users,
    ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Buttons';

const Inscription = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [userType, setUserType] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        otp: ['', '', '', '', '', ''],
        termsAccepted: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: '',
        color: '#6b7280'
    });
    const [otpTimer, setOtpTimer] = useState(60);
    const [generatedOtp, setGeneratedOtp] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeOtpIndex, setActiveOtpIndex] = useState(0);
    const navigate = useNavigate();

    // Générer un OTP aléatoire
    useEffect(() => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        setGeneratedOtp(otp);
        console.log('Code OTP (pour test):', otp);
    }, []);

    // Timer OTP
    useEffect(() => {
        let interval;
        if (currentStep === 3 && otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentStep, otpTimer]);

    const handleUserTypeSelect = (type) => {
        setUserType(type);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Calcul de la force du mot de passe
        if (name === 'password') {
            calculatePasswordStrength(value);
        }
    };

    const handleOtpChange = (value, index) => {
        // N'accepter que les chiffres
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...formData.otp];
        newOtp[index] = value;
        setFormData(prev => ({ ...prev, otp: newOtp }));

        // Passer au champ suivant si une valeur est entrée
        if (value && index < 5) {
            setActiveOtpIndex(index + 1);
        }

        // Vérifier si l'OTP est complet
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
            autoVerifyOtp(newOtp.join(''));
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
            setActiveOtpIndex(index - 1);
        }
    };

    const calculatePasswordStrength = (password) => {
        let score = 0;
        let message = '';
        let color = '#6b7280';

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {
            case 0:
                message = 'Très faible';
                color = '#ef4444';
                break;
            case 1:
                message = 'Faible';
                color = '#f97316';
                break;
            case 2:
                message = 'Moyen';
                color = '#eab308';
                break;
            case 3:
                message = 'Bon';
                color = '#22c55e';
                break;
            case 4:
                message = 'Très bon';
                color = '#0d8c6f';
                break;
        }

        setPasswordStrength({ score, message, color });
    };

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!userType) {
                alert('Veuillez sélectionner un type de compte');
                return;
            }
        }

        if (currentStep === 2) {
            const { firstName, lastName, phone, password, confirmPassword } = formData;

            if (!firstName || !lastName || !phone || !password) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            if (password !== confirmPassword) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }

            if (password.length < 8) {
                alert('Le mot de passe doit contenir au moins 8 caractères');
                return;
            }

            if (!/^\d{8,}$/.test(phone.replace(/\s/g, ''))) {
                alert('Numéro de téléphone invalide');
                return;
            }
        }

        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const resendOtp = () => {
        if (otpTimer > 0) return;

        const newOtp = Math.floor(100000 + Math.random() * 900000);
        setGeneratedOtp(newOtp);
        setOtpTimer(60);
        console.log('Nouveau code OTP:', newOtp);

        // Réinitialiser les champs OTP
        setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
        setActiveOtpIndex(0);
        alert('Un nouveau code a été envoyé');
    };

    const autoVerifyOtp = (otp) => {
        if (parseInt(otp) === generatedOtp) {
            console.log('OTP correct!');
        }
    };

    const handleSubmit = () => {
        if (!formData.termsAccepted) {
            alert('Veuillez accepter les conditions d\'utilisation');
            return;
        }

        const otpValue = formData.otp.join('');
        if (otpValue.length !== 6) {
            alert('Veuillez entrer le code de vérification complet');
            return;
        }

        if (parseInt(otpValue) !== generatedOtp) {
            alert('Code de vérification incorrect');
            return;
        }

        setIsSubmitting(true);

        // Simulation d'inscription
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Votre compte a été créé avec succès !');

            setTimeout(() => {
                const redirectUrl = userType === 'passenger' ? '/passenger' : '/driver';
                window.location.href = redirectUrl;
            }, 1500);
        }, 2000);
    };

    const getProgressPercentage = () => {
        return ((currentStep - 1) / 2) * 100;
    };

    const isPasswordMatch = () => {
        return formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="hidden md:flex md:w-1/3 lg:w-1/4 bg-blue-800 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute w-64 h-64 bg-white/10  rounded-full -top-32 -left-32"></div>
                        <div className="absolute w-96 h-96 bg-primaryGreen-start/20  rounded-full -bottom-48 -right-48"></div>
                    </div>

                    <div className="relative z-10 p-8 flex flex-col h-full">
                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-lg">
                                <Car className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">TAKA TAKA</h1>
                                <p className="text-sm text-blue-200">Mobilité Intelligente</p>
                            </div>

                        </div>
                        {/* Back to Home */}
                        <div className="text-center pt-3 border-t border-gray-200 dark:border-gray-700">
                            <a
                                href="/"
                                className="inline-flex items-center text-gray-200 hover:text-green- dark:hover:text-gray-300 text-sm transition-colors group"
                            >
                                <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
                                Retour à l'accueil
                            </a>
                        </div>
                        {/* Navigation des étapes */}
                        <nav className="space-y-6 mb-12">
                            <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${currentStep >= 1 ? 'bg-white/10' : 'opacity-50'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-white text-primaryGreen-start' : 'bg-white/10 text-white'}`}>
                                    {currentStep > 1 ? <Check size={16} /> : '1'}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Profil</p>
                                    <p className="text-sm text-blue-200">Choisissez votre type de compte</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${currentStep >= 2 ? 'bg-white/10' : 'opacity-50'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-white text-primaryGreen-start' : 'bg-white/10 text-white'}`}>
                                    {currentStep > 2 ? <Check size={16} /> : '2'}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Informations</p>
                                    <p className="text-sm text-blue-200">Renseignez vos coordonnées</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-4 p-3 rounded-xl transition-all ${currentStep >= 3 ? 'bg-white/10' : 'opacity-50'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-white text-primaryGreen-start' : 'bg-white/10 text-white'}`}>
                                    3
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Vérification</p>
                                    <p className="text-sm text-blue-200">Confirmez votre identité</p>
                                </div>
                            </div>
                        </nav>

                        {/* Statistiques */}
                        <div className="mt-auto pt-8 border-t border-white/20">
                            <p className="text-sm text-blue-200 mb-4">Rejoignez notre communauté</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                                    <p className="text-2xl font-bold text-green-300">50K+</p>
                                    <p className="text-xs text-blue-200">Utilisateurs</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                                    <p className="text-2xl font-bold text-yellow-300">4.8★</p>
                                    <p className="text-xs text-blue-200">Satisfaction</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-2xl">
                        {/* Mobile Logo */}
                        <div className="md:hidden flex items-center gap-3 mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-lg">
                                <Car className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">TAKA TAKA</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Mobilité Intelligente</p>
                            </div>
                        </div>

                        {/* Barre de progression */}
                        <div className="mb-8">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primaryGreen-start to-primaryBlue-start transition-all duration-500"
                                    style={{ width: `${getProgressPercentage()}%` }}
                                ></div>

                            </div>
                            <h1 className={`option-card text-2xl text-green-700 dark:text-white mt-8`}>{userType === 'passenger' ? ' compte Passager' : ''} </h1>
                            <h1 className={`option-card text-2xl text-blue-700 dark:text-white mt-8`}>{userType === 'driver' ? 'Compte Chauffeur' : ''} </h1>
                        </div>

                        {/* Conteneur du formulaire */}
                        <div className="surface shadow-soft rounded-3xl">
                            {/* Étape 1: Type de compte */}
                            {currentStep === 1 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choisissez votre profil</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8">Sélectionnez le type de compte qui correspond à vos besoins</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {/* Option Passager */}
                                        <div
                                            className={`option-card rounded-xl shadow-lg py-8 p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${userType === 'passenger' ? 'selected border-primaryGreen-start bg-blue-700 text-white' : ''}`}
                                            onClick={() => handleUserTypeSelect('passenger')}
                                        >
                                            <div className="w-20 h-20  mt-2 rounded-full bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10 flex items-center justify-center mb-4 shadow-inner">
                                                <User className="text-green-600 dark:text-green-400 text-3xl" />
                                            </div>
                                            <h3 className={`text-lg  font-bold text-gray-900 dark:text-white mb-3 ${userType === 'passenger' ? 'selected  text-white' : ''}`}>Passager</h3>
                                            <p className={`text-gray-600  dark:text-gray-400 text-sm mb-6 ${userType === 'passenger' ? 'selected text-white' : ''}`}>
                                                Voyagez facilement, rapidement et en toute sécurité avec notre application
                                            </p>
                                            <div className="mt-auto  mb-2 w-full">
                                                <div className={`flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium ${userType === 'passenger' ? 'selected text-green-200' : ''}`}>
                                                    <Star size={16} />
                                                    <span>Avantages passager</span>
                                                </div>
                                                <ul className={`text-xs text-gray-500 dark:text-gray-400 space-y-2 mt-3 ${userType === 'passenger' ? 'selected text-white' : ''} 
                                                    `}>
                                                    <li className="flex items-center">
                                                        <CheckCircle className="text-green-500 mr-2" size={12} />
                                                        Réservation en 30 secondes
                                                    </li>
                                                    <li className="flex items-center">
                                                        <CheckCircle className="text-green-500 mr-2" size={12} />
                                                        Support 24h/24
                                                    </li>
                                                    <li className="flex items-center">
                                                        <CheckCircle className="text-green-500 mr-2" size={12} />
                                                        Paiement sécurisé
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Option Chauffeur */}
                                        <div
                                            className={`option-card rounded-xl shadow-lg py-8 p-8  cursor-pointer transition-all duration-300 hover:scale-[1.02] ${userType === 'driver' ? 'selected bg-blue-700' : ''}`}
                                            onClick={() => handleUserTypeSelect('driver')}
                                        >
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 flex items-center justify-center mb-4 shadow-inner">
                                                <Car className="text-blue-600 dark:text-blue-400 text-3xl" />
                                            </div>
                                            <h3 className={`text-lg  font-bold text-gray-900 dark:text-white mb-3 ${userType === 'driver' ? 'selected  text-white' : ''}`}>Chauffeur</h3>
                                            <p className={`text-gray-600  dark:text-gray-400 text-sm mb-6 ${userType === 'driver' ? 'selected text-white' : ''}`}>
                                                Gagnez de l'argent en conduisant, gérez vos horaires librement
                                            </p>
                                            <div className="mt-auto w-full">
                                                <div className={`flex items-center justify-center gap-2 text-blue-600 dark:text-green-400 font-medium ${userType === 'driver' ? 'selected text-green-200' : ''}`}>
                                                    <ChartLine size={16} />
                                                    <span>Avantages chauffeur</span>
                                                </div>
                                                <ul className={`text-xs text-gray-500 dark:text-gray-400 space-y-2 mt-3 ${userType === 'driver' ? 'selected text-white' : ''} 
                                                    `}>
                                                    <li className="flex items-center">
                                                        <CheckCircle className="text-green-500 mr-2" size={12} />
                                                        Revenus garantis
                                                    </li>
                                                    <li className="flex items-center">
                                                        <CheckCircle className="text-green-500 mr-2" size={12} />
                                                        Horaires flexibles
                                                    </li>
                                                    <li className="flex items-center">
                                                        <CheckCircle className="text-green-500 mr-2" size={12} />
                                                        Assistance technique
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <input type="hidden" id="userType" value={userType} />

                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="gradientMix"
                                            size="lg"
                                            onClick={handleNextStep}
                                            icon={<ArrowRight size={20} />}
                                        >
                                            Continuer
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Étape 2: Informations */}
                            {currentStep === 2 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vos informations</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8">Renseignez vos coordonnées pour créer votre compte</p>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>

                                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="firstName">
                                                    Prénom
                                                </label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen-start/50 focus:border-transparent transition-all"
                                                    placeholder="Votre prénom"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="lastName">
                                                    Nom
                                                </label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen-start/50 focus:border-transparent transition-all"
                                                    placeholder="Votre nom de famille"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="phone">
                                                Numéro de téléphone
                                            </label>
                                            <div className="flex">
                                                <span className="inline-flex items-center px-4 border-2 border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-l-lg font-medium">
                                                    +225
                                                </span>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-r-xl border-2 border-l-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen-start/50 focus:border-transparent transition-all"
                                                    placeholder="XX XX XX XX"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="email">
                                                Adresse email (optionnel)
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen-start/50 focus:border-transparent transition-all"
                                                placeholder="votre@email.com"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="password">
                                                    Mot de passe
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen-start/50 focus:border-transparent transition-all"
                                                        placeholder="Minimum 8 caractères"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs font-medium" style={{ color: passwordStrength.color }}>
                                                        {passwordStrength.message}
                                                    </span>
                                                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full transition-all duration-300"
                                                            style={{
                                                                width: `${passwordStrength.score * 25}%`,
                                                                backgroundColor: passwordStrength.color
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium" htmlFor="confirmPassword">
                                                    Confirmer le mot de passe
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen-start/50 focus:border-transparent transition-all"
                                                        placeholder="Retapez votre mot de passe"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                    </button>
                                                </div>
                                                {formData.confirmPassword && (
                                                    <div className="flex items-center gap-1 mt-2">
                                                        {isPasswordMatch() ? (
                                                            <>
                                                                <CheckCircle className="text-green-500" size={14} />
                                                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                                    Les mots de passe correspondent
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle className="text-red-500" size={14} />
                                                                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                                    Les mots de passe ne correspondent pas
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-8">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            onClick={handlePrevStep}
                                            icon={<ArrowLeft size={20} />}
                                        >
                                            Retour
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="gradientMix"
                                            size="lg"
                                            onClick={handleNextStep}
                                            icon={<ArrowRight size={20} />}
                                        >
                                            Continuer
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Étape 3: Vérification */}
                            {currentStep === 3 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vérification</h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                                        Nous avons envoyé un code à 6 chiffres à votre numéro
                                    </p>

                                    <div className="text-center mb-8">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10 flex items-center justify-center mx-auto mb-6 shadow-lg">
                                            <Shield className="text-green-600 dark:text-green-400 text-3xl" />
                                        </div>
                                        <p id="verification-phone-display" className="font-bold text-gray-900 dark:text-white text-lg">
                                            +225 {formData.phone}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                            Code valide pendant{' '}
                                            <span id="timer" className="font-bold text-green-600 dark:text-green-400">
                                                {otpTimer}
                                            </span>{' '}
                                            secondes
                                        </p>
                                    </div>

                                    <div className="flex justify-center items-center gap-2 mb-8">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <React.Fragment key={index}>
                                                <input
                                                    type="text"
                                                    maxLength="1"
                                                    value={formData.otp[index]}
                                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                                    onFocus={() => setActiveOtpIndex(index)}
                                                    className={`w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all ${formData.otp[index]
                                                        ? 'border-primaryGreen-start bg-green-50 dark:bg-green-900/20'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                        } ${activeOtpIndex === index ? 'ring-2 ring-primaryGreen-start/50' : ''
                                                        }`}
                                                    ref={ref => {
                                                        if (ref && activeOtpIndex === index) {
                                                            ref.focus();
                                                        }
                                                    }}
                                                />
                                                {index === 2 && (
                                                    <span className="h-16 flex items-center text-gray-400 dark:text-gray-500 font-bold text-xl mx-2">
                                                        -
                                                    </span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <div className="text-center mb-8">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Vous n'avez pas reçu le code ?</p>
                                        <button
                                            type="button"
                                            onClick={resendOtp}
                                            disabled={otpTimer > 0}
                                            className={`text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-semibold text-sm transition-colors inline-flex items-center ${otpTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                        >
                                            <RefreshCw className="mr-2" size={16} />
                                            Renvoyer le code
                                        </button>
                                    </div>

                                    <div className="flex items-start mb-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                                        <div className="mr-3">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                checked={formData.termsAccepted}
                                                onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                                                className="hidden"
                                            />
                                            <label htmlFor="terms" className="cursor-pointer">
                                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${formData.termsAccepted
                                                    ? 'bg-primaryGreen-start border-primaryGreen-start'
                                                    : 'border-gray-300 dark:border-gray-600'
                                                    }`}>
                                                    {formData.termsAccepted && <Check className="text-white" size={14} />}
                                                </div>
                                            </label>
                                        </div>
                                        <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 flex-1 cursor-pointer">
                                            J'accepte les{' '}
                                            <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-semibold">
                                                Conditions d'utilisation
                                            </a>{' '}
                                            et la{' '}
                                            <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-semibold">
                                                Politique de confidentialité
                                            </a>{' '}
                                            de Taka Taka
                                        </label>
                                    </div>

                                    <div className="flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            onClick={handlePrevStep}
                                            icon={<ArrowLeft size={20} />}
                                        >
                                            Retour
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="gradientMix"
                                            size="lg"
                                            onClick={handleSubmit}
                                            icon={isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                            isLoading={isSubmitting}
                                        >
                                            {isSubmitting ? 'Création en cours...' : 'Créer mon compte'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Liens */}
                        <div className="text-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-gray-600 dark:text-gray-400">
                                Vous avez déjà un compte ?
                                {/* <button
                                    type="button"
                                    onClick={onSwitch}
                                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-semibold ml-2"
                                >
                                    Se connecter
                                </button> */}

                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inscription;