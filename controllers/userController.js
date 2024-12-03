const user = require('../models/user')

const renderSignupForm = (req, res) => {
    res.render('user/signup.ejs')
}

const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new user({ username, email })
        const registeredUser = await user.register(newUser, password);
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                next(err)
            }
            req.flash("success", "welcome to wonderlust");
            res.redirect('/listings')
        })

    } catch (error) {
        req.flash("error", error.message)
        res.redirect("/signup")
    }

}

const renderLoginForm = (req, res) => {
    res.render('user/login.ejs')
}

const login = (req, res) => {
    req.flash("success", "welcome back to wonderlust tracker...")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
    // res.send("welcome")
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "logout successfully...")
        res.redirect("/listings")
    })
}
module.exports = { renderSignupForm, signUp, renderLoginForm, login, logout }