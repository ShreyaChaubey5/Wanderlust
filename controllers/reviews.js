const Listings=require("../models/listings.js");
const Reviews=require("../models/reviews.js");

module.exports.createReviews=(async (req,res) => {
     let { id } = req.params;
     let listing = await Listings.findById(req.params.id);
     let newReview=new Reviews(req.body.review);
     console.log(newReview);
     newReview.author=req.user._id;
     listing.reviews.push(newReview._id);
     let save= await newReview.save();
     console.log(save);
     await listing.save();
    req.flash("success","New review is created!");
     res.redirect(`/listings/${id}`);
});

module.exports.deleteReview=(async (req, res) => {
  let { id,reviewId } = req.params;
  await Listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  let deletedReview=await Reviews.findByIdAndDelete(reviewId);
  console.log(deletedReview);
  req.flash("success","Review deleted!");
  res.redirect(`/listings/${id}`);
});