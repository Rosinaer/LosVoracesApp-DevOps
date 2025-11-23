// Tests unitarios para el modelo Book
const Book = require('../../../model/Book');

// Grupo principal de tests para el modelo Book
// Se agrupan los tests relacionados con la clase Book
// para mantener la organización y claridad.
describe('Book Model Test', () => {
    let testBook;
    // Datos de ejemplo reutilizados en varios tests
    const bookData = {
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

    // Se ejecuta antes de cada test para crear una nueva instancia
    beforeEach(() => {
        testBook = new Book(
            bookData.bookId,
            bookData.title,
            bookData.isbn,
            bookData.price,
            bookData.author,
            bookData.publisherHouse,
            bookData.section,
            bookData.stock,
            bookData.literaryGenre
        );
    });

    // Tests relacionados con la creación de instancias
    describe('Book Creation', () => {
        test('should create a valid book instance', () => {
            // Verifica que la instancia se crea correctamente y sus propiedades son las esperadas
            expect(testBook).toBeInstanceOf(Book);
            expect(testBook.productId).toBe(bookData.bookId);
            expect(testBook.name).toBe(bookData.title);
            expect(testBook.category).toBe('libro');
            expect(testBook.isbn).toBe(bookData.isbn);
            expect(testBook.price).toBe(bookData.price);
            expect(testBook.author).toBe(bookData.author);
            expect(testBook.publisherHouse).toBe(bookData.publisherHouse);
            expect(testBook.section).toBe(bookData.section);
            expect(testBook.stock).toBe(bookData.stock);
            expect(testBook.literaryGenre).toBe(bookData.literaryGenre);
        });

        test('should have all required properties accessible', () => {
            // Verifica que todas las propiedades requeridas existen en la instancia
            expect(testBook).toHaveProperty('isbn');
            expect(testBook).toHaveProperty('price');
            expect(testBook).toHaveProperty('author');
            expect(testBook).toHaveProperty('publisherHouse');
            expect(testBook).toHaveProperty('section');
            expect(testBook).toHaveProperty('stock');
            expect(testBook).toHaveProperty('literaryGenre');
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should not create book with missing required properties', () => {
            // Intenta crear un libro sin una propiedad obligatoria y espera un error
            const invalidData = { ...bookData };
            delete invalidData.isbn;
            
            expect(() => {
                new Book(
                    invalidData.bookId,
                    invalidData.title,
                    invalidData.isbn,
                    invalidData.price,
                    invalidData.author,
                    invalidData.publisherHouse,
                    invalidData.section,
                    invalidData.stock,
                    invalidData.literaryGenre
                );
            }).toThrow('Book must have all required properties');
        });

        test('should not accept negative price', () => {
            // El precio no puede ser negativo
            expect(() => {
                new Book(
                    bookData.bookId,
                    bookData.title,
                    bookData.isbn,
                    -10,
                    bookData.author,
                    bookData.publisherHouse,
                    bookData.section,
                    bookData.stock,
                    bookData.literaryGenre
                );
            }).toThrow('Price must be a positive number');
        });

        test('should not accept negative stock', () => {
            // El stock no puede ser negativo
            expect(() => {
                new Book(
                    bookData.bookId,
                    bookData.title,
                    bookData.isbn,
                    bookData.price,
                    bookData.author,
                    bookData.publisherHouse,
                    bookData.section,
                    -1,
                    bookData.literaryGenre
                );
            }).toThrow('Stock must be a positive number');
        });
    });

    // Tests de gestión de stock
    describe('Stock Management', () => {
        test('should update stock correctly', () => {
            // Suma stock y verifica el resultado
            const initialStock = testBook.stock;
            testBook.updateStock(5);
            expect(testBook.stock).toBe(initialStock + 5);
        });

        test('should decrease stock correctly', () => {
            // Resta stock y verifica el resultado
            const initialStock = testBook.stock;
            testBook.updateStock(-3);
            expect(testBook.stock).toBe(initialStock - 3);
        });

        test('should not allow stock to go negative', () => {
            // No se permite que el stock sea negativo
            expect(() => {
                testBook.updateStock(-20);
            }).toThrow('Stock cannot be negative');
        });

        test('should validate quantity type', () => {
            // La cantidad debe ser un número
            expect(() => {
                testBook.updateStock('5');
            }).toThrow('Quantity must be a number');
        });
    });

    // Tests para asegurar la inmutabilidad de propiedades
    describe('Property Immutability', () => {
        test('should not allow direct property modification', () => {
            // Intenta modificar propiedades directamente y verifica que no cambian
            const originalIsbn = testBook.isbn;
            const originalPrice = testBook.price;
            const originalStock = testBook.stock;

            // Intenta modificar propiedades
            testBook.isbn = '123-456';
            testBook.price = 0;
            testBook.stock = -1;

            // Las propiedades deben conservar sus valores originales
            expect(testBook.isbn).toBe(originalIsbn);
            expect(testBook.price).toBe(originalPrice);
            expect(testBook.stock).toBe(originalStock);
        });
    });
});
