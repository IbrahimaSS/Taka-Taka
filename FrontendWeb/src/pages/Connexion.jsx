import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ArrowLeft, 
  Check,
  Loader2,
  Users,
  Star,
  Shield,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageSquare
} from 'lucide-react';
import Button from '../ui/Buttons';
import { useNavigate } from 'react-router-dom';

const Connexion = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check for remembered login
    const rememberedLogin = localStorage.getItem('rememberLogin');
    const savedPhone = localStorage.getItem('userPhone');
    
    if (rememberedLogin === 'true') {
      setRememberMe(true);
      if (savedPhone) {
        setFormData(prev => ({ ...prev, phone: savedPhone }));
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.phone || !formData.password) {
      alert('❌ Veuillez remplir tous les champs');
      return;
    }

    // Phone/Email validation
    const phoneRegex = /^(\d{9}|\d{3} \d{3} \d{3})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!phoneRegex.test(formData.phone.replace(/\s/g, '')) && !emailRegex.test(formData.phone)) {
      alert('❌ Format invalide. Utilisez 9 chiffres ou une adresse email valide');
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      alert('❌ Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Start loading
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);

      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberLogin', 'true');
        localStorage.setItem('userPhone', formData.phone);
      } else {
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('userPhone');
      }

      // Show success and redirect
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 800);
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    alert(` Connexion avec ${provider} (simulation)`);
  };

  const stats = [
    { value: '50K+', label: 'Utilisateurs actifs', icon: Users, color: 'text-green-300' },
    { value: '4.8★', label: 'Satisfaction', icon: Star, color: 'text-yellow-300' },
    { value: '98%', label: 'Taux de réussite', icon: Shield, color: 'text-green-300' },
    { value: '24/7', label: 'Support', icon: Clock, color: 'text-blue-300' }
  ];

  const getButtonIcon = () => {
    if (isLoading) {
      return <Loader2 className="animate-spin" size={20} />;
    }
    if (loginSuccess) {
      return <Check size={20} />;
    }
    return <LogIn size={20} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen">
        {/* Left Panel: Brand & Information */}
        <div className="hidden md:flex md:w-1/2 bg-blue-800 relative overflow-hidden">
          {/* Floating decorative elements */}
          <div className="absolute w-64 h-64 bg-white/10 rounded-full -top-32 -left-32 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-primaryGreen-start/20 rounded-full -bottom-48 -right-48"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-primaryBlue-start/10 to-primaryGreen-start/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 p-12 flex flex-col justify-between text-white w-full">
            {/* Logo & Brand */}
            <div>
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Car className="text-white" size={32} />
                </div>
                <div className='flex item-center gap-10'>
                  <div>
                    <h1 className="text-3xl font-bold">TAKA TAKA</h1>
                  <p className="text-blue-100 text-lg">Mobilité Intelligente</p>
                  </div>
                   {/* Back to Home */}
                <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                  <a 
                    href="/"
                    className="inline-flex items-center text-gray-200 hover:text-green- dark:hover:text-gray-300 text-sm transition-colors group"
                  >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={16} />
                    Retour à l'accueil
                  </a>
                </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="mb-8 max-w-lg">
                <h2 className="text-4xl font-bold mb-6 leading-tight">Bienvenue !</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Connectez-vous pour accéder à vos trajets, suivre vos courses et profiter de nos services
                  exclusifs de mobilité urbaine.
                </p>

              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                        <stat.icon size={20} />
                      </div>
                      <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                    <p className="text-blue-100 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            {/* <div className="border-t border-white/20 pt-8">
              <div className="flex items-start space-x-3">
                <MessageSquare className="text-white/60 mt-1" size={20} />
                <div>
                  <p className="text-lg text-blue-100 italic mb-2">
                    "Service rapide, fiable et abordable. Ma solution de transport préférée !"
                  </p>
                  <p className="text-green-300 font-medium">— Amadou D., Utilisateur depuis 2021</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryBlue-start to-primaryGreen-end flex items-center justify-center shadow-lg">
                  <Car className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">TAKA TAKA</h1>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Mobilité Intelligente</p>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="dark:bg-gray-800 rounded-3xl  p-8">
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Se connecter</h2>
                <p className="text-gray-600 dark:text-gray-400">Accédez à votre compte Taka Taka</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                {/* Phone/Email Input */}
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Numéro de téléphone / Adresse Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen-start/50 focus:border-transparent transition-all"
                      placeholder="xxx xxx xxx / example@gmail.com"
                      required
                    />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                    Entrez votre numéro de téléphone (9 chiffres) ou votre adresse email
                  </p>
                </div>

                {/* Password Input */}
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-gray-400" size={20} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primaryGreen-start/50 focus:border-transparent transition-all"
                      placeholder="Votre mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                    Le mot de passe doit contenir au moins 6 caractères
                  </p>
                </div>

                {/* Remember & Forgot */}
                <div className="flex justify-between items-center mb-8">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="hidden"
                      />
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                        ${rememberMe 
                          ? 'bg-primaryGreen-start border-primaryGreen-start shadow-inner' 
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-primaryGreen-start'
                        }
                      `}>
                        {rememberMe && <Check className="text-white" size={14} />}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                      Se souvenir de moi
                    </span>
                  </label>
                  <a 
                    href="/forgot-password" 
                    className="text-sm font-medium text-primaryBlue-start hover:text-primaryBlue-end transition-colors hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant={loginSuccess ? "secondary" : "gradientMix"}
                  size="lg"
                  fullWidth
                  icon={getButtonIcon()}
                  isLoading={isLoading}
                  className={loginSuccess ? '!bg-gradient-to-r !from-green-500 !to-green-600' : ''}
                >
                  {isLoading ? 'Connexion...' : loginSuccess ? 'Connecté !' : 'Se connecter'}
                </Button>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 text-sm font-medium">
                      Ou continuer avec
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center space-x-3 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Google</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="flex items-center justify-center space-x-3 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Facebook</span>
                  </button>
                </div>

                {/* Signup Links */}
                <div className="text-center mb-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Nouveau sur Taka Taka ?
                    <button
                      onClick={() => navigate('/inscription')}
                      className="font-bold text-primaryGreen-start hover:text-primaryGreen-end ml-2 transition-colors hover:underline"
                    >
                      Créer un compte
                    </button>
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => navigate('/admin')}
                      className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-400 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all hover:-translate-y-0.5 hover:shadow-sm text-sm font-medium"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold">Passager</span>
                        <span className="text-xs opacity-75 mt-1">Réserver des trajets</span>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate('/chauffeur')}
                      className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 text-blue-700 dark:text-blue-400 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 transition-all hover:-translate-y-0.5 hover:shadow-sm text-sm font-medium"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold">Chauffeur</span>
                        <span className="text-xs opacity-75 mt-1">Offrir des trajets</span>
                      </div>
                    </button>
                  </div>
                </div>

               
              </form>
            </div>

            {/* Social Links & Copyright */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;