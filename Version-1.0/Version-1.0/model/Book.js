const Product = require('./Product');

class Book extends Product {
    #isbn;
    #price;
    #author;
    #publisherHouse;
    #section;
    #stock;
    #literaryGenre;

    constructor(bookId, title, isbn, price, author, publisherHouse, section, stock, literaryGenre) {
        super(bookId, title, 'libro');
        
        if (!isbn || !author || !publisherHouse || !section || !literaryGenre) {
            throw new Error('Book must have all required properties');
        }
        if (typeof price !== 'number' || price < 0) {
            throw new Error('Price must be a positive number');
        }
        if (typeof stock !== 'number' || stock < 0) {
            throw new Error('Stock must be a positive number');
        }

        this.#isbn = isbn;
        this.#price = price;
        this.#author = author;
        this.#publisherHouse = publisherHouse;
        this.#section = section;
        this.#stock = stock;
        this.#literaryGenre = literaryGenre;
    }

    get isbn() {
        return this.#isbn;
    }

    get price() {
        return this.#price;
    }

    get author() {
        return this.#author;
    }

    get publisherHouse() {
        return this.#publisherHouse;
    }

    get section() {
        return this.#section;
    }

    get stock() {
        return this.#stock;
    }

    get literaryGenre() {
        return this.#literaryGenre;
    }

    updateStock(quantity) {
        const { updateStock } = require('./helpers/stockHelper');
        this.#stock = updateStock(this.#stock, quantity);
    }

    toJSON() {
        return {
            bookId: this.productId, // from Product
            title: this.name, // from Product
            category: this.category, // from Product
            isbn: this.#isbn,
            price: this.#price,
            author: this.#author,
            publisherHouse: this.#publisherHouse,
            section: this.#section,
            stock: this.#stock,
            literaryGenre: this.#literaryGenre
        };
    }
}

module.exports = Book;