const express = require('express');
const router = express.Router({mergeParams : true});


const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError')

const {isLoggedIn, isAuthor , validateReview , saveRedirectUrl} = require('../middleware.js');
const { newreview , deleteReview } = require('../controller/reviews.js');




/* ----------  ADD REVIEW   ------------------ */
router.post("/" ,isLoggedIn , validateReview, wrapAsync(newreview));


/* ----------  DELETE REVIEW  ------------------ */
router.delete("/:reviewid" ,isLoggedIn ,  isAuthor , deleteReview);

module.exports = router;  