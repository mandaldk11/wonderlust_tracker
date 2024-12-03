const express = require('express')
const router = express.Router();
const user = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { savedRedirectUrl } = require('../middlewares/loginUser');
const { renderSignupForm, signUp, renderLoginForm, login, logout } = require('../controllers/userController');

router.get('/signup', renderSignupForm)

router.post('/signup', wrapAsync(signUp))

router.get('/login', renderLoginForm)

router.post('/login', savedRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), login)


router.get('/logout', logout)

module.exports = router