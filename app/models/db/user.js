const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  gsmNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  identityNumber: {
    type: String,
    required: false,
  },
  registrationDate: {
    type: Date,
    required: false,
  },
  lastLoginDate: {
    type: Date,
    required: false,
  },
  addressList: {
    type: Array,
    required: false,
  },
  cart: {
    type: Array,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
