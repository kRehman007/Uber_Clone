const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth-middleware");
const {
  registerUser,
  LoginUser,
  getuserProfile,
  LogoutUser,
} = require("../controllers/user-controller");

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.get("/profile", authUser, getuserProfile);
router.get("/logout", LogoutUser);

module.exports = router;
