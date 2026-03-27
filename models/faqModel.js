const pool = require('./bd');

async function getFaq() {
    const [rows] = await pool.query('select * from faq');
    return rows;
}

async function insertFaq(obj) {
    try {
        const [rows] = await pool.query('insert into faq set ?', [obj]);
        return rows;
    } catch (error) {
        console.error('Error in insertFaq:', error);
        throw error;
    }
}

async function deleteFaqById(id) {
    const [rows] = await pool.query('delete from faq where faq_id = ?', [id]);
    return rows;
}

async function getFaqById(id) {
    const [rows] = await pool.query('select * from faq where faq_id = ?', [id]);
    return rows[0];
}

module.exports = { getFaq, getFaqById, insertFaq, deleteFaqById };