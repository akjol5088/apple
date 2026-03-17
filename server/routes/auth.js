const express   = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');

// In-memory user store (works without MongoDB)
// Pre-seeded with a default admin account
let inMemoryUsers = [
  {
    _id: 'admin001',
    name: 'Admin',
    email: 'admin@oshtaxi.kg',
    passwordHash: '$2a$10$YourHashHere', // will be replaced on first run
    role: 'admin',
  }
];

// Mongoose connection check
const isConnected = () => {
  try { return require('mongoose').connection.readyState === 1; } catch { return false; }
};

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── REGISTER ──────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Бардык талааларды толтуруңуз' });

    if (isConnected()) {
      const User = require('../models/User');
      if (await User.findOne({ email }))
        return res.status(400).json({ message: 'Бул email катталган' });
      const user = await User.create({ name, email, password });
      return res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken({ id: user._id, name: user.name }) });
    }

    // In-memory mode
    if (inMemoryUsers.find(u => u.email === email))
      return res.status(400).json({ message: 'Бул email катталган' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { _id: `u${Date.now()}`, name, email, passwordHash, role: 'admin' };
    inMemoryUsers.push(newUser);

    const token = generateToken({ id: newUser._id, name: newUser.name, email });
    res.status(201).json({ _id: newUser._id, name, email, token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── LOGIN ─────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email жана сырсөз жазыңыз' });

    if (isConnected()) {
      const User = require('../models/User');
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: 'Email же сырсөз туура эмес' });
      return res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken({ id: user._id, name: user.name }) });
    }

    // In-memory mode
    const user = inMemoryUsers.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'Аккаунт табылган жок' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Сырсөз туура эмес' });

    const token = generateToken({ id: user._id, name: user.name, email });
    res.json({ _id: user._id, name: user.name, email, token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DEMO LOGIN ─────────────────────────────
router.post('/demo-login', (req, res) => {
  const demoUser = { id: 'demo', name: 'Admin Demo', email: 'demo@oshtaxi.kg' };
  res.json({ ...demoUser, token: generateToken(demoUser) });
});

module.exports = router;

