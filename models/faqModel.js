var pool = require('./bd');

async function getFaq() {
    var query = 'select * from faq';
    var rows = await pool.query(query);
    return rows;
}



async function insertFaq(obj) {
    try {
        var query = 'insert into faq set ?';
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error;
    }
}



async function deleteFaqById(id) {
    var query = 'delete from faq where faq_id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

async function getFaqById(id) {
    var query = 'select * from faq where faq_id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}


module.exports = {getFaq, getFaqById, insertFaq, deleteFaqById};