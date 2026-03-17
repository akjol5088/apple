import React from 'react';
import { Car } from 'lucide-react';
import { motion } from 'framer-motion';

export function FleetList({ fleet }) {
  return (
    <section className="fleet-section glass">
      <h3 className="card-title" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Car size={20} color="var(--accent-blue)" /> Активдүү унаалар
      </h3>
      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.8rem' }}>
        {fleet.map(car => (
          <motion.div 
            key={car.id} 
            layout
            className="car-card"
            style={{ 
              minWidth: '240px', padding: '1.25rem', borderRadius: '20px', background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Status gradient background */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: car.status === 'idle' ? 'var(--tariff-economy)' : car.status === 'on-trip' ? 'var(--accent-blue)' : '#555'
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className={`badge badge-${car.tariff}`}>{car.tariff}</span>
              <span style={{ fontSize: '0.7rem', color: car.status === 'idle' ? '#22c55e' : '#f5a623', fontWeight: '700', textTransform: 'uppercase' }}>
                {car.status}
              </span>
            </div>
            
            <img src={car.image} style={{ width: '100%', height: '100px', objectFit: 'contain', margin: '0.5rem 0', filter: car.status !== 'idle' ? 'grayscale(0.5)' : 'none' }} />
            
            <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{car.model}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{car.number}</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Айдоочу:</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{car.driver}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FleetList;
