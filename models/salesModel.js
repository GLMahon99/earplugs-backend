var pool = require('./bd');

async function getSales() {
    var query = `
    SELECT *
FROM pedidos
ORDER BY pedido_id DESC
  
  
  `;
    var rows = await pool.query(query);
    return rows;
}

async function getDetailSales() {
  var query = `
  SELECT
  detalle
FROM pedidos
`;
  var rows = await pool.query(query);
  return rows;
}

async function getClient() {
  var query = 'select * from clientes';
  var rows = await pool.query(query);
  return rows;
}

async function getSalesById(id) {
  var query = 'select * from pedidos where pedido_id = ?';
  var rows = await pool.query(query, [id]);
  return rows[0];
}

async function editStateSaleById(obj, id) {
  console.log('Valores recibidos: pedidoId =', id, ', nuevoEstado =', obj);

  try {
      var query = 'UPDATE pedidos SET estado = ? where pedido_id = ?';
      var rows = await pool.query(query, [obj,id]);
      return rows;
  } catch (error) {
      throw error;
  }
}

module.exports = {getSales, getDetailSales, getClient, editStateSaleById, getSalesById};