
var express = require('express');
var router = express.Router();
var shippingModel = require('../../models/shippingModel');
const { route } = require('..');

router.get('/', async (req,res,next)=> {
  var shipp = await shippingModel.getShipp();
  res.render('admin/shipping', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    shipp
  });
});

router.get('/addShipp', (req,res,next) =>{
  res.render('admin/addShipp', {
    layout: 'admin/layout'
  })
})

router.post('/addShipp', async(req,res,next)=>{
  try{
    if(req.body.city != "" && req.body.price != ""){
      await shippingModel.insertShipp(req.body);
      res.redirect('/admin/shipping');
    } else {
      res.render('admin/addShipp', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos'
      })
    }
  } catch (error) {
    console.log(error);
    res.render('admin/addShipp', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargo el envío'
    });
    }
  });

router.get('/delete/:id' , async (req,res,next) => {
  var id = req.params.id;
  await shippingModel.deleteShippById(id);
  res.redirect('/admin/shipping')
});

router.post('/edit', async (req, res, next) => {
  const shippIds = req.body.id;
  const newShippPrices = req.body.NewPrice;

  try {
    for (let i = 0; i < shippIds.length; i++) {
      const shippId = shippIds[i];
      const newShippPrice = newShippPrices[i];
      console.log(`Actualizando ID ${shippId} con precio ${newShippPrice}`);
      await shippingModel.editShippById(newShippPrice, shippId);
    }
    console.log('Todos los precios de envío han sido actualizados');
    res.redirect('/admin/shipping');
  } catch (error) {
    console.error('Error al actualizar:', error);
    next(error);
  }
});




module.exports = router;