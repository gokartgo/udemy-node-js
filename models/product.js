// const fs = require('fs');
// const path = require('path');
// const rootDir = require('../util/path');
// const p = path.join(rootDir, 'data', 'products.json');
const Cart = require('./cart');
const db = require('../util/database');

// const getProductsFromFile = (cb) => {
//     fs.readFile(p, (err, fileContent) => {
//         // console.log('file content', fileContent)
//         if (err) {
//             cb([]);
//         } else {
//             cb(JSON.parse(fileContent));
//         }
//     })
// }
class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price
    }
    save() {
        // getProductsFromFile(products => {
        //     if (this.id) {
        //         const existingProductIndex = products.findIndex(prod => {
        //             return prod.id === this.id
        //         });
        //         const updatedProducts = [...products];
        //         updatedProducts[existingProductIndex] = this;
        //         console.log(updatedProducts)
        //         fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        //             console.log('writeFile error', err)
        //         })
        //     } else {
        //         this.id = new Date().getTime().toString();
        //         products.push(this);
        //         fs.writeFile(p, JSON.stringify(products), (err) => {
        //             console.log('writeFile error', err)
        //         })
        //     }
        // });
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?,?,?,?)', [this.title, this.price, this.imageUrl, this.description]);
    }
    static deleteById(productId) {
        // getProductsFromFile(prods => {
        //     const product = prods.find(prod => prod.id === productId);
        //     const products = prods.filter(prod => {
        //         return prod.id !== productId;
        //     })
        //     fs.writeFile(p, JSON.stringify(products), (err) => {
        //         if (!err) {
        //             Cart.deleteProduct(productId, product.price);
        //         }
        //     })
        // })
    }

    static fetchAll(cb) {
        // getProductsFromFile(cb)
        return db.execute('SELECT * FROM products');
    }

    static findById(id, cb) {
        // getProductsFromFile(products => {
        //     const product = products.find(p => {
        //         return p.id === id
        //     });
        //     cb(product);
        // })
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
}

module.exports = Product