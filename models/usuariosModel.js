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
        const rows = await pool.query(query, [email]);
        const cliente = rows[0];
        if (!cliente) return null;

        const match = await bcrypt.compare(password, cliente.password);
        if (match) return cliente;
        return null;
    } catch (error) {
        console.log(error);
    }
}

// Registrar cliente
async function createClient(clienteObj) {
    try {
        const { nombre, apellido, email, password, tipo_identificacion, numero_identificacion, condicion_iva, telefono } = clienteObj;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO usuarios
            (nombre, apellido, email, password, tipo_identificacion, numero_identificacion, condicion_iva, telefono, rol)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'cliente')
        `;
        const result = await pool.query(query, [nombre, apellido, email, hashedPassword, tipo_identificacion, numero_identificacion, condicion_iva, telefono]);
        return result.insertId;
    } catch (error) {
        console.log(error);
        throw error;
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

module.exports = {
    getUserByUsernameAndPassword,
    getClientByEmailAndPassword,
    createClient,
    getClientById
};
