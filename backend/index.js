const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")

dotenv.config()

const app = express();


const connect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("connected to database");
    } catch (err) {
      throw err;
    }
  };
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });
  
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.listen(8000,()=>{
    connect();
    console.log("server is running on port 8000")
})