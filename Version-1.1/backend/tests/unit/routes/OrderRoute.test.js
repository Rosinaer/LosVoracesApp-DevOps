const request = require('supertest');
const express = require('express');

const mockOrders = [{ id: 1, product: 'Book', quantity: 2 }];
const newOrder = { id: 2, product: 'Magazine', quantity: 1 };

// Mock authentication middleware
jest.mock('../../../middleware/AuthMiddleware', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1, role: 'owner' };
    next();
  },
  authorizeRole: (...roles) => (req, res, next) => next(),
}));

jest.mock('../../../controller/OrderController', () => ({
  getOrders: (req, res) => res.json(mockOrders),
  createOrder: (req, res) => res.status(201).json(newOrder),
  updateOrder: jest.fn(),
  deleteOrder: jest.fn(),
  renderOrders: jest.fn((req, res) => res.status(200).json({ orders: [] }))
}));

const OrderRoute = require('../../../routes/OrderRoute');

const app = express();
app.use(express.json());
app.use('/order', OrderRoute);

// Pruebas unitarias para OrderRoute
describe('OrderRoute', () => {
  // Pruebas para la ruta GET /order
  describe('GET /order', () => {
    // Test: Debe devolver una lista de órdenes (mockeado)
    it('should return a list of orders (mocked)', async () => {
      // Se realiza una petición GET y se verifica la respuesta y el contenido
      const res = await request(app).get('/order');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockOrders);
    });
  });

  // Pruebas para la ruta POST /order
  describe('POST /order', () => {
    // Test: Debe crear una nueva orden (mockeado)
    it('should create a new order (mocked)', async () => {
      // Se realiza una petición POST y se verifica la respuesta y el contenido
      const res = await request(app).post('/order').send(newOrder);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newOrder);
    });
  });

  // Pruebas para la ruta PUT /order/:id
  describe('PUT /order/:id', () => {
    // Test: Debe actualizar una orden (mockeado)
    it('should update an order (mocked)', async () => {
      // Se simula la actualización de una orden y se verifica la respuesta
      const OrderController = require('../../../controller/OrderController');
      OrderController.updateOrder.mockImplementation((req, res) => res.json({ success: true }));
      const res = await request(app).put('/order/1').send({ product: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(OrderController.updateOrder).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta DELETE /order/:id
  describe('DELETE /order/:id', () => {
    // Test: Debe eliminar una orden (mockeado)
    it('should delete an order (mocked)', async () => {
      // Se simula la eliminación de una orden y se verifica la respuesta
      const OrderController = require('../../../controller/OrderController');
      OrderController.deleteOrder.mockImplementation((req, res) => res.json({ deleted: true }));
      const res = await request(app).delete('/order/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ deleted: true });
      expect(OrderController.deleteOrder).toHaveBeenCalled();
    });
  });
});
