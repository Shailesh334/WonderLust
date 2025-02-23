const express = require('express');
const router = express.Router();
const User= require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport")
const ExpressError = require('../utils/ExpressError')

const {saveRedirectUrl, giveCurrPathh} = require("../middleware.js");

const { renderSignupPage , signUp, renderLoginPage, login, logOut } = require('../controller/user.js');


router.get("/signup" , renderSignupPage);


router.post("/signup" ,wrapAsync(signUp));


router.get("/login" , renderLoginPage);



router.post("/login" , saveRedirectUrl , passport.authenticate( "local" ,{
    failureRedirect: '/login',
    failureFlash: true,
    }) ,
    login
    )


// router.get("/logout" ,  logOut);
router.get("/logout" , logOut)


module.exports = router;