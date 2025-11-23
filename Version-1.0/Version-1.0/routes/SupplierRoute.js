const express = require('express');
const router = express.Router();
const SupplierController = require('../controller/SupplierController');

router.get('/supplier/:id', SupplierController.getSupplierById);
router.get('/supplier/category/:category', SupplierController.getSuppliersByCategory);

router.get('/', SupplierController.getSuppliers);
router.post('/', SupplierController.createSupplier);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);


module.exports = router;