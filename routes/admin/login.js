var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');
var bcrypt = require('bcrypt');
var md5 = require('md5');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/login', {
    layout:'admin/layoutLogin'
});
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.render('admin/login', {
    layout:'admin/layoutLogin'
});
});



router.post('/', async (req, res, next) => {
  try {
    var usuario = req.body.usuario;
    var password = req.body.password;

    var user = await usuariosModel.getEmployeeByUsername(usuario);

    if (!user) {
      return res.render('admin/login', {
        layout: 'admin/layoutLogin',
        error: true,
        message: 'Usuario y/o contraseña incorrectos.'
      });
    }

    var storedHash = user.password;
    var isMatch = false;
    var needsUpgrade = false;

    // Verificar si es un hash MD5 (exactamente 32 caracteres)
    if (storedHash.length === 32) {
      isMatch = (md5(password) === storedHash);
      needsUpgrade = isMatch;
    } else {
      isMatch = await bcrypt.compare(password, storedHash);
    }

    if (isMatch) {
      if (needsUpgrade) {
        // Generar hash bcrypt y guardar en base de datos de manera transparente
        var hashedPassword = await bcrypt.hash(password, 10);
        await usuariosModel.updateEmployeePassword(user.id, hashedPassword);
      }

      req.session.id_usuario = user.id;
      req.session.nombre = user.usuario;
      res.redirect('/admin/dashboard');
    } else {
      res.render('admin/login', {
        layout: 'admin/layoutLogin',
        error: true,
        message: 'Usuario y/o contraseña incorrectos.'
      });
    }
  } catch (error) {
    console.error('Error en post /admin/login:', error);
    res.render('admin/login', {
      layout: 'admin/layoutLogin',
      error: true,
      message: 'Ocurrió un error en el servidor. Intente nuevamente.'
    });
  }
});

module.exports = router;