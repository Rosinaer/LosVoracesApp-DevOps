const Sale = require("../model/Sale");

async function renderSales(req, res) {
  try {
    const sales = await Sale.find().lean();
    res.render("SaleCatalog", { sales });
  } catch (error) {
    console.error("Error al renderizar ventas:", error);
    res.status(500).send("Error al cargar el registro de ventas");
  }
}

async function getSales(req, res) {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (error) {
    console.error("getSales error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function createSale(req, res) {
  try {
    const { product, date, description, category, price, quantityProduct, total } = req.body;

    if ( !product || !date || !description || !category || price == null || quantityProduct == null || total == null) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const saleId = Date.now().toString();
    const newSale = new Sale({ saleId, product, date, description, category, price, quantityProduct, total });

    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    console.error("createSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updateSale(req, res) {
  const { id } = req.params;
  const { product, date, description, category, price, quantityProduct, total } = req.body;

  try {
    const sale = await Sale.findOne({ saleId: id });
     
    if (!sale)
      return res.status(404).json({ error: "Venta no encontrada" });
    sale.product = product; 
    sale.date = date;
    sale.description = description; 
    sale.category = category; 
    sale.price = price; 
    sale.quantityProduct = quantityProduct; 
    sale.total = total;

    await sale.save();
    res.json(sale);
  } catch (error) {
    console.error("updateSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

async function deleteSale(req, res) {
  const { id } = req.params;
  try {
  const sale = await Sale.findOne({ saleId: id });
  if (!sale) {
   return res.status(404).json({ error: "Venta no encontrada" })
  }
   await sale.deleteOne();
    res.json({ message: "Venta eliminada" });
  } catch (error) {
    console.error("deleteSale error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getTopSellingProducts(req, res) {
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
  getTopSellingProducts,
  renderSales
};
