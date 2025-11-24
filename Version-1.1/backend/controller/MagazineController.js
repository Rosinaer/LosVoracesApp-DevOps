const Magazine = require('../model/Magazine.js');
const { updateStock } = require("../model/helpers/stockHelper");
const logger = require("../utils/logger.js");

async function getMagazines(req, res) {
  logger.info("GET /magazine - Inicio de solicitud");
    try {
        const magazines = await Magazine.find( );
        logger.info(`GET /magazine - Revistas encontradas: ${magazines.length}`);
        res.json(magazines);
    } catch (error) {
      logger.error(`GET /magazine - Error: ${error.message}`);
        //console.error('getMagazine error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}


async function createMagazine(req, res) {
  logger.info("POST /magazine - Intento de creación de revista");
    try {
        const { name, price, issn, number, section, date, stock, issueNumber } = req.body;

        if (!name || !issn || price == null || !issueNumber) {
          logger.warn("POST /magazine - Faltan campos obligatorios");
          return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const magazineId = Date.now().toString();
        const newMagazine = new Magazine({ magazineId, name, price, issn, number, section, date, stock, issueNumber });
        

        await newMagazine.save();
        logger.info(`POST /magazine - Revista creada con ID=${magazineId}`);
        res.status(201).json(newMagazine);
    } catch (error) {
      logger.error(`POST /magazine - Error: ${error.message}`);
      //console.error('createMagazine error:', error);
      res.status(500).json({ error: 'Error interno del servidor' });

    }
}

async function updateMagazine(req, res) {
    const { id } = req.params;
    logger.info(`PUT /magazine/${id} - Intento de actualización`);
    const { name, price, issn, number, section, date, stock, issueNumber } = req.body;

   try {
    const magazine = await Magazine.findOne({ magazineId: id });

     if (!magazine){
      logger.warn(`PUT /magazine/${id} - Revista no encontrada`);
      return res.status(404).json({ error: "Revista no encontrada" });
     }

     magazine.name = name;  
     magazine.price = price; 
     magazine.issn = issn;  
     magazine.number = number;  
     magazine.section = section;  
     magazine.date = date; 
     magazine.stock = stock;  
     magazine.issueNumber = issueNumber; 

    await magazine.save();
    logger.info(`PUT /magazine/${id} - Revista actualizada correctamente`);
    res.json(magazine);
  } catch (error) {
    logger.error(`PUT /magazine/${id} - Error: ${error.message}`);
    //console.error("updateMagazine error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

async function deleteMagazine(req, res) {
    const { id } = req.params;
    logger.info(`DELETE /magazine/${id} - Intento de eliminación`);

    try {
    const magazine = await Magazine.findOne({ magazineId: id });

    if (!magazine) {
      logger.warn(`DELETE /magazine/${id} - Revista no encontrada`);
      return res.status(404).json({ error: "Revista no encontrada" });
    }

    await magazine.deleteOne();

    logger.info(`DELETE /magazine/${id} - Revista eliminada`);
    res.json({ message: "Revista eliminada" });
  } catch (error) {
    logger.error(`DELETE /magazine/${id} - Error: ${error.message}`);
    //console.error("deleteMagazine error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function renderCatalog(req, res) {
    logger.info("GET /magazine/catalog - Renderizando catálogo");
    try {
        const magazines = await Magazine.find();
        logger.info(`GET /magazine/catalog - Revistas cargadas: ${magazines.length}`);
        res.render('MagazineCatalog', { magazines });
    } catch (error) {
        logger.error(`GET /magazine/catalog - Error: ${error.message}`);
        //console.error('Error al renderizar el catalogo de revistas', error);
        res.status(500).send('Error al cargar el catálogo de revistas');
    }
}

async function updateMagazineStock(req, res) {
  const { id } = req.params;
  const { quantity } = req.body;
  logger.info(`PATCH /magazine/${id}/stock - Actualizando stock. Cantidad=${quantity}`); 

  if (typeof quantity !== 'number') {
    logger.warn(`PATCH /magazine/${id}/stock - Quantity inválido`);
    return res.status(400).json({ error: 'Quantity debe ser un número' });
  }

  try {
    const magazine = await Magazine.findOne({ magazineId: id });
    if (!magazine){
      logger.warn(`PATCH /magazine/${id}/stock - Revista no encontrada`);
      return res.status(404).json({ error: "Revista no encontrada" });
    }
    const oldStock = magazine.stock;
    magazine.stock = updateStock(magazine.stock, quantity);

    await magazine.save();
    logger.info(
      `PATCH /magazine/${id}/stock - Stock actualizado: ${oldStock} → ${magazine.stock}`
    );
    res.json({ message: 'Stock actualizado', magazine });
  } catch (error) {
    logger.error(`PATCH /magazine/${id}/stock - Error: ${error.message}`);
    //console.error("updateMagazineStock error:", error);
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

