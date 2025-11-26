const mongoose = require('mongoose');

const STATUS_TYPES = ['pending', 'confirmed', 'delivered', 'cancelled'];

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  supplierId: { type: String, required: true },
  product: { type: Object, required: true  },
  date: { type: Date, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantityProduct: { type: Number, required: true, min: 1 },
  status: { type: String, enum: STATUS_TYPES, default: 'pending' },
  total: { type: Number, required: true,min: 0,}
});

module.exports = mongoose.model('Order', orderSchema);