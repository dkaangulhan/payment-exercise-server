const PurchaseSchema = require("../../models/db/purchase");

/**
 * This use case is used for updating the status of
 * a purchase record on the database.
 */
class UpdatePurchaseUseCase {
  async execute({ conversationId, status }) {
    await PurchaseSchema.find({ conversationId: conversationId }).updateOne({
      status: status,
    });
  }
}

module.exports = UpdatePurchaseUseCase;
