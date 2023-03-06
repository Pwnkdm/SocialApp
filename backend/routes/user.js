const express = require("express");
const { register, login, followUser } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// route for ragistering user
router.route("/register").post(register);

// route for login user
router.route("/login").post(login);

//route for following user
router.route("/follow/:id").get(isAuthenticated, followUser);

module.exports = router;
