const express = require('express');
const router = express.Router();

const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError')

const {isLoggedIn , isOwner , validateListing } = require('../middleware.js');

const { index, showListing , newListing , addListing, editListing, updateListing, deleteListing, filterListing, searchListing} = require('../controller/listing.js');




/* ----------  INDEX Route (SHOW ALL LISTINGS)  ------------------ */
router.get("/" , wrapAsync(index));


/* ----------  FILTER Route  ------------------ */
router.get('/filter/:id' , wrapAsync(filterListing))

/* ----------  FILTER Route  ------------------ */
router.post('/search' , searchListing)

/* ----------  SHOW Route (SHOW PARTICULAR LISTING)  ------------------ */
router.get("/:id/show" , wrapAsync( showListing ));




/* ----------  CREATE Route (SEND FORM TO ADD NEW LISTINGH)  ------------------ */
router.get("/new" , isLoggedIn , newListing )




/* ----------  CREATE Route (ADD LISTING TO DATABASE)  ------------------ */
router.post('/', isLoggedIn, upload.single('listing[image]'),validateListing ,  wrapAsync(addListing));





/* ----------  EDIT Route (SEND FORM TO EDIT LISTING)  ------------------ */
router.get("/:id/edit" , isLoggedIn , isOwner ,  wrapAsync(editListing));



/* ----------  UPDATE Route (ADD EDITED LISTING TO DATABASE)  ------------------ */
router.put("/:id" , isLoggedIn , isOwner , upload.single('listing[image]'), validateListing , wrapAsync(updateListing));




/* ----------  DESTROY Route (DELETE LISTING)  ------------------ */
router.delete("/:id" , isLoggedIn , isOwner , wrapAsync( deleteListing));


module.exports = router;