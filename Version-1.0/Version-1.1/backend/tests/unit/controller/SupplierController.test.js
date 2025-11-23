const SupplierController = require('../../../controller/SupplierController');
const Supplier = require('../../../model/Supplier');

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
      Supplier.find.mockResolvedValue(suppliers);

      await SupplierController.getSuppliers(req, res);

      expect(Supplier.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(suppliers);
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      Supplier.find.mockRejectedValue(new Error('fail'));

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
      
      const mockSupplier = { 
        ...req.body, 
        supplierId: '1',
        save: jest.fn().mockResolvedValue()
      };
      Supplier.mockImplementation(() => mockSupplier);

      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await SupplierController.createSupplier(req, res);

      expect(Supplier).toHaveBeenCalledWith({
        supplierId: '1',
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        category: req.body.category,
        catalog: req.body.catalog
      });
      expect(mockSupplier.save).toHaveBeenCalled();
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
      
      const mockSupplier = { 
        save: jest.fn().mockRejectedValue(new Error('fail'))
      };
      Supplier.mockImplementation(() => mockSupplier);

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
      
      const mockSupplier = {
        supplierId: '1',
        name: 'Old',
        save: jest.fn().mockResolvedValue()
      };
      Supplier.findOne.mockResolvedValue(mockSupplier);

      await SupplierController.updateSupplier(req, res);

      expect(Supplier.findOne).toHaveBeenCalledWith({ supplierId: '1' });
      expect(mockSupplier.name).toBe('Updated');
      expect(mockSupplier.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockSupplier);
    });

    // Test: Debe devolver 404 si el proveedor no existe
    it('should return 404 if supplier not found', async () => {
      // Se simula la ausencia del proveedor y se verifica la respuesta de error
      req.params.id = '2';
      req.body = {};
      Supplier.findOne.mockResolvedValue(null);

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
      const mockSupplier = {
        supplierId: '1',
        deleteOne: jest.fn().mockResolvedValue()
      };
      Supplier.findOne.mockResolvedValue(mockSupplier);

      await SupplierController.deleteSupplier(req, res);

      expect(Supplier.findOne).toHaveBeenCalledWith({ supplierId: '1' });
      expect(mockSupplier.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Proveedor eliminado' });
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
        { supplierId: '1', category: 'Books' }
      ];
      Supplier.find.mockResolvedValue(suppliers);

      await SupplierController.getSuppliersByCategory(req, res);

      expect(Supplier.find).toHaveBeenCalledWith({ 
        category: { $regex: new RegExp(`^${req.params.category}$`, 'i') } 
      });
      expect(res.json).toHaveBeenCalledWith(suppliers);
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
      const supplier = { supplierId: '1', name: 'Supplier1' };
      Supplier.findOne.mockResolvedValue(supplier);

      await SupplierController.getSupplierById(req, res);

      expect(Supplier.findOne).toHaveBeenCalledWith({ supplierId: '1' });
      expect(res.json).toHaveBeenCalledWith(supplier);
    });

    // Test: Debe devolver 404 si el proveedor no existe
    it('should return 404 if supplier not found', async () => {
      // Se simula la ausencia del proveedor y se verifica la respuesta de error
      req.params.id = '3';
      Supplier.findOne.mockResolvedValue(null);

      await SupplierController.getSupplierById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Proveedor no encontrado' });
    });
  });
});