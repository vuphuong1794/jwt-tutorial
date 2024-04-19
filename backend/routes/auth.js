const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

//REGISTER
router.post("/register", authController.registerUser);

router.post("/login", authController.login);

router.post("/refresh", authController.requestRefreshToken)

router.post("/logout", middlewareController.verifyToken, authController.userLogout) 
module.exports = router;