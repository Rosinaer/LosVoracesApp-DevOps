const SaleController = require('../../../controller/SaleController');
const Sale = require('../../../model/Sale');
const db = require('../../../model/Database');

jest.mock('../../../model/Database');
jest.mock('../../../model/Sale');

describe('SaleController', () => {
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
  // Pruebas de getSales
  // ----------------------
  describe('getSales', () => {
    // Test: Debe devolver las ventas como JSON
    it('should return sales as JSON', async () => {
      // Se simula la respuesta de la base de datos y se verifica que la función responde correctamente
      const sales = [{ saleId: '1' }, { saleId: '2' }];
      db.readJSON.mockResolvedValue(sales);

      await SaleController.getSales(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(sales);
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      db.readJSON.mockRejectedValue(new Error('fail'));

      await SaleController.getSales(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // ----------------------
  // Pruebas de createSale
  // ----------------------
  describe('createSale', () => {
    // Test: Debe crear una venta y devolver 201
    it('should create a sale and return 201', async () => {
      // Se simulan los datos de entrada y la creación de una venta, verificando la respuesta exitosa
      req.body = {
        product: 'p1',
        date: '2024-01-01',
        description: 'desc',
        category: 'cat',
        price: 10,
        quantityProduct: 2,
        total: 20
      };
      const sales = [];
      db.readJSON.mockResolvedValue(sales);
      const mockSale = { ...req.body, saleId: '1' };
      Sale.mockImplementation(() => mockSale);
      db.writeJSON.mockResolvedValue();

      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await SaleController.createSale(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(Sale).toHaveBeenCalledWith(
        '1',
        req.body.product,
        req.body.date,
        req.body.description,
        req.body.category,
        req.body.price,
        req.body.quantityProduct,
        req.body.total
      );
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [mockSale]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSale);

      Date.now = realDateNow;
    });

    // Test: Debe devolver 400 si faltan campos obligatorios
    it('should return 400 if required fields are missing', async () => {
      // Se simulan datos incompletos y se verifica la respuesta de error
      req.body = { product: '', date: '', description: '', category: '', price: null, quantityProduct: null, total: null };

      await SaleController.createSale(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan campos obligatorios' });
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      req.body = {
        product: 'p1',
        date: '2024-01-01',
        description: 'desc',
        category: 'cat',
        price: 10,
        quantityProduct: 2,
        total: 20
      };
      db.readJSON.mockRejectedValue(new Error('fail'));

      await SaleController.createSale(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // ----------------------
  // Pruebas de updateSale
  // ----------------------
  describe('updateSale', () => {
    // Test: Debe actualizar una venta y devolverla
    it('should update a sale and return it', async () => {
      // Se simulan los datos de actualización y se verifica la respuesta exitosa
      req.params.id = '1';
      req.body = {
        product: 'p1',
        date: '2024-01-01',
        description: 'desc',
        category: 'cat',
        price: 10,
        quantityProduct: 2,
        total: 20
      };
      const sales = [{ saleId: '1', description: 'old' }];
      db.readJSON.mockResolvedValue(sales);
      db.writeJSON.mockResolvedValue();

      await SaleController.updateSale(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ description: 'desc' }));
    });

    // Test: Debe devolver 404 si la venta no existe
    it('should return 404 if sale not found', async () => {
      // Se simula la ausencia de la venta y se verifica la respuesta de error
      req.params.id = '2';
      req.body = {};
      db.readJSON.mockResolvedValue([{ saleId: '1' }]);

      await SaleController.updateSale(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Venta no encontrada' });
    });
  });

  // ----------------------
  // Pruebas de deleteSale
  // ----------------------
  describe('deleteSale', () => {
    // Test: Debe eliminar una venta y devolver un mensaje
    it('should delete a sale and return a message', async () => {
      // Se simula la eliminación de una venta y se verifica la respuesta exitosa
      req.params.id = '1';
      const sales = [{ saleId: '1' }, { saleId: '2' }];
      db.readJSON.mockResolvedValue(sales);
      db.writeJSON.mockResolvedValue();

      await SaleController.deleteSale(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [{ saleId: '2' }]);
      expect(res.json).toHaveBeenCalledWith({ message: 'Venta eliminada' });
    });
  });

  // ----------------------
  // Pruebas de getTopSellingProducts
  // ----------------------
  describe('getTopSellingProducts', () => {
    // Test: Debe devolver los productos más vendidos de la semana por defecto
    it('should return top selling products for the week by default', async () => {
      // Se simula la consulta de ventas y se verifica el cálculo de productos más vendidos
      const now = new Date('2024-06-01');
      jest.spyOn(global, 'Date').mockImplementation(() => now);

      const sales = [
        { product: 'p1', date: '2024-05-30', quantityProduct: 2 },
        { product: 'p2', date: '2024-05-29', quantityProduct: 5 },
        { product: 'p1', date: '2024-05-28', quantityProduct: 3 },
        { product: 'p3', date: '2024-04-01', quantityProduct: 10 }
      ];
      db.readJSON.mockResolvedValue(sales);

      req.query = {}; // default range

      await SaleController.getTopSellingProducts(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { productId: 'p3', quantity: 10 },
        { productId: 'p1', quantity: 5 },
        { productId: 'p2', quantity: 5 }
      ]);

      global.Date.mockRestore();
    });

    // Test: Debe devolver productos aunque no haya ventas en el rango
    it('should return products even if no sales in range', async () => {
      // Se simula la ausencia de ventas en el rango y se verifica la respuesta
      const now = new Date('2024-06-01');
      jest.spyOn(global, 'Date').mockImplementation(() => now);

      db.readJSON.mockResolvedValue([
        { product: 'p1', date: '2024-01-01', quantityProduct: 2 }
      ]);
      req.query = {};

      await SaleController.getTopSellingProducts(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { productId: 'p1', quantity: 2 }
      ]);

      global.Date.mockRestore();
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      db.readJSON.mockRejectedValue(new Error('fail'));
      await SaleController.getTopSellingProducts(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });
});