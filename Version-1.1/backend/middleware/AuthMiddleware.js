const jwt = require('jsonwebtoken');
const User = require('../model/User');

const authenticateToken = async (req, res, next) => {
  
  const authHeader = req.headers['authorization'];
  const tokenFromHeader = authHeader && authHeader.split(' ')[1];
  const token = req.cookies?.token || tokenFromHeader;

  if (!token) {
    
    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/auth/login');
    }
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    console.error('Token inválido:', err.message);
    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/auth/login');
    }
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole
};
