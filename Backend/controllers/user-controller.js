const { userModel } = require("../models/user-model");

const registerUser = async function (req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const hashPassword = await userModel.hashPassword(password);
    const createdUser = await userModel.create({
      fullname: {
        firstname,
        lastname,
      },
      email,
      password: hashPassword,
    });

    const token = createdUser.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const userDetails = {
      firstname: createdUser.fullname.firstname,
      lastname: createdUser.fullname.lastname,
      email: createdUser.email,
      token: token,
    };
    return res
      .status(201)
      .json({ user: userDetails, message: "user registered successfully" });
  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const LoginUser = async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const userDetails = {
      firstname: user.fullname.firstname,
      lastname: user.fullname.lastname,
      email: user.email,
      token: token,
    };
    return res
      .status(201)
      .json({ user: userDetails, message: "login successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getuserProfile = async function (req, res) {
  return res.status(200).json(req.user);
};

const LogoutUser = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "You are logged out" });
};

module.exports = {
  registerUser,
  LoginUser,
  getuserProfile,
  LogoutUser,
};
