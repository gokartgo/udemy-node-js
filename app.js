// const routes = require('./routes');
// const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
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
// const shopRoutes = require('./routes/shop');

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

// app.use((req, res, next) => {
//     User.findByPk(1)
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err));
// })

app.use('/admin', adminRoutes.router);
// app.use(shopRoutes);


// const server = http.createServer(app);

// server.listen(9000);

app.use(errorController.get404Page);

mongoConnect(() => {
    app.listen(3000)
})
