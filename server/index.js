/**
 * OSH TAXI PARK — Backend Server
 * Node.js + Express + Socket.io + MongoDB
 */

const path = require('path');
// Always load .env from the server directory, no matter where we run from
require('dotenv').config({ path: path.join(__dirname, '.env') });


const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const cors       = require('cors');
const connectDB  = require('./config/db');

// Routes
const authRoute    = require('./routes/auth');
const driversRoute = require('./routes/drivers');
const ordersRoute  = require('./routes/orders');
const socketHandlers = require('./socket/handlers');

// ─── App setup ────────────────────────────
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: true, methods: ['GET','POST','PATCH'] }
});


// ─── Middleware ───────────────────────────
app.use(cors({ origin: true }));

app.use(express.json());

// ─── Routes ───────────────────────────────
app.use('/api/auth',    authRoute);
app.use('/api/drivers', driversRoute.router);
app.use('/api/orders',  ordersRoute.router);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ─── Socket.io ────────────────────────────
socketHandlers(io, driversRoute, ordersRoute);

// ─── Start ────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 For mobile access, use your IP: http://<your-ip>:${PORT}`);
    console.log(`📡 Socket.io ready`);
  });
});
