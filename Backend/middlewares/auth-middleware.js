require("dotenv").config();
const { userModel } = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { captainModel } = require("../models/captain-model");

const authUser = async function (req, res, next) {
  const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "user is unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded._id);
    if (user) {
      req.user = user;
    } else {
      return res.status(401).json({ message: "user is unauthorized" });
    }
    return next();
  } catch (error) {
    console.log("Error in authorizing user", error);
    return res.status(401).json({ error: "user is unauthorized" });
  }
};

const authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "captain is unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded._id);
    if (captain) {
      req.captain = captain;
    } else {
      return res.status(401).json({ message: "user is unauthorized" });
    }
    return next();
  } catch (error) {
    console.log("Error in authorizing user", error);
    return res.status(401).json({ error: "captain is unauthorized" });
  }
};
module.exports = { authUser, authCaptain };
