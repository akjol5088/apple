import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SERVER = 'http://localhost:5000';

const LoginPage = () => {
  const { login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const url = mode === 'login' ? `${SERVER}/api/auth/login` : `${SERVER}/api/auth/register`;
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const { data } = await axios.post(url, payload);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Туташуу катасы. Серверди текшериңиз.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true); setError('');
    try {
      const { data } = await axios.post(`${SERVER}/api/auth/demo-login`);
      login(data);
    } catch {
      // Offline fallback
      login({ name: 'Admin Demo', email: 'demo@oshtaxi.kg', token: 'demo_offline' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-decor" style={{ width: 500, height: 500, top: -150, right: -100 }} />
      <div className="login-decor" style={{ width: 280, height: 280, bottom: -80, left: -60 }} />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🚕</div>
          <div className="login-logo-text">
            <h1>Osh Taxi Park</h1>
            <p>Диспетчер панели · {mode === 'login' ? 'Кирүү' : 'Каттоо'}</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'var(--surface-2)', borderRadius: 10, padding: 3, marginBottom: '1.25rem', gap: 3 }}>
          {[
            { id: 'login',    label: '🔑 Кирүү (Login)' },
            { id: 'register', label: '📝 Катталуу (Register)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setMode(tab.id); setError(''); }}
              style={{
                flex: 1, padding: '9px', border: 'none', borderRadius: 8,
                fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                transition: 'all 0.15s',
                background: mode === tab.id ? 'var(--surface)' : 'transparent',
                color: mode === tab.id ? 'var(--text)' : 'var(--text-3)',
                boxShadow: mode === tab.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name field — only for register */}
          {mode === 'register' && (
            <div className="form-group">
              <label>Аты-жөнүңүз</label>
              <input
                type="text"
                placeholder="Мисалы: Акжол Мамытов"
                value={form.name}
                onChange={update('name')}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={update('email')}
              required
            />
          </div>

          <div className="form-group">
            <label>Сырсөз</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={update('password')}
              required
              minLength={6}
            />
            {mode === 'register' && (
              <p style={{ fontSize: '0.65rem', color: 'var(--text-3)', marginTop: 4 }}>
                Кеминде 6 символ болсун
              </p>
            )}
          </div>

          {error && (
            <div style={{ fontSize: '0.75rem', color: 'var(--red)', background: 'var(--red-bg)', padding: '8px 12px', borderRadius: 8, marginBottom: '0.75rem' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Жүктөлүүдө...' : mode === 'login' ? '→ Кирүү' : '✓ Катталуу'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0.75rem 0', color: 'var(--text-3)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>же</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <button className="btn-demo" onClick={handleDemo} disabled={loading}>
          🎭 Demo режимде кирүү (аккаунтсуз)
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.65rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
          {mode === 'login'
            ? 'Аккаунтуңуз жокпу? Жогоруда "Катталуу" баскычын басыңыз'
            : 'Катталгансызбы? "Кирүү" баскычын басыңыз'}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
