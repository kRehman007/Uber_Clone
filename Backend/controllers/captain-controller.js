const { captainModel } = require("../models/captain-model");

const registerCaptain = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    color,
    plate,
    capacity,
    vehicleType,
  } = req.body;
  if (
    !firstname ||
    !email ||
    !password ||
    !color ||
    !plate ||
    !capacity ||
    !vehicleType
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const hashPassword = await captainModel.hashPassword(password);
  try {
    const createdCaptain = await captainModel.create({
      fullname: {
        firstname,
        lastname: lastname ? lastname : null,
      },
      email,
      password: hashPassword,
      vehicle: {
        color,
        plate,
        capacity,
        vehicleType,
      },
    });

    const token = createdCaptain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const captainDetails = {
      firstname: createdCaptain.fullname.firstname,
      lastname: createdCaptain.fullname.lastname,
      email: createdCaptain.email,
      color: createdCaptain.vehicle.color,
      plate: createdCaptain.vehicle.plate,
      capacity: createdCaptain.vehicle.capacity,
      type: createdCaptain.vehicle.vehicleType,
    };
    return res.status(201).json({
      captain: captainDetails,
      message: "captain registered successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "captain already exists" });
    }
    console.log("Error in registering Captain", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const loginCaptain = async (req, res) => {
  const { email, password } = req.body;
  try {
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = captain.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    const captainDetails = {
      firstname: captain.fullname.firstname,
      lastname: captain.fullname.lastname,
      email: captain.email,
      color: captain.vehicle.color,
      plate: captain.vehicle.plate,
      capacity: captain.vehicle.capacity,
      type: captain.vehicle.vehicleType,
    };
    return res
      .status(201)
      .json({ captain: captainDetails, message: "login successfully" });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCaptainProfile = async (req, res) => {
  return res.status(200).json(req.captain);
};

const captainLogout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "You are logged out" });
};

module.exports = {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  captainLogout,
};
