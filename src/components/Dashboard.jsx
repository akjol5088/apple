import React from 'react';
import { Check, X, Clock, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from './MapView';
import { TARIFFS } from '../data/mockData';

const Dashboard = ({ fleet, orders, t, onAccept }) => {
  const idleCount = fleet.filter(c => c.status === 'idle').length;

  return (
    <div className="main-area dash-grid">
      {/* MAP */}
      <div className="map-area">
        <MapView fleet={fleet} orders={orders} t={t} />

        {/* Map overlay */}
        <div className="map-overlay-top">
          <div className="map-pill">
            <Wifi size={12} color="#22c55e" />
            <span style={{ color: '#fff', fontSize: '0.72rem' }}>Live · {fleet.length} машина</span>
          </div>
          <div className="map-pill">
            <span style={{ color: '#8E8E93' }}>{t.free}:</span>
            <span style={{ color: '#1DB954', fontWeight: '800' }}>{idleCount}</span>
            <span style={{ color: '#8E8E93', margin: '0 4px' }}>·</span>
            <span style={{ color: '#8E8E93' }}>{t.busy}:</span>
            <span style={{ color: '#FFD700', fontWeight: '800' }}>{fleet.length - idleCount}</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        {/* Fleet strip */}
        <div className="fleet-strip">
          <div className="fleet-strip-title">{t.active_fleet}</div>
          <div className="fleet-cars">
            {fleet.map(car => (
              <div key={car.id} className="fleet-car-chip">
                <span className="cn">{car.number}</span>
                <span className="cm">{car.model}</span>
                <span className={`cs ${car.status === 'idle' ? 'idle' : 'trip'}`}>
                  {car.status === 'idle' ? t.free : t.busy}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="orders-area">
          <div className="orders-title">{t.new_requests} {orders.length > 0 && `· ${orders.length}`}</div>

          <AnimatePresence mode="popLayout">
            {orders.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-orders"
              >
                <Clock size={40} strokeWidth={1} />
                <p>{t.no_orders}</p>
              </motion.div>
            ) : (
              orders.map(order => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                  className="order-card"
                >
                  <div className="order-card-top">
                    <span className={`tariff-tag ${order.tariff}`}>{t[order.tariff]}</span>
                    <span className="order-price">{order.price} c</span>
                  </div>

                  <div className="order-route">
                    <div className="order-route-row from">
                      <span className="dot" />
                      <span className="addr">Ош базары / Рынок Ош</span>
                    </div>
                    <div className="order-route-row to">
                      <span className="dot" />
                      <span className="addr">ул. Навои 45/2</span>
                    </div>
                  </div>

                  <div className="order-meta">
                    <span>{order.dist} km</span>
                    <span>·</span>
                    <span>ETA 7 {t.minutes}</span>
                  </div>

                  <div className="order-btns">
                    <button className="btn-assign" onClick={() => onAccept(order)}>
                      <Check size={14} strokeWidth={3} />
                      {t.assign}
                    </button>
                    <button className="btn-reject">
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
