// const routes = require('./routes');
// const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const errorController = require('./controllers/error');

const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
const app = express();

// for handle
// app.engine('hbs', expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// const rqListener = (req, res) => {
//     console.log(routes.someText)
//     routes.handler(req, res)
// }

// app.use((req, res, next) => {
//     console.log('In the middleware!');
//     next(); // Allows the request to continue to next middieware in line
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes.router);
app.use(shopRoutes);


// const server = http.createServer(app);

// server.listen(9000);

app.use(errorController.get404Page);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }) // userId add to products in database
User.hasMany(Product); // create method getProducts setProducts
// HasOne inserts the association key in target model whereas BelongsTo inserts the association key in the source model
User.hasOne(Cart); // userId add to carts in database
Cart.belongsTo(User); // userId add to products in database
Cart.belongsToMany(Product, { through: CartItem });
// This will create the table CartItem which stores the ids of the objects. ex productId and create method getProducts, setProducts, addProduct,addProducts
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize.sync().then(result => {

    // console.log(result);
    return User.findByPk(1);
})
    .then(user => {
        if (!user) {
            return User.create({ name: 'gokart', email: 'test@test.com' });
        }
        return user
    })
    .then(user => {
        // console.log(user);
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
