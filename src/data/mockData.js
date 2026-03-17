// Osh City Center: [40.5133, 72.8161]
export const CITY_CENTER = [40.5133, 72.8161];

export const initialFleet = [
  // --- ECONOMY ---
  {
    id: 'eco-1', model: 'Hyundai Sonata', number: '045 OSH',
    tariff: 'economy', status: 'idle',
    pos: [40.514, 72.815], driver: 'Акжол М.', rating: 4.9, image: '/src/assets/economy.png', fuel: 85
  },
  {
    id: 'eco-2', model: 'Toyota Prius', number: '777 AGH',
    tariff: 'economy', status: 'idle',
    pos: [40.520, 72.825], driver: 'Ислам С.', rating: 4.7, image: '/src/assets/economy.png', fuel: 42
  },
  {
    id: 'eco-3', model: 'Chevrolet Cobalt', number: '112 OSH',
    tariff: 'economy', status: 'idle',
    pos: [40.508, 72.818], driver: 'Жаныбек Т.', rating: 4.6, image: '/src/assets/economy.png', fuel: 70
  },
  {
    id: 'eco-4', model: 'Hyundai Accent', number: '255 AGH',
    tariff: 'economy', status: 'idle',
    pos: [40.517, 72.808], driver: 'Нурмат К.', rating: 4.8, image: '/src/assets/economy.png', fuel: 55
  },
  {
    id: 'eco-5', model: 'Daewoo Nexia', number: '389 OSH',
    tariff: 'economy', status: 'idle',
    pos: [40.523, 72.835], driver: 'Болот Э.', rating: 4.5, image: '/src/assets/economy.png', fuel: 30
  },
  // --- COMFORT ---
  {
    id: 'comf-1', model: 'Toyota Camry', number: '101 OSH',
    tariff: 'comfort', status: 'idle',
    pos: [40.510, 72.830], driver: 'Бахтияр Н.', rating: 5.0, image: '/src/assets/comfort.png', fuel: 95
  },
  {
    id: 'comf-2', model: 'Hyundai Sonata', number: '202 VIP',
    tariff: 'comfort', status: 'idle',
    pos: [40.518, 72.810], driver: 'Азиз Р.', rating: 4.9, image: '/src/assets/comfort.png', fuel: 80
  },
  {
    id: 'comf-3', model: 'Kia Optima', number: '303 LUX',
    tariff: 'comfort', status: 'idle',
    pos: [40.507, 72.825], driver: 'Санжар О.', rating: 4.8, image: '/src/assets/comfort.png', fuel: 65
  },
  // --- BUSINESS ---
  {
    id: 'biz-1', model: 'Mercedes E-Class', number: '001 VIP',
    tariff: 'business', status: 'idle',
    pos: [40.512, 72.805], driver: 'Тимур Р.', rating: 5.0, image: '/src/assets/business.png', fuel: 60
  },
  {
    id: 'biz-2', model: 'BMW 5 Series', number: '007 BOSS',
    tariff: 'business', status: 'idle',
    pos: [40.525, 72.820], driver: 'Руслан Х.', rating: 5.0, image: '/src/assets/business.png', fuel: 88
  },
  {
    id: 'biz-3', model: 'Toyota Camry 3.5', number: '999 GOLD',
    tariff: 'business', status: 'idle',
    pos: [40.519, 72.800], driver: 'Шерзод А.', rating: 4.9, image: '/src/assets/business.png', fuel: 75
  },
];

export const TARIFFS = {
  economy: { base: 80, perKm: 18, color: '#22c55e' },
  comfort: { base: 200, perKm: 38, color: '#f59e0b' },
  business: { base: 500, perKm: 100, color: '#3b82f6' }
};
