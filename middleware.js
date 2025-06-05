// const Listings=require("./models/listings.js");
// const ExpressError = require("./utils/expressErrors.js");
// const { listingSchema }=require("./schema.js");
// const { reviewSchema }=require("./schema.js");
// const Reviews = require("./models/reviews.js");


// //check person is logged in or not
// module.exports.isLoggedIn=(req,res,next) =>{
//     console.log(req.user);
//     if(!req.isAuthenticated()){
//       //redirect to original directory where user want to access
//       req.session.redirectUrl=req.originalUrl;
//     req.flash("error","you must logged in to create listing");
//     return res.redirect("/login");
//   }
//   next();
// }

// //direct sme page where we clicked
// module.exports.saveRedirectUrl=(req,res,next) => {
//   if(req.session.redirectUrl){
//     res.locals.redirectUrl=req.session.redirectUrl;
//   }
//   next();
// }


// module.exports.isOwner=async (req,res,next) => {
//   let { id } = req.params;
//   let listing=await Listings.findById(id);
//   if(!listing.owner._id==currUser._id.toString()){
//     req.flash("error","you are not owner of listings");
//     return res.redirect(`/listings/${id}`);
//   }
//   next();
// }

// module.exports.validateListing = (req,res,next) =>{
//      let {error}=listingSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el) => el.message).join(",");
//         throw ExpressError(400,errMsg);
//     }
//     else{
//       next();
//     }
// }

// //validation middleware
// module.exports.validateReview = (req,res,next) =>{
//      let {error}=reviewSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el) => el.message).join(",");
//         throw ExpressError(400,errMsg);
//     }
//     else{
//       next();
//     }
// }


// module.exports.isReviewAuthor=async (req,res,next) => {
//   let { id, reviewId } = req.params;
//   let review=await Reviews.findById(reviewId);
//   if(!review.author._id==currUser._id.toString()){
//     req.flash("error","you didn't create this review");
//     return res.redirect(`/listings/${id}`);
//   }
//   next();
// }

const Listings = require("./models/listings.js");
const ExpressError = require("./utils/expressErrors.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Reviews = require("./models/reviews.js");

//check person is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        //redirect to original directory where user want to access
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

//direct same page where we clicked
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// FIXED: Use req.user instead of currUser
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listings.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    
    // FIXED: Use req.user instead of currUser
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "you are not owner of listings");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

//validation middleware
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

// FIXED: Use req.user instead of currUser
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Reviews.findById(reviewId);
    
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    
    // FIXED: Use req.user instead of currUser
    if (!review.author._id.equals(req.user._id)) {
        req.flash("error", "you didn't create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}