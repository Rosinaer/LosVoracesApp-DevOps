const path = require('path');
const { readJSON, writeJSON } = require('../model/Database');
const Book = require('../model/Book');

const filePath = path.join(__dirname, '../data/Book.json');

async function getBooks(req, res) {
    try {
        const data = await readJSON(filePath);
        res.json(data);
    } catch (error) {
        console.error('getBooks error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}

async function createBook(req, res) {
    try {
        const { title, isbn, price, author, publisherHouse, section, stock, literaryGenre } = req.body;

        if (!title || !isbn || !price || !author) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const data = await readJSON(filePath);

        const bookId = Date.now().toString();
        const newBook = new Book(bookId, title, isbn, price, author, publisherHouse, section, stock, literaryGenre);
        data.push(newBook);


        await writeJSON(filePath, data);
        res.status(201).json(newBook);
    } catch (error) {
        console.error('createBook error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function updateBook(req, res) {
    const { id } = req.params;
    const { title, isbn, price, author, publisherHouse, section, stock, literaryGenre } = req.body;

    const data = await readJSON(filePath);
    const index = data.findIndex(p => p.bookId === id);
    if (index === -1) return res.status(404).json({ error: 'Libro no encontrado' });

    data[index].title = title;
    data[index].author = author;
    data[index].isbn = isbn;
    data[index].price = price;
    data[index].publisherHouse = publisherHouse;
    data[index].section = section;
    data[index].stock = stock;
    data[index].literaryGenre = literaryGenre;

    await writeJSON(filePath, data);
    res.json(data[index]);
}

async function deleteBook(req, res) {
    const { id } = req.params;
    const data = await readJSON(filePath);

    const updated = data.filter(p => p.bookId !== id);
    await writeJSON(filePath, updated);

    res.json({ message: 'Libro eliminado' });
}

async function renderCatalog(req, res) {
    try {
        const books = await readJSON(filePath);
        res.render('BookCatalog', { books });
    } catch (err) {
        console.error('Error al renderizar el catalogo de libros', err);
        res.status(500).send('Error al cargar el catálogo de libros');
    }
}

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook,
    renderCatalog
};
