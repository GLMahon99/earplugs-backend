var express = require('express');
var router = express.Router();
var faqModel = require('../../models/faqModel');
const { route } = require('..');

router.get('/', async (req,res,next)=> {
  var faq = await faqModel.getFaq();
  res.render('admin/faq', {
    layout: 'admin/layout',
    usuario: req.session.nombre,
    faq
  });
});

router.get('/addFaq', (req,res,next) =>{
  res.render('admin/addFaq', {
    layout: 'admin/layout'
  })
})

router.post('/addFaq', async(req,res,next)=>{
  try{
    if(req.body.pregunta != "" && req.body.respuesta != ""){
      await faqModel.insertFaq(req.body);
      res.redirect('/admin/faq');
    } else {
      res.render('admin/addFaq', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos'
      })
    }
  } catch (error) {
    console.log(error);
    res.render('admin/addFaq', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargo la pregunta'
    });
    }
  });

router.get('/delete/:id' , async (req,res,next) => {
  var id = req.params.id;
  await faqModel.deleteFaqById(id);
  res.redirect('/admin/faq')
});


module.exports = router;