const User = require('../model/User');
const jwt = require('jsonwebtoken');

const { logEvent } = require("../utils/requestLogger.js");

//Registro
async function register(req, res) {
  try {
    const { username, password, role } = req.body;

    await logEvent("auth_register_attempt", { username });

    if (!username || !password) {
      await logEvent("auth_register_missing_fields", { username });
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
    }

    const user = new User({ username, password, role });
    await user.save();

   await logEvent("auth_register_success", { userId: user._id, username });


    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,            
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/dashboard');
    }


    res.status(201).json({ message: 'Usuario registrado correctamente', token });
  } catch (error) {
    console.error('Error en register:', error);
    
    if (error.code === 11000) {
      await logEvent("auth_register_duplicate_username", { username: req.body.username });
      return res.status(400).json({ error: 'Ese nombre de usuario ya está registrado' });
    }
    
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

//Login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    await logEvent("auth_login_attempt", { username });

    const user = await User.findOne({ username });
    if (!user) {
      
      await logEvent("auth_login_failed_user_not_found", { username });
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await logEvent("auth_login_failed_invalid_password", { username });
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    await logEvent("auth_login_success", { userId: user._id, username });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,            
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    if (req.headers.accept?.includes('text/html')) {
      return res.redirect('/dashboard');
    }

    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {

     await logEvent("auth_login_exception", {
      username: req.body.username,
      error: error.message
    });
    
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

module.exports = {
  register,
  login
};

