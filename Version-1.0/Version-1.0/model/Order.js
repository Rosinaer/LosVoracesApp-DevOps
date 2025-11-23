class Order {
    #orderId;
    #supplierId;
    #product;
    #date;
    #description;
    #category;
    #price;
    #quantityProduct;
    #status;
    #total;

    static STATUS_TYPES = { // Primer draft de algún status para las orders
        PENDING: 'pending',
        CONFIRMED: 'confirmed',
        DELIVERED: 'delivered',
        CANCELLED: 'cancelled'
    };

    constructor(orderId, supplierId, product, date, description, category, price, quantityProduct, status = Order.STATUS_TYPES.PENDING) {
        if (!orderId || !supplierId || !product || !category) {
            throw new Error('Order must have all required properties');
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

        if (!Object.values(Order.STATUS_TYPES).includes(status)) {
            throw new Error('Invalid order status');
        }

        if (description && typeof description !== 'string') {
            throw new Error('Description must be a string');
        }

        this.#orderId = orderId;
        this.#supplierId = supplierId;
        this.#product = {...product}; // Create a copy to prevent reference issues
        this.#date = date;
        this.#description = description || '';
        this.#category = category;
        this.#price = price;
        this.#quantityProduct = quantityProduct;
        this.#status = status;
        this.#total = price * quantityProduct;
    }

    get orderId() {
        return this.#orderId;
    }

    get supplierId() {
        return this.#supplierId;
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

    get status() {
        return this.#status;
    }

    get total() {
        return this.#total;
    }

    updateStatus(newStatus) {
        if (!Object.values(Order.STATUS_TYPES).includes(newStatus)) {
            throw new Error('Invalid order status');
        }
        
        // Validate status transitions
        if (this.#status === Order.STATUS_TYPES.CANCELLED) {
            throw new Error('Cannot update status of a cancelled order');
        }
        if (this.#status === Order.STATUS_TYPES.DELIVERED && newStatus !== Order.STATUS_TYPES.CANCELLED) {
            throw new Error('Delivered order can only be cancelled');
        }

        this.#status = newStatus;
    }
}

module.exports = Order;