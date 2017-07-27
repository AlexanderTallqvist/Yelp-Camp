// Setup express router
var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleWare = require("../middleware");


// Our NEW route in REST
router.get("/new", middleWare.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground:campground});
    }
  });
});


// Our CREATE route in REST
router.post("/", middleWare.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Something went wrong.");
          console.log(err);
        } else {
          // Add username and ID to comment, and then save it
          comment.author.id       = req.user.id;
          comment.author.username = req.user.username;
          comment.save();
          // Push new comment into campground
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment.");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// Our EDIT route in REST
router.get("/:comment_id/edit", middleWare.checkCommentsOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComments) {
    if (err) {
      res.redirect("back");
    } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComments});
    }
  });
});

// Our UPDATE route in REST
router.put("/:comment_id",  middleWare.checkCommentsOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      // Here the ID stands for the comment ID.
      // See app.js
      req.flash("success", "Successfully edited comment.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Our DESTROY route in REST
router.delete("/:comment_id", middleWare.checkCommentsOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("back");
    } else {
      req.flash("success", "Comment successfully removed.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
