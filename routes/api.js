var express = require('express');
var router = express.Router();
var productsModel = require('./../models/productsModel');
var imagesModel = require('./../models/imagesModel');
var faqModel = require('./../models/faqModel');
var TestimonioModel = require('./../models/testimonials');
var shippingModel = require('./../models/shippingModel')
var cloudinary = require('cloudinary').v2;

router.get('/products', async (req, res, next)=>{
    let products = await productsModel.getProducts();

    products = products.map(products=> {
        if (products.img_id) {
            const img = cloudinary.url(products.img_id);
        return {
            ...products,
            img
        }    
        } else {
            return {
                ...products,
                img: ''
            }
        }
    });
    res.json(products)
});

router.get('/products/:id', async (req, res, next) => {
    try {
      const productId = req.params.id;
      let productDetails = await productsModel.getProductsById(productId);
  
      if (!productDetails) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      if (productDetails.img_id) {
        productDetails.img = cloudinary.url(productDetails.img_id);
      }
  
      res.json(productDetails);
    } catch (error) {
      console.error('Error en la ruta /products/:id:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });



//   router.get('/products/:categoria', async (req, res, next) => {
//     try {
//     const categoria = req.params.categoria;
//     let productsCategories = await productsModel.getProductsByCategory(categoria);

//     if (!productsCategories) {
//         return res.status(404).json({ error: 'Producto no encontrado' });
//       }
//       productsCategories = productsCategories.map(productsCategories=> {
//         if (productsCategories.img_id) {
//             const img = cloudinary.url(productsCategories.img_id);
//         return {
//             ...productsCategories,
//             img
//         }    
//         } else {
//             return {
//                 ...productsCategories,
//                 img: ''
//             }
//         }
//     });


//       res.json(productsCategories);
//     } catch (error) {
//         console.error('Error en la ruta /products/:categoria:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }

//   });


router.get('/faq', async (req, res, next)=>{
    let faq = await faqModel.getFaq();

    faq = faq.map(faq=> {    
        return {
            ...faq,
            
        }    
    });
    res.json(faq)
});

router.get('/shipping', async (req, res, next)=>{
    let shipp = await shippingModel.getShipp();

    shipp = shipp.map(shipp=> {    
        return {
            ...shipp,
            
        }    
    });
    res.json(shipp)
});





router.get('/images/:categoria', async (req, res, next) => {
    try {
    const categoria = req.params.categoria;
    let imagesCategory = await imagesModel.getImagesByCategory(categoria);

    if (!imagesCategory) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      imagesCategory = imagesCategory.map(imagesCategory=> {
        if (imagesCategory.img) {
            const imagen = cloudinary.url(imagesCategory.img);
        return {
            ...imagesCategory,
            imagen
        }    
        } else {
            return {
                ...imagesCategory,
                imagen: ''
            }
        }
    });


      res.json(imagesCategory);
    } catch (error) {
        console.error('Error en la ruta /images/:categoria:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

  });

  router.get('/testimonials', async (req, res, next)=>{
    let testimonio = await TestimonioModel.getTestimonio();

    testimonio = testimonio.map(testimonio=> {    
        return {
            ...testimonio,
            
        }    
    });
    res.json(testimonio)
});


module.exports = router;