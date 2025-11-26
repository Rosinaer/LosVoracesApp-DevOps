const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  magazineId: { type: String, required: true, unique: true },  
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  issn: { type: String, required: true },  
  number: { type: Number, required: true, min: 1 },
  section: { type: String, required: true },
  date: { type: Date, required: true },
  stock: { type: Number, default: 0, min: 0 },
  issueNumber: { type: Number, required: true, min: 1 },
});

module.exports = mongoose.model("Magazine", magazineSchema);