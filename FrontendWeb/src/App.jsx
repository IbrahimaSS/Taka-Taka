import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AdminApp from './pages/AdminApp';

import PublicProviders from './PublicProviders';
import HomePage from './pages/HomePage';
// import LoginPage from './apps/public/pages/LoginPage';
import ChauffeurApp from './pages/ChauffeurApp';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Passenger from './pages/Passager';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="rounded-2xl surface p-8 text-center shadow-soft">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">404</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Page introuvable.</p>
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

          {/* Passager */}
          <Route path="/passager/*" element={<Passenger />} />

          {/* Compat anciens liens */}
          <Route path="/passagers" element={<Navigate to="/passager" replace />} />
          <Route path="/passagers/*" element={<Navigate to="/passager" replace />} />

          {/* Chauffeur */}
          <Route path="/chauffeur/*" element={<ChauffeurApp />} />

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
