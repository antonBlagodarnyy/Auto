const express = require("express");

const router = express.Router();
const StoreController = require("../controllers/store");
const authMiddleware = require("../middleware/auth.js");

router.post("/create", authMiddleware,StoreController.createProduct);
router.get("/get", authMiddleware,StoreController.getProducts);
router.delete("/delete", authMiddleware,StoreController.deleteProduct);
router.put("/update", authMiddleware,StoreController.updateProduct);

module.exports = router;
