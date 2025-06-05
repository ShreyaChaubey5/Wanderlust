const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const flash = require('connect-flash');
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
const Listing=require("../models/listings.js")

router
.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));


// NEW ROUTE
router.get("/new",isLoggedIn, listingController.renderNewForm);

// Search route
router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const listings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } }
      ]
    });
    res.render('listings/searchResults', { listings, query });
  } catch (err) {
    console.error(err);
    res.redirect('/listings');
  }
});

router
.route("/:id")
.get(isLoggedIn, wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));



// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports=router;