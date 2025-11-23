const Supplier = require("../model/Supplier");

async function renderSupplierCatalog(req, res) {
  try {
    const suppliers = await Supplier.find().lean();
    res.render('SupplierCatalog', { suppliers });
  } catch (error) {
    console.error('Error al renderizar catálogo de proveedores:', error);
    res.status(500).send('Error al cargar el catálogo de proveedores');
  }
}

async function getSuppliers(req, res) {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    console.error('getSuppliers error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }

}

async function createSupplier(req, res) {
  try {
    const { name, phoneNumber, email, category, catalog } = req.body;

    if (!name || !phoneNumber || !email || !category || !catalog) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const supplierId = Date.now().toString();
    const newSupplier = new Supplier({ supplierId, name, phoneNumber, email, category, catalog });

    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error('createSupplier error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


async function updateSupplier(req, res) {
  const { id } = req.params;
  const { name, phoneNumber, email, category, catalog } = req.body;
try {
  const supplier = await Supplier.findOne({ supplierId: id });
  
  if (!supplier) return res.status(404).json({ error: 'Proveedor no encontrado' });

  supplier.name = name;
  supplier.phoneNumber = phoneNumber;
  supplier.email = email;
  supplier.category = category;
  supplier.catalog = catalog;

  await supplier.save();
  res.json(supplier);
} catch (error) {
    console.error("updateSupplier error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }  
}

async function deleteSupplier(req, res) {
  const { id } = req.params;
  try {
  const supplier = await Supplier.findOne ({ supplierId: id });

  if (!supplier) {
    return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
  await supplier.deleteOne();
res.json({ message: 'Proveedor eliminado' });
} catch (error) {
    console.error("deleteSupplier error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getSuppliersByCategory(req, res) {
  const { category } = req.params;

  try {
    const filtered = await Supplier.find({ category: { $regex: new RegExp(`^${category}$`, 'i') } });
    res.json(filtered);
  } catch (error) {
    console.error('getSuppliersByCategory error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getSupplierById(req, res) {
  const { id } = req.params;

  try {
    const supplier = await Supplier.findOne({ supplierId: id });

    if (!supplier) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(supplier);
  } catch (error) {
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
