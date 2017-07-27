// Setup express router
var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

// Landing route
router.get("/", function(req, res) {
  res.render("landing");
});

// AUTH ROUTES
// Show register form
router.get("/register", function(req, res) {
  if(!req.user) {
    res.render("register");
  } else {
    req.flash("error", "You are already logged in.");
    res.redirect("/");
  }
});

// Handel signup logic
router.post("/register", function(req, res) {
  if(!req.user) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
      if(err) {
        req.flash("error", err.message);
        console.log(err);
        return res.redirect("/register");
      }
      passport.authenticate("local")(req, res, function() {
        req.flash("success", "Welcome to YelpCamp " + user.username + ".");
        res.redirect("/campgrounds");
      });
    });
  }
});

// Show login form
router.get("/login", function(req, res) {
  if(!req.user) {
    res.render("login");
  } else {
    req.flash("error", "You are already logged in.");
    res.redirect("/");
  }
});

// Handle login logic. Use the passport middleware
router.post("/login", passport.authenticate("local",
  {successRedirect: "/campgrounds",
   failureRedirect: "/login",
   failureFlash : {type: 'error', message: 'Invalid username or password.'},
   successFlash:  {type: 'success', message: 'Successfully logged in.'}
  })
);

// Logout
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged you out.");
  res.redirect("/campgrounds");
});


module.exports = router;
