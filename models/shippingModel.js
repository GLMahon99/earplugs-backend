var pool = require('./bd');

async function getShipp() {
    var query = 'select * from shippingprice';
    var rows = await pool.query(query);
    return rows;
}



async function insertShipp(obj) {
    try {
        var query = 'insert into shippingprice set ?';
        var rows = await pool.query(query, [obj])
        return rows;
    } catch(error) {
        console.log(error);
        throw error;
    }
}



async function deleteShippById(id) {
    var query = 'delete from shippingprice where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

async function getShippById(id) {
    var query = 'select * from shippingprice where id = ?';
    var rows = await pool.query(query, [id]);
    return rows[0];
}
async function editShippById(newPrice, id) {
    try {
        var query = 'UPDATE shippingprice SET price = ? WHERE id = ?';
        var rows = await pool.query(query, [newPrice, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}



module.exports = {getShipp, getShippById, insertShipp, deleteShippById, editShippById};