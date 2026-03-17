import React from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersPage = ({ orders, onAccept, t }) => {
  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">📋 {t.orders}</h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--y-text-3)', fontWeight: 700 }}>
          {orders.length} {t.active_orders.toLowerCase()}
        </span>
      </div>

      <div className="grid-cards">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--y-text-3)', fontSize: '0.9rem' }}>
              {t.no_orders}
            </div>
          ) : orders.map((order, i) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.04 }}
              className="order-card"
              style={{ marginBottom: 0 }}
            >
              <div className="order-card-top">
                <span className={`tariff-tag ${order.tariff}`}>{t[order.tariff]}</span>
                <span className="order-price">{order.price} c</span>
              </div>
              <div className="order-route">
                <div className="order-route-row from">
                  <span className="dot" /><span className="addr">Ош базары / Рынок Ош</span>
                </div>
                <div className="order-route-row to">
                  <span className="dot" /><span className="addr">ул. Навои 45/2</span>
                </div>
              </div>
              <div className="order-meta">
                <span>{order.dist} km</span><span>·</span><span>ETA 7 {t.minutes}</span>
              </div>
              <div className="order-btns">
                <button className="btn-assign" onClick={() => onAccept(order)}>
                  <Check size={14} strokeWidth={3} />{t.assign}
                </button>
                <button className="btn-reject"><X size={14} strokeWidth={3} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default OrdersPage;
