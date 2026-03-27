const pool = require('./bd');

async function getSalesTotal() {
    const query = `
    SELECT pedido_id
    FROM pedidos
    WHERE estado = 'aprobado'
  `;
    const [rows] = await pool.query(query);
    return rows;
}

async function getProductsSale() {
    const query = `
    SELECT detalle
FROM pedidos
WHERE estado = 'aprobado'
  `;
    const [rows] = await pool.query(query);
    return rows;
}

async function getDashboardSales() {
    const query = `
    SELECT *
FROM pedidos
ORDER BY pedido_id DESC
LIMIT 5
  `;
    const [rows] = await pool.query(query);
    return rows;
}

async function getIncome() {
    const query = `
    SELECT pedido_total, envio_precio
    FROM pedidos
    WHERE estado = 'aprobado'
  `;
    const [rows] = await pool.query(query);
    return rows;
}

async function getClients() {
    const query = `
        SELECT id, nombre, apellido, email
        FROM usuarios
        WHERE rol='cliente'
    `;
    const [rows] = await pool.query(query);
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

async function getSalesByDay() {
    try {
        const query = `
      SELECT 
  DATE_FORMAT(fecha_pedido, '%Y-%m-%d') AS dia, 
  SUM(pedido_total - envio_precio) AS total
FROM pedidos
WHERE estado = 'aprobado' AND MONTH(fecha_pedido) = MONTH(CURRENT_DATE()) AND YEAR(fecha_pedido) = YEAR(CURRENT_DATE())
GROUP BY dia
ORDER BY dia;
    `;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error("Error en getSalesByDay:", error);
        throw error;
    }
}

module.exports = { getDashboardSales, getIncome, getClients, getSalesTotal, getProductsSale, getSalesByMonth, getSalesByDay };