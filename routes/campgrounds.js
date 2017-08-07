// Setup express router
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleWare = require("../middleware");

// Our INDEX route in REST
router.get("/", function(req, res) {

  // Get all the campgrounds
  Campground.find({}, function(err, allcampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allcampgrounds});
    }
  });
});

// Our NEW route in REST
router.get("/new", middleWare.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

// Our CREATE route in REST
router.post("/", middleWare.isLoggedIn, function(req, res) {
  var name   = req.body.name;
  var price  = req.body.price;
  var image  = req.body.image;
  var desc   = req.body.description;
  var author = {
    id: req.user._id,
    username:req.user.username
  };
  var newCampground = {name: name, price: price, image:image, description: desc, author: author};
  // Create a new campground and save to db
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      req.flash("error", "Something went wrong.");
      console.log(err);
    } else {
      // Default redirect is as GET request
      req.flash("success", "Campground created succesfully.");
      res.redirect("/campgrounds");
    }
  });
});

// Our SHOW route in REST (needs to be declared after /new)
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampGround) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundCampGround);
      res.render("campgrounds/show", {campground:foundCampGround});
    }
  });
});

// Edit campgrounds route. Note that we use our custom middleware
// to check for user permissions.
router.get("/:id/edit", middleWare.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampGround) {
    res.render("campgrounds/edit", {campground: foundCampGround});
  });
});

// Update Campgrounds route. Note that we use our custom middleware
// to check for user permissions.
router.put("/:id", middleWare.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Successfully edited campground.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Destroy Campground route. Note that we use our custom middleware
// to check for user permissions.
router.delete("/:id", middleWare.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Campground successfully removed.");
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
