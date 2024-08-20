const express = require("express");

const router = express.Router();

const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/cart_controller");
const JwtUtil = require("../common/jwt_util");

router.post("/add", JwtUtil.getAuth, addToCart);

router.post("/remove", JwtUtil.getAuth, removeFromCart);

router.get("/get", JwtUtil.getAuth, getCart);

module.exports = router;
