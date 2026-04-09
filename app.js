var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileUpLoad = require('express-fileupload');
var cors = require('cors');
require('dotenv').config();

// 🛡️ Middlewares
var secured = require('./middleware/auth');

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

var app = express();

// 🛡️ CORS configurado para desarrollo y producción
const corsOptions = {
  origin: ['https://earplugs.com.ar', 'http://localhost:3000'],
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
  secret: process.env.SESSION_SECRET || 'fallback-secret-development-only', // 🛡️ Usar variable de entorno
  cookie: { maxAge: null },
  resave: false,
  saveUninitialized: true
}));

app.use(fileUpLoad({
  useTempFiles: true,
  tempFileDir: '/tmp'
}));

// Routes
app.use('/', indexRouter);
app.use('/admin/login', loginRouter);

// 🛡️ Rutas de administración protegidas
app.use('/admin/dashboard', secured, adminRouter);
app.use('/admin/products', secured, productsRouter);
app.use('/admin/sales', secured, salesRouter);
app.use('/admin/faq', secured, faqRouter);
app.use('/admin/images', secured, imagesRouter);
app.use('/admin/shipping', secured, shippingRouter);
app.use('/admin/clients', secured, clientsRouter);

// APIs
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({ error: 'Error interno del servidor', details: err.message });
});

// Configuración del puerto
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;