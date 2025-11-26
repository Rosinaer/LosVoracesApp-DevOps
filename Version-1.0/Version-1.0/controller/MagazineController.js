const path = require('path');
const { readJSON, writeJSON } = require('../model/Database');
const Magazine = require('../model/Magazine');

const filePath = path.join(__dirname, '../data/Magazine.json');

async function getMagazines(req, res) {
    try {
        const data = await readJSON(filePath);
        res.json(data);
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

        const data = await readJSON(filePath);

        const magazineId = Date.now().toString();
        const newMagazine = new Magazine(magazineId, name, price, issn, number, section, date, stock, issueNumber);
        data.push(newMagazine);


        await writeJSON(filePath, data);
        res.status(201).json(newMagazine);
    } catch (error) {
        console.error('createMagazine error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });

    }
}

async function updateMagazine(req, res) {
    const { id } = req.params;
    const { name, price, issn, number, section, date, stock, issueNumber } = req.body;

    const data = await readJSON(filePath);
    const index = data.findIndex(p => p.magazineId === id);
    if (index === -1) return res.status(404).json({ error: 'Revista no encontrada' });

    data[index].name = name;
    data[index].issn = issn;
    data[index].price = price;
    data[index].number = number;
    data[index].section = section;
    data[index].stock = stock;
    data[index].date = date;
    data[index].issueNumber = issueNumber;

    await writeJSON(filePath, data);
    res.json(data[index]);
}

async function deleteMagazine(req, res) {
    const { id } = req.params;
    const data = await readJSON(filePath);

    const updated = data.filter(p => p.magazineId !== id);
    await writeJSON(filePath, updated);

    res.json({ message: 'Revista eliminada' });
}

async function renderCatalog(req, res) {
    try {
        const magazines = await readJSON(filePath);
        res.render('MagazineCatalog', { magazines });
    } catch (err) {
        console.error('Error al renderizar el catalogo de revistas', err);
        res.status(500).send('Error al cargar el catálogo de revistas');
    }
}

module.exports = {
    getMagazines,
    createMagazine,
    updateMagazine,
    deleteMagazine,
    renderCatalog
};
