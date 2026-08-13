const dotenv = require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const cors = require("cors");
const express = require("express");
const connectToDB = require("./db/db_connection");
connectToDB();
const app = express();
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user-routes");
const captainRoutes = require("./routes/captain-routes");
const mapRoutes = require("./routes/map-routes");
const rideRoutes = require("./routes/ride-routes");
const { authUser, authCaptain } = require("./middlewares/auth-middleware");

app.use(cors({ origin: process.env.FRONTEND_URI, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the EduLearn API");
});

app.get("/auth/validate-user", authUser, (req, res) => {
  return res.status(200).json({ user: req.user });
});
app.get("/auth/validate-captain", authCaptain, (req, res) => {
  return res.status(200).json({ captain: req.captain });
});

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapRoutes);
app.use("/rides", rideRoutes);

module.exports = { app };
