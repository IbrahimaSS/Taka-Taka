import React, { useState } from 'react';
import Connexion from './Connexion';
import Inscription from './Inscription';

function LoginPage() {
  const [mode, setMode] = useState('inscription'); // 'connexion' | 'inscription'

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
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
