const bcrypt = require("bcryptjs")
// const nodemailer = require("nodemailer")
// const sendgridTransport = require("nodemailer-sendgrid-transport")

const User = require("../models/user");

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_key: // create api key in send grid
//     }
// }))

const getLogin = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
    })
}

const getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
    })
}

const postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie','loggedIn=true')
    // req.get('Cookie') AnyData; loggedIn=true
    const {
        email,
        password,
    } = req.body
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.');
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err)
                        return res.redirect('/');
                    })
                }
                res.redirect('/login')
            }).catch(err => {
                console.log(err)
                return res.redirect('/login')
            })
        })
        .catch(err => console.log(err));
}

const postSignup = (req, res, next) => {
    const {
        email,
        password,
        confirmPassword
    } = req.body
    User.findOne({
            email: email // left field from database right field from my email
        }).then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12).then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: {
                        items: []
                    }
                })
                return user.save();
            }).then(result => {
                res.redirect('/login')
                // return transporter.sendMail({
                //     to: email,
                //     from: 'shop@node-complete.com',
                //     subject: 'Signup succeeded',
                //     html: '<h1>You successfully signed up</h1>'
                // }).catch(err => {
                //     console.log(err)
                // })
            })
        })
        .catch(err => {
            console.log(err)
        })
}

const postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/')
    })
}

module.exports = {
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    postLogout,
}