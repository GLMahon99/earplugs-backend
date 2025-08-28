const pool = require('./bd');

// Obtener todas las ventas
async function getSales() {
    const query = `SELECT * FROM pedidos ORDER BY pedido_id DESC`;
    const rows = await pool.query(query);
    return rows;
}

// Obtener detalle de ventas (solo el JSON detalle)
async function getDetailSales() {
    const query = `SELECT detalle FROM pedidos`;
    const rows = await pool.query(query);
    return rows;
}

// Obtener todos los clientes (ahora de la tabla usuarios)
async function getClients() {
    const query = `SELECT * FROM usuarios WHERE rol='cliente'`;
    const rows = await pool.query(query);
    return rows;
}

// Obtener pedido por ID
async function getSalesById(id) {
    const query = `SELECT * FROM pedidos WHERE pedido_id = ?`;
    const rows = await pool.query(query, [id]);
    return rows[0];
}

// Editar estado de pedido
async function editStateSaleById(estado, id) {
    try {
        const query = 'UPDATE pedidos SET estado = ? WHERE pedido_id = ?';
        const rows = await pool.query(query, [estado, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getSales,
    getDetailSales,
    getClients,
    getSalesById,
    editStateSaleById
};
