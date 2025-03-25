const express = require("express");

const router = express.Router();
const StoreController = require("../controllers/store");

router.post("/create", StoreController.createProduct);
router.get("/get", StoreController.getProducts);

module.exports = router;
