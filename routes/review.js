const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Reviews = require("../models/reviews.js");
const Listings = require("../models/listings.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");


//reviews post Route 
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReviews));

//Delete Route for Reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports=router;
