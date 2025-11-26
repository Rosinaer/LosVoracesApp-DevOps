// Tests unitarios para el modelo Order (Mongoose)
const mongoose = require('mongoose');
const Order = require('../../../model/Order');

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

// Grupo principal de tests para el modelo Order
describe('Order Model Test', () => {
    // Datos de ejemplo reutilizados en varios tests
    const validOrderData = {
        orderId: 'order123',
        supplierId: 'supplier123',
        product: { id: 'prod123', name: 'Test Product' },
        date: new Date('2025-01-01'),
        description: 'Test order description',
        category: 'Books',
        price: 29.99,
        quantityProduct: 5,
        status: 'pending',
        total: 149.95
    };

    // Tests relacionados con la creación de instancias
    describe('Order Creation', () => {
        test('should create a valid order instance', () => {
            const order = new Order(validOrderData);
            
            expect(order.orderId).toBe(validOrderData.orderId);
            expect(order.supplierId).toBe(validOrderData.supplierId);
            expect(order.product).toEqual(validOrderData.product);
            expect(order.date).toEqual(validOrderData.date);
            expect(order.description).toBe(validOrderData.description);
            expect(order.category).toBe(validOrderData.category);
            expect(order.price).toBe(validOrderData.price);
            expect(order.quantityProduct).toBe(validOrderData.quantityProduct);
            expect(order.status).toBe(validOrderData.status);
            expect(order.total).toBe(validOrderData.total);
        });

        test('should have all required properties accessible', () => {
            const order = new Order(validOrderData);
            
            expect(order).toHaveProperty('orderId');
            expect(order).toHaveProperty('supplierId');
            expect(order).toHaveProperty('product');
            expect(order).toHaveProperty('date');
            expect(order).toHaveProperty('description');
            expect(order).toHaveProperty('category');
            expect(order).toHaveProperty('price');
            expect(order).toHaveProperty('quantityProduct');
            expect(order).toHaveProperty('status');
            expect(order).toHaveProperty('total');
        });

        test('should create order with empty description by default', () => {
            const orderDataWithoutDesc = { ...validOrderData };
            delete orderDataWithoutDesc.description;
            
            const order = new Order(orderDataWithoutDesc);
            expect(order.description).toBe('');
        });

        test('should create order with pending status by default', () => {
            const orderDataWithoutStatus = { ...validOrderData };
            delete orderDataWithoutStatus.status;
            
            const order = new Order(orderDataWithoutStatus);
            expect(order.status).toBe('pending');
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should fail validation with missing required properties', () => {
            const order = new Order({});
            const validationError = order.validateSync();
            
            expect(validationError).toBeDefined();
            const fields = ['orderId', 'supplierId', 'product', 'date', 'category', 'price', 'quantityProduct', 'total'];
            fields.forEach(field => {
                expect(validationError.errors[field]).toBeDefined();
                expect(validationError.errors[field].kind).toBe('required');
                expect(validationError.errors[field].message).toMatch(new RegExp('Path `' + field + '` is required'));
            });
        });

        test('should validate price is positive', () => {
            const invalidData = { ...validOrderData, price: -10 };
            const order = new Order(invalidData);
            const validationError = order.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.price).toBeDefined();
            expect(validationError.errors.price.kind).toBe('min');
            expect(validationError.errors.price.message).toMatch(/minimum allowed value/);
        });

        test('should validate quantity is positive', () => {
            const invalidData = { ...validOrderData, quantityProduct: 0 };
            const order = new Order(invalidData);
            const validationError = order.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.quantityProduct).toBeDefined();
            expect(validationError.errors.quantityProduct.kind).toBe('min');
            expect(validationError.errors.quantityProduct.message).toMatch(/minimum allowed value/);
        });

        test('should validate total is positive', () => {
            const invalidData = { ...validOrderData, total: -5 };
            const order = new Order(invalidData);
            const validationError = order.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.total).toBeDefined();
            expect(validationError.errors.total.kind).toBe('min');
            expect(validationError.errors.total.message).toMatch(/minimum allowed value/);
        });

        test('should validate status enum values', () => {
            const invalidData = { ...validOrderData, status: 'invalid-status' };
            const order = new Order(invalidData);
            const validationError = order.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.status).toBeDefined();
            expect(validationError.errors.status.kind).toBe('enum');
            expect(validationError.errors.status.message).toMatch(/`invalid-status` is not a valid enum value/);
        });

        test('should accept valid status values', () => {
            const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
            
            validStatuses.forEach(status => {
                const orderData = { ...validOrderData, status };
                const order = new Order(orderData);
                const validationError = order.validateSync();
                
                expect(validationError).toBeUndefined();
                expect(order.status).toBe(status);
            });
        });

        test('should pass validation with valid data', () => {
            const order = new Order(validOrderData);
            const validationError = order.validateSync();
            
            expect(validationError).toBeUndefined();
        });
    });
});
