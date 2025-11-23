const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  supplierId: { type: String, required: true, unique: true },  
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true }, 
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  category: { type: String, required: true},
  catalog: { type: [Object], default: [] }
});

module.exports = mongoose.model('Supplier', supplierSchema);