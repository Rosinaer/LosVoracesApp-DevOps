// Tests unitarios para el modelo Magazine (Mongoose)
const mongoose = require('mongoose');
const Magazine = require('../../../model/Magazine');

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

// Grupo principal de tests para el modelo Magazine
describe('Magazine Model Test', () => {
    // Datos de ejemplo reutilizados en varios tests
    const validMagazineData = {
        magazineId: 'billiken123',
        name: 'Billiken je',
        price: 9.99,
        issn: '2049-3630',
        number: 42,
        section: 'Science',
        date: new Date('2025-01-01'),
        stock: 100,
        issueNumber: 5
    };

    // Tests relacionados con la creación de instancias
    describe('Magazine Creation', () => {
        test('should create a valid magazine instance', () => {
            const magazine = new Magazine(validMagazineData);
            
            expect(magazine.magazineId).toBe(validMagazineData.magazineId);
            expect(magazine.name).toBe(validMagazineData.name);
            expect(magazine.price).toBe(validMagazineData.price);
            expect(magazine.issn).toBe(validMagazineData.issn);
            expect(magazine.number).toBe(validMagazineData.number);
            expect(magazine.section).toBe(validMagazineData.section);
            expect(magazine.date).toEqual(validMagazineData.date);
            expect(magazine.stock).toBe(validMagazineData.stock);
            expect(magazine.issueNumber).toBe(validMagazineData.issueNumber);
        });

        test('should have all required properties accessible', () => {
            const magazine = new Magazine(validMagazineData);
            
            expect(magazine).toHaveProperty('magazineId');
            expect(magazine).toHaveProperty('name');
            expect(magazine).toHaveProperty('price');
            expect(magazine).toHaveProperty('issn');
            expect(magazine).toHaveProperty('number');
            expect(magazine).toHaveProperty('section');
            expect(magazine).toHaveProperty('date');
            expect(magazine).toHaveProperty('stock');
            expect(magazine).toHaveProperty('issueNumber');
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should fail validation with missing required properties', () => {
            const magazine = new Magazine({});
            const validationError = magazine.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.magazineId.kind).toBe('required');
            expect(validationError.errors.name.kind).toBe('required');
            expect(validationError.errors.price.kind).toBe('required');
            expect(validationError.errors.issn.kind).toBe('required');
            expect(validationError.errors.number.kind).toBe('required');
            expect(validationError.errors.section.kind).toBe('required');
            expect(validationError.errors.date.kind).toBe('required');
            expect(validationError.errors.issueNumber.kind).toBe('required');
        });

        test('should validate price is positive', () => {
            const invalidData = { ...validMagazineData, price: -10 };
            const magazine = new Magazine(invalidData);
            const validationError = magazine.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.price.kind).toBe('min');
            expect(validationError.errors.price.message).toMatch(/minimum allowed value/);
        });

        test('should validate stock is not negative', () => {
            const invalidData = { ...validMagazineData, stock: -5 };
            const magazine = new Magazine(invalidData);
            const validationError = magazine.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.stock.kind).toBe('min');
            expect(validationError.errors.stock.message).toMatch(/minimum allowed value/);
        });

        test('should validate number is positive', () => {
            const invalidData = { ...validMagazineData, number: 0 };
            const magazine = new Magazine(invalidData);
            const validationError = magazine.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.number.kind).toBe('min');
            expect(validationError.errors.number.message).toMatch(/minimum allowed value/);
        });

        test('should validate issue number is positive', () => {
            const invalidData = { ...validMagazineData, issueNumber: 0 };
            const magazine = new Magazine(invalidData);
            const validationError = magazine.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.issueNumber.kind).toBe('min');
            expect(validationError.errors.issueNumber.message).toMatch(/minimum allowed value/);
        });

        test('should pass validation with valid data', () => {
            const magazine = new Magazine(validMagazineData);
            const validationError = magazine.validateSync();
            
            expect(validationError).toBeUndefined();
        });
    });
});


