const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// In-memory demo orders
let demoOrders = [];

const isConnected = () => require('mongoose').connection.readyState === 1;

// GET all orders
router.get('/', auth, async (req, res) => {
  try {
    if (isConnected()) {
      const orders = await Order.find().populate('driver').sort('-createdAt');
      return res.json(orders);
    }
    res.json(demoOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create order
router.post('/', auth, async (req, res) => {
  try {
    if (isConnected()) {
      const order = await Order.create(req.body);
      return res.status(201).json(order);
    }
    const order = { _id: `o${Date.now()}`, ...req.body, status: 'pending', createdAt: new Date().toISOString() };
    demoOrders.unshift(order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH update order status (accept/cancel)
router.patch('/:id', auth, async (req, res) => {
  try {
    if (isConnected()) {
      const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.json(order);
    }
    demoOrders = demoOrders.map(o => o._id === req.params.id ? { ...o, ...req.body } : o);
    res.json(demoOrders.find(o => o._id === req.params.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET stats
router.get('/stats/today', auth, async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    if (isConnected()) {
      const total   = await Order.countDocuments({ createdAt: { $gte: today } });
      const done    = await Order.countDocuments({ status: 'completed', createdAt: { $gte: today } });
      const earning = await Order.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$price' } } }
      ]);
      return res.json({ totalOrders: total, completedOrders: done, earnings: earning[0]?.total || 0 });
    }
    const completed = demoOrders.filter(o => o.status === 'completed');
    res.json({
      totalOrders: demoOrders.length,
      completedOrders: completed.length,
      earnings: completed.reduce((s, o) => s + (o.price || 0), 0)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router, getDemoOrders: () => demoOrders, addDemoOrder: (o) => demoOrders.unshift(o) };
