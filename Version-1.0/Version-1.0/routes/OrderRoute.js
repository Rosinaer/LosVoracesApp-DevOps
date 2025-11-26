const express = require('express');
const router = express.Router();
const OrderController = require('../controller/OrderController');

router.get('/', OrderController.getOrders);
router.post('/', OrderController.createOrder);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;