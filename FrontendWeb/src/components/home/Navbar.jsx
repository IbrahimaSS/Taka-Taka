import React, { useState } from 'react';
import { Car, Download, Menu, X, LogIn } from 'lucide-react';
import Button from '../../ui/Buttons';
import { ThemeToggle } from '../../ui/ThemeToggle';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'passagers', label: 'Passagers' },
    { id: 'chauffeurs', label: 'Chauffeurs' },
    { id: 'fonctionnalites', label: 'Fonctionnalités' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className="fixed top-0 right-0 h-16 w-full bg-white dark:bg-gray-800 shadow-lg z-50 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo et titre */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <Car className="w-8 h-8 text-blue-500" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">TAKATAKA</h1>
              <p className="text-gray-500 dark:text-gray-500 text-sm">Mobilité Intelligente</p>
            </div>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Badge Dark Mode */}
          <ThemeToggle />

          {/* Boutons Connexion et Télécharger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/connexion')}
              className="hidden md:flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition duration-300"
            >
              <LogIn size={20} />
              <span>Connexion</span>
            </button>

            <Button
              variant="gradientMix"
              size="md"
              onClick={() => scrollToSection('telecharger')}
              icon={<Download size={20} />}
            >
              Télécharger
            </Button>

            {/* Menu Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:hidden mt-4 pb-4 flex-col space-y-3`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300 text-left"
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/inscription');
            }}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-300"
          >
            <LogIn size={20} />
            <span>Connexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
