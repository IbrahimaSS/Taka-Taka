import React from 'react';
import { Link } from 'react-router-dom';

export default function ChauffeurProfile() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-800">Profil Chauffeur</h1>
        <p className="text-gray-600 mt-2">Cette page est un placeholder. Tu pourras y brancher les vraies données du chauffeur (infos, documents, etc.).</p>

        <div className="mt-6">
          <Link
            to="/chauffeur"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
