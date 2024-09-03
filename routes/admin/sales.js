var express = require('express');
var router = express.Router();
var salesModel = require('../../models/salesModel');
const nodemailer = require('nodemailer');
var cloudinary = require('cloudinary').v2;

router.get('/', async function(req, res, next) {
  try {
    var sales = await salesModel.getSales();
    var clients = await salesModel.getClient();
    // var detail = await salesModel.getDetailSales();

    // Convertir RowDataPackets a objetos simples
    sales = JSON.parse(JSON.stringify(sales));
    clients = JSON.parse(JSON.stringify(clients));
    // detail = JSON.parse(JSON.stringify(detail));

    // console.log("este es el detalle de la compra:", detail);

    // Agregar información de client y salesDetail a cada venta
    sales = sales.map(sale => {
      // Encontrar el cliente correspondiente
      const clientInfo = clients.find(client => client.cliente_id === sale.cliente_id);
      
      // Asegurarse de que sale.detalle sea un array
      let saleDetails;
      try {
        saleDetails = JSON.parse(sale.detalle);
      } catch (e) {
        saleDetails = []; // Si no es un JSON válido, asignar un array vacío
      }
      
      console.log("este es el total del pedido", sale.pedido_total);

      const commission = (sale.pedido_total * 0.0439).toFixed(2);
      const tax = (sale.pedido_total * 0.0020).toFixed(2);
      const total = (sale.pedido_total + sale.envio_precio - commission - tax).toFixed(2);

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
        total: total
      };
    });

    // console.log("este es el resultado de sales:", sales);
    res.render('admin/sales', {
      layout: 'admin/layout',
      persona: req.session.nombre,
      sales,
    });
  } catch (error) {
    next(error);
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gastimahon@gmail.com',
    pass: '41710562',
  },
});


// Ruta para actualizar el estado
router.post('/editState', async (req, res) => {
  const pedidoId = req.body.id;
  const nuevoEstado = req.body.estado;
  const clientId = req.body.clientId;

  try {
    const clients = await salesModel.getClient();

    // Verificación de datos
    console.log('Datos de clientes:', clients);
    console.log('ID del cliente recibido:', clientId);

    // Usar === si ambos son del mismo tipo; == si uno es string y otro es number
    const clientData = clients.find(client => client.cliente_id == clientId);

    if (!clientData) {
      console.error('Cliente no encontrado para ID:', clientId);
      return res.status(404).send('Cliente no encontrado.');
    }

    const email = clientData.email;

    // Actualiza el estado en la base de datos usando tu modelo de pedidos
    await salesModel.editStateSaleById(nuevoEstado, pedidoId);
    console.log('Estado actualizado correctamente.');

    // Envía el correo si el estado es "aprobado"
    if (nuevoEstado === 'aprobado') {
      const mailOptions = {
        from: 'gastimahon@gmail.com',
        to: email,
        subject: '¡Tu compra ha sido aprobada!',
        text: 'Detalles de la compra: ...', // Agrega los detalles relevantes aquí
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo:', error);
        } else {
          console.log('Correo enviado:', info.response);
        }
      });
    }

    res.redirect('/admin/sales'); // Redirige a la página principal o donde desees
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).send('Error al actualizar el estado del pedido.');
  }
});



module.exports = router;
