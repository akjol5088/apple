const mongoose = require('mongoose');

/**
 * Order model.
 */
const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone:        { type: String },
  fromAddress:  { type: String, required: true },
  toAddress:    { type: String, required: true },
  // Coordinates
  fromLat:   { type: Number },
  fromLng:   { type: Number },
  toLat:     { type: Number },
  toLng:     { type: Number },
  distance:  { type: Number, default: 0 },  // km
  price:     { type: Number, default: 0 },  // som
  tariff:    { type: String, enum: ['economy','comfort','business'], default: 'economy' },
  status:    { type: String, enum: ['pending','accepted','on_way','completed','cancelled'], default: 'pending' },
  driver:    { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
