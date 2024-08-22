const UserSchema = require("../models/db/user");

exports.getProfile = async (req, res) => {
  const email = req.email;

  const user = await UserSchema.findOne({ email: email });

  if (!user) return res.status(400).send("User not found");

  user.password = undefined;

  res.send(user);
};

exports.updateProfile = async (req, res) => {
  const email = req.email;
  const { name, surname, addressList, identityNumber } = req.body;

  const user = await UserSchema.findOne({ email: email });

  if (!user) return res.status(400).send("User not found");

  user.name = name || user.name;
  user.surname = surname || user.surname;
  user.identityNumber = identityNumber || user.identityNumber;
  user.addressList = addressList || user.addressList;

  const updatedUser = await user.save();
  updatedUser.password = undefined;

  res.send(updatedUser);
};
