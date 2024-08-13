var pool = require('./bd');

async function getSalesTotal() {
    var query = `
    SELECT pedido_id
    FROM pedidos
    WHERE estado = 'aprobado'
  `;
    var rows = await pool.query(query);
    return rows;
}

async function getProductsSale() {
    var query = `
    SELECT detalle
FROM pedidos
WHERE estado = 'aprobado'
  `;
    var rows = await pool.query(query);
    return rows;
}

async function getDashboardSales() {
    var query = `
    SELECT *
FROM pedidos
ORDER BY pedido_id DESC
LIMIT 5
  
  `;
    var rows = await pool.query(query);
    return rows;
}

async function getIncome() {
    var query = `
    SELECT pedido_total, envio_precio
    FROM pedidos
    WHERE estado = 'aprobado'
  `;
    var rows = await pool.query(query);
    return rows;
}

async function getClients() {
    var query = `
    SELECT cliente_id 
    FROM clientes`;
    var rows = await pool.query(query);
    return rows;
}


module.exports = {getDashboardSales, getIncome, getClients, getSalesTotal, getProductsSale}