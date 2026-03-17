import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const DriversPage = ({ fleet, t }) => {
  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">👤 {t.drivers}</h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--y-text-3)', fontWeight: 700 }}>
          {fleet.length} {t.drivers.toLowerCase()}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '680px' }}>
        {fleet.map((car, i) => (
          <motion.div
            key={car._id}

            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="driver-card"
          >
            <div className="driver-avatar">{car.name[0]}</div>
            <div className="driver-info">
              <div className="driver-name">{car.name}</div>
              <div className="driver-sub">{car.car} · {car.plate}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span className={`tariff-tag ${car.tariff}`}>{t[car.tariff]}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Star size={11} color="#FFD700" fill="#FFD700" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--y-yellow)' }}>{car.rating}</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: car.status === 'idle' ? 'var(--y-green)' : 'var(--y-yellow)', fontWeight: 700 }}>
                {car.status === 'idle' ? t.free : t.busy}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default DriversPage;
