const express = require('express');
const blogRouter = express.Router();
const upload  = require("../../middleware/upload");
const { postBlogs, updateBlogs, deleteBlogs, getSingleBlog, getBlogs, getBlogBySlug, getSearchBlogs } = require('./blog.controller');
 
blogRouter.get('/', getBlogs)
blogRouter.post("/",upload.single("img") ,postBlogs);
// blogRouter.post("/",(req, res)=>{
//     res.status(200).send("working")
// });
// blogRouter.put("/",  upload.single("img"), updateBlogs);
blogRouter.delete("/", deleteBlogs);
// blogRouter.get("/", getSingleBlog);
blogRouter.get("/single",getBlogBySlug)
blogRouter.get("/find", getSearchBlogs)


module.exports = blogRouter


