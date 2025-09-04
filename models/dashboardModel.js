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
    const query = `
        SELECT id, nombre, apellido, email
        FROM usuarios
        WHERE rol='cliente'
    `;
    const rows = await pool.query(query);
    return rows;
}

async function getSalesByMonth() {
  try {
    const query = `
      SELECT 
  DATE_FORMAT(fecha_pedido, '%Y-%m') AS mes, 
  SUM(pedido_total - envio_precio) AS total
FROM pedidos
WHERE estado = 'aprobado'
GROUP BY mes
ORDER BY mes;
    `;
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Error en getSalesByMonth:", error);
    throw error;
  }
}



module.exports = {getDashboardSales, getIncome, getClients, getSalesTotal, getProductsSale, getSalesByMonth};