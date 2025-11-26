
const express = require('express');
const router = express.Router();
const { logEvent } = require('../utils/requestLogger'); 

router.post('/', async (req, res) => {
  const { event, details } = req.body;
  try {
    await logEvent(event, details);
    res.status(200).json({ message: 'Log recibido' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar log' });
  }
});

module.exports = router;
