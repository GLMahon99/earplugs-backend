const secured = async (req, res, next) => {
  try {
    // Check if the user ID is present in the session
    if (req.session.id_usuario) {
      return next();
    } else {
      // Redirect to login if not authenticated
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).send('Error interno en el servidor de autenticación');
  }
};

module.exports = secured;
