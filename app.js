// const routes = require('./routes');
// const http = require('http');
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const utilPath = require("./util/path");
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
// const mongoConnect = require('./util/database').mongoConnect;
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://kritchanon:Gokart13@cluster0-binys.mongodb.net/shop";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions"
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store
  })
);
app.use(csrfProtection);
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use("/admin", adminRoutes.router);
app.use(shopRoutes);
app.use(authRoutes);

console.log(__dirname);
console.log("util path", utilPath);
app.use(errorController.get404Page);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });