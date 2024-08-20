const PurchaseSchema = require("../../models/db/purchase");
/**
 * This use case creates purchase record on the database.
 */
class CreatePurchaseUseCase {
  async execute({
    userId,
    conversationId,
    paymentId,
    ipAddress,
    basketItems,
    paidPrice,
    status,
  }) {
    const purchase = new PurchaseSchema({
      userId: userId,
      conversationId: conversationId,
      paymentId: paymentId,
      ipAddress: ipAddress,
      basketItems: basketItems,
      paidPrice: paidPrice,
      status: status,
    });

    await purchase.save();
  }
}

module.exports = CreatePurchaseUseCase;
