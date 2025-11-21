// Tests unitarios para el modelo SchoolSupply
const SchoolSupply = require('../../../model/SchoolSupply');

// Grupo principal de tests para el modelo SchoolSupply
describe('SchoolSupply Model Test', () => {
    let testSupply;
    // Datos de ejemplo reutilizados en varios tests
    const supplyData = {
        supplyId: 'supply123',
        name: 'Lápiz 2B',
        price: 2.99,
        section: 'Útiles de escritura',
        stock: 50,
        brand: 'Faber-Castell',
        description: 'Lápiz de grafito para dibujo profesional'
    };

    // Se ejecuta antes de cada test para crear una nueva instancia
    beforeEach(() => {
        testSupply = new SchoolSupply(
            supplyData.supplyId,
            supplyData.name,
            supplyData.price,
            supplyData.section,
            supplyData.stock,
            supplyData.brand,
            supplyData.description
        );
    });

    // Tests relacionados con la creación de instancias
    describe('SchoolSupply Creation', () => {
        test('should create a valid school supply instance', () => {
            // Verifica que la instancia se crea correctamente y sus propiedades son las esperadas
            expect(testSupply).toBeInstanceOf(SchoolSupply);
            expect(testSupply.productId).toBe(supplyData.supplyId);
            expect(testSupply.name).toBe(supplyData.name);
            expect(testSupply.category).toBe('util escolar');
            expect(testSupply.price).toBe(supplyData.price);
            expect(testSupply.section).toBe(supplyData.section);
            expect(testSupply.stock).toBe(supplyData.stock);
            expect(testSupply.brand).toBe(supplyData.brand);
            expect(testSupply.description).toBe(supplyData.description);
        });

        test('should have all required properties accessible', () => {
            // Verifica que todas las propiedades requeridas existen en la instancia
            expect(testSupply).toHaveProperty('price');
            expect(testSupply).toHaveProperty('section');
            expect(testSupply).toHaveProperty('stock');
            expect(testSupply).toHaveProperty('brand');
            expect(testSupply).toHaveProperty('description');
        });

        test('should create supply with empty description', () => {
            // Si la descripción es nula, debe quedar como string vacío
            const supplyWithoutDesc = new SchoolSupply(
                supplyData.supplyId,
                supplyData.name,
                supplyData.price,
                supplyData.section,
                supplyData.stock,
                supplyData.brand
            );
            expect(supplyWithoutDesc.description).toBe('');
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should not create supply with missing required properties', () => {
            // Intenta crear un útil escolar sin una propiedad obligatoria y espera un error
            expect(() => {
                new SchoolSupply(
                    supplyData.supplyId,
                    supplyData.name,
                    supplyData.price,
                    supplyData.section,
                    supplyData.stock,
                    null // missing brand
                );
            }).toThrow('SchoolSupply must have all required properties');
        });

        test('should not accept negative price', () => {
            // El precio no puede ser negativo
            expect(() => {
                new SchoolSupply(
                    supplyData.supplyId,
                    supplyData.name,
                    -10,
                    supplyData.section,
                    supplyData.stock,
                    supplyData.brand
                );
            }).toThrow('Price must be a positive number');
        });

        test('should not accept negative stock', () => {
            // El stock no puede ser negativo
            expect(() => {
                new SchoolSupply(
                    supplyData.supplyId,
                    supplyData.name,
                    supplyData.price,
                    supplyData.section,
                    -1,
                    supplyData.brand
                );
            }).toThrow('Stock must be a positive number');
        });

        test('should validate description type', () => {
            // La descripción debe ser un string
            expect(() => {
                new SchoolSupply(
                    supplyData.supplyId,
                    supplyData.name,
                    supplyData.price,
                    supplyData.section,
                    supplyData.stock,
                    supplyData.brand,
                    123 // invalid description type
                );
            }).toThrow('Description must be a string');
        });
    });

    // Tests de gestión de stock
    describe('Stock Management', () => {
        test('should update stock correctly', () => {
            // Suma stock y verifica el resultado
            const initialStock = testSupply.stock;
            testSupply.updateStock(5);
            expect(testSupply.stock).toBe(initialStock + 5);
        });

        test('should decrease stock correctly', () => {
            // Resta stock y verifica el resultado
            const initialStock = testSupply.stock;
            testSupply.updateStock(-3);
            expect(testSupply.stock).toBe(initialStock - 3);
        });

        test('should not allow stock to go negative', () => {
            // No se permite que el stock sea negativo
            expect(() => {
                testSupply.updateStock(-100);
            }).toThrow('Stock cannot be negative');
        });

        test('should validate quantity type', () => {
            // La cantidad debe ser un número
            expect(() => {
                testSupply.updateStock('5');
            }).toThrow('Quantity must be a number');
        });
    });

    // Tests para asegurar la inmutabilidad de propiedades
    describe('Property Immutability', () => {
        test('should not allow direct property modification', () => {
            // Intenta modificar propiedades directamente y verifica que no cambian
            const originalPrice = testSupply.price;
            const originalStock = testSupply.stock;
            const originalBrand = testSupply.brand;
            const originalDescription = testSupply.description;

            // Intenta modificar propiedades
            testSupply.price = 0;
            testSupply.stock = -1;
            testSupply.brand = 'New Brand';
            testSupply.description = 'New Description';

            // Las propiedades deben conservar sus valores originales
            expect(testSupply.price).toBe(originalPrice);
            expect(testSupply.stock).toBe(originalStock);
            expect(testSupply.brand).toBe(originalBrand);
            expect(testSupply.description).toBe(originalDescription);
        });
    });
});
