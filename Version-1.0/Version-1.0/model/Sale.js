class Sale {
    #saleId;
    #product;
    #date;
    #description;
    #category;
    #price;
    #quantityProduct;
    #total;

    constructor(saleId, product, date, description, category, price, quantityProduct) {
        if (!saleId || !product || !category) {
            throw new Error('Sale must have all required properties');
        }

        if (!(date instanceof Date) || isNaN(date)) {
            throw new Error('Date must be a valid Date object');
        }

        if (typeof price !== 'number' || price < 0) {
            throw new Error('Price must be a positive number');
        }

        if (typeof quantityProduct !== 'number' || quantityProduct < 1) {
            throw new Error('Quantity must be a positive number');
        }

        if (description && typeof description !== 'string') {
            throw new Error('Description must be a string');
        }

        if (!product.id || typeof product.id !== 'string') {
            throw new Error('Product must have a valid ID');
        }

        this.#saleId = saleId;
        this.#product = {...product}; // Create a copy to prevent reference issues
        this.#date = date;
        this.#description = description || '';
        this.#category = category;
        this.#price = price;
        this.#quantityProduct = quantityProduct;
        this.#total = price * quantityProduct;
    }

    get saleId() {
        return this.#saleId;
    }

    get product() {
        return {...this.#product}; // Return a copy to prevent modification
    }

    get date() {
        return this.#date;
    }

    get description() {
        return this.#description;
    }

    get category() {
        return this.#category;
    }

    get price() {
        return this.#price;
    }

    get quantityProduct() {
        return this.#quantityProduct;
    }

    get total() {
        return this.#total;
    }
}

module.exports = Sale;