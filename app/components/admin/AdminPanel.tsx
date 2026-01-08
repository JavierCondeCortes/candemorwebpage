'use client';

import { useState, useEffect } from 'react';
import './admin.css';
import { LoginPanel } from './LoginPanel';
import { AdminDashboard } from './AdminDashboard';

export function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [config, setConfig] = useState(null);

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadConfig();
    }
  }, [isLoggedIn]);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  return (
    <div className="admin-container">
      {!isLoggedIn ? (
        <LoginPanel onLogin={handleLogin} />
      ) : (
        <AdminDashboard config={config} setConfig={setConfig} onLogout={() => setIsLoggedIn(false)} />
      )}
    </div>
  );
}
