const SchoolSupply = require("../model/SchoolSupply.js");
const { updateStock } = require("../model/helpers/stockHelper");
const logger = require("../utils/logger.js");

async function getSchoolSupplies(req, res) {
  logger.info("GET /schoolSupply - Solicitando todos los útiles escolares");
  try {
    const schoolSupplies = await SchoolSupply.find();
    logger.info(`GET /schoolSupply - Útiles encontrados: ${schoolSupplies.length}`);
    res.json(schoolSupplies);
  } catch (error) {
    logger.error(`GET /schoolSupply - Error: ${error.message}`);
    //console.error("getSchoolSupplies error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function createSchoolSupply(req, res) {
  logger.info("POST /schoolSupply - Intento de creación de útil escolar", { body: req.body });
  try {
    const { name, price, section, stock, brand, description } = req.body;

    if (!name || price == null || !brand) {
      logger.warn("POST /schoolSupply - Faltan campos obligatorios");
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const schoolSupplyId = Date.now().toString();
    const newSchoolSupply = new SchoolSupply({
      schoolSupplyId,
      name,
      price,
      section,
      stock,
      brand,
      description,
    });

    await newSchoolSupply.save();
    logger.info(`POST /schoolSupply - Útil escolar creado con ID=${schoolSupplyId}`);
    res.status(201).json(newSchoolSupply);
  } catch (error) {
    logger.error(`POST /schoolSupply - Error: ${error.message}`);
    //console.error("createSchoolSupply error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updateSchoolSupply(req, res) {
  const { id } = req.params;
  logger.info(`PUT /schoolSupply/${id} - Intento de actualización`, { body: req.body });
  const { name, price, section, stock, brand, description } = req.body;

  try {
    const schoolSupply = await SchoolSupply.findOne({ schoolSupplyId: id });

    if (!schoolSupply){
      logger.warn(`PUT /schoolSupply/${id} - Útil escolar no encontrado`);
      return res.status(404).json({ error: "Útil escolar no encontrado" });
    }

    schoolSupply.name = name;
    schoolSupply.price = price;
    schoolSupply.section = section;
    schoolSupply.stock = stock;
    schoolSupply.brand = brand;
    schoolSupply.description = description;

    await schoolSupply.save();
    logger.info(`PUT /schoolSupply/${id} - Útil escolar actualizado correctamente`);
    res.json(schoolSupply);
  } catch (error) {
    logger.error(`PUT /schoolSupply/${id} - Error: ${error.message}`);
    //console.error("updateSchoolsupply error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function deleteSchoolSupply(req, res) {
  const { id } = req.params;
  logger.info(`DELETE /schoolSupply/${id} - Intento de eliminación`);

  try {
    const schoolSupply = await SchoolSupply.findOne({ schoolSupplyId: id });

    if (!schoolSupply) {
      logger.warn(`DELETE /schoolSupply/${id} - Útil escolar no encontrado`);
      return res.status(404).json({ error: "Útil escolar no encontrado" });
    }

    await schoolSupply.deleteOne();
    logger.info(`DELETE /schoolSupply/${id} - Útil escolar eliminado`);

    res.json({ message: "Útil escolar eliminado" });
  } catch (error) {
    logger.error(`DELETE /schoolSupply/${id} - Error: ${error.message}`);
    //console.error("deleteSchoolSupply error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function renderCatalog(req, res) {
  logger.info("GET /schoolSupply/catalog - Renderizando catálogo de útiles escolares");
  try {
    const schoolSupplies = await SchoolSupply.find();
    logger.info(`GET /schoolSupply/catalog - Útiles cargados: ${schoolSupplies.length}`);
    res.render("SchoolSupplyCatalog", { schoolSupplies });
  } catch (error) {
    logger.error(`GET /schoolSupply/catalog - Error: ${error.message}`);
    //console.error("Error al renderizar el catalogo de útiles escolares", err);
    res.status(500).send("Error al cargar el catálogo de útiles escolares");
  }
}

async function updateSchoolSupplyStock(req, res) {
  const { id } = req.params;
  logger.info(`PATCH /schoolSupply/${id}/stock - Actualización de stock. Cantidad=${quantity}`);
  const { quantity } = req.body; 

  if (typeof quantity !== 'number') {
    logger.warn(`PATCH /schoolSupply/${id}/stock - Quantity inválido`);
    return res.status(400).json({ error: 'Quantity debe ser un número' });
  }

  try {
    const schoolSupply = await SchoolSupply.findOne({ schoolSupplyId: id });
    if (!schoolSupply){
       logger.warn(`PATCH /schoolSupply/${id}/stock - Útil escolar no encontrado`);
       return res.status(404).json({ error: "Util Escolar no encontrado" });
      }

    const oldStock = schoolSupply.stock;  
    schoolSupply.stock = updateStock(schoolSupply.stock, quantity);

    await schoolSupply.save();
    logger.info(`PATCH /schoolSupply/${id}/stock - Stock actualizado: ${oldStock} → ${schoolSupply.stock}`);
    res.json({ message: 'Stock actualizado', schoolSupply });
  } catch (error) {
    logger.error(`PATCH /schoolSupply/${id}/stock - Error: ${error.message}`);
    //console.error("updateSchoolSupplyStock error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  getSchoolSupplies,
  createSchoolSupply,
  updateSchoolSupply,
  deleteSchoolSupply,
  renderCatalog,
  updateSchoolSupplyStock
};
