// Tests unitarios para el modelo Sale (Mongoose)
const mongoose = require('mongoose');
const Sale = require('../../../model/Sale');

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

// Grupo principal de tests para el modelo Sale
describe('Sale Model Test', () => {
    // Datos de ejemplo reutilizados en varios tests
    const validSaleData = {
        saleId: 'sale123',
        product: 'product456',
        date: new Date('2025-01-01'),
        description: 'Test sale description',
        category: 'Books',
        price: 29.99,
        quantityProduct: 3,
        total: 89.97
    };

    // Tests relacionados con la creación de instancias
    describe('Sale Creation', () => {
        test('should create a valid sale instance', () => {
            const sale = new Sale(validSaleData);
            
            expect(sale.saleId).toBe(validSaleData.saleId);
            expect(sale.product).toBe(validSaleData.product);
            expect(sale.date).toEqual(validSaleData.date);
            expect(sale.description).toBe(validSaleData.description);
            expect(sale.category).toBe(validSaleData.category);
            expect(sale.price).toBe(validSaleData.price);
            expect(sale.quantityProduct).toBe(validSaleData.quantityProduct);
            expect(sale.total).toBe(validSaleData.total);
        });

        test('should have all required properties accessible', () => {
            const sale = new Sale(validSaleData);
            
            expect(sale).toHaveProperty('saleId');
            expect(sale).toHaveProperty('product');
            expect(sale).toHaveProperty('date');
            expect(sale).toHaveProperty('description');
            expect(sale).toHaveProperty('category');
            expect(sale).toHaveProperty('price');
            expect(sale).toHaveProperty('quantityProduct');
            expect(sale).toHaveProperty('total');
        });

        test('should create sale with empty description by default', () => {
            const saleDataWithoutDesc = { ...validSaleData };
            delete saleDataWithoutDesc.description;
            
            const sale = new Sale(saleDataWithoutDesc);
            expect(sale.description).toBe('');
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should fail validation with missing required properties', () => {
            const sale = new Sale({});
            const validationError = sale.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.saleId.kind).toBe('required');
            expect(validationError.errors.date.kind).toBe('required');
            expect(validationError.errors.category.kind).toBe('required');
            expect(validationError.errors.price.kind).toBe('required');
            expect(validationError.errors.quantityProduct.kind).toBe('required');
            expect(validationError.errors.total.kind).toBe('required');
        });

        test('should validate price is positive', () => {
            const invalidData = { ...validSaleData, price: -10 };
            const sale = new Sale(invalidData);
            const validationError = sale.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.price.kind).toBe('min');
            expect(validationError.errors.price.message).toMatch(/minimum allowed value/);
        });

        test('should validate quantity is positive', () => {
            const invalidData = { ...validSaleData, quantityProduct: 0 };
            const sale = new Sale(invalidData);
            const validationError = sale.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.quantityProduct.kind).toBe('min');
            expect(validationError.errors.quantityProduct.message).toMatch(/minimum allowed value/);
        });

        test('should validate description type', () => {
            const sale = new Sale(validSaleData);
            expect(typeof sale.description).toBe('string');
        });

        test('should pass validation with valid data', () => {
            const sale = new Sale(validSaleData);
            const validationError = sale.validateSync();
            
            expect(validationError).toBeUndefined();
        });
    });
});
