const request = require('supertest');
const express = require('express');

// Mock authentication middleware first
jest.mock('../../../middleware/AuthMiddleware', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1, role: 'owner' };
    next();
  },
  authorizeRole: (...roles) => (req, res, next) => next(),
}));

// Mock the controller AFTER mocking middleware
const mockBooks = [{ title: 'Test Book', author: 'Author' }];
const newBook = { title: 'New Book', isbn: '123', price: 10, author: 'Author' };

jest.mock('../../../controller/BookController', () => ({
  getBooks: (req, res) => res.json(mockBooks),
  createBook: (req, res) => res.status(201).json(newBook),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
  renderCatalog: jest.fn((req, res) => res.status(200).send('ok')),
  updateBookStock: jest.fn((req, res) => res.status(200).json({ success: true })),
}));

const BookRoute = require('../../../routes/BookRoute');

const app = express();
app.use(express.json());
app.use('/book', BookRoute);

// Pruebas unitarias para BookRoute
describe('BookRoute', () => {
  // Pruebas para la ruta GET /book
  describe('GET /book', () => {
    // Test: Debe devolver una lista de libros (mockeado)
    it('should return a list of books (mocked)', async () => {
      // Se realiza una petición GET y se verifica la respuesta y el contenido
      const res = await request(app).get('/book');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockBooks);
    });
  });

  // Pruebas para la ruta POST /book
  describe('POST /book', () => {
    // Test: Debe crear un nuevo libro (mockeado)
    it('should create a new book (mocked)', async () => {
      // Se realiza una petición POST y se verifica la respuesta y el contenido
      const res = await request(app).post('/book').send(newBook);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newBook);
    });
  });

  // Pruebas para la ruta GET /book/catalog
  describe('GET /book/catalog', () => {
    // Test: Debe renderizar el catálogo de libros (mockeado)
    it('should render the book catalog (mocked)', async () => {
      // Se simula el renderizado del catálogo y se verifica la respuesta
      const BookController = require('../../../controller/BookController');
      BookController.renderCatalog.mockImplementation((req, res) => res.status(200).send('ok'));
      const res = await request(app).get('/book/catalog');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('ok');
      expect(BookController.renderCatalog).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta PUT /book/:id
  describe('PUT /book/:id', () => {
    // Test: Debe actualizar un libro (mockeado)
    it('should update a book (mocked)', async () => {
      // Se simula la actualización de un libro y se verifica la respuesta
      const BookController = require('../../../controller/BookController');
      BookController.updateBook.mockImplementation((req, res) => res.json({ success: true }));
      const res = await request(app).put('/book/1').send({ title: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(BookController.updateBook).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta DELETE /book/:id
  describe('DELETE /book/:id', () => {
    // Test: Debe eliminar un libro (mockeado)
    it('should delete a book (mocked)', async () => {
      // Se simula la eliminación de un libro y se verifica la respuesta
      const BookController = require('../../../controller/BookController');
      BookController.deleteBook.mockImplementation((req, res) => res.json({ deleted: true }));
      const res = await request(app).delete('/book/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ deleted: true });
      expect(BookController.deleteBook).toHaveBeenCalled();
    });
  });
});