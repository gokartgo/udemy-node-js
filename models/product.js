const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl
        this._id = id ? new mongodb.ObjectId(id) : null
    }

    save() {
        const db = getDb();
        let dbOp
        if (this._id) {
            dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this })
            // use $set for update value if not use ex have {id name surname}
            // this have only {id test} value in database will change be {id test}
            // if use $set  value in database will change be {id name surname test}
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(result => {
                // console.log(result)
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                console.log(products)
                return products
            })
            .catch(err => {
                console.log(err)
            });
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next()
            // if have multi data value same you want to find use next will return all
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => {
                console.log()
            })
    }

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then(result => {
                console.log('Deleted');
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = Product;