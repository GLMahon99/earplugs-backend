var express = require('express');
var router = express.Router();

var productsModel = require('../../models/productsModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy)



/* GET home page. */
router.get('/', async function(req, res, next) {

  var products = await productsModel.getProducts();

  products = products.map(product => {
    if (product.img_id) {
      const imagen = cloudinary.image(product.img_id, {
        width: 65,
        heigth: 65,
        crop: 'fill'
      });
      return {
        ...product,
        imagen
      }
    } else {
      return {
        ...product,
        imagen: ''
      }
    }
  })

  res.render('admin/products', {
    layout:'admin/layout',
    persona: req.session.nombre,
    products
});
});

router.get('/add', (req,res,next)=> {
  res.render('admin/add', {
    layout:'admin/layout'
  })
});

router.post('/add', async (req,res,next) => {
  try {
    // faltan
    // req.body.imagenes != "" req.body.items != "" &&
    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      imagen = req.files.imagen;
      img_id = (await uploader(imagen.tempFilePath)).public_id;
    }

    if (req.body.titulo != "" && req.body.codigo != "" && req.body.stock != "" && req.body.precio != "" &&  req.body.descripcion != "" && req.body.indicaciones != "" && req.body.categoria != "" && req.body.item6 != ""){
      await productsModel.insertProducts({
        ...req.body,
        img_id
      });
      res.redirect('/admin/products')
    } else {
      res.render('admin/add' ,{
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos.'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/add', {
      layout: 'admin/layout',
        error: true,
        message: 'No se pudo cargar el producto, intente nuevamente.'
    })
  }
})

router.get('/delete/:id', async (req,res,next)=>{
  var id = req.params.id;

  let product = await productsModel.getProductsById(id);
  if (product.img_id) {
    await (destroy(product.img_id))
  }

  await productsModel.deleteProductsById(id);
  res.redirect('/admin/products');
});



router.get('/edit/:id', async (req,res,next)=>{
  var id = req.params.id;
  console.log(req.params.id);
  var producto = await productsModel.getProductsById(id);

  res.render('admin/edit', {
    layout: 'admin/layout',
    producto
  })
})

router.post('/edit', async (req,res,next) => {
  try{
    let img_id = req.body.img_original;
    let borrarImgVieja = false;
    if (req.body.img_delete === "1") {
      img_id = null;
      borrarImgVieja = true;
    } else {
      if(req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
        borrarImgVieja = true;
      }
    }
    if (borrarImgVieja && req.body.img_original) {
      await (destroy(req.body.img_original));
    }

    var obj = {
      titulo: req.body.titulo,
      codigo: req.body.codigo,
      stock: req.body.stock,
      precio: req.body.precio,
      categoria: req.body.categoria,
      descripcion: req.body.descripcion,
      indicaciones: req.body.indicaciones,
      item1: req.body.item1,
      item2: req.body.item2,
      item3: req.body.item3,
      item4: req.body.item4,
      item5: req.body.item5,
      item6: req.body.item6,
      item7: req.body.item7,
      item8: req.body.item8,
      item9: req.body.item9,
      item10: req.body.item10,
      item11: req.body.item11,
      item12: req.body.item12,
      img_id
    }
    await productsModel.editProductsById(obj, req.body.id);
    res.redirect('/admin/products');
  } catch (error) {
    res.render('admin/edit', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico el producto.'
    })
  }
})


module.exports = router;