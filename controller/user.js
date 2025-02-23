const passport = require("passport")
const User= require("../models/user.js");


module.exports.renderSignupPage = (req , res)=>{
    res.render("users/signup.ejs");
}


module.exports.signUp = async(req,res)=>{

    try{
        let { username, email , password } = req.body; 
        let newUser = new User({
            email,
            username 
        });
        let registeredUser = await User.register(newUser , password)
        req.login(registeredUser, function(err) {
            if (err) { return next(err); }
            req.flash("success" , "Sign Up successfull !")
            return res.redirect("/listings");
         });
        
        
    }catch(err){
        console.log(err);
        req.flash("error" , err.message);
        res.redirect("/signup")
    }
   
}


module.exports.renderLoginPage = (req , res)=>{
    res.render("users/login.ejs");
}


module.exports.login =  async( req , res)=>{
        req.flash("success" , "Welcome back to WonderLust !");
        let redirectUrl = res.locals.redirectUrl || "/listings"; 
        console.log(redirectUrl); 
        return res.redirect(redirectUrl);
}


module.exports.logOut = (req, res , next)=>{
    req.logout(()=>{
        req.flash("success" , "You logged out successfully");
        res.redirect(req.get('referer')) 
    });
   
}

