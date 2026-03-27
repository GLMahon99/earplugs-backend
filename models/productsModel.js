const pool = require('./bd');

async function getProducts() {
    const [rows] = await pool.query('select * from productos');
    return rows;
}

async function insertProducts(obj) {
    try {
        const [rows] = await pool.query('insert into productos set ?', [obj]);
        return rows;
    } catch (error) {
        console.error('Error in insertProducts:', error);
        throw error;
    }
}

async function deleteProductsById(id) {
    const [rows] = await pool.query('delete from productos where producto_id = ?', [id]);
    return rows;
}

async function getProductsById(id) {
    const [rows] = await pool.query('select * from productos where producto_id = ?', [id]);
    return rows[0];
}

async function editProductsById(obj, id) {
    try {
        const [rows] = await pool.query('update productos set ? where producto_id = ?', [obj, id]);
        return rows;
    } catch (error) {
        console.error('Error in editProductsById:', error);
        throw error;
    }
}

async function getProductsByCategory(categoria) {
    const [rows] = await pool.query('select * from productos where categoria = ?', [categoria]);
    return rows; // Retorna todos los productos de la categoría
}

module.exports = { getProducts, insertProducts, deleteProductsById, getProductsById, editProductsById, getProductsByCategory };