const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const shopController = require('../controllers/shop');

const adminData = require('./admin');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

// router.get('/products/delete')

// router.get('/products/:productId', shopController.getProduct) // ถ้าเอา /products/delete ไว้ข้างล่างตาม comment จะไม่ถูกทำงานแก้โดยไว้ข้างบนเพราะ code จะทำงานจากบนลงล่าง

// router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

// router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// router.post('/create-order', shopController.postOrder);

// router.get('/orders', shopController.getOrders);

module.exports = router;