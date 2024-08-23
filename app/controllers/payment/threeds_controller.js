const Iyzipay = require("iyzipay");
const iyzipay = require("../../common/iyzipay");
const UserSchema = require("../../models/db/user");
const ProductSchema = require("../../models/db/product");
const BasketItemsFromCartUseCase = require("../../use_cases/iyzico/basket_items_from_cart_use_case");
const DateFormatters = require("../../common/date_formatters");
const CreatePurchaseUseCase = require("../../use_cases/iyzico/create_purchase_use_case");
const UpdatePurchaseUseCase = require("../../use_cases/iyzico/update_purchase_use_case");
const GetUserByConversationIdUseCase = require("../../use_cases/user/get_user_by_conversation_id_use_case");
const ClearCartByUserIdUseCase = require("../../use_cases/profile/clear_cart_by_user_id_use_case");

exports.initialize = async (req, res) => {
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

  const callbackUrl = process.env["HOST"] + "/payment/threeds/callback";

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
    callbackUrl: callbackUrl,
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

  iyzipay.threedsInitialize.create(request, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    }

    new CreatePurchaseUseCase()
      .execute({
        userId: user._id,
        conversationId: conversationId,
        paymentId: result.paymentId,
        ipAddress: ip,
        basketItems: basketItems,
        paidPrice: paidPrice,
        status: "3DS-PENDING",
      })
      .then(() => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  });
};

exports.callback = async (req, res) => {
  const { status, paymentId, conversationData, conversationId, mdStatus } =
    req.body;

  console.log("req headers", req.headers);
  console.log("req body", req.body);

  if (status === "success") {
    return iyzipay.threedsPayment.create(
      {
        conversationId: conversationId,
        locale: Iyzipay.LOCALE.TR,
        paymentId: paymentId,
      },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.status(400).send(err);
        }
        console.log("Payment successful", result);

        new UpdatePurchaseUseCase()
          .execute({ conversationId: conversationId, status: "SUCCESS" })
          .then(() => {
            return new GetUserByConversationIdUseCase().execute(conversationId);
          })
          .then((user) => {
            return new ClearCartByUserIdUseCase().execute(user._id);
          })
          .then(() => {
            return res.send("Payment successful!");
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).send(err);
          });
      }
    );
  }

  console.log("Payment failed!");
  console.log("Payment ID: ", paymentId);
  console.log("Conversation ID: ", conversationId);
  console.log("Conversation Data: ", conversationData);
  console.log("MD Status: ", mdStatus);
  return res.send("Payment failed!");
};
