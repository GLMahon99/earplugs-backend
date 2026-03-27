const pool = require('./bd');

async function getTestimonio() {
    const [rows] = await pool.query('select * from testimonios');
    return rows;
}

async function getTestimonioById(id) {
    const [rows] = await pool.query('select * from testimonios where testimonio_id = ?', [id]);
    return rows[0];
}

module.exports = { getTestimonio, getTestimonioById };