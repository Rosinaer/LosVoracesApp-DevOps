const express = require('express');
const router = express.Router();
const AuthController = require('../controller/AuthController');

const { authenticateToken } = require('../middleware/AuthMiddleware');

router.get('/me', authenticateToken, (req, res) => {
  res.json({ username: req.user.username, role: req.user.role });
});

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.json({ message: 'Sesión cerrada' });
});

module.exports = router;

