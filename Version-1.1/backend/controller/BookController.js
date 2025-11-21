const Book = require("../model/Book.js");
const { updateStock } = require("../model/helpers/stockHelper");

async function getBooks(req, res) {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("getBooks error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function createBook(req, res) {
  try {
    const { title, isbn, price, author, publisherHouse, section, stock, literaryGenre } = req.body;

    if (!title || !isbn || !price || !author) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const bookId = Date.now().toString();
    const newBook = new Book({ bookId, title, isbn, price, author, publisherHouse, section, stock, literaryGenre });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("createBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updateBook(req, res) {
  const { id } = req.params;
  const { title, isbn, price, author, publisherHouse, section, stock, literaryGenre } = req.body;

  try {
    const book = await Book.findOne({ bookId: id });

    if (!book) return res.status(404).json({ error: "Libro no encontrado" });

    book.title = title;
    book.isbn = isbn;
    book.price = price;
    book.author = author;
    book.publisherHouse = publisherHouse;
    book.section = section;
    book.stock = stock;
    book.literaryGenre = literaryGenre;

    await book.save();
    res.json(book);
    
  } catch (error) {
    console.error("updateBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function deleteBook(req, res) {
  const { id } = req.params;

  try {
    const book = await Book.findOne({ bookId: id });

    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    await book.deleteOne();

    res.json({ message: "Libro eliminado" });
  } catch (error) {
    console.error("deleteBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function renderCatalog(req, res) {
  try {
    const books = await Book.find();
    res.render("BookCatalog", { books });
  } catch (error) {
    console.error("Error al renderizar el catálogo de libros", error);
    res.status(500).send("Error al cargar el catálogo de libros");
  }
}

async function updateBookStock(req, res) {
  const { id } = req.params;
  const { quantity } = req.body; // cantidad para sumar o restar

  if (typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Quantity debe ser un número' });
  }

  try {
    const book = await Book.findOne({ bookId: id });
    if (!book) return res.status(404).json({ error: "Libro no encontrado" });

    // Usamos la función updateStock para calcular el nuevo stock
    book.stock = updateStock(book.stock, quantity);

    await book.save();
    res.json({ message: 'Stock actualizado', book });
  } catch (error) {
    console.error("updateBookStock error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  renderCatalog,
  updateBookStock
};

