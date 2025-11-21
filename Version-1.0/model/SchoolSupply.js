const Product = require('./Product');
class SchoolSupply extends Product {
    #price;
    #section;
    #stock;
    #brand;
    #description;

    constructor(supplyId, name, price, section, stock, brand, description) {
        super(supplyId, name, 'util escolar');

        if (!section || !brand) {
            throw new Error('SchoolSupply must have all required properties');
        }
        if (typeof price !== 'number' || price < 0) {
            throw new Error('Price must be a positive number');
        }
        if (typeof stock !== 'number' || stock < 0) {
            throw new Error('Stock must be a positive number');
        }
        if (description && typeof description !== 'string') {
            throw new Error('Description must be a string');
        }

        this.#price = price;
        this.#section = section;
        this.#stock = stock;
        this.#brand = brand;
        this.#description = description || '';
    }

    get price() {
        return this.#price;
    }

    get section() {
        return this.#section;
    }

    get stock() {
        return this.#stock;
    }

    get brand() {
        return this.#brand;
    }

    get description() {
        return this.#description;
    }

    updateStock(quantity) {
        const { updateStock } = require('./helpers/stockHelper');
        this.#stock = updateStock(this.#stock, quantity);
    }
}

module.exports = SchoolSupply;
