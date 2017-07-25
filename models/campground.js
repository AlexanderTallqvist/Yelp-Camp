
var mongoose = require("mongoose");

// Schem setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Model setup
var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;


//Insert static data
// Campground.create(
//   { name: "Salmon Creek",
//     image: "http://alexandertallqvist.net/img/alexander.jpg",
//     description: "This is a huge Creek. No bathrooms. No water."
//
//   }, function(err, campground) {
//     if(err) {
//       console.log(err);
//     } else {
//       console.log("Data inserted: ");
//       console.log(campground);
//     }
// });
