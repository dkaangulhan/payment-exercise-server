const ProductSchema = require("../models/db/product");

exports.bulkAdd = async (req, res) => {
  const { products } = req.body;

  try {
    const savedProducts = await ProductSchema.insertMany(products);
    res.json(savedProducts);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await ProductSchema.find();
    res.json(products);
  } catch (err) {
    res.json({ message: err });
  }
};
