// Tests unitarios para el modelo SchoolSupply (Mongoose)
const mongoose = require('mongoose');
const SchoolSupply = require('../../../model/SchoolSupply');

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

// Grupo principal de tests para el modelo SchoolSupply
describe('SchoolSupply Model Test', () => {
    // Datos de ejemplo reutilizados en varios tests
    const validSchoolSupplyData = {
        schoolSupplyId: 'supply123',
        name: 'Lápiz 2B',
        price: 2.99,
        section: 'Útiles de escritura',
        stock: 50,
        brand: 'Faber-Castell',
        description: 'Lápiz de grafito para dibujo profesional'
    };

    // Tests relacionados con la creación de instancias
    describe('SchoolSupply Creation', () => {
        test('should create a valid school supply instance', () => {
            const schoolSupply = new SchoolSupply(validSchoolSupplyData);
            
            expect(schoolSupply.schoolSupplyId).toBe(validSchoolSupplyData.schoolSupplyId);
            expect(schoolSupply.name).toBe(validSchoolSupplyData.name);
            expect(schoolSupply.price).toBe(validSchoolSupplyData.price);
            expect(schoolSupply.section).toBe(validSchoolSupplyData.section);
            expect(schoolSupply.stock).toBe(validSchoolSupplyData.stock);
            expect(schoolSupply.brand).toBe(validSchoolSupplyData.brand);
            expect(schoolSupply.description).toBe(validSchoolSupplyData.description);
        });

        test('should have all required properties accessible', () => {
            const schoolSupply = new SchoolSupply(validSchoolSupplyData);
            
            expect(schoolSupply).toHaveProperty('schoolSupplyId');
            expect(schoolSupply).toHaveProperty('name');
            expect(schoolSupply).toHaveProperty('price');
            expect(schoolSupply).toHaveProperty('section');
            expect(schoolSupply).toHaveProperty('stock');
            expect(schoolSupply).toHaveProperty('brand');
            expect(schoolSupply).toHaveProperty('description');
        });

        test('should set default stock to 0', () => {
            const supplyWithoutStock = new SchoolSupply({
                schoolSupplyId: 'supply456',
                name: 'Another Supply',
                price: 5.99,
                section: 'Office supplies',
                brand: 'Generic'
            });
            
            expect(supplyWithoutStock.stock).toBe(0);
        });

        test('should allow empty description', () => {
            const supplyWithoutDesc = new SchoolSupply({
                schoolSupplyId: 'supply789',
                name: 'Simple Supply',
                price: 1.99,
                section: 'Basic supplies',
                brand: 'Brand X'
            });
            
            expect(supplyWithoutDesc.description).toBeUndefined();
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should fail validation with missing required properties', () => {
            const schoolSupply = new SchoolSupply({});
            const validationError = schoolSupply.validateSync();
            
            expect(validationError).toBeDefined();
            const fields = ['schoolSupplyId', 'name', 'price', 'section', 'brand'];
            fields.forEach(field => {
                expect(validationError.errors[field]).toBeDefined();
                expect(validationError.errors[field].kind).toBe('required');
                expect(validationError.errors[field].message).toMatch(new RegExp('Path `' + field + '` is required'));
            });
        });

        test('should validate price is positive', () => {
            const invalidData = { ...validSchoolSupplyData, price: -10 };
            const schoolSupply = new SchoolSupply(invalidData);
            const validationError = schoolSupply.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.price).toBeDefined();
            expect(validationError.errors.price.kind).toBe('min');
            expect(validationError.errors.price.message).toMatch(/minimum allowed value/);
        });

        test('should accept zero price', () => {
            const validData = { ...validSchoolSupplyData, price: 0 };
            const schoolSupply = new SchoolSupply(validData);
            const validationError = schoolSupply.validateSync();
            
            expect(validationError).toBeUndefined();
            expect(schoolSupply.price).toBe(0);
        });

        test('should pass validation with valid data', () => {
            const schoolSupply = new SchoolSupply(validSchoolSupplyData);
            const validationError = schoolSupply.validateSync();
            
            expect(validationError).toBeUndefined();
        });
    });
});
