var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');
var salesModel = require('./../../models/salesModel');
var jwt = require('jsonwebtoken');

// 🛡️ Middleware para proteger rutas de la API con JWT
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos el usuario para las siguientes funciones
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// 🟢 Registro de cliente
router.post('/register', async (req, res) => {
  try {
    const result = await usuariosModel.createClient(req.body);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    res.json({ success: true, userId: result.insertId });

  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, message: "El usuario ya existe (duplicado en DB)" });
    }
    res.status(500).json({ success: false, message: 'Error al registrar cliente' });
  }
});

// 🟢 Login de cliente
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cliente = await usuariosModel.getClientByEmailAndPassword(email, password);

    if (!cliente) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: cliente.id, rol: cliente.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ success: true, user: cliente, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el login' });
  }
});

// 🟢 Historial de compras del cliente
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    let orders = await salesModel.getSalesByClientId(userId);

    // Formatear pedidos para que el JSON 'detalle' llegue listo al frontend
    orders = orders.map(order => {
      let detail = [];
      try {
        detail = order.detalle ? JSON.parse(order.detalle) : [];
      } catch (e) {
        console.error('Error parseando detalle del pedido:', order.pedido_id);
      }
      return {
        ...order,
        detalle: detail
      };
    });

    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error al obtener historial de compras:', error);
    res.status(500).json({ error: 'No se pudo obtener el historial' });
  }
});

// 🟢 Perfil del usuario logueado
router.get('/me', verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
