const { captainModel } = require("../models/captain-model");

const getAddressCoordinates = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon };
    } else {
      throw new Error("Addreses not found");
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getDistanceWithTime = async (pickup, destination) => {
  try {
    // Step 1: Get coordinates for both addresses
    const start = await getAddressCoordinates(pickup);
    const end = await getAddressCoordinates(destination);

    if (!start || !end) {
      throw new Error("Invalid addresses.");
    }

    // Step 2: Fetch route information from OSRM
    const response = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`
    );
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      return {
        distance: data.routes[0].distance,
        duration: data.routes[0].duration,
      };
    } else {
      throw new Error("No route data found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getSuggestions = async (query) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&accept-language=en`
    );
    const data = await response.json();
    return data.map((item) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw new Error(error);
  }
};

const getCaptainInRadius = async (pickup) => {
  try {
    const { lat: pickupLat, lon: pickupLon } = pickup; // Pickup coordinates
    const radiusInKm = 2; // Radius in kilometers
    const earthRadiusInKm = 6371; // Earth's radius in kilometers

    // Convert lat and lon to numbers if they're strings
    const lat = parseFloat(pickupLat);
    const lon = parseFloat(pickupLon);

    // Find captains using the Haversine formula
    const captains = await captainModel.find({
      $expr: {
        $lte: [
          // Haversine formula to calculate distance
          earthRadiusInKm *
            Math.acos(
              Math.sin((Math.PI / 180) * lat) *
                Math.sin((Math.PI / 180) * "$location.ltd") +
                Math.cos((Math.PI / 180) * lat) *
                  Math.cos((Math.PI / 180) * "$location.ltd") *
                  Math.cos((Math.PI / 180) * (lon - "$location.lng"))
            ),
          radiusInKm, // Compare distance with radius
        ],
      },
    });

    return captains;
  } catch (error) {
    console.error("Error in getting nearest captains:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  getAddressCoordinates,
  getDistanceWithTime,
  getSuggestions,
  getCaptainInRadius,
};
