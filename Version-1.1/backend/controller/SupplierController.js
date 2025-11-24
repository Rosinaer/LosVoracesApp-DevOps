const Supplier = require("../model/Supplier");
const logger = require("../utils/logger.js");

async function renderSupplierCatalog(req, res) {
  logger.info("GET /supplier/catalog - Renderizando catálogo de proveedores");
  try {
    const suppliers = await Supplier.find().lean();
    logger.info(`GET /supplier/catalog - Proveedores cargados: ${suppliers.length}`);
    res.render('SupplierCatalog', { suppliers });
  } catch (error) {
    logger.error(`GET /supplier/catalog - Error: ${error.message}`);
    console.error('Error al renderizar catálogo de proveedores:', error);
    res.status(500).send('Error al cargar el catálogo de proveedores');
  }
}

async function getSuppliers(req, res) {
  logger.info("GET /supplier - Solicitando todos los proveedores");
  try {
    const suppliers = await Supplier.find();
    logger.info(`GET /supplier - Proveedores encontrados: ${suppliers.length}`);
    res.json(suppliers);
  } catch (error) {
    logger.error(`GET /supplier - Error: ${error.message}`);
    console.error('getSuppliers error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

}

async function createSupplier(req, res) {
  logger.info("POST /supplier - Intento de creación de proveedor", { body: req.body });
  try {
    const { name, phoneNumber, email, category, catalog } = req.body;

    if (!name || !phoneNumber || !email || !category || !catalog) {
      logger.warn("POST /supplier - Faltan campos obligatorios");
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const supplierId = Date.now().toString();
    const newSupplier = new Supplier({ supplierId, name, phoneNumber, email, category, catalog });

    await newSupplier.save();
    logger.info(`POST /supplier - Proveedor creado con ID=${supplierId}`);
    res.status(201).json(newSupplier);
  } catch (error) {
    logger.error(`POST /supplier - Error: ${error.message}`);
    console.error('createSupplier error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


async function updateSupplier(req, res) {
  const { id } = req.params;
  logger.info(`PUT /supplier/${id} - Intento de actualización`, { body: req.body });
  const { name, phoneNumber, email, category, catalog } = req.body;
try {
  const supplier = await Supplier.findOne({ supplierId: id });
  
  if (!supplier) {
    logger.warn(`PUT /supplier/${id} - Proveedor no encontrado`);
    return res.status(404).json({ error: 'Proveedor no encontrado' });
  }

  supplier.name = name;
  supplier.phoneNumber = phoneNumber;
  supplier.email = email;
  supplier.category = category;
  supplier.catalog = catalog;

  await supplier.save();
  logger.info(`PUT /supplier/${id} - Proveedor actualizado correctamente`);
  res.json(supplier);
} catch (error) {
    logger.error(`PUT /supplier/${id} - Error: ${error.message}`);
    console.error("updateSupplier error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }  
}

async function deleteSupplier(req, res) {
  const { id } = req.params;
  logger.info(`DELETE /supplier/${id} - Intento de eliminación`);
  try {
  const supplier = await Supplier.findOne ({ supplierId: id });

  if (!supplier) {
    logger.warn(`DELETE /supplier/${id} - Proveedor no encontrado`);
    return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  await supplier.deleteOne();
  logger.info(`DELETE /supplier/${id} - Proveedor eliminado`);
  res.json({ message: 'Proveedor eliminado' });
} catch (error) {
    logger.error(`DELETE /supplier/${id} - Error: ${error.message}`);
    console.error("deleteSupplier error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getSuppliersByCategory(req, res) {
  const { category } = req.params;
  logger.info(`GET /supplier/category/${category} - Consultando proveedores por categoría`);

  try {
    const filtered = await Supplier.find({ category: { $regex: new RegExp(`^${category}$`, 'i') } });
    logger.info(`GET /supplier/category/${category} - Proveedores encontrados: ${filtered.length}`);
    res.json(filtered);
  } catch (error) {
    logger.error(`GET /supplier/category/${category} - Error: ${error.message}`);
    console.error('getSuppliersByCategory error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getSupplierById(req, res) {
  const { id } = req.params;
  logger.info(`GET /supplier/${id} - Consultando proveedor por ID`);

  try {
    const supplier = await Supplier.findOne({ supplierId: id });

    if (!supplier) {
      logger.warn(`GET /supplier/${id} - Proveedor no encontrado`);
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    logger.info(`GET /supplier/${id} - Proveedor encontrado`);
    res.json(supplier);
  } catch (error) {
    logger.error(`GET /supplier/${id} - Error: ${error.message}`);
    console.error('getSupplierById error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSuppliersByCategory,
  getSupplierById,
  renderSupplierCatalog
};
