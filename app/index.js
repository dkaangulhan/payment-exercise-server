/// This loads the environment variables from the .env file
require("dotenv").config();

const express = require("express");
const server = require("http");
const { default: mongoose } = require("mongoose");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./routes/auth_routes");
const productRoutes = require("./routes/product_routes");
const threedsRoutes = require("./routes/payment/threeds_routes");
const nonThreedsRoutes = require("./routes/payment/non_threeds_routes");
const webhookRoutes = require("./routes/payment/webhook_routes");
const cartRoutes = require("./routes/cart_routes");
const profileRoutes = require("./routes/profile_routes");
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/payment/threeds", threedsRoutes);
app.use("/payment/nonThreeds", nonThreedsRoutes);
app.use("/payment/webhook", webhookRoutes);
app.use("/cart", cartRoutes);
app.use("/profile", profileRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database");
    server.createServer(app).listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });
