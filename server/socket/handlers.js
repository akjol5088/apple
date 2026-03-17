/**
 * Socket.io event handlers for real-time features:
 * - Car movement simulation
 * - New order broadcasting
 * - Driver status updates
 */

// Simulation of all Kyrgyzstan regions
const REGIONS = {
  Osh:         { lat: 40.5133, lng: 72.8161 },
  Bishkek:     { lat: 42.8746, lng: 74.5698 },
  ZhalalAbad:  { lat: 40.9333, lng: 72.9833 },
  Uzgen:       { lat: 40.7667, lng: 73.3000 },
  Naryn:       { lat: 41.4287, lng: 75.9911 },
  IssykKul:    { lat: 42.4782, lng: 78.3956 },
  Batken:      { lat: 40.0625, lng: 70.8194 },
  Talas:       { lat: 42.5228, lng: 72.2427 }
};

const CITY_CENTER = REGIONS.Osh;
const driverPositions = {};

let totalEarnings = 0;
let tripsCompleted = 0;

const randomOffset = (spread = 0.04) => (Math.random() - 0.5) * spread;


// Movement speed varies for highway simulation (0.001 to 0.008)
const moveTowards = (current, target, speed) => {
  const dLat = target.lat - current.lat;
  const dLng = target.lng - current.lng;
  const dist = Math.sqrt(dLat ** 2 + dLng ** 2);
  if (dist < speed) return target;
  return {
    lat: current.lat + (dLat / dist) * speed,
    lng: current.lng + (dLng / dist) * speed,
  };
};


const axios = require('axios');

async function getRoute(start, end) {
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    const response = await axios.get(url, { timeout: 3500 });
    if (response.data.routes && response.data.routes[0]) {
      const coords = response.data.routes[0].geometry.coordinates.map(c => ({ lng: c[0], lat: c[1] }));
      return coords;
    }
  } catch (err) { }
  return []; // DO NOT return straight line
}


module.exports = (io, driversRoute, ordersRoute) => {
  const { getDemoDrivers, setDemoDrivers } = driversRoute;
  const { getDemoOrders, addDemoOrder } = ordersRoute;

  getDemoDrivers().forEach(d => {
    driverPositions[d._id] = { lat: d.lat, lng: d.lng, target: null, path: [], pathIndex: 0 };
  });

  // Movement loop
  setInterval(() => {
    const drivers = getDemoDrivers();
    const orders = getDemoOrders();
    
    drivers.forEach(d => {
      if (!driverPositions[d._id]) {
        driverPositions[d._id] = { lat: d.lat, lng: d.lng, target: null, task: 'idle', path: [], pathIndex: 0 };
      }
    });

    const updated = drivers.map(driver => {
      const pos = driverPositions[driver._id];
      if (!pos || driver.status === 'offline') return driver;

      // 1. Move along path if it exists
      if (pos.path && pos.path.length > 0 && pos.pathIndex < pos.path.length) {
        const targetPoint = pos.path[pos.pathIndex];
        const speed = driver.status === 'on_trip' 
          ? (pos.task === 'pickup' ? 0.0028 : 0.0023) 
          : 0.0009; 
        
        const newPos = moveTowards(pos, targetPoint, speed);
        const dLat = newPos.lat - targetPoint.lat;
        const dLng = newPos.lng - targetPoint.lng;
        if (Math.sqrt(dLat*dLat + dLng*dLng) < 0.00015) pos.pathIndex++;
        
        driverPositions[driver._id] = { ...pos, ...newPos };
        return { ...driver, lat: newPos.lat, lng: newPos.lng };

      }

      // 2. Path finished logic
      if (pos.path && pos.path.length > 0 && pos.pathIndex >= pos.path.length) {
        if (driver.status === 'on_trip') {
          const order = orders.find(o => o._id === driver.activeOrderId);
          if (pos.task === 'pickup' && order) {
            pos.task = 'dropoff';
            pos.path = []; pos.pathIndex = 0;
            order.status = 'picked_up';
            io.emit('order:update', order);
          } else {
            driver.status = 'idle';
            driver.activeOrderId = null;
            pos.task = 'idle';
            pos.path = []; pos.pathIndex = 0;
            if (order) {
              order.status = 'completed';
              io.emit('order:update', order);
            }
          }
        } else {
          // Roaming finished
          pos.task = 'idle';
          pos.path = []; pos.pathIndex = 0;
        }
        return driver;
      }

      // 3. If idle/no path, pick new target to trigger fetcher
      if (pos.task === 'idle' || !pos.target) {
        const regionNames = Object.keys(REGIONS);
        const targetRegion = REGIONS[regionNames[Math.floor(Math.random() * regionNames.length)]];
        pos.target = {
          lat: targetRegion.lat + (Math.random()-0.5)*0.02,
          lng: targetRegion.lng + (Math.random()-0.5)*0.02,
        };
        pos.task = 'roaming_setup';
      }

      
      return driver;
    });


    setDemoDrivers(updated);
    io.emit('drivers:update', updated);
  }, 100);

  // Background Path Fetcher (OSRM API) - STAGGERED to avoid rate limits
  let driverToFetchIndex = 0;
  setInterval(async () => {
    const drivers = getDemoDrivers();
    const orders = getDemoOrders();
    if (drivers.length === 0) return;

    // Fetch for one driver at a time to stay under demo API rate limits
    driverToFetchIndex = (driverToFetchIndex + 1) % drivers.length;
    const d = drivers[driverToFetchIndex];
    if (!d || d.status === 'offline') return;

    const pos = driverPositions[d._id];
    if (!pos) return;

    // 1. Mission Path
    if (d.status === 'on_trip' && d.activeOrderId) {
      const order = orders.find(o => o._id === d.activeOrderId);
      if (order && (!pos.path || pos.path.length === 0)) {
        const targetCoords = pos.task === 'pickup' 
          ? { lat: order.fromLat, lng: order.fromLng }
          : { lat: order.toLat, lng: order.toLng };
        
        const roadPath = await getRoute(pos, targetCoords);
        if (roadPath && roadPath.length > 0) {
          pos.path = roadPath;
          pos.pathIndex = 0;
        } else {
          // Fallback if API fails: direct movement but marked so we don't block
          pos.path = [pos, targetCoords];
          pos.pathIndex = 0;
        }
      }
    } 
    // 2. Roaming Path
    else if (pos.task === 'roaming_setup' && pos.target) {
      const roadPath = await getRoute(pos, pos.target);
      if (roadPath && roadPath.length > 0) {
        pos.path = roadPath;
        pos.pathIndex = 0;
        pos.task = 'roaming';
      } else {
        // API failed? Roam direct to keep movement alive
        pos.path = [pos, pos.target];
        pos.pathIndex = 0;
        pos.task = 'roaming';
      }
    }
  }, 250); // Faster checks, but one-by-one






  // ─── Auto-generate random orders every 6 seconds ───
  const TARIFFS = { economy: { base: 80, perKm: 18 }, comfort: { base: 200, perKm: 38 }, business: { base: 500, perKm: 100 } };
  const ADDRESSES = [
    'Ош', 'Узген', 'Жалал-Абад', 'Бишкек', 'Кара-Суу', 'Нарын', 'Чолпон-Ата', 'Каракол', 'Баткен', 'Талас', 
    'Көк-Жаңгак', 'Кара-Балта', 'Токмок', 'Сүлүктү', 'Кызыл-Кыя', 'Араван', 'Гүлчө'
  ];
  const NAMES = ['Айбек', 'Гүлнара', 'Нурбек', 'Жылдыз', 'Канат', 'Назгүл', 'Тимур', 'Айгүл', 'Мирбек', 'Зарина'];


  setInterval(() => {
    const currentOrders = getDemoOrders().filter(o => o.status === 'pending');
    if (currentOrders.length >= 15) return; // Increased limit

    const tariff = ['economy','comfort','business'][Math.floor(Math.random() * 3)];
    const dist = parseFloat((Math.random() * 6 + 1).toFixed(1));
    const price = Math.round(TARIFFS[tariff].base + dist * TARIFFS[tariff].perKm);
    const from = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)];
    const to = ADDRESSES.filter(a => a !== from)[Math.floor(Math.random() * (ADDRESSES.length - 1))];

    const order = {
      _id: `o${Date.now()}`,
      customerName: NAMES[Math.floor(Math.random() * NAMES.length)],
      phone: `+996 7${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)}`,
      fromAddress: from,
      toAddress: to,
      fromLat: CITY_CENTER.lat + randomOffset(),
      fromLng: CITY_CENTER.lng + randomOffset(),
      toLat: CITY_CENTER.lat + randomOffset(),
      toLng: CITY_CENTER.lng + randomOffset(),
      distance: dist,
      price,
      tariff,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addDemoOrder(order);
    io.emit('order:new', order);
  }, 3000);



  // ─── Client events ───
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Send current state on connect
    socket.emit('drivers:update', getDemoDrivers());
    socket.emit('orders:current', getDemoOrders().filter(o => o.status === 'pending'));
    socket.emit('stats:update', { totalEarnings, tripsCompleted });

    // Admin accepts an order
    socket.on('order:accept', ({ orderId, driverId }) => {
      const orders = getDemoOrders();
      const order = orders.find(o => o._id === orderId);
      const drivers = getDemoDrivers();
      const driver = drivers.find(d => d._id === driverId);

      if (order && driver && driver.status === 'idle') {
        order.status = 'accepted';
        order.driverId = driverId;
        
        driver.status = 'on_trip';
        driver.activeOrderId = orderId;
        if (driverPositions[driverId]) {
          driverPositions[driverId].task = 'pickup';
          driverPositions[driverId].speed = 0.0022; // Very fast to pickup
          driverPositions[driverId].target = { lat: order.fromLat, lng: order.fromLng };
        }



        // Add to finance
        totalEarnings += order.price;
        tripsCompleted += 1;
        
        io.emit('order:update', order);
        io.emit('drivers:update', drivers);
        io.emit('orders:current', getDemoOrders().filter(o => o.status === 'pending'));
        io.emit('stats:update', { totalEarnings, tripsCompleted });
      }
    });


    // Admin cancels an order
    socket.on('order:cancel', ({ orderId }) => {
      const orders = getDemoOrders();
      const order = orders.find(o => o._id === orderId);
      if (order) {
        order.status = 'cancelled';
        io.emit('order:update', order);
        io.emit('orders:current', getDemoOrders().filter(o => o.status === 'pending'));
      }
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
