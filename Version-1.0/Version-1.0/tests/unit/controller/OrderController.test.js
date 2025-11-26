// Tests unitarios para el controlador OrderController
const OrderController = require('../../../controller/OrderController');
const Order = require('../../../model/Order');
const db = require('../../../model/Database');

// Se mockean las dependencias externas para aislar el controlador
jest.mock('../../../model/Database');
jest.mock('../../../model/Order');

// Grupo principal de tests para OrderController
describe('OrderController', () => {
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

  // Tests para obtener órdenes
  describe('getOrders', () => {
    it('should return orders as JSON', async () => {
      // Verifica que se devuelvan las órdenes correctamente en formato JSON
      const orders = [{ orderId: '1' }, { orderId: '2' }];
      db.readJSON.mockResolvedValue(orders);

      await OrderController.getOrders(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(orders);
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores y el status 500
      db.readJSON.mockRejectedValue(new Error('fail'));

      await OrderController.getOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para crear una orden
  describe('createOrder', () => {
    it('should create an order and return 201', async () => {
      // Verifica la creación exitosa de una orden
      req.body = {
        product: { id: 'p1' },
        supplierId: 's1',
        date: '2024-01-01',
        description: 'desc',
        category: 'cat',
        price: 10,
        quantityProduct: 2,
        status: 'pending',
        total: 20
      };
      const orders = [];
      db.readJSON.mockResolvedValue(orders);
      const mockOrder = { ...req.body, orderId: '1' };
      Order.mockImplementation(() => mockOrder);
      db.writeJSON.mockResolvedValue();

      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await OrderController.createOrder(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(Order).toHaveBeenCalledWith(
        '1',
        req.body.supplierId,
        req.body.product,
        req.body.date,
        req.body.description,
        req.body.category,
        req.body.price,
        req.body.quantityProduct,
        req.body.status,
        req.body.total
      );
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [mockOrder]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockOrder);

      Date.now = realDateNow;
    });

    it('should return 400 if required fields are missing', async () => {
      // Verifica que se retorne 400 si faltan campos obligatorios
      req.body = { product: null, supplierId: '', date: '', description: '', category: '', price: null, quantityProduct: null, status: '', total: '' };

      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan campos obligatorios' });
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores inesperados
      req.body = {
        product: { id: 'p1' },
        supplierId: 's1',
        date: '2024-01-01',
        description: 'desc',
        category: 'cat',
        price: 10,
        quantityProduct: 2,
        status: 'pending',
        total: 20
      };
      db.readJSON.mockRejectedValue(new Error('fail'));

      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para actualizar una orden
  describe('updateOrder', () => {
    it('should update an order and return it', async () => {
      // Verifica la actualización exitosa de una orden
      req.params.id = '1';
      req.body = {
        product: { id: 'p1' },
        supplierId: 's1',
        date: '2024-01-01',
        description: 'desc',
        category: 'cat',
        price: 10,
        quantityProduct: 2,
        status: 'pending',
        total: 20
      };
      const orders = [{ orderId: '1', description: 'old' }];
      db.readJSON.mockResolvedValue(orders);
      db.writeJSON.mockResolvedValue();

      await OrderController.updateOrder(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ description: 'desc' }));
    });

    it('should return 404 if order not found', async () => {
      // Verifica que se retorne 404 si la orden no existe
      req.params.id = '2';
      req.body = {};
      db.readJSON.mockResolvedValue([{ orderId: '1' }]);

      await OrderController.updateOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Venta no encontrada' });
    });
  });

  // Tests para eliminar una orden
  describe('deleteOrder', () => {
    it('should delete an order and return a message', async () => {
      // Verifica la eliminación exitosa de una orden
      req.params.id = '1';
      const orders = [{ orderId: '1' }, { orderId: '2' }];
      db.readJSON.mockResolvedValue(orders);
      db.writeJSON.mockResolvedValue();

      await OrderController.deleteOrder(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [{ orderId: '2' }]);
      expect(res.json).toHaveBeenCalledWith({ message: 'Orden eliminada' });
    });
  });
});