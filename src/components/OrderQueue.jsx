import React from 'react';
import { MapPin, Navigation, TrendingDown, X, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderCard = ({ order, onAccept, t, fleet }) => (
  <motion.div 
    layout
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    style={{ 
      background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-dim)', marginBottom: '1rem', position: 'relative'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
      <span className={`badge badge-${order.tariff}`}>{t[order.tariff]}</span>
      <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--yandex-yellow)' }}>{order.price} <span style={{ fontSize: '0.8rem' }}>c</span></div>
    </div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MapPin size={14} color="#facc15" />
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#fff' }}>
          {t.from}: Osh Bazaar / Рынок Ош
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Navigation size={14} color="#aaa" />
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem', color: '#aaa' }}>
          {t.to}: Navoi Street / ул. Навои 45/2
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
       <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: '800' }}>{order.dist} km • {t.eta}: 7 {t.minutes}</div>
    </div>

    <div style={{ display: 'flex', gap: '8px' }}>
      <button 
        className="yandex-btn"
        style={{ flex: 1, padding: '12px', fontSize: '0.85rem' }}
        onClick={() => onAccept(order)}
      >
        {t.assign}
      </button>
      <button 
        style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', 
        padding: '12px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <X size={18} strokeWidth={3} />
      </button>
    </div>
  </motion.div>
);

const OrderQueue = ({ orders, onAccept, t, fleet }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '900', color: '#fff' }}>
        <Clock size={20} color="var(--yandex-yellow)" /> {t.new_requests}
      </h3>
      
      <div className="scroll-area" style={{ flex: 1 }}>
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               style={{ textAlign: 'center', paddingTop: '4rem', color: '#444' }}
            >
              <TrendingDown size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{t.no_orders}</div>
            </motion.div>
          ) : (
            orders.map(order => (
              <OrderCard key={order.id} order={order} onAccept={onAccept} t={t} fleet={fleet} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderQueue;
