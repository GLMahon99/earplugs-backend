const pool = require('./bd');

async function getImages() {
    const [rows] = await pool.query('select * from imagenes');
    return rows;
}

async function insertImages(obj) {
    try {
        const [rows] = await pool.query('insert into imagenes set ?', [obj]);
        return rows;
    } catch (error) {
        console.error('Error in insertImages:', error);
        throw error;
    }
}

async function deleteImagesById(id) {
    const [rows] = await pool.query('delete from imagenes where img_id = ?', [id]);
    return rows;
}

async function getImagesById(id) {
    const [rows] = await pool.query('select * from imagenes where img_id = ?', [id]);
    return rows[0];
}

async function getImagesByCategory(categoria) {
    const [rows] = await pool.query('select * from imagenes where categoria = ?', [categoria]);
    return rows;
}

module.exports = { getImages, insertImages, getImagesById, deleteImagesById, getImagesByCategory };