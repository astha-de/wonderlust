if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


const express = require("express");
const app = express();

const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js")
const userRouter = require("./routes/user.js");

const MONGO_URL = process.env.ATLASDB_URL;
//const dbUrl = process.env.ATLASDB_URL;



main()
.then(() =>{
    console.log("✅ Connected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000 * 60 *60 * 24 * 7,
        httpOnly: true
    },
};

// app.get("/", (req ,res) =>{
//     res.send("Hi, I am root");
// });
app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.use(session(sessionOptions));
app.use(flash());

//passport session

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req ,res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user;
    next();
});
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);

app.all("*splat",(req ,res, next ) =>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode =500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});

});
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is listening on port ${PORT}`);
});