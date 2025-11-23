const Product = require('./Product');

class Magazine extends Product {
    #issn;
    #price;
    #section;
    #stock;
    #date;
    #number;
    #issueNumber;

    constructor(magazineId, name, price, issn, number, section, date, stock, issueNumber) {
        super(magazineId, name, 'revista');

        if (!issn || !section || !date || typeof number === 'undefined' || typeof issueNumber === 'undefined') {
            throw new Error('Magazine must have all required properties');
        }
        if (typeof price !== 'number' || price < 0) {
            throw new Error('Price must be a positive number');
        }
        if (typeof stock !== 'number' || stock < 0) {
            throw new Error('Stock must be a positive number');
        }
        if (typeof number !== 'number' || number < 1) {
            throw new Error('Number must be a positive number');
        }
        if (typeof issueNumber !== 'number' || issueNumber < 1) {
            throw new Error('Issue number must be a positive number');
        }
        if (!(date instanceof Date) || isNaN(date)) {
            throw new Error('Date must be a valid Date object');
        }

        this.#issn = issn;
        this.#price = price;
        this.#section = section;
        this.#stock = stock;
        this.#date = date;
        this.#number = number;
        this.#issueNumber = issueNumber;
    }

    get issn() {
        return this.#issn;
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

    get date() {
        return this.#date;
    }

    get number() {
        return this.#number;
    }

    get issueNumber() {
        return this.#issueNumber;
    }

    updateStock(quantity) {
        const { updateStock } = require('./helpers/stockHelper');
        this.#stock = updateStock(this.#stock, quantity);
    }
}

module.exports = Magazine;