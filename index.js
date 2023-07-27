import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors";
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

// ! help in configure path directory
import path from "path"
import { fileURLToPath } from "url";
// ! help in configure path directory


import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post  from "./models/Post.js";
import {users,posts} from "./data/index.js"




// ! Configuration
// Configuration middleware confi as well as package confi
const __filename=fileURLToPath(import.meta.url)//help in getting file url specifically when we use module
const __dirname=path.dirname(__filename)
dotenv.config();//invoking .envfile

const app=express()//invoking express application
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({
    policy:"cross-origin"
}))
app.use(morgan("common"))
app.use(bodyParser.json({
    limit:"30mb",
    extended:true
}))
app.use(bodyParser.urlencoded({
    limit:"30mb",
    extended:true
}))
app.use(cors())
app.use("/assets",express.static(path.join(__dirname,'public/assets')));//set directory for our assets file like images
// ! Configuration





// !file Storage
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(res,file,cb){
        cb(null,file.originalname)
    }
})
const upload=multer({storage})
// !file Storage


// !Route with files
app.post("/auth/register",upload.single("picture"),register)//upload.single("picture")this is middleware which will first hit before hitting end point that is register(function)
app.post("/posts",verifyToken, upload.single("picture"),createPost)//upload.single("picture")this is middleware which will first hit before hitting end point that is register(function)

// !Route with files

// !Routes
app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/posts",postRoutes)
// !Routes


// ! MongooseSETUP
const PORT=process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port:${PORT}`));
// add this data one time
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((err)=>console.log(`${err} did not connect`))
// ! MongooseSETUP