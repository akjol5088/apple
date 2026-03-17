import React from 'react';
import { motion } from 'framer-motion';

const FinancePage = ({ stats, t, fleet }) => {
  const ecoE = Math.round(stats.totalEarnings * 0.5);
  const comfE = Math.round(stats.totalEarnings * 0.3);
  const bizE = stats.totalEarnings - ecoE - comfE;

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">💰 {t.finance}</h1>
      </div>

      <div className="stat-grid">
        {[
          { label: t.income_today, val: `${stats.totalEarnings.toLocaleString()} ${t.som}`, cls: 'g' },
          { label: t.total_orders, val: stats.tripsCompleted, cls: 'y' },
          { label: t.active_orders, val: fleet.filter(c => c.status !== 'idle').length, cls: 'b' },
        ].map((s, i) => (

          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="sc-label">{s.label}</div>
            <div className={`sc-val ${s.cls}`}>{s.val}</div>
          </motion.div>
        ))}
      </div>

      <div className="bar-section">
        <h3>{t.tariff_split}</h3>

        {[
          { label: t.economy, val: ecoE, max: stats.totalEarnings || 1, color: 'var(--y-green)' },
          { label: t.comfort, val: comfE, max: stats.totalEarnings || 1, color: 'var(--y-orange)' },
          { label: t.business, val: bizE, max: stats.totalEarnings || 1, color: 'var(--y-blue)' },
        ].map((b, i) => (
          <div key={i} className="bar-item">
            <div className="bar-item-head">
              <span>{b.label}</span>
              <span>{b.val.toLocaleString()} {t.som}</span>
            </div>

            <div className="bar-track">
              <motion.div initial={{ width: 0 }} animate={{ width: `${(b.val / b.max) * 100}%` }} transition={{ duration: 1, delay: 0.2 }}
                className="bar-fill" style={{ background: b.color }} />
            </div>
          </div>
        ))}

        <div style={{ marginTop: '1.5rem' }}>
          {[
            { label: t.total_orders, val: stats.tripsCompleted },
          ].map((r, i) => (
            <div key={i} className="finance-row">
              <span className="fr-label">{r.label}</span>
              <span className="fr-val">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FinancePage;
