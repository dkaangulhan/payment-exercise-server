const express = require("express");

const router = express.Router();

const { create } = require("../../controllers/payment/non_threeds_controller");
const JwtUtil = require("../../common/jwt_util");

router.post("/create", JwtUtil.getAuth, create);

module.exports = router;
