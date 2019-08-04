const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const uri = 'mongodb://@localhost:27017/shop'
const mongoClient = new MongoClient(uri, { useNewUrlParser: true })

let _db;

const mongoConnect = (callback) => {
    mongoClient.connect()
        .then(client => {
            console.log('Connected!');
            _db = client.db()
            callback();
        })
        .catch(err => {
            console.log(err);
        });
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}

module.exports = {
    mongoConnect,
    getDb,
}
