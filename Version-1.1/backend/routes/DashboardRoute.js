const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/AuthMiddleware');
const DashboardController = require('../controller/DashboardController');

router.get('/dashboard', authenticateToken, authorizeRole('owner', 'manager'), (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = router;
