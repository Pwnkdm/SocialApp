const User = require("../models/User");

// for ragistering user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ sucess: false, messssage: "User already exists" });
    }

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sampleId", url: "Sampleurl" },
    });

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 10 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(201)
      .cookie("token", token, options)
      .json({ sucess: true, user, token });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// for Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ sucess: false, message: "User does not exist" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ sucess: false, message: "Incorrect Password" });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 10 * 60 * 1000),
      httpOnly: true,
    };

    res
      .status(200)
      .cookie("token", token, options)
      .json({ sucess: true, user, token });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// function for Logout
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({ success: true, message: "logged Out" });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// function for follow and unfallow user
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ sucess: false, message: "User not found" });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexFollowing = loggedInUser.following.indexOf(userToFollow._id);
      loggedInUser.following.splice(indexFollowing, 1);

      const indexFollowers = loggedInUser.following.indexOf(userToFollow._id);
      userToFollow.followers.splice(indexFollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      return res.status(200).json({ sucess: true, message: "user Unfollowed" });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({ sucess: true, message: "user followed" });
    }
  } catch (error) {
    req.status(500).json({ sucess: false, message: error.message });
  }
};

// function for updating Password

exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        sucess: false,
        message: "Please provide old and new password",
      });
    }
    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      res
        .status(400)
        .json({ sucess: false, message: "Incorrect Old Password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ sucess: true, message: "Password updated" });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};

// function for updating Profile

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, email } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }

    //User Avatar: TODO

    await user.save();

    res.status(200).json({ success: true, message: "Profile updated" });
  } catch (error) {
    res.status(500).json({ sucess: false, message: error.message });
  }
};
