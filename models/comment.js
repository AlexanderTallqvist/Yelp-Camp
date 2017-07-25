
var mongoose = require("mongoose");

// Schem setup
var commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

// Model setup
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
