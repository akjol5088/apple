import React from 'react';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrdersPage = ({ orders, onAccept, t }) => {
  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">📋 {t.orders}</h1>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 700 }}>
          {pendingOrders.length} {t.active_orders.toLowerCase()}
        </span>
      </div>

      <div className="card-grid">
        <AnimatePresence mode="popLayout">
          {pendingOrders.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-3)', fontSize: '0.9rem' }}>
              {t.no_orders}
            </div>
          ) : pendingOrders.map((order, i) => (
            <motion.div
              key={order._id || order.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="order-card"
              style={{ marginBottom: 0 }}
            >
              <div className="order-head">
                <div className="customer-info">
                  <div className="c-name">{order.customerName}</div>
                  <div className="c-phone">{order.phone}</div>
                </div>
                <div className="order-price">{order.price} {t.som}</div>
              </div>

              <div className={`tariff-pill ${order.tariff}`}>{t[order.tariff]}</div>

              <div className="order-route">
                <div className="route-row from">
                  <span className="dot" />
                  <span>{order.fromAddress}</span>
                </div>
                <div className="route-row to">
                  <span className="dot" />
                  <span>{order.toAddress}</span>
                </div>
              </div>

              <div className="order-meta">
                📏 {order.distance} км • ⏱ ~{Math.round(order.distance * 2.5)} {t.minutes}
              </div>

              <div className="order-btns">
                <button className="btn-accept" onClick={() => onAccept(order)}>
                  <Check size={14} strokeWidth={3} />
                  {t.accept}
                </button>
                <button className="btn-reject" style={{ padding: '10px' }}>
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default OrdersPage;
