import { useState, useEffect, useCallback } from 'react';
import { initialFleet, TARIFFS, CITY_CENTER } from '../data/mockData';

export function useSimulator() {
  const [fleet, setFleet] = useState(initialFleet);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    tripsCompleted: 0,
    activeDrivers: initialFleet.length,
    rating: 4.8
  });

  const getRandomLoc = (center, offset = 0.05) => [
    center[0] + (Math.random() - 0.5) * offset,
    center[1] + (Math.random() - 0.5) * offset
  ];

  const moveTowards = (current, target, speed = 0.0003) => {
    const dLat = target[0] - current[0];
    const dLng = target[1] - current[1];
    const distance = Math.sqrt(dLat * dLat + dLng * dLng);
    if (distance < speed * 2) return target;
    
    return [
      current[0] + (dLat / distance) * speed,
      current[1] + (dLng / distance) * speed
    ];
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (orders.length < 4 && Math.random() > 0.6) {
        const tariffKeys = Object.keys(TARIFFS);
        const tariff = tariffKeys[Math.floor(Math.random() * tariffKeys.length)];
        const pickup = getRandomLoc(CITY_CENTER, 0.04);
        const destination = getRandomLoc(CITY_CENTER, 0.04);
        const dist = parseFloat((Math.random() * 5 + 1).toFixed(1));
        const price = Math.round(TARIFFS[tariff].base + dist * TARIFFS[tariff].perKm);

        const newOrder = {
          id: `osh-ord-${Date.now()}`,
          pickup,
          destination,
          dist,
          price,
          tariff,
          status: 'pending'
        };
        setOrders(prev => [...prev, newOrder]);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [orders]);

  useEffect(() => {
    const simTimer = setInterval(() => {
      setFleet(prevFleet => prevFleet.map(car => {
        if (!car.currentOrder) return car;

        const { currentOrder } = car;
        let newPos = [...car.pos];
        let newStatus = car.status;

        if (car.status === 'en-route') {
          newPos = moveTowards(car.pos, currentOrder.pickup, 0.0006);
          if (newPos[0] === currentOrder.pickup[0] && newPos[1] === currentOrder.pickup[1]) {
            newStatus = 'on-trip';
          }
        } else if (car.status === 'on-trip') {
          newPos = moveTowards(car.pos, currentOrder.destination, 0.0006);
          if (newPos[0] === currentOrder.destination[0] && newPos[1] === currentOrder.destination[1]) {
            setStats(s => ({
              ...s,
              totalEarnings: s.totalEarnings + currentOrder.price,
              tripsCompleted: s.tripsCompleted + 1
            }));
            return { ...car, status: 'idle', pos: newPos, currentOrder: null };
          }
        }

        return { ...car, pos: newPos, status: newStatus };
      }));
    }, 150);
    return () => clearInterval(simTimer);
  }, []);

  const handleAcceptOrder = useCallback((order) => {
    setFleet(prev => {
      const idleCars = prev.filter(c => c.status === 'idle');
      const car = idleCars.find(c => c.tariff === order.tariff) || idleCars[0];
      
      if (!car) {
        return prev;
      }

      setOrders(o => o.filter(ord => ord.id !== order.id));
      
      return prev.map(c => 
        c.id === car.id ? { ...c, status: 'en-route', currentOrder: order } : c
      );
    });
  }, [orders]);

  return { fleet, orders, stats, handleAcceptOrder };
}
