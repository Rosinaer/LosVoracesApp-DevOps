const SchoolSupplyController = require('../../../controller/SchoolSupplyController');
const SchoolSupply = require('../../../model/SchoolSupply');
const db = require('../../../model/Database');

jest.mock('../../../model/Database');
jest.mock('../../../model/SchoolSupply');

describe('SchoolSupplyController', () => {
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
  // Pruebas de getSchoolSupply
  // ----------------------
  describe('getSchoolSupply', () => {
    // Test: Debe devolver los útiles escolares como JSON
    it('should return school supplies as JSON', async () => {
      // Se simula la respuesta de la base de datos y se verifica que la función responde correctamente
      const supplies = [{ SchoolSupplyId: '1' }, { SchoolSupplyId: '2' }];
      db.readJSON.mockResolvedValue(supplies);

      await SchoolSupplyController.getSchoolSupply(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(supplies);
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      db.readJSON.mockRejectedValue(new Error('fail'));

      await SchoolSupplyController.getSchoolSupply(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // ----------------------
  // Pruebas de createSchoolSupply
  // ----------------------
  describe('createSchoolSupply', () => {
    // Test: Debe crear un útil escolar y devolver 201
    it('should create a school supply and return 201', async () => {
      // Se simulan los datos de entrada y la creación de un útil escolar, verificando la respuesta exitosa
      req.body = {
        name: 'Pencil',
        price: 1,
        section: 'A',
        stock: 100,
        brand: 'BrandX',
        description: 'HB pencil'
      };
      const supplies = [];
      db.readJSON.mockResolvedValue(supplies);
      const mockSupply = { ...req.body, SchoolSupplyId: '1' };
      SchoolSupply.mockImplementation(() => mockSupply);
      db.writeJSON.mockResolvedValue();

      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await SchoolSupplyController.createSchoolSupply(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(SchoolSupply).toHaveBeenCalledWith(
        '1',
        req.body.name,
        req.body.price,
        req.body.section,
        req.body.stock,
        req.body.brand,
        req.body.description
      );
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [mockSupply]);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSupply);

      Date.now = realDateNow;
    });

    // Test: Debe devolver 400 si faltan campos obligatorios
    it('should return 400 if required fields are missing', async () => {
      // Se simulan datos incompletos y se verifica la respuesta de error
      req.body = { name: '', price: null, brand: '' };

      await SchoolSupplyController.createSchoolSupply(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan campos obligatorios' });
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      req.body = {
        name: 'Pencil',
        price: 1,
        section: 'A',
        stock: 100,
        brand: 'BrandX',
        description: 'HB pencil'
      };
      db.readJSON.mockRejectedValue(new Error('fail'));

      await SchoolSupplyController.createSchoolSupply(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // ----------------------
  // Pruebas de updateSchoolSupply
  // ----------------------
  describe('updateSchoolSupply', () => {
    // Test: Debe actualizar un útil escolar y devolverlo
    it('should update a school supply and return it', async () => {
      // Se simulan los datos de actualización y se verifica la respuesta exitosa
      req.params.id = '1';
      req.body = {
        name: 'Pen',
        price: 2,
        section: 'B',
        stock: 50,
        brand: 'BrandY',
        description: 'Blue pen'
      };
      const supplies = [{ SchoolSupplyId: '1', name: 'Old' }];
      db.readJSON.mockResolvedValue(supplies);
      db.writeJSON.mockResolvedValue();

      await SchoolSupplyController.updateSchoolSupply(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Pen' }));
    });

    // Test: Debe devolver 404 si el útil escolar no existe
    it('should return 404 if school supply not found', async () => {
      // Se simula la ausencia del útil escolar y se verifica la respuesta de error
      req.params.id = '2';
      req.body = {};
      db.readJSON.mockResolvedValue([{ SchoolSupplyId: '1' }]);

      await SchoolSupplyController.updateSchoolSupply(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Util Escolar no encontrado' });
    });
  });

  // ----------------------
  // Pruebas de deleteSchoolSupply
  // ----------------------
  describe('deleteSchoolSupply', () => {
    // Test: Debe eliminar un útil escolar y devolver un mensaje
    it('should delete a school supply and return a message', async () => {
      // Se simula la eliminación de un útil escolar y se verifica la respuesta exitosa
      req.params.id = '1';
      const supplies = [{ SchoolSupplyId: '1' }, { SchoolSupplyId: '2' }];
      db.readJSON.mockResolvedValue(supplies);
      db.writeJSON.mockResolvedValue();

      await SchoolSupplyController.deleteSchoolSupply(req, res);

      expect(db.readJSON).toHaveBeenCalled();
      expect(db.writeJSON).toHaveBeenCalledWith(expect.any(String), [{ SchoolSupplyId: '2' }]);
      expect(res.json).toHaveBeenCalledWith({ message: 'Util Escolar eliminado' });
    });
  });

  // ----------------------
  // Pruebas de renderCatalog
  // ----------------------
  describe('renderCatalog', () => {
    // Test: Debe renderizar el catálogo con los útiles escolares
    it('should render the catalog with school supplies', async () => {
      // Se simula la consulta de útiles escolares y se verifica el renderizado
      const supplies = [{ name: 'Pencil' }];
      db.readJSON.mockResolvedValue(supplies);

      await SchoolSupplyController.renderCatalog(req, res);

      expect(res.render).toHaveBeenCalledWith('SchoolSupplyCatalog', { schoolSupplies: supplies });
    });

    // Test: Debe manejar errores y devolver 500
    it('should handle errors and return 500', async () => {
      // Se simula un error en la base de datos y se verifica la respuesta de error
      db.readJSON.mockRejectedValue(new Error('fail'));

      await SchoolSupplyController.renderCatalog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al cargar el catálogo de útiles escolares');
    });
  });
});