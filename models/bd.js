const mysql = require('mysql2');
const util = require('util');
const { config } = require('dotenv');

config(); // Cargar variables de entorno

// Configura el pool de conexiones
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    port: process.env.MYSQL_PORT,
    ssl: {
        rejectUnauthorized: false // Permite certificados autofirmados
    }
});

// Convierte el método query a una promesa para evitar el callback hell
pool.query = util.promisify(pool.query);

// Manejo de errores en la conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    if (connection) connection.release();
    console.log('Database connected successfully.');
});

module.exports = pool;
