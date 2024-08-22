/**
 * This file contains controller for handling
 * iyzico webhooks.
 */

const express = require("express");

const router = express.Router();

const { webhook } = require("../../controllers/payment/webhook_controller");

router.post("/", webhook);

module.exports = router;
