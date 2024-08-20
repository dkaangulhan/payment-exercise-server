/**
 * This file contains the controller for the non-3DS payment flow.
 */

const BasketItemsFromCartUseCase = require("../../use_cases/iyzico/basket_items_from_cart_use_case");
const DateFormatters = require("../../common/date_formatters");
const UserSchema = require("../../models/db/user");
const ProductSchema = require("../../models/db/product");
const Iyzipay = require("iyzipay");
const iyzipay = require("../../common/iyzipay");
const CreatePurchaseUseCase = require("../../use_cases/iyzico/create_purchase_use_case");

exports.create = async (req, res) => {
  const email = req.email;
  const { paymentCard } = req.body;

  const user = await UserSchema.findOne({ email: email });

  if (!user) return res.status(400).send("User not found");
  if (user.addressList.length === 0)
    return res.status(400).send("User has no address");
  if (!user.identityNumber) {
    return res.status(400).send("User has no identity number");
  }

  const address = user.addressList[0];
  const name = user.name;
  const surname = user.surname;
  const gsmNumber = user.gsmNumber;
  const ip = req.socket.remoteAddress;
  const registrationAddress = address.address;
  const city = address.city;
  const country = address.country;
  const zipCode = address.zipCode;
  const identityNumber = user.identityNumber;

  const basketItems = await new BasketItemsFromCartUseCase(
    UserSchema,
    ProductSchema
  ).execute({ email: email });

  const price = basketItems
    .reduce((acc, item) => acc + item.price, 0)
    .toPrecision(4);

  // 20% tax
  const paidPrice = price * 1.2;

  const conversationId = crypto.randomUUID();

  var request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: conversationId,
    price: price,
    paidPrice: paidPrice,
    currency: Iyzipay.CURRENCY.TRY,
    installment: "1",
    basketId: user._id.toString(),
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    paymentCard: paymentCard,
    buyer: {
      id: user._id.toString(),
      name: name,
      surname: surname,
      gsmNumber: gsmNumber,
      email: email,
      identityNumber: identityNumber,
      lastLoginDate: new DateFormatters().toIyziDate(user.lastLoginDate),
      registrationDate: new DateFormatters().toIyziDate(user.registrationDate),
      registrationAddress: registrationAddress,
      ip: ip,
      city: city,
      country: country,
      zipCode: zipCode,
    },
    shippingAddress: address,
    billingAddress: address,
    basketItems: basketItems,
  };

  iyzipay.payment.create(request, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }

    new CreatePurchaseUseCase()
      .execute({
        userId: user._id.toString(),
        conversationId: conversationId,
        paymentId: result.paymentId,
        ipAddress: ip,
        basketItems: basketItems,
        paidPrice: paidPrice,
        status: "SUCCESS",
      })
      .then(() => {
        res.send("Payment successful");
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  });
};
