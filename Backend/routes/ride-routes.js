const express = require("express");
const {
  createRide,
  getRideFare,
  confirmRide,
  startRide,
  endRide,
} = require("../controllers/ride-controller");
const { authUser, authCaptain } = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/create", authUser, createRide);
router.get("/get-fare", getRideFare);
router.post("/confirm", authCaptain, confirmRide);
router.get("/start-ride", authCaptain, startRide);
router.post("/end-ride", authCaptain, endRide);

module.exports = router;
