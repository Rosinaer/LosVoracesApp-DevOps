const express = require('express');
const router = express.Router();
const schoolSupplyController = require('../controller/SchoolSupplyController');
const { authenticateToken, authorizeRole } = require('../middleware/AuthMiddleware');

router.get('/catalog', schoolSupplyController.renderCatalog);

router.get('/', authenticateToken, schoolSupplyController.getSchoolSupplies);
router.post('/', authenticateToken, schoolSupplyController.createSchoolSupply);
router.put('/:id', authenticateToken, schoolSupplyController.updateSchoolSupply);
router.delete('/:id', authenticateToken, authorizeRole('owner'), schoolSupplyController.deleteSchoolSupply);

router.patch('/:id/stock', authenticateToken, schoolSupplyController.updateSchoolSupplyStock);

module.exports = router;