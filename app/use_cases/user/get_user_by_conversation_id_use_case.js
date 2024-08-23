const PurchaseSchema = require("../../models/db/purchase");
const UserSchema = require("../../models/db/user");

/**
 * This use case is responsible for getting a user by their conversation id of
 * a purchase.
 */
class GetUserByConversationIdUseCase {
  async execute(conversationId) {
    const purchase = await PurchaseSchema.findOne({
      conversationId: conversationId,
    });

    if (!purchase) throw new Error("Purchase not found");
    if (!purchase.userId) throw new Error("User id not found in purchase");

    const user = await UserSchema.findById(purchase.userId);

    if (!user) throw new Error("User not found");

    return user;
  }
}

module.exports = GetUserByConversationIdUseCase;
