const path = require('path');
const { readJSON, writeJSON } = require('../model/Database');
const Order = require('../model/Order');

const filePath = path.join(__dirname, '../data/Order.json');

async function getOrders(req, res) {
  try {
    const data = await readJSON(filePath);
    res.json(data);
  } catch (error) {
    console.error('getOrders error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

}

async function createOrder(req, res) {
  try {
    const { product, supplierId, date, description, category, price, quantityProduct, status, total } = req.body;


    if (!product || !supplierId || !date || !description || !category || price == null || quantityProduct == null || !status || !total) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const data = await readJSON(filePath);

    const orderId = Date.now().toString();
    const newOrder = new Order(orderId, supplierId, product, date, description, category, price, quantityProduct, status, total);
    data.push(newOrder);


    await writeJSON(filePath, data);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateOrder(req, res) {
  const { id } = req.params;
  const { supplierId, product, date, description, category, price, quantityProduct, status, total } = req.body;

  const data = await readJSON(filePath);
  const index = data.findIndex(s => s.orderId === id);
  if (index === -1) return res.status(404).json({ error: 'Venta no encontrada' });

  data[index].product = product;
  data[index].supplierId = supplierId;
  data[index].date = date;
  data[index].description = description;
  data[index].category = category;
  data[index].price = price;
  data[index].quantityProduct = quantityProduct;
  data[index].status = status;
  data[index].total = total;

  await writeJSON(filePath, data);
  res.json(data[index]);
}

async function deleteOrder(req, res) {
  const { id } = req.params;
  const data = await readJSON(filePath);

  const updated = data.filter(s => s.orderId !== id);
  await writeJSON(filePath, updated);

  res.json({ message: 'Orden eliminada' });
}

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder
};