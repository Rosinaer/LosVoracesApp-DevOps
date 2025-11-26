const path = require('path');
const { readJSON, writeJSON } = require('../model/Database');
const Sale = require('../model/Sale');

const filePath = path.join(__dirname, '../data/Sale.json');

async function getSales(req, res) {
  try {
    const data = await readJSON(filePath);
    res.json(data);
  } catch (error) {
    console.error('getSales error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

}

async function createSale(req, res) {
  try {
    const { product, date, description, category, price, quantityProduct, total } = req.body;


    if (!product || !date || !description || !category || price == null || quantityProduct == null || total == null) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const data = await readJSON(filePath);

    const saleId = Date.now().toString();
    const newSale = new Sale(saleId, product, date, description, category, price, quantityProduct, total);
    data.push(newSale);


    await writeJSON(filePath, data);
    res.status(201).json(newSale);
  } catch (error) {
    console.error('createSales error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }


}

async function updateSale(req, res) {
  const { id } = req.params;
  const { product, date, description, category, price, quantityProduct, total } = req.body;

  const data = await readJSON(filePath);
  const index = data.findIndex(s => s.saleId === id);
  if (index === -1) return res.status(404).json({ error: 'Venta no encontrada' });

  data[index].product = product;
  data[index].date = date;
  data[index].description = description;
  data[index].category = category;
  data[index].price = price;
  data[index].quantityProduct = quantityProduct;
  data[index].total = total;

  await writeJSON(filePath, data);
  res.json(data[index]);
}

async function deleteSale(req, res) {
  const { id } = req.params;
  const data = await readJSON(filePath);

  const updated = data.filter(s => s.saleId !== id);
  await writeJSON(filePath, updated);

  res.json({ message: 'Venta eliminada' });
}

function isInRange(dateStr, from, to) {
  const date = new Date(dateStr);
  if (isNaN(date)) return false;
  return date >= from && date <= to;
}


async function getTopSellingProducts(req, res) {
  try {
    const { range = 'week' } = req.query;

    const now = new Date();
    let from;

    switch (range) {
      case 'month':
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter':
        from = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case 'sixmonths':
        from = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case 'year':
        from = new Date(now.getFullYear(), 0, 1);
        break;
      case 'week':
      default:
        from = new Date(now);
        from.setDate(now.getDate() - 7);
    }

    const sales = await readJSON(filePath);
    const productSales = {};

    sales
      .filter(sale => isInRange(sale.date, from, now))
      .forEach(sale => {
        const productId = sale.product;
        const quantity = sale.quantityProduct;

        if (!productSales[productId]) {
          productSales[productId] = 0;
        }
        productSales[productId] += quantity;
      });

    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .map(([productId, quantity]) => ({ productId, quantity }));

    res.json(sortedProducts);
  } catch (error) {
    console.error('getTopSellingProducts error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


module.exports = {
  getSales,
  createSale,
  updateSale,
  deleteSale,
  getTopSellingProducts
};