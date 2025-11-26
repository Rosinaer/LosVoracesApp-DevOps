// Tests unitarios para el modelo Supplier
const Supplier = require('../../../model/Supplier');

// Grupo principal de tests para el modelo Supplier
describe('Supplier Model Test', () => {
    let testSupplier;
    // Datos de ejemplo reutilizados en varios tests
    const validSupplierData = {
        supplierId: 'sup123',
        name: 'Test Supplier',
        phoneNumber: '(123) 456-7890',
        email: 'supplier@test.com',
        category: 'Books',
        catalog: []
    };

    // Se ejecuta antes de cada test para crear una nueva instancia
    beforeEach(() => {
        testSupplier = new Supplier(validSupplierData);
    });

    // Tests relacionados con la creación de instancias
    describe('Supplier Creation', () => {
        test('should create a valid supplier instance', () => {
            // Verifica que la instancia se crea correctamente y sus propiedades son las esperadas
            expect(testSupplier).toBeInstanceOf(Supplier);
            expect(testSupplier.supplierId).toBe(validSupplierData.supplierId);
            expect(testSupplier.name).toBe(validSupplierData.name);
            expect(testSupplier.phoneNumber).toBe(validSupplierData.phoneNumber);
            expect(testSupplier.email).toBe(validSupplierData.email);
            expect(testSupplier.category).toBe(validSupplierData.category);
            expect(testSupplier.catalog).toEqual(validSupplierData.catalog);
        });

        test('should have all required properties accessible', () => {
            // Verifica que todas las propiedades requeridas existen en la instancia
            expect(testSupplier).toHaveProperty('supplierId');
            expect(testSupplier).toHaveProperty('name');
            expect(testSupplier).toHaveProperty('phoneNumber');
            expect(testSupplier).toHaveProperty('email');
            expect(testSupplier).toHaveProperty('category');
            expect(testSupplier).toHaveProperty('catalog');
        });

        test('should set default empty catalog', () => {
            const supplierWithoutCatalog = new Supplier({
                supplierId: 'sup456',
                name: 'Another Supplier',
                phoneNumber: '(555) 555-5555',
                email: 'another@test.com',
                category: 'Magazines'
            });
            
            expect(supplierWithoutCatalog.catalog).toEqual([]);
        });

        test('should pass validation with valid data', () => {
            const validationError = testSupplier.validateSync();
            expect(validationError).toBeUndefined();
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should fail validation with missing required properties', () => {
            const supplier = new Supplier({});
            const validationError = supplier.validateSync();
            
            expect(validationError).toBeDefined();
            const fields = ['supplierId', 'name', 'phoneNumber', 'email', 'category'];
            fields.forEach(field => {
                expect(validationError.errors[field]).toBeDefined();
                expect(validationError.errors[field].kind).toBe('required');
                expect(validationError.errors[field].message).toMatch(new RegExp('Path `' + field + '` is required'));
            });
        });

        test('should validate email format', () => {
            const invalidData = { ...validSupplierData, email: 'invalid-email' };
            const supplier = new Supplier(invalidData);
            const validationError = supplier.validateSync();
            
            expect(validationError).toBeDefined();
            expect(validationError.errors.email).toBeDefined();
            expect(validationError.errors.email.kind).toBe('regexp');
            expect(validationError.errors.email.message).toMatch(/is invalid/);
        });

        test('should accept valid email formats', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.co.uk',
                'test+tag@example.org'
            ];
            
            validEmails.forEach(email => {
                const supplierData = { ...validSupplierData, email };
                const supplier = new Supplier(supplierData);
                const validationError = supplier.validateSync();
                
                expect(validationError).toBeUndefined();
                expect(supplier.email).toBe(email);
            });
        });

        test('should reject invalid email formats', () => {
            const invalidEmails = [
                'plainaddress',
                '@missingdomain.com',
                'missing@.com',
                'missing@domain',
                'spaces @domain.com'
            ];
            
            invalidEmails.forEach(email => {
                const supplierData = { ...validSupplierData, email };
                const supplier = new Supplier(supplierData);
                const validationError = supplier.validateSync();
                
                expect(validationError).toBeDefined();
                expect(validationError.errors.email).toBeDefined();
                expect(validationError.errors.email.kind).toBe('regexp');
                expect(validationError.errors.email.message).toMatch(/is invalid/);
            });
        });
    });
});
