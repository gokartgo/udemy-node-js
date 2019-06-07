const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir, 'data', 'cart.json');

class Cart {
    constructor() {
        this.products = [];
        this.totalPrice = 0;
    }

    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileConent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileConent)
            }
            // Analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(prod => {
                return prod.id === id
            })
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // add new product / increase quantity
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +productPrice; // +productPrice string to number
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log('add product error', err)
            });
        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const cart = JSON.parse(fileContent)
            const updateCart = { ...cart };
            const product = updateCart.products.find(prod => {
                return prod.id == id
            });
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updateCart.products = updateCart.products.filter(prod => {
                return prod.id !== id
            });
            updateCart.totalPrice = updateCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updateCart), err => {
                console.log(err);
            });

        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        })
    }

}

module.exports = Cart