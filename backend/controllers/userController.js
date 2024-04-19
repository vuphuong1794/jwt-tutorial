const User = require("../models/User");

const userController = {
  //GET ALL USERS
  getAllUser: async (req, res, next) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },

  //DELETE USER
  deleteUser: async (req,res,next)=>{
    try{
        const user = await User.findById(req.body.params)
        res.status(200).json("Delete Success")
    }catch(err){
        next(err)
    }
  }
};

module.exports = userController
