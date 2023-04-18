require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require("./routes/users/user");
const blogRouter = require("./routes/blog/blog");


const PORT = process.env.PORT || 2100;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/uploads", express.static(__dirname + "/uploads"));


app.use('/', authRouter)
app.use('/blog', blogRouter)

app.get('/', (req, res)=>{
res.status(200).send("Server is Running")
})

mongoose.connect(MONGO_URL).then((e)=>{
console.log("MongoDb Connected")
}).catch((err)=>{
console.log("Error While Connection to MongoDB", err);
})

app.listen(PORT, ()=>{
    console.log("Connected to Port")
})

module.exports = app;

