const pool = require('./bd');
const bcrypt = require('bcrypt');
const md5 = require('md5');

// --------- Empleados ---------
async function getUserByUsernameAndPassword(usuario, password) {
    try {
        const query = 'SELECT * FROM usuarios WHERE usuario = ? AND password = ? AND rol="empleado" LIMIT 1';
        const [rows] = await pool.query(query, [usuario, md5(password)]);
        return rows[0];
    } catch (error) {
        console.error('Error in getUserByUsernameAndPassword:', error);
    }
}

// --------- Clientes ---------
async function getClientByEmailAndPassword(email, password) {
    try {
        const query = 'SELECT * FROM usuarios WHERE email = ? AND rol="cliente" LIMIT 1';
        const [rows] = await pool.query(query, [email]); 
        const cliente = rows[0];
        if (!cliente) return null;

        const match = await bcrypt.compare(password, cliente.password);
        if (match) return cliente;
        return null;
    } catch (error) {
        console.error('Error in getClientByEmailAndPassword:', error);
    }
}

async function clientExists(email, numero_identificacion) {
  try {
    const query = `SELECT * FROM usuarios WHERE email = ? OR numero_identificacion = ? LIMIT 1`;
    const [rows] = await pool.query(query, [email, numero_identificacion]);
    return rows.length > 0;
  } catch (error) {
    console.error('Error in clientExists:', error);
    throw error;
  }
}

async function createClient(clienteObj) {
  try {
    const { nombre, apellido, email, password, tipo_identificacion, numero_identificacion, condicion_iva, telefono } = clienteObj;

    const exists = await clientExists(email, numero_identificacion);
    if (exists) {
      return { success: false, message: "Ya existe un usuario con este email o número de identificación" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO usuarios
      (nombre, apellido, email, password, tipo_identificacion, numero_identificacion, condicion_iva, telefono, rol)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'cliente')
    `;
    const [result] = await pool.query(query, [nombre, apellido, email, hashedPassword, tipo_identificacion, numero_identificacion, condicion_iva, telefono]);

    return { success: true, insertId: result.insertId };
  } catch (error) {
    console.error('Error in createClient:', error);
    return { success: false, message: "Error al registrar usuario" };
  }
}

async function getClientById(id) {
    try {
        const query = 'SELECT * FROM usuarios WHERE id = ? AND rol="cliente"';
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Error in getClientById:', error);
    }
}

async function getAllClients() {
    try {
        const query = 'SELECT * FROM usuarios WHERE rol="cliente"'; 
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error in getAllClients:', error);
    }
}

async function getSalesByClientsById(id) {
    try {
        const query = 'SELECT COUNT(*) AS totalSales FROM pedidos WHERE cliente_id = ?';
        const [rows] = await pool.query(query, [id]);
        return rows[0].totalSales;
    } catch (error) {
        console.error("Error en getSalesByClientsById:", error);
        return 0;
    }
}

async function deleteClient(id) {
    try {
        const query = 'DELETE FROM usuarios WHERE id = ? AND rol="cliente"';
        await pool.query(query, [id]);
    } catch (error) {
        console.error('Error in deleteClient:', error);
    }
}

async function getEmployeeByUsername(usuario) {
    try {
        const query = 'SELECT * FROM usuarios WHERE usuario = ? AND rol="empleado" LIMIT 1';
        const [rows] = await pool.query(query, [usuario]);
        return rows[0];
    } catch (error) {
        console.error('Error in getEmployeeByUsername:', error);
        throw error;
    }
}

async function updateEmployeePassword(id, hashedPassword) {
    try {
        const query = 'UPDATE usuarios SET password = ? WHERE id = ?';
        await pool.query(query, [hashedPassword, id]);
    } catch (error) {
        console.error('Error in updateEmployeePassword:', error);
        throw error;
    }
}

module.exports = {
    getUserByUsernameAndPassword,
    getClientByEmailAndPassword,
    createClient,
    getClientById,
    getAllClients,
    getSalesByClientsById,
    deleteClient,
    getEmployeeByUsername,
    updateEmployeePassword
};
