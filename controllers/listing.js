 const Listing=require("../models/listings.js")
 
 
 module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};



module.exports.renderNewForm=(req, res) => {
  console.log(req.user);
  res.render("listings/new");
};

module.exports.showListing=(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    });

  if (!listing) {
    req.flash("error", "Your listing is not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
});



module.exports.createListing=(async (req, res) => {
  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  await newListing.save();
  req.flash("success","New listing is created!");
  res.redirect("/listings");
});


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Your listing is not found");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/edit", { listing });
}; 


module.exports.updateListing=(async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file!=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }
   req.flash("success","Listing Updated!");
  res.redirect(`/listings/${id}`);
});

module.exports.deleteListing=(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
   req.flash("success","listing is deleted!!");
  console.log(deletedListing);
  res.redirect("/listings");
});

module.exports.searchListing=(async (req, res) => {
  const { search } = req.query;
  let allListings;
  console.log(search);
  if (search) {
    const regex = new RegExp(search, "i"); // case-insensitive regex
    allListings = await Listing.find({ location: regex });
  } else {
    allListings = await Listing.find({});
  }
  console.log(allListings);
  console.log(search);

  res.render("listings/index", { allListings, search });
});
