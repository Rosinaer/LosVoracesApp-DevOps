// Pruebas unitarias para stockHelper
const { updateStock } = require('../../../../model/helpers/stockHelper');

describe('Stock Helper', () => {
    // Pruebas para la función updateStock
    describe('updateStock', () => {
        // Test: Debe aumentar el stock correctamente
        test('should increase stock correctly', () => {
            // Se verifica que sumar una cantidad positiva incremente el stock
            expect(updateStock(10, 5)).toBe(15);
        });

        // Test: Debe disminuir el stock correctamente
        test('should decrease stock correctly', () => {
            // Se verifica que restar una cantidad negativa disminuya el stock
            expect(updateStock(10, -3)).toBe(7);
        });

        // Test: No debe permitir stock resultante negativo
        test('should not allow negative resulting stock', () => {
            // Se verifica que lanzar un error si el stock resultante es negativo
            expect(() => {
                updateStock(10, -15);
            }).toThrow('Stock cannot be negative');
        });

        // Test: Debe validar el tipo de cantidad
        test('should validate quantity type', () => {
            // Se verifica que lanzar un error si la cantidad no es un número
            expect(() => {
                updateStock(10, '5');
            }).toThrow('Quantity must be a number');
        });

        // Test: Debe manejar cantidad cero
        test('should handle zero quantity', () => {
            // Se verifica que el stock no cambie si la cantidad es cero
            expect(updateStock(10, 0)).toBe(10);
        });

        // Test: Debe manejar resultado exacto cero
        test('should handle exact zero result', () => {
            // Se verifica que el stock pueda llegar exactamente a cero
            expect(updateStock(10, -10)).toBe(0);
        });
    });
});
