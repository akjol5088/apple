import React, { useState } from 'react';
import { Star, Fuel } from 'lucide-react';
import { motion } from 'framer-motion';

const FleetPage = ({ fleet, t }) => {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'economy', 'comfort', 'business'];
  const filtered = fleet.filter(c => filter === 'all' || c.tariff === filter);

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">🚗 {t.fleet}</h1>
        <div className="filter-row">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-pill ${filter === f ? 'on' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? t.all : t[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-cards">
        {filtered.map((car, i) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            className={`car-card ${car.tariff}`}
          >
            <div className="car-card-head">
              <span className="car-number">{car.number}</span>
              <span className={`car-status ${car.status === 'idle' ? 'idle' : 'trip'}`}>
                {car.status === 'idle' ? t.free : t.busy}
              </span>
            </div>

            <div className="car-model">{car.model}</div>

            <div className="car-meta">
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--y-text-3)' }}>
                <Star size={11} color="#FFD700" fill="#FFD700" />
                <span style={{ color: 'var(--y-text-2)', fontWeight: 700 }}>{car.rating}</span>
                <span style={{ marginLeft: 6 }}>{car.driver}</span>
              </div>
              <div className="fuel-bar-wrap">
                <label>{car.fuel}%</label>
                <div className="fuel-bar">
                  <div
                    className="fuel-bar-fill"
                    style={{
                      width: `${car.fuel}%`,
                      background: car.fuel > 30 ? 'var(--y-green)' : 'var(--y-red)'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <span className={`tariff-tag ${car.tariff}`}>{t[car.tariff]}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default FleetPage;
