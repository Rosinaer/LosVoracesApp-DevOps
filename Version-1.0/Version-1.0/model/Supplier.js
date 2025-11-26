class Supplier {
    #supplierId;
    #name;
    #phoneNumber;
    #email;
    #category;
    #catalog;

    constructor(supplierId, name, phoneNumber, email, category, catalog = []) {
        if (!supplierId || !name || !phoneNumber || !email || !category) {
            throw new Error('Supplier must have all required properties');
        }

        // regex para validar el email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        // regex para validar el num de telefono (allows different formats but must have at least 9 digits)
        const phoneDigits = phoneNumber.replace(/\D/g, '');
        if (phoneDigits.length < 9) {
            throw new Error('Phone number must have at least 9 digits');
        }

        if (!Array.isArray(catalog)) {
            throw new Error('Catalog must be an array');
        }

        this.#supplierId = supplierId;
        this.#name = name;
        this.#phoneNumber = phoneNumber;
        this.#email = email;
        this.#category = category;
        this.#catalog = catalog.map(item => ({...item})); // Crea la copia para que podamos ver los cambios sin tocar el original
    }

    get supplierId() {
        return this.#supplierId;
    }

    get name() {
        return this.#name;
    }

    get phoneNumber() {
        return this.#phoneNumber;
    }

    get email() {
        return this.#email;
    }

    get category() {
        return this.#category;
    }

    get catalog() {
        return [...this.#catalog]; // Return a copy to prevent direct modification
    }

    addToCatalog(item) { // poniendola para que sea una primera version, despues la podemos mejorar
        if (!item || typeof item !== 'object' || !item.id) {
            throw new Error('Invalid catalog item');
        }
        if (this.#catalog.some(existing => existing.id === item.id)) {
            throw new Error('Item with this ID already exists in catalog');
        }
        this.#catalog.push({...item}); // Create a copy to prevent reference issues
    }

    removeFromCatalog(itemId) { // lo mismo, primera version, despues la podemos mejorar
        const index = this.#catalog.findIndex(item => item.id === itemId);
        if (index === -1) {
            throw new Error('Item not found in catalog');
        }
        this.#catalog.splice(index, 1);
    }
}

module.exports = Supplier;