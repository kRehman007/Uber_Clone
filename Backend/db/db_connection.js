const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

function connectToDB() {
  console.log("MONGODB_URI:", process.env.MONGODB_URI);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => console.log("Error in MongoDB Connection", error));
}

module.exports = connectToDB;