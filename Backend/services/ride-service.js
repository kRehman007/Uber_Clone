require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { getDistanceWithTime } = require("./map-service");

async function sendEmail(to, subject, text) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS,
      },
    });

    let mailOptions = {
      from: process.env.MY_EMAIL,
      to: to,
      subject: subject,
      text: text,
    };

    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log("Error in sending email", error.message);
    throw new Error(error.message);
  }
}

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

    return fare;
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

module.exports = { getFare, getOTP, sendEmail };
