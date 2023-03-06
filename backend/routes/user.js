const express = require("express");
const {
  register,
  login,
  followUser,
  logout,
  updatePassword,
  updateProfile,
} = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

// route for ragistering user
router.route("/register").post(register);

// route for login user
router.route("/login").post(login);

// route for logout
router.route("/logout").get(isAuthenticated, logout);

//route for following user
router.route("/follow/:id").get(isAuthenticated, followUser);

// route for updating password
router.route("/update/password").put(isAuthenticated, updatePassword);

// route for updating profile
router.route("/update/profile").put(isAuthenticated, updateProfile);

module.exports = router;
