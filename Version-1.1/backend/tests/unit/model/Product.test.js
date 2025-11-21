// Tests unitarios para el modelo Product (Mongoose)
const mongoose = require('mongoose');
const Product = require('../../../model/Product');

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

// Grupo principal de tests para el modelo Product
describe('Product Model Test', () => {
    // Datos de ejemplo reutilizados en varios tests
    const validProductData = {
        productId: '123',
        name: 'Test Product',
        category: 'Test Category'
    };

    // Tests relacionados con la creación de instancias
    describe('Product Creation', () => {
        test('should create a valid product instance', () => {
            const product = new Product(validProductData);
            
            expect(product.productId).toBe(validProductData.productId);
            expect(product.name).toBe(validProductData.name);
            expect(product.category).toBe(validProductData.category);
        });

        test('should have all required properties accessible', () => {
            const product = new Product(validProductData);
            
            expect(product).toHaveProperty('productId');
            expect(product).toHaveProperty('name');
            expect(product).toHaveProperty('category');
            expect(product.productId).toBeDefined();
            expect(product.name).toBeDefined();
            expect(product.category).toBeDefined();
        });
    });

    describe('Schema Validation', () => {
        test('should fail validation with missing required properties', () => {
            const product = new Product({});
            const validationError = product.validateSync();
            
            expect(validationError).toBeDefined();
            const fields = ['productId', 'name', 'category'];
            fields.forEach(field => {
                expect(validationError.errors[field]).toBeDefined();
                expect(validationError.errors[field].kind).toBe('required');
                expect(validationError.errors[field].message).toMatch(new RegExp('Path `' + field + '` is required'));
            });
        });

        test('should fail validation with empty productId', () => {
            const invalidData = { ...validProductData, productId: '' };
            const product = new Product(invalidData);
            const validationError = product.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.productId).toBeDefined();
        });

        test('should fail validation with empty name', () => {
            const invalidData = { ...validProductData, name: '' };
            const product = new Product(invalidData);
            const validationError = product.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.name).toBeDefined();
        });

        test('should fail validation with empty category', () => {
            const invalidData = { ...validProductData, category: '' };
            const product = new Product(invalidData);
            const validationError = product.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.category).toBeDefined();
        });

        test('should pass validation with valid data', () => {
            const product = new Product(validProductData);
            const validationError = product.validateSync();
            
            expect(validationError).toBeUndefined();
        });
    });
});
