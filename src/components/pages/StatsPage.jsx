import React from 'react';
import { motion } from 'framer-motion';

const StatsPage = ({ stats, t, fleet }) => {
  const total = fleet.length || 1;
  const idle = fleet.filter(c => c.status === 'idle').length;
  const busy = fleet.length - idle;
  const ecoC  = fleet.filter(c => c.tariff === 'economy').length;
  const comfC = fleet.filter(c => c.tariff === 'comfort').length;
  const bizC  = fleet.filter(c => c.tariff === 'business').length;

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">📊 {t.stats}</h1>
      </div>

      <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: t.total_orders, val: stats.tripsCompleted, cls: 'y' },
          { label: t.income_today, val: `${stats.totalEarnings.toLocaleString()} ${t.som}`, cls: 'g' },
          { label: t.active_fleet, val: fleet.length, cls: 'b' },
        ].map((s, i) => (

          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="sc-label">{s.label}</div>
            <div className={`sc-val ${s.cls}`}>{s.val}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="bar-section">
          <h3>{t.active_fleet}</h3>

          {[
            { label: t.free, val: idle, max: total, color: 'var(--y-green)' },
            { label: t.busy, val: busy, max: total, color: 'var(--y-yellow)' },
          ].map((b, i) => (
            <div key={i} className="bar-item">
              <div className="bar-item-head"><span>{b.label}</span><span>{b.val} / {total}</span></div>
              <div className="bar-track">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(b.val / b.max) * 100}%` }} transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                  className="bar-fill" style={{ background: b.color }} />
              </div>
            </div>
          ))}
        </div>
        <div className="bar-section">
          <h3>{t.tariff_split}</h3>

          {[
            { label: t.economy, val: ecoC, color: 'var(--y-green)' },
            { label: t.comfort, val: comfC, color: 'var(--y-orange)' },
            { label: t.business, val: bizC, color: 'var(--y-blue)' },
          ].map((b, i) => (
            <div key={i} className="bar-item">
              <div className="bar-item-head"><span>{b.label}</span><span>{b.val} / {total}</span></div>
              <div className="bar-track">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(b.val / total) * 100}%` }} transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                  className="bar-fill" style={{ background: b.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default StatsPage;
