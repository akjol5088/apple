import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Wifi, WifiOff, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from '../components/MapView';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

// Sub-components
const OrderCard = ({ order, onAccept, onReject, t }) => (
  <motion.div
    layout
    initial={{ x: 20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
    transition={{ duration: 0.2 }}
    className="order-card"
  >
    <div className="order-head">
      <div className="customer-info">
        <div className="c-name">{order.customerName}</div>
        <div className="c-phone">{order.phone}</div>
      </div>
      <div className="order-price">{order.price} {t.som}</div>
    </div>

    <div className={`tariff-pill ${order.tariff}`}>{
      order.tariff === 'economy' ? `🟢 ${t.economy}` :
      order.tariff === 'comfort' ? `🟡 ${t.comfort}` : `🔵 ${t.business}`
    }</div>

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
      📏 {order.distance} км • ⏱ ~{Math.round(order.distance * 2.5)} мин
    </div>

    <div className="order-btns">
      <button className="btn-accept" onClick={() => onAccept(order._id)}>
        <CheckCircle size={14} strokeWidth={2.5} />
        {t.accept}
      </button>
      <button className="btn-reject" onClick={() => onReject(order._id)}>
        <XCircle size={14} strokeWidth={2.5} />
      </button>
    </div>
  </motion.div>
);


const DashboardPage = ({ t }) => {
  const { drivers, orders, stats, connected, acceptOrder, cancelOrder } = useSocket();
  const { user, logout } = useAuth();
  const [filterIdle, setFilterIdle] = useState(false);

  const handleAccept = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    // Find nearest idle driver
    const idleDrivers = drivers.filter(d => d.status === 'idle');
    if (idleDrivers.length === 0) {
      alert(t.no_free_cars);
      return;
    }
    let nearest = idleDrivers[0];
    let minDist = Infinity;


    idleDrivers.forEach(d => {
      const dist = Math.sqrt((d.lat - order.fromLat) ** 2 + (d.lng - order.fromLng) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = d;
      }
    });

    acceptOrder(orderId, nearest._id);
  };


  const idleCount   = drivers.filter(d => d.status === 'idle').length;
  const busyCount   = drivers.filter(d => d.status === 'on_trip').length;
  const totalEarned = stats.totalEarnings;


  const pendingOrders = orders.filter(o => o.status === 'pending');
  
  return (
    <div className="dash-layout">
      {/* MAP */}
      <div className="map-wrapper">
        <MapView drivers={drivers} orders={orders} filterIdle={filterIdle} />


        {/* Overlay top bar */}
        <div className="map-top">
          <div className="map-chip">
            {connected
              ? <><Wifi size={12} color="#34C759" /> {t.live} · {drivers.length} {t.car}</>
              : <><WifiOff size={12} color="#aeaeb2" /> {t.connecting}</>
            }
          </div>
          <div className="map-chip">
            <span style={{ color: '#34C759', fontWeight: 800 }}>●</span>
            {t.free}: {idleCount}
            <span style={{ margin: '0 4px', color: '#aeaeb2' }}>·</span>
            <span style={{ color: '#FF9500', fontWeight: 800 }}>●</span>
            {t.busy}: {busyCount}
          </div>
          <button
            className={`map-chip filter-toggle ${filterIdle ? 'on' : ''}`}
            onClick={() => setFilterIdle(f => !f)}
          >
            <Filter size={11} />
            {filterIdle ? t.only_free : t.all}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        {/* Fleet strip */}
        <div className="panel-section">
          <div className="panel-title">{t.active_fleet}</div>
          <div className="fleet-scroll">
            {drivers.map(d => (
              <div key={d._id} className="fleet-chip">
                <div className="fc-num">{d.plate}</div>
                <div className="fc-car">{d.car}</div>
                <div className={`fc-st ${d.status}`}>
                  {d.status === 'idle' ? `● ${t.free}` : d.status === 'on_trip' ? `● ${t.busy}` : '○ Offline'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="orders-scroll">
          <div className="panel-title">
            {t.new_orders}
            {orders.length > 0 && (
              <span style={{ marginLeft: 6, background: '#FFD60A', color: '#000', borderRadius: 6, padding: '1px 7px', fontSize: '0.6rem', fontWeight: 900 }}>
                {orders.length}
              </span>
            )}
          </div>

          <AnimatePresence mode="popLayout">
            {pendingOrders.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
                <Clock size={40} strokeWidth={1} color="var(--text-3)" />
                <p>{t.no_orders}</p>
              </motion.div>
            ) : (
              pendingOrders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onAccept={handleAccept}
                  onReject={cancelOrder}
                  t={t}
                />

              ))
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};


export default DashboardPage;
