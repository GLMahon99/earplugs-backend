const pool = require('./bd');

// Obtener todas las ventas
async function getSales() {
    const [rows] = await pool.query('SELECT * FROM pedidos ORDER BY pedido_id DESC');
    return rows;
}

// Obtener detalle de ventas (solo el JSON detalle)
async function getDetailSales() {
    const [rows] = await pool.query('SELECT detalle FROM pedidos');
    return rows;
}

// Obtener todos los clientes (de la tabla usuarios)
async function getClients() {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE rol='cliente'");
    return rows;
}

// Obtener pedido por ID
async function getSalesById(id) {
    const [rows] = await pool.query('SELECT * FROM pedidos WHERE pedido_id = ?', [id]);
    return rows[0];
}

// Editar estado de pedido
async function editStateSaleById(estado, id) {
    try {
        const [rows] = await pool.query('UPDATE pedidos SET estado = ? WHERE pedido_id = ?', [estado, id]);
        return rows;
    } catch (error) {
        console.error('Error in editStateSaleById:', error);
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
