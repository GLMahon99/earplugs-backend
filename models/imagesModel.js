var pool = require('./bd');

async function getImages() {
    var query = 'select * from imagenes';
    var rows = await pool.query(query);
    return rows;
}

async function insertImages(obj) {
    try {
        var query = 'insert into imagenes set ?';
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error;
    }
}

async function deleteImagesById(id) {
    var query = 'delete from imagenes where img_id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

async function getImagesById(id) {
    var query = 'select * from imagenes where img_id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

async function getImagesByCategory(categoria) {
    var query = 'select * from imagenes where categoria = ?';
    var rows = await pool.query(query, [categoria]);
    return rows;
}

module.exports = {getImages,insertImages, getImages, getImagesById, deleteImagesById , getImagesByCategory};