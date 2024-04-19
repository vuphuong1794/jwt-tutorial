const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createdError } = require("../utils/error");

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
        const accessToken = jwt.sign(
          { id: user.id, admin: user.admin },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "30s" }
        );
        res.status(200).json({user, accessToken});
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
