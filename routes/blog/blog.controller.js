const BLOG = require("../../models/blog")
const { default: slugify } = require("slugify");


// const { imgUrl, deleteImg } = require("../../utils/upload");

// const getBlogs = async (req, res) => {
//   console.log("query", req.query);
//   const page = req?.query?.page ? req?.query?.page : 0;
//   let search = req.query?.search ? req.query?.search : '';
//   const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
//   const searchRgx = rgx(search);
//   let sort = req.query?.sort ? req.query?.sort : 'created_at';
//   let sortPara = req.query?.sortPara ? req.query?.sortPara : -1
//   try {
//     const blogsCount = await BLOG.count();
//     const result = await BLOG.find({
//       $or: [
//         { title: { $regex: searchRgx } },
//         { description: { $regex: searchRgx } },
//       ],
//     }).populate("author", "name _id profile").limit(10).skip(page * 10).sort({ [sort]: sortPara });
//     console.log(result);
//     res.json({ status: "success", result, count: blogsCount });
//   } catch (error) {
//     res.json({ status: "error", message: "Internal Server Error" });
//   }
// };
async function getBlogs(req, res) {
  try {
    // const blogsCount = await BLOG.count();
    const result = await BLOG.find();
    return res.status(200).json({
      status: "success",
      message: "Data Fetched Successfully",
      result: result
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    })
  }
}
// const getPersonalBlogs = async (req, res) => {
//   const user = req.user;
//   try {
//     const result = await BLOG.find({ author: user?.id }).populate("author", "name _id profile").exec();
//     clog.warning({ status: "success", result })
//     res.json({ status: "success", result });
//   } catch (error) {
//     clog.error(error);
//     res.json({ status: "error", message: "Internal Server Error" });
//   }
// };
const postBlogs = async (req, res) => {
  const data = req.body;
  const file = req.file;
  // console.log("File", data);
  // console.log("File", file.location, "data", data);
  let newDescription = req.body.heading.replaceAll(/'/g, " ").replaceAll(/"/g, " ");
  let newContent = req.body.content.replaceAll(/"/g, " ").replaceAll(/'/g, " ");
  if (file) {
    //   mysqlcon.query(
    //     `INSERT INTO blogs(title,slug, heading, content, img, bgimg, createdAt, updatedAt, author) VALUES (?,?,?,?,?,?,?,?,?)`,
    //     [
    //       data.title,
    //       slugify(data.title.toLowerCase()),
    //       newDescription,
    //       newContent,
    //       file.location,
    //       data.bgimg,
    //       moment().format(),
    //       moment().format(),
    //       data.author,
    //     ],
    //     (err, results) => {
    //       if (err) {
    //         console.log("Error in query", err);
    //         return res.status(500).json({
    //           success: 0,
    //           message: "Database Connection Error",
    //         });
    //       } else {
    //         return res.status(200).json({
    //           success: 1,
    //           message: "Data Created Successfully",
    //           data: results,
    //         });
    //       }
    //     }
    //   );
    // } else {
    //   res.status(404).json({ message: "404 Details Not Found" });
    // }
    try {
      const blog = new BLOG({
        title: data.title,
        slug: slugify(data.title.toLowerCase()),
        heading: newDescription,
        content: newContent,
        img: file.path,
        author: data.author,
      })
      const savedBlog =  await blog.save(blog)
      console.log(savedBlog)
      return res.json({ status: "success", message: "BLOG Added Succesfully", result: savedBlog });

    } catch (err) {
     return res.status(500).json({
      status: "error", message: "Internal Server Error"
     })
  }
  };
}
  // const updateBlogs = async (req, res) => {
  //   let img;
  //   if (req.file) {
  //     img = imgUrl(req.file);
  //   }
  //   const {
  //     title,
  //     description,
  //     content,
  //   } = req.body;
  //   const { id } = req.query;
  //   let result;
  //   try {
  //     if (id) {
  //       const updateBLOG = await BLOG.findOneAndUpdate({ slug: id }, {
  //         title,
  //         slug,
  //         description,
  //         img,
  //         content,
  //       });
  //       result = updateBLOG;
  //       res.json({ status: "success", message: "Updated Successfully", result });
  //     } else {
  //       res.json({ status: "error", message: "BLOG ID not Found" });
  //     }
  //   } catch (error) {
  //     res.json({ status: "error", message: "Internal Server Error" });
  //   }
  //   if (req.file) {
  //     deleteImg(result.img);
  //   }
  // };
  const deleteBlogs = async (req, res) => {
    const id = req.query.id;
    
    try {
      if (id) {
       let deleteBLOG = await BLOG.deleteOne({ _id: id });
        
        

        if (deleteBLOG?.deletedCount) {
          res.status(200).json({ message: "BLOG Deleted Succesfully" });
        } else {
          res.status(404).json({ message: "BLOG Not Found" });
        }
      } else {
        res.status(404).json({ message: "Id not Found" });
      }
    } catch (error) {
      clog.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  // const getSingleBlog = async (req, res) => {
  //   const {slug} = req.query;
  //   console.log( "slug", slug, req.query);
  //   try {
  //     if (slug) {
  //       const result = await BLOG.findOne({ slug: slug }).populate("author", "name _id profile");
  //       if (result) {
  //         res.json({ status: "success", message: "BLOG Found Successfully", result });
  //       } else {
  //         res.json({ status: "error", message: "BLOG Not Found" });
  //       }
  //     } else {
  //       res.json({ status: "warning", message: "BLOG ID Not Found" });
  //     }
  //   } catch (error) {
  //     clog.error(error);
  //     res.json({ status: "success", message: "Internal Server Error" });
  //   }
  // };

  async function getBlogBySlug(req, res) {
    console.log("Chhalu=========================");
    const { slug } = req.query;
    console.log( "slug", slug);
    if(slug){
      try{
        const result = await BLOG.find({slug:slug})
        res.status(200).json({
          status:"success",
          message:"data fetched successfully",
          result:result
        })
      }catch(err){
        res.status(500).json({
          status:"error",
          message:"Interbnal server error"
        })
      }
    }else{
      res.status(404).json({
        sattus: "warning",
        message: "Data Not Found",
      });
    }
    // if (slug) {
    //   mysqlcon.query(`SELECT * FROM blogs WHERE slug='${slug}'`, (err, result) => {
    //     if (err) {
    //       console.log("Error in server", err);
    //       res.status(200).json({
    //         success: 0,
    //         message: "Internal Server Error",
    //       });
    //     } else {
    //       result = result[0];
    //       if (result) {
    //         res.status(200).json({
    //           success: 1,
    //           message: "Data Fecthed Successfully",
    //           result,
    //         });
    //       } else {
    //         res.status(404).json({
    //           success: 1,
    //           message: "Data Not Found",
    //         });
    //       }
    //     }
    //   });
    // }
  }

async function getSearchBlogs(req, res){
  const {search} = req.query;
try{
  const result = await BLOG.find({"title": { $regex: '.*' + search + '.*' }});
  res.status(200).json({
    status:"success",
    message:"Data Searched successfully",
    result:result
  })
}catch(err){
  res.status(500).json({
    status:"error",
    message:"Internal Server Error",
    
  })

}
}

  module.exports = {
    getBlogs,
    postBlogs,
    deleteBlogs,
    getBlogBySlug,
    getSearchBlogs
  };