const { RideModel } = require("../models/ride-model");
const {
  getCaptainInRadius,
  getAddressCoordinates,
} = require("../services/map-service");
const { getFare, getOTP } = require("../services/ride-service");
const { sendMessageToSocketID } = require("../socket");

const createRide = async (req, res) => {
  const { pickup, destination, vehicleType } = req.body;
  const user = req.user;
  if (!pickup || !destination || !vehicleType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { fare, distance, duration } = await getFare(pickup, destination);

    const createdRide = await RideModel.create({
      user: user?._id,
      pickup,
      destination,
      otp: getOTP(6),
      fare: fare[vehicleType],
      distance,
      duration,
    });

    const ride = createdRide.toObject();
    delete ride.otp;
    res.status(200).json({ ride });

    try {
      const pickupCoordinates = await getAddressCoordinates(pickup);
      const captainsInRadius = await getCaptainInRadius(pickupCoordinates);

      const rideWithUser = await RideModel.findOne({
        _id: createdRide._id,
      }).populate("user");

      captainsInRadius.forEach((captain) => {
        if (captain.socketID) {
          sendMessageToSocketID(captain.socketID, {
            event: "new-ride",
            data: rideWithUser,
          });
        }
      });
    } catch (error) {
      console.log("error in notifying captains", error.message);
    }
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
    const { fare } = await getFare(pickup, destination);
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

    sendMessageToSocketID(ride.user.socketID, {
      event: "ride-confirm",
      data: ride,
    });

    return res.status(200).json({ user: ride });
  } catch (error) {
    console.log("error in confirming ride", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const startRide = async (req, res) => {
  const { rideID, otp } = req.query;
  if (!rideID || !otp) {
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
