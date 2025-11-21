const express = require('express');
const router = express.Router();
const OrderController = require('../controller/OrderController');
const { authenticateToken, authorizeRole } = require('../middleware/AuthMiddleware');

router.get('/catalog', authenticateToken, OrderController.renderOrders);

router.get('/', authenticateToken, authorizeRole('owner'), OrderController.getOrders);
router.post('/', authenticateToken, authorizeRole('owner'), OrderController.createOrder);
router.put('/:id', authenticateToken, authorizeRole('owner'), OrderController.updateOrder);
router.delete('/:id', authenticateToken, authorizeRole('owner'), OrderController.deleteOrder);

module.exports = router;
