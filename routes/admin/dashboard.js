var express = require('express');
var router = express.Router();
var dashboardModel = require('../../models/dashboardModel');


router.get('/', async (req,res,next)=> {
  var clientsTotal = await dashboardModel.getClients();
  var incomeTotal = await dashboardModel.getIncome();
  var salesRecent = await dashboardModel.getDashboardSales();
  var sales = await dashboardModel.getSalesTotal();
  var productsSale = await dashboardModel.getProductsSale();

  // Inicializa la variable para la cantidad total de productos vendidos
  let totalProductsSold = 0;
  
  // Recorre cada fila obtenida de la base de datos
  productsSale.forEach(item => {
    // Parsear la columna 'detalle' que contiene un JSON con la lista de productos
    const detalle = JSON.parse(item.detalle);
  
    // Suma la cantidad de cada producto en la lista
    detalle.forEach(product => {
      totalProductsSold += product.quantity; // Suponiendo que la propiedad es 'quantity'
    });
  });

  const revenueTotal = incomeTotal.reduce((total, sale) => total + sale.pedido_total - sale.envio_precio, 0);

  const clients = clientsTotal.length;
  const salesTotal = sales.length;






  console.log("este es el numero de clientes: " , clients );

  res.render('admin/dashboard', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    salesRecent,
    clients,
    salesTotal,
     totalProductsSold,
    revenueTotal
  });
});

module.exports = router;