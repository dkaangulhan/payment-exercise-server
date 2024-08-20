const JwtUtil = require("../common/jwt_util");
const UserSchema = require("../models/db/user");

exports.register = async (req, res) => {
  const { name, surname, gsmNumber, email, password, address } = req.body;
  const user = new UserSchema({
    name,
    surname,
    gsmNumber,
    email,
    password,
    registrationDate: new Date(),
    lastLoginDate: new Date(),
    addressList: [address],
  });

  try {
    const savedUser = await user.save();

    res.send(JwtUtil.sign({ email: savedUser.email }));
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({
      email,
      password,
    });

    if (!user) {
      return res.status(400).send("Email or password is wrong");
    }

    user.lastLoginDate = new Date();

    await user.save();

    return res.send(JwtUtil.sign({ email: user.email }));
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
};
