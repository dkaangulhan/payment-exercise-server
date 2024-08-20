const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  conversationId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  basketItems: {
    type: Array,
    required: false,
  },
  paidPrice: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Purchase", PurchaseSchema);
