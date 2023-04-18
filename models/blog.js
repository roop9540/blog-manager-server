const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  img: String,
  slug:String,
  heading: String,
  content: String,
  author: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
const BLOG = mongoose.model("blog", blogSchema);
module.exports = BLOG;