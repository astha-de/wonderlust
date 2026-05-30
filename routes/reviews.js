
const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
//const ExpressError = require("..utils/Expresserror.js")
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");;
const { validateReview, isLoggedIn, isReviewAuthor,} = require("../middleware.js");
const reviewController  = require("../controllers/reviews.js");
//const review = require("../models/reviews.js");

// const Review = require("./routes/reviews.js");

router.post("/",isLoggedIn,
      validateReview ,
       wrapAsync(reviewController.createReview)
);

// delete review route
 router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
 );
 

 module.exports = router; 