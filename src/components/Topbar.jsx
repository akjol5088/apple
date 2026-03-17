import React from 'react';

const Topbar = ({ lang, setLang, t, stats }) => {
  const langs = ['EN', 'RU', 'KG', 'TR', 'UZ'];

  return (
    <header className="topbar">
      <div className="topbar-brand">
        OSH <span>TAXI</span> PARK
      </div>

      <div className="topbar-divider" />

      <div className="kpi-row">
        <div className="kpi-item">
          <span className="kpi-label">{t.total_orders}</span>
          <span className="kpi-val">{stats.tripsCompleted}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">{t.active_orders}</span>
          <span className="kpi-val yellow">{stats.activeDrivers}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">{t.income_today}</span>
          <span className="kpi-val green">{stats.totalEarnings.toLocaleString()} c</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">{t.free_cars_pct}</span>
          <span className="kpi-val blue">82%</span>
        </div>
      </div>

      <div className="topbar-right">
        <div className="lang-pill">
          {langs.map(l => (
            <button
              key={l}
              className={lang.toUpperCase() === l ? 'on' : ''}
              onClick={() => setLang(l.toLowerCase())}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="avatar">AD</div>
      </div>
    </header>
  );
};

export default Topbar;
