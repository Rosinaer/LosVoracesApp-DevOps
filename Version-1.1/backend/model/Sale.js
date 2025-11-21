const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  saleId: { type: String, required: true, unique: true },  
  product: { type: String },
  date: { type: Date, required: true },
  description: { type: String,  default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }, 
  quantityProduct: { type: Number, required: true, min: 1 },
  total: { type: Number, required: true }
});

module.exports = mongoose.model('Sale', saleSchema);