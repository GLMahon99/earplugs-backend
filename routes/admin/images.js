var express = require('express');
var router = express.Router();
var imagesModel = require('../../models/imagesModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async (req,res,next)=> {
    var images = await imagesModel.getImages();

    var images = images.map(images => {
        if (images.img) {
            const imagen = cloudinary.image(images.img, {
                width: 150,
                
            })
            return {
                ...images,
                imagen
            }
        }
    });
    

    res.render('admin/images', {
      layout: 'admin/layout',
      usuario: req.session.nombre,
      images
    });
  });
  
  router.get('/addImages', (req,res,next) =>{
    res.render('admin/addImages', {
      layout: 'admin/layout'
    })
  })

  router.post('/addImages', async (req,res,next) => {
    try {
      
      var img = '';
      if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img = (await uploader(imagen.tempFilePath)).public_id;
      }
  
      if (req.body.categoria != "" ){
        await imagesModel.insertImages({
          ...req.body,
          img
        });
        res.redirect('/admin/images')
      } else {
        res.render('admin/addImages' ,{
          layout: 'admin/layout',
          error: true,
          message: 'Todos los campos son requeridos.'
        })
      }
    } catch (error) {
      console.log(error)
      res.render('admin/addImages', {
        layout: 'admin/layout',
          error: true,
          message: 'No se pudo cargar la imagen, intente nuevamente.'
      })
    }
  });

  router.get('/delete/:id', async (req,res,next)=>{
    var id = req.params.id;
  
    let images = await imagesModel.getImagesById(id);
    if (images.img_id) {
      await (destroy(images.img_id))
    }
  
    await imagesModel.deleteImagesById(id);
    res.redirect('/admin/images');
  });

module.exports = router;