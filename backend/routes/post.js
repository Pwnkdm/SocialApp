const express = require("express");
const {
  createPost,
  likeAndUnlikePost,
  deletePost,
  getPostOfFollowing,
  updateCaption,
} = require("../controllers/post");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

// Create post route
router.route("/post/upload").post(isAuthenticated, createPost);

// Like and Dislike routes / update caption / delete post
router
  .route("/post/:id")
  .get(isAuthenticated, likeAndUnlikePost)
  .put(isAuthenticated, updateCaption)
  .delete(isAuthenticated, deletePost);

//getting posts of following
router.route("/posts").get(isAuthenticated, getPostOfFollowing);

//route for updating caption
router.route("/caption");

module.exports = router;
