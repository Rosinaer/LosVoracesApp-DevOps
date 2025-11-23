const express = require('express');
const router = express.Router();
const BookController = require('../controller/BookController');
const { authenticateToken, authorizeRole } = require('../middleware/AuthMiddleware');

router.get('/catalog', BookController.renderCatalog);

router.get('/', authenticateToken, BookController.getBooks);
router.post('/', authenticateToken, BookController.createBook);
router.put('/:id', authenticateToken, BookController.updateBook);
router.delete('/:id', authenticateToken, authorizeRole('owner'), BookController.deleteBook);

router.patch('/:id/stock', authenticateToken, BookController.updateBookStock);

module.exports = router;