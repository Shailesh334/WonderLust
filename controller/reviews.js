const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.newreview = async(req,res)=>{
    let {id} = req.params;
    let {review} = req.body;
    let newReview = await Review.insertOne(review);

    newReview.author = req.user._id;
    console.log(newReview);
    let list = await Listing.findById(id);
    list.review.push(newReview);

    

    await newReview.save();
    await list.save();

    console.log("New Review saved");
    req.flash("success" , "New Review added !");
    res.redirect(`/listings/${id}/show`);

}

module.exports.deleteReview = async(req , res , next)=>{
    let {id , reviewid} = req.params;
    let dlt = await Listing.findByIdAndUpdate(id , { $pull : { review : reviewid}});
    let deletedReview = await Review.findByIdAndDelete(reviewid);
    req.flash("success" , "Review deleted !");
    console.log(deletedReview)
    console.log(dlt);
    
    if (res.locals.saveredirectUrl) {
        res.redirect(res.locals.saveredirectUrl);  // Redirect to the saved show page URL
    } else {
        res.redirect(`/listings/${id}/show`);  // Default redirect if no saved URL
    }
    
}