// Tests unitarios para el modelo Order
const Order = require('../../../model/Order');

// Grupo principal de tests para el modelo Order
describe('Order Model Test', () => {
    let testOrder;
    // Datos de ejemplo reutilizados en varios tests
    const orderData = {
        orderId: 'order123',
        supplierId: 'supplier123',
        product: { id: 'prod123', name: 'Test Product' },
        date: new Date('2025-01-01'),
        description: 'Test order description',
        category: 'Books',
        price: 29.99,
        quantityProduct: 5
    };

    // Se ejecuta antes de cada test para crear una nueva instancia
    beforeEach(() => {
        testOrder = new Order(
            orderData.orderId,
            orderData.supplierId,
            orderData.product,
            orderData.date,
            orderData.description,
            orderData.category,
            orderData.price,
            orderData.quantityProduct
        );
    });

    // Tests relacionados con la creación de instancias
    describe('Order Creation', () => {
        test('should create a valid order instance', () => {
            // Verifica que la instancia se crea correctamente y sus propiedades son las esperadas
            expect(testOrder).toBeInstanceOf(Order);
            expect(testOrder.orderId).toBe(orderData.orderId);
            expect(testOrder.supplierId).toBe(orderData.supplierId);
            expect(testOrder.product).toEqual(orderData.product);
            expect(testOrder.date).toBe(orderData.date);
            expect(testOrder.description).toBe(orderData.description);
            expect(testOrder.category).toBe(orderData.category);
            expect(testOrder.price).toBe(orderData.price);
            expect(testOrder.quantityProduct).toBe(orderData.quantityProduct);
            expect(testOrder.status).toBe(Order.STATUS_TYPES.PENDING);
            expect(testOrder.total).toBe(orderData.price * orderData.quantityProduct);
        });

        test('should have all required properties accessible', () => {
            // Verifica que todas las propiedades requeridas existen en la instancia
            expect(testOrder).toHaveProperty('orderId');
            expect(testOrder).toHaveProperty('supplierId');
            expect(testOrder).toHaveProperty('product');
            expect(testOrder).toHaveProperty('date');
            expect(testOrder).toHaveProperty('description');
            expect(testOrder).toHaveProperty('category');
            expect(testOrder).toHaveProperty('price');
            expect(testOrder).toHaveProperty('quantityProduct');
            expect(testOrder).toHaveProperty('status');
            expect(testOrder).toHaveProperty('total');
        });

        test('should create order with empty description', () => {
            // Si la descripción es nula, debe quedar como string vacío
            const orderWithoutDesc = new Order(
                orderData.orderId,
                orderData.supplierId,
                orderData.product,
                orderData.date,
                null,
                orderData.category,
                orderData.price,
                orderData.quantityProduct
            );
            expect(orderWithoutDesc.description).toBe('');
        });
    });

    // Tests de validación de entradas
    describe('Input Validation', () => {
        test('should not create order with missing required properties', () => {
            // Intenta crear una orden sin una propiedad obligatoria y espera un error
            expect(() => {
                new Order(
                    orderData.orderId,
                    '',  // falta supplierId
                    orderData.product,
                    orderData.date,
                    orderData.description,
                    orderData.category,
                    orderData.price,
                    orderData.quantityProduct
                );
            }).toThrow('Order must have all required properties');
        });

        test('should validate date format', () => {
            // La fecha debe ser un objeto Date válido
            expect(() => {
                new Order(
                    orderData.orderId,
                    orderData.supplierId,
                    orderData.product,
                    'invalid-date',
                    orderData.description,
                    orderData.category,
                    orderData.price,
                    orderData.quantityProduct
                );
            }).toThrow('Date must be a valid Date object');
        });

        test('should validate price is positive', () => {
            // El precio debe ser positivo
            expect(() => {
                new Order(
                    orderData.orderId,
                    orderData.supplierId,
                    orderData.product,
                    orderData.date,
                    orderData.description,
                    orderData.category,
                    -10,
                    orderData.quantityProduct
                );
            }).toThrow('Price must be a positive number');
        });

        test('should validate quantity is positive', () => {
            // La cantidad debe ser positiva
            expect(() => {
                new Order(
                    orderData.orderId,
                    orderData.supplierId,
                    orderData.product,
                    orderData.date,
                    orderData.description,
                    orderData.category,
                    orderData.price,
                    0
                );
            }).toThrow('Quantity must be a positive number');
        });

        test('should validate status type', () => {
            // El status debe ser válido
            expect(() => {
                new Order(
                    orderData.orderId,
                    orderData.supplierId,
                    orderData.product,
                    orderData.date,
                    orderData.description,
                    orderData.category,
                    orderData.price,
                    orderData.quantityProduct,
                    'invalid-status'
                );
            }).toThrow('Invalid order status');
        });

        test('should validate description type', () => {
            // La descripción debe ser un string
            expect(() => {
                new Order(
                    orderData.orderId,
                    orderData.supplierId,
                    orderData.product,
                    orderData.date,
                    123, // invalid description type
                    orderData.category,
                    orderData.price,
                    orderData.quantityProduct
                );
            }).toThrow('Description must be a string');
        });
    });

    // Tests de gestión de status
    describe('Status Management', () => {
        test('should update status correctly', () => {
            // Cambia el estado y verifica el resultado
            testOrder.updateStatus(Order.STATUS_TYPES.CONFIRMED);
            expect(testOrder.status).toBe(Order.STATUS_TYPES.CONFIRMED);
        });

        test('should not accept invalid status', () => {
            // No se permite un estado inválido
            expect(() => {
                testOrder.updateStatus('invalid-status');
            }).toThrow('Invalid order status');
        });

        test('should not update cancelled order', () => {
            // No se puede cambiar el estado de una orden cancelada
            testOrder.updateStatus(Order.STATUS_TYPES.CANCELLED);
            expect(() => {
                testOrder.updateStatus(Order.STATUS_TYPES.CONFIRMED);
            }).toThrow('Cannot update status of a cancelled order');
        });

        test('should only allow cancellation of delivered order', () => {
            // Una orden entregada solo puede ser cancelada
            testOrder.updateStatus(Order.STATUS_TYPES.DELIVERED);
            expect(() => {
                testOrder.updateStatus(Order.STATUS_TYPES.CONFIRMED);
            }).toThrow('Delivered order can only be cancelled');

            // Debe permitir la cancelación
            testOrder.updateStatus(Order.STATUS_TYPES.CANCELLED);
            expect(testOrder.status).toBe(Order.STATUS_TYPES.CANCELLED);
        });
    });

    // Tests para proteger la referencia del producto
    describe('Product Reference Protection', () => {
        test('should create a copy of product on creation', () => {
            // El producto debe copiarse al crear la orden
            const product = { id: 'prod123', name: 'Original Name' };
            const order = new Order(
                orderData.orderId,
                orderData.supplierId,
                product,
                orderData.date,
                orderData.description,
                orderData.category,
                orderData.price,
                orderData.quantityProduct
            );

            product.name = 'Modified Name';
            expect(order.product.name).toBe('Original Name');
        });

        test('should return a copy of product when accessed', () => {
            // Al acceder al producto, se debe devolver una copia
            const product = testOrder.product;
            product.name = 'Modified Name';
            expect(testOrder.product.name).toBe('Test Product');
        });
    });

    // Tests para asegurar la inmutabilidad de propiedades
    describe('Property Immutability', () => {
        test('should not allow direct property modification', () => {
            // Intenta modificar propiedades directamente y verifica que no cambian
            const originalId = testOrder.orderId;
            const originalPrice = testOrder.price;
            const originalQuantity = testOrder.quantityProduct;
            const originalTotal = testOrder.total;

            // Intentamos modificar propiedades
            testOrder.orderId = 'new-id';
            testOrder.price = 0;
            testOrder.quantityProduct = 0;
            testOrder.total = 0;

            // Las propiedades deben retener sus valores originales
            expect(testOrder.orderId).toBe(originalId);
            expect(testOrder.price).toBe(originalPrice);
            expect(testOrder.quantityProduct).toBe(originalQuantity);
            expect(testOrder.total).toBe(originalTotal);
        });
    });
});
