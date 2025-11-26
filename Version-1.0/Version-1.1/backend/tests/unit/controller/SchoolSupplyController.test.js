const SchoolSupplyController = require('../../../controller/SchoolSupplyController');
const SchoolSupply = require('../../../model/SchoolSupply');

jest.mock('../../../model/SchoolSupply');

describe('SchoolSupplyController', () => {
  let req, res;

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

  // Tests para obtener útiles escolares
  describe('getSchoolSupplies', () => {
    it('should return school supplies as JSON', async () => {
      const supplies = [{ schoolSupplyId: '1' }, { schoolSupplyId: '2' }];
      SchoolSupply.find.mockResolvedValue(supplies);

      await SchoolSupplyController.getSchoolSupplies(req, res);

      expect(SchoolSupply.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(supplies);
    });

    it('should handle errors and return 500', async () => {
      SchoolSupply.find.mockRejectedValue(new Error('fail'));

      await SchoolSupplyController.getSchoolSupplies(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para crear útiles escolares
  describe('createSchoolSupply', () => {
    it('should create a school supply and return 201', async () => {
      req.body = {
        name: 'Pencil',
        price: 1.5,
        section: 'Stationery',
        stock: 100,
        brand: 'BrandX',
        description: 'HB pencil'
      };
      
      const mockSchoolSupply = { 
        ...req.body, 
        schoolSupplyId: '1',
        save: jest.fn().mockResolvedValue()
      };
      SchoolSupply.mockImplementation(() => mockSchoolSupply);

      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await SchoolSupplyController.createSchoolSupply(req, res);

      expect(SchoolSupply).toHaveBeenCalledWith({
        schoolSupplyId: '1',
        name: req.body.name,
        price: req.body.price,
        section: req.body.section,
        stock: req.body.stock,
        brand: req.body.brand,
        description: req.body.description
      });
      expect(mockSchoolSupply.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSchoolSupply);

      Date.now = realDateNow;
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { name: '', price: null, brand: '' };

      await SchoolSupplyController.createSchoolSupply(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan campos obligatorios' });
    });

    it('should handle errors and return 500', async () => {
      req.body = {
        name: 'Pencil',
        price: 1.5,
        section: 'Stationery',
        stock: 100,
        brand: 'BrandX',
        description: 'HB pencil'
      };
      
      const mockSchoolSupply = { 
        save: jest.fn().mockRejectedValue(new Error('fail'))
      };
      SchoolSupply.mockImplementation(() => mockSchoolSupply);

      await SchoolSupplyController.createSchoolSupply(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para actualizar útiles escolares
  describe('updateSchoolSupply', () => {
    it('should update a school supply and return it', async () => {
      req.params.id = '1';
      req.body = {
        name: 'Updated Pencil',
        price: 2.0,
        section: 'Updated Section',
        stock: 50,
        brand: 'Updated Brand',
        description: 'Updated description'
      };
      
      const mockSchoolSupply = {
        schoolSupplyId: '1',
        name: 'Old name',
        save: jest.fn().mockResolvedValue()
      };
      SchoolSupply.findOne.mockResolvedValue(mockSchoolSupply);

      await SchoolSupplyController.updateSchoolSupply(req, res);

      expect(SchoolSupply.findOne).toHaveBeenCalledWith({ schoolSupplyId: '1' });
      expect(mockSchoolSupply.name).toBe(req.body.name);
      expect(mockSchoolSupply.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockSchoolSupply);
    });

    it('should return 404 if school supply not found', async () => {
      req.params.id = '2';
      req.body = {};
      SchoolSupply.findOne.mockResolvedValue(null);

      await SchoolSupplyController.updateSchoolSupply(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Útil escolar no encontrado' });
    });
  });

  // Tests para eliminar útiles escolares
  describe('deleteSchoolSupply', () => {
    it('should delete a school supply and return a message', async () => {
      req.params.id = '1';
      const mockSchoolSupply = {
        schoolSupplyId: '1',
        deleteOne: jest.fn().mockResolvedValue()
      };
      SchoolSupply.findOne.mockResolvedValue(mockSchoolSupply);

      await SchoolSupplyController.deleteSchoolSupply(req, res);

      expect(SchoolSupply.findOne).toHaveBeenCalledWith({ schoolSupplyId: '1' });
      expect(mockSchoolSupply.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Útil escolar eliminado' });
    });

    it('should return 404 if school supply not found', async () => {
      req.params.id = '2';
      SchoolSupply.findOne.mockResolvedValue(null);

      await SchoolSupplyController.deleteSchoolSupply(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Útil escolar no encontrado' });
    });
  });

  // Tests para renderizar catálogo
  describe('renderCatalog', () => {
    it('should render the catalog with school supplies', async () => {
      const supplies = [{ name: 'Pencil' }];
      SchoolSupply.find.mockResolvedValue(supplies);

      await SchoolSupplyController.renderCatalog(req, res);

      expect(SchoolSupply.find).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('SchoolSupplyCatalog', { schoolSupplies: supplies });
    });

    it('should handle errors and return 500', async () => {
      SchoolSupply.find.mockRejectedValue(new Error('fail'));

      await SchoolSupplyController.renderCatalog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al cargar el catálogo de útiles escolares');
    });
  });
});
