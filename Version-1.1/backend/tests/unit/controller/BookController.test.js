// Tests unitarios para el controlador BookController
const BookController = require('../../../controller/BookController');
const Book = require('../../../model/Book');

// Se mockean las dependencias externas para aislar el controlador
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
      Book.find.mockResolvedValue(books);

      await BookController.getBooks(req, res);

      expect(Book.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(books);
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores y el status 500
      Book.find.mockRejectedValue(new Error('fail'));

      await BookController.getBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para crear libros
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
      
      const mockBook = { 
        ...req.body, 
        bookId: '1',
        save: jest.fn().mockResolvedValue()
      };
      Book.mockImplementation(() => mockBook);

      // Mock Date.now para control de ID
      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await BookController.createBook(req, res);

      expect(Book).toHaveBeenCalledWith({
        bookId: '1',
        title: req.body.title,
        isbn: req.body.isbn,
        price: req.body.price,
        author: req.body.author,
        publisherHouse: req.body.publisherHouse,
        section: req.body.section,
        stock: req.body.stock,
        literaryGenre: req.body.literaryGenre
      });
      expect(mockBook.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBook);

      // Restaurar Date.now
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
      // Verifica el manejo de errores interno
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
      
      const mockBook = { 
        save: jest.fn().mockRejectedValue(new Error('fail'))
      };
      Book.mockImplementation(() => mockBook);

      await BookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });
});
