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
  deleteUser: async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json("Delete Success")
    }catch(err){
      res.status(500).json(err);
    }
  }
};

module.exports = userController
