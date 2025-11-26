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

const mockMagazines = [{ title: 'Test Magazine', editor: 'Editor' }];
const newMagazine = { title: 'New Magazine', issn: '1234', price: 5, editor: 'Editor' };

jest.mock('../../../controller/MagazineController', () => ({
  getMagazines: (req, res) => res.json(mockMagazines),
  createMagazine: (req, res) => res.status(201).json(newMagazine),
  updateMagazine: jest.fn(),
  deleteMagazine: jest.fn(),
  renderCatalog: jest.fn(),
  updateMagazineStock: jest.fn((req, res) => res.status(200).json({ success: true })),
}));

const MagazineRoute = require('../../../routes/MagazineRoute');

const app = express();
app.use(express.json());
app.use('/magazine', MagazineRoute);
// Pruebas unitarias para MagazineRoute

describe('MagazineRoute', () => {
  // Pruebas para la ruta GET /magazine
  describe('GET /magazine', () => {
    // Test: Debe devolver una lista de revistas (mockeado)
    it('should return a list of magazines (mocked)', async () => {
      // Se realiza una petición GET y se verifica la respuesta y el contenido
      const res = await request(app).get('/magazine');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockMagazines);
    });
  });

  // Pruebas para la ruta POST /magazine
  describe('POST /magazine', () => {
    // Test: Debe crear una nueva revista (mockeado)
    it('should create a new magazine (mocked)', async () => {
      // Se realiza una petición POST y se verifica la respuesta y el contenido
      const res = await request(app).post('/magazine').send(newMagazine);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newMagazine);
    });
  });

  // Pruebas para la ruta GET /magazine/catalog
  describe('GET /magazine/catalog', () => {
    // Test: Debe renderizar el catálogo de revistas (mockeado)
    it('should render the magazine catalog (mocked)', async () => {
      // Se simula el renderizado del catálogo y se verifica la respuesta
      const MagazineController = require('../../../controller/MagazineController');
      MagazineController.renderCatalog.mockImplementation((req, res) => res.status(200).send('ok'));
      const res = await request(app).get('/magazine/catalog');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('ok');
      expect(MagazineController.renderCatalog).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta PUT /magazine/:id
  describe('PUT /magazine/:id', () => {
    // Test: Debe actualizar una revista (mockeado)
    it('should update a magazine (mocked)', async () => {
      // Se simula la actualización de una revista y se verifica la respuesta
      const MagazineController = require('../../../controller/MagazineController');
      MagazineController.updateMagazine.mockImplementation((req, res) => res.json({ success: true }));
      const res = await request(app).put('/magazine/1').send({ title: 'Updated' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(MagazineController.updateMagazine).toHaveBeenCalled();
    });
  });

  // Pruebas para la ruta DELETE /magazine/:id
  describe('DELETE /magazine/:id', () => {
    // Test: Debe eliminar una revista (mockeado)
    it('should delete a magazine (mocked)', async () => {
      // Se simula la eliminación de una revista y se verifica la respuesta
      const MagazineController = require('../../../controller/MagazineController');
      MagazineController.deleteMagazine.mockImplementation((req, res) => res.json({ deleted: true }));
      const res = await request(app).delete('/magazine/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ deleted: true });
      expect(MagazineController.deleteMagazine).toHaveBeenCalled();
    });
  });
});
