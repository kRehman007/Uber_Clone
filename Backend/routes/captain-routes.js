const express = require("express");
const router = express.Router();
const {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  captainLogout,
} = require("../controllers/captain-controller");
const { authCaptain } = require("../middlewares/auth-middleware");

router.post("/register", registerCaptain);
router.post("/login", loginCaptain);
router.get("/profile", authCaptain, getCaptainProfile);
router.get("/logout", captainLogout);

module.exports = router;
