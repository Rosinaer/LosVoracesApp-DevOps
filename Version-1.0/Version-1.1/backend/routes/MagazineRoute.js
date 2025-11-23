const express = require('express');
const router = express.Router();

const MagazineController = require('../controller/MagazineController');
const { authenticateToken, authorizeRole } = require('../middleware/AuthMiddleware');


router.get('/catalog', MagazineController.renderCatalog);

router.get('/', authenticateToken, MagazineController.getMagazines);
router.post('/', authenticateToken, MagazineController.createMagazine);
router.put('/:id', authenticateToken, MagazineController.updateMagazine);
router.delete('/:id', authenticateToken, authorizeRole('owner'), MagazineController.deleteMagazine);

router.patch('/:id/stock', authenticateToken, MagazineController.updateMagazineStock);

module.exports = router;