import React from 'react';
import { LayoutDashboard, TrendingUp, CreditCard, PieChart, Languages } from 'lucide-react';

const KPICard = ({ label, value, icon, color }) => (
  <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ fontSize: '0.65rem', color: '#666', fontWeight: '800', letterSpacing: '0.5px' }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: color || '#fff' }}>{value}</span>
      {icon}
    </div>
  </div>
);

const Header = ({ lang, setLang, t, stats }) => {
  const languages = ['EN', 'RU', 'KG', 'TR', 'UZ'];

  return (
    <header className="header">
      <div className="stats-header" style={{ display: 'flex', gap: '2rem' }}>
        <KPICard label={t.total_orders} value={stats.tripsCompleted} />
        <KPICard label={t.active_orders} value={stats.activeDrivers} color="var(--yandex-yellow)" />
        <KPICard label={t.income_today} value={`${stats.totalEarnings} c`} color="#22c55e" />
        <KPICard label={t.free_cars_pct} value="82%" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="lang-selector">
          {languages.map(code => (
            <button 
              key={code}
              className={`lang-btn ${lang.toUpperCase() === code ? 'active' : ''}`}
              onClick={() => setLang(code.toLowerCase())}
            >
              {code}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800' }}>Admin Osh</div>
            <div style={{ fontSize: '0.6rem', color: '#666' }}>ID: 045-ADMIN</div>
          </div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333' }} />
        </div>
      </div>
    </header>
  );
};

export default Header;
