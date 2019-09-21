const Product = require('../models/product');

const getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/product-list',
                {
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
    Product.fetchAll().then(products => {
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
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    console.log('product', products)
                    res.render('shop/cart',
                        {
                            path: '/cart',
                            pageTitle: 'Your Cart',
                            products
                        });
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
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }))
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .then(result => {
            fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err)
        })
}

const getOrders = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
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
    const { productId = '' } = req.params;
    // Product.findById(productId, product => {
    //     res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
    // });'
    // Product.findAll({
    //     where: {
    //         id: productId
    //     }
    // })
    //     .then((product) => {
    //         console.log('product', product)
    //         res.render('shop/product-detail', { product: product[0], pageTitle: product[0].title, path: '/products' })
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     })
    Product.findByPk(productId)
        .then((product) => {
            res.render('shop/product-detail', { product, pageTitle: product.title, path: '/products' })
        })
        .catch(err => {
            console.log(err)
        })
    // products get value [[{id:2 ....}]]
}

const postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            console.log('cart', cart);
            fetchCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            console.log('products', products)
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product
            }
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
}

const postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            console.log('postCartDeleteProduct products', products);
            const product = products[0];
            return product.cartItem.destroy();
        })
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