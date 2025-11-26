// Tests unitarios para el modelo Product
const Product = require('../../../model/Product');

// Grupo principal de tests para el modelo Product
describe('Product Model Test', () => {
    let testProduct;
    // Datos de ejemplo reutilizados en varios tests
    const productData = {
        productId: '123',
        name: 'Test Product',
        category: 'Test Category'
    };

    // Se ejecuta antes de cada test para crear una nueva instancia
    beforeEach(() => {
        testProduct = new Product(
            productData.productId,
            productData.name,
            productData.category
        );
    });

    // Tests relacionados con la creación de instancias
    describe('Product Creation', () => {
        test('should create a valid product instance', () => {
            // Verifica que la instancia se crea correctamente y sus propiedades son las esperadas
            expect(testProduct).toBeInstanceOf(Product);
            expect(testProduct.productId).toBe(productData.productId);
            expect(testProduct.name).toBe(productData.name);
            expect(testProduct.category).toBe(productData.category);
        });

        test('should have all required properties accessible', () => {
            // Verifica que todas las propiedades requeridas existen en la instancia
            expect(testProduct).toHaveProperty('productId');
            expect(testProduct).toHaveProperty('name');
            expect(testProduct).toHaveProperty('category');
        });
    });

    // Tests para asegurar la inmutabilidad de propiedades
    describe('Product Properties', () => {
        test('should not allow direct property modification', () => {
            // Intenta modificar propiedades directamente y verifica que no cambian
            const originalId = testProduct.productId;
            const originalName = testProduct.name;
            const originalCategory = testProduct.category;

            // Attempt to modify properties
            testProduct.productId = 'new-id';
            testProduct.name = 'new-name';
            testProduct.category = 'new-category';

            // Properties should retain their original values
            expect(testProduct.productId).toBe(originalId);
            expect(testProduct.name).toBe(originalName);
            expect(testProduct.category).toBe(originalCategory);
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should not create product with empty productId', () => {
            // No se permite crear un producto sin productId
            expect(() => {
                new Product('', productData.name, productData.category);
            }).toThrow();
        });

        test('should not create product with empty name', () => {
            // No se permite crear un producto sin nombre
            expect(() => {
                new Product(productData.productId, '', productData.category);
            }).toThrow();
        });

        test('should not create product with empty category', () => {
            // No se permite crear un producto sin categoría
            expect(() => {
                new Product(productData.productId, productData.name, '');
            }).toThrow();
        });
    });
});
