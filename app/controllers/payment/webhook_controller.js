const crypto = require("crypto");

exports.webhook = (req, res, next) => {
  const webhookData = req.body;

  // Verify the webhook signature to ensure it's from iyzico
  const isValidSignature = verifyWebhookSignature(req);

  if (isValidSignature) {
    // Handle the webhook event based on the event type
    switch (webhookData.eventType) {
      case "payment.success":
        // Process successful payment
        console.log("Payment successful:", webhookData);
        break;
      case "payment.failure":
        // Process payment failure
        console.log("Payment failed:", webhookData);
        break;
      // ... other event types
    }
  } else {
    console.error("Invalid webhook signature");
  }

  // Respond to iyzico with a success status code
  res.status(200).json({ success: true });
};

/**
 * X-IYZ-SIGNATURE header is a base64 encoded sha256 hash of the
 * secret key, event type, and payment id concatenated.
 *
 * ```$secretKey$eventType$paymentId``` should be equal to the X-IYZ-SIGNATURE header
 */
function verifyWebhookSignature(req) {
  const xIyzSignature = req.headers["x-iyz-signature"];
  const eventType = req.body.eventType;
  const paymentId = req.body.paymentId;

  const secretKey = process.env.IYZICO_SECRET_KEY;
  const expectedSignature = secretKey + eventType + paymentId;

  const hashedSignature = crypto
    .createHash("sha256")
    .update(expectedSignature)
    .digest("hex");

  const base64Signature = Buffer.from(hashedSignature).toString("base64");

  if (xIyzSignature !== base64Signature) {
    return false;
  }

  return true;
}
