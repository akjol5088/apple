const mongoose = require('mongoose');

/**
 * Driver (taxi) model.
 */
const DriverSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  car:     { type: String, required: true },   // Model e.g. "Toyota Camry"
  plate:   { type: String, required: true },   // Number plate
  tariff:  { type: String, enum: ['economy','comfort','business'], default: 'economy' },
  status:  { type: String, enum: ['idle','on_trip','offline'], default: 'idle' },
  rating:  { type: Number, default: 5.0 },
  // Current GPS position
  lat:     { type: Number, default: 40.5133 },
  lng:     { type: Number, default: 72.8161 },
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);
