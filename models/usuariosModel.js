const pool = require('./bd');
const bcrypt = require('bcrypt');

// --------- Empleados ---------
// Login empleado (mantener username + password con md5)
async function getUserByUsernameAndPassword(usuario, password) {
    try {
        const md5 = require('md5');
        const query = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ? AND rol="empleado" LIMIT 1';
        const rows = await pool.query(query, [usuario, md5(password)]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

// --------- Clientes ---------
// Login cliente (email + password bcrypt)
async function getClientByEmailAndPassword(email, password) {
    try {
        const query = 'SELECT * FROM usuarios WHERE email = ? AND rol="cliente" LIMIT 1';
        const rows = await pool.query(query, [email]); // SIN destructuración
        console.log('Resultado rows:', rows); // <-- log para debug
        const cliente = rows[0];
        console.log('Cliente encontrado:', cliente);
        if (!cliente) return null;

        const match = await bcrypt.compare(password, cliente.password);
        console.log('Password match:', match);
        if (match) return cliente;
        return null;
    } catch (error) {
        console.log(error);
    }
}

// Verificar si el cliente ya existe
async function clientExists(email, numero_identificacion) {
  try {
    const query = `SELECT * FROM usuarios WHERE email = ? OR numero_identificacion = ? LIMIT 1`;
    const rows = await pool.query(query, [email, numero_identificacion]);
    return rows.length > 0;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Registrar cliente
async function createClient(clienteObj) {
  try {
    const { nombre, apellido, email, password, tipo_identificacion, numero_identificacion, condicion_iva, telefono } = clienteObj;

    // 1️⃣ Verificamos duplicados
    const exists = await clientExists(email, numero_identificacion);
    if (exists) {
      return { success: false, message: "Ya existe un usuario con este email o número de identificación" };
    }

    // 2️⃣ Crear hash de password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Insertar en DB
    const query = `
      INSERT INTO usuarios
      (nombre, apellido, email, password, tipo_identificacion, numero_identificacion, condicion_iva, telefono, rol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'cliente')
    `;
    const result = await pool.query(query, [nombre, apellido, email, hashedPassword, tipo_identificacion, numero_identificacion, condicion_iva, telefono]);

    return { success: true, insertId: result.insertId };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Error al registrar usuario" };
  }
}

// Obtener cliente por ID
async function getClientById(id) {
    try {
        const query = 'SELECT * FROM usuarios WHERE id = ? AND rol="cliente"';
        const rows = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.log(error);
    }
}

async function getAllClients() {
    try {
        const query = 'SELECT * FROM usuarios WHERE rol="cliente"'; // Asegurarse de filtrar solo clientes
        const rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

async function getSalesByClientsById(id) {
    try {
        const query = 'SELECT COUNT(*) AS totalSales FROM pedidos WHERE cliente_id = ?';
        const rows = await pool.query(query, [id]);
        return rows[0].totalSales;
    } catch (error) {
        console.error("Error en getSalesByClientsById:", error);
        return 0;
    }
}

module.exports = {
    getUserByUsernameAndPassword,
    getClientByEmailAndPassword,
    createClient,
    getClientById,
    getAllClients,
    getSalesByClientsById
};
