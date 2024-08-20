const UserSchema = require("../../models/db/user");
const ProductSchema = require("../../models/db/product");
const ObjectId = require("mongoose").mongo.ObjectId;

/**
 * This use case is responsible for getting basket items from cart
 * to use in Iyzico payment process.
 */
class BasketItemsFromCartUseCase {
  /**
   * @param {UserSchema} userRepository
   * @param {ProductSchema} productSchema
   */
  constructor(userRepository, productSchema) {
    this.userRepository = userRepository;
    this.productSchema = productSchema;
  }

  async execute({ email }) {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const cart = user.cart;
    if (!cart) {
      throw new Error("Cart not found");
    }

    const products = [];

    for (const cartItem of cart) {
      const product = await this.productSchema.findById(cartItem.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      for (let i = 0; i < cartItem.quantity; i++) {
        products.push({
          id: product._id.toString(),
          name: product.name,
          category1: product.category1,
          category2: product.category2,
          itemType: product.itemType,
          price: product.price,
        });
      }
    }

    return products;
  }
}

module.exports = BasketItemsFromCartUseCase;
