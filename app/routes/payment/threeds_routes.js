const express = require("express");
const router = express.Router();

const {
  initialize,
  callback,
} = require("../../controllers/payment/threeds_controller");
const JwtUtil = require("../../common/jwt_util");

router.post("/initialize", JwtUtil.getAuth, initialize);
router.post("/callback", callback);

module.exports = router;
