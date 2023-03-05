const Post = require("../models/post");

exports.createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.image",
        url: "http",
      },
      owner: req.user._id,
    };

    const newPost = await Post.create(newPostData);
    res.status(200).json({ sucess: true, post: newPost });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};
