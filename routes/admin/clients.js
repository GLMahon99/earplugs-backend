var express = require('express');
var router = express.Router();

var usuariosModel = require('../../models/usuariosModel');

// --- Listado de clientes ---
router.get("/", async (req, res) => {
  try {
    const clients = await usuariosModel.getAllClients();
    res.render("admin/clients", { 
      layout: "admin/layout",
      usuario: req.session.nombre, // quita esto si no usas un layout general
      clients 
    });
  } catch (err) {
    console.error("Error al obtener clientes:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// // --- Eliminar cliente ---
// router.post("/delete/:id", async (req, res) => {
//   try {
//     await usuariosModel.deleteClient(req.params.id);
//     res.redirect("/clients");
//   } catch (err) {
//     console.error("Error al eliminar cliente:", err);
//     res.status(500).send("Error al eliminar cliente");
//   }
// });

module.exports = router;