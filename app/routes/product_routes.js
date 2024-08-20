/**
 * This is the route file for the product routes
 */

const express = require("express");
const router = express.Router();

const { bulkAdd, getAll } = require("../controllers/product_controller");

router.get("/getAll", getAll);
router.post("/bulkAdd", bulkAdd);

module.exports = router;
