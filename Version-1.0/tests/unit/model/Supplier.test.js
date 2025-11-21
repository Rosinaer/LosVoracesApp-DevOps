// Tests unitarios para el modelo Supplier
const Supplier = require('../../../model/Supplier');

// Grupo principal de tests para el modelo Supplier
describe('Supplier Model Test', () => {
    let testSupplier;
    // Datos de ejemplo reutilizados en varios tests
    const supplierData = {
        supplierId: 'sup123',
        name: 'Test Supplier',
        phoneNumber: '(123) 456-7890',
        email: 'supplier@test.com',
        category: 'Books',
        catalog: []
    };

    // Se ejecuta antes de cada test para crear una nueva instancia
    beforeEach(() => {
        testSupplier = new Supplier(
            supplierData.supplierId,
            supplierData.name,
            supplierData.phoneNumber,
            supplierData.email,
            supplierData.category,
            supplierData.catalog
        );
    });

    // Tests relacionados con la creación de instancias
    describe('Supplier Creation', () => {
        test('should create a valid supplier instance', () => {
            // Verifica que la instancia se crea correctamente y sus propiedades son las esperadas
            expect(testSupplier).toBeInstanceOf(Supplier);
            expect(testSupplier.supplierId).toBe(supplierData.supplierId);
            expect(testSupplier.name).toBe(supplierData.name);
            expect(testSupplier.phoneNumber).toBe(supplierData.phoneNumber);
            expect(testSupplier.email).toBe(supplierData.email);
            expect(testSupplier.category).toBe(supplierData.category);
            expect(testSupplier.catalog).toEqual(supplierData.catalog);
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

        test('should create supplier with empty catalog by default', () => {
            // Si el catálogo es omitido, debe quedar como array vacío
            const supplierWithoutCatalog = new Supplier(
                supplierData.supplierId,
                supplierData.name,
                supplierData.phoneNumber,
                supplierData.email,
                supplierData.category
            );
            expect(supplierWithoutCatalog.catalog).toEqual([]);
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should not create supplier with missing required properties', () => {
            // Intenta crear un proveedor sin una propiedad obligatoria y espera un error
            expect(() => {
                new Supplier(
                    supplierData.supplierId,
                    '',  // missing name
                    supplierData.phoneNumber,
                    supplierData.email,
                    supplierData.category
                );
            }).toThrow('Supplier must have all required properties');
        });

        test('should validate email format', () => {
            // El email debe tener formato válido
            expect(() => {
                new Supplier(
                    supplierData.supplierId,
                    supplierData.name,
                    supplierData.phoneNumber,
                    'invalid-email',
                    supplierData.category
                );
            }).toThrow('Invalid email format');
        });

        test('should validate phone number length', () => {
            // El teléfono debe tener al menos 9 dígitos
            expect(() => {
                new Supplier(
                    supplierData.supplierId,
                    supplierData.name,
                    '123-456',
                    supplierData.email,
                    supplierData.category
                );
            }).toThrow('Phone number must have at least 9 digits');
        });

        test('should validate catalog is an array', () => {
            // El catálogo debe ser un array
            expect(() => {
                new Supplier(
                    supplierData.supplierId,
                    supplierData.name,
                    supplierData.phoneNumber,
                    supplierData.email,
                    supplierData.category,
                    'not-an-array'
                );
            }).toThrow('Catalog must be an array');
        });
    });

    // Tests de gestión del catálogo
    describe('Catalog Management', () => {
        test('should add item to catalog', () => {
            // Agrega un ítem al catálogo y verifica que esté presente
            const item = { id: 'item1', name: 'Test Item' };
            testSupplier.addToCatalog(item);
            expect(testSupplier.catalog).toContainEqual(item);
        });

        test('should not accept invalid catalog item', () => {
            // No se permite agregar ítems inválidos
            expect(() => {
                testSupplier.addToCatalog('not-an-object');
            }).toThrow('Invalid catalog item');
        });

        test('should not accept item without id', () => {
            // No se permite agregar ítems sin id
            expect(() => {
                testSupplier.addToCatalog({ name: 'No ID Item' });
            }).toThrow('Invalid catalog item');
        });

        test('should not accept null or undefined item', () => {
            // No se permite agregar ítems nulos o indefinidos
            expect(() => {
                testSupplier.addToCatalog(null);
            }).toThrow('Invalid catalog item');
            expect(() => {
                testSupplier.addToCatalog(undefined);
            }).toThrow('Invalid catalog item');
        });

        test('should not allow duplicate item ids', () => {
            // No se permite agregar ítems con id duplicado
            const item = { id: 'item1', name: 'Test Item' };
            testSupplier.addToCatalog(item);
            expect(() => {
                testSupplier.addToCatalog({ id: 'item1', name: 'Duplicate ID' });
            }).toThrow('Item with this ID already exists in catalog');
        });

        test('should create copies of added items', () => {
            // Los ítems agregados deben ser copias
            const item = { id: 'item1', name: 'Test Item' };
            testSupplier.addToCatalog(item);
            item.name = 'Modified Name';
            expect(testSupplier.catalog[0].name).toBe('Test Item');
        });

        test('should create deep copies of initial catalog items', () => {
            // Los ítems iniciales deben ser copias profundas
            const initialItems = [{ id: 'item1', name: 'Initial Item' }];
            const supplier = new Supplier(
                'sup123',
                'Test Supplier',
                '(123) 456-7890',
                'test@example.com',
                'Books',
                initialItems
            );
            
            initialItems[0].name = 'Modified Name';
            expect(supplier.catalog[0].name).toBe('Initial Item');
        });

        test('should remove item from catalog', () => {
            // Elimina un ítem del catálogo y verifica que ya no esté presente
            const item = { id: 'item1', name: 'Test Item' };
            testSupplier.addToCatalog(item);
            testSupplier.removeFromCatalog('item1');
            expect(testSupplier.catalog).not.toContainEqual(item);
        });

        test('should throw error when removing non-existent item', () => {
            // No se puede eliminar un ítem que no existe
            expect(() => {
                testSupplier.removeFromCatalog('non-existent');
            }).toThrow('Item not found in catalog');
        });

        test('should not allow direct catalog modification', () => {
            // No se permite modificar el catálogo directamente
            const originalCatalog = testSupplier.catalog;
            const item = { id: 'item1', name: 'Test Item' };
            
            // Try to modify the returned catalog
            originalCatalog.push(item);
            
            // The actual catalog should remain unchanged
            expect(testSupplier.catalog).toEqual([]);
        });

        test('should validate catalog is array in constructor', () => {
            // El catálogo debe ser un array al crear el proveedor
            expect(() => {
                new Supplier(
                    'sup123',
                    'Test Supplier',
                    '(123) 456-7890',
                    'test@example.com',
                    'Books',
                    'not-an-array'
                );
            }).toThrow('Catalog must be an array');
        });
    });

    // Tests para asegurar la inmutabilidad de propiedades
    describe('Property Immutability', () => {
        test('should not allow direct property modification', () => {
            // Intenta modificar propiedades directamente y verifica que no cambian
            const originalId = testSupplier.supplierId;
            const originalName = testSupplier.name;
            const originalPhone = testSupplier.phoneNumber;
            const originalEmail = testSupplier.email;
            const originalCategory = testSupplier.category;

            // intenta modificar propiedades
            testSupplier.supplierId = 'new-id';
            testSupplier.name = 'new-name';
            testSupplier.phoneNumber = '000-000-0000';
            testSupplier.email = 'new@email.com';
            testSupplier.category = 'new-category';

            // las propiedades originales deben permanecer sin cambios
            expect(testSupplier.supplierId).toBe(originalId);
            expect(testSupplier.name).toBe(originalName);
            expect(testSupplier.phoneNumber).toBe(originalPhone);
            expect(testSupplier.email).toBe(originalEmail);
            expect(testSupplier.category).toBe(originalCategory);
        });
    });
});
