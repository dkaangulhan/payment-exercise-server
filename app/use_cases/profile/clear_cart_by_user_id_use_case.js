const UserSchema = require("../../models/db/user");

/**
 * This use case is responsible for clearing the cart of a user by their user id.
 */
class ClearCartByUserIdUseCase {
  async execute(userId) {
    await UserSchema.findByIdAndUpdate(userId, { cart: [] });
    return true;
  }
}

module.exports = ClearCartByUserIdUseCase;
