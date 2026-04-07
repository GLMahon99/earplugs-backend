const mysql = require('mysql2/promise');

// Configura el pool de conexiones con soporte para Promesas
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB_NAME,
    port: process.env.MYSQL_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true, // Mantiene la conexión activa enviando "pings"
    keepAliveInitialDelay: 10000, // Empieza a los 10 segundos
    connectTimeout: 20000, // Tiempo máximo para intentar conectar
});

// Manejador de errores del pool para evitar que el proceso muera
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    }
});

// Verificación inicial de conexión (opcional en pool, pero buena práctica)
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully (via mysql2/promise).');
        connection.release();
    } catch (err) {
        console.error('❌ Error connecting to the database:', err.message);
    }
}

testConnection();

module.exports = pool;
