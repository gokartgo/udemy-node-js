const mongodb = require('mongodb')
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId

const getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
    })
}

const postAddProduct = (req, res, next) => {
    const {
        title = '',
        imageUrl = '',
        price = 0,
        description = '',
    } = req.body;
    const product = new Product(title, price, description, imageUrl, null, req.user._id)
    product
        .save()
        .then(result => {
            console.log('Create Product');
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        });
}

const getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    console.log('req query', req.query.edit)
    const editMode = req.query.edit
    if (editMode != 'true') {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        //Product.findByPk(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product
            })
        })
        .catch(err => {
            console.log(err);
        });
}

const postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    console.log('a ', prodId)
    console.log('b ', new ObjectId(prodId))
    const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId)
    product.save()
        .then(result => {
            console.log('update product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        })
}

const postDeleteProducts = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteById(prodId)
        .then(() => {
            console.log('destroyed product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

const getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            // console.log('products', products)
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        }).catch(err => {
            console.log(err);
        });
}

module.exports = {
    getAddProduct,
    postAddProduct,
    getEditProduct,
    postEditProduct,
    postDeleteProducts,
    getProducts,
}