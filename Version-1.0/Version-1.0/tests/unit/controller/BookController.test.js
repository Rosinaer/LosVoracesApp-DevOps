// Tests unitarios para el controlador BookController
const BookController = require('../../../controller/BookController');
const Book = require('../../../model/Book');
const db = require('../../../model/Database');

// Se mockean las dependencias externas para aislar el controlador
jest.mock('../../../model/Database');
jest.mock('../../../model/Book');

// Grupo principal de tests para BookController
describe('BookController', () => {
  let req, res;

  // Se ejecuta antes de cada test para inicializar los objetos req y res
  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      render: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // Tests para obtener libros
  describe('getBooks', () => {
    it('should return books as JSON', async () => {
      // Verifica que se devuelvan los libros correctamente en formato JSON
      const books = [{ title: 'Book1' }, { title: 'Book2' }];
      db.readJSON.mockResolvedValue(books);

      await BookController.getBooks(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(books);
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores y el status 500
      db.readJSON.mockRejectedValue(new Error('fail'));

      await BookController.getBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para crear un libro
  describe('createBook', () => {
    it('should create a book and return 201', async () => {
      // Verifica la creación exitosa de un libro
      req.body = {
        title: 'Test Book',
        isbn: '123',
        price: 10,
        author: 'Author',
        publisherHouse: 'House',
        section: 'Section',
        stock: 5,
        literaryGenre: 'Fiction'
      };
      const books = [];
      db.readJSON.mockResolvedValue(books);
      const mockBook = { ...req.body, bookId: '1' };
      Book.mockImplementation(() => mockBook);

      db.writeJSON.mockResolvedValue();

      // Mock Date.now para control de ID
      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await BookController.createBook(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(Book).toHaveBeenCalledWith(
        '1',
        req.body.title,
        req.body.isbn,
        req.body.price,
        req.body.author,
        req.body.publisherHouse,
        req.body.section,
        req.body.stock,
        req.body.literaryGenre
      );
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [mockBook]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBook);

      Date.now = realDateNow;
    });

    it('should return 400 if required fields are missing', async () => {
      // Verifica que se retorne 400 si faltan campos obligatorios
      req.body = { title: '', isbn: '', price: '', author: '' };

      await BookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan campos obligatorios' });
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores inesperados
      req.body = {
        title: 'Test Book',
        isbn: '123',
        price: 10,
        author: 'Author',
        publisherHouse: 'House',
        section: 'Section',
        stock: 5,
        literaryGenre: 'Fiction'
      };
      db.readJSON.mockRejectedValue(new Error('fail'));

      await BookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para actualizar un libro
  describe('updateBook', () => {
    it('should update a book and return it', async () => {
      // Verifica la actualización exitosa de un libro
      req.params.id = '1';
      req.body = {
        title: 'Updated',
        isbn: '123',
        price: 20,
        author: 'Author',
        publisherHouse: 'House',
        section: 'Section',
        stock: 10,
        literaryGenre: 'Fiction'
      };
      const books = [{ bookId: '1', title: 'Old' }];
      db.readJSON.mockResolvedValue(books);
      db.writeJSON.mockResolvedValue();

      await BookController.updateBook(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated' }));
    });

    it('should return 404 if book not found', async () => {
      // Verifica que se retorne 404 si el libro no existe
      req.params.id = '2';
      req.body = {};
      db.readJSON.mockResolvedValue([{ bookId: '1' }]);

      await BookController.updateBook(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Libro no encontrado' });
    });
  });

  // Tests para eliminar un libro
  describe('deleteBook', () => {
    it('should delete a book and return a message', async () => {
      // Verifica la eliminación exitosa de un libro
      req.params.id = '1';
      const books = [{ bookId: '1' }, { bookId: '2' }];
      db.readJSON.mockResolvedValue(books);
      db.writeJSON.mockResolvedValue();

      await BookController.deleteBook(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [{ bookId: '2' }]);
      expect(res.json).toHaveBeenCalledWith({ message: 'Libro eliminado' });
    });
  });

  // Tests para renderizar el catálogo
  describe('renderCatalog', () => {
    it('should render the catalog with books', async () => {
      // Verifica que se renderice el catálogo correctamente
      const books = [{ title: 'Book1' }];
      db.readJSON.mockResolvedValue(books);

      await BookController.renderCatalog(req, res);

      expect(res.render).toHaveBeenCalledWith('BookCatalog', { books });
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores al renderizar el catálogo
      db.readJSON.mockRejectedValue(new Error('fail'));

      await BookController.renderCatalog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al cargar el catálogo de libros');
    });
  });
});