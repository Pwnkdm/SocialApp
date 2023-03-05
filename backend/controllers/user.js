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

    res.status(201).json({ sucess: true, user });
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
