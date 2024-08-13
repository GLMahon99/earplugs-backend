var pool = require('./bd');

async function getProducts() {
    var query = 'select * from productos';
    var rows = await pool.query(query);
    return rows;
}

async function insertProducts(obj) {
    try {
        var query = 'insert into productos set ?';
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function deleteProductsById(id) {
    var query = 'delete from productos where producto_id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

async function getProductsById(id) {
    var query = 'select * from productos where producto_id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function editProductsById(obj, id) {
    try {
        var query = 'update productos set ? where producto_id = ?';
        var rows = await pool.query(query, [obj,id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getProductsByCategory(categoria) {
    var query = 'select * from productos where categoria = ?';
    var rows = await pool.query(query, [categoria]);
    return rows[0];
}

module.exports = {getProducts , insertProducts, deleteProductsById, getProductsById, editProductsById, getProductsByCategory};