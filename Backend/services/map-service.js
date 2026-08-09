const { captainModel } = require("../models/captain-model");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";
const OSRM_URL = "https://router.project-osrm.org";

const NOMINATIM_HEADERS = {
  "User-Agent": "UberMERN-App/1.0 (educational project)",
  "Accept": "application/json",
};

async function parseJSONResponse(response, source) {
  if (!response.ok) {
    throw new Error(`${source} request failed with status ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `${source} returned unexpected response: ${text.slice(0, 100)}`
    );
  }
  return response.json();
}

const getAddressCoordinates = async (address) => {
  try {
    const response = await fetch(
      `${NOMINATIM_URL}/search?q=${encodeURIComponent(
        address
      )}&format=json&limit=1`,
      { headers: NOMINATIM_HEADERS }
    );
    const data = await parseJSONResponse(response, "Nominatim");
    if (data.length > 0) {
      return { lat: data[0].lat, lon: data[0].lon };
    } else {
      throw new Error("Address not found");
    }
  } catch (error) {
    throw new Error(error.message);
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
      `${OSRM_URL}/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=false`
    );
    const data = await parseJSONResponse(response, "OSRM");

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
      `${NOMINATIM_URL}/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&accept-language=en&limit=5`,
      { headers: NOMINATIM_HEADERS }
    );
    const data = await parseJSONResponse(response, "Nominatim");
    return data.map((item) => ({
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    throw new Error(error.message);
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

    if (isNaN(lat) || isNaN(lon)) {
      return [];
    }

    // Find captains using the Haversine formula
    const captains = await captainModel.find({
      location: { $exists: true },
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
