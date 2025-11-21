const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true, unique: true },  
  title: { type: String },
  isbn: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  author: { type: String, required: true },
  publisherHouse: { type: String, required: true },
  section: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  literaryGenre: { type: String, required: true }
});


module.exports = mongoose.model('Book', bookSchema);