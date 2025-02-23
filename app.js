



const express = require("express");
const app = express();

require("dotenv").config();

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require("./routes/user.js");


const ExpressError = require("./utils/ExpressError.js")

/* ----------  To Connect MONGOOSE ------------------ */
const mongoose = require("mongoose");
const dbUrl = process.env.ATLAS_URL;

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch(err =>{
        console.log(err);
    });



/* ----------  To Use Session  ------------------ */
const session = require('express-session');
const MongoStore = require('connect-mongo');
const store = MongoStore.create({
    mongoUrl: dbUrl, 
    crypto: {
        secret: process.env.SECRET ,
    },
    touchAfter : 24 * 3600,  
})

store.on("error" , ()=>{
    console.log("Error on mongo session stor" , err);
})
const sessionOptions = {
    store ,
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 ,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true ,
    }
};

const User = require("./models/user.js");
const passport = require('passport');
const LocalStratergy = require('passport-local');

app.use(session(sessionOptions));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())






/* ----------  To Use Flash  ------------------ */
const flash = require("connect-flash");
app.use(flash());

/* ----------  To Use EJS-Mate Templating  ------------------ */
 const ejsMate = require("ejs-mate");
 app.engine("ejs" , ejsMate);

/* ----------  To Use different Methods(such as DELETE , PATCH , etc)  ------------------ */
const methodOverride = require('method-override');
app.use(methodOverride("_method"));


/* ----------  To Connect PUBLIC(CSS , JS)  ------------------ */
const path = require("path");
app.use(express.static(path.join(__dirname , "/public")));

/* ----------  To Connect VIEWS  ------------------ */
app.set("views" , path.join(__dirname , "views"));
app.set("view engine" , "ejs");
 

/* ----------  To Parse REQ.PARAMS & REQ.BODY  ------------------ */
app.use(express.urlencoded({extended:true}))





async function main(){
     await mongoose.connect(dbUrl)
};
 
/* -------------------------------------------------- */

app.listen(8080 , ()=>{
    console.log("Listening on port 8080");
}); 


   
app.get("/" , (req , res)=>{
    res.send("This is root");
})

app.get("/demouser", async(req,res)=>{
    let fakeuser = new User({
        email : "student@gmail.com",
        username : "delta-student"
    })
    let registereduser = await User.register(fakeuser, "thisismysafepassword");
    res.send(registereduser);
});
 


app.use((req , res , next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Adding listing , review routes from routes folder
app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);


app.all("*", (req , res , next)=>{
    next(new ExpressError(404 , "Page not found"));
})


// error handling middleware
app.use((err , req , res , next)=>{
    let { status=500 , message="some error"}= err;
    res.status(status).render("error.ejs" , {err})
});

