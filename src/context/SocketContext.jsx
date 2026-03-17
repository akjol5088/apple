import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [drivers, setDrivers]     = useState([]);
  const [orders, setOrders]       = useState([]);
  const [stats, setStats]         = useState(() => {
    try {
      const saved = localStorage.getItem('taxi_stats');
      return saved ? JSON.parse(saved) : { totalEarnings: 0, tripsCompleted: 0 };
    } catch { return { totalEarnings: 0, tripsCompleted: 0 }; }
  });
  const [connected, setConnected] = useState(false);


  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000', { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('drivers:update', setDrivers);
    socket.on('orders:current', setOrders);
    socket.on('stats:update', (newStats) => {
      setStats(newStats);
      localStorage.setItem('taxi_stats', JSON.stringify(newStats));
    });
    socket.on('order:new', (order) => {

      setOrders(prev => [order, ...prev.filter(o => o._id !== order._id)]);
    });
    socket.on('order:update', (updated) => {
      if (updated.status === 'completed' || updated.status === 'cancelled') {
        setOrders(prev => prev.filter(o => o._id !== updated._id));
      } else {
        setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
      }
    });


    return () => socket.disconnect();
  }, [user]);


  const acceptOrder = useCallback((orderId, driverId) => {
    socketRef.current?.emit('order:accept', { orderId, driverId });
    setOrders(prev => prev.filter(o => o._id !== orderId));
  }, []);


  const cancelOrder = useCallback((orderId) => {
    socketRef.current?.emit('order:cancel', { orderId });
    setOrders(prev => prev.filter(o => o._id !== orderId));
  }, []);

  return (
    <SocketContext.Provider value={{ drivers, orders, stats, connected, acceptOrder, cancelOrder }}>
      {children}
    </SocketContext.Provider>

  );
};

export const useSocket = () => useContext(SocketContext);
