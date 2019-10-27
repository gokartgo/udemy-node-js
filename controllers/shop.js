const Product = require('../models/product');

const getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            console.log(products);
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
            });
        })
        .catch(err => {
            console.log(err);
        })
}

const getIndex = (req, res, next) => {
    Product.find().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        })
    }).catch(err => {
        console.log(err);
    });
}


const getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            return res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products
            })
        })
        .catch(err => {
            console.log(err);
        })
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = [];
    //         for (product of products) {
    //             const cartProductData = cart.products.find(prod => {
    //                 return prod.id === product.id
    //             });
    //             if (cartProductData) {
    //                 cartProducts.push({ productData: product, qty: cartProductData.qty });
    //             }
    //         }
    //         res.render('shop/cart',
    //             {
    //                 path: '/cart',
    //                 pageTitle: 'Your Cart',
    //                 products: cartProducts
    //             });
    //     });
    // });
}

const postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err)
        })
}

const getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            console.log('getOrder orders', orders)
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders
            })
        })
        .catch(err => {
            console.log(err)
        })
}

const getProduct = (req, res, next) => {
    const {
        productId = ''
    } = req.params;
    Product.findById(productId)
        .then((product) => {
            res.render('shop/product-detail', {
                product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => {
            console.log(err)
        })
    // products get value [[{id:2 ....}]]
}

const postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId).then(product => {
        console.log('this user', req.user)
        return req.user.addToCart(product);
    }).then(result => {
        console.log(result)
        res.redirect('/cart');
    })
}

const postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    getProducts,
    getIndex,
    getCart,
    postOrder,
    getOrders,
    getProduct,
    postCart,
    postCartDeleteProduct,
}