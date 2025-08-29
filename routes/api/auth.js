var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');
var jwt = require('jsonwebtoken');

// 🟢 Registro de cliente
router.post('/register', async (req, res) => {
  try {
    const userId = await usuariosModel.createClient(req.body);
    res.json({ success: true, userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar cliente' });
  }
});

// 🟢 Login de cliente
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cliente = await usuariosModel.getClientByEmailAndPassword(email, password);

    if (!cliente) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Crear token JWT
    const token = jwt.sign(
      { id: cliente.id, rol: cliente.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
});

// 🟢 Ruta protegida de prueba
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.json({ success: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

module.exports = router;
