const pool = require('./bd');

async function getShipp() {
    const [rows] = await pool.query('select * from shippingprice');
    return rows;
}

async function insertShipp(obj) {
    try {
        const [rows] = await pool.query('insert into shippingprice set ?', [obj]);
        return rows;
    } catch (error) {
        console.error('Error in insertShipp:', error);
        throw error;
    }
}

async function deleteShippById(id) {
    const [rows] = await pool.query('delete from shippingprice where id = ?', [id]);
    return rows;
}

async function getShippById(id) {
    const [rows] = await pool.query('select * from shippingprice where id = ?', [id]);
    return rows[0];
}

async function editShippById(newPrice, id) {
    try {
        const [rows] = await pool.query('UPDATE shippingprice SET price = ? WHERE id = ?', [newPrice, id]);
        return rows;
    } catch (error) {
        console.error('Error in editShippById:', error);
        throw error;
    }
}

module.exports = { getShipp, getShippById, insertShipp, deleteShippById, editShippById };