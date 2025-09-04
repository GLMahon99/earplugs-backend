var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileUpLoad = require('express-fileupload');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/admin/login');
var adminRouter = require('./routes/admin/dashboard');
var productsRouter = require('./routes/admin/products');
var salesRouter = require('./routes/admin/sales');
var faqRouter = require('./routes/admin/faq');
var imagesRouter = require('./routes/admin/images');
var shippingRouter = require('./routes/admin/shipping');
var apiRouter = require('./routes/api');
var authRouter = require('./routes/api/auth');
var clientsRouter = require('./routes/admin/clients');
const { config } = require('dotenv');

var app = express();

// 🛡️ CORS configurado para desarrollo y producción
const corsOptions = {
  origin: ['https://earplugs.com.ar'],// Añade aquí otros orígenes permitidos como 'http://localhost:3000' para desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'c1a65sc484e63aFFF35sa679',
  cookie: { maxAge: null },
  resave: false,
  saveUninitialized: true
}));

secured = async (req, res, next) => {
  try {
    console.log(req.session.id_usuario);
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.log(error);
  }
};

app.use(fileUpLoad({
  useTempFiles: true,
  tempFileDir: '/tmp'
}));

app.use('/', indexRouter);
app.use('/admin/login', loginRouter);
app.use('/admin/dashboard', secured, adminRouter);
app.use('/admin/products', secured, productsRouter);
app.use('/admin/sales', salesRouter);
app.use('/admin/faq', faqRouter);
app.use('/admin/images', imagesRouter);
app.use('/admin/shipping', shippingRouter);
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);
app.use('/admin/clients', clientsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Configuración del puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;