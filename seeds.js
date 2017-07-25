/*jshint esversion: 6 */

var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");

var data = [
  {
    name: "Cloud's Rest",
    image: "http://www.destination360.com/north-america/us/kentucky/images/s/kentucky-camping.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Desert Mesa",
    image: "http://www.destination360.com/north-america/us/kentucky/images/s/kentucky-camping.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    name: "Canyon Floor",
    image: "http://www.destination360.com/north-america/us/kentucky/images/s/kentucky-camping.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];

// Function for removing all campgrounds
// Function for adding in default Campgrounds

function seedDB() {
  Campground.remove({}, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Removed Campgrounds");

      // Create new campgrounds
      data.forEach(function(seed){
        Campground.create(seed, function(err, campground){
          if(err) {
            console.log(err);
          } else {
            console.log("Added a campground");
            // Create new comments
            Comment.create (
              {
                text:"This place is great!",
                author: "Homer Simpson"
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log("Created new comment");
                }
            });
          }
        });
      });
    }
  });
}

module.exports = seedDB;
