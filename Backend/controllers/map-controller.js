const {
  getAddressCoordinates,
  getDistanceWithTime,
  getSuggestions,
} = require("../services/map-service");

const getCoordinates = async (req, res) => {
  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }
  try {
    const coordinates = await getAddressCoordinates(address);
    res.status(200).json(coordinates);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    res.status(404).json({ error: "Coordinates not found" });
  }
};

const getDistanceTime = async (req, res) => {
  const { pickup, destination } = req.query;
  if (!pickup || !destination) {
    return res
      .status(400)
      .json({ error: "Pickup and Destination location are required" });
  }
  try {
    const distanceTime = await getDistanceWithTime(pickup, destination);
    return res.status(200).json(distanceTime);
  } catch (error) {
    console.log("error in distance-time", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getDistanceSuggestions = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Address is required" });
  }
  try {
    const suggestions = await getSuggestions(query);
    return res.status(200).json(suggestions);
  } catch (error) {
    console.log("error in suggestions finding", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getCoordinates, getDistanceTime, getDistanceSuggestions };
