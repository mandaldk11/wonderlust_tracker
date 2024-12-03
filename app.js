

if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
    console.log(process.env.SECRET)
}
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const methodOveride = require('method-override')
const ejsMate = require('ejs-mate')
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOveride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")))
const ExpressError = require('./utils/ExpressError')
const listingRouter = require('./routes/listing')
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/user')
var cookieParser = require('cookie-parser')
var session = require('express-session')
const MongoStore = require('connect-mongo')
var flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

// app.use(cookieParser('secretcode'))
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET
    },
    toucAfter: 24 * 3600
})
store.on("error", () => {
    console.log("error in mongo-session")
})
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }

}

app.use(session(sessionOptions))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//connect db-
let MONGO_URL = process.env.ATLASDB_URL
main()
    .then(() => console.log('database connected...'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);

}

app.use((req, res, next) => {
    res.locals.successMsg = req.flash('success')
    res.locals.errMsg = req.flash('error')
    res.locals.currentUser = req.user
    next()
})



// routes
app.use('/listings', listingRouter)
app.use('/listings', reviewRouter)
app.use('/', userRouter)



app.get('/demo', async (req, res) => {
    const fakeuser = new User({
        email: "pk@test",
        username: "Dharmendra mandal"

    })

    let newuser = await User.register(fakeuser, "helloWorld")
    res.send(newuser)
})



// if no route match -
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!!!"))
})

// error handling middleware-
app.use((err, req, res, next) => {
    const { status = 500, message = "something went wrong" } = err
    res.status(status).render("error.ejs", { err })
})

app.listen(8080, () => {
    console.log('server is running at port 8080')
})


// mongo atlas db
// username - Dharmendra-Mandal, password -jNwl40Gi2aREadQD

// connection string - mongodb+srv://Dharmendra-Mandal:<db_password>@cluster0.zwzuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// 