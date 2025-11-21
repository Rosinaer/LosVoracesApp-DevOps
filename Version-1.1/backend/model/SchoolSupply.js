const mongoose = require('mongoose');

const schoolSupplySchema = new mongoose.Schema({
  schoolSupplyId: { type: String, required: true, unique: true },  
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  section: { type: String, required: true },
  stock: { type: Number, default: 0 },
  brand: { type: String, required: true },
  description: { type: String }
});


module.exports = mongoose.model('SchoolSupply', schoolSupplySchema);