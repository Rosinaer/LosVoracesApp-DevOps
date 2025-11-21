function updateStock(currentStock, quantity) {
    if (typeof quantity !== 'number') {
        throw new Error('Quantity must be a number');
    }
    const newStock = currentStock + quantity;
    if (newStock < 0) {
        throw new Error('Stock cannot be negative');
    }
    return newStock;
}

module.exports = {
    updateStock
};
