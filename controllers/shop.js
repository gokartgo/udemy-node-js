const Product = require("../models/product");
const Order = require("../models/order");

const getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/products",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

const getIndex = (req, res, next) => {
    console.log(req.user)
    Product.find()
        .then(products => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

const getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then(user => {
            return res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: user.cart.items,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
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
};

const postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return {
                    product: {
                        ...i.productId._doc
                    }, // if separate productId only will get another data from mongoose then we add _doc for get only data of productId
                    quantity: i.quantity
                };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user // only object mongoose will auto pick id
                },
                products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch(err => {
            console.log(err);
        });
};

const getOrders = (req, res, next) => {
    Order.find({
            "user.userId": req.user._id
        })
        .then(orders => {
            console.log("getOrder orders", orders);
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

const getProduct = (req, res, next) => {
    const {
        productId = ""
    } = req.params;
    Product.findById(productId)
        .then(product => {
            res.render("shop/product-detail", {
                product,
                pageTitle: product.title,
                path: "/products",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
    // products get value [[{id:2 ....}]]
};

const postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            console.log("this user", req.user);
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect("/cart");
        });
};

const postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            console.log(err);
        });
};

module.exports = {
    getProducts,
    getIndex,
    getCart,
    postOrder,
    getOrders,
    getProduct,
    postCart,
    postCartDeleteProduct
};