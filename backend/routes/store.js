const express = require("express");

const router = express.Router();
const StoreController = require("../controllers/store");

router.post("/create", StoreController.createProduct);
router.get("/get", StoreController.getProducts);
router.delete("/delete", StoreController.deleteProduct);
router.put("/update", StoreController.updateProduct);

module.exports = router;
