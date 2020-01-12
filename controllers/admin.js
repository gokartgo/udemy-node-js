const mongodb = require('mongodb')
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId

const getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    if (!req.session.isLoggedIn) {
        return res.redirect('/login')
    }
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
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.user,
    })
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
                product,
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
    Product.findById(prodId).then(product => {
            if (product.userId !== req.user._id) {
                return res.redirect('/')
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        }).then(result => {
            console.log('update product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
}

const postDeleteProducts = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteOne({
            _id: prodId,
            userId: req.user._id
        })
        .then(() => {
            console.log('destroyed product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

const getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id') select only title price and cancel _id
        // .populate('userId', 'name email -_id')
        .then((products) => {
            console.log('products', products)
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