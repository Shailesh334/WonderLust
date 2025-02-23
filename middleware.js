const Listing = require("./models/listing");
const Review = require("./models/reviews");
const {listingSchema , reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log( req.session);   
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login"); 
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req , res , next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "Only owner can perform this action")
        return res.redirect(`/listings/${id}/show`)
    }
    next();
};

module.exports.isAuthor = async(req , res , next)=>{
    let {id , reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "Only owner can perform this action")
        return res.redirect(`/listings/${id}/show`);
    }
    next();
};


module.exports.validateListing = (req , res , next)=>{
   
    
    console.log("Validating req.body:", req.body);
    
    let { error } = listingSchema.validate(req.body);
    
    if (error) {
        next(new ExpressError(400, "Validation error"));
    } else {
        next();
    }
};


module.exports.validateReview = (req , res , next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        next(new ExpressError(400 , error))
    }else{
        next();
    }
};

module.exports.giveCurrPathh = (req , res , next)=>{
    req.session.redirectUrl = req.originalUrl;
    next();
}