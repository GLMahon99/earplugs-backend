var express = require('express');
var router = express.Router();
var dashboardModel = require('../../models/dashboardModel');

router.get('/', async (req, res, next) => {
  try {
    var clientsTotal = await dashboardModel.getClients();
    var incomeTotal = await dashboardModel.getIncome();
    var salesRecent = await dashboardModel.getDashboardSales();
    var sales = await dashboardModel.getSalesTotal();
    var productsSale = await dashboardModel.getProductsSale();

    let totalProductsSold = 0;

    productsSale.forEach(item => {
      // Quita los caracteres de escape y parsea el JSON
      if (typeof item.detalle === 'string') {
        try {
          // Primero, eliminar los caracteres de escape adicionales
          const cleanJson = item.detalle.replace(/\\"/g, '"');
          const detalle = JSON.parse(cleanJson);

          detalle.forEach(product => {
            totalProductsSold += product.quantity; // Suponiendo que la propiedad es 'quantity'
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else if (Array.isArray(item.detalle)) {
        // Si 'detalle' ya es un array (es decir, ya está parseado)
        item.detalle.forEach(product => {
          totalProductsSold += product.quantity; // Suponiendo que la propiedad es 'quantity'
        });
      } else {
        console.error('Unexpected format of detalle:', item.detalle);
      }
    });

    // const revenueTotal = (incomeTotal.reduce((total, sale) => total + sale.pedido_total - sale.envio_precio, 0)).toFixed(2);
    const revenueTotal = 0;
    const clients = clientsTotal.length;
    const salesTotal = sales.length;

    console.log("este es el numero de clientes: ", clients);

    res.render('admin/dashboard', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      salesRecent,
      clients,
      salesTotal,
      totalProductsSold,
      revenueTotal
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    next(error); // Pasar el error al middleware de manejo de errores
  }
});

module.exports = router;
