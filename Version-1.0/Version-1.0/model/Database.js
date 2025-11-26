const { read } = require('fs');

const fs = require('fs').promises;

async function readJSON(filePath) {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

async function writeJSON(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    readJSON,
    writeJSON,
};