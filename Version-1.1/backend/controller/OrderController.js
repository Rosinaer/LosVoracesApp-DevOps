const Order = require("../model/Order.js");
const logger = require("../utils/logger.js");

async function renderOrders(req, res) {
  logger.info("GET /order/render - Renderizando catálogo de órdenes");
  try {
    const orders = await Order.find().lean();   
    logger.info(`GET /order/render - Órdenes cargadas: ${orders.length}`);
    res.render('OrderCatalog', { orders });            
  } catch (err) {
    logger.error(`GET /order/render - Error: ${err.message}`);
    //console.error('Error al renderizar órdenes', err);
    res.status(500).send('Error al cargar las órdenes');
  }
}

async function getOrders(req, res) {
  logger.info("GET /order - Solicitando todas las órdenes");
  try {
    const orders = await Order.find();
    logger.info(`GET /order - Órdenes encontradas: ${orders.length}`);
    res.json(orders);
  } catch (error) {
    logger.error(`GET /order - Error: ${error.message}`);
    //console.error("getOrders error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function createOrder(req, res) {
  logger.info("POST /order - Intento de creación de orden");
  try {
    const { product, supplierId, date, description, category, price, quantityProduct, status, total, } = req.body;

    if ( !product || !supplierId || !date || !description ||  !category ||  price == null || quantityProduct == null || !status ||  !total ) {
      logger.warn("POST /order - Faltan campos obligatorios");
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const orderId = Date.now().toString();
    const newOrder = new Order({ orderId, supplierId, product, date, description, category, price, quantityProduct, status, total });

    await newOrder.save();
    logger.info(`POST /order - Orden creada con ID=${orderId}`);
    res.status(201).json(newOrder);
  } catch (error) {
    logger.error(`POST /order - Error: ${error.message}`);
    //console.error("createOrder error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updateOrder(req, res) {
  const { id } = req.params;
  logger.info(`PUT /order/${id} - Intento de actualización`);
  const { supplierId, product, date, description, category, price, quantityProduct, status, total,} = req.body;

  try {
    const order = await Order.findOne({ orderId: id });
    if (!order){
      logger.warn(`PUT /order/${id} - Orden no encontrada`);
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    order.product = product;
    order.supplierId = supplierId;
    order.date = date;
    order.description = description;
    order.category = category;
    order.price = price;
    order.quantityProduct = quantityProduct;
    order.status = status;
    order.total = total;

    await order.save();
    logger.info(`PUT /order/${id} - Orden actualizada correctamente`);
    res.json(order);
  } catch (error) {
    logger.error(`PUT /order/${id} - Error: ${error.message}`);
    //console.error("updateOrder error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function deleteOrder(req, res) {
  const { id } = req.params;
  logger.info(`DELETE /order/${id} - Intento de eliminación`);
  try {
    const order = await Order.findOne({ orderId: id });

    if (!order) {
      logger.warn(`DELETE /order/${id} - Orden no encontrada`);
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    await order.deleteOne();
    logger.info(`DELETE /order/${id} - Orden eliminada`);
    res.json({ message: "Orden eliminada" });
  } catch (error) {
    logger.error(`DELETE /order/${id} - Error: ${error.message}`);
    //console.error("deleteOrder error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  renderOrders
};
