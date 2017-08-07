/*jshint esversion: 6 */

var express         = require("express"),
    localStrategy   = require("passport-local"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
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


// Connect to the database
// LOCALHOST
//mongoose.connect("mongodb://localhost/yelp_camp");
// LIVE
mongoose.connect(process.env.DATABASEURL);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Initialize method-override
app.use(methodOverride("_method"));

// Setup flash messages
app.use(flash());

// We server our public files
app.use(express.static(__dirname + "/public"));

// Seed the database
//seedDB();

// Passport Configuration
app.use(require("express-session")({
  secret: "Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass in the currentUser object and the
// flash message to every template
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Include our routes
app.use(indexRoutes);
// If we want to, we can pass the first route argument in at this point
// and thus have less code in our route files.
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments/", commentRoutes);

// Run the app

// LOCALHOST
// app.listen(3000, function() {
//   console.log("App running on port 3000");
// });

// LIVE
app.listen(process.env.PORT, process.env.IP, function() {
  var appConsoleMsg = 'YelpCamp server has started: ';
  appConsoleMsg += process.env.IP + ':' + process.env.PORT;
  console.log(appConsoleMsg);
});
