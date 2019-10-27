// const routes = require('./routes');
// const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5db585e276531885af0b4918')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes.router);
app.use(shopRoutes);

console.log(__dirname);
app.use(errorController.get404Page);

mongoose.connect('mongodb+srv://kritchanon:Gokart13@cluster0-binys.mongodb.net/shop?retryWrites=true&w=majority').then(result => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: 'Gokart',
                email: 'gokart@mail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })
    app.listen(3000);
}).catch(err => {
    console.log(err);
})