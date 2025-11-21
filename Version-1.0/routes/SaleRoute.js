const express = require('express');
const router = express.Router();
const SaleController = require('../controller/SaleController');

router.get('/', SaleController.getSales);
router.post('/', SaleController.createSale);
router.put('/:id', SaleController.updateSale);
router.delete('/:id', SaleController.deleteSale);
router.get('/top-products', SaleController.getTopSellingProducts);

module.exports = router;