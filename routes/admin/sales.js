var express = require('express');
var router = express.Router();
var salesModel = require('../../models/salesModel');
const nodemailer = require('nodemailer');
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

// === Nodemailer con Hotmail/Outlook ===
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER ,// "tjmearplugs@hotmail.com",
    pass: process.env.EMAIL_PASS // "tu_contraseña_o_app_password"
  }
});

// Ruta para actualizar el estado
router.post('/editState', async (req, res) => {
  const pedidoId = req.body.id;
  const nuevoEstado = req.body.estado;
  const clientId = req.body.clientId;

  try {
    const clients = await salesModel.getClients();
    const clientData = clients.find(client => client.id == clientId);

    if (!clientData) {
      console.error('Cliente no encontrado para ID:', clientId);
      return res.status(404).send('Cliente no encontrado.');
    }

    const email = clientData.email;
    const nombreCliente = `${clientData.nombre} ${clientData.apellido}`;

    // Actualizar estado en DB
    await salesModel.editStateSaleById(nuevoEstado, pedidoId);
    console.log('Estado actualizado correctamente.');

    // Configuración del email según estado
    let subject, text;
    if (nuevoEstado === 'aprobado') {
      subject = '✅ Tu compra fue aprobada';
      text = `Hola ${nombreCliente},\n\n¡Tu pedido #${pedidoId} fue aprobado con éxito! 
Pronto lo prepararemos y enviaremos a la dirección indicada.\n\nGracias por confiar en nosotros.\n\nEquipo Earplugs.`;
    } else if (nuevoEstado === 'rechazado') {
      subject = '❌ Tu compra fue rechazada';
      text = `Hola ${nombreCliente},\n\nLamentablemente tu pedido #${pedidoId} fue rechazado. 
Por favor revisa los datos de pago o contáctanos para más información.\n\nSaludos,\nEquipo Earplugs.`;
    }

    if (subject && text) {
      const mailOptions = {
        from: '"Tienda Earplugs" <tjmearplugs@hotmail.com>',
        to: email,
        subject,
        text,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('❌ Error al enviar el correo:', error);
        } else {
          console.log('📩 Correo enviado:', info.response);
        }
      });
    }

    res.redirect('/admin/sales');
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).send('Error al actualizar el estado del pedido.');
  }
});

module.exports = router;
