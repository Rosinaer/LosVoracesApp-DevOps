const Book = require("../model/Book.js");
const { updateStock } = require("../model/helpers/stockHelper");
const logger = require("../utils/logger.js");

async function getBooks(req, res) {
  logger.info("GET /book - Inicio de solicitud");
  try {
    const books = await Book.find();
    logger.info(`GET /book - Libros encontrados: ${books.length}`);
    res.json(books);
  } catch (error) {
    logger.error(`GET /book - Error: ${error.message}`);
    //console.error("getBooks error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function createBook(req, res) {
  logger.info("POST /book - Intento de creación de libro");
  try {
    const { title, isbn, price, author, publisherHouse, section, stock, literaryGenre } = req.body;

    if (!title || !isbn || !price || !author) {
      logger.warn("POST /book - Faltan campos obligatorios");
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const bookId = Date.now().toString();
    const newBook = new Book({ bookId, title, isbn, price, author, publisherHouse, section, stock, literaryGenre });

    await newBook.save();
    logger.info(`POST /book - Libro creado con ID=${bookId}`);
    res.status(201).json(newBook);
  } catch (error) {
    logger.error(`POST /book - Error: ${error.message}`);
    //console.error("createBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updateBook(req, res) {
  const { id } = req.params;
  const { title, isbn, price, author, publisherHouse, section, stock, literaryGenre } = req.body;

  logger.info(`PUT /book/${id} - Intento de actualización`);

  try {
    const book = await Book.findOne({ bookId: id });

    if (!book) {
      logger.warn(`PUT /book/${id} - Libro no encontrado`);
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    book.title = title;
    book.isbn = isbn;
    book.price = price;
    book.author = author;
    book.publisherHouse = publisherHouse;
    book.section = section;
    book.stock = stock;
    book.literaryGenre = literaryGenre;

    await book.save();
    logger.info(`PUT /book/${id} - Libro actualizado correctamente`);
    res.json(book);
    
  } catch (error) {
    logger.error(`PUT /book/${id} - Error: ${error.message}`);
    //console.error("updateBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function deleteBook(req, res) {
  const { id } = req.params;

  logger.info(`DELETE /book/${id} - Intento de eliminación`);

  try {
    const book = await Book.findOne({ bookId: id });

    if (!book) {
      logger.warn(`DELETE /book/${id} - Libro no encontrado`);
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    await book.deleteOne();
    logger.info(`DELETE /book/${id} - Libro eliminado`);

    res.json({ message: "Libro eliminado" });
  } catch (error) {
    logger.error(`DELETE /book/${id} - Error: ${error.message}`);
    //console.error("deleteBook error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function renderCatalog(req, res) {
  try {
    const books = await Book.find();
    logger.info("GET /book/catalog - Renderizando catálogo");
    res.render("BookCatalog", { books });
  } catch (error) {
    logger.error(`GET /book/catalog - Error: ${error.message}`);
    //console.error("Error al renderizar el catálogo de libros", error);
    res.status(500).send("Error al cargar el catálogo de libros");
  }
}

async function updateBookStock(req, res) {
  const { id } = req.params;
  const { quantity } = req.body; // cantidad para sumar o restar

  logger.info(`PATCH /book/${id}/stock - Actualización de stock. Cantidad=${quantity}`);

  if (typeof quantity !== 'number') {
    logger.warn(`PATCH /book/${id}/stock - Quantity inválido`);
    return res.status(400).json({ error: 'Quantity debe ser un número' });
  }

  try {
    const book = await Book.findOne({ bookId: id });
    if (!book) {
      logger.warn(`PATCH /book/${id}/stock - Libro no encontrado`);
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    const oldStock = book.stock;
    // Usamos la función updateStock para calcular el nuevo stock
    book.stock = updateStock(book.stock, quantity);

    await book.save();
    logger.info(`PATCH /book/${id}/stock - Stock actualizado: ${oldStock} → ${book.stock}`);
    res.json({ message: 'Stock actualizado', book });
  } catch (error) {
    logger.error(`PATCH /book/${id}/stock - Error: ${error.message}`);
    //console.error("updateBookStock error:", error);
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

