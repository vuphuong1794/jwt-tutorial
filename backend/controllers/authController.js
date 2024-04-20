const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createdError } = require("../utils/error");


//store accessToken by redux toolkit
//store refreshToken in http cookie
let refreshTokens = []

const authController = {
  //REGISTER
  registerUser: async (req, res, next) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      //Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      await newUser.save();
      res.status(200).json("User has been created");
    } catch (err) {
      next(err);
    }
  },

  generateAccessToken: (user)=>{
    return jwt.sign(
      { id: user.id, admin: user.admin },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "20s" }
    );
  },

  generateRefreshToken: (user)=>{
    return jwt.sign(
      { id: user.id, admin: user.admin },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "1m" }
    );
  },

  login: async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return next(createdError(404, "Wrong username!"));
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return next(createdError(404, "Wrong password!"));
      }

      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user)
        
        const refreshToken = authController.generateRefreshToken(user)
        refreshTokens.push(refreshToken)
        res.cookie("refreshToken", refreshToken,{
          httpOnly:true,
          path: "/",
          secure: false,
          sameSite: "strict",
        })
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken});
      }
    } catch (err) {
      next(err);
    }
  },


  //use refresh token when accessToken is expired
  requestRefreshToken: async(req, res, next)=>{
    //take refresh token from cookie
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken){
        //if refresh token is expired, user will have to login again 
        return next(createdError(401,"you are not authenticated!"))
      }
      if(!refreshTokens.includes(refreshToken)) return next(createdError(401, "refresh token is not valid!"))
      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user)=>{
        if(err){
          console.log(err)
        }

        refreshTokens = refreshTokens.filter((token)=>token !== refreshToken)
        //create new accesstoken, refresh token
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);
        
        refreshTokens.push(newRefreshToken)
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly:true,
          path: "/",
          secure: false,
          sameSite: "strict",
        })
        res.status(200).json({accessToken: newAccessToken})
      })
    },

    //logout
    userLogout: async(req,res)=>{
      res.clearCookie(("refreshToken"));
      refreshTokens = refreshTokens.filter(token=>token !== req.cookies.refreshToken);
      res.status(200).json("Log Out success")
    }
};

module.exports = authController;
