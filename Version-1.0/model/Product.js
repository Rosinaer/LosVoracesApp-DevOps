class Product {
    #productId;
    #name;
    #category;

    constructor(productId, name, category) {
        if (!productId || !name || !category) {
            throw new Error('Product must have a productId, name, and category');
        }

        this.#productId = productId;
        this.#name = name;
        this.#category = category;
    }

    get productId() {
        return this.#productId;
    }

    get name() {
        return this.#name;
    }

    get category() {
        return this.#category;
    }
}

module.exports = Product;