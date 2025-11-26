// Tests unitarios para el modelo Sale
const Sale = require('../../../model/Sale');

// Grupo principal de tests para el modelo Sale
describe('Sale Model Test', () => {
    let testSale;
    // Datos de ejemplo reutilizados en varios tests
    const saleData = {
        saleId: 'sale123',
        product: { 
            id: 'prod123',
            name: 'Test Product',
            price: 29.99
        },
        date: new Date('2025-01-01'),
        description: 'Test sale description',
        category: 'Books',
        price: 29.99,
        quantityProduct: 3
    };

    // Se ejecuta antes de cada test para crear una nueva instancia
    beforeEach(() => {
        testSale = new Sale(
            saleData.saleId,
            saleData.product,
            saleData.date,
            saleData.description,
            saleData.category,
            saleData.price,
            saleData.quantityProduct
        );
    });

    // Tests relacionados con la creación de instancias
    describe('Sale Creation', () => {
        test('should create a valid sale instance', () => {
            // Verifica que la instancia se crea correctamente y sus propiedades son las esperadas
            expect(testSale).toBeInstanceOf(Sale);
            expect(testSale.saleId).toBe(saleData.saleId);
            expect(testSale.product).toEqual(saleData.product);
            expect(testSale.date).toBe(saleData.date);
            expect(testSale.description).toBe(saleData.description);
            expect(testSale.category).toBe(saleData.category);
            expect(testSale.price).toBe(saleData.price);
            expect(testSale.quantityProduct).toBe(saleData.quantityProduct);
            expect(testSale.total).toBe(saleData.price * saleData.quantityProduct);
        });

        test('should have all required properties accessible', () => {
            // Verifica que todas las propiedades requeridas existen en la instancia
            expect(testSale).toHaveProperty('saleId');
            expect(testSale).toHaveProperty('product');
            expect(testSale).toHaveProperty('date');
            expect(testSale).toHaveProperty('description');
            expect(testSale).toHaveProperty('category');
            expect(testSale).toHaveProperty('price');
            expect(testSale).toHaveProperty('quantityProduct');
            expect(testSale).toHaveProperty('total');
        });

        test('should create sale with empty description', () => {
            // Si la descripción es nula, debe quedar como string vacío
            const saleWithoutDesc = new Sale(
                saleData.saleId,
                saleData.product,
                saleData.date,
                null,
                saleData.category,
                saleData.price,
                saleData.quantityProduct
            );
            expect(saleWithoutDesc.description).toBe('');
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should not create sale with missing required properties', () => {
            // Intenta crear una venta sin una propiedad obligatoria y espera un error
            expect(() => {
                new Sale(
                    saleData.saleId,
                    null,  // missing product
                    saleData.date,
                    saleData.description,
                    saleData.category,
                    saleData.price,
                    saleData.quantityProduct
                );
            }).toThrow('Sale must have all required properties');
        });

        test('should validate product has valid ID', () => {
            // El producto debe tener un ID válido
            expect(() => {
                new Sale(
                    saleData.saleId,
                    { name: 'Invalid Product' }, // product without ID
                    saleData.date,
                    saleData.description,
                    saleData.category,
                    saleData.price,
                    saleData.quantityProduct
                );
            }).toThrow('Product must have a valid ID');
        });

        test('should validate date format', () => {
            // La fecha debe ser un objeto Date válido
            expect(() => {
                new Sale(
                    saleData.saleId,
                    saleData.product,
                    'invalid-date',
                    saleData.description,
                    saleData.category,
                    saleData.price,
                    saleData.quantityProduct
                );
            }).toThrow('Date must be a valid Date object');
        });

        test('should validate price is positive', () => {
            // El precio debe ser positivo
            expect(() => {
                new Sale(
                    saleData.saleId,
                    saleData.product,
                    saleData.date,
                    saleData.description,
                    saleData.category,
                    -10,
                    saleData.quantityProduct
                );
            }).toThrow('Price must be a positive number');
        });

        test('should validate quantity is positive', () => {
            // La cantidad debe ser positiva
            expect(() => {
                new Sale(
                    saleData.saleId,
                    saleData.product,
                    saleData.date,
                    saleData.description,
                    saleData.category,
                    saleData.price,
                    0
                );
            }).toThrow('Quantity must be a positive number');
        });

        test('should validate description type', () => {
            // La descripción debe ser un string
            expect(() => {
                new Sale(
                    saleData.saleId,
                    saleData.product,
                    saleData.date,
                    123, // invalid description type
                    saleData.category,
                    saleData.price,
                    saleData.quantityProduct
                );
            }).toThrow('Description must be a string');
        });
    });

    // Tests para proteger la referencia del producto
    describe('Product Reference Protection', () => {
        test('should create a copy of product on creation', () => {
            // El producto debe copiarse al crear la venta
            const product = { id: 'prod123', name: 'Original Name' };
            const sale = new Sale(
                saleData.saleId,
                product,
                saleData.date,
                saleData.description,
                saleData.category,
                saleData.price,
                saleData.quantityProduct
            );

            product.name = 'Modified Name';
            expect(sale.product.name).toBe('Original Name');
        });

        test('should return a copy of product when accessed', () => {
            // Al acceder al producto, se debe devolver una copia
            const product = testSale.product;
            product.name = 'Modified Name';
            expect(testSale.product.name).toBe('Test Product');
        });
    });

    // Tests para asegurar la inmutabilidad de propiedades
    describe('Property Immutability', () => {
        test('should not allow direct property modification', () => {
            // Intenta modificar propiedades directamente y verifica que no cambian
            const originalId = testSale.saleId;
            const originalPrice = testSale.price;
            const originalQuantity = testSale.quantityProduct;
            const originalTotal = testSale.total;

            // Intenta modificar propiedades
            testSale.saleId = 'new-id';
            testSale.price = 0;
            testSale.quantityProduct = 0;
            testSale.total = 0;

            // Las propiedades deben retener sus valores originales
            expect(testSale.saleId).toBe(originalId);
            expect(testSale.price).toBe(originalPrice);
            expect(testSale.quantityProduct).toBe(originalQuantity);
            expect(testSale.total).toBe(originalTotal);
        });
    });
});
