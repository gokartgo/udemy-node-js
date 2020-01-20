const bcrypt = require("bcryptjs")
const crypto = require("crypto")
// const nodemailer = require("nodemailer")
// const sendgridTransport = require("nodemailer-sendgrid-transport")
const { validationResult } = require('express-validator/check')
const User = require("../models/user");

// const transporter = nodemailer.createTransport(sendgridTransport({
//     auth: {
//         api_key: // create api key in send grid
//     }
// }))

const getLogin = (req, res, next) => {
    let message = req.flash('error')
    console.log('message', message)
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
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
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
                console.log('errorerror')
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
                req.flash('error', 'Invalid email or password.');
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
    const errors = validationResult(req)
    console.log(errors.array())
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
        });
    }
    User.findOne({
            email: email // left field from database right field from my email
        }).then(userDoc => {
            if (userDoc) {
                req.flash(
                    'error',
                    'E-Mail exists already'
                )
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

const getReset = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
    })
}

const postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({
                email: req.body.email
            }).then(user => {
                if (!user) {
                    req.flash('error', 'No account')
                    return res.redirect('/reset')
                }
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            }).then(result => {
                // test email
                res.render('auth/reset-email', {
                    token
                })
                // transporter.sendMail({
                //     to: req.body.email,
                //     from: 'shop@node-complete.com',
                //     subject: 'Password reset',
                //     html: `
                //         <p>You requested a password reset</p>
                //         <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set new password</p>
                //     `
                // })
            })
            .catch(err => {
                console.log(err)
            })
    })
}

const getNewPassword = (req, res, next) => {
    const token = req.params.token
    User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {
            let message = req.flash('error')
            if (message.length > 0) {
                message = message[0]
            } else {
                message = null
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            console.log(err)
        })
}

const postNewPassword = (req, res, next) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser

    User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: {
                $gt: Date.now()
            },
            _id: userId
        }).then(user => {
            resetUser = user
            return bcrypt.hash(newPassword, 12)
        }).then(hashedPassword => {
            resetUser.password = hashedPassword
            resetUser.resetToken = undefined
            resetUser.resetTokenExpiration = undefined
            return resetUser.save()
        }).then(result => {
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = {
    getLogin,
    getSignup,
    postLogin,
    postSignup,
    postLogout,
    getReset,
    postReset,
    getNewPassword,
    postNewPassword,
}