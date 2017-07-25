/*jshint esversion: 6 */

var express         = require("express"),
    localStrategy   = require("passport-local"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    methodOverride  = require("method-override");
    app             = express();

// Require routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");


// Create the database
mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Initialize method-override
app.use(methodOverride("_method"));

// We server our public files
app.use(express.static(__dirname + "/public"));

// Seed the database
//seedDB();

// Passport Configuration
app.use(require("express-session")({
  secret: "Rusty wins cutest dog!",
  resave: false,
  saveUninitialize: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass in the currentUser object to every template
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

// Include our routes
app.use(indexRoutes);
// If we want to, we can pass the first route argument in at this point
// and thus have less code in our route files.
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);

// Run the app
app.listen(3000, function() {
  console.log("App running on port 3000");
});
