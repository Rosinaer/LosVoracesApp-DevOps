const SupplierController = require('../../../controller/SupplierController');
const Supplier = require('../../../model/Supplier');
const db = require('../../../model/Database');

jest.mock('../../../model/Database');
jest.mock('../../../model/Supplier');

describe('SupplierController', () => {
  // Se definen variables simuladas para las peticiones y respuestas HTTP
  let req, res;

  beforeEach(() => {
    // Se inicializan los mocks antes de cada test
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      render: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ----------------------
  // Pruebas de getSuppliers
  // ----------------------
  describe('getSuppliers', () => {
    // Test: Debe devolver los proveedores como JSON
    it('should return suppliers as JSON', async () => {
      // Se simula la respuesta de la base de datos y se verifica que la función responde correctamente
      const suppliers = [{ supplierId: '1' }, { supplierId: '2' }];
      db.readJSON.mockResolvedValue(suppliers);

      await SupplierController.getSuppliers(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(suppliers);
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      db.readJSON.mockRejectedValue(new Error('fail'));

      await SupplierController.getSuppliers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // ----------------------
  // Pruebas de createSupplier
  // ----------------------
  describe('createSupplier', () => {
    // Test: Debe crear un proveedor y devolver 201
    it('should create a supplier and return 201', async () => {
      // Se simulan los datos de entrada y la creación de un proveedor, verificando la respuesta exitosa
      req.body = {
        name: 'Supplier1',
        phoneNumber: '123456789',
        email: 'test@example.com',
        category: 'Books',
        catalog: []
      };
      const suppliers = [];
      db.readJSON.mockResolvedValue(suppliers);
      const mockSupplier = { ...req.body, supplierId: '1' };
      Supplier.mockImplementation(() => mockSupplier);
      db.writeJSON.mockResolvedValue();

      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await SupplierController.createSupplier(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(Supplier).toHaveBeenCalledWith(
        '1',
        req.body.name,
        req.body.phoneNumber,
        req.body.email,
        req.body.category,
        req.body.catalog
      );
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [mockSupplier]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSupplier);

      Date.now = realDateNow;
    });

    // Test: Debe devolver 400 si faltan campos obligatorios
    it('should return 400 if required fields are missing', async () => {
      // Se simulan datos incompletos y se verifica la respuesta de error
      req.body = { name: '', phoneNumber: '', email: '', category: '', catalog: '' };

      await SupplierController.createSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan campos obligatorios' });
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      req.body = {
        name: 'Supplier1',
        phoneNumber: '123456789',
        email: 'test@example.com',
        category: 'Books',
        catalog: []
      };
      db.readJSON.mockRejectedValue(new Error('fail'));

      await SupplierController.createSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // ----------------------
  // Pruebas de updateSupplier
  // ----------------------
  describe('updateSupplier', () => {
    // Test: Debe actualizar un proveedor y devolverlo
    it('should update a supplier and return it', async () => {
      // Se simulan los datos de actualización y se verifica la respuesta exitosa
      req.params.id = '1';
      req.body = {
        name: 'Updated',
        phoneNumber: '987654321',
        email: 'updated@example.com',
        category: 'Magazines',
        catalog: []
      };
      const suppliers = [{ id: '1', name: 'Old' }];
      db.readJSON.mockResolvedValue(suppliers);
      db.writeJSON.mockResolvedValue();

      await SupplierController.updateSupplier(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated' }));
    });

    // Test: Debe devolver 404 si el proveedor no existe
    it('should return 404 if supplier not found', async () => {
      // Se simula la ausencia del proveedor y se verifica la respuesta de error
      req.params.id = '2';
      req.body = {};
      db.readJSON.mockResolvedValue([{ id: '1' }]);

      await SupplierController.updateSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Proveedor no encontrado' });
    });
  });

  // ----------------------
  // Pruebas de deleteSupplier
  // ----------------------
  describe('deleteSupplier', () => {
    // Test: Debe eliminar un proveedor y devolver un mensaje
    it('should delete a supplier and return a message', async () => {
      // Se simula la eliminación de un proveedor y se verifica la respuesta exitosa
      req.params.id = '1';
      const suppliers = [{ supplierId: '1' }, { supplierId: '2' }];
      db.readJSON.mockResolvedValue(suppliers);
      db.writeJSON.mockResolvedValue();

      await SupplierController.deleteSupplier(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [{ supplierId: '2' }]);
      expect(res.json).toHaveBeenCalledWith({ messaje: 'Proveedor eliminado' });
    });
  });

  // ----------------------
  // Pruebas de getSuppliersByCategory
  // ----------------------
  describe('getSuppliersByCategory', () => {
    // Test: Debe devolver los proveedores filtrados por categoría
    it('should return suppliers filtered by category', async () => {
      // Se simula la consulta de proveedores por categoría y se verifica la respuesta
      req.params.category = 'books';
      const suppliers = [
        { supplierId: '1', category: 'Books' },
        { supplierId: '2', category: 'Magazines' }
      ];
      db.readJSON.mockResolvedValue(suppliers);

      await SupplierController.getSuppliersByCategory(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { supplierId: '1', category: 'Books' }
      ]);
    });
  });

  // ----------------------
  // Pruebas de getSupplierById
  // ----------------------
  describe('getSupplierById', () => {
    // Test: Debe devolver un proveedor por id
    it('should return a supplier by id', async () => {
      // Se simula la consulta de un proveedor por id y se verifica la respuesta
      req.params.id = '1';
      const suppliers = [{ supplierId: '1', name: 'Supplier1' }];
      db.readJSON.mockResolvedValue(suppliers);

      await SupplierController.getSupplierById(req, res);

      expect(res.json).toHaveBeenCalledWith({ supplierId: '1', name: 'Supplier1' });
    });

    // Test: Debe devolver 404 si el proveedor no existe
    it('should return 404 if supplier not found', async () => {
      // Se simula la ausencia del proveedor y se verifica la respuesta de error
      req.params.id = '3';
      db.readJSON.mockResolvedValue([{ supplierId: '1' }]);

      await SupplierController.getSupplierById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Proveedor no encontrado' });
    });
  });
});