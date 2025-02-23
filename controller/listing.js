
const Listing = require("../models/listing")
const Review = require("../models/reviews")

const ExpressError = require('../utils/ExpressError')
module.exports.index = async(req , res)=> {
    
    let allListings = await Listing.find();
    res.render("listings.ejs", {allListings});
 
};

module.exports.showListing = async(req , res)=>{
    
    let {id} = req.params;

    let listing = await Listing.findById(id).populate({path :'review' , populate: {path : 'author'}}).populate('owner');
    console.log(listing);
    if(!listing){
        req.flash("error", "Listing does not exist !");
        res.redirect("/listings");
    }
    else res.render("show.ejs" , {listing});

}

module.exports.newListing = (req, res)=>{
    res.render("new.ejs");
}

module.exports.addListing = async (req, res )=>{
    console.log("req.user" , req.user);
    let listing = req.body.listing;
   
    const newlisting = new Listing(listing);
    
    newlisting.owner = req.user._id;
    newlisting.image.url = req.file.path;
    newlisting.image.filename = req.file.filename;
    console.log(req.body , newlisting);
    await newlisting.save();
    req.flash("success" , "New listing added !");
    res.redirect("/listings")
   

};

module.exports.editListing = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let originalUrl = listing.image.url.replace("/upload", "/upload/w_500");

   
    
        if(!listing){
            req.flash("error" , "Listing does not exists !");
            res.redirect("/listings");
        }
        else res.render("edit.ejs" , {listing , originalUrl});
   
  
}

module.exports.updateListing = async (req,res)=>{
   
    let {listing : newlisting} = req.body;
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id ,newlisting );

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url , filename};
        await listing.save();    
    }
    req.flash("success" , "listing Updated !");
    res.redirect(`/listings/${id}/show`)
   
        
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing deleted !");
    await Review.deleteMany({_id :{ $in : listing.review}})
    res.redirect("/listings")
}

module.exports.filterListing = async(req,res)=>{
    let {id} = req.params;
    let allListings = await Listing.find({tag : id})
    res.render("listings.ejs", {allListings}); 
}


module.exports.searchListing = async(req,res)=>{
    let {search : query} = req.body;
    const allListings = await Listing.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { country: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } }, // Add more fields as needed
        ],
      });
    if(allListings.length == 0){
        req.flash("error" , `No results related to ${query} `)
        return res.redirect("/listings");
    }
    res.render("listings.ejs", {allListings}); 
    
}