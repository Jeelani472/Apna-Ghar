const Listing = require("../models/listing");

// render index route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// render new form route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// render show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  console.log("✅ Listing Retrieved:", listing);
  res.render("listings/show.ejs", { listing });
};

//render new listing
module.exports.createListing = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("File Upload Data:", req.file); // req.file.path now is the Cloudinary URL

  if (!req.body.listing) {
    req.flash("error", "Form data missing");
    return res.redirect("/listings/new");
  }

  if (!req.file) {
    req.flash("error", "Image upload failed");
    return res.redirect("/listings/new");
  }

  // Cloudinary returns the URL of the uploaded image in req.file.path
  const url = req.file.path;
  const filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};


//render edit form
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace('/upload','/upload/h_300,w_250');
  res.render("listings/edit.ejs", { listing ,originalImageUrl});
};

// render update listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file!='undefined') {
  const url = req.file.path;
  const filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
  }
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

//render destroy listing
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
