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
    req.user.createProduct({
        title,
        imageUrl,
        price,
        description
    }).then(result => {
        console.log('Create Product');
        res.redirect('/admin/products')
    })
        .catch(err => {
            console.log(err)
        });
}

const getEditProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    console.log('req query', !req.query.edit)
    const editMode = req.query.edit
    if (editMode != 'true') {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    req.user.getProducts({ where: { id: prodId } })
        //Product.findByPk(prodId)
        .then(products => {
            const product = products[0];
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
    Product.findByPk(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save();
    })
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
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('destroyed product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

const getProducts = (req, res, next) => {
    req.user.getProducts()
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