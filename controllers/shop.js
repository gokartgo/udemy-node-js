const Product = require('../models/product');
const Cart = require('../models/cart');

const getProducts = (req, res, next) => {
    // Product.fetchAll((products) => {
    //     // console.log('products', products)
    //     res.render('shop/product-list',
    //         {
    //             prods: products,
    //             pageTitle: 'All Products',
    //             path: '/products',
    //         });
    //     // layout: false special key that understood hbs not use default layout
    // });
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/product-list',
                {
                    prods: rows,
                    pageTitle: 'All Products',
                    path: '/products',
                });
        })
        .catch(err => {
            console.log(err);
        })
}

const getIndex = (req, res, next) => {
    // Product.fetchAll((products) => {
    //     // console.log('products', products)
    //     res.render('shop/index', {
    //         prods: products,
    //         pageTitle: 'Shop',
    //         path: '/',
    //     });
    //     // layout: false special key that understood hbs not use default layout

    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/index', {
                prods: rows,
                pageTitle: 'Shop',
                path: '/',
            })
        }
        )
        .catch(err => {
            console.log(err);
        })
}


const getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => {
                    return prod.id === product.id
                });
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart',
                {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products: cartProducts
                });
        });
    });
}

const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
    })
}

const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    });
}

const getProduct = (req, res, next) => {
    const { productId = '' } = req.params;
    // Product.findById(productId, product => {
    //     res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
    // });
    Product.findById(productId)
        .then(([[product]]) => {
            res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
        })
        .catch(err => {
            console.log(err)
        })
    // products get value [[{id:2 ....}]]
}

const postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price)
    });
    res.redirect('/cart');
}

const postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    })
}

module.exports = {
    getProducts,
    getIndex,
    getCart,
    getCheckout,
    getOrders,
    getProduct,
    postCart,
    postCartDeleteProduct,
}