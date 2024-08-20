const UserSchema = require("../models/db/user");
const ProductSchema = require("../models/db/product");

/**
 * This function adds a product to the user's cart by increasing the quantity of the product by 1.
 */
exports.addToCart = async (req, res) => {
  const { productId } = req.body;
  const email = req.email;

  const user = await UserSchema.findOne({ email: email });

  if (!user) return res.status(400).send("User not found");

  const index = user.cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    console.log(user.cart[index].quantity);
    user.cart[index].quantity += 1;
    console.log(user.cart[index].quantity);
  } else {
    user.cart.push({ productId, quantity: 1 });
    console.log("added new product to cart");
  }

  console.log(user.cart);

  user.markModified("cart");

  await user.save();

  return res.send(user.cart);
};

/**
 * This function removes a product from the user's cart by decreasing the quantity of the product by 1.
 * If the quantity of the product is 1, the product is removed from the cart.
 */
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const email = req.email;

  const user = await UserSchema.findOne({ email });

  if (!user) return res.status(400).send("User not found");

  const index = user.cart.findIndex((item) => item.productId === productId);

  if (index === -1) return res.status(400).send("Product not found in cart");

  if (user.cart[index].quantity === 1) {
    user.cart.splice(index, 1);
  } else {
    user.cart[index].quantity -= 1;
  }

  user.markModified("cart");

  await user.save();

  return res.send(user.cart);
};

exports.getCart = async (req, res) => {
  const email = req.email;

  const user = await UserSchema.findOne({ email: email });

  if (!user) return res.status(400).send("User not found");

  const productIds = user.cart.map((item) => item.productId);

  const products = await ProductSchema.find({ _id: { $in: productIds } });

  const cartItems = user.cart.map((item) => {
    const product = products.find((product) => product._id == item.productId);
    const p = { ...product._doc };
    p.id = p._id;
    delete p._id;
    return {
      product: p,
      quantity: item.quantity,
    };
  });

  res.json(cartItems);
};
