// Tests unitarios para el controlador SaleController
const SaleController = require('../../../controller/SaleController');
const Sale = require('../../../model/Sale');

// Se mockean las dependencias externas para aislar el controlador
jest.mock('../../../model/Sale');

// Grupo principal de tests para SaleController
describe('SaleController', () => {
  let req, res;

  // Se ejecuta antes de cada test para inicializar los objetos req y res
  beforeEach(() => {
    req = { body: {}, params: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      render: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // Tests para obtener ventas
  describe('getSales', () => {
    it('should return sales as JSON', async () => {
      // Verifica que se devuelvan las ventas correctamente en formato JSON
      const sales = [{ saleId: '1' }, { saleId: '2' }];
      Sale.find.mockResolvedValue(sales);

      await SaleController.getSales(req, res);

      expect(Sale.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(sales);
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores y el status 500
      Sale.find.mockRejectedValue(new Error('fail'));

      await SaleController.getSales(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para crear ventas
  describe('createSale', () => {
    it('should create a sale and return 201', async () => {
      // Verifica la creación exitosa de una venta
      req.body = {
        product: 'Product1',
        date: '2025-01-01',
        description: 'Test sale',
        category: 'Books',
        price: 10,
        quantityProduct: 2,
        total: 20
      };
      
      const mockSale = { 
        ...req.body, 
        saleId: '1',
        save: jest.fn().mockResolvedValue()
      };
      Sale.mockImplementation(() => mockSale);

      // Mock Date.now para control de ID
      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await SaleController.createSale(req, res);

      expect(Sale).toHaveBeenCalledWith({
        saleId: '1',
        product: req.body.product,
        date: req.body.date,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        quantityProduct: req.body.quantityProduct,
        total: req.body.total
      });
      expect(mockSale.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSale);

      // Restaurar Date.now
      Date.now = realDateNow;
    });

    it('should return 400 if required fields are missing', async () => {
      // Verifica que se retorne 400 si faltan campos obligatorios
      req.body = { product: '', date: '', description: '', category: '', price: null, quantityProduct: null, total: null };

      await SaleController.createSale(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan campos obligatorios' });
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores interno
      req.body = {
        product: 'Product1',
        date: '2025-01-01',
        description: 'Test sale',
        category: 'Books',
        price: 10,
        quantityProduct: 2,
        total: 20
      };
      
      const mockSale = { 
        save: jest.fn().mockRejectedValue(new Error('fail'))
      };
      Sale.mockImplementation(() => mockSale);

      await SaleController.createSale(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para actualizar ventas
  describe('updateSale', () => {
    it('should update a sale and return it', async () => {
      // Verifica la actualización exitosa de una venta
      req.params.id = '1';
      req.body = {
        product: 'Updated Product',
        date: '2025-01-02',
        description: 'Updated description',
        category: 'Updated Category',
        price: 15,
        quantityProduct: 3,
        total: 45
      };
      
      const mockSale = {
        saleId: '1',
        product: 'Old Product',
        save: jest.fn().mockResolvedValue()
      };
      Sale.findOne.mockResolvedValue(mockSale);

      await SaleController.updateSale(req, res);

      expect(Sale.findOne).toHaveBeenCalledWith({ saleId: '1' });
      expect(mockSale.product).toBe(req.body.product);
      expect(mockSale.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockSale);
    });

    it('should return 404 if sale not found', async () => {
      // Verifica que se retorne 404 si la venta no existe
      req.params.id = '2';
      req.body = {};
      Sale.findOne.mockResolvedValue(null);

      await SaleController.updateSale(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Venta no encontrada' });
    });
  });

  // Tests para eliminar ventas
  describe('deleteSale', () => {
    it('should delete a sale and return a message', async () => {
      // Verifica la eliminación exitosa de una venta
      req.params.id = '1';
      const mockSale = {
        saleId: '1',
        deleteOne: jest.fn().mockResolvedValue()
      };
      Sale.findOne.mockResolvedValue(mockSale);

      await SaleController.deleteSale(req, res);

      expect(Sale.findOne).toHaveBeenCalledWith({ saleId: '1' });
      expect(mockSale.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Venta eliminada' });
    });

    it('should return 404 if sale not found', async () => {
      // Verifica que se retorne 404 si la venta no existe
      req.params.id = '2';
      Sale.findOne.mockResolvedValue(null);

      await SaleController.deleteSale(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Venta no encontrada' });
    });
  });

  // Tests para productos más vendidos
  describe('getTopSellingProducts', () => {
    it('should return top selling products for the week by default', async () => {
      // Verifica que se devuelvan los productos más vendidos de la semana
      const sales = [
        { product: 'p1', quantityProduct: 5 },
        { product: 'p2', quantityProduct: 3 },
        { product: 'p1', quantityProduct: 2 }
      ];
      Sale.find.mockResolvedValue(sales);

      req.query = {}; // default range

      await SaleController.getTopSellingProducts(req, res);

      expect(Sale.find).toHaveBeenCalledWith(expect.objectContaining({
        date: expect.objectContaining({
          $gte: expect.any(Date),
          $lte: expect.any(Date)
        })
      }));
      expect(res.json).toHaveBeenCalledWith([
        { productId: 'p1', quantity: 7 },
        { productId: 'p2', quantity: 3 }
      ]);
    });

    it('should return products even if no sales in range', async () => {
      // Verifica que se manejen correctamente los casos sin ventas
      Sale.find.mockResolvedValue([]);
      req.query = {};

      await SaleController.getTopSellingProducts(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores
      Sale.find.mockRejectedValue(new Error('fail'));
      
      await SaleController.getTopSellingProducts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });
});
