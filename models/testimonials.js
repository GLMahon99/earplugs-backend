var pool = require('./bd');

async function getTestimonio() {
    var query = 'select * from testimonios';
    var rows = await pool.query(query);
    return rows;
}

async function getTestimonioById(id) {
    var query = 'select * from testimonios where testimonio_id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}

module.exports = {getTestimonio, getTestimonioById};