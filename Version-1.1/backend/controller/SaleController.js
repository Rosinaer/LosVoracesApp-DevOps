const Sale = require("../model/Sale");
const logger = require("../utils/logger");

async function renderSales(req, res) {
  logger.info("GET /sales - Renderizando catálogo de ventas");
  try {
    const sales = await Sale.find().lean();
    logger.info("Ventas cargadas correctamente", { count: sales.length });
    res.render("SaleCatalog", { sales });
  } catch (error) {
    logger.error("Error al renderizar ventas", { error: error.message });
    //console.error("Error al renderizar ventas:", error);
    res.status(500).send("Error al cargar el registro de ventas");
  }
}

async function getSales(req, res) {
  logger.info("GET /api/sale - solicitando listado de ventas");
  try {
    const sales = await Sale.find();
    logger.info("Ventas obtenidas correctamente", { count: sales.length });
    res.json(sales);
  } catch (error) {
    logger.error("getSales error", { error: error.message });
    //console.error("getSales error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function createSale(req, res) {
  logger.info("POST /api/sale - creando venta", { body: req.body });
  try {
    const { product, date, description, category, price, quantityProduct, total } = req.body;

    if ( !product || !date || !description || !category || price == null || quantityProduct == null || total == null) {
      logger.warn("createSale - Campos faltantes", { body: req.body });
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const saleId = Date.now().toString();
    const newSale = new Sale({ saleId, product, date, description, category, price, quantityProduct, total });

    await newSale.save();
    logger.info("Venta creada exitosamente", { saleId });
    res.status(201).json(newSale);
  } catch (error) {
    logger.error("createSale error", { error: error.message });
    //console.error("createSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updateSale(req, res) {
  const { id } = req.params;
  logger.info("PUT /api/sale/:id - actualizando venta", { id, body: req.body });
  const { product, date, description, category, price, quantityProduct, total } = req.body;

  try {
    const sale = await Sale.findOne({ saleId: id });
     
    if (!sale){
      logger.warn("updateSale - Venta no encontrada", { id });
      return res.status(404).json({ error: "Venta no encontrada" });
    }
    sale.product = product; 
    sale.date = date;
    sale.description = description; 
    sale.category = category; 
    sale.price = price; 
    sale.quantityProduct = quantityProduct; 
    sale.total = total;

    await sale.save();
    res.json(sale);
    logger.info("Venta actualizada correctamente", { saleId: id });
  } catch (error) {
    logger.error("updateSale error", { error: error.message });
    //console.error("updateSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

async function deleteSale(req, res) {
  const { id } = req.params;
  logger.info("DELETE /api/sale/:id - eliminando venta", { id });
  try {
  const sale = await Sale.findOne({ saleId: id });
  if (!sale) {
   logger.warn("deleteSale - Venta no encontrada", { id });
   return res.status(404).json({ error: "Venta no encontrada" })
  }
   await sale.deleteOne();
    logger.info("Venta eliminada correctamente", { saleId: id });
    res.json({ message: "Venta eliminada" });
  } catch (error) {
    logger.error("deleteSale error", { error: error.message });
    //console.error("deleteSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getTopSellingProducts(req, res) {
  logger.info("GET /api/sale/top-products - consultando productos más vendidos", { query: req.query });
  try {
    const { range = "week" } = req.query;

    const now = new Date();
    let from;

    switch (range) {
      case "month":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "quarter":
        from = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case "sixmonths":
        from = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case "year":
        from = new Date(now.getFullYear(), 0, 1);
        break;
      case "week":
      default:
        from = new Date(now);
        from.setDate(now.getDate() - 7);
    }

    const sales = await Sale.find({ date: { $gte: from, $lte: now } });

    const productSales = {};

    sales.forEach(sale => {
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

    logger.info("Top de productos generado", { totalProducts: sortedProducts.length });
    res.json(sortedProducts);
  } catch (error) {
    logger.error("getTopSellingProducts error", { error: error.message });
    //console.error('getTopSellingProducts error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  getSales,
  createSale,
  updateSale,
  deleteSale,
  getTopSellingProducts,
  renderSales
};
