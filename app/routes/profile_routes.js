const express = require("express");
const router = express.Router();

const {
  updateProfile,
  getProfile,
} = require("../controllers/profile_controller");
const JwtUtil = require("../common/jwt_util");

router.get("/getProfile", JwtUtil.getAuth, getProfile);
router.put("/update", JwtUtil.getAuth, updateProfile);

module.exports = router;
