// Tests unitarios para el controlador MagazineController
const MagazineController = require('../../../controller/MagazineController');
const Magazine = require('../../../model/Magazine');

// Se mockean las dependencias externas para aislar el controlador
jest.mock('../../../model/Magazine');

// Grupo principal de tests para MagazineController
describe('MagazineController', () => {
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

  // Tests para obtener revistas
  describe('getMagazines', () => {
    it('should return magazines as JSON', async () => {
      // Verifica que se devuelvan las revistas correctamente en formato JSON
      const magazines = [{ name: 'Magazine1' }, { name: 'Magazine2' }];
      Magazine.find.mockResolvedValue(magazines);

      await MagazineController.getMagazines(req, res);

      expect(Magazine.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(magazines);
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores y el status 500
      Magazine.find.mockRejectedValue(new Error('fail'));

      await MagazineController.getMagazines(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para crear una revista
  describe('createMagazine', () => {
    it('should create a magazine and return 201', async () => {
      // Verifica la creación exitosa de una revista
      req.body = {
        name: 'Test Magazine',
        price: 10,
        issn: '1234-5678',
        number: 1,
        section: 'Section',
        date: '2024-01-01',
        stock: 5,
        issueNumber: 42
      };
      
      const mockMagazine = { 
        ...req.body, 
        magazineId: '1',
        save: jest.fn().mockResolvedValue()
      };
      Magazine.mockImplementation(() => mockMagazine);

      const realDateNow = Date.now;
      Date.now = jest.fn(() => 1);

      await MagazineController.createMagazine(req, res);

      expect(Magazine).toHaveBeenCalledWith({
        magazineId: '1',
        name: req.body.name,
        price: req.body.price,
        issn: req.body.issn,
        number: req.body.number,
        section: req.body.section,
        date: req.body.date,
        stock: req.body.stock,
        issueNumber: req.body.issueNumber
      });
      expect(mockMagazine.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMagazine);

      Date.now = realDateNow;
    });

    it('should return 400 if required fields are missing', async () => {
      // Verifica que se retorne 400 si faltan campos obligatorios
      req.body = { name: '', issn: '', price: null, issueNumber: null };

      await MagazineController.createMagazine(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Faltan campos obligatorios' });
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores inesperados
      req.body = {
        name: 'Test Magazine',
        price: 10,
        issn: '1234-5678',
        number: 1,
        section: 'Section',
        date: '2024-01-01',
        stock: 5,
        issueNumber: 42
      };
      
      const mockMagazine = { 
        save: jest.fn().mockRejectedValue(new Error('fail'))
      };
      Magazine.mockImplementation(() => mockMagazine);

      await MagazineController.createMagazine(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  // Tests para actualizar una revista
  describe('updateMagazine', () => {
    it('should update a magazine and return it', async () => {
      // Verifica la actualización exitosa de una revista
      req.params.id = '1';
      req.body = {
        name: 'Updated',
        price: 20,
        issn: '1234-5678',
        number: 2,
        section: 'Section',
        date: '2024-02-02',
        stock: 10,
        issueNumber: 43
      };
      const mockMagazine = { magazineId: '1', name: 'Old', save: jest.fn().mockResolvedValue() };
      Magazine.findOne.mockResolvedValue(mockMagazine);

      await MagazineController.updateMagazine(req, res);

      expect(Magazine.findOne).toHaveBeenCalledWith({ magazineId: '1' });
      expect(mockMagazine.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated' }));
    });

    it('should return 404 if magazine not found', async () => {
      // Verifica que se retorne 404 si la revista no existe
      req.params.id = '2';
      req.body = {};
      Magazine.findOne.mockResolvedValue(null);

      await MagazineController.updateMagazine(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Revista no encontrada' });
    });
  });

  // Tests para eliminar una revista
  describe('deleteMagazine', () => {
    it('should delete a magazine and return a message', async () => {
      // Verifica la eliminación exitosa de una revista
      req.params.id = '1';
      const mockMagazine = { magazineId: '1', deleteOne: jest.fn().mockResolvedValue() };
      Magazine.findOne.mockResolvedValue(mockMagazine);

      await MagazineController.deleteMagazine(req, res);

      expect(Magazine.findOne).toHaveBeenCalledWith({ magazineId: '1' });
      expect(mockMagazine.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Revista eliminada' });
    });
  });

  // Tests para renderizar el catálogo
  describe('renderCatalog', () => {
    it('should render the catalog with magazines', async () => {
      // Verifica que se renderice el catálogo correctamente
      const magazines = [{ name: 'Magazine1' }];
      Magazine.find.mockResolvedValue(magazines);

      await MagazineController.renderCatalog(req, res);

      expect(res.render).toHaveBeenCalledWith('MagazineCatalog', { magazines });
    });

    it('should handle errors and return 500', async () => {
      // Verifica el manejo de errores al renderizar el catálogo
      Magazine.find.mockRejectedValue(new Error('fail'));

      await MagazineController.renderCatalog(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Error al cargar el catálogo de revistas');
    });
  });
});