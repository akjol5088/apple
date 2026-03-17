import React from 'react';

const SettingsPage = ({ t, lang, setLang }) => {
  const langs = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' },
    { code: 'kg', label: 'Кыргызча' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'uz', label: "O'zbekcha" },
  ];

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">⚙️ {t.settings}</h1>
      </div>

      <div style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'var(--y-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--y-border)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--y-text-3)', marginBottom: '1rem' }}>
            {t.lang_select}
          </div>
          <div className="filter-row" style={{ flexWrap: 'wrap' }}>
            {langs.map(l => (
              <button key={l.code} className={`filter-pill ${lang === l.code ? 'on' : ''}`} onClick={() => setLang(l.code)}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--y-card)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--y-border)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--y-text-3)', marginBottom: '1rem' }}>
            {t.about_system}
          </div>
          <div style={{ color: 'var(--y-text-2)', fontSize: '0.85rem', lineHeight: 1.8 }}>
            <b style={{ color: 'var(--y-text)' }}>Osh Taxi Park</b> — {t.dashboard}<br />
            {t.version} 2.1 · Март 2026<br />
            {t.tech_stack}: React 18, Leaflet, Framer Motion
          </div>
        </div>

      </div>
    </main>
  );
};

export default SettingsPage;
