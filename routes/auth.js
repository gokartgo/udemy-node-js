const express = require("express");
const {
    check,
    body
} = require("express-validator/check");

const authController = require("../controllers/auth");
const User = require('../models/user');
const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", [
    check("email") // check from all around ex header,body,cookie
    .isEmail()
    .withMessage("Please Enter a Valid E-mail")
    .custom((value, {
        req
    }) => {
        return User.findOne({
                email: value
            })
            .then(user => {
                if (!user) {
                    return Promise.reject('Invalid email or password.');
                }
            })
    }),
    body(
        "password",
        "Please enter password only numbers and text and at least 5 characters"
    ) // check from body
    .isLength({
        min: 5
    })
    .isAlphanumeric(),
], authController.postLogin);

router.post(
    "/signup",
    [
        check("email")
        .isEmail()
        .withMessage("Please Enter a Valid E-mail")
        .custom((value, {
            req
        }) => {
            // if (value === 'test@test.com') {
            //   throw new Error('This email address if forbidden')
            // }
            // return true
            return User.findOne({
                email: value // left field from database right field from my email
            }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('E-Mail exists already')
                }
            })
        }),
        body(
            "password",
            "Please enter password only numbers and text and at least 5 characters"
        )
        .isLength({
            min: 5
        })
        .isAlphanumeric(),
        body("confirmPassword").custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords Didn't Match");
            }
            console.log('test', value, req.body)
            return true
        })
    ],
    authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;