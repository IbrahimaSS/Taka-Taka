import React, { useState } from 'react';
import Connexion from './Connexion';
import Inscription from './Inscription';

function LoginPage() {
  const [mode, setMode] = useState('inscription'); // 'connexion' | 'inscription'

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {mode === 'inscription' ? (
        <Connexion onSwitch={() => setMode('inscription')} />
      ) : (
        <Inscription onSwitch={() => setMode('connexion')} />
        
      )}

      <Inscription/>
    </div>
  );
}

export default LoginPage;
