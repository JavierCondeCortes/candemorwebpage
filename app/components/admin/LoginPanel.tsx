'use client';

import { useState } from 'react';

interface LoginPanelProps {
  onLogin: (success: boolean) => void;
}

export function LoginPanel({ onLogin }: LoginPanelProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        onLogin(true);
      } else {
        setError(data.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-panel">
      <div className="login-container">
        <h1>⚙️ Administrador</h1>
        <p style={{ textAlign: 'center', color: '#9D4EDD', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Panel de Control
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Accediendo...' : '🔓 Acceder'}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}
