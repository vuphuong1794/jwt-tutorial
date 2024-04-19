const userController = require("../controllers/userController");

const router = require("express").Router();

//GET ALL USERS
router.get("/", userController.getAllUser);

//DELETE USER
router.delete("/:id", userController.deleteUser)
module.exports = router;