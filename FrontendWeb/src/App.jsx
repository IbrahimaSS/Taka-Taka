import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminApp from './pages/AdminApp';

import PublicProviders from './PublicProviders';
import HomePage from './pages/HomePage';
// import LoginPage from './apps/public/pages/LoginPage';
import ChauffeurDashboard from './pages/ChauffeurDashboard';
import ChauffeurProfile from './components/chauffeur/ChauffeurProfile';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">404</h1>
        <p className="mt-2 text-gray-600">Page introuvable.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC (Accueil + Chauffeur) */}
        <Route element={<PublicProviders />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />

          {/* Chauffeur */}
          <Route path="/chauffeur" element={<ChauffeurDashboard />} />
          <Route path="/chauffeur/profil" element={<ChauffeurProfile />} />

          {/* Compat anciens liens */}
          <Route path="/chauffeurs" element={<Navigate to="/chauffeur" replace />} />
          <Route path="/chauffeurs/*" element={<Navigate to="/chauffeur" replace />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Compat */}
        <Route path="/logout" element={<Navigate to="/admin/logout" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
