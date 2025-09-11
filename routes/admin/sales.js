var express = require('express');
var router = express.Router();
var salesModel = require('../../models/salesModel');
var cloudinary = require('cloudinary').v2;

router.get('/', async function(req, res, next) {
  try {
    var sales = await salesModel.getSales();
    var clients = await salesModel.getClients();

    sales = JSON.parse(JSON.stringify(sales));
    clients = JSON.parse(JSON.stringify(clients));

    sales = sales.map(sale => {
      const clientInfo = clients.find(client => client.id === sale.cliente_id);

      let saleDetails;
      try {
        saleDetails = JSON.parse(sale.detalle);
      } catch (e) {
        saleDetails = [];
      }

      const pedidoTotalNum = Number(sale.pedido_total);
      const envioPrecioNum = Number(sale.envio_precio);
      let discount = sale.forma_pago === 'transferencia' ? pedidoTotalNum * 0.1 : 0;

      let commission = sale.forma_pago === 'transferencia'
        ? 0
        : (pedidoTotalNum + envioPrecioNum) * 0.0439;

      let tax = sale.forma_pago === 'transferencia'
        ? 0
        : (pedidoTotalNum + envioPrecioNum) * 0.0020;

      commission = Math.round(commission * 100) / 100;
      tax = Math.round(tax * 100) / 100;

      let total = pedidoTotalNum + envioPrecioNum - commission - tax;
      total = Math.round(total * 100) / 100;

      const detailSale = saleDetails.map(item => ({
        img: cloudinary.url(item.img),
        code: item.codigo,
        price: item.precio,
        title: item.titulo,
        quantity: item.quantity
      }));

      return {
        ...sale,
        client: clientInfo,
        detail: detailSale,
        commission: commission,
        tax: tax,
        total: total,
        discount: discount
      };
    });

    res.render('admin/sales', {
      layout: 'admin/layout',
      persona: req.session.nombre,
      sales,
    });
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar el estado (sin envío de email)
router.post('/editState', async (req, res) => {
  const pedidoId = req.body.id;
  const nuevoEstado = req.body.estado;

  try {
    await salesModel.editStateSaleById(nuevoEstado, pedidoId);
    console.log('Estado actualizado correctamente.');
    res.redirect('/admin/sales');
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).send('Error al actualizar el estado del pedido.');
  }
});

module.exports = router;
