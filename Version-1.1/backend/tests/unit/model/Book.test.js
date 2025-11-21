// Tests unitarios para el modelo Book (Mongoose)
const mongoose = require('mongoose');
const Book = require('../../../model/Book');

// Setup para testing sin conexión real a BD
beforeAll(() => {
    // Mock mongoose connection para evitar conexiones reales
    const mockConnection = {
        close: jest.fn(),
        on: jest.fn(),
        once: jest.fn()
    };
    mongoose.connection = mockConnection;
});

// Grupo principal de tests para el modelo Book
describe('Book Model Test', () => {
    // Datos de ejemplo reutilizados en varios tests
    const validBookData = {
        bookId: 'book123',
        title: 'Test Book',
        isbn: '978-3-16-148410-0',
        price: 29.99,
        author: 'Test Author',
        publisherHouse: 'Test Publisher',
        section: 'Fiction',
        stock: 10,
        literaryGenre: 'Novel'
    };

    describe('Book Creation', () => {
        test('should create a valid book instance', () => {
            const book = new Book(validBookData);
            
            expect(book.bookId).toBe(validBookData.bookId);
            expect(book.title).toBe(validBookData.title);
            expect(book.isbn).toBe(validBookData.isbn);
            expect(book.price).toBe(validBookData.price);
            expect(book.author).toBe(validBookData.author);
            expect(book.publisherHouse).toBe(validBookData.publisherHouse);
            expect(book.section).toBe(validBookData.section);
            expect(book.stock).toBe(validBookData.stock);
            expect(book.literaryGenre).toBe(validBookData.literaryGenre);
        });

        test('should have all required properties accessible', () => {
            const book = new Book(validBookData);
            
            expect(book).toHaveProperty('bookId');
            expect(book).toHaveProperty('title');
            expect(book).toHaveProperty('isbn');
            expect(book).toHaveProperty('price');
            expect(book).toHaveProperty('author');
            expect(book).toHaveProperty('publisherHouse');
            expect(book).toHaveProperty('section');
            expect(book).toHaveProperty('stock');
            expect(book).toHaveProperty('literaryGenre');
        });
    });

    describe('Schema Validation', () => {
        test('should fail validation with missing required properties', () => {
            const book = new Book({});
            const validationError = book.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.bookId.kind).toBe('required');
            expect(validationError.errors.isbn.kind).toBe('required');
            expect(validationError.errors.price.kind).toBe('required');
            expect(validationError.errors.author.kind).toBe('required');
            expect(validationError.errors.publisherHouse.kind).toBe('required');
            expect(validationError.errors.section.kind).toBe('required');
            expect(validationError.errors.literaryGenre.kind).toBe('required');
        });

        test('should fail validation with negative price', () => {
            const invalidData = { ...validBookData, price: -10 };
            const book = new Book(invalidData);
            const validationError = book.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.price.kind).toBe('min');
            // el mensaje de error que tira Mongoose es "Path `price` (-10) is less than minimum allowed value (0)."
            expect(validationError.errors.price.message).toMatch(/minimum allowed value/);
        });

        test('should fail validation with negative stock', () => {
            const invalidData = { ...validBookData, stock: -5 };
            const book = new Book(invalidData);
            const validationError = book.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.stock.kind).toBe('min');
            // el mensaje de error que tira Mongoose es "Path `stock` (-5) is less than minimum allowed value (0)."
            expect(validationError.errors.stock.message).toMatch(/minimum allowed value/);
        });

        test('should pass validation with valid data', () => {
            const book = new Book(validBookData);
            const validationError = book.validateSync();
            
            expect(validationError).toBeUndefined();
        });

        test('should default stock to 0 if not provided', () => {
            const dataWithoutStock = { ...validBookData };
            delete dataWithoutStock.stock;
            
            const book = new Book(dataWithoutStock);
            expect(book.stock).toBe(0);
        });
    });
});
