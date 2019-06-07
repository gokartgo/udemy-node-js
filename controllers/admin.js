const Product = require('../models/product');

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
    const product = new Product(null, title, imageUrl, description, price);
    product.save().then(() => {
        res.redirect('/');
    }).catch(err => console.log(err));
    // console.log(req.body);
}

const getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    console.log('req query', !req.query.edit)
    const editMode = req.query.edit
    if (editMode != 'true') {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product
        })
    });
}

const postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updateProduct = new Product(prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    console.log('test');
    updateProduct.save();
    res.redirect('/admin/products');
}

const postDeleteProducts = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}

const getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // console.log('products', products)
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
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