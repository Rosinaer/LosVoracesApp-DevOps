const request = require('supertest');
const express = require('express');

// Mock authentication middleware first
jest.mock('../../../middleware/AuthMiddleware', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1, role: 'owner' };
    next();
  },
  authorizeRole: (...roles) => (req, res, next) => next(),
}));

const mockSuppliers = [{ id: 1, name: 'Supplier1', category: 'Books' }];
const newSupplier = { id: 2, name: 'Supplier2', category: 'Magazines' };
const mockSupplierById = { id: 1, name: 'Supplier1', category: 'Books' };
const mockSuppliersByCategory = [{ id: 3, name: 'Supplier3', category: 'Books' }];

jest.mock('../../../controller/SupplierController', () => ({
  getSuppliers: (req, res) => res.json(mockSuppliers),
  createSupplier: (req, res) => res.status(201).json(newSupplier),
  updateSupplier: jest.fn(),
  deleteSupplier: jest.fn(),
  getSupplierById: jest.fn(),
  getSuppliersByCategory: jest.fn(),
  addToCatalog: jest.fn((req, res) => res.status(200).json({ success: true })),
  removeFromCatalog: jest.fn((req, res) => res.status(200).json({ success: true })),
  renderSupplierCatalog: jest.fn((req, res) => res.status(200).json({ catalog: [] }))
}));

const SupplierRoute = require('../../../routes/SupplierRoute');

const app = express();
app.use(express.json());
app.use('/supplier', SupplierRoute);

// Pruebas unitarias para SupplierRoute
describe('SupplierRoute', () => {
  // Pruebas para la ruta GET /supplier
  describe('GET /supplier', () => {
    // Test: Debe devolver una lista de proveedores (mockeado)
    it('should return a list of suppliers (mocked)', async () => {
      // Se realiza una petición GET y se verifica la respuesta y el contenido
      const res = await request(app).get('/supplier');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockSuppliers);
    });
  });

  // Pruebas para la ruta POST /supplier
  describe('POST /supplier', () => {
    // Test: Debe crear un nuevo proveedor (mockeado)
    it('should create a new supplier (mocked)', async () => {
      // Se realiza una petición POST y se verifica la respuesta y el contenido
      const res = await request(app).post('/supplier').send(newSupplier);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newSupplier);
    });
  });

  // Pruebas para la ruta GET /supplier/supplier/:id
  describe('GET /supplier/supplier/:id', () => {
    // Test: Debe devolver un proveedor por id (mockeado)
    it('should return a supplier by id (mocked)', async () => {
      // Se simula la consulta de un proveedor por id y se verifica la respuesta
      const SupplierController = require('../../../controller/SupplierController');
      SupplierController.getSupplierById.mockImplementation((req, res) => res.json(mockSupplierById));
      const res = await request(app).get('/supplier/supplier/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockSupplierById);
      expect(SupplierController.getSupplierById).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta GET /supplier/supplier/category/:category
  describe('GET /supplier/supplier/category/:category', () => {
    // Test: Debe devolver proveedores por categoría (mockeado)
    it('should return suppliers by category (mocked)', async () => {
      // Se simula la consulta de proveedores por categoría y se verifica la respuesta
      const SupplierController = require('../../../controller/SupplierController');
      SupplierController.getSuppliersByCategory.mockImplementation((req, res) => res.json(mockSuppliersByCategory));
      const res = await request(app).get('/supplier/supplier/category/Books');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockSuppliersByCategory);
      expect(SupplierController.getSuppliersByCategory).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta PUT /supplier/:id
  describe('PUT /supplier/:id', () => {
    // Test: Debe actualizar un proveedor (mockeado)
    it('should update a supplier (mocked)', async () => {
      // Se simula la actualización de un proveedor y se verifica la respuesta
      const SupplierController = require('../../../controller/SupplierController');
      SupplierController.updateSupplier.mockImplementation((req, res) => res.json({ success: true }));
      const res = await request(app).put('/supplier/1').send({ name: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(SupplierController.updateSupplier).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta DELETE /supplier/:id
  describe('DELETE /supplier/:id', () => {
    // Test: Debe eliminar un proveedor (mockeado)
    it('should delete a supplier (mocked)', async () => {
      // Se simula la eliminación de un proveedor y se verifica la respuesta
      const SupplierController = require('../../../controller/SupplierController');
      SupplierController.deleteSupplier.mockImplementation((req, res) => res.json({ deleted: true }));
      const res = await request(app).delete('/supplier/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ deleted: true });
      expect(SupplierController.deleteSupplier).toHaveBeenCalled();
    });
  });
});
