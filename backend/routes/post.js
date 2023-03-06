const express = require("express");
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getPostOfFollowing,
} = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

// Create post route
router.route("/post/upload").post(isAuthenticated, createPost);

// Like and Dislike routes / delete post
router
  .route("/post/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .delete(isAuthenticated, deletePost);

//getting posts of following
router.route("/posts").get(isAuthenticated, getPostOfFollowing);

module.exports = router;
