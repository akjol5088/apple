const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * Disable buffering so queries fail immediately if not connected
 * (allows in-memory demo mode to kick in instantly).
 */
mongoose.set('bufferCommands', false); // ← KEY FIX: no more 10s timeout

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000, // fail fast
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn('⚠️  MongoDB жок — demo режим иштейт (маалымат памятта сакталат)');
  }
};

module.exports = connectDB;

