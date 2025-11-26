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

const mockSupplies = [{ id: 1, name: 'Pencil', stock: 100 }];
const newSupply = { id: 2, name: 'Notebook', stock: 50 };

jest.mock('../../../controller/SchoolSupplyController', () => ({
  getSchoolSupplies: (req, res) => res.json(mockSupplies),
  createSchoolSupply: (req, res) => res.status(201).json(newSupply),
  updateSchoolSupply: jest.fn(),
  deleteSchoolSupply: jest.fn(),
  renderCatalog: jest.fn(),
  updateSchoolSupplyStock: jest.fn(),
}));

const SchoolSupplyRoute = require('../../../routes/SchoolSupplyRoute');

const app = express();
app.use(express.json());
app.use('/schoolSupply', SchoolSupplyRoute);

// Pruebas unitarias para SchoolSupplyRoute
describe('SchoolSupplyRoute', () => {
  // Pruebas para la ruta GET /schoolSupply
  describe('GET /schoolSupply', () => {
    // Test: Debe devolver una lista de útiles escolares (mockeado)
    it('should return a list of school supplies (mocked)', async () => {
      // Se realiza una petición GET y se verifica la respuesta y el contenido
      const res = await request(app).get('/schoolSupply');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockSupplies);
    });
  });

  // Pruebas para la ruta POST /schoolSupply
  describe('POST /schoolSupply', () => {
    // Test: Debe crear un nuevo útil escolar (mockeado)
    it('should create a new school supply (mocked)', async () => {
      // Se realiza una petición POST y se verifica la respuesta y el contenido
      const res = await request(app).post('/schoolSupply').send(newSupply);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newSupply);
    });
  });

  // Pruebas para la ruta GET /schoolSupply/catalog
  describe('GET /schoolSupply/catalog', () => {
    // Test: Debe renderizar el catálogo de útiles escolares (mockeado)
    it('should render the school supply catalog (mocked)', async () => {
      // Se simula el renderizado del catálogo y se verifica la respuesta
      const SchoolSupplyController = require('../../../controller/SchoolSupplyController');
      SchoolSupplyController.renderCatalog.mockImplementation((req, res) => res.status(200).send('ok'));
      const res = await request(app).get('/schoolSupply/catalog');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('ok');
      expect(SchoolSupplyController.renderCatalog).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta PUT /schoolSupply/:id
  describe('PUT /schoolSupply/:id', () => {
    // Test: Debe actualizar un útil escolar (mockeado)
    it('should update a school supply (mocked)', async () => {
      // Se simula la actualización de un útil escolar y se verifica la respuesta
      const SchoolSupplyController = require('../../../controller/SchoolSupplyController');
      SchoolSupplyController.updateSchoolSupply.mockImplementation((req, res) => res.json({ success: true }));
      const res = await request(app).put('/schoolSupply/1').send({ name: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(SchoolSupplyController.updateSchoolSupply).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta DELETE /schoolSupply/:id
  describe('DELETE /schoolSupply/:id', () => {
    // Test: Debe eliminar un útil escolar (mockeado)
    it('should delete a school supply (mocked)', async () => {
      // Se simula la eliminación de un útil escolar y se verifica la respuesta
      const SchoolSupplyController = require('../../../controller/SchoolSupplyController');
      SchoolSupplyController.deleteSchoolSupply.mockImplementation((req, res) => res.json({ deleted: true }));
      const res = await request(app).delete('/schoolSupply/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ deleted: true });
      expect(SchoolSupplyController.deleteSchoolSupply).toHaveBeenCalled();
    });
  });
});
