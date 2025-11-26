const request = require('supertest');
const express = require('express');

const mockSales = [{ id: 1, product: 'Book', quantity: 2 }];
const newSale = { id: 2, product: 'Magazine', quantity: 1 };
const mockTopProducts = [{ product: 'Book', totalSold: 10 }];

jest.mock('../../../controller/SaleController', () => ({
  getSales: (req, res) => res.json(mockSales),
  createSale: (req, res) => res.status(201).json(newSale),
  updateSale: jest.fn(),
  deleteSale: jest.fn(),
  getTopSellingProducts: jest.fn(),
}));

const SaleRoute = require('../../../routes/SaleRoute');

const app = express();
app.use(express.json());
app.use('/sale', SaleRoute);

// Pruebas unitarias para SaleRoute
describe('SaleRoute', () => {
  // Pruebas para la ruta GET /sale
  describe('GET /sale', () => {
    // Test: Debe devolver una lista de ventas (mockeado)
    it('should return a list of sales (mocked)', async () => {
      // Se realiza una petición GET y se verifica la respuesta y el contenido
      const res = await request(app).get('/sale');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockSales);
    });
  });

  // Pruebas para la ruta POST /sale
  describe('POST /sale', () => {
    // Test: Debe crear una nueva venta (mockeado)
    it('should create a new sale (mocked)', async () => {
      // Se realiza una petición POST y se verifica la respuesta y el contenido
      const res = await request(app).post('/sale').send(newSale);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newSale);
    });
  });

  // Pruebas para la ruta PUT /sale/:id
  describe('PUT /sale/:id', () => {
    // Test: Debe actualizar una venta (mockeado)
    it('should update a sale (mocked)', async () => {
      // Se simula la actualización de una venta y se verifica la respuesta
      const SaleController = require('../../../controller/SaleController');
      SaleController.updateSale.mockImplementation((req, res) => res.json({ success: true }));
      const res = await request(app).put('/sale/1').send({ product: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(SaleController.updateSale).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta DELETE /sale/:id
  describe('DELETE /sale/:id', () => {
    // Test: Debe eliminar una venta (mockeado)
    it('should delete a sale (mocked)', async () => {
      // Se simula la eliminación de una venta y se verifica la respuesta
      const SaleController = require('../../../controller/SaleController');
      SaleController.deleteSale.mockImplementation((req, res) => res.json({ deleted: true }));
      const res = await request(app).delete('/sale/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ deleted: true });
      expect(SaleController.deleteSale).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta GET /sale/top-products
  describe('GET /sale/top-products', () => {
    // Test: Debe devolver los productos más vendidos (mockeado)
    it('should return top selling products (mocked)', async () => {
      // Se simula la consulta de productos más vendidos y se verifica la respuesta
      const SaleController = require('../../../controller/SaleController');
      SaleController.getTopSellingProducts.mockImplementation((req, res) => res.json(mockTopProducts));
      const res = await request(app).get('/sale/top-products');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockTopProducts);
      expect(SaleController.getTopSellingProducts).toHaveBeenCalled();
    });
  });
});
