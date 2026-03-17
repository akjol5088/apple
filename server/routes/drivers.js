const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const auth = require('../middleware/auth');

// In-memory demo drivers (used if MongoDB unavailable)
let demoDrivers = [
  { _id: 'd1', name: 'Акжол Мамытов', phone: '+996 700 111 222', car: 'Toyota Camry v75', plate: '01 045 OSH', tariff: 'comfort',  status: 'idle',    rating: 4.9, lat: 40.514, lng: 72.815 },
  { _id: 'd2', name: 'Ислам Садыков',  phone: '+996 705 333 444', car: 'Hyundai Sonata',     plate: '01 777 AGH', tariff: 'comfort',  status: 'idle',    rating: 4.7, lat: 40.520, lng: 72.825 },
  { _id: 'd3', name: 'Бахтияр Нуров',  phone: '+996 777 555 666', car: 'Chevrolet Cobalt',   plate: '01 112 OSH', tariff: 'economy',  status: 'idle',    rating: 4.6, lat: 40.508, lng: 72.818 },
  { _id: 'd4', name: 'Нурмат Карибаев',phone: '+996 500 777 888', car: 'Kia Optima K5',       plate: '01 255 AGH', tariff: 'comfort',  status: 'idle',    rating: 4.8, lat: 40.517, lng: 72.808 },
  { _id: 'd5', name: 'Тимур Расулов',  phone: '+996 222 999 000', car: 'Mercedes E-Class',   plate: '01 001 VIP', tariff: 'business', status: 'idle',    rating: 5.0, lat: 40.512, lng: 72.805 },
  { _id: 'd6', name: 'Руслан Хасанов', phone: '+996 555 100 200', car: 'BMW 5 Series G30',   plate: '01 007 BSS', tariff: 'business', status: 'idle',    rating: 5.0, lat: 40.525, lng: 72.820 },
  { _id: 'd7', name: 'Жаныбек Токтор', phone: '+996 550 300 400', car: 'Daewoo Nexia 3',     plate: '01 389 OSH', tariff: 'economy',  status: 'idle',    rating: 4.5, lat: 40.523, lng: 72.835 },
  { _id: 'd8', name: 'Болот Эрматов',  phone: '+996 999 500 600', car: 'Toyota Prius 30',    plate: '01 445 KAR', tariff: 'economy',  status: 'idle',    rating: 4.8, lat: 40.510, lng: 72.798 },
  { _id: 'd9', name: 'Кубат Осмонов',  phone: '+996 708 222 333', car: 'Volkswagen Passat',  plate: '01 567 ADG', tariff: 'comfort',  status: 'idle',    rating: 4.9, lat: 40.530, lng: 72.810 },
  { _id: 'd10', name: 'Эркин Марат',   phone: '+996 770 444 555', car: 'Land Rover Vogue',   plate: '01 888 RRR', tariff: 'business', status: 'idle',    rating: 5.0, lat: 40.505, lng: 72.840 },
  { _id: 'd11', name: 'Адилет Сапаров', phone: '+996 551 112 334', car: 'Skoda Superb',       plate: '01 999 SKD', tariff: 'comfort',  status: 'idle',    rating: 4.7, lat: 40.515, lng: 72.790 },
  { _id: 'd12', name: 'Максат Кадыров', phone: '+996 702 998 776', car: 'Lada Vesta',         plate: '01 432 ABC', tariff: 'economy',  status: 'idle',    rating: 4.4, lat: 40.525, lng: 72.800 },
];


const isConnected = () => require('mongoose').connection.readyState === 1;

// GET all drivers
router.get('/', auth, async (req, res) => {
  try {
    if (isConnected()) {
      const drivers = await Driver.find();
      return res.json(drivers);
    }
    res.json(demoDrivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET driver by ID
router.get('/:id', auth, async (req, res) => {
  try {
    if (isConnected()) {
      const d = await Driver.findById(req.params.id);
      if (!d) return res.status(404).json({ message: 'Not found' });
      return res.json(d);
    }
    const d = demoDrivers.find(x => x._id === req.params.id);
    d ? res.json(d) : res.status(404).json({ message: 'Not found' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create driver
router.post('/', auth, async (req, res) => {
  try {
    if (isConnected()) {
      const d = await Driver.create(req.body);
      return res.status(201).json(d);
    }
    const d = { _id: `d${Date.now()}`, ...req.body };
    demoDrivers.push(d);
    res.status(201).json(d);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update driver
router.patch('/:id', auth, async (req, res) => {
  try {
    if (isConnected()) {
      const d = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(d);
    }
    demoDrivers = demoDrivers.map(x => x._id === req.params.id ? { ...x, ...req.body } : x);
    res.json(demoDrivers.find(x => x._id === req.params.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router, getDemoDrivers: () => demoDrivers, setDemoDrivers: (d) => { demoDrivers = d; } };
