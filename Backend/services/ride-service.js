const crypto = require("crypto");
const { getDistanceWithTime } = require("./map-service");

async function getFare(pickup, destination) {
  try {
    const distanceTime = await getDistanceWithTime(pickup, destination);
    const baseFare = {
      auto: 30,
      car: 50,
      motorcycle: 20,
    };

    const perKmRate = {
      auto: 10,
      car: 15,
      motorcycle: 8,
    };

    const perMinuteRate = {
      auto: 1,
      car: 2,
      motorcycle: 1.5,
    };

    const distanceInKm = distanceTime.distance / 1000;
    const durationInMinutes = distanceTime.duration / 60;

    const fare = {
      auto: Math.round(
        baseFare.auto +
          perKmRate.auto * distanceInKm +
          perMinuteRate.auto * durationInMinutes
      ),
      car: Math.round(
        baseFare.car +
          perKmRate.car * distanceInKm +
          perMinuteRate.car * durationInMinutes
      ),
      motorcycle: Math.round(
        baseFare.motorcycle +
          perKmRate.motorcycle * distanceInKm +
          perMinuteRate.motorcycle * durationInMinutes
      ),
    };

    return {
      fare,
      distance: distanceTime.distance,
      duration: distanceTime.duration,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

function getOTP(num) {
  const otp = crypto
    .randomInt(0, Math.pow(10, num))
    .toString()
    .padStart(num, "0");
  return otp;
}

module.exports = { getFare, getOTP };
