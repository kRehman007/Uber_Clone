const { RideModel } = require("../models/ride-model");
const { getCaptainInRadius } = require("../services/map-service");
const { getFare, getOTP } = require("../services/ride-service");
const { sendMessageToSocketID } = require("../socket");
const { sendEmail } = require("../services/ride-service");

const createRide = async (req, res) => {
  const { pickup, destination, vehicleType } = req.body;
  const user = req.user;
  console.log("usr", user);
  if (!pickup || !destination || !vehicleType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const fare = await getFare(pickup, destination);

    const createdRide = await RideModel.create({
      user: user?._id,
      pickup,
      destination,
      otp: getOTP(6),
      fare: fare[vehicleType],
    });
    res.status(200).json({ ride: createdRide });
    const captainsInRadius = await getCaptainInRadius(pickup);
    console.log("ciR", captainsInRadius);
    createRide.otp = "";

    RideWithUser = await RideModel.findOne({ _id: createdRide._id }).populate(
      "user"
    );
    console.log("rideWithuser", RideWithUser);

    captainsInRadius.map((captain) => {
      sendMessageToSocketID(captain.socketID, {
        event: "new-ride",
        data: RideWithUser,
      });
    });
  } catch (error) {
    console.log("error in creating ride", error);
    return res.status(500).json({ error: error.message });
  }
};

const getRideFare = async (req, res) => {
  const { pickup, destination } = req.query;
  if (!pickup || !destination) {
    return res
      .status(400)
      .json({ error: "Pickup and destination field are required" });
  }
  try {
    const fare = await getFare(pickup, destination);
    return res.status(201).json(fare);
  } catch (error) {
    console.log("error in fare calculation", error.message);
    return res.status(400).json({ error: error.message });
  }
};

const confirmRide = async (req, res) => {
  const { rideID, captainID } = req.body;
  if (!rideID) {
    return res.status(400).json({ error: "Ride ID is required" });
  }
  try {
    await RideModel.findOneAndUpdate(
      {
        _id: rideID,
      },
      {
        status: "accepted",
        captain: captainID,
      }
    );
    const ride = await RideModel.findOne({ _id: rideID })
      .populate("user")
      .populate("captain")
      .select("+otp");
    if (!ride) {
      return res.status(400).json({ error: "Ride not found" });
    }
    console.log("ride", ride);
    sendMessageToSocketID(ride.user.socketID, {
      event: "ride-confirm",
      data: ride,
    });

    // Send OTP to captain's email
    const captainEmail = ride.captain.email;
    const otp = ride.otp;

    // Assuming you have a function to send emails
    await sendEmail(captainEmail, "Ride OTP", `Your OTP is: ${otp}`);

    return res.status(200).json({ user: ride });
  } catch (error) {
    console.log("error in confirming ride", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const startRide = async (req, res) => {
  const { rideID, otp } = req.query;
  if ((!rideID, !otp)) {
    return res.status(400).json({ error: "RideID and otp are required" });
  }
  try {
    const ride = await RideModel.findOne({ _id: rideID })
      .populate("user")
      .populate("captain")
      .select("+otp");
    if (!ride) {
      return res.status(400).json({ error: "Ride not found" });
    }
    if (ride.otp !== otp) {
      return res.status(400).json({ error: "OTP not verified" });
    }
    if (ride.status !== "accepted") {
      return res.status(400).json({ error: "Ride not accepted" });
    }
    await RideModel.findOneAndUpdate(
      { _id: rideID },
      {
        status: "ongoing",
      }
    );
    sendMessageToSocketID(ride.user.socketID, {
      event: "ride-started",
      data: ride,
    });

    res.status(200).json(ride);
  } catch (error) {
    console.log("error in starting ride", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const endRide = async (req, res) => {
  const { rideID } = req.body;
  const captainID = req.captain._id;
  if (!rideID) {
    return res.status(400).json({ error: "RideID is required" });
  }
  try {
    const ride = await RideModel.findOne({ _id: rideID, captain: captainID })
      .populate("user")
      .populate("captain")
      .select("+otp");
    if (!ride) {
      return res.status(400).json({ error: "Ride not found" });
    }
    if (ride.status !== "ongoing") {
      return res.status(400).json({ error: "Ride not ongoing" });
    }
    await RideModel.findOneAndUpdate(
      { _id: rideID },
      {
        status: "completed",
      }
    );

    sendMessageToSocketID(ride.user.socketID, {
      event: "ride-ended",
      data: ride,
    });
    return res.status(200).json(ride);
  } catch (error) {
    console.log("error in ending ride", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { createRide, getRideFare, confirmRide, startRide, endRide };
