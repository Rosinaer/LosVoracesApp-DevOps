// Tests unitarios para el modelo Magazine
const Magazine = require('../../../model/Magazine');

// Grupo principal de tests para el modelo Magazine
describe('Magazine Model Test', () => {
    let testMagazine;
    // Datos de ejemplo reutilizados en varios tests
    const magazineData = {
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

    // Se ejecuta antes de cada test para crear una nueva instancia
    beforeEach(() => {
        testMagazine = new Magazine(
            magazineData.magazineId,
            magazineData.name,
            magazineData.price,
            magazineData.issn,
            magazineData.number,
            magazineData.section,
            magazineData.date,
            magazineData.stock,
            magazineData.issueNumber
        );
    });

    // Tests relacionados con la creación de instancias
    describe('Magazine Creation', () => {
        test('should create a valid magazine instance', () => {
            // Verifica que la instancia se crea correctamente y sus propiedades son las esperadas
            expect(testMagazine).toBeInstanceOf(Magazine);
            expect(testMagazine.productId).toBe(magazineData.magazineId);
            expect(testMagazine.name).toBe(magazineData.name);
            expect(testMagazine.category).toBe('revista');
            expect(testMagazine.issn).toBe(magazineData.issn);
            expect(testMagazine.price).toBe(magazineData.price);
            expect(testMagazine.section).toBe(magazineData.section);
            expect(testMagazine.stock).toBe(magazineData.stock);
            expect(testMagazine.date).toBe(magazineData.date);
            expect(testMagazine.number).toBe(magazineData.number);
            expect(testMagazine.issueNumber).toBe(magazineData.issueNumber);
        });

        test('should have all required properties accessible', () => {
            // Verifica que todas las propiedades requeridas existen en la instancia
            expect(testMagazine).toHaveProperty('issn');
            expect(testMagazine).toHaveProperty('price');
            expect(testMagazine).toHaveProperty('section');
            expect(testMagazine).toHaveProperty('stock');
            expect(testMagazine).toHaveProperty('date');
            expect(testMagazine).toHaveProperty('number');
            expect(testMagazine).toHaveProperty('issueNumber');
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should not create magazine with missing required properties', () => {
            // Intenta crear una revista sin una propiedad obligatoria y espera un error
            const invalidData = { ...magazineData };
            delete invalidData.issn;
            
            expect(() => {
                new Magazine(
                    invalidData.magazineId,
                    invalidData.name,
                    invalidData.price,
                    invalidData.issn,
                    invalidData.number,
                    invalidData.section,
                    invalidData.date,
                    invalidData.stock,
                    invalidData.issueNumber
                );
            }).toThrow('Magazine must have all required properties');
        });

        test('should not accept negative price', () => {
            // El precio no puede ser negativo
            expect(() => {
                new Magazine(
                    magazineData.magazineId,
                    magazineData.name,
                    -10,
                    magazineData.issn,
                    magazineData.number,
                    magazineData.section,
                    magazineData.date,
                    magazineData.stock,
                    magazineData.issueNumber
                );
            }).toThrow('Price must be a positive number');
        });

        test('should not accept negative stock', () => {
            // El stock no puede ser negativo
            expect(() => {
                new Magazine(
                    magazineData.magazineId,
                    magazineData.name,
                    magazineData.price,
                    magazineData.issn,
                    magazineData.number,
                    magazineData.section,
                    magazineData.date,
                    -1,
                    magazineData.issueNumber
                );
            }).toThrow('Stock must be a positive number');
        });

        test('should not accept invalid number', () => {
            // El número de revista debe ser positivo
            expect(() => {
                new Magazine(
                    magazineData.magazineId,
                    magazineData.name,
                    magazineData.price,
                    magazineData.issn,
                    0,
                    magazineData.section,
                    magazineData.date,
                    magazineData.stock,
                    magazineData.issueNumber
                );
            }).toThrow('Number must be a positive number');
        });

        test('should not accept invalid issue number', () => {
            // El número de edición debe ser positivo
            expect(() => {
                new Magazine(
                    magazineData.magazineId,
                    magazineData.name,
                    magazineData.price,
                    magazineData.issn,
                    magazineData.number,
                    magazineData.section,
                    magazineData.date,
                    magazineData.stock,
                    0
                );
            }).toThrow('Issue number must be a positive number');
        });

        test('should not accept invalid date', () => {
            // La fecha debe ser un objeto Date válido
            expect(() => {
                new Magazine(
                    magazineData.magazineId,
                    magazineData.name,
                    magazineData.price,
                    magazineData.issn,
                    magazineData.number,
                    magazineData.section,
                    'invalid-date',
                    magazineData.stock,
                    magazineData.issueNumber
                );
            }).toThrow('Date must be a valid Date object');
        });
    });

    // Tests de gestión de stock
    describe('Stock Management', () => {
        test('should update stock correctly', () => {
            // Suma stock y verifica el resultado
            const initialStock = testMagazine.stock;
            testMagazine.updateStock(5);
            expect(testMagazine.stock).toBe(initialStock + 5);
        });

        test('should decrease stock correctly', () => {
            // Resta stock y verifica el resultado
            const initialStock = testMagazine.stock;
            testMagazine.updateStock(-3);
            expect(testMagazine.stock).toBe(initialStock - 3);
        });

        test('should not allow stock to go negative', () => {
            // No se permite que el stock sea negativo
            expect(() => {
                testMagazine.updateStock(-200);
            }).toThrow('Stock cannot be negative');
        });

        test('should validate quantity type', () => {
            // La cantidad debe ser un número
            expect(() => {
                testMagazine.updateStock('5');
            }).toThrow('Quantity must be a number');
        });
    });

    // Tests para asegurar la inmutabilidad de propiedades
    describe('Property Immutability', () => {
        test('should not allow direct property modification', () => {
            // Intenta modificar propiedades directamente y verifica que no cambian
            const originalIssn = testMagazine.issn;
            const originalPrice = testMagazine.price;
            const originalStock = testMagazine.stock;
            const originalNumber = testMagazine.number;

            // intenta modificar propiedades
            testMagazine.issn = '123-456';
            testMagazine.price = 0;
            testMagazine.stock = -1;
            testMagazine.number = 0;

            // Las propiedades deben conservar sus valores originales
            expect(testMagazine.issn).toBe(originalIssn);
            expect(testMagazine.price).toBe(originalPrice);
            expect(testMagazine.stock).toBe(originalStock);
            expect(testMagazine.number).toBe(originalNumber);
        });
    });
});
