const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const app = express();
dotenv.config()

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

app.use("/v1/auth", authRoute);
app.use("/v1/users", userRoute)

//xu ly neu co loi xay ra
app.use((err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMessage = err.message || "Something went wrong!";
    return res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMessage,
      stack: err.stack,
    });
  });
  

app.listen(8000,()=>{
    connect();
    console.log("server is running on port 8000")
})