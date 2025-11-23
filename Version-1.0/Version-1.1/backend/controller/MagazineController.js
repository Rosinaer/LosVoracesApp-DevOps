const Magazine = require('../model/Magazine.js');
const { updateStock } = require("../model/helpers/stockHelper");

async function getMagazines(req, res) {
    try {
        const magazines = await Magazine.find( );
        res.json(magazines);
    } catch (error) {
        console.error('getMagazines error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


async function createMagazine(req, res) {
    try {
        const { name, price, issn, number, section, date, stock, issueNumber } = req.body;

        if (!name || !issn || price == null || !issueNumber) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const magazineId = Date.now().toString();
        const newMagazine = new Magazine({ magazineId, name, price, issn, number, section, date, stock, issueNumber });
        

        await newMagazine.save();
        res.status(201).json(newMagazine);
    } catch (error) {
        console.error('createMagazine error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });

    }
}

async function updateMagazine(req, res) {
    const { id } = req.params;
    const { name, price, issn, number, section, date, stock, issueNumber } = req.body;

   try {
    const magazine = await Magazine.findOne({ magazineId: id });

     if (!magazine) return res.status(404).json({ error: "Revista no encontrada" });

     magazine.name = name;  
     magazine.price = price; 
     magazine.issn = issn;  
     magazine.number = number;  
     magazine.section = section;  
     magazine.date = date; 
     magazine.stock = stock;  
     magazine.issueNumber = issueNumber; 

     await magazine.save();
    res.json(magazine);
  } catch (error) {
    console.error("updateMagazine error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

async function deleteMagazine(req, res) {
    const { id } = req.params;

    try {
    const magazine = await Magazine.findOne({ magazineId: id });

    if (!magazine) {
      return res.status(404).json({ error: "Revista no encontrada" });
    }

    await magazine.deleteOne();

    res.json({ message: "Revista eliminada" });
  } catch (error) {
    console.error("deleteMagazine error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function renderCatalog(req, res) {
    try {
        const magazines = await Magazine.find();
        res.render('MagazineCatalog', { magazines });
    } catch (error) {
        console.error('Error al renderizar el catalogo de revistas', error);
        res.status(500).send('Error al cargar el catálogo de revistas');
    }
}

async function updateMagazineStock(req, res) {
  const { id } = req.params;
  const { quantity } = req.body; 

  if (typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Quantity debe ser un número' });
  }

  try {
    const magazine = await Magazine.findOne({ magazineId: id });
    if (!magazine) return res.status(404).json({ error: "Revista no encontrada" });

    magazine.stock = updateStock(magazine.stock, quantity);

    await magazine.save();
    res.json({ message: 'Stock actualizado', magazine });
  } catch (error) {
    console.error("updateMagazineStock error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
    getMagazines,
    createMagazine,
    updateMagazine,
    deleteMagazine,
    renderCatalog,
    updateMagazineStock
};

